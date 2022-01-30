const assert = require("assert");
const ganache = require("ganache-cli");
const Web3 = require("web3");
const web3 = new Web3(ganache.provider());
const contractFile = require('../compile');

let accounts;
let inbox;
const bytecode = contractFile.evm.bytecode.object;
const abi = contractFile.abi;

beforeEach(async () => {
    accounts = await web3.eth.getAccounts();
    console.log('Attempting to deploy from account', accounts[0]);
    inbox = await new web3.eth.Contract(abi)
        .deploy({
            data: bytecode,
            arguments: ['Hi there!']
        })
        .send({
            from: accounts[0],
            gas: "1000000"
        });
});

describe("Inbox", () => {
    it("deploys a contract", () => {
        console.log('inbox:', inbox);
    });
});