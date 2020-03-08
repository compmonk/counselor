const StellarSdk = require('stellar-sdk');
const axios = require('axios');


async function createAccount() {
    const keyPair = StellarSdk.Keypair.random();

    console.log(
        keyPair.publicKey()
    );

    const response = await axios.get(`https://friendbot.stellar.org/?addr=${keyPair.publicKey()}`);
    // console.log(response);

    return keyPair

    // const kp = StellarSdk.Keypair.fromSecret(keypair.secret());
    // kp.publicKey();
    // const transaction = StellarSdk.TransactionBuilder()
    // transaction.sign(keypair)
}

module.exports = {
    createAccount
};