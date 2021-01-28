const Web3 = require('web3');
const web3 = new Web3('http://localhost:9933');

const PATH_TO_NODE = '../../../../../ot-node';

const testingUtilitiesContractAbi = require(`${PATH_TO_NODE}/modules/Blockchain/Ethereum/build/contracts/TestingUtilities`).abi;
const testingUtilitiesContractBytecode = require(`${PATH_TO_NODE}/modules/Blockchain/Ethereum/build/contracts/TestingUtilities`).bytecode;

const hubContractAbi = require(`${PATH_TO_NODE}/modules/Blockchain/Ethereum/build/contracts/Hub`).abi;
const hubContractBytecode = require(`${PATH_TO_NODE}/modules/Blockchain/Ethereum/build/contracts/Hub`).bytecode;

const profileStorageContractAbi = require(`${PATH_TO_NODE}/modules/Blockchain/Ethereum/build/contracts/ProfileStorage`).abi;
const profileStorageContractBytecode = require(`${PATH_TO_NODE}/modules/Blockchain/Ethereum/build/contracts/ProfileStorage`).bytecode;

const wallet = '0x8097c3C354652CB1EEed3E5B65fBa2576470678A';
const privateKey = 'e5be9a5092b81bca64be81d212e7f2f9eba183bb7a90954f7b76361f6edb5c0a';

const deployHubContract = async () => {
    try {
        let createTransaction = await web3.eth.accounts.signTransaction({
            from: wallet,
            data: hubContractBytecode,
            value: "0x00",
            gasPrice: "01",
            gas: "2000000",
        }, privateKey);

        let createReceipt = await web3.eth.sendSignedTransaction(createTransaction.rawTransaction);
        console.log("Contract deployed at address: ", createReceipt.contractAddress);

        const HubContract = new web3.eth.Contract(hubContractAbi, createReceipt.contractAddress);
        return HubContract;
    } catch (e) {
        console.log(e);
    }
};

const deployProfileStorageContract = async (hubContractAddress) => {
    try {
        const parameters = web3.eth.abi.encodeParameters(
            ['address'],
            [hubContractAddress],
        ).slice(2);

        let createTransaction = await web3.eth.accounts.signTransaction({
            from: wallet,
            data: `${hubContractBytecode}${parameters}`,
            value: "0x00",
            gasPrice: "01",
            gas: "2000000",
        }, privateKey);

        let createReceipt = await web3.eth.sendSignedTransaction(createTransaction.rawTransaction);
        console.log("Contract deployed at address: ", createReceipt.contractAddress);

        const ProfileStorageContract =
            new web3.eth.Contract(profileStorageContractAbi, createReceipt.contractAddress);
        return ProfileStorageContract;
    } catch (e) {
        console.log(e);
    }
};

const main = async () => {
    // let createTransaction = await web3.eth.accounts.signTransaction({
    //     from: wallet,
    //     data: testingUtilitiesContractBytecode,
    //     value: "0x00",
    //     gasPrice: "01",
    //     gas: "2000000",
    // }, privateKey);
    // let createReceipt = await web3.eth.sendSignedTransaction(createTransaction.rawTransaction);
    // console.log("Contract deployed at address: ", createReceipt.contractAddress);
    // const testingUtilitiesContractAddress = createReceipt.contractAddress;

    const hubContract = await deployHubContract();
    console.log(hubContract.options.address);
    const profileStorageCotract = await deployProfileStorageContract(hubContract.options.address);
    console.log(profileStorageCotract.options.address);

    // let util = new web3.eth.Contract(testingUtilitiesContractAbi, testingUtilitiesContractAddress);
    // let state = await util.methods.getInternalData().call();
    // console.log(`Current Utitlites cotract state: ${state}`);
    // const data = util.methods.moveTheBlock().encodeABI();
    // createTransaction = await web3.eth.accounts.signTransaction({
    //     from: wallet,
    //     to: testingUtilitiesContractAddress,
    //     data,
    //     value: "0x00",
    //     gasPrice: "01",
    //     gas: "2000000",
    // }, privateKey);
    // createReceipt = await web3.eth.sendSignedTransaction(createTransaction.rawTransaction);
    // state = await util.methods.getInternalData().call();
    // console.log(`Current Utitlites cotract state: ${state}`);

};
main();