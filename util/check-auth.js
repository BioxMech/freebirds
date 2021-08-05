const { AuthenticationError } = require('apollo-server-express');

const jwt = require('jsonwebtoken');
const { SECRET_KEY } = require('../config');

module.exports = (context) => {
  // context = { ...headers } // context will have headers
  const authHeader = context.req.headers.authorization;
  if (authHeader) {
    // response >>> 'Bearer token'
    const token = authHeader.split('Bearer ')[1]; // split it to get the token
    if (token) {
      try {
        const user = jwt.verify(token, SECRET_KEY);
        return user;
      } catch(err) {
        throw new AuthenticationError('Invalid/Expired Token'); // can add blacklist
      }
    }
    throw new Error('Authentication token must be \'Bearer [token]');
  }
  throw new Error('Authorization header must be provided');
}