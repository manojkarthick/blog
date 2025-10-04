const {DateTime} = require("luxon");
const fs = require("fs");
const pluginRss = require("@11ty/eleventy-plugin-rss");
const pluginSyntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");
const pluginNavigation = require("@11ty/eleventy-navigation");
const markdownIt = require("markdown-it");
const markdownItAnchor = require("markdown-it-anchor");
const CleanCSS = require("clean-css");
const axios = require("axios");
const metagen = require("eleventy-plugin-metagen");

// Create markdown library instance to use in excerpt filter
const markdownLibrary = markdownIt({
  html: true,
  breaks: true,
  linkify: true
}).use(markdownItAnchor, {
  permalink: true,
  permalinkClass: "direct-link",
  permalinkSymbol: "#"
});

module.exports = function (eleventyConfig) {
  eleventyConfig.addPlugin(pluginRss);
  eleventyConfig.addPlugin(pluginSyntaxHighlight);
  eleventyConfig.addPlugin(pluginNavigation);

  eleventyConfig.setDataDeepMerge(true);

  eleventyConfig.addAsyncFilter('excerpt', async (post) => {
    // Read the raw markdown content and render it completely
    const readData = await post.template.read();
    const markdownContent = readData?.content;

    if (!markdownContent) {
      return null;
    }

    // Render the entire markdown document so reference-style links work
    const fullRendered = markdownLibrary.render(markdownContent);

    let excerpt = null;
    const startMarker = '<!-- Excerpt Start -->';
    const endMarker = '<!-- Excerpt End -->';

    const startPosition = fullRendered.indexOf(startMarker);
    const endPosition = fullRendered.indexOf(endMarker);

    if (startPosition !== -1 && endPosition !== -1) {
      // Extract the rendered HTML excerpt
      excerpt = fullRendered.substring(startPosition + startMarker.length, endPosition).trim();
    } else {
      // Fallback: use first paragraph
      const match = fullRendered.match(/<p>(.*?)<\/p>/s);
      if (match) {
        excerpt = match[0];
      }
    }

    return excerpt;
  });

  eleventyConfig.addLayoutAlias("post", "layouts/post.njk");

  eleventyConfig.addFilter("readableDate", dateObj => {
    return DateTime.fromJSDate(dateObj, {zone: 'utc'}).toFormat("dd LLL yyyy");
  });

  // https://html.spec.whatwg.org/multipage/common-microsyntaxes.html#valid-date-string
  eleventyConfig.addFilter('htmlDateString', (dateObj) => {
    return DateTime.fromJSDate(dateObj, {zone: 'utc'}).toFormat('yyyy-LL-dd');
  });

  eleventyConfig.addFilter('htmlDateStringSlashed', (dateObj) => {
    return DateTime.fromJSDate(dateObj, {zone: 'utc'}).toFormat('yyyy/LL/dd');
  });

  eleventyConfig.addFilter("gen_permalink", page => {
    const yyyy = page.date.getFullYear();
    const mm = String(page.date.getMonth() + 1).padStart(2, "0");
    return `${yyyy}/${mm}/${page.fileSlug}/`;
  });

  eleventyConfig.addFilter("cssmin", function(code) {
    return new CleanCSS({}).minify(code).styles;
  });

  // Get the first `n` elements of a collection.
  eleventyConfig.addFilter("head", (array, n) => {
    if (n < 0) {
      return array.slice(n);
    }

    return array.slice(0, n);
  });

  eleventyConfig.addFilter("min", (...numbers) => {
    return Math.min.apply(null, numbers);
  });

  // add filter for fetching github repository information
  eleventyConfig.addAsyncFilter("githubInfo", async function(repository) {
    console.log(`Gathering information from the Github API for ${repository}`);
    const classPrefix = "github-info";
    const githubToken = process.env.GITHUB_TOKEN;
    let repoInfo = await getRepositoryInformation(repository, classPrefix, githubToken);
    if (repoInfo == "errored") {
      return repository;
    } else {
      return repoInfo;
    }
  });

  // add filter for fetching github user information
  eleventyConfig.addAsyncFilter("githubUserCard", async function(username) {
    console.log(`Gathering user information from the Github API for ${username}`);
    const githubToken = process.env.GITHUB_TOKEN;
    let userCard = await getUserInformation(username, githubToken);
    return userCard;
  });

  eleventyConfig.addCollection("tagList", function (collection) {
    let tagSet = new Set();
    collection.getAll().forEach(function (item) {
      if ("tags" in item.data) {
        let tags = item.data.tags;

        tags = tags.filter(function (item) {
          switch (item) {
            // this list should match the `filter` list in tags.njk
            case "all":
            case "nav":
            case "post":
            case "posts":
              return false;
          }

          return true;
        });

        for (const tag of tags) {
          tagSet.add(tag);
        }
      }
    });

    // returning an array in addCollection works in Eleventy 0.5.3
    return [...tagSet];
  });

  eleventyConfig.addCollection("content", function(collectionApi) {
    // Also accepts an array of globs!
    return collectionApi.getFilteredByGlob(["src/posts/*.md", "src/quizzes/*.md", "src/shorts/*.md"]);
  });

  eleventyConfig.addPassthroughCopy("src/img");
  eleventyConfig.addPassthroughCopy("src/css");
  eleventyConfig.addPassthroughCopy("src/js");

  // add shortcode for seting build date time
  eleventyConfig.addShortcode('buildDateTime', () => {
    return `${DateTime.utc().toFormat('MMMM dd, yyyy HH:mm')} UTC`;
  });

  /* Markdown Overrides */
  eleventyConfig.setLibrary("md", markdownLibrary);

  // Browsersync Overrides
  eleventyConfig.setBrowserSyncConfig({
    callbacks: {
      ready: function (err, browserSync) {
        const content_404 = fs.readFileSync('_site/404.html');

        browserSync.addMiddleware("*", (req, res) => {
          // Provides the 404 content without redirect.
          res.write(content_404);
          res.end();
        });
      },
    },
    ui: false,
    ghostMode: false
  });

  // plugin to generate meta tags for social media
  eleventyConfig.addPlugin(metagen);

  return {
    templateFormats: [
      "md",
      "njk",
      "html",
      "liquid"
    ],

    // If your site lives in a different subdirectory, change this.
    // Leading or trailing slashes are all normalized away, so don’t worry about those.

    // If you don’t have a subdirectory, use "" or "/" (they do the same thing)
    // This is only used for link URLs (it does not affect your file structure)
    // Best paired with the `url` filter: https://www.11ty.dev/docs/filters/url/

    // You can also pass this in on the command line using `--pathprefix`
    // pathPrefix: "/",

    markdownTemplateEngine: "liquid",
    htmlTemplateEngine: "njk",
    dataTemplateEngine: "njk",

    // These are all optional, defaults are shown:
    dir: {
      input: "src",
      includes: "_includes",
      data: "_data",
      output: "_site"
    }
  };
};

async function getRepositoryInformation(repository, classPrefix, githubToken) {
  const url = `https://api.github.com/repos/${repository}`;

  try {
    const response = await axios.get(url, {
      headers: {"Authorization": `token ${githubToken}`}
    });
    const data = response ? response.data : null;

    const details = `
    <div class="project-card">
      <div class="project-card-header">
        <a href="https://github.com/${repository}" class="project-card-title" target="_blank" rel="noopener">${data.name}</a>
      </div>
      <div class="project-card-body">
        ${data.description ? `<p class="project-card-description">${data.description}</p>` : ''}
        <div class="project-card-meta">
          ${data.language ? `<span class="project-card-language">${data.language}</span>` : ''}
          ${data.stargazers_count > 0 ? `<span class="project-card-stars">${data.stargazers_count}</span>` : ''}
        </div>
      </div>
    </div>
    `
    return details;
  } catch (err) {
    console.error("Unable to get repository information: ", err);
    return "errored";
  }
}

async function getUserInformation(username, githubToken) {
  const url = `https://api.github.com/users/${username}`;

  try {
    const response = await axios.get(url, {
      headers: {"Authorization": `token ${githubToken}`}
    });
    const data = response ? response.data : null;

    const card = `
    <div class="github-user-card" onclick="window.open('${data.html_url}', '_blank')">
      <div class="github-user-left">
        <div class="github-user-header">
          <img src="${data.avatar_url}" alt="${data.name}" class="github-user-avatar">
          <div class="github-user-info">
            <div class="github-user-name">${data.name}</div>
            <div class="github-user-username">@${data.login}</div>
            ${data.bio ? `<div class="github-user-bio">${data.bio}</div>` : ''}
          </div>
        </div>
      </div>
      <div class="github-user-stats">
        <div class="github-user-stat">
          <div class="github-user-stat-value">${data.public_repos}</div>
          <div class="github-user-stat-label">REPOS</div>
        </div>
        <div class="github-user-stat">
          <div class="github-user-stat-value">${data.public_gists}</div>
          <div class="github-user-stat-label">GISTS</div>
        </div>
        <div class="github-user-stat">
          <div class="github-user-stat-value">${data.followers}</div>
          <div class="github-user-stat-label">FOLLOWERS</div>
        </div>
      </div>
    </div>
    `
    return card;
  } catch (err) {
    console.error("Unable to get user information: ", err);
    return "";
  }
}
