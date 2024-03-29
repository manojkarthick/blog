# Blog [![Netlify Status](https://api.netlify.com/api/v1/badges/a4b6a59c-2645-4634-94cf-670d4d0c9b37/deploy-status)](https://app.netlify.com/sites/manojkarthick/deploys)

This repo contains the source code for my personal blog. You can view it [here](https://www.manojkarthick.com/).
Built with [11ty](https://11ty.dev) and hosted on [Netlify](https://www.netlify.com).

### Building this site

1. Clone this repository to your local machine: `git clone git@github.com:manojkarthick/blog.git`
2. Install nodejs v12.18.3. Follow the instructions [here](https://github.com/nvm-sh/nvm#usage) to install a specific version using [fnm](https://github.com/Schniz/fnm)
3. Install dependencies for this project: `npm install`
4. Run the following command to build the site: `npm run build`
5. Serve the site on a local webserver: `npm run serve`
6. Open `http://localhost:8080` to view the home page


### Deployment

1. Install the Netlify CLI
    - You can install it globally using npm: `npm install -g netlify-cli`
    - If you prefer to use `nix`, you can install by running: `nix-env -iA netlify-cli`
2. Logon to Netlify using `netlify login`. This will also create an access token if you don't have one already
3. Run `netlify dev` to see if the website builds properly on your local machine
4. Run `netlify deploy` to manually deploy the site from the CLI.
5. Follow the steps listed [here](https://docs.netlify.com/cli/get-started/#manual-setup) if you want to set up automatic deployments on `git push`

### TODO

* [ ] Search engine optimization
* [ ] Minify Javascript
* [ ] Add social media sharing configuration
* [x] Dark Mode
* [x] Improve a11y
* [ ] Non-overlapping tap targets
* [x] Center align images
* [x] Different link colors
* [x] Previous/Next articles aligned on either side
* [x] Previous/Next articles with left/right arrows
* [x] Images/Icons/SVG for Twitter, Github, LinkedIn links
* [ ] ~~Space between underline~~
* [ ] ~~Night mode button~~

### Archive

To access the old version of this blog, please visit [manojkarthick.github.io](https://manojkarthick.github.io/).

