const router = require('express').Router();
const {Commande,commande_validation} = require('../models/commande');
const autoris = require('../middleware/autoris');

function validation(validator,req,res) {
    let results = validator.validate(req.body);
    if(results.error)
        return res.status(200).json({ message : results.error.details[0].message });
}

// Get Commandeby ID for test
router.get('/:id',async (req,res)=>{
    var ObjectId = require('mongoose').Types.ObjectId;
    if(!ObjectId.isValid(req.params.id)){
        return res.status(200).json({ message : "Commande Not Exist" });
    }
    let commande = await Commande.findById(req.params.id)
    if (!commande){
          return res.status(200).json({
            message: "Commande Not Exist"
          });
        }else{
            res.status(200).json(commande);    
        }
    
    });

// get All commandes
router.get('',autoris,async (req,res)=>{
    try {
        let commandes = await Commande.find();
        res.status(200).json(commandes)
    } catch (error) {
        res.status(400).json( { message : 'Error get All commandes :'+error.message });
    }
    
});
// Get all Commandes by id client
router.get('/mycommandes/:id',async (req,res)=>{
    let client_id = req.params.id
    var ObjectId = require('mongoose').Types.ObjectId;
    if(!ObjectId.isValid(client_id)){
        return res.status(200).json({ message: "Client Not Exist"});
    }
    let commandes = await Commande.find({id_client:client_id})
    if (!commandes){
          return res.status(200).json({
            message: "Commande Not Exist"
          });
        }else{
            res.status(200).json(commandes);    
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
        res.status(200).json(await commande.save());
    } catch (error) {
        res.status(400).json({ message : error.message });
    }
    
});
//update status commande
router.put('update/:id',autoris,async (req,res)=>{
    let commande_id = req.params.id;
    let status = req.body.status;
    var ObjectId = require('mongoose').Types.ObjectId;
    if(!ObjectId.isValid(commande_id)){
        return res.status(200).json({ message : "Commande Not Exist" });
    }

    let commande = await Commande.findById(commande_id);
      if (!commande){
          return res.status(200).json({ message : "Commande Not Exist" });
      }
      else{
        try {            
            await Commande.updateOne({_id : commande_id}, {status : status});
            res.status(200).json(await Commande.findById(commande_id));
        } catch (error) {
            res.status(400).json({ message : 'Error changing Commande status  :'+error.message });
        }  
      }
    
});

//delete Commande
router.delete('/delete/:id',autoris,async (req,res)=>{
    var ObjectId = require('mongoose').Types.ObjectId;
    if(!ObjectId.isValid(req.params.id)){
        return res.status(200).json({ message : "Commande Not Exist" });
    }
    try {
        let commande = await Commande.findByIdAndRemove(req.params.id);
        if(!commande)
            return res.status(200).json({ message : 'Commande with id is not found' });
        res.status(200).json(commande);
    }catch (error) {
        res.status(400).json({ message : 'Error Deleting Commande :'+error.message });
    }
    
});
//Cancel Commande
router.delete('/cancel/:id',async (req,res)=>{
    var ObjectId = require('mongoose').Types.ObjectId;
    if(!ObjectId.isValid(req.params.id)){
        return res.status(200).json({ message : "Commande Not Exist" });
    }
    try {
        let commande = await Commande.findById(req.params.id);
        if(!commande)
            return res.status(200).json({ message : 'Commande is not found' });
        if((commande.status == "En Attente")||(commande.status == "En attente")||(commande.status == "en attente")){
            await Commande.deleteOne({_id: commande._id})
            return res.status(200).json({ message : "Deleted Commande" })
        }
        res.status(200).json(commande);
    }catch (error) {
        res.status(400).json({ message : 'Error Canceling Commande :'+error.message });
    }
    
});
module.exports=router;