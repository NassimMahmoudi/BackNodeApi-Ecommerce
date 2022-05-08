const router = require('express').Router();
var sha1 = require('sha1');
const {Commande,commande_validation} = require('../models/commande');

function validation(validator,req,res) {
    let results = validator.validate(req.body);
    if(results.error)
        return res.status(400).send(results.error.details[0].message);
}

// Get Commandeby ID for test
router.get('/:id',async (req,res)=>{
    var ObjectId = require('mongoose').Types.ObjectId;
    if(!ObjectId.isValid(req.params.id)){
        return res.status(301).send("Commande Not Exist");
    }
    let commande = await Commande.findById(req.params.id)
    if (!commande){
          return res.status(400).json({
            message: "Commande Not Exist"
          });
        }else{
            res.status(200).send(commande);    
        }
    
    });

// get All commandes
router.get('',async (req,res)=>{
    try {
        let commandes = await Commande.find();
        res.status(200).send(commandes)
    } catch (error) {
        res.status(500).send('Error get All commandes :'+error.message);
    }
    
});
// Get all Commandes by id client
router.get('/mycommandes/:id',async (req,res)=>{
    let client_id = req.params.id
    var ObjectId = require('mongoose').Types.ObjectId;
    if(!ObjectId.isValid(client_id)){
        return res.status(301).json({ message: "Client Not Exist"});
    }
    let commandes = await Commande.find({id_client:client_id})
    if (!commandes){
          return res.status(404).json({
            message: "Commande Not Exist"
          });
        }else{
            res.status(200).send(commandes);    
        }
    
    });


// Add Commande
router.post('/add',async (req,res)=>{
    validation(commande_validation,req,res);
    let commande= new Commande({
        total : req.body.total,
        id_client : req.body.id_client,
        status : req.body.status,
        products : req.body.products,
     });
    try {
        res.status(200).send(await commande.save());
    } catch (error) {
        res.status(400).send(error.message);
    }
    
});
//update status commande
router.put('/:id',async (req,res)=>{
    let commande_id = req.params.id;
    let status = req.body.status;
    var ObjectId = require('mongoose').Types.ObjectId;
    if(!ObjectId.isValid(commande_id)){
        return res.status(404).send("Commande Not Exist");
    }

    let commande = await Commande.findById(commande_id);
      if (!commande){
          return res.status(404).send("Commande Not Exist");
      }
      else{
        try {            
            await Commande.updateOne({_id : commande_id}, {status : status});
            res.status(200).send(await Commande.findById(commande_id));
        } catch (error) {
            res.status(500).send('Error changing Commande status  :'+error.message);
        }  
      }
    
});

//delete Commande
router.delete('/delete/:id',async (req,res)=>{
    var ObjectId = require('mongoose').Types.ObjectId;
    if(!ObjectId.isValid(req.params._id)){
        return res.status(404).send("Commande Not Exist");
    }
    try {
        let commande = await Commande.findByIdAndRemove(req.params.id);
        if(!commande)
            return res.status(404).send('Commande with id is not found');
        res.send(commande);
    }catch (error) {
        res.status(400).send('Error Deleting Commande :'+error.message);
    }
    
});
//Cancel Commande
router.delete('/cancel/:id',async (req,res)=>{
    var ObjectId = require('mongoose').Types.ObjectId;
    if(!ObjectId.isValid(req.params.id)){
        return res.status(404).send("Commande Not Exist");
    }
    try {
        let commande = await Commande.findById(req.params.id);
        if(!commande)
            return res.status(404).send('Commande is not found');
        if((commande.status == "En Attente")||(commande.status == "En attente")||(commande.status == "en attente")){
            await Commande.deleteOne({_id: commande._id})
            return res.status(200).json("Deleted Commande")
        }
        res.status(301).send(commande);
    }catch (error) {
        res.status(400).send('Error Deleting Commande :'+error.message);
    }
    
});
module.exports=router;