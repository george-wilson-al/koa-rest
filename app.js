import * as books from './controllers/todo.js';
import compress from 'koa-compress';
import logger from 'koa-logger';
import route from 'koa-route';
import bodyParser from 'koa-bodyparser';
import Application from 'koa';
import cors from '@koa/cors';

export const app = new Application();

// Logger
app.use(logger())
  .use(bodyParser())
  .use(cors())
  .use(route.get('/api/v1/todos/', books.all))
  .use(route.get('/api/v1/todos/:id', books.fetch))
  .use(route.post('/api/v1/todos/', books.add))
  .use(route.put('/api/v1/todos/:id', books.modify))
  .use(route.delete('/api/v1/todos/:id', books.remove))
  .use(route.options('/api/v1/todos', books.options))
  .use(route.trace('/api/v1/todos', books.trace))
  .use(route.head('/api/v1/todos', books.head))
  .use(compress())
  .listen(1337, '0.0.0.0');

console.log('listening on port 1337');
