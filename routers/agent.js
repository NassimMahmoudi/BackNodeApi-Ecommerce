const router = require('express').Router();
var sha1 = require('sha1');
const {Agent,agent_validation} = require('../models/agent');
const uploadController = require("../controllers/upload");
function validation(validator,req,res) {
    let results = validator.validate(req.body);
    if(results.error)
        return res.status(400).send(results.error.details[0].message);
}

// Get Agent by ID for test
router.get('/:id',async (req,res)=>{
    let agent = await Agent.findById(req.params.id)
    if (!agent){
          return res.status(400).json({
            message: "Agent Not Exist"
          });
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
          return res.status(400).json({
            message: "Agent Not Exist"
          });
        if(pass===agent.pass){
            res.status(200).json({sign_in:true  });  
        }else{
            return res.status(401).json({
                message: "Incorrect Password !"
              });
        }  
    }catch (e) {
        console.error(e);
        res.status(500).json({
          message: "Server Error"
        });
      }
     
});
//Logout Agent
router.post('/logout', async (req, res)=>{
	//req.session.destroy();
	res.status(200).json({logout:true});
}); 
// Add Agent
router.post('',async (req,res)=>{
    validation(agent_validation,req,res);
    // upload agent photo
    req.body.image=uploadController.uploadFiles;
    // crypting pass
    req.body.pass = sha1(req.body.pass);
    let agent = new Agent(req.body);   
    try {
        res.send(await agent.save());
    } catch (error) {
        res.status(400).send(error.message);
    }
    
});
//update agent (Edit Profil)
router.put('/:email',async (req,res)=>{
    const email = req.params.email;
    const old_pass = sha1(req.body.old_pass);
    let agent = await Agent.findOne({
        email
      });
      if (!agent)
          return res.status(404).json({
            message: "Agent Not Exist"
          });
        if(old_pass===agent.pass){
            try {
                let results= agent_validation.validate(req.body);
                if(results.error)
                    return res.status(400).send(results.error.details[0].message);
                
                await Agent.updateOne({_id : req.params.id}, req.body);
                res.send(await Produit.Agent(req.params.id));
            } catch (error) {
                res.status(500).send('Error editing Agent Profil :'+error.message);
            }  
        }else{
            return res.status(401).json({
                message: "Incorrect Password !"
              });
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