const router = require('express').Router();
const {Produit, produit_validation} = require('../models/produit');
const upload= require("../middleware/upload");
const autoris = require('../middleware/autoris');
const auth = require('../middleware/auth');
var fs =require('fs');


// add Product to DB 
router.post('/add',[auth,autoris,upload],async (req,res)=>{

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
            return res.status(200).json({ message : results.error.details[0].message });
        res.status(200).json(await product.save());
    } catch (error) {
        res.status(400).json( { message : 'Error saving Product :'+error.message });
    }
    
});
// Get Product by ID 
router.get('/:id',async (req,res)=>{
    let produit = await Produit.findById(req.params.id)
    if (!produit){
          return res.status(200).json({ message : "Product Not Exist" });
        }else{
            res.status(200).json(produit);    
        }
    
    });

// get All Products
router.get('',async (req,res)=>{
    try {
        let produits = await Produit.find();
        res.status(200).json(produits)
    } catch (error) {
        res.status(400).json({ message : 'Error get All Products :'+error.message });
    }
    
});

//update product without photo
router.put('update/:id',[auth,autoris],async (req,res)=>{
    try {
        let results= produit_validation.validate(req.body);
        if(results.error)
            return res.status(200).json({ message : results.error.details[0].message });
        
        await Produit.updateOne({_id : req.params.id}, req.body);
        res.status(200).json(await Produit.findById(req.params.id));
    } catch (error) {
        res.status(400).json({ message : 'Error updating Product :'+error.message });
    }   
});
//update Product Image 
router.put('/editimage/:id', [auth,autoris,upload],async (req,res)=>{
    let id = req.params.id;
    let product = await Produit.findById(id);
    if (!product)
        return res.status(200).json({ message : "Product Not Exist"});
    if(req.file){
        let new_image=req.file.filename;
        try{
            // Delete old Image from server
            // IN the front side you should pass the new image and the old image too
            fs.unlinkSync("uploads/"+ req.body.old_image,function(err){
                if(err) throw err;
            
                console.log('File deleted!');
            });//old_image in the front side must be a string from client.image 
        }catch(err){
            console.log(err);
        }
        await Produit.updateOne({_id : id}, {$set: { image : new_image} });
        res.status(200).json(await Produit.findById(id));
    }else{
        res.status(200).json({ message : 'You must select a new Image' });
    }
});
// Delete Product
router.delete('delete/:id',[auth,autoris],async (req,res)=>{
    var ObjectId = require('mongoose').Types.ObjectId;
    if(!ObjectId.isValid(req.params.id)){
        return res.status(200).json({ message : "Product Not Exist" });
    }
    try {
        let produit = await Produit.findByIdAndRemove(req.params.id);
        if(!produit)
            return res.status(200).json({ message : 'Product with id is not found' });
        res.status(200).json(produit);
    } catch (error) {
        res.status(400).json({ message : 'Error Deleting Product :'+error.message });
    }
    
});

module.exports=router;