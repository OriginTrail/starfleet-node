const Web3 = require('web3');
// const EthereumTx = require('ethereumjs-tx').Transaction;
// try {
//     var lightwallet = require('eth-lightwallet');
// } catch (err) {
//     delete global._bitcore;
//     var lightwallet = require('eth-lightwallet');
// }
// const { txutils } = lightwallet;
const web3 = new Web3('http://localhost:9933');
const testingUtilitiesContractAbi = require('../../ot-node/modules/Blockchain/Ethereum/build/contracts/TestingUtilities').abi;
const testingUtilitiesContractBytecode = require('../../ot-node/modules/Blockchain/Ethereum/build/contracts/TestingUtilities').bytecode;
const wallet = '0x8097c3C354652CB1EEed3E5B65fBa2576470678A';
const privateKey = 'e5be9a5092b81bca64be81d212e7f2f9eba183bb7a90954f7b76361f6edb5c0a';
const main = async () => {
    // const devAccount = web3.eth.accounts.create();
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
    // let util = new web3.eth.Contract(testingUtilitiesContractAbi, testingUtilitiesContractAddress);
    // let state = await util.methods.getInternalData().call();
    // console.log(state);
    // const buildContractTransaction = async (wallet, contractAddress, contractAbi, functionName, args) => {
    //     const nonce = await web3.eth.getTransactionCount(wallet);
    //     const txOptions = {
    //         gasLimit: web3.utils.toHex(800000),
    //         gasPrice: web3.utils.toHex(123),
    //         to: contractAddress,
    //         nonce: nonce
    //     };
    //     return txutils.functionTx(
    //         contractAbi,
    //         functionName,
    //         args,
    //         txOptions
    //     );
    // };
    // const signAndSendTransaction = async function(wallet, privateKey, tx) {
    //     try {
    //         const transaction = new EthereumTx(tx);
    //         transaction.sign(Buffer.from(privateKey, 'hex'));
    //         const serializedTx = transaction.serialize().toString('hex');
    //         return web3.eth.sendSignedTransaction(`0x${serializedTx}`);
    //     } catch (err) {
    //         console.log(err);
    //     }
    // };
    //
    //
    // const txApproval = await buildContractTransaction(wallet,  testingUtilitiesContractAddress, testingUtilitiesContractAbi, 'moveTheBlock', []);
    // await signAndSendTransaction(wallet, privateKey, txApproval);
    //
    // util = new web3.eth.Contract(testingUtilitiesContractAbi, testingUtilitiesContractAddress);
    // state = await util.methods.getInternalData().call();
    // console.log(state);
};
main();