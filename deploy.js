let fs = require("fs");
let solc = require("solc");
let Web3 = require("web3");

let contract = compileContract();
let web3 = createWeb3();
let sender = "0x3cb3a2e01391ce03678e87d401cac7fdf7040ad0";

deployContract(web3, contract, sender)
    .then(() => {
        console.log("deploy finished");
    })
    .catch((error) => {
        console.log(`Failed to deploy contract: ${error}`);
    });

function compileContract() {
    const input = {
        language: "Solidity",
        sources: {
            "Voter.sol": {
                content: fs.readFileSync("Voter.sol", "utf8"),
            },
        },
        settings: {
            outputSelection: {
                // return everything
                "*": {
                    "*": ["*"],
                },
            },
        },
    };

    console.log("compiling the contract");
    let compiledContract = JSON.parse(solc.compile(JSON.stringify(input)));
    let contract = compiledContract.contracts["Voter.sol"]["Voter"];
    // save abi file
    let abi = contract.abi;
    fs.writeFileSync("abi.json", JSON.stringify(abi));

    return contract;
}

function createWeb3() {
    let web3 = new Web3();
    web3.setProvider(new web3.providers.HttpProvider("http://localhost:8545"));
    return web3;
}

async function deployContract(web3, contract, sender) {
    let Voter = await new web3.eth.Contract(contract.abi);
    let byteCode = contract.evm.bytecode.object;

    const gas = await Voter.deploy({
        data: byteCode,
        arguments: [["option1", "option2"]],
    }).estimateGas();
    const contractInstance = await Voter.deploy({
        data: byteCode,
        arguments: [["option1", "option2"]],
    })
        .send({
            from: sender,
            gas: gas,
        })
        .on("transactionHash", (transactionHash) => {
            console.log("Transactiong hash: ", transactionHash);
        })
        .on("confirmation", (confirmationNumber) => {
            console.log(`Confirmation number: ${confirmationNumber}`);
        });

    console.log(`Contract address: ${contractInstance.options.address}`);
}
