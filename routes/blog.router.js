const express = require('express');
const { BlogModel } = require('../model/blog.model');
const { auth } = require('../middleware/auth.middleware');

const BlogRouter = express.Router();

BlogRouter.get('/api/blogs', auth, async (req, res) => {
    try {
        const blogs = await BlogModel.find({ username: req.body.name }); 

        res.status(200).send({ blogs });

    } catch (error) {

        res.status(500).send({ error: error.message });

    }
});


BlogRouter.get('/api/blogs?title="Present', auth, async (req, res) => {
    try {
        const { title } = req.query;

        const blogs = await BlogModel.find({ username: req.body.name, title: { $regex: title, $options: 'i' } });

        res.status(200).send({ blogs });

    } catch (error) {

        res.status(500).send({ error: error.message });
    }
});


BlogRouter.get('/api/blogs?category=tech', auth, async (req, res) => {
    try {
        const { category } = req.query;


        const blogs = await BlogModel.find({ username: req.body.name, category });

        res.status(200).send({ blogs });
    } catch (error) {


        res.status(500).send({ error: error.message });
    }
});


BlogRouter.get('/api/blogs?sort=date&order=asc', auth, async (req, res) => {


    try {
        const { order } = req.query;

        const sortDirection = order === 'asc' ? 1 : -1;

        const blogs = await BlogModel.find({ username: req.body.name }).sort({ date: sortDirection });

        res.status(200).send({ blogs });

    } catch (error) {

        res.status(500).send({ error: error.message });
    }
});


BlogRouter.post('/api/blogs', auth, async (req, res) => {

    try {
        const { title, content, category } = req.body;

  
        const newBlog = new BlogModel({

            username: req.body.name,
            title,
            content,
            category,
            date: new Date(),
            likes: 0,
            comments: [],

        });

        await newBlog.save();

        res.status(201).send({ msg: 'Blog created successfully', blog: newBlog });

    } catch (error) {

        res.status(500).send({ error: error.message });
    }
    });


BlogRouter.put('/api/blogs/:id', auth, async (req, res) => {
    try {
        const { id } = req.params;

        const { title, content, category } = req.body;


        const editedBlog = await BlogModel.findOneAndUpdate(

            { _id: id, username: req.body.name },

            { $set: { title, content, category } },

            { new: true }

        );

        if (!editedBlog) {
            return res.status(404).send({ msg: 'Blog not found or unauthorized to edit' });
        }

        res.status(200).send({ msg: 'Blog edited successfully', blog: editedBlog });
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

BlogRouter.delete('/api/blogs/:id', auth, async (req, res) => {
    try {
        const { id } = req.params;

      
        const deletedBlog = await BlogModel.findOneAndDelete({ _id: id, username: req.body.name });

        if (!deletedBlog) {
            return res.status(404).send({ msg: 'Blog not found or unauthorized to delete' });
        }

        res.status(200).send({ msg: 'Blog deleted successfully', blog: deletedBlog });
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});


BlogRouter.put('/api/blogs/:id/like', auth, async (req, res) => {
    try {
        const { id } = req.params;

        const likedBlog = await BlogModel.findOneAndUpdate(

            { _id: id },
            { $inc: { likes: 1 } },
            { new: true }
        );

        if (!likedBlog) {
            return res.status(404).send({ msg: 'Blog not found' });
        }

        res.status(200).send({ msg: 'Blog liked successfully', blog: likedBlog });


    } catch (error) {
        res.status(500).send({ error: error.message });



    }
});


BlogRouter.put('/api/blogs/:id/comment', auth, async (req, res) => {
    try {
        const { id } = req.params;


        const { username, content } = req.body;

       
        const commentedBlog = await BlogModel.findOneAndUpdate(
            { _id: id },


            { $push: { comments: { username, content } } },


            { new: true }

        );

        if (!commentedBlog) {


            return res.status(404).send({ msg: 'Blog not found' });
        }

        res.status(200).send({ msg: 'Comment added successfully', blog: commentedBlog });

        
    } catch (error) {

        
        res.status(500).send({ error: error.message });
    }
});

module.exports = {
    BlogRouter,
};  