const Joi = require("joi");

const productSchema = Joi.object({
  name: Joi.string(),
  description: Joi.string(),
  price: Joi.number(),
  quantity: Joi.number(),
  categoryId: Joi.string().required(),
  userId: Joi.string(),
  imageURL: Joi.string(),
  brand: Joi.string(),
});

export { productSchema };
