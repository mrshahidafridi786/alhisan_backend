export const errorHandler = (err, req, res, next) => {
  console.error('[ServerError]', err);

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const errors = {};
    for (const field in err.errors) {
      errors[field] = err.errors[field].message;
    }
    return res.status(400).json({
      success: false,
      message: 'Validation failed on the server.',
      errors,
    });
  }

  // Handle payload too large
  if (err.type === 'entity.too.large') {
    return res.status(413).json({
      success: false,
      message: 'Request payload is too large.',
    });
  }

  // Safe fallback
  return res.status(500).json({
    success: false,
    message: 'An unexpected internal error occurred. Please contact us directly by phone or WhatsApp.',
  });
};
