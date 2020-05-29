const StellarSdk = require("stellar-sdk");
const axios = require("axios");

const stellarConfig = require("../../settings").stellarConfig;
const server = new StellarSdk.Server(stellarConfig.testNetUrl);
const master = StellarSdk.Keypair.fromSecret(stellarConfig.masterPrivateKey);

async function createAccount() {
    let error = new Error();
    let errors = {};
    error.http_code = 200;
    const userKeyPair = StellarSdk.Keypair.random();
    const account = await server.loadAccount(master.publicKey());

    try {
        const transaction = new StellarSdk.TransactionBuilder(account, {
            fee: StellarSdk.BASE_FEE,
            networkPassphrase: StellarSdk.Networks.TESTNET,
        });

        if (!transaction.source.account_id) {
            errors["message"] = "Invalid account ID";
            throw errors;
        }

        transaction.addOperation(
            StellarSdk.Operation.createAccount({
                // This operation sends the destination account XLM
                destination: userKeyPair.publicKey(),
                startingBalance: stellarConfig.startingBalance,
            })
        );
        if (!transaction.operations.length)
            throw (errors["message"] = "transaction.operations.length error"); //transaction.operations.length===1
        transaction.setTimeout(100);
        const tx = transaction.build();
        tx.sign(master);
        if (!tx.signatures.length)
            throw (errors["message"] = "Cant sign that transaction"); //transaction.signatures.length

        const transactionResult = await server.submitTransaction(tx);
        if (transactionResult && transactionResult.successful) {
            // console.log(JSON.stringify(transactionResult, null, 2));
            // console.log("\nSuccess! View the transaction at: ");
            // console.log(transactionResult._links.transaction.href);

            return {
                privateKey: userKeyPair.secret(),
                publicKey: userKeyPair.publicKey(),
            };
        } else {
            error["message"] = JSON.stringify({errors: errors});
            error.http_code = 500;
            throw error;
        }
    } catch (e) {
        error.message = "Create account failed" + e;
        error.http_code = 500;
        throw error;
    }
}

async function transfer(sourcePrivateKeyPair, receiverPrivateKeyPair, amount) {
    let error = new Error();
    let errors = {};
    error.http_code = 200;
    try {
        const sourceKeyPair = StellarSdk.Keypair.fromSecret(sourcePrivateKeyPair);
        const receiverKeyPair = StellarSdk.Keypair.fromSecret(receiverPrivateKeyPair);

        const account = await server.loadAccount(sourceKeyPair.publicKey());
        const transaction = new StellarSdk.TransactionBuilder(account, {
            fee: StellarSdk.BASE_FEE,
            networkPassphrase: StellarSdk.Networks.TESTNET,
        });
        if (!transaction.source.account_id) {
            //transaction.source.account_id
            errors["source"] = "Invalid source account";
            error.message = JSON.stringify({errors: errors});
            error.http_code = 400
            throw error;

        }
        transaction.addOperation(
            // This operation sends the destination account XLM
            StellarSdk.Operation.payment({
                destination: receiverKeyPair.publicKey(),
                amount: amount,
                asset: StellarSdk.Asset.native(),
            })
        );

        if (!transaction.operations.length) {
            errors["transaction"] = "Cannot add operation on that transaction";
            error.message = JSON.stringify({errors: errors});
            error.http_code = 400
            throw error;
        }

        transaction.setTimeout(100);
        const tx = transaction.build();
        tx.sign(sourceKeyPair);
        if (!tx.signatures.length) {
            errors["message"] = "Cannot sign the transaction";
            error.message = JSON.stringify({errors: errors});
            error.http_code = 400
            throw error;
        }

        const transactionResult = await server.submitTransaction(tx);
        if (transactionResult && transactionResult['successful']) {
            return transactionResult.successful;
        } else {
            errors["message"] = "Transaction Failed";
            error.message = JSON.stringify({errors: errors});
            error.http_code = 400
            throw error;
        }
    } catch (e) {
        throw e
    }
}

async function getBalance(userPrivateKey) {
    let error = new Error();
    let errors = {};
    error.http_code = 200;
    try {
        const account = await server.loadAccount(
            StellarSdk.Keypair.fromSecret(userPrivateKey).publicKey()
        );
        return account.balances;
    } catch (e) {
        error["message"] = "Get balance Failed" + e;
        error.message = JSON.stringify({errors: error});
        error.http_code = 500;
        throw error;
    }
}

async function getTransactions(userPublicKeyPair) {
    let error = new Error();
    let errors = {};
    error.http_code = 200;
    try {
        const transactionCallBuilder = server.transactions();
        page = await transactionCallBuilder.forAccount(userPublicKeyPair).call();
        if (page && page.records)
            return page.records;
        else throw error["message"] = "Transaction call failed";
    } catch (e) {
        error["message"] = "Get Transaction Failed " + e;
        error.message = JSON.stringify({errors: error});
        error.http_code = 500;
        throw error;
    }
}

module.exports = {
    createAccount,
    transfer,
    getTransactions,
    getBalance,
};
