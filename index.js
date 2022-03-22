require('./db/connect')
const cors = require("cors");
const express = require('express');

const agent_router = require('./routers/agent');
const produit_router = require('./routers/produit');
const client_router = require('./routers/client');
const commande_router = require('./routers/commande');
const facture_router = require('./routers/facture');
//const upload_router = require('./routers/upload');

let app = express();
//cors provides Express middleware to enable CORS with various options
var corsOptions = {
    origin: "http://localhost:3001"
  };
app.use(cors(corsOptions));
app.use(express.json());

app.use('/api/agent',agent_router);
app.use('/api/produit',produit_router);
app.use('/api/client',client_router);
app.use('/api/commande',commande_router);
app.use('/api/facture',facture_router);
//app.use('/api/upload',upload_router);
let port = 3000;
app.listen(port,() => {
    console.log(`Running at localhost:${port}`);
  });