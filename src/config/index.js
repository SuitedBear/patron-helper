import dotenv from 'dotenv';

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

if (process.env.NODE_ENV === 'development') {
  const envFound = dotenv.config();

  if (envFound.error) {
    throw new Error('could not find .env file!');
  } else {
    console.log('variables loaded from .env');
  }
}

export default {
  // app config
  env: process.env.NODE_ENV,
  port: parseInt(process.env.PORT, 10),
  dbEraseOnSync: (process.env.DB_ERASE_ON_SYNC === 'true'),
  // logs
  logLevel: (process.env.LOG_LEVEL || 'silly'),
  // DB config
  dbHost: process.env.DB_HOST,
  dbName: process.env.DB_NAME,
  dbPort: process.env.DB_PORT,
  dbUser: process.env.DB_USER,
  dbPassword: process.env.DB_PASSWORD,
  // authorisation
  jwtSignature: process.env.JWT_SIGNATURE,
  jwtExpirationTime: process.env.JWT_EXPIRATION_TIME
};
