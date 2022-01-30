const assert = require("assert");
const ganache = require("ganache-cli");
const Web3 = require("web3");
const web3 = new Web3(ganache.provider());
const contractFile = require('../compile');

let accounts;
let inbox;
const bytecode = contractFile.evm.bytecode.object;
const abi = contractFile.abi;
const INITIAL_MESSAGE = "Hi there!";

beforeEach(async () => {
    accounts = await web3.eth.getAccounts();
    inbox = await new web3.eth.Contract(abi)
        .deploy({
            data: bytecode,
            arguments: [INITIAL_MESSAGE]
        })
        .send({
            from: accounts[0],
            gas: "1000000"
        });
});

describe("Inbox", () => {
    it("deploys a contract", () => {
        assert.ok(inbox.options.address);
    });

    it('has a default message', async () => {
        const message = await inbox.methods.message().call();
        assert.equal(message, INITIAL_MESSAGE);
    });

    it('can change the message', async () => {
        await inbox.methods.setMessage('Bye').send({
            from: accounts[0],
            gas: "1000000"
        });
        const message = await inbox.methods.message().call();
        assert.equal(message, 'Bye');
    });
});