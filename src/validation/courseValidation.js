const Joi = require("joi");

// ObjectId regex (standard MongoDB format)
const objectId = Joi.string().regex(/^[0-9a-fA-F]{24}$/);

const createCourseSchema = Joi.object({
  title: Joi.string().min(3).required(),
  description: Joi.string().optional(),
  category: Joi.string().optional(),
  price: Joi.number().min(0).default(0),
});
// ─── UPDATE ───────────────────────────
const updateCourseSchema = Joi.object({
  title:       Joi.string().min(3),
  description: Joi.string(),
  category:    Joi.string(),
  price:       Joi.number().min(0),
  isPublished: Joi.boolean()
 
});
module.exports = {
  createCourseSchema,
  updateCourseSchema
};
