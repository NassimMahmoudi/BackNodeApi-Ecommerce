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
        res.send(await commande.save());
    } catch (error) {
        res.status(400).send(error.message);
    }
    
});

//delete Commande
router.delete('/delete/:id',async (req,res)=>{
    try {
        let commande = await Commande.findByIdAndRemove(req.params.id);
        if(!commande)
            return res.status(404).send('Commande with id is not found');
        res.send(commande);
    }catch (error) {
        res.status(400).send('Error Deleting Commande :'+error.message);
    }
    
});
module.exports=router;