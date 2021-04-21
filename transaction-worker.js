const Web3 = require('web3');
let web3arr = [];

web3arr.push({'node':'boot','web3': new Web3('http://localhost:9933')});
web3arr.push({'node':'worker','web3': new Web3('http://localhost:9934')});

const wallets = [
    {'address':'0x81D288F95a78bc074ea7e831DEb6B046fEb3ef61', 'privatekey':'d4e95879434235e2da32f717faac64b71f81e62f5bf3d34e62d6de5e052155fe'},
    {'address':'0x0C5Bed27b0646Bd80A0F279af02648e48807174A', 'privatekey':'8c8afebd579db303d4231166e2a95c9602787aaa97531c9f185e44ee89c8cee9'}
];


const submit = async () => {
    let balance = await web3arr[0].web3.eth.getBalance(wallets[0].address);
    console.log(`Balance of ${wallets[0].address} is ${balance}`);
    balance = await web3arr[0].web3.eth.getBalance(wallets[1].address);
    console.log(`Balance of ${wallets[1].address} is ${balance}`);
    console.log(`Attempting to make transaction from ${wallets[0].address} to ${wallets[1].address}`);
    let createTransaction = await web3arr[0].web3.eth.accounts.signTransaction(
        {
            from: wallets[0].address,
            to: wallets[1].address,
            value: 154,
            gasPrice: "0x01",
            gas: "0x1000000",
        },
        wallets[0].privatekey
    );
    //console.log(createTransaction);
    //console.log("Transaction signed");
    // Deploy transaction
    let createReceipt = await web3arr[0].web3.eth.sendSignedTransaction(
        createTransaction.rawTransaction
    );
    console.log(
        `Transaction successful with hash: ${createReceipt.transactionHash}`
    );

    balance = await web3arr[1].web3.eth.getBalance(wallets[0].address);
    console.log(`Balance of ${wallets[0].address} is ${balance}`);
    balance = await web3arr[1].web3.eth.getBalance(wallets[1].address);
    console.log(`Balance of ${wallets[1].address} is ${balance}`);
    console.log(`Attempting to make transaction from ${wallets[1].address} to ${wallets[0].address}`);
    createTransaction = await web3arr[1].web3.eth.accounts.signTransaction(
        {
            from: wallets[1].address,
            to: wallets[0].address,
            value: 552,
            gasPrice: "0x01",
            gas: "0x1000000",
        },
        wallets[1].privatekey
    );
    //console.log(createTransaction);
    //console.log("Transaction signed");
    // Deploy transaction
    createReceipt = await web3arr[1].web3.eth.sendSignedTransaction(
        createTransaction.rawTransaction
    );
    console.log(
        `Transaction successful with hash: ${createReceipt.transactionHash}`
    );
};
submit();
