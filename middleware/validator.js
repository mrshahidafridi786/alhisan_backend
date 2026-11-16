import validator from 'validator';

const VALID_CATEGORIES = [
  'Salt',
  'Soda Ash',
  'Calcium Carbonate',
  'Food Products',
  'Spices',
  'Other',
];

export const validateContactInput = (req, res, next) => {
  const { fullName, email, phone, companyName, subject, productInterest, message, website_hp } = req.body;

  // 1. Honeypot check (anti-bot)
  if (website_hp && website_hp.trim() !== '') {
    // Silently discard or pretend success to confuse bots
    return res.status(200).json({
      success: true,
      message: 'Inquiry received successfully.',
    });
  }

  const errors = {};

  // 2. Full Name
  if (!fullName || typeof fullName !== 'string' || validator.isEmpty(fullName.trim())) {
    errors.fullName = 'Full Name is required.';
  } else if (!validator.isLength(fullName.trim(), { min: 2, max: 100 })) {
    errors.fullName = 'Full Name must be between 2 and 100 characters.';
  }

  // 3. Email
  if (!email || typeof email !== 'string' || validator.isEmpty(email.trim())) {
    errors.email = 'Email address is required.';
  } else if (!validator.isEmail(email.trim())) {
    errors.email = 'Please provide a valid business email address.';
  }

  // 4. Phone
  if (!phone || typeof phone !== 'string' || validator.isEmpty(phone.trim())) {
    errors.phone = 'Phone number is required.';
  } else {
    // Sanitized phone check: allowing digits, +, -, spaces, parentheses
    const cleanedPhone = phone.replace(/[\s\-\(\)\.]/g, '');
    if (!/^\+?[0-9]{7,20}$/.test(cleanedPhone)) {
      errors.phone = 'Please provide a valid phone number (e.g. +971 50 123 4567).';
    }
  }

  // 5. Subject
  if (!subject || typeof subject !== 'string' || validator.isEmpty(subject.trim())) {
    errors.subject = 'Subject is required.';
  } else if (!validator.isLength(subject.trim(), { min: 3, max: 200 })) {
    errors.subject = 'Subject must be between 3 and 200 characters.';
  }

  // 6. Product Interest
  if (!productInterest || typeof productInterest !== 'string' || validator.isEmpty(productInterest.trim())) {
    errors.productInterest = 'Please select a product category of interest.';
  } else if (!VALID_CATEGORIES.includes(productInterest.trim())) {
    errors.productInterest = `Invalid category selected. Must be one of: ${VALID_CATEGORIES.join(', ')}`;
  }

  // 7. Message
  if (!message || typeof message !== 'string' || validator.isEmpty(message.trim())) {
    errors.message = 'Inquiry message is required.';
  } else if (!validator.isLength(message.trim(), { min: 10, max: 3000 })) {
    errors.message = 'Message must be between 10 and 3000 characters.';
  }

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed. Please correct the highlighted fields.',
      errors,
    });
  }

  // Sanitize and normalize inputs
  req.sanitizedData = {
    fullName: validator.escape(fullName.trim()),
    email: validator.normalizeEmail(email.trim(), { gmail_remove_dots: false }) || email.trim().toLowerCase(),
    phone: validator.escape(phone.trim()),
    companyName: companyName && typeof companyName === 'string' ? validator.escape(companyName.trim()) : '',
    subject: validator.escape(subject.trim()),
    productInterest: productInterest.trim(),
    message: validator.escape(message.trim()),
    ipAddress: req.ip || req.headers['x-forwarded-for'] || '',
    userAgent: req.headers['user-agent'] || '',
  };

  next();
};
