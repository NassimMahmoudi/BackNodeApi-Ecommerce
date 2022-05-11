const router = require('express').Router();
var fs =require('fs');
const {Bill,bill_validation } = require('../models/bill');
const {Client} = require('../models/client');
const {Commande,commande_validation} = require('../models/commande');
const {Produit} = require('../models/produit');
const service= require("../services/service");

// Download pdf file
router.get("/download/:id_client/:id_commande",async (req, res) => {
    var ObjectId = require('mongoose').Types.ObjectId;
    if(!ObjectId.isValid(req.params.id_client)){
        return res.status(200).json({ message : "Client Not Exist" });
    }
    if(!ObjectId.isValid(req.params.id_commande)){
        return res.status(200).json({ message : "Commande Not Exist" });
    }
    let commande = await Commande.findById(req.params.id_commande);
    if (!commande){
        return res.status(200).json({ message : "Commande Not Exist" });
    }
    let client = await Client.findById(req.params.id_client);
    if (!client){
        return res.status(200).json({ message : "Client Not Exist" });
    }
    let fullname = client.nom+" "+client.prenom;
    let products_ids = commande.products;
    let products = [];
    for(let product in products_ids){
        let p = await Produit.findById(products_ids[product]._id)
        console.log(p);
        products.push({
            name : p.nom,
            price : p.prix,
            quantity : product.quantity,
        })
    }
    let bill = new Bill({
        fullname : fullname,
        cin : client.cin,
        total : commande.total,
        date_commande : commande.date_ajout,
        status : commande.status,
        products : products,
    });
    //let name_file=
    service.report(bill);
    //res.download("./files/"+name_file);
  });

module.exports=router;