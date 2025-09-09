const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');
const { beforeAll, afterEach, afterAll } = require('@jest/globals');

let mongod;

// Connect to the in-memory database before running tests
beforeAll(async () => {
  mongod = await MongoMemoryServer.create();
  const uri = mongod.getUri();
  await mongoose.connect(uri);
});

// Clear all test data after each test
afterEach(async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    const collection = collections[key];
    await collection.deleteMany();
  }
});

// Disconnect and stop the in-memory database after all tests
afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongod.stop();
}); 