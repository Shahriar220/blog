var express = require('express');
var router = express.Router();
var flash = require('connect-flash');
var mongo = require('mongodb');
const { post } = require('../app');
var db = require('monk')('localhost/bloog');

router.get('/add', function(req, res, next) {
    var categories = db.get('categories');
    categories.find({}, {}, function(err, categories) {
        res.render('addpost', {
            "title": "Add Post",
            "categories": categories
        });
    });
});
router.post('/add', function(req, res, next) {
    //get form values
    var title = req.body.title;
    var category = req.body.category;
    var body = req.body.body;
    var author = req.body.author;
    var date = new Date();

    if (req.files.mainimage) {
        var mainImageoriginalName = req.files.mainimage.originalName;
        var mainImageName = req.files.mainimage.name;
        var mainImageMime = req.files.mainimage.mimetype;
        var mainImagePath = req.files.mainimage.path;
        var mainImageExt = req.files.mainimage.extension;
        var mainImageSize = req.files.mainimage.size;
    } else {
        var mainImageName = 'noimage.png';
    }
    //form validation
    req.checkBody('title', 'title field is required').notEmpty();
    req.checkBody('body', 'Body filed is required');

    //check errors
    var errors = req.validationErrors();
    if (errors) {
        res.render('addpost', {
            'errors': errors,
            'title': title,
            'body': body
        });
    } else {
        var posts = db.get('posts');
        //submit
        post.insert({
            "title": title,
            "body": body,
            "category": category,
            "date": date,
            "author": author,
            "mainimage": mainimage
        }, function(err, post) {
            if (err) {
                res.send('issue submitting the post');
            } else {
                req.flash('success', 'post Submitted');
                res.location('/');
                res.redirect('/');
            }
        });
    }
});


module.exports = router;