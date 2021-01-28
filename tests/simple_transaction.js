const Web3 = require('web3');
const web3 = new Web3('http://localhost:9933');
// Variables definition
const addressFrom = '0x8097c3C354652CB1EEed3E5B65fBa2576470678A';
const addressTo = '0x44236223aB4291b93EEd10E4B511B37a398DEE55';
const privateKey = 'e5be9a5092b81bca64be81d212e7f2f9eba183bb7a90954f7b76361f6edb5c0a';
// const addressTo = '0x6Be02d1d3665660d22FF9624b7BE0551ee1Ac91b';
// const privateKey = '99B3C12287537E38C90A9219D4CB074A89A16E9CDB20BF85728EBD97C343E342';
// Create transaction
const deploy = async () => {
    const test = web3.eth.accounts.privateKeyToAccount('0xe5be9a5092b81bca64be81d212e7f2f9eba183bb7a90954f7b76361f6edb5c0a');

    var balance = await web3.eth.getBalance(addressFrom);
    console.log(`Balance of ${addressFrom} is ${balance}`);
    balance = await web3.eth.getBalance(addressTo);
    console.log(`Balance of ${addressTo} is ${balance}`);
    console.log(
        `Attempting to make transaction from ${addressFrom} to ${addressTo}`
    );
    const createTransaction = await web3.eth.accounts.signTransaction(
        {
            from: addressFrom,
            to: addressTo,
            value: web3.utils.toWei('1', 'ether'),
            gas: 30000,
            gasPrice: 1000,
            chainId: 42,
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