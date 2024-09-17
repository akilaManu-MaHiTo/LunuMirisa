const mongoose = require('mongoose');
const Joi = require("joi");

const SupplierProfilesSchema = new mongoose.Schema({
  name: { type: String, required: true },
  address: { type: String, required: true },
  contact: { type: String, required: true },
  email: { type: String, required: true },
  category: { type: String, required: true },
  password:{type: String , required: true}
});

const SupplierProfile = mongoose.model('supplierprofiles', SupplierProfilesSchema);

const validate = (data) => {
  const schema = Joi.object({
      name: Joi.string().required().label("Name"),
      address: Joi.string().required().label("Address"),
      contact: Joi.string().required().label("contact"),
      email: Joi.string().email().required().label("Email"),
      category: Joi.string().required().label("category"),
      password: passwordComplexity().required().label("Password"),
  });
  return schema.validate(data);
};

module.exports = {SupplierProfile, validate };