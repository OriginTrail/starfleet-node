const PrivateKeyProvider = require('./private-provider');
// Standalone Development Node Private Key
const privateKeyDev =
   '99B3C12287537E38C90A9219D4CB074A89A16E9CDB20BF85728EBD97C343E342';

const PATH_TO_NODE = '../../ot-node';

module.exports = {
   contracts_directory: `${PATH_TO_NODE}/modules/Blockchain/Ethereum/contracts/`,
   contracts_build_directory: `${PATH_TO_NODE}/modules/Blockchain/Ethereum/build/contracts/`,
   migrations_directory: `${PATH_TO_NODE}/modules/Blockchain/Ethereum/migrations/`,
   networks: {
      // Standalode Network
      dev: {
         provider: () => {
            if (!privateKeyDev.trim()) {
               throw new Error('Please enter a private key with funds, you can use the default one');
            }
            return new PrivateKeyProvider(privateKeyDev, 'http://localhost:9933/', 1281)
         },
         gas: 3000000,
         gas_price: 30000,
         network_id: 1281,
      },
   },
   // Solidity 0.7.0 Compiler
   compilers: {
      solc: {
        version: "^0.4.24"
      }
   },
   // Moonbeam Truffle Plugin
   plugins: ['moonbeam-truffle-plugin']
};
