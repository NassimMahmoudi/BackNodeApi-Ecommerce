const mongoose = require('mongoose');
const Joi = require('joi');
const facture_schema = new mongoose.Schema({

   
   
});

let facture_validation = Joi.object({
    
   
   
});

const Facture = mongoose.model('facture',facture_schema);

module.exports.Facture=Facture;
module.exports.facture_validation=facture_validation;