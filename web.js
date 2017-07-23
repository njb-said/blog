var express = require('express'),
    http = require('http'),
    fs = require('fs');

var walkdir = require('walkdir');

var _posts = global._posts = {};

var windows = process && process.platform == 'win32';
var postEmitter = walkdir('posts', {max_depth: 1});

postEmitter.on('file', function(file, stat) {
    var str = file.split(windows ? '\\posts\\' : '/posts/')[1].split('.')[0];
    var json = JSON.parse(fs.readFileSync(windows ? ('posts\\meta\\' + str + '.json') : ('posts/meta/' + str[1] + '.json'), 'utf8'));
    var content = fs.readFileSync(file, 'utf8');
    json.date = new Date(json.date);
    json.content = content;
    _posts[str] = json;
});

postEmitter.on('end', function() {
    var total = Object.keys(_posts).length;
    console.log('Loaded ' + total + ' blog post' + (total == 1 ? '' : 's'));

    var app = module.exports = express();

    app.use('/assets', express.static('public'));

    app.set('view cache');
    app.set('etag', false);
    app.set('port', (process.env.PORT || 3000));
    app.set('view engine', 'html');
    app.set('layout', 'layout');
    app.set('partials', {header: 'partials/header', footer: 'partials/footer'});
    app.engine('html', require('hogan-express'));

    app.use(function(req, res, next) {
        res.locals.system = {
            // The system-wide title of your blog
            title: 'Crazy Man Ramblings',
            year: new Date().getFullYear(),
            // Your google analytics code
            analyticsCode: false
        };

        return next();
    });

    app.use('/', require('./routes'));

    var appServer = app.listen(app.get('port'), function() {
        console.log('Express server listening on port ' + app.get('port'));
    });

    appServer.setTimeout(5000);
});
