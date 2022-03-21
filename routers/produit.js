const router = require('express').Router();
const {Produit, produit_validation} = require('../models/produit');
const uploadController = require("../controllers/upload");
// add Produit to DB 
router.post('',async (req,res)=>{
    var date_ajout = new Date().getTime();
    req.body.date_ajout=date_ajout;
    // req.body.image=uploadController.uploadFiles;
    try {
        let results= produit_validation.validate(req.body);
        if(results.error)
            return res.status(400).send(results.error.details[0].message);
        let produit = new Produit(req.body);
        produit = await produit.save();
        res.send(produit);
    } catch (error) {
        res.status(400).send('Error saving Product :'+error.message);
    }
    
});
// Get Product by ID 
router.get('/:id',async (req,res)=>{
    let produit = await Produit.findById(req.params.id)
    if (!produit){
          return res.status(400).json({
            message: "Product Not Exist"
          });
        }else{
            res.status(200).send(produit);    
        }
    
    });

// get All Products
router.get('',async (req,res)=>{
    try {
        let produits = await Produit.find();
        res.send(produits)
    } catch (error) {
        res.status(400).send('Error get All Products :'+error.message);
    }
    
});

//update produit
router.put('/:id',async (req,res)=>{
    try {
        let results= produit_validation.validate(req.body);
        if(results.error)
            return res.status(400).send(results.error.details[0].message);
        
        await Produit.updateOne({_id : req.params.id}, req.body);
        res.send(await Produit.findById(req.params.id));
    } catch (error) {
        res.status(400).send('Error updating Product :'+error.message);
    }
    
});
// Delete Product
router.delete('/:id',async (req,res)=>{
    try {
        let produit = await Produit.findByIdAndRemove(req.params.id);
        if(!produit)
            return res.status(404).send('Product with id is not found');
        res.send(produit);
    } catch (error) {
        res.status(400).send('Error Deleting Product :'+error.message);
    }
    
});

module.exports=router;