const Joi = require("joi");

// helper for ObjectId validation 
const objectId = Joi.string().regex(/^[0-9a-fA-F]{24}$/);

const createEnrollmentSchema = Joi.object({
  student: objectId.required(),

  course: objectId.required(),

  completedLessons: Joi.array().items(objectId).optional().default([]),
});

module.exports = {
  createEnrollmentSchema,
};
