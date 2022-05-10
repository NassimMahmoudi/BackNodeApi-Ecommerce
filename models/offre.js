const mongoose = require('mongoose');
const Joi = require('joi');
const offre_schema = new mongoose.Schema({

    prix : Number,
    nom : String,
    expireAt: {
        type: Date,
        /* Defaults 7 days from now */
        default: new Date(new Date().valueOf() + 604800000),
        /* Remove doc 60 seconds after specified date */
        expires: 60
      },
    products : {}
   
}, { timestamps: true });

let offre_validation = Joi.object({
    
    prix : Joi.number().required(),
    nom : Joi.string().required(),
    products : Joi.any()
   
});

const Offre = mongoose.model('offre',offre_schema);

module.exports.Offre=Offre;
module.exports.offre_validation=offre_validation;