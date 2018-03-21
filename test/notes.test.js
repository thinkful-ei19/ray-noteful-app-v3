'use strict';

const app = require('../server');
const chai = require('chai');
const chaiHttp = require('chai-http');
const mongoose = require('mongoose');

const { TEST_MONGODB_URI } = require('../config');

const Note = require('../models/note');
const seedNotes = require('../db/seed/notes');

const expect = chai.expect;


describe('Noteful API Notes', function () {
    before(function () {
      return mongoose.connect(TEST_MONGODB_URI);
    });
    
    beforeEach(function () {
      return Note.insertMany(seedNotes)
        .then(() => Note.createIndexes());
    });
    
    afterEach(function () {
      return mongoose.connection.db.dropDatabase();
    });
    
    after(function () {
      return mongoose.disconnect();
    });

    
    describe('GET /api/notes', function() {
      it('should return the correct number of Notes', function() {
        // 1) Call the database and the API
        const dbPromise = Note.find();
        const apiPromise = chai.request(app).get('/api/notes');
        // 2) Wait for both promises to resolve using `Promis.all`
        return Promise.all([dbPromise, apiPromise])
        // 3) **then** compare database results to API response
          .then(([data, res]) => {
            expect(res).to.have.status(200);
            expect(res).to.be.json;
            expect(res.body).to.be.a('array');
            expect(res.body).to.have.length(data.length);
          });
      });

      it('should return a list with the correct right fields', function () {
        const dbPromise = Note.find();
        const apiPromise = chai.request(app).get('/api/notes');
  
        return Promise.all([dbPromise, apiPromise])
          .then(([data, res]) => {
            expect(res).to.have.status(200);
            expect(res).to.be.json;
            expect(res.body).to.be.a('array');
            expect(res.body).to.have.length(data.length);
            res.body.forEach(function (item) {
              expect(item).to.be.a('object');
              expect(item).to.have.keys('id', 'title', 'content', 'created');
            });
          });
      });
  
      it('should return correct search results for a searchTerm query', function () {
        const term = 'gaga';
        const dbPromise = Note.find(
          { $text: { $search: term } },
          { score: { $meta: 'textScore' } })
          .sort({ score: { $meta: 'textScore' } });
        const apiPromise = chai.request(app).get(`/api/notes?searchTerm=${term}`);
  
        return Promise.all([dbPromise, apiPromise])
          .then(([data, res]) => {
            expect(res).to.have.status(200);
            expect(res).to.be.json;
            expect(res.body).to.be.a('array');
            expect(res.body).to.have.length(1);
            expect(res.body[0]).to.be.an('object');
            expect(res.body[0].id).to.equal(data[0].id);
          });
      });
  
      it('should return an empty array for an incorrect query', function () {
        const dbPromise = Note.find({ title: { $regex: /NotValid/i } });
        const apiPromise = chai.request(app).get('/api/notes?searchTerm=NotValid');
  
        return Promise.all([dbPromise, apiPromise])
          .then(([data, res]) => {
            expect(res).to.have.status(200);
            expect(res).to.be.json;
            expect(res.body).to.be.a('array');
            expect(res.body).to.have.length(data.length);
          });
      });  
    });


    describe('GET /api/notes/:id', function() {
      it('should return the correct note by id', function() {
        let data;
        return Note.findOne().select('id title content')
          .then(_data => {
            data = _data;
            return chai.request(app).get(`/api/notes/${data.id}`);
          })
          .then((res) => {
            expect(res).to.have.status(200);
            expect(res).to.be.json;
            expect(res.body).to.be.an('object');
            expect(res.body).to.have.keys('created', 'id', 'title', 'content');
            expect(res.body.id).to.equal(data.id);
            expect(res.body.title).to.equal(data.title);
            expect(res.body.content).to.equal(data.content);
          });
      });

      it('respond with 400 error for improperly formatted id', function() {
        const badId = '12345678';
        return chai.request(app)
          .get(`/api/notes/${badId}`)
          .catch(err => err.response)
          .then(res => {
            expect(res).to.have.status(400);
            expect(res.body.message).to.equal('The `id` is not valid');
          });
      });

      it('respond with 404 error for invalid id', function () {
        return chai.request(app)
          .get('/api/notes/COUNTRYBUMPKIN')
          .catch(err => err.response)
          .catch(res => {
            expect(res).to.have.status(404);
          });
      });
    });


    describe('POST note', function() {
      it('should create a new note', function() {
        const newNote = {
          title: 'Test Title',
          content: 'Test Content',
        };
        let body;
        return chai.request(app)
          .post('/api/notes')
          .send(newNote)
          .then(function(res) {
            body = res.body;
            expect(res).to.have.status(201);
            expect(res).to.be.json;
            expect(res).to.have.header('location');
            expect(res.body).to.be.a('object');
            expect(res.body).to.include.keys('id', 'title', 'content');
            expect(res.body.title).to.equal(newNote.title);
            expect(res.body.content).to.equal(newNote.content);
            return Note.findById(body.id);
          })
          .then(data => {
            expect(body.title).to.equal(data.title);
            expect(body.content).to.equal(data.content);
          });
      });

      it('should return an error when missing "title" field', function () {
        const newItem = {
          'foo': 'bar'
        };
        return chai.request(app)
          .post('/api/notes')
          .send(newItem)
          .catch(err => err.response)
          .then(res => {
            expect(res).to.have.status(400);
            expect(res).to.be.json;
            expect(res.body).to.be.a('object');
            expect(res.body.message).to.equal('Missing `title` in request body');
          });
      });
    });

    describe('PUT note', function() {
      it('should update a note', function() {
        const updateNote = {
          title: 'Update test title',
          content: 'Update test content'
        };
        let data;
        return Note.findOne().select('id title content')
          .then(_data => {
            data = _data;
            return chai.request(app)
              .put(`/api/notes/${data.id}`)
              .send(updateNote);
          })
          .then(function(res) {
            expect(res).to.have.status(200);
            expect(res).to.be.json;
            expect(res.body).to.be.a('object');
            expect(res.body).to.include.keys('id', 'title', 'content');
            expect(res.body.id).to.equal(data.id);
            expect(res.body.title).to.equal(updateNote.title);
            expect(res.body.content).to.equal(updateNote.content);
          });
      });

      it('should respond with a 400 for improperly formatted id', function () {
        const updateNote = {
          'title': 'test',
          'content': 'test'
        };
        const badId = '99-99-99';
  
        return chai.request(app)
          .put(`/api/notes/${badId}`)
          .send(updateNote)
          .catch(err => err.response)
          .then(res => {
            expect(res).to.have.status(400);
            expect(res.body.message).to.eq('The `id` is not valid');
          });
      });
  
      it('should return an error when missing "title" field', function () {
        const updateNote = {
          'foo': 'bar'
        };
  
        return chai.request(app)
          .put('/api/notes/9999')
          .send(updateNote)
          .catch(err => err.response)
          .then(res => {
            expect(res).to.have.status(400);
            expect(res).to.be.json;
            expect(res.body).to.be.a('object');
            expect(res.body.message).to.equal('Missing `title` in request body');
          });
      });
    });

    describe('DELETE /api/notes/:id', function() {
      it('should delete a note by id', function() {
        let data;
        return Note.findOne().select('id title content')
          .then(_data => {
            data = _data;
            return chai.request(app).delete(`/api/notes/${data.id}`);
          })
          .then(function(res) {
            expect(res).to.have.status(204);
          });
      });

      it('should respond with 404 error for an invalid id', function() {
        return chai.request(app)
          .delete('/api/notes/RRRRRRRRR')
          .catch(err => err.response)
          .then(res => {
            expect(res).to.have.status(404);
          })
      });
    });
});
