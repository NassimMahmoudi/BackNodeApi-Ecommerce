const router = require('express').Router();
const {Claim,claim_validation} = require('../models/claim');

// Get Claimby ID 
router.get('/:id',async (req,res)=>{
    var ObjectId = require('mongoose').Types.ObjectId;
    if(!ObjectId.isValid(req.params.id)){
        return res.status(301).send("Claim Not Exist");
    }
    let claim= await Claim.findById(req.params.id)
    if (!claim){
          return res.status(400).json({
            message: "Claim Not Exist"
          });
        }else{
            res.status(200).send(claim);    
        }
    
    });

// get All claims
router.get('',async (req,res)=>{
    try {
        let claims = await Claim.find();
        res.status(200).send(claims)
    } catch (error) {
        res.status(500).send('Error get All claims :'+error.message);
    }
    
});

    
// Add Claim
router.post('/add',async (req,res)=>{
    let results = claim_validation.validate(req.body);
    if(results.error)
        return res.status(400).send(results.error.details[0].message);
    let claim = new Claim({
        email : req.body.email,
        sujet : req.body.sujet,
        importance : req.body.importance,
     });
    try {
        res.status(200).send(await claim.save());
    } catch (error) {
        res.status(400).send(error.message);
    }
    
});

//delete Claim
router.delete('/delete/:id',async (req,res)=>{
    var ObjectId = require('mongoose').Types.ObjectId;
    if(!ObjectId.isValid(req.params.id)){
        return res.status(404).send("Claim Not Exist");
    }
    try {
        let claim = await Claim.findByIdAndRemove(req.params.id);
        if(!claim)
            return res.status(404).send('Claim with id is not found');
        res.send(claim);
    }catch (error) {
        res.status(400).send('Error Deleting Claim :'+error.message);
    }
    
});
module.exports=router;