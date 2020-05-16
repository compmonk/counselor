const StellarSdk = require("stellar-sdk");
const axios = require("axios");

const stellarConfig = require("../settings").stellarConfig;
const server = new StellarSdk.Server(stellarConfig.testNetUrl);

const master = StellarSdk.Keypair.fromSecret(stellarConfig.masterPrivateKey);
let error = new Error();
errors = {};
error.http_code = 200;

async function createAccount() {
  const userKeyPair = StellarSdk.Keypair.random();
  const account = await server.loadAccount(master.publicKey());

  try {
    // const account = await server.loadAccount("ahdbabasbc");
    const transaction = new StellarSdk.TransactionBuilder(account, {
      fee: StellarSdk.BASE_FEE,
      networkPassphrase: StellarSdk.Networks.TESTNET,
    });

    if (!transaction.source.account_id) {
      //transaction.source.account_id
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
      console.log(JSON.stringify(transactionResult, null, 2));
      console.log("\nSuccess! View the transaction at: ");
      console.log(transactionResult._links.transaction.href);

      return {
        privateKey: userKeyPair.secret(),
        publicKey: userKeyPair.publicKey(),
      };
    } else {
      error["message"] = JSON.stringify({ errors: errors });
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
  try {
    const sourceKeyPair = StellarSdk.Keypair.fromSecret(sourcePrivateKeyPair);
    const receiverKeyPair = StellarSdk.Keypair.fromSecret(
      receiverPrivateKeyPair
    );

    const account = await server.loadAccount(sourceKeyPair.publicKey());
    const transaction = new StellarSdk.TransactionBuilder(account, {
      fee: StellarSdk.BASE_FEE,
      networkPassphrase: StellarSdk.Networks.TESTNET,
    });
    if (!transaction.source.account_id) {
      //transaction.source.account_id
      throw (errors["message"] = "Invalid Source account ID");
    }
    transaction.addOperation(
      // This operation sends the destination account XLM
      StellarSdk.Operation.payment({
        destination: receiverKeyPair.publicKey(),
        amount: amount,
        asset: StellarSdk.Asset.native(),
      })
    );

    if (!transaction.operations.length)
      throw (errors["amount"] =
        "Can not add operation on that transaction error"); //transaction.operations.length===1

    transaction.setTimeout(100);
    const tx = transaction.build();
    tx.sign(master);
    if (!tx.signatures.length)
      throw (errors["message"] = "Cant sign that transaction"); //transaction.signatures.length

    const transactionResult = await server.submitTransaction(tx);
    if (transactionResult && transactionResult.successful) {
      console.log(JSON.stringify(transactionResult, null, 2));
      console.log("\nSuccess! View the transaction at: ");
      console.log(transactionResult._links.transaction.href);

      return transactionResult.successful;
    } else {
      errors["message"] = "Transaction Failed";
      error.message = JSON.stringify({ errors: errors });
      throw error;
    }
  } catch (err) {
    errors["message"] = "Transaction Failed" + err;
    error.message = JSON.stringify({ errors: errors });
    error.http_code = 500;
    throw error;
  }
}

async function getBalance(userPrivateKey) {
  try {
    const account = await server.loadAccount(
      StellarSdk.Keypair.fromSecret(userPrivateKey).publicKey()
    );
    return account.balances;
  } catch (e) {
    error["message"] = "Get balance Failed" + e;
    error.message = JSON.stringify({ errors: error });
    error.http_code = 500;
    throw error;
  }
}

async function getTransactions(userPublicKeyPair) {
  try {
    const transactionCallBuilder = server.transactions();
    page = await transactionCallBuilder.forAccount(userPublicKeyPair).call();
    if(page && page.records)
    return page.records;
    else throw error["message"] = "Transaction call failed";
  } catch (e) {
    error["message"] = "Get Transaction Failed " + e;
    error.message = JSON.stringify({ errors: error });
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
