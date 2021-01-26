const Web3 = require('web3');
const web3 = new Web3('http://localhost:9933');
// Variables definition
const addressFrom = '6Be02d1d3665660d22FF9624b7BE0551ee1Ac91b';
const addressTo = '0x44236223aB4291b93EEd10E4B511B37a398DEE55';
const privateKey = '99B3C12287537E38C90A9219D4CB074A89A16E9CDB20BF85728EBD97C343E342';
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