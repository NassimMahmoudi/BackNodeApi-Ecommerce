const router = require('express').Router();
const {Produit, produit_validation} = require('../models/produit');
const upload= require("../middleware/upload");

// add Product to DB 
router.post('/add',upload,async (req,res)=>{

    try {
        let product = new Produit({
            nom : req.body.nom,
            categorie : req.body.categorie,
            description : req.body.description,
            marque : req.body.marque,
            quantite : req.body.quantite,
            prix : req.body.prix,
            image : req.file.filename,
         });
        let results= produit_validation.validate(req.body);
        if(results.error)
            return res.status(403).send(results.error.details[0].message);
        res.status(200).send(await product.save());
    } catch (error) {
        res.status(500).send('Error saving Product :'+error.message);
    }
    
});
// Get Product by ID 
router.get('/:id',async (req,res)=>{
    let produit = await Produit.findById(req.params.id)
    if (!produit){
          return res.status(404).send("Product Not Exist");
        }else{
            res.status(200).send(produit);    
        }
    
    });

// get All Products
router.get('',async (req,res)=>{
    try {
        let produits = await Produit.find();
        res.status(200).send(produits)
    } catch (error) {
        res.status(500).send('Error get All Products :'+error.message);
    }
    
});

//update product
router.put('/:id',async (req,res)=>{
    try {
        let results= produit_validation.validate(req.body);
        if(results.error)
            return res.status(403).send(results.error.details[0].message);
        
        await Produit.updateOne({_id : req.params.id}, req.body);
        res.send(await Produit.findById(req.params.id));
    } catch (error) {
        res.status(500).send('Error updating Product :'+error.message);
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
        res.status(500).send('Error Deleting Product :'+error.message);
    }
    
});

module.exports=router;