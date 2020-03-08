const StellarSdk = require('stellar-sdk');
const axios = require('axios');

const stellarConfig = require("../settings").stellarConfig;
const server = new StellarSdk.Server(stellarConfig.testNetUrl);

const master = StellarSdk.Keypair.fromSecret(stellarConfig.masterPrivateKey);

// console.log(master)

async function createAccount() {
    const userKeyPair = StellarSdk.Keypair.random();
    return await server.loadAccount(master.publicKey())
        .then((account) => {
            // console.log(user.publicKey());
            const transaction = new StellarSdk.TransactionBuilder(account, {
                fee: StellarSdk.BASE_FEE,
                networkPassphrase: StellarSdk.Networks.TESTNET,
            }).addOperation(
                // This operation sends the destination account XLM
                StellarSdk.Operation.createAccount({
                    destination: userKeyPair.publicKey(),
                    startingBalance: stellarConfig.startingBalance
                }),
            ).setTimeout(0)
                .build();
            transaction.sign(master);
            return server.submitTransaction(transaction)
        })
        .then((res) => {
            console.log(res);
            return {"privateKey": userKeyPair.secret(), "publicKey": userKeyPair.publicKey()};
        })
        .catch((err) => console.error(err));
}

async function transfer(sourcePrivateKeyPair, receiverPrivateKeyPair, amount) {
    const sourceKeyPair = StellarSdk.Keypair.fromSecret(sourcePrivateKeyPair);
    const receiverKeyPair = StellarSdk.Keypair.fromSecret(receiverPrivateKeyPair);

    return await server.loadAccount(sourceKeyPair.publicKey())
        .then((account) => {
            // console.log(user.publicKey());
            const transaction = new StellarSdk.TransactionBuilder(account, {
                fee: StellarSdk.BASE_FEE,
                networkPassphrase: StellarSdk.Networks.TESTNET,
            }).addOperation(
                // This operation sends the destination account XLM
                StellarSdk.Operation.payment({
                    destination: receiverKeyPair.publicKey(),
                    amount: amount,
                    asset: StellarSdk.Asset.native()
                }),
            ).setTimeout(0)
                .build();
            transaction.sign(master);
            return server.submitTransaction(transaction)
        })
        .then((res) => {
            console.log(res);
            return true;
        })
        .catch((err) => console.error(err));
}

async function getBalance(userPrivateKey) {
    return await server
        .loadAccount(StellarSdk.Keypair.fromSecret(userPrivateKey).publicKey())
        .then((account) => {
            // console.log(account.balances);
            return account.balances
        })
        .catch((err) => console.error(err))
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
    getTransactions,
    getBalance
};