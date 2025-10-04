# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a personal blog built with [11ty (Eleventy)](https://11ty.dev) static site generator and hosted on Netlify. The blog features posts, quizzes, and short content pieces with support for syntax highlighting, RSS feeds, and social media metadata generation.

## Development Commands

- `npm run build` - Build the static site
- `npm run serve` or `npm start` - Serve the site locally on http://localhost:8080
- `npm run watch` - Build and watch for changes
- `npm run debug` - Run eleventy with debug output
- `npm run clean` - Remove the _site output directory
- `npm run cards` - Generate social media cards (runs ./src/scripts/cards.sh)

## Architecture

### Core Configuration
- `.eleventy.js` - Main Eleventy configuration file containing:
  - Plugin setup (RSS, syntax highlighting, navigation, metagen)
  - Custom filters for dates, permalinks, CSS minification
  - Custom collections for content organization
  - GitHub repository information fetcher
  - Markdown configuration with anchor links
  - BrowserSync setup with 404 handling

### Directory Structure
- `src/` - Source directory (input)
  - `src/posts/` - Blog posts (Markdown files)
  - `src/quizzes/` - Quiz content
  - `src/shorts/` - Short-form content
  - `src/_includes/` - Eleventy includes and layouts
    - `src/_includes/layouts/` - Page layouts
    - `src/_includes/css/` - CSS includes
  - `src/_data/` - Global data files
  - `src/img/` - Static images (passed through to output)
  - `src/css/` - CSS files (passed through to output)
  - `src/js/` - JavaScript files (passed through to output)
- `_site/` - Generated output directory
- `netlify/functions/` - Netlify serverless functions
  - `scheduled-deploy.js` - Automated deployment function

### Content Organization
- All content files (posts, quizzes, shorts) are collected into a unified "content" collection
- Posts use permalink structure: `{year}/{month}/{slug}/`
- Support for tags and navigation
- Automatic excerpt generation from content

### Key Features
- **GitHub Integration**: Fetches repository information via GitHub API (requires GITHUB_TOKEN environment variable)
- **Social Media**: Automated meta tag generation for social platforms
- **Performance**: CSS minification and asset optimization
- **SEO**: Sitemap generation and proper meta tags
- **Dark Mode**: Supported (noted in README TODO as completed)

### Template Engines
- Markdown files use Liquid template engine
- HTML files use Nunjucks template engine
- Data files use Nunjucks template engine

## Environment Variables
- `GITHUB_TOKEN` - Required for fetching GitHub repository information in posts

## Deployment
The site is deployed on Netlify with:
- Automatic deployments on git push
- Scheduled deployments via Netlify function
- Manual deployment support via Netlify CLI