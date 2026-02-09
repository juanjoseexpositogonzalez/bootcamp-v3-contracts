const { loadFixture, dropTransaction } = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const { expect } = require("chai");
const { ethers, userConfig } = require("hardhat");

const {
    deployExchangeFixture,
    depositExchangeFixture,
    orderExchangeFixture 
} = require("./helpers/ExchangeFixtures")

const tokens = (n) => {
    return ethers.parseUnits(n.toString(), 18);
}

describe("Exchange", () => {
    describe("Deployment", () => {
        it("tracks the fee account", async () => { 
            const { exchange, accounts } = await loadFixture(deployExchangeFixture);       
            expect(await exchange.feeAccount()).to.equal(accounts.feeAccount.address);
        });

        it("tracks the fee percent", async () => { 
            const { exchange } = await loadFixture(deployExchangeFixture);       
            expect(await exchange.feePercent()).to.equal(10);
        });
    }); // Describe Deployment

    describe("Depositing Tokens", () => {
        const AMOUNT = tokens(100);
        describe("Success", () => {
            it("tracks the token deposit", async () => {
                const { tokens: { token0 }, exchange } = await loadFixture(depositExchangeFixture);
                expect(await token0.balanceOf(await exchange.getAddress())).to.equal(AMOUNT);
            });

            it("tracks user1's balance", async () => {
                const { tokens: { token0 }, exchange, accounts } = await loadFixture(depositExchangeFixture);
                expect(await exchange.totalBalanceOf(await token0.getAddress(), accounts.user1.address)).to.equal(AMOUNT);
            });

            it("emits a TokensDeposited event", async () => {
                const { tokens: { token0 }, exchange, accounts, transaction } = await loadFixture(depositExchangeFixture);
                await expect(transaction).to.emit(exchange, "TokensDeposited")
                    .withArgs(
                        await token0.getAddress(),
                        accounts.user1.address,
                        AMOUNT,
                        await exchange.totalBalanceOf(await token0.getAddress(), accounts.user1.address)
                    )
            });

        }); // Describe Success

        describe("Failure", () => {
            it("fails when no tokens are approved", async() => {
                const { tokens: { token0 }, exchange, accounts } = await loadFixture(deployExchangeFixture);
                // const ERROR = "Exchange: Token transfer failed";

                await expect(exchange.connect(accounts.user1).depositToken(await token0.getAddress(), AMOUNT))
                    .to.be.reverted;
            })

        });  // Describe Failure
       
    }); // Describe Depositing Tokens

    describe("Withdrawing Tokens", () => {
        const AMOUNT = tokens(100);
        describe("Success", () => {
            it("withdraws token funds", async () => {
                const { tokens: { token0 }, exchange, accounts } = await loadFixture(depositExchangeFixture);

                // Now withdraw tokens
                const transaction = await exchange.connect(accounts.user1).withdrawToken(await token0.getAddress(), AMOUNT);
                await transaction.wait();

                expect(await token0.balanceOf(await exchange.getAddress())).to.equal(0);
            });

            it("tracks user1's balance", async () => {
                const { tokens: { token0 }, exchange, accounts } = await loadFixture(depositExchangeFixture);

                // Now withdraw tokens
                const transaction = await exchange.connect(accounts.user1).withdrawToken(await token0.getAddress(), AMOUNT);
                await transaction.wait();

                expect(await exchange.totalBalanceOf(await token0.getAddress(), accounts.user1.address)).to.equal(0);
            });

            it("emits a TokensWithdrawn event", async () => {
                const { tokens: { token0 }, exchange, accounts } = await loadFixture(depositExchangeFixture);
                
                // Now withdraw tokens
                const transaction = await exchange.connect(accounts.user1).withdrawToken(await token0.getAddress(), AMOUNT);
                await transaction.wait();

                await expect(transaction).to.emit(exchange, "TokensWithdrawn")
                    .withArgs(
                        await token0.getAddress(),
                        accounts.user1.address,
                        AMOUNT,
                        await exchange.totalBalanceOf(await token0.getAddress(), accounts.user1.address)
                    )
            });

        }); // Describe Success

        describe("Failure", () => {
            it("fails for insufficient balances", async() => {
                const { tokens: { token0 }, exchange, accounts } = await loadFixture(deployExchangeFixture);
                const ERROR = "Exchange: Insufficient balance";

                await expect(exchange.connect(accounts.user1).withdrawToken(await token0.getAddress(), AMOUNT))
                    .to.be.revertedWith(ERROR);
            })

        });  // Describe Failure
       
    }); // Describe Withdrawing Tokens

    describe("Making Orders", () => {
        describe("Success", () => {
            it("tracks the newly created order", async () => {
                const { exchange } = await loadFixture(orderExchangeFixture);

                expect(await exchange.orderCount()).to.equal(1);

            });

            it("correctly updates user activa balance", async() => {
                const { tokens: { token0 }, exchange, accounts, transaction } = await loadFixture(orderExchangeFixture);
                
                const AMOUNT = tokens(1);

                expect(await exchange.activeBalanceOf(await token0.getAddress(), accounts.user1.address))
                    .to.equal(AMOUNT);

            });

            it("emits a OrderCreated event", async () => {
                const { tokens: { token0, token1 }, exchange, accounts, transaction } = await loadFixture(orderExchangeFixture);

                const ORDER_ID = 1;
                const AMOUNT = tokens(1);
                const { timestamp } = await ethers.provider.getBlock()

                
                await expect(transaction).to.emit(exchange, "OrderCreated")
                    .withArgs(
                        ORDER_ID,
                        accounts.user1.address,
                        await token1.getAddress(),
                        AMOUNT,
                        await token0.getAddress(),
                        AMOUNT,
                        timestamp                        
                    )
            });

        }); // Describe Success

        describe("Failure", () => {
            it("rejects with no balance", async() => {
                const { tokens: { token0, token1 }, exchange, accounts } = await loadFixture(deployExchangeFixture);
                const ERROR = "Exchange: Insufficient balance";

                await expect(exchange.connect(accounts.user1).makeOrder(
                    await token1.getAddress(),
                    tokens(1),
                    await token0.getAddress(),
                    tokens(1)
                )).to.be.revertedWith(ERROR);
            });

            it("rejects orders over user's balance", async() => {
                const { tokens: { token0, token1 }, exchange, accounts } = await loadFixture(orderExchangeFixture);
                const ERROR = "Exchange: Insufficient balance";

                await expect(exchange.connect(accounts.user1).makeOrder(
                    await token1.getAddress(),
                    tokens(100),
                    await token0.getAddress(),
                    tokens(100)
                )).to.be.revertedWith(ERROR);
            });

        });  // Describe Failure
       
    }); // Describe Making Orders

}); // Describe Exchange
