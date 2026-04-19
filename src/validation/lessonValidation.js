const Joi = require("joi");

const createLessonSchema = Joi.object({
  title:    Joi.string().min(3).required(),
  content:  Joi.string().optional(),
  order:    Joi.number().min(0).default(0),
  videoUrl: Joi.string().optional()
}); 
const updateLessonSchema = Joi.object({
  title: Joi.string().min(3),
  content: Joi.string(),
  order: Joi.number().min(0),
  videoUrl: Joi.string(),
});


module.exports = {
  createLessonSchema,
  updateLessonSchema

};
