/*
*
*
*       Complete the API routing below
*       
*       
*/

'use strict';

var expect = require('chai').expect;
const mongoose = require('mongoose');
const db = mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true });

const Schema = mongoose.Schema;
const BookSchema = new Schema({
  title: String,
  comments: [String]
});

const Book = mongoose.model('Books', BookSchema);

module.exports = function (app) {

  app.route('/api/books')
    .get((req, res) => {
      //response will be array of book objects
      const library = Book.find({}, (err, data) => {
        res.send(data.map((book) => ({
          _id: book._id,
          title: book.title,
          commentCount: book.comments.length
        })));
      });
    })
    
    .post((req, res) => {
      //response will contain new book object including atleast _id and title
      const title = req.body.title;
      const newBook = new Book({
        title: title,
        comments: []
      });
      newBook.save((err, data) => {
        if (err) {
          console.log('Error saving book ', err);
        }
        res.send({title: title, _id: newBook._id});
      });
    })
    
    .delete((req, res) => {
      //if successful response will be 'complete delete successful'
      Book.deleteMany({}, (err) => {
        if (err) {
          console.log('Error deleting library contents ', err);
        } else {
          res.send('complete delete successful');
        }
      });
    });



  app.route('/api/books/:id')
    .get((req, res) => {
      const bookid = req.params.id;
      Book.findOne({_id: bookid}, (err, data) => {
        if (err) {
          console.log('Error finding book ', err);
        }
        if (data !== undefined) {
          res.send({_id: bookid, title: data.title, comments: data.comments});
        } else {
          res.send('no book with this id exists');
        }
      });
      
    })
    
    .post((req, res) => {
      const bookid = req.params.id;
      const comment = req.body.comment;
      Book.findOne({_id: bookid}, (err, data) => {
        data.comments.push(comment);
        data.save((err) => {
          if (err) {
            console.log('Error saving comment ', err);
          }
        });
        res.send({_id: bookid, title: data.title, comments: data.comments});
      });
    })
    
    .delete((req, res) => {
      const bookid = req.params.id;
      Book.deleteOne({_id: bookid}, (err) => {
        if (err) {
          console.log('Error deleting book ', err);
        }
      });
      res.send('delete successful');
    });
  
};
