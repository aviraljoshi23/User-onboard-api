const Joi = require('joi');
const i18n = require('i18n');

function validateRequest(schema) {
  return (req, res, next) => {
    try {
      // Validate the request parameters using the provided schema
      const { error } = schema.validate(req.body);

      if (error) {
        // Validation failed, send an error response
        const message = i18n.__(`validation.${error.details[0].type.split('.')[1]}.${error.details[0].path[0]}`); // Translate the error message
        // const message = error; // Translate the error message
        res.status(400).send({ error: message });
      } else {
        // Validation succeeded, call the next middleware function
        next();
      }
    } catch (error) {
      // Handle the error
      console.error(error);
      res.status(500).send({ error: 'An error occurred while validating the request parameters' });
    }
  };
}

module.exports = validateRequest;
