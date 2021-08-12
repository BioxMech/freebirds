const User = require('../../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { UserInputError } = require('apollo-server-express');

const { validateRegisterInput, validateLoginInput, validateUpdateUserInput } = require('../../util/validators');
const { SECRET_KEY } = require('../../config');

function generateToken(user) {
  return jwt.sign({
    id: user.id,
    email: user.email,
    username: user.username
  }, SECRET_KEY, { expiresIn: '1h' });
}

module.exports = {
  Query: {
    async getUser(_, { username }) {
      try {
        // no condition in () will find ALL
        const user = await User.findOne({ username: username }).exec();
        if (user) {
          return user;
        } else {
          throw new Error('User not found');
        }
      } catch(err) {
        throw new Error(err);
      }
    },
  },
  Mutation: {
    async login(_, { username, password }) {
      const { errors, valid } = validateLoginInput(username, password);
      const user = await User.findOne({ username });

      if (!valid) {
        throw new UserInputError('Errors', { errors });
      }

      if (!user) {
        errors.general = 'User not found';
        throw new UserInputError('User not found', { errors });
      }

      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        errors.general = 'Wrong credentials';
        throw new UserInputError('Wrong credentials', { errors });
      }

      const token = generateToken(user)

      return {
        ...user._doc,
        id: user._id,
        token
      }
    },

    // parent is the result of the previous input
    // args is the register mutation argument (registerInput)
    // context (will be back)
    // info is some general metadata information (not important)
    async register(_, { registerInput: { username, email, password, confirmPassword } }
    ) {
      // Validate user data
      const { valid, errors } = validateRegisterInput(username, email, password, confirmPassword);
      if (!valid) {
        throw new UserInputError('Errors', { errors });
      }

      // Make sure that user doesn't already exists in the MongoDB
      const user = await User.findOne({ username })

      // checks if the user exists in the database and throw an error if true
      if (user) {
        throw new UserInputError('Username is taken', {
          errors: {
            username: 'This username is taken'
          }
        })
      }

      // SALT & HASH password and create an auth token
      password = await bcrypt.hash(password, 12); // using external lib bcrypt to encrypt password

      const newUser = new User({
        email,
        username,
        password,
        createdAt: new Date().toISOString()
      });

      const res = await newUser.save(); // Post to MongoDB (look at Users.js code)

      // sign takes a payload for the token
      const token = generateToken(res)

      return {
        ...res._doc,
        id: res._id, // this is produced by MongoDB when saving an entry
        token
      }
    },

    // Change password
    async updateUser(_, { updateUserInput: { username, email, password, newPassword, newConfirmPassword } }
    ) {

      if (newPassword === "" ) {
        // Validate user data
        const { valid, errors } = validateUpdateUserInput(username, email, password);

        if (!valid) {
          throw new UserInputError('Errors', { errors });
        }

        // Find the user information
        const user = await User.findOne({ username });
  
        if (!user) {
          errors.general = 'User not found';
          throw new UserInputError('User not found', { errors });
        }

        // check if the password entered is the same 
        const match = await bcrypt.compare(password, user.password);

        if (!match) {
          errors.general = 'Wrong credentials';
          throw new UserInputError('Wrong credentials', { errors });
        }

        const res = await User.findOneAndUpdate({ username: username }, { email: email }, { new: true });
        
        const token = generateToken(user)

        return {
          ...res._doc,
          id: res._id, // this is produced by MongoDB when saving an entry
          token
        }

        // =====================================================================
      } else {

        // Validate user data
        const { valid, errors } = validateUpdateUserInput(username, email, password, newPassword, newConfirmPassword);

        if (!valid) {
          throw new UserInputError('Errors', { errors });
        }
  
        // Find the user information
        const user = await User.findOne({ username });
  
        if (!user) {
          errors.general = 'User not found';
          throw new UserInputError('User not found', { errors });
        }

        // check if the password entered is the same 
        const match = await bcrypt.compare(password, user.password);

        if (!match) {
          errors.general = 'Wrong credentials';
          throw new UserInputError('Wrong credentials', { errors });
        }

        // SALT & HASH password and create an auth token
        newPassword = await bcrypt.hash(newPassword, 12); // using external lib bcrypt to encrypt password

        const res = await User.findOneAndUpdate({ username: username }, { password: newPassword }, { new: true });

        const token = generateToken(user)

        return {
          ...res._doc,
          id: res._id, // this is produced by MongoDB when saving an entry
          token
        }
      }

      

      // TODO: MAYBE allow users to change their username (?) 
      // FIXME: Allowing changes means that all the post username must change as well

      // // Make sure that user doesn't already exists in the MongoDB
      // const user = await User.findOne({ username })

      // // checks if the user exists in the database and throw an error if true
      // if (user) {
      //   throw new UserInputError('Username is taken', {
      //     errors: {
      //       username: 'This username is taken'
      //     }
      //   })
      // }

      // sign takes a payload for the token
      
    },
  }
}