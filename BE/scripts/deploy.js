const main = async () => {
    const nftContractFactory = await hre.ethers.getContractFactory('Emotes');
    const nftContract = await nftContractFactory.deploy();
    await nftContract.deployed();
    console.log("Emotes contract deployed to:", nftContract.address);

    let txn = await nftContract.getTotalEmotesMinted();

    console.log("Here's what happens when you console a txn: ", txn);

  };
  
  const runMain = async () => {
    try {
      await main();
      process.exit(0);
    } catch (error) {
      console.log(error);
      process.exit(1);
    }
  };
  
  runMain();