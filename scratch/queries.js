'use strict';

const mongoose = require('mongoose');
// mongoose.Promise = global.Promise;
const { MONGODB_URI } = require('../config');

const Note = require('../models/note');

//GET ALL NOTES

// mongoose.connect(MONGODB_URI)
//   .then(() => {
//     const searchTerm = 'lady gaga';
//     let filter = {};
//     // console.log(MONGODB_URI);
//     if (searchTerm) {
//       const re = new RegExp(searchTerm, 'i');
//       filter.title = { $regex: re };
//     }

//     return Note.find(filter)
//       .sort('created')
//       .then(results => {
//         console.log(results);
//       })
//       .catch(console.error);
//   })
//   .then(() => {
//     return mongoose.disconnect()
//       .then(() => {
//         console.info('Disconnected');
//       });
//   })
//   .catch(err => {
//     console.error(`ERROR: ${err.message}`);
//     console.error(err);
//   });

//GET SINGLE NOTE

  // mongoose.connect(MONGODB_URI)
//   .then(() => {

//     const id = '000000000000000000000007';
//     return Note.findById(id)
//       .then(results => {
//         console.log(results);
//       })
//       .catch(console.error);
//   })
//   .then(() => {
//     return mongoose.disconnect()
//       .then(() => {
//         console.info('Disconnected');
//       });
//   })
//   .catch(err => {
//     console.error(`ERROR: ${err.message}`);
//     console.error(err);
//   });


//POST/CREATE NEW NOTE

//   mongoose.connect(MONGODB_URI)
//   .then(() => {

//     const newNote = {
//       title: 'Test',
//       content: 'Note'
//     };
//     return Note.create(newNote)
//       .then(results => {
//         console.log(results);
//       })
//       .catch(console.error);
//   })
//   .then(() => {
//     return mongoose.disconnect()
//       .then(() => {
//         console.info('Disconnected');
//       });
//   })
//   .catch(err => {
//     console.error(`ERROR: ${err.message}`);
//     console.error(err);
//   });

//PUT/UPDATE NOTE

//   mongoose.connect(MONGODB_URI)
//   .then(() => {

//     const id = "5ab1668ed7d5a80befb555ce";
//     const updateNote = {
//       title: 'Updated',
//       content: 'Updated'
//     };
//     return Note.findByIdAndUpdate(id, updateNote)
//       .then(results => {
//         console.log(results);
//       })
//       .catch(console.error);
//   })
//   .then(() => {
//     return mongoose.disconnect()
//       .then(() => {
//         console.info('Disconnected');
//       });
//   })
//   .catch(err => {
//     console.error(`ERROR: ${err.message}`);
//     console.error(err);
//   });


//DELETE NOTE

//   mongoose.connect(MONGODB_URI)
//   .then(() => {

//     const id = "5ab1668ed7d5a80befb555ce";
    
//     return Note.findByIdAndRemove(id)
//       .then(results => {
//         console.log(results);
//       })
//       .catch(console.error);
//   })
//   .then(() => {
//     return mongoose.disconnect()
//       .then(() => {
//         console.info('Disconnected');
//       });
//   })
//   .catch(err => {
//     console.error(`ERROR: ${err.message}`);
//     console.error(err);
//   });