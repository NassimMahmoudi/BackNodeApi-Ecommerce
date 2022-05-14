const router = require('express').Router();
const {Offre,offre_validation} = require('../models/offre');
const autoris = require('../middleware/autoris');
const auth = require('../middleware/auth');

function validation(validator,req,res) {
    let results = validator.validate(req.body);
    if(results.error)
        return res.status(200).send(results.error.details[0].message);
}
// Get Offre  by ID for test
router.get('/:id',async (req,res)=>{
    var ObjectId = require('mongoose').Types.ObjectId;
    if(!ObjectId.isValid(req.params.id)){
        return res.status(200).json({
            message: "Offre Not Exist"
          });
    }
    let offre = await Offre.findById(req.params.id)
    if (!offre){
          return res.status(200).json({
            message: "Offre Not Exist"
          });
        }else{
            res.status(200).json(offre);    
        }
    
    });
// get All offres
router.get('',async (req,res)=>{
    try {
        let offres = await Offre.find();
        res.status(200).json(offres)
    } catch (error) {
        res.status(400).json({ message : 'Error get All offres :'+error.message });
    }    
});
// Add Offre
router.post('/add',[auth,autoris],async (req,res)=>{
    validation(offre_validation,req,res);
    let offre= new Offre({
        prix : req.body.prix,
        nom : req.body.nom,
        products : req.body.products,
     });
    try {
        res.status(200).json(await offre.save());
    } catch (error) {
        res.status(400).json({ message : error.message });
    }
    
});

//delete Offre
router.delete('/delete/:id',[auth,autoris],async (req,res)=>{
    var ObjectId = require('mongoose').Types.ObjectId;
    if(!ObjectId.isValid(req.params.id)){
        return res.status(200).json({ message: "Offre Not Exist"});
    }
    try {
        let offre = await Offre.findByIdAndRemove(req.params.id);
        if(!offre)
            return res.status(200).json({ message: 'Offre with this id is not found'});
        res.status(200).json(offre);
    }catch (error) {
        res.status(400).json({ message : 'Error Deleting Offre :'+error.message });
    }
    
});
module.exports=router;