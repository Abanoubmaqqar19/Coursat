
const Joi = require("joi");

const createCommentSchema = Joi.object({
  text: Joi.string().trim().min(1).max(500).required(),
});

module.exports = {
  createCommentSchema,
};
