const Web3 = require('web3');

const web3 = new Web3('http://localhost:9933');

const testingUtilitiesContractAbi = require('./build/contracts/TestingUtilities').abi;
const testingUtilitiesContractBytecode = require('./build/contracts/TestingUtilities').bytecode;

const wallet = '0x8097c3C354652CB1EEed3E5B65fBa2576470678A';
const privateKey = 'e5be9a5092b81bca64be81d212e7f2f9eba183bb7a90954f7b76361f6edb5c0a';

const deploy = async () => {
    let createTransaction = await web3.eth.accounts.signTransaction({
        from: wallet,
        data: testingUtilitiesContractBytecode,
        value: "0x00",
        gasPrice: "01",
        gas: "2000000",
    }, privateKey);

    console.log(createTransaction);

    let createReceipt = await web3.eth.sendSignedTransaction(createTransaction.rawTransaction);
    console.log("Contract deployed at address", createReceipt.contractAddress);
    const testingUtilitiesContractAddress = createReceipt.contractAddress;

    let util = new web3.eth.Contract(testingUtilitiesContractAbi, testingUtilitiesContractAddress);
    let state = await util.methods.getInternalData().call();
    console.log(state);
    const data = util.methods.moveTheBlock().encodeABI();
    createTransaction = await web3.eth.accounts.signTransaction({
        from: wallet,
        to: testingUtilitiesContractAddress,
        data,
        value: "0x00",
        gasPrice: "01",
        gas: "2000000",
    }, privateKey);
    console.log(createTransaction);
    createReceipt = await web3.eth.sendSignedTransaction(createTransaction.rawTransaction);
    console.log(createReceipt);
    state = await util.methods.getInternalData().call();
    console.log(state);
};
deploy();