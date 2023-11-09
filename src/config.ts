const {PORT, LOG_LEVEL, MONGODB_URL, DB_NAME, JWT_SECRET, TEST_DB_NAME} = process.env;
export const server = {
  port: PORT || 3001,
  logLevel: LOG_LEVEL || 'info'
};

export const mongoConfig = {
  mongoUrl: MONGODB_URL,
  dbName: DB_NAME //only for testing purpose => TEST_DB_NAME
};

export const jwtToken = {
  authSecret: JWT_SECRET
};
