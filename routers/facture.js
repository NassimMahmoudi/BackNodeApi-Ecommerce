const router = require('express').Router();
var sha1 = require('sha1');
const {Facture,facture_validation} = require('../models/facture');

function validation(validator,req,res) {
    let results = validator.validate(req.body);
    if(results.error)
        return res.status(400).send(results.error.details[0].message);
}

// Get Facture by ID for test
router.get('/:id',async (req,res)=>{
    let facture = await Facture.findById(req.params.id)
    if (!facture){
          return res.status(400).json({
            message: "Facture Not Exist"
          });
        }else{
            res.status(200).send(facture);    
        }
    
    });




// Add Facture
router.post('',async (req,res)=>{
    validation(facture_validation,req,res);
    let facture = new Facture(req.body);   
    try {
        res.send(await facture.save());
    } catch (error) {
        res.status(400).send(error.message);
    }
    
});

//delete Facture
router.delete('/delete/:id',async (req,res)=>{
    try {
        let facture = await Facture.findByIdAndRemove(req.params.id);
        if(!facture)
            return res.status(404).send('Facture with id is not found');
        res.send(facture);
    }catch (error) {
        res.status(400).send('Error Deleting Facture :'+error.message);
    }
    
});
module.exports=router;