'use strict';

const express = require('express');
const mongoose = require('mongoose');
const Note = require('../models/note');

// Create an router instance (aka "mini-app")
const router = express.Router();

/* ========== GET/READ ALL ITEM ========== */
router.get('/notes', (req, res, next) => {
  
  console.log('Get All Notes');
  res.json([
    { id: 1, title: 'Temp 1' }, 
    { id: 2, title: 'Temp 2' }, 
    { id: 3, title: 'Temp 3' }
  ]);

});

/* ========== GET/READ A SINGLE ITEM ========== */
router.get('/notes/:id', (req, res, next) => {

  console.log('Get a Note');
  res.json({ id: 2 });

});

/* ========== POST/CREATE AN ITEM ========== */
router.post('/notes', (req, res, next) => {

  console.log('Create a Note');
  res.location('path/to/new/document').status(201).json({ id: 2 });

});

/* ========== PUT/UPDATE A SINGLE ITEM ========== */
router.put('/notes/:id', (req, res, next) => {

  console.log('Update a Note');
  res.json({ id: 2 });

});

/* ========== DELETE/REMOVE A SINGLE ITEM ========== */
router.delete('/notes/:id', (req, res, next) => {

  console.log('Delete a Note');
  res.status(204).end();

});

module.exports = router;