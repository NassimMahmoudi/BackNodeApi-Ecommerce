const mongoose = require('mongoose');
const Joi = require('joi');
const offre_schema = new mongoose.Schema({

    prix : Number,
    date_ajout : {
        type : Date,
        required: true,
        default: Date.now,
    },
    nom : String,
    date_limit : Date,
    products : {}
   
});

let offre_validation = Joi.object({
    
    prix : Joi.number().required(),
    nom : Joi.string().required(),
    date_limit : Joi.date().required(),
    products : Joi.any()
   
});

const Offre = mongoose.model('offre',offre_schema);

module.exports.Offre=Offre;
module.exports.offre_validation=offre_validation;