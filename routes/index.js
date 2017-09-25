var express = require('express');
var router = express.Router();

var marked = require('marked');
var htt = require('html-to-text');
var moment = require('moment');
var cacheTime = ((process.env.CACHE_HOURS || 24) * (60 * 60));

var sortedPosts = Object.keys(_posts);

sortedPosts = sortedPosts.map(function(i) {
    var obj = _posts[i];
    obj.rawContent = obj.content;
    obj.content = marked(obj.content, {breaks: true, sanitize: true});
    obj.snippet = obj.content.length > 512 ? obj.content.substring(0, 512) + '&hellip;' : obj.content;
    obj.socialSnippet = htt.fromString(obj.content, {wordwrap: null, ignoreHref: true, ignoreImage: true, preserveNewlines: false}).replace(/(\r\n|\n|\r)/gm, ' ');
    obj.socialSnippet = obj.socialSnippet.length > 256 ? obj.socialSnippet.substring(0, 256) + '...' : obj.socialSnippet;
    obj.isTruncated = obj.content.length > 512;
    obj.skip = obj.index == false && typeof obj.index != 'undefined';

    var past = new Date();
    past.setDate(past.getDate() - 7);
    obj.date = new Date(obj.date);
    obj.jsonDate = obj.date.toISOString();
    obj.dateString = past <= obj.date ? moment(obj.date).fromNow() : 'on ' + moment(obj.date).format('Do MMMM YY, hA');

    obj.slug = i;
    return obj;
});

sortedPosts.sort(function(a, b) {
    return b.date - a.date;
});

router.get('/', function(req, res, next) {
    return res.render('index', {posts: sortedPosts});
});

router.get('/new_post', function(req, res, next) {
    return res.render('new_post', {title: 'Create a post', editor: true});
});

/* global _posts */
router.get('/:slug', function(req, res, next) {
    var slug = req.params.slug;
    slug = slug.replace(/[^A-Za-z0-9-_]/gi, '');

    if(slug) {
        if(_posts.hasOwnProperty(slug)) {
            var post = _posts[slug];

            post.url = req.headers['host'] + '/' + slug;
            res.setHeader('Cache-Control', 'public, max-age: ' + cacheTime);
            return res.render('post', {title: post.title, post: post});
        } else {
            return res.status(404).render('error', {title: 'Not Found'});
        }
    } else {
        return next();
    }
});

router.get('*', function(req, res, next) {
    res.status(404).render('error', {title: 'Not Found'});
});

module.exports = router;
