const mongoose = require('mongoose');
const Joi = require('joi');
const agent_schema = new mongoose.Schema({
    cin : Number,
    nom : String,
    prenom : String,
    pass: String,
    email : String,
    phone : String,
    role : String,
    image : String
});

let agent_validation = Joi.object({
    cin: Joi.number().min(8).required(),
    nom: Joi.string().required(),
    prenom: Joi.string().required(),
    pass: Joi.string().required(),
    email: Joi.string().required(),
    phone : Joi.string().length(8),
    role : Joi.string(),
    image : Joi.string()
});
let agent_validation_update = Joi.object({
    cin: Joi.number().min(8),
    nom: Joi.string(),
    prenom: Joi.string(),
    pass: Joi.string(),
    old_pass: Joi.string(),
    email: Joi.string(),
    phone : Joi.string().length(8),
    role : Joi.string()
});

const Agent = mongoose.model('agent',agent_schema);

module.exports.Agent=Agent;
module.exports.agent_validation=agent_validation;
module.exports.agent_validation_update=agent_validation_update;