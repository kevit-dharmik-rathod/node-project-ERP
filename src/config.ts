const {PORT, LOG_LEVEL, MONGODB_URL, DB_NAME, JWT_SECRET} = process.env;
export const server = {
  port: PORT || 3001,
  logLevel: LOG_LEVEL || 'info'
};

export const mongoConfig = {
  mongoUrl: MONGODB_URL,
  dbName: DB_NAME
};

export const jwtToken = {
  authSecret: JWT_SECRET
};
