const Joi = require("joi");

// ObjectId regex (standard MongoDB format)
const objectId = Joi.string().regex(/^[0-9a-fA-F]{24}$/);

const createCourseSchema = Joi.object({
  title: Joi.string().trim().min(3).max(200).required(),

  description: Joi.string().allow("", null).optional(),

  instructor: objectId.required(),

  price: Joi.number().min(0).optional().default(0),

  isPublished: Joi.boolean().optional().default(false),

  category: Joi.string().trim().optional(),
});

module.exports = {
  createCourseSchema,
};
