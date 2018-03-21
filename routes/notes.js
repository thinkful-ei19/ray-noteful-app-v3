'use strict';

const express = require('express');
const mongoose = require('mongoose');
const Note = require('../models/note');

// Create an router instance (aka "mini-app")
const router = express.Router();

/* ========== GET/READ ALL ITEM ========== */
router.get('/notes', (req, res, next) => {
    const searchTerm = req.query.searchTerm;
    let filter = {};
    // console.log(MONGODB_URI);
    if (searchTerm) {
      const re = new RegExp(searchTerm, 'i');
      filter.title = { $regex: re };
    }

    return Note.find(filter)
      .sort('created')
      .then(results => {
        res.json(results);
      })
      .catch(err => {
        res.json(err);
      });
  });
  
  // .catch(err => {
  //   console.error(`ERROR: ${err.message}`);
  //   console.error(err);
  // });
  // console.log('Get All Notes');
  // res.json([
  //   { id: 1, title: 'Temp 1' }, 
  //   { id: 2, title: 'Temp 2' }, 
  //   { id: 3, title: 'Temp 3' }
  // ]);



/* ========== GET/READ A SINGLE ITEM ========== */
router.get('/notes/:id', (req, res, next) => {
  const id = req.params.id;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    const err = new Error('The `id` is not valid');
    err.status = 400;
    return next(err);
  }

  return Note.findById(id)
    .then(results => {
      res.json(results);
    })
    .catch(err => {
      res.json(err);
    });
});

/* ========== POST/CREATE AN ITEM ========== */
router.post('/notes', (req, res, next) => {
  const {title, content, id} = req.body;
  
  if(!title) {
    const err = new Error('Missing `title` in request body');
    err.status = 400;
    return next(err);
  }
  
  const newNote = {
    title: title,
    content: content,
    id: id
  };

  return Note.create(newNote)
    .then(results => {
      res.location(`/api/notes/${id}`).status(201).json(results);
    })
    .catch(err => {
      res.json(err);
    });
  // console.log('Create a Note');
  // res.location(`/api/notes/${id}`).status(201).json();

});

/* ========== PUT/UPDATE A SINGLE ITEM ========== */
router.put('/notes/:id', (req, res, next) => {
  const id = req.params.id;
  const {title, content} = req.body;

  if(!title) {
    const err = new Error('Missing `title` in request body');
    err.status = 400;
    return next(err);
  }
  
  if (!mongoose.Types.ObjectId.isValid(id)) {
    const err = new Error('The `id` is not valid');
    err.status = 400;
    return next(err);
  }

  const updateNote = {
    title: title,
    content: content
  };

  const option = {new: true};
  
  return Note.findByIdAndUpdate(id, updateNote, option)
    .then(results => {
      res.json(results);
    })
    .catch(err => {
      res.json(err);
    });

  // console.log('Update a Note');
  // res.json({ id: 2 });

});

/* ========== DELETE/REMOVE A SINGLE ITEM ========== */
router.delete('/notes/:id', (req, res, next) => {
  const id = req.params.id;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    const err = new Error('The `id` is not valid');
    err.status = 404;
    return next(err);
  }

  return Note.findByIdAndRemove(id)
    .then(() => {
      res.status(204).end();
    })
    .catch(err => {
      res.json(err);
    });

  // console.log('Delete a Note');
  // res.status(204).end();

});

module.exports = router;