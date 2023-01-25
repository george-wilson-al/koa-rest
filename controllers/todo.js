import { MongoClient, ObjectId } from 'mongodb';
import { config } from 'dotenv';

config();

const client = new MongoClient(process.env.MONGO_CONNECTION_STRING);
const database = client.db('dummy');
const collection = database.collection('todos');

export async function all(ctx, next) {
  if ('GET' !== ctx.request.method) {
    await next();
    return;
  }

  const query = {};
  const cursor = collection.find(query);

  // Check we have a match
  if (await collection.countDocuments(query) === 0) {
    await next();
    ctx.response.body = [];
    return;
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

  const results = await collection.findOne({'_id': new ObjectId(id)});

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
  const inserted = await collection.insertOne(ctx.request.body);
  if (inserted.acknowledged === false) {
    ctx.throw(405, 'The book couldn\'t be added.');
  }
  ctx.response.set('Location', `/api/v1/books/${inserted.insertedId}`);
  ctx.response.status = 201;
  ctx.response.body = {'id': inserted.insertedId};
}

export async function modify(ctx, id, next) {
  if ('PUT' !== ctx.request.method) {
    await next();
    return;
  }

  const book = collection.findOne({'_id': new ObjectId(id)});

  if (book === null) {
    ctx.throw(404, 'book with id = ' + id + ' was not found');
  }

  const updated = await collection.updateOne({'_id': new ObjectId(id)}, {
    $set: ctx.request.body
  });

  console.log(updated);

  if (updated.acknowledged === false || updated.acknowledged === true && updated.matchedCount !== 1) {
    ctx.throw(405, {'success': false});
  } else {
    ctx.response.body = {'success': true};
  }
}

export async function remove(ctx, id, next) {
  if ('DELETE' !== ctx.request.method) {
    await next();
    return;
  }

  const book = await collection.findOne({'_id': new ObjectId(id)});

  if (book === null) {
    ctx.throw(404, `book with id = ${id} was not found`);
  }

  const removed = await collection.deleteOne({'_id': new ObjectId(id)});

  if (removed.acknowledged === false || removed.acknowledged === true && removed.deletedCount === 0) {
    ctx.throw(405, {'success': false});
  } else {
    ctx.response.body = {'success': true};
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
