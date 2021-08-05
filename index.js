const { ApolloServer } = require('apollo-server-express'); 
const { PubSub } = require('graphql-subscriptions'); // PubSub = Publish & Subscribe
const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');

// graphql imports
const { createServer } = require('http');
const { execute, subscribe } = require('graphql');
const { SubscriptionServer } = require('subscriptions-transport-ws');
const { makeExecutableSchema } = require('@graphql-tools/schema');

// This `app` is the returned value from `express()`.
// const httpServer = createServer(app);

const typeDefs = require('./graphql/typeDefs');
const resolvers = require('./graphql/resolvers'); // import the entire folder
const { MONGODB } = require('./config.js');

const PORT = process.env.PORT || 5000;

// const server = new ApolloServer({
//   typeDefs,
//   resolvers,
//   context: ({ req }) => ({ req, pubsub }) // take the request and forward it 
// });

// mongoose.connect(MONGODB, { useNewUrlParser: true, useUnifiedTopology: true })
//   .then(() => {
//     console.log('MongoDB Connected');
//     return server.listen({ port: PORT });
//   })
//   .then(res => {
//     console.log(`Server running at ${res.url}`) // Allow us to open up the link
//   })
//   .catch(err => {
//     console.error(err)
//   })



// async function serverStart() {
//   const app = express();
//   app.use(cors())

//   const httpServer = createServer(app);

//   const schema = makeExecutableSchema({
//     typeDefs,
//     resolvers,
//   });

//   const server = new ApolloServer({
//     schema,
//     context: ({ req }) => ({ req, pubsub })
//   });

//   await server.start();
//   server.applyMiddleware({ app });

//   SubscriptionServer.create(
//     { schema, execute, subscribe },
//     { server: httpServer, path: server.graphqlPath }
//   );

//   httpServer.listen(PORT, () =>
//     console.log(`Server is now running on http://localhost:${PORT}/graphql`))
// }



// mongoose.connect(MONGODB, { useNewUrlParser: true, useUnifiedTopology: true })
//   .then(() => {
//     console.log('MongoDB Connected');
//     serverStart();
//   })
//   // .then(res => {
//   //   console.log(`Server running at ${res.url}`) // Allow us to open up the link
//   // })
//   .catch(err => {
//     console.error(err)
//   })





async function startApolloServer(typeDefs, resolvers) {

  const pubsub = new PubSub();

  // Same ApolloServer initialization as before
  // const server = new ApolloServer({ typeDefs, resolvers, context: ({ req }) => ({ req, pubsub }) });
  const schema = makeExecutableSchema({ typeDefs, resolvers });
  const server = new ApolloServer({
    schema, context: ({ req }) => ({ req, pubsub }) 
  });

  // Required logic for integrating with Express
  await server.start();
  const app = express();
  app.use(cors());

  server.applyMiddleware({
      app,

      // By default, apollo-server hosts its GraphQL endpoint at the
      // server root. However, *other* Apollo Server packages host it at
      // /graphql. Optionally provide this to match apollo-server.
      path: '/'
  });
  
  
  const httpServer = createServer(app);

  const subscriptionServer = SubscriptionServer.create({
      // This is the `schema` we just created.
      schema,
      // These are imported from `graphql`.
      execute,
      subscribe,
  }, {
      // This is the `httpServer` we created in a previous step.
      server: httpServer,
      // This `server` is the instance returned from `new ApolloServer`.
      path: server.graphqlPath,
  });
  
  // Shut down in the case of interrupt and termination signals
  // We expect to handle this more cleanly in the future. See (#5074)[https://github.com/apollographql/apollo-server/issues/5074] for reference.
  ['SIGINT', 'SIGTERM'].forEach(signal => {
    process.on(signal, () => subscriptionServer.close());
  });

  // Modified server startup
  await new Promise(resolve => httpServer.listen({ port: PORT }, resolve));
  console.log(`🚀 Server ready at http://localhost:${PORT}${server.graphqlPath}`);
}

mongoose.connect(MONGODB, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('MongoDB Connected');
    // return server.listen({ port: PORT });
    startApolloServer(typeDefs, resolvers)
  })
  // .then(res => {
  //   console.log(`Server running at ${res.url}`) // Allow us to open up the link
  // })
  .catch(err => {
    console.error(err)
  })