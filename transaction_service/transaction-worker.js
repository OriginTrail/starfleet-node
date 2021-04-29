const Web3 = require('web3');

process.on('message', async(data) => {
    const {
        url,
        addressFrom,
        addressTo,
        privateKey
    } = JSON.parse(data);
    try{
        const web3 = new Web3(url);
        let balance = await web3.eth.getBalance(addressFrom);
        console.log(`${new Date()} - Balance of ${addressFrom} is ${balance}`);
        balance = await web3.eth.getBalance(addressTo);
        console.log(`${new Date()} - Balance of ${addressTo} is ${balance}`);
        const val = Math.floor(Math.random() * 100000);
        console.log(`${new Date()} - Attempting to make transaction from ${addressFrom} to ${addressTo} (amount: ${val})`);
        const createTransaction = await web3.eth.accounts.signTransaction(
            {
                from: addressFrom,
                to: addressTo,
                value: val,
                gasPrice: "0x01",
                gas: "0x1000000",
            },
            privateKey
        );
        // Deploy transaction
        const createReceipt = await web3.eth.sendSignedTransaction(
            createTransaction.rawTransaction
        );
        console.log(
            `${new Date()} - Transaction successful with hash: ${createReceipt.transactionHash}`
        );
        balance = await web3.eth.getBalance(addressFrom);
        console.log(`${new Date()} - Balance after transaction of ${addressFrom} is ${balance}`);
        balance = await web3.eth.getBalance(addressTo);
        console.log(`${new Date()} - Balance after transaction of ${addressTo} is ${balance}`);
        process.send('Finished');

    } catch (error) {
        process.send({ error: `${error.message}` });
    }


})