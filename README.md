# voting-contract
A simple voting smart contract in Solidity that can be compiled and deployed to the testnet.

Contract address in Rinkeby testnet: https://rinkeby.etherscan.io/address/0x757d721aa804ce247ebce137b10be6c52fb0cbd4

`deploy.js` uses web3 to connect to the local `geth` instance and compiles the contract. 
After compiling the contract uses the account address to pay for the gas and deploy the contract to the testnet.

Keep in mind that you should create your own account in `geth` and replace the sender address with your address.
