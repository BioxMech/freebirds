import React from 'react';
import App from './App';
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  createHttpLink,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";

const httpLink = createHttpLink({
  uri: 'http://localhost:5000'
})

const authLink = setContext(() => {
  const token = localStorage.getItem('jwtToken');
  return {
    headers: {
      Authorization: token ? `Bearer ${token}` : ''
    }
  };
});

const client = new ApolloClient({
  link: authLink.concat(httpLink), // uri specifies the URL of our GraphQL server.
  cache: new InMemoryCache() // cache is an instance of InMemoryCache, which Apollo Client uses to cache query results after fetching them.
})

export default (
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>
)