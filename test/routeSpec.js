/*global describe, it*/
'use strict';
import superagent from 'supertest';
import { app } from '../app.js';

function request() {
  return superagent(app.listen());
}

describe('Routes', function() {
  describe('GET Books', function() {
    it('should return 200', function(done) {
      request()
        .get('/api/v1/books')
        .expect('Content-Type', /json/)
        .expect(200, done);
    });
  });
  describe('GET /books/notfound', function() {
    it('should return 404', function(done) {
      request()
        .get('/api/v1/books/notfound')
        .expect(404, done);
    });
  });
});
