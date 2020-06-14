const { Router } = require('express');
const router = Router();

const db = require('../../../lib/db_connection');
const { isArrayEmpty, isNumber, isString } = require('../../../lib/validation');

router.get('/', async(req, res) => {
    const posts = await db.query("SELECT * FROM posts WHERE deleted = 0");
    
    if(!isArrayEmpty(posts)) {
        res.status(200);
        res.json(posts);
    } else {
        res.status(404);
        res.json({ error: true, message: "Posts are empty"});
    }
});

router.get('/:id', async(req, res) => {
    const { id } = req.params;
    const post = await db.query("SELECT * FROM posts where postid = ?", id);

    if(!isArrayEmpty(post)) {
        res.status(200);
        res.json(psot);
    } else {
        res.status(404);
        res.json({ error: true, message: "Post not found or doesn't exists"});
    }
});

router.post("/", async(req, res) => {

    const { title, content, userid } = req.body;

    if(isString(title) && isString(content) && isNumber(userid)) {
        const newPost = { title, content , userid };
        await db.query("INSERT INTO posts ?", newPost, function(err, result) {
            if(err) {
                res.status(400);
                res.json({ error: true, message: err});
            }

            res.status(200);
            res.json({ id: result.insertId });
        })
    } else {
        res.status(400);
        res.json({ error: true, message: "invalid JSON"});
    }

});

router.delete("/", async(req, res) => {
    const { postid } = req.body;

    if(isNumber(postid)) {
        await db.query("UPDATE posts SET deleted = 1 WHERE postid = ?", postid )
                .then(result => { 
                    res.status(200); 
                    res.json({ success: true, postid: result.insertId, message: "Post deleted successfuly"})
                })
                .catch(err => {
                    res.status(400);
                    res.json({ error: true, message: err});
                });
    } else {
        res.status(400);
        res.json({ error: true, message: "postid not found or is not a number"});
    }
});

module.exports = router;