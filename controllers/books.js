import { MongoClient, ObjectId } from 'mongodb';
import { config } from 'dotenv';

config();

const client = new MongoClient(process.env.MONGO_CONNECTION_STRING);

export async function all(ctx, next) {
  if ('GET' !== ctx.request.method) {
    await next();
    return;
  }

  const query = {};
  const database = client.db('library');
  const booksCollection = database.collection('books');
  const cursor = booksCollection.find(query);

  // Check we have a match
  if (await booksCollection.countDocuments(query) === 0) {
    ctx.response.body('No documents found!');
  }

  const result = [];

  await cursor.forEach((doc) => {
    result.push(doc);
  });

  ctx.response.body = result;
}

export async function fetch(ctx, id, next) {
  if ('GET' !== ctx.request.method) {
    await next();
    return;
  }

  const database = client.db('library');
  const booksCollection = database.collection('books');
  const results = await booksCollection.findOne({'_id': new ObjectId(id)});

  if (results === null) {
    ctx.throw(404, 'book not found');
  }

  ctx.response.body = results;
}

export async function add(ctx, next) {
  if ('POST' !== ctx.request.method) {
    await next();
    return;
  }
  const database = client.db('library');
  const booksCollection = database.collection('books');
  const inserted = await booksCollection.insertOne(ctx.request.body);
  if (inserted.acknowledged === false) {
    ctx.throw(405, 'The book couldn\'t be added.');
  }
  ctx.response.set('Location', `/api/v1/books/${inserted.insertedId}`);
  ctx.response.status = 201;
}

export async function modify(ctx, id, next) {
  if ('PUT' !== ctx.request.method) {
    await next();
    return;
  }

  const database = client.db('library');
  const booksCollection = database.collection('books');
  const book = booksCollection.findOne({'_id': new ObjectId(id)});

  if (book === null) {
    ctx.throw(404, 'book with id = ' + id + ' was not found');
  }

  const updated = await booksCollection.updateOne({'_id': new ObjectId(id)}, {
    $set: ctx.request.body
  });

  if (updated.acknowledged === false || updated.acknowledged === true && updated.modifiedCount === 0) {
    ctx.throw(405, 'Unable to update.');
  } else {
    ctx.response.body = 'Done';
  }
}

export async function remove(ctx, id, next) {
  if ('DELETE' !== ctx.request.method) {
    await next();
    return;
  }

  const database = client.db('library');
  const booksCollection = database.collection('books');
  const book = await booksCollection.findOne({'_id': new ObjectId(id)});

  if (book === null) {
    ctx.throw(404, `book with id = ${id} was not found`);
  }

  const removed = await booksCollection.deleteOne({'_id': new ObjectId(id)});

  if (removed.acknowledged === false || removed.acknowledged === true && removed.deletedCount === 0) {
    ctx.throw(405, 'Unable to delete.');
  } else {
    ctx.response.body = 'Done';
  }
}

export async function head(){
}

export function options(ctx) {
  ctx.response.body = 'Allow: HEAD,GET,PUT,DELETE,OPTIONS';
}

export function trace(ctx) {
  ctx.response.body = 'Smart! But you can\'t trace.';
}
