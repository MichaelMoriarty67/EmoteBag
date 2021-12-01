# 🧙‍♂️ 🦀 ⚡️ EmoteBag V0.1 ⚡️ 🦀 🧙‍♂️

![](https://ipfs.io/ipfs/QmRpg5i7WN1ZHuTGc2Di1uyR1SQRNTzF8AqPYqrMcLCZnM)

If you're reading this it most likely means you're critiquing my code -- I appreciate it a lot, it's key to me getting better. 

The codebase is split up between the backend (BE) and the frontend (FE) directories. 

I was not sure how to strcuture the two different package.json's I had for the FE and BE, so I kept them seperate. To interact with either the FE or BE, navigate into either directory and run:

    npm install

## TABLE OF CONTENTS
1) [About](#about-current-build) 
2) [Deploying A New Contract](#deploying-a-new-contract)
3) [Starting A Dev Server](#starting-your-dev-server)
4) [Mint Your First Emote](#mint-your-first-emote)

## About Current Build

Hey! 👋 Im Michael, and lately ive been inspired to learn more programming because of web3.

This is first application -- EmoteBag. 

The vision? A Discord / Twitch like emote collection of NFTs that you can port with you to any web3 application that integrates EmoteBag.

Currently I've built a simple version of the application using React & Solidity. 

I would like to eventually build it as an open internet service on the Internet Computer.

### Future Features

1) **Unique & Sellable Emotes**. The goal of this is to make it so that artists can create and sell emotes that people can add to their collections. 
   
2) **API interface**. I only semi understand API's right now, but the goal is to let any application to query people's emotes from their EmoteBag collections and then use them as an actual text emote that can be used in posts.

## Deploying A New Contract 

Before deploying a new contract, you're going to need an API key from Alchemy and your MetaMask private key.

Once you have both, paste them into the hardhat.config.js file (BE/hardhat.config.js) as directed by the comments of the file. You'll have to paste over the process.env I was using, or create your own .env file if you know how to do so.

    cd BE
    npm install
    npx hardhat run scripts/deploy.js --network rinkeby

Copy your Rinkeby contract address from the console output.

### Adding Contract Address to FE

In App.js (/FE/src/App.js), paste your new Rinkeby contract address over the current constant variable 'EmoteAddress' on line 20.

### Adding your Rinkeby Contract's ABI to FE

Navigate to the backend Emotes.json (/BE/artifacts/contracts/Emotes.sol/Emotes.json) file that was created from running the deployment script and copy all of its contents.

Paste the contents over the current ABI in the frontent ABI file (/FE/src/ABI/Emotes.json). 

Your Rinkeby contract's address and abi should now allow the frontend to interact with your contract through ethers.js 🥳

## Starting your Dev server

    cd FE
    npm install
    npm run start

If you've added a new contract, you'll be greeted with an empty EmoteHero (and a Pepe silhouette 😉) because no emotes have been minted yet! 

![](https://ipfs.io/ipfs/QmTttTcEequka13Ug9d4YNbjjhUbDZ62BPHDVpcpg8goB7)

## Mint your first Emote

It's pretty easy -- click the "MINT" button.

### Upload your Emote
 
Drag and drop your image (must be a **jpeg, gif, png, apng, svg, bmp, bmp ico, png ico** type). 

Add your emotes name between two colons ( ex: **:TestEmote:** ).

### Mint your Emote

Your Emote's image and name should preview with the mint button below it!

Click 'Mint!' and you'll be promoted with a MeteMask transaction. 

![](https://ipfs.io/ipfs/QmPrKUAa1Zxn91mPNyaHgWWzWmJqMgW4VhP5Me6y23uVnX)


Once the transaction completes and the listener gets the event from the chain, your DOM is re-rendered with the new emote added! Woohoo!


⚡️ 🦀 🧙‍♂️
