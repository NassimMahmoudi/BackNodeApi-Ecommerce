const mongoose = require('mongoose');
const Joi = require('joi');
const client_schema = new mongoose.Schema({
    cin : Number,
    nom : String,
    prenom : String,
    pass: String,
    email : String,
    phone : String,
   
});

let client_validation = Joi.object({
    cin: Joi.number().min(8).required(),
    nom: Joi.string().required(),
    prenom: Joi.string().required(),
    pass: Joi.string().required(),
    email: Joi.string().required(),
    phone : Joi.string().length(8),
   
});

const Client = mongoose.model('client',client_schema);

module.exports.Client=Client;
module.exports.client_validation=client_validation;