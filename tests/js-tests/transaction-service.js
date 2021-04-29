const child = require('child_process');
const config = require('./transaction-config.json')
const wallets = config.wallets;
const nodes = config.nodes;
let workerArr = [];

async function main() {
    let walletToNum = 0;
    let walletFromNum = 0;
    let errorCounter = 0;
    let transactionCounter = 0;

    do {

        walletFromNum = Math.floor(Math.random() * wallets.length);

        do { // Chose different wallet to receive
            walletToNum = Math.floor(Math.random() * wallets.length);
        } while (walletToNum == walletFromNum);

        let nodeNum = Math.floor(Math.random() * nodes.length);
        console.log("Executing on node: " + nodes[nodeNum].name);
        let workerFork = child.fork('transaction-worker.js');
        workerFork.send(JSON.stringify({
            'url': nodes[nodeNum].url,
            'addressFrom': wallets[walletFromNum].address,
            'addressTo': wallets[walletToNum].address,
            'privateKey': wallets[walletFromNum].privatekey,
        }));

        transactionCounter++;
        workerArr.push(workerFork);

        workerFork.on('message', async (response) => {
            if (response.error) {
                console.log("New error at node: " + nodes[nodeNum].url);
                console.log("Total number of errors: " + ++errorCounter + " (total number of transactions: " + transactionCounter + " )");
                console.log(response.error);
            }
            workerArr = workerArr.filter(item => item.pid !== workerFork.pid);
            workerFork.kill();
        });

        await sleepForMilliseconds(5 * 1000);

    } while (true);

}

process.on('SIGINT', function(){
    console.log("SIGINT");
    for(let worker of workerArr) {
        worker.kill();
    }
    process.exit();
});

async function sleepForMilliseconds(milliseconds) {
    await new Promise(r => setTimeout(r, milliseconds));
}

main();
