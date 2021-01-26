const Web3 = require('web3');
const web3 = new Web3('http://localhost:9933');
// Variables definition
const addressFrom = '0xd43593c715fdd31c61141abd04a99fd6822c8558';
const addressTo = '0x44236223aB4291b93EEd10E4B511B37a398DEE55';
const privateKey = 'e5be9a5092b81bca64be81d212e7f2f9eba183bb7a90954f7b76361f6edb5c0a';
// Create transaction
const deploy = async () => {
    console.log(
        `Attempting to make transaction from ${addressFrom} to ${addressTo}`
    );
    const createTransaction = await web3.eth.accounts.signTransaction(
        {
            from: addressFrom,
            to: addressTo,
            value: web3.utils.toWei('100', 'ether'),
            gas: 21000,
        },
        privateKey
    );
    // Deploy transaction
    const createReceipt = await web3.eth.sendSignedTransaction(
        createTransaction.rawTransaction
    );
    console.log(
        `Transaction successful with hash: ${createReceipt.transactionHash}`
    );
};
deploy();