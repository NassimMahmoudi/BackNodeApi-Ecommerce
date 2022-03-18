require('./db/connect')
const express = require('express');

const agent_router = require('./routers/agent');
const produit_router = require('./routers/produit');

let app = express();

app.use(express.json());

app.use('/api/agent',agent_router);
app.use('/api/produit',produit_router);

app.listen(3000);