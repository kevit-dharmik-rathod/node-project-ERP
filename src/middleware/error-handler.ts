export const ErrorHandler = (err, req, res, next) => {
  const errMsg = err.message || 'Something went wrong';
  res.json({
    success: false,
    message: errMsg
  });
};
