const mongoose = require('mongoose');
const Joi = require('joi');
const Bill_schema = new mongoose.Schema({
	  fullname : String,
	  cin : Number,
	  total : Number,
	  status : String,
      date_commande : {
        type : Date,
        required: true,
    },
	  products : {}
});

let bill_validation = Joi.object({
    total : Joi.number().required(),
    cin : Joi.number().required(),
    fullname : Joi.string().required(),
    status : Joi.string().required(),
    products : Joi.any()
   
});
const Bill = mongoose.model('bill',Bill_schema);

module.exports.Bill=Bill;
module.exports.bill_validation=bill_validation;