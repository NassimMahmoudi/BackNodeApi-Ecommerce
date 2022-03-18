const mongoose = require('mongoose');
const Joi = require('joi');
const agent_schema = new mongoose.Schema({
    cin : Number,
    nom : String,
    prenom : String,
    pass: String,
    email : String,
    phone : String,
    role : String
});

let agent_validation = Joi.object({
    cin: Joi.number().min(8).required(),
    nom: Joi.string().required(),
    prenom: Joi.string().required(),
    pass: Joi.string().required(),
    email: Joi.string().required(),
    phone : Joi.string().length(8),
    role : Joi.string()
});

const Agent = mongoose.model('agent',agent_schema);

module.exports.Agent=Agent;
module.exports.agent_validation=agent_validation;