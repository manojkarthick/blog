const {DateTime} = require("luxon");
const fs = require("fs");
const pluginRss = require("@11ty/eleventy-plugin-rss");
const pluginSyntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");
const pluginNavigation = require("@11ty/eleventy-navigation");
const markdownIt = require("markdown-it");
const markdownItAnchor = require("markdown-it-anchor");
const CleanCSS = require("clean-css");
const axios = require("axios");

module.exports = function (eleventyConfig) {
  eleventyConfig.addPlugin(pluginRss);
  eleventyConfig.addPlugin(pluginSyntaxHighlight);
  eleventyConfig.addPlugin(pluginNavigation);

  eleventyConfig.setDataDeepMerge(true);

  eleventyConfig.addShortcode('excerpt', article => extractExcerpt(article));

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
  eleventyConfig.addNunjucksAsyncFilter("githubInfo", async function(repository, callback) {
    console.log(`Gathering information from the Github API for ${repository}`);
    const classPrefix = "github-info";
    const githubToken = process.env.GITHUB_TOKEN;
    let repoInfo = await getRepositoryInformation(repository, classPrefix, githubToken);
    if (repoInfo == "errored") {
      callback(null, repository);
    } else {
      callback(null, repoInfo);
    }
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
  let markdownLibrary = markdownIt({
    html: true,
    breaks: true,
    linkify: true
  }).use(markdownItAnchor, {
    permalink: true,
    permalinkClass: "direct-link",
    permalinkSymbol: "#"
  });
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

function extractExcerpt(article) {
  if (!article.hasOwnProperty('templateContent')) {
    console.warn('Failed to extract excerpt: Document has no property "templateContent".');
    return null;
  }

  let excerpt = null;
  const content = article.templateContent;

  // The start and end separators to try and match to extract the excerpt
  const separatorsList = [
    {start: '<!-- Excerpt Start -->', end: '<!-- Excerpt End -->'},
    {start: '<p>', end: '</p>'}
  ];

  separatorsList.some(separators => {
    const startPosition = content.indexOf(separators.start);
    const endPosition = content.indexOf(separators.end);

    if (startPosition !== -1 && endPosition !== -1) {
      excerpt = content.substring(startPosition + separators.start.length, endPosition).trim();
      return true; // Exit out of array loop on first match
    }
  });

  return excerpt;
}

async function getRepositoryInformation(repository, classPrefix, githubToken) {
  const url = `https://api.github.com/repos/${repository}`;
  const response = await axios.get( url, { headers: {"Authorization": `Bearer ${githubToken}`}} );

  try {
    const data = response ? response.data : null;

    let language = "unknown";
    if (data.language) {
      language = data.language
    }
    let listItems = ""
    if (data.description) {
      listItems = listItems.concat(`<li class="${classPrefix}-description">${data.description}</li>`);
    }
    if (data.language) {
      language = data.language
      listItems = listItems.concat(`<li class="${classPrefix}-lang">Language:<span> ${data.language}</li>`);
    } else {
      listItems = listItems.concat(`<li class="${classPrefix}-lang">Language:<span> unknown</li>`);
    }
    if (data.stargazers_count > 0) {
      listItems = listItems.concat(`<li class="${classPrefix}-stars">Stars:<span> ${data.watchers} ⭐️</li>`);
    }
    const details = `
    <ul>
      <li><a href="https://github.com/${repository}" class="${classPrefix}-name" target="_blank">${data.name}</a>
        <ul>
        ${listItems}
        </ul>
      </li>
    </ul>
    `
    return details;
  } catch (err) {
    console.error("Unable to get repository information: ", err);
    return "errored";
  }
}
