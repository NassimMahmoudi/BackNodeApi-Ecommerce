const mongoose = require('mongoose');
const Joi = require('joi');
const commande_schema = new mongoose.Schema({

    date : String,
    temp_att : Number,

   
});

let commande_validation = Joi.object({
    date : Joi.string().required(),
    temp_att : Joi.number(),
   
   
});

const Commande = mongoose.model('commande',commande_schema);

module.exports.Commande=Commande;
module.exports.commande_validation=commande_validation;