const Token = artifacts.require("Token");
const BoomSwap = artifacts.require("BoomSwap");

module.exports = async function(deployer) {
  
  await deployer.deploy(Token);
  const token = await Token.deployed()

  await deployer.deploy(BoomSwap);
  const boomSwap = await BoomSwap.deployed()

  //transfer token to BooMSwap
  await token.transfer(boomSwap.address, '1000000000000000000000000')

};
