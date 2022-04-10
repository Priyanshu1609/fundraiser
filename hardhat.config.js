require("@nomiclabs/hardhat-waffle");
require('dotenv').config({ path: './env.local' });


module.exports = {
  solidity: "0.8.4",
  defaultNetwork: 'mumbai',
  paths: {
    artifacts: './src/artifacts',
  },
  networks: {
    hardhat: {
      chainId: 1337
    },
    mumbai: {
      url: `https://speedy-nodes-nyc.moralis.io//polygon/mumbai`,
      accounts: [``],
    }
  }
};