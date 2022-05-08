const router = require('express').Router();
const {Offre,offre_validation} = require('../models/offre');

// Get Offre  by ID for test
router.get('/:id',async (req,res)=>{
    let offre = await Offre.findById(req.params.id)
    if (!offre){
          return res.status(400).json({
            message: "Offre Not Exist"
          });
        }else{
            res.status(200).send(facture);    
        }
    
    });




// Add Offre
router.post('',async (req,res)=>{
    validation(offre_validation,req,res);
    let offre = new Offre(req.body);   
    try {
        res.send(await offre.save());
    } catch (error) {
        res.status(400).send(error.message);
    }
    
});

//delete Offre
router.delete('/delete/:id',async (req,res)=>{
    try {
        let offre = await Offre.findByIdAndRemove(req.params.id);
        if(!offre)
            return res.status(404).send('Offre with id is not found');
        res.send(offre);
    }catch (error) {
        res.status(400).send('Error Deleting Offre :'+error.message);
    }
    
});
module.exports=router;