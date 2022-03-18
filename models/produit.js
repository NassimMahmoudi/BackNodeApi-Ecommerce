const mongoose = require('mongoose');
const Joi = require('joi');

const produit_schema = new mongoose.Schema({
    nom : String,
    categorie : String,
    colors : [String],
    description : String,
    marque : String,
    date_ajout : String,
    quantite : Number,
    prix : Number
});

let produit_validation = Joi.object({
    nom: Joi.string().required(),
    categorie: Joi.string().required(),
    colors: Joi.array().items(Joi.string()),
    description: Joi.string().required(),
    marque: Joi.string().required(),
    date_ajout: Joi.number(),
    quantite : Joi.number().min(0),
    prix : Joi.number()
});

const Produit = mongoose.model('produit',produit_schema);

module.exports.Produit=Produit;
module.exports.produit_validation=produit_validation;