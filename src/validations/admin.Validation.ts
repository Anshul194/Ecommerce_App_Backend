import joi from 'joi';


const adminRegistrationSchema=joi.object({
    UserName: joi.string().required(),
    email: joi.string().email().required(),
    password: joi.string().regex(/^[a-zA-Z0-9]{6,30}$/).required(),
  });

  export{adminRegistrationSchema}