const mongoose = require('mongoose');
const Joi = require('joi');
var moment = require("moment");

const Claim_schema = new mongoose.Schema({
	  email: String,
	  sujet : String,
      date_claim : {
        type : String,
        required: true,
        default: moment(Date.now()).format("YYYY/DD/MM hh:mm"),
    },
	  importance : String
});

let claim_validation = Joi.object({
    email  : Joi.string().required(),
    sujet : Joi.string().required(),
    importance: Joi.string().required()   
});

const Claim = mongoose.model('claim',Claim_schema);

module.exports.Claim=Claim;
module.exports.claim_validation=claim_validation;