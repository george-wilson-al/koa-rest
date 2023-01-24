'use strict';
import * as books from './controllers/books.js';
import compress from 'koa-compress';
import logger from 'koa-logger';
import route from 'koa-route';
import bodyParser from 'koa-bodyparser';
import Application from 'koa';

export const app = new Application();

// Logger
app.use(logger())
  .use(bodyParser())
  .use(route.get('/api/v1/books/', books.all))
  .use(route.get('/api/v1/books/:id', books.fetch))
  .use(route.post('/api/v1/books/', books.add))
  .use(route.put('/api/v1/books/:id', books.modify))
  .use(route.delete('/api/v1/books/:id', books.remove))
  .use(route.options('/api/v1/books', books.options))
  .use(route.trace('/api/v1/books', books.trace))
  .use(route.head('/api/v1/books', books.head))
  .use(compress())
  .listen(1337, '0.0.0.0');

console.log('listening on port 1337');
