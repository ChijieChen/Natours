const AppError = require('./../utils/appError');

const handleCastErrorDB = err => {
  const message = `Invalid ${err.path}: ${err.value}.`;
  return new AppError(message, 400);
};

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack
  });
};

const sendErrorProd = (err, res) => {
  // Operational error: send to client
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message
    });

    // Programming error
  } else {
    console.error('ERROR', err);

    res.status(500).json({
      status: 'error',
      message: 'Something wrong'
    });
  }
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    let error = { ...err };
    if (err.name === 'CastError') error = handleCastErrorDB(error);
    sendErrorProd(error, res);
  } else if (process.env.NODE_ENV === 'production') {
    let error = { ...err };
    if (err.name === 'CastError') error = handleCastErrorDB(error);
    sendErrorProd(error, res);
  }
};
