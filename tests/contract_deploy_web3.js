const Web3 = require('web3');
const web3 = new Web3('http://localhost:9933');

const PATH_TO_NODE = '../../../../../ot-node';

const testingUtilitiesContractAbi = require(`${PATH_TO_NODE}/modules/Blockchain/Ethereum/build/contracts/TestingUtilities`).abi;
const testingUtilitiesContractBytecode = require(`${PATH_TO_NODE}/modules/Blockchain/Ethereum/build/contracts/TestingUtilities`).bytecode;

const hubContractAbi = require(`${PATH_TO_NODE}/modules/Blockchain/Ethereum/build/contracts/Hub`).abi;
const hubContractBytecode = require(`${PATH_TO_NODE}/modules/Blockchain/Ethereum/build/contracts/Hub`).bytecode;

const profileContractAbi = require(`${PATH_TO_NODE}/modules/Blockchain/Ethereum/build/contracts/Profile`).abi;
const profileContractBytecode = require(`${PATH_TO_NODE}/modules/Blockchain/Ethereum/build/contracts/Profile`).bytecode;

const wallet = '0x8097c3C354652CB1EEed3E5B65fBa2576470678A';
const privateKey = 'e5be9a5092b81bca64be81d212e7f2f9eba183bb7a90954f7b76361f6edb5c0a';

const deployHubContract = async () => {
    try {
        console.log("Attempting to deploy Hub contract");
        let createTransaction = await web3.eth.accounts.signTransaction({
            from: wallet,
            data: hubContractBytecode,
            value: "0x00",
            gasPrice: "01",
            gas: "2000000",
        }, privateKey);

        let createReceipt = await web3.eth.sendSignedTransaction(createTransaction.rawTransaction);
        console.log("Hub contract deployed at address: ", createReceipt.contractAddress);

        const HubContract = new web3.eth.Contract(hubContractAbi, createReceipt.contractAddress);
        return HubContract;
    } catch (e) {
        console.log(e);
    }
};

const deployProfileContract = async (hubContractAddress) => {
    try {
        console.log("Attempting to deploy Profile contract");
        const parameters = web3.eth.abi.encodeParameters(
            ['address'],
            [hubContractAddress],
        ).slice(2);

        let createTransaction = await web3.eth.accounts.signTransaction({
            from: wallet,
            data: `${profileContractBytecode}${parameters}`,
            value: "0x00",
            gasPrice: "01",
            gas: "6500000",
        }, privateKey);

        let createReceipt = await web3.eth.sendSignedTransaction(createTransaction.rawTransaction);
        console.log("Profile contract deployed at address: ", createReceipt.contractAddress);

        const ProfileContract =
            new web3.eth.Contract(profileContractAbi, createReceipt.contractAddress);
        return ProfileContract;
    } catch (e) {
        console.log(e);
    }
};

const setProfileContractAddress = async (hubContract, profileContract) => {
    const data = hubContract.methods
        .setContractAddress('Profile', profileContract.options.address).encodeABI();

    const createTransaction = await web3.eth.accounts.signTransaction({
        from: wallet,
        to: hubContract.options.address,
        data,
        value: "0x00",
        gasPrice: "01",
        gas: "2000000",
    }, privateKey);
    const createReceipt = await web3.eth.sendSignedTransaction(createTransaction.rawTransaction);
};

const main = async () => {
    const hubContract = await deployHubContract();
    const profileContract = await deployProfileContract(hubContract.options.address);

    let state = await hubContract.methods.getContractAddress('Profile').call();
    console.log(`\n\nInitial Profile contract address written in hub contract is: ${state}`);

    await setProfileContractAddress(hubContract, profileContract);

    state = await hubContract.methods.getContractAddress('Profile').call();
    console.log(`Final Profile contract address written in hub contract is:   ${state}`);


};
main();