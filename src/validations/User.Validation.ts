import Joi from "joi";

const userSchema = Joi.object({
  id: Joi.string(),
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  email: Joi.string().required(),
  password: Joi.string().required(),
  mobile: Joi.string()
    .pattern(/^[0-9]{10}$/)
    .required(),
  city: Joi.string(),
});

export { userSchema };
