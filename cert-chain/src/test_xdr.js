const { TransactionBuilder, Networks, Operation, Account } = require("@stellar/stellar-sdk");

try {
    const dummyAccount = new Account("GBZULOWYXZF7453GDKN3I2ODLHH6J7UDBYBY7ZTR2E4Z6C2V5D6D5M6M", "0");
    const tx = new TransactionBuilder(dummyAccount, {
        fee: "100",
        networkPassphrase: Networks.TESTNET,
    })
        .addOperation(
            Operation.manageData({
                name: "Action",
                value: "Issue Certificate",
            })
        )
        .setTimeout(30)
        .build();

    console.log("XDR:", tx.toXDR());
} catch (err) {
    console.error(err);
}
