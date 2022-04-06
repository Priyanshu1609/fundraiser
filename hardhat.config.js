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
      url: `https://speedy-nodes-nyc.moralis.io/1f78a0705fba1289cf96bf3b/polygon/mumbai`,
      accounts: [`9916b9f39c79ea56ad8e805fc4ed4356fcd93fe6f8721399d866c0c4d9db06e2`],
    }
  }
};