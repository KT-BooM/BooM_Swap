const Token = artifacts.require('Token')
const BoomSwap = artifacts.require('BoomSwap')

require('chai')
	.use(require('chai-as-promised'))
	.should()

function tokens(n){
	return web3.utils.toWei(n, 'ether')
}

contract('BoomSwap', ([deployer, investor]) => {

	let token, boomSwap

	before(async () => {
		token = await Token.new()
		boomSwap = await BoomSwap.new(token.address)
		await token.transfer(boomSwap.address, tokens('1000000'))
	})

	describe('Token deployment', async () => {
		it('contract has BooM Token name', async () => {
			const name = await token.name()
			assert.equal(name, 'BooM Token')
		})
	})

	describe('BoomSwap deployment', async () => {
		it('contract has a BooMSwap name', async () => {
			const name = await boomSwap.name()
			assert.equal(name, 'BooMSwap Instant Exchange')
		})

		it('contract has tokens', async () => {
		let balance = await token.balanceOf(boomSwap.address)
		assert.equal(balance.toString(), tokens('1000000'))
		})
	})
	
	describe('buyTokens()', async () => {
		let result

		before(async () => {
			result = await boomSwap.buyTokens({ from: investor, value: web3.utils.toWei('1', 'ether')})
		})

		it('User using BooMSwap buy tokens', async () => {
			let investorBalance = await token.balanceOf(investor)
			assert.equal(investorBalance.toString(), tokens('1000'))

			let boomSwapBalance = await token.balanceOf(boomSwap.address)
			assert.equal(boomSwapBalance.toString(), tokens('999000'))
			boomSwapBalance = await web3.eth.getBalance(boomSwap.address)
			assert.equal(boomSwapBalance.toString(), web3.utils.toWei('1', 'Ether'))

			const event = result.logs[0].args
			assert.equal(event.account, investor)
			assert.equal(event.token, token.address)
			assert.equal(event.amount.toString(), tokens('1000').toString())
			assert.equal(event.rate.toString(), '1000')
		})

	})

	describe('sellTokens()', async () => {
		let result

		before(async () => {
			// approve
			await token.approve(boomSwap.address, tokens('1000'), {from: investor})

			result = await boomSwap.sellTokens(tokens('1000'), {from: investor})
		})

		it('User using BooMSwap sell tokens', async () => {
			let investorBalance = await token.balanceOf(investor)
			assert.equal(investorBalance.toString(), tokens('0'))

			let boomSwapBalance = await token.balanceOf(boomSwap.address)
			assert.equal(boomSwapBalance.toString(), tokens('1000000'))
			boomSwapBalance = await web3.eth.getBalance(boomSwap.address)
			assert.equal(boomSwapBalance.toString(), web3.utils.toWei('0', 'Ether'))

			const event = result.logs[0].args
			assert.equal(event.account, investor)
			assert.equal(event.token, token.address)
			assert.equal(event.amount.toString(), tokens('1000').toString())
			assert.equal(event.rate.toString(), '1000')

			await boomSwap.sellTokens(tokens('5000'), {from: investor}).should.be.rejected;
		})

	})
})