const express = require('express');
const Web3 = require('web3');
require('dotenv').config();

const app = express();
const port = 3000;

const web3 = new Web3(new Web3.providers.HttpProvider(`https://mainnet.infura.io/v3/${process.env.INFURA_PROJECT_ID}`));

const contractABI = [ /* ABI from the compiled smart contract */ ];
const contractAddress = process.env.CONTRACT_ADDRESS;
const contract = new web3.eth.Contract(contractABI, contractAddress);

app.use(express.json());

app.post('/upload', async (req, res) => {
    const { hash, name } = req.body;
    const account = web3.eth.accounts.privateKeyToAccount(process.env.PRIVATE_KEY);

    const tx = contract.methods.uploadDocument(hash, name);
    const gas = await tx.estimateGas({ from: account.address });
    const data = tx.encodeABI();
    const nonce = await web3.eth.getTransactionCount(account.address);

    const signedTx = await account.signTransaction({
        to: contractAddress,
        data,
        gas,
        nonce,
        chainId: 1 // Mainnet
    });

    web3.eth.sendSignedTransaction(signedTx.rawTransaction)
        .on('receipt', receipt => {
            res.send(receipt);
        })
        .on('error', error => {
            res.status(500).send(error.toString());
        });
});

app.get('/document/:id', async (req, res) => {
    const documentId = req.params.id;
    try {
        const document = await contract.methods.getDocument(documentId).call();
        res.send(document);
    } catch (error) {
        res.status(500).send(error.toString());
    }
});

app.listen(port, () => {
    console.log(`eVault backend running at http://localhost:${port}`);
});
