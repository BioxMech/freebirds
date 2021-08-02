const { ApolloServer } = require('apollo-server'); 
const { PubSub } = require('graphql-subscriptions'); // PubSub = Publish & Subscribe
const mongoose = require('mongoose');

// graphql imports
// import { createServer } from 'http';
// import { execute, subscribe } from 'graphql';
// import { SubscriptionServer } from 'subscriptions-transport-ws';
// import { makeExecutableSchema } from '@graphql-tools/schema';

// This `app` is the returned value from `express()`.
// const httpServer = createServer(app);

const typeDefs = require('./graphql/typeDefs');
const resolvers = require('./graphql/resolvers'); // import the entire folder
const { MONGODB } = require('./config.js');

const pubsub = new PubSub();

const PORT = process.env.PORT || 5000;

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => ({ req, pubsub }) // take the request and forward it 
});

mongoose.connect(MONGODB, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('MongoDB Connected');
    return server.listen({ port: PORT });
  })
  .then(res => {
    console.log(`Server running at ${res.url}`) // Allow us to open up the link
  })
  .catch(err => {
    console.error(err)
  })