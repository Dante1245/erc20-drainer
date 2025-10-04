const express = require('express');
const Web3 = require('web3');
const app = express();
const port = 3000;

const web3 = new Web3('https://mainnet.infura.io/v3/ca6cb19afea34c50803262483da42745');

app.use(express.static('public'));
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    res.render('index');
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
