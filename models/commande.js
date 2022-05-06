const mongoose = require('mongoose');
const Joi = require('joi');
const commande_schema = new mongoose.Schema({

    total : Number,
    date_ajout : {
        type : Date,
        required: true,
        default: Date.now,
    },
    id_client : String,
    status : String,
    //[id_product,color,quantity] 
    products : {}

   
});

let commande_validation = Joi.object({
    total : Joi.number().required(),
    id_client : Joi.string().required(),
    status : Joi.string().required(),
    products : Joi.any()
   
});

const Commande = mongoose.model('commande',commande_schema);

module.exports.Commande=Commande;
module.exports.commande_validation=commande_validation;