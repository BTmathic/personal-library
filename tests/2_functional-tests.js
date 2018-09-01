/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       
*/

const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);
let testId;

suite('Functional Tests', () => {

  /*
  * ----[EXAMPLE TEST]----
  * Each test should completely test the response of the API end-point including response status code!
  */
  test('#example Test GET /api/books', (done) => {
     chai.request(server)
      .get('/api/books')
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.isArray(res.body, 'response should be an array');
        assert.property(res.body[0], 'commentCount', 'Books in array should contain commentCount');
        assert.property(res.body[0], 'title', 'Books in array should contain title');
        assert.property(res.body[0], '_id', 'Books in array should contain _id');
        done();
      });
  });
  /*
  * ----[END of EXAMPLE TEST]----
  */

  suite('Routing tests', () => {

    suite('POST /api/books with title => create book object/expect book object', () => {
      
      test('Test POST /api/books with title', (done) => {
        chai.request(server)
          .post('/api/books')
          .send({ title: 'Test book' })
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.isObject(res.body);
            assert.property(res.body, '_id');
            testId = res.body._id;
            assert.property(res.body, 'title');
            assert.isString(res.body._id);
            assert.isString(res.body.title);
            done();
          });
      });
      
      test('Test POST /api/books with no title given', (done) => {
        chai.request(server)
          .post('/api/books')
          .send({})
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.equal(res.text, 'no title given');
            done();
          });
      });
    });


    suite('GET /api/books => array of books', () => {
      test('Test GET /api/books', (done) => {
        chai.request(server)
          .get('/api/books')
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.isArray(res.body);
            done();
          });
      });      
    });


    suite('GET /api/books/[id] => book object with [id]', () => {
      
      test('Test GET /api/books/[id] with id not in db',  (done) => {
        chai.request(server)
          .get('/api/books/1234567890134567890asdf')
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.equal(res.text, 'no book with this id exists');
            done();
        });
      });
      
      test('Test GET /api/books/[id] with valid id in db',  (done) => {
        chai.request(server)
          .get('/api/books/'+testId)
          .end((err, res) => {
            assert.equal(res.status, 200);
            console.log('testing', res.body);
            assert.isObject(res.body);
            assert.property(res.body, '_id');
            assert.property(res.body, 'title');
            assert.property(res.body, 'comments');
            assert.isString(res.body._id);
            assert.isString(res.body.title);
            assert.isArray(res.body.comments);
            done();
        });
      });
      
    });


    suite('POST /api/books/[id] => add comment/expect book object with id', () => {
      
      test('Test POST /api/books/[id] with comment', (done) => {
        chai.request(server)
          .post('/api/books/'+testId)
          .send({ comment: 'Test comment' })
          .end((err, res) => {
            assert.equal(res.status, 200);
            console.log(res.body);
            assert.isObject(res.body);
            assert.property(res.body, '_id');
            assert.property(res.body, 'title');
            assert.property(res.body, 'comments');
            assert.isString(res.body._id);
            assert.isString(res.body.title);
            assert.isArray(res.body.comments);
            assert.isString(res.body.comments[0]);
            done();
        });
      });
      
    });

  });

});
