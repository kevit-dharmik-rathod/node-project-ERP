const {PORT, LOG_LEVEL} = process.env;
export const server = {
  port: PORT || 3001,
  logLevel: LOG_LEVEL || 'info'
};
