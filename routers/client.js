const router = require('express').Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
var fs =require('fs');
var sha1 = require('sha1');
const {Client,client_validation} = require('../models/client');
const upload= require("../middleware/upload");
const service= require("../services/service");
var randomstring = require("randomstring");


// Get Client by ID for test
router.get('/:id',async (req,res)=>{
    let client = await Client.findById(req.params.id)
    
    if (!client){
          return res.status(400).send("Client Not Exist");
        }else{
            res.status(200).send(client);    
        }
    });

// get All Clients
router.get('',async (req,res)=>{
    try {
        let clients = await Client.find();
        res.status(200).send(clients)
    } catch (error) {
        res.status(500).send('Error get All Clients :'+error.message);
    }
    
});
// Sign In Client
router.post('/signin',async (req,res)=>{
    const email = req.body.email;
    const pass = req.body.pass ;

    try {
        let client = await Client.findOne({
          email
        });
        if (!client)
            return res.status(404).json("Client Not Exist");
        if (!client.is_verified)
            return res.status(403).json('Not Verified Client!');
        if (!client.is_blocked){
        let bool = await bcrypt.compare(pass, client.pass);
        if(!bool)
            return res.status(403).send('Incorrect Password !');
        let token = jwt.sign({id: client._id, name: client.name}, process.env.ACCESS_TOKEN_SECRET,{expiresIn:'1h'});
        res.header('x-access-token',token).send('Login Success !!!');
        }else{
            return res.status(403).json('Blocked Client!');
        }
    }catch (e) {
        console.error(e);
        res.status(500).send("Server Error");
      }
     
});

//Logout Client
router.post('/logout', async (req, res)=>{
	req.session.destroy();
	res.status(200).send('Logout Success !!!');
}); 

// Signup Client
router.post('/signup',upload, async (req,res)=>{
    // crypting pass
    let salt = await bcrypt.genSalt(10);
    req.body.pass = await bcrypt.hash(req.body.pass, salt);
    req.body.confirmation_code = randomstring.generate({
        length: 6,
      });
      console.log(req.body.confirmation_code);
    let client = new Client({
       cin : req.body.cin,
       nom : req.body.nom,
       prenom : req.body.prenom,
       pass : req.body.pass,
       email : req.body.email,
       phone : req.body.phone,
       confirmation_code : req.body.confirmation_code,
       image : req.file.filename,
    });

    try {
        let new_member= await client.save();
        // node mailer
        //Send MAil(token,email,url app,password)
        from = process.env.EMAIL;
        subject="Verification email for new client";
            
        html = {};
        html.content = fs.readFileSync(__dirname+"/../assets/new_client.html", "utf8");
        html.firstname = new_member.nom;
        html.confirmation_code = new_member.confirmation_code;
        service.Send_mail_new_client(from,new_member.email,subject,html);
        res.status(200).send(new_member);
    } catch (error) {
        res.status(500).send(error.message);
    }
    
});
// verif account
router.put('/verifmail', async (req, res)=> {
    let code_client=req.body.code
    
    let client_verif = await Client.findOne({confirmation_code : code_client });
      if (!client_verif){
          return res.status(404).send("Client Not Exist");
      }
      else{
         
            try {            
                await Client.updateOne({_id : client_verif._id}, {is_verified : 'true'});
                res.status(200).send('Verified User !!');
            } catch (error) {
                res.status(500).send('Error verify email Client  :'+error.message);
            }  
        
      }
});
//update client (Edit Profil) without image
router.put('/edit/:email',async (req,res)=>{
    let email = req.params.email;
    let old_pass = sha1(req.body.old_pass);
    req.body.pass = sha1(req.body.pass);
    let client = await Client.findOne({
        email
      });
      if (!client)
          return res.status(404).send("Client Not Exist");
        if(old_pass===client.pass){
            try {
                let results= client_validation_update.validate(req.body);
                if(results.error)
                    return res.status(403).send(results.error.details[0].message);
                
                await Client.updateOne({_id : client._id}, req.body);
                res.status(200).send(await Client.findById(client._id));
            } catch (error) {
                res.status(500).send('Error editing Client Profil :'+error.message);
            }  
        }else{
            return res.status(401).send("Incorrect Password !");
        }  
    
    
});
//update Client Image (Edit Profil image)
router.put('/editimage/:email', upload,async (req,res)=>{
    let email = req.params.email;
    let new_image='';
    let client = await Client.findOne({
        email
      });
    if (!client)
        return res.status(200).json({ message : "Client Not Exist"});
    if(req.file){
        new_image=req.file.filename;
        try{
            // Delete old Image from server
            // IN the front side you should pass the new image and the old image too
            fs.unlinkSync("../uploads/"+ req.body.old_image);
        }catch(err){
            console.log(err);
        }
        await Client.updateOne({_id : client._id}, {$set: { image : new_image} });
        res.status(200).json(await Client.findById(client._id));
    }else{
        res.status(200).json({ message : 'You must select a new Image' });
    }
});
//block client
router.put('/block/:id',async (req,res)=>{
    let client_id = req.params.id;
    var ObjectId = require('mongoose').Types.ObjectId;
    if(!ObjectId.isValid(client_id)){
        return res.status(200).json({ message : "Client Not Exist" });
    }

    let client = await Client.findById(client_id);
      if (!client){
          return res.status(200).json({ message : "Client Not Exist" });
      }
      else{
        try {            
            await Client.updateOne({_id : client_id}, {is_blocked : 'true'});
            res.status(200).json(await Client.findById(client_id));
        } catch (error) {
            res.status(500).send('Error blocking client  :'+error.message);
        }  
      }
    
});

//delete Client
router.delete('/delete/:id',async (req,res)=>{
    try {
        let client = await Client.findByIdAndRemove(req.params.id);
        if(!client)
            return res.status(200).json({ message: 'Client with id is not found' });
        res.status(200).json(client);
    }catch (error) {
        res.status(400).send('Error Deleting Client :'+error.message);
    }
    
});
module.exports=router;