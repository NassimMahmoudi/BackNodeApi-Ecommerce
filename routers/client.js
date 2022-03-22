const router = require('express').Router();
var sha1 = require('sha1');
const {Client,client_validation} = require('../models/client');

function validation(validator,req,res) {
    let results = validator.validate(req.body);
    if(results.error)
        return res.status(400).send(results.error.details[0].message);
}

// Get Client by ID for test
router.get('/:id',async (req,res)=>{
    let client = await Client.findById(req.params.id)
    if (!client){
          return res.status(400).json({
            message: "Client Not Exist"
          });
        }else{
            res.status(200).send(client);    
        }
    
    });

// Sign In Client
router.post('/signin',async (req,res)=>{
    const email = req.body.email;
    const pass = sha1(req.body.pass);

    try {
        let client = await Client.findOne({
          email
        });
        if (!client)
          return res.status(400).json({
            message: "Client Not Exist"
          });
        if(pass===client.pass){
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
//Logout Client
router.post('/logout', async (req, res)=>{
	//req.session.destroy();
	res.status(200).json({logout:true});
}); 
// Add Client
router.post('',async (req,res)=>{
    validation(client_validation,req,res);
    req.body.pass = sha1(req.body.pass);
    let client = new Client(req.body);   
    try {
        res.send(await client.save());
    } catch (error) {
        res.status(400).send(error.message);
    }
    
});

//delete Client
router.delete('/delete/:id',async (req,res)=>{
    try {
        let client = await Client.findByIdAndRemove(req.params.id);
        if(!client)
            return res.status(404).send('Client with id is not found');
        res.send(client);
    }catch (error) {
        res.status(400).send('Error Deleting Client :'+error.message);
    }
    
});
module.exports=router;