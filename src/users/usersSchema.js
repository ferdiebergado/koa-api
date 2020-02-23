const Joi = require('@hapi/joi');

const schema = {
  userId: Joi.number()
};

const { userId } = schema;

module.exports = {
  showSchema: Joi.object({
    user: userId
  })
};
