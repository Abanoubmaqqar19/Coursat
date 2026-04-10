const Joi = require("joi");

const createLessonSchema = Joi.object({
  title: Joi.string().trim().min(3).max(200).required(),

  content: Joi.string().allow("", null).optional(),

  order: Joi.number().integer().min(0).optional(),

  videoUrl: Joi.string().uri().optional(),

  course: Joi.string().required(), 
});

module.exports = {
  createLessonSchema,
};
