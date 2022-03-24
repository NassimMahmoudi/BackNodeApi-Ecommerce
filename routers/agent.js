const router = require('express').Router();
var sha1 = require('sha1');
var fs =require('fs');
const {Agent,agent_validation,agent_validation_update} = require('../models/agent');
const upload= require("../middleware/upload");

// Get Agent by ID for test
router.get('/:id',async (req,res)=>{
    let agent = await Agent.findById(req.params.id)
    if (!agent){
          return res.status(404).send("Agent Not Exist");
        }else{
            res.status(200).send(agent);    
        }
    
    });

// Sign In Agent
router.post('/signin',async (req,res)=>{
    const email = req.body.email;
    const pass = sha1(req.body.pass);

    try {
        let agent = await Agent.findOne({
          email
        });
        if (!agent)
          return res.status(404).send("Agent Not Exist");
        if(pass===agent.pass){
            res.status(200).json({sign_in:true  });  
        }else{
            return res.status(401).send("Incorrect Password !");
        }  
    }catch (e) {
        console.error(e);
        res.status(500).send("Server Error");
      }
     
});
//Logout Agent
router.post('/logout', async (req, res)=>{
	req.session.destroy();
	res.status(200).json({logout:true});
}); 
// Add Agent
router.post('/add',upload, async (req,res)=>{
    // crypting pass
    req.body.pass = sha1(req.body.pass);
    let agent= new Agent({
       cin : req.body.cin,
       nom : req.body.nom,
       prenom : req.body.prenom,
       pass : req.body.pass,
       email : req.body.email,
       phone : req.body.phone,
       role : req.body.role,
       image : req.file.filename,
    });
    let results= agent_validation.validate(agent);
    if(results.error)
        return res.status(403).send(results.error.details[0].message);
    try {
        res.status(200).send(await agent.save());
    } catch (error) {
        res.status(500).send(error.message);
    }
    
});
//update agent (Edit Profil) without image
router.put('/edit/:email',async (req,res)=>{
    let email = req.params.email;
    let old_pass = sha1(req.body.old_pass);
    req.body.pass = sha1(req.body.pass);
    let agent = await Agent.findOne({
        email
      });
      if (!agent)
          return res.status(404).send("Agent Not Exist");
        if(old_pass===agent.pass){
            try {
                let results= agent_validation_update.validate(req.body);
                if(results.error)
                    return res.status(403).send(results.error.details[0].message);
                
                await Agent.updateOne({_id : agent._id}, req.body);
                res.status(200).send(await Agent.findById(agent._id));
            } catch (error) {
                res.status(500).send('Error editing Agent Profil :'+error.message);
            }  
        }else{
            return res.status(401).send("Incorrect Password !");
        }  
    
    
});
//update agent Image (Edit Profil image)
router.put('/editimage/:email', upload,async (req,res)=>{
    let email = req.params.email;
    let new_image='';
    let agent = await Agent.findOne({
        email
      });
    if (!agent)
        return res.status(404).send("Agent Not Exist");
    if(req.file){
        new_image=req.file.filename;
        try{
            // Delete old Image from server
            // IN the front side you should pass the new image and the old image too
            fs.unlinkSync("../uploads/"+ req.body.old_image);
        }catch(err){
            console.log(err);
        }
        await Agent.updateOne({_id : agent._id}, {$set: { image : new_image} });
        res.status(200).send(await Agent.findById(agent._id));
    }else{
        res.status(403).send('You must select a new Image');
    }
});
//delete Agent
router.delete('/delete/:id',async (req,res)=>{
    try {
        let agent = await Agent.findByIdAndRemove(req.params.id);
        if(!agent)
            return res.status(404).send('Agent with id is not found');
        res.send(agent);
    }catch (error) {
        res.status(500).send('Error Deleting Agent :'+error.message);
    }
    
});
module.exports=router;