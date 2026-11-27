const express = require('express');
const Database = require('../db/database');
const PostRepo = require('../repositories/postRepo');
const CommentRepo = require('../repositories/commentRepo');
const {requireLogin} = require('../middleware/auth');

const router = express.Router();
const db = Database.getInstance();
const posts = new PostRepo(db);
const comments = new CommentRepo(db);

router.get('/', async (req, res) =>{ //Getting all posts data from db and displaying on home page
    const allPosts = await posts.findAll();
    res.render('index', {
        title: 'Home',
        posts: allPosts
    });
});


router.get('/posts/new', requireLogin, (req, res) =>{ //displays new post form
    res.render('new-post', {
        title: 'New Post',
        error: null,
        postTitle: '',
        body: ''
    });
});

router.post('/posts', requireLogin, async (req, res) => { //creating a post
    const {title, body} = req.body;

    let error = null;
    if (!title || title.length > 100) error = 'Title must be 1-100 characters';
    else if (!body || body.length > 5000) error = 'Body must be under 1-5,000 characters';

    if (error) {
        return res.status(400).render('new-post', {
            title: 'New Post', error, postTitle: title, body
        });
    }

    const result = await posts.create(req.session.user.id, title, body);
    res.redirect(`/posts/${result.lastID}`);
});

router.get('/posts/:id', async (req, res) => {// gets a post and its comments
    const post = await posts.findById(req.params.id);
    if(!post) {
        return res.status(404).send('Post not found');
    }
    const postComments = await comments.findByPost(post.id);
    res.render('post', {title: post.title, post, comments: postComments });
});

router.post('/posts/:id/delete', requireLogin, async (req, res) => { //user can delete their own post 
    const post = await posts.findById(req.params.id);
    if(!post){
        return res.status(404).send('Post not found');
    }
    if(post.user_id !== req.session.user.id) { //checks session user with post owner to see if it can be deleted
        return res.status(403).send('You can only delete posts you created')
    }
    await posts.delete(post.id);
    res.redirect('/');
});

router.post('/posts/:id/comments', requireLogin, async (req, res) => { //adding a comment to a post
    const post = await posts.findById(req.params.id);
    const text = req.body.body;
    if(!post){
        return res.status(404).send('Post not found');
    }

    if(!text || text.length > 1000){
        return res.redirect(`/posts/${post.id}`);
    }
    await comments.create(post.id, req.session.user.id, text);
    res.redirect(`/posts/${post.id}`);
});

router.get('/search', async (req, res) => { //search posts by given keyword
    const q = (req.query.q || '').trim();

    if(q.length > 100) {
        return res.status(400).render('search', {
            title: 'search', q, results: [], error: 'keyword must be 100 characters or less'
        });
    }

    const results = q ? await posts.search(q) : [];
    res.render('search', {title: `results for ${q}`, q, results, error:null});
});

module.exports = router;
