const StellarSdk = require('stellar-sdk');
const axios = require('axios');
const server = new StellarSdk.Server('https://horizon-testnet.stellar.org');


async function createAccount() {
    const keyPair = StellarSdk.Keypair.random();

    // console.log(
    //     keyPair.publicKey()
    // );

    const response = await axios.get(`https://friendbot.stellar.org/?addr=${keyPair.publicKey()}`);
    // console.log(response);

    return keyPair

    // const kp = StellarSdk.Keypair.fromSecret(keypair.secret());
    // kp.publicKey();
    // const transaction = StellarSdk.TransactionBuilder()
    // transaction.sign(keypair)
}

async function transfer(sourceKeyPair, receiverKeyPair, amount) {
    const sourcePublicKey = sourceKeyPair.publicKey();
    const receiverPublicKey = receiverKeyPair.publicKey();
    const account = await server.loadAccount(sourcePublicKey);
    const fee = await server.fetchBaseFee();
    const transaction = new StellarSdk.TransactionBuilder(account, {
        fee,
        networkPassphrase: StellarSdk.Networks.TESTNET
    }).addOperation(StellarSdk.Operation.payment({
        destination: receiverPublicKey,
        asset: StellarSdk.Asset.native(),
        amount: amount,
    }))
        .setTimeout(30)
        .build();
    transaction.sign(sourceKeyPair);
}

async function getTransactions(userPublicKeyPair) {
    return server.transactions()
        .forAccount(userPublicKeyPair)
        .call()
        .then(function (page) {
            // console.log('Page 1: ');
            // console.log(page.records);
            return page.records;
        })
        // .then(function (page) {
        //     console.log('Page 2: ');
        //     console.log(page.records);
        // })
        .catch(function (err) {
            console.log(err);
        });
}

module.exports = {
    createAccount,
    transfer,
    getTransactions
};