import argon2 from 'argon2';
import { randomBytes } from 'crypto';
import jwt from 'jsonwebtoken';
import config from '../config';
import models from '../models';

const generateToken = (user) => {
  const data = {
    _id: user.id,
    name: user.name,
    email: user.email
  };
  const signature = config.jwtSignature;
  const expiration = config.jwtExpirationTime;

  return jwt.sign({ data }, signature, { expiresIn: expiration });
};

class ValidationError extends Error {
  constructor (message) {
    super(message);
    this.name = 'ValidationError';
  }
}

const AuthService = {
  SignUp: async (name, email, password) => {
    const salt = randomBytes(32);
    const passwordHash = await argon2.hash(password, { salt });

    const newUser = await models.User.create({
      name,
      pass: passwordHash,
      salt: salt.toString('hex'),
      email
    });

    return {
      user: {
        email: newUser.email,
        name: newUser.name
      }
    };
  },

  Login: async (name, password) => {
    const userRecord = await models.User.findOne({
      where: {
        email: name
      }
    });

    if (!userRecord) {
      throw new ValidationError('User not found');
    } else {
      const correctPassword =
        await argon2.verify(userRecord.pass, password);
      if (!correctPassword) {
        throw new ValidationError('Incorrect password');
      }
    }

    return {
      user: {
        email: userRecord.email,
        name: userRecord.name
      },
      token: generateToken(userRecord)
    };
  }
};

export { ValidationError };
export default AuthService;
