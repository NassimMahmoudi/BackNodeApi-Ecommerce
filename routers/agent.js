const router = require('express').Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
var fs =require('fs');
const auth = require('../middleware/auth');
const autoris = require('../middleware/autoris');
const {Agent,agent_validation,agent_validation_update} = require('../models/agent');
const upload= require("../middleware/upload");

// Get Agent by ID for test
router.get('/:id',async (req,res)=>{
    var ObjectId = require('mongoose').Types.ObjectId;
    if(!ObjectId.isValid(req.params.id)){
        return res.status(200).json({ message : "Claim Not Exist" });
    }
    let agent = await Agent.findById(req.params.id)
    if (!agent){
          return res.status(200).json({ message : "Agent Not Exist" });
        }else{
            res.status(200).send(agent);    
        }
    
    });

// Sign In Agent
router.post('/signin',async (req,res)=>{
    const email = req.body.email;
    const pass = req.body.pass ;

    try {
        let agent = await Agent.findOne({
          email
        });
        if (!agent)
          return res.status(200).json({ message : "Agent Not Exist" });
        let bool = await bcrypt.compare(pass, agent.pass);
        if(!bool)
            return res.status(200).json({ message : 'Incorrect Password !' });
        let token = jwt.sign({id: agent._id, name: agent.name, role: agent.role}, process.env.ACCESS_TOKEN_SECRET,{expiresIn:'1h'});
        res.header('x-access-token',token).json({ message : 'Login Success !!!'});
          
    }catch (e) {
        console.error(e);
        res.status(400).json({ message : "Server Error" });
      }
     
});
//Logout Agent
router.post('/logout', async (req, res)=>{
	req.session.destroy();
	res.status(200).json({ message : 'Logout Success !!!'});
}); 
// Add Agent
router.post('/add',upload, async (req,res)=>{
    // crypting pass
    let salt = await bcrypt.genSalt(10);
    req.body.pass = await bcrypt.hash(req.body.pass, salt);
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

    try {
        res.status(200).json(await agent.save());
    } catch (error) {
        res.status(400).json({ message : error.message });
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
          return res.status(200).json({ message : "Agent Not Exist" });
        if(old_pass===agent.pass){
            try {
                let results= agent_validation_update.validate(req.body);
                if(results.error)
                    return res.status(200).json({ message : results.error.details[0].message });
                
                await Agent.updateOne({_id : agent._id}, req.body);
                res.status(200).json(await Agent.findById(agent._id));
            } catch (error) {
                res.status(400).json({ message : 'Error editing Agent Profil :'+error.message });
            }  
        }else{
            return res.status(200).json({ message : "Incorrect Password !" });
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
        return res.status(200).json({ message : "Agent Not Exist" });
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
        res.status(200).json(await Agent.findById(agent._id));
    }else{
        res.status(200).json({ message :'You must select a new Image' });
    }
});
//delete Agent 
router.delete('/delete/:id',async (req,res)=>{
    try {
        let agent = await Agent.findByIdAndRemove(req.params.id);
        if(!agent)
            return res.status(200).json({ message : 'Agent with id is not found' });
        res.status(200).json(agent);
    }catch (error) {
        res.status(400).json({ message : 'Error Deleting Agent :'+error.message });
    }
    
});
module.exports=router;