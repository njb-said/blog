var express = require('express');
var router = express.Router();

var marked = require('marked');
var moment = require('moment');
var cacheTime = ((process.env.CACHE_HOURS || 24) * (60 * 60));

var sortedPosts = Object.keys(_posts);

sortedPosts = sortedPosts.map(function(i) {
    var obj = _posts[i];
    obj.rawContent = obj.content;
    obj.content = marked(obj.content, {breaks: true, sanitize: true});

    var past = new Date();
    past.setDate(past.getDate() - 7);
    obj.date = new Date(obj.date);
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

/* global _posts */
router.get('/:slug', function(req, res, next) {
    var slug = req.params.slug;
    slug = slug.replace(/[^A-Za-z0-9-_]/gi, '');

    if(slug) {
        if(_posts.hasOwnProperty(slug)) {
            var post = _posts[slug];

            res.setHeader('Cache-Control', 'public, max-age: ' + cacheTime);
            return res.render('post', {title: post.name, post: post});
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
