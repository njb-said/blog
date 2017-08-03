# blog [![Build Status](https://travis-ci.org/njb-said/blog.svg?branch=master)](https://travis-ci.org/njb-said/blog) [![Known Vulnerabilities](https://snyk.io/test/github/njb-said/blog/badge.svg)](https://snyk.io/test/github/njb-said/blog)

This repository contains the server that powers my blog, as well as all the posts. I can't promise I'll blog often or be remotely interesting, but if you find it somewhat interesting that's fine with me!

Builds are run on [Travis CI](https://travis-ci.org/njb-said/blog) for eslint compatibility and [snyk](https://snyk.io) is used for package security checks.

## Posts

So all the posts are stored in the `posts` directory and are markdown files.  
These are parsed at runtime with the [marked](https://npm.im/marked) library and have a browser cache time of 1 day by default. This can be overridden using the environment variable `CACHE_HOURS`.  
The homepage shows a list of blog posts, sorted by their date.  
Meta data about posts are in the `posts/meta` directory and are JSON files, these can have the following attributes:

- `title` The title of the post
- `date` The date of the post (in [ISO format](https://en.wikipedia.org/wiki/ISO_8601), you can find the date + time using `new Date().toISOString()` in a javascript console)
- `author` The name of the person who wrote this post (optional)

You can generate a meta file using the `/new_post` page. This also has a markdown editor ([SimpleMDE](https://npm.im/simplemde)), you can also generate a slug for your post there too.

You can see examples posts in [here](https://github.com/njb-said/blog/tree/master/posts).

## Backend

The actual server is written in node.js running a simple [express](https://npm.im/express) app, which in my setup is fronted by [Varnish](http://varnish-cache.org) for caching and then [CloudFlare](https://cloudflare.com) for global distribution.


## Analytics

For analytics I decided to just use Google Analytics, I didn't think it was worth introducing any other complexity or dependencies for now.
