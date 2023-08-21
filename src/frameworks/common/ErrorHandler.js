const ErrorHandler = (err, req, res, next) => {
  // render the error page
  res.status(err.status || 500);
  res.json({ error: err.message });
};

module.exports = ErrorHandler;