require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();
require("hardhat-deploy");
/** @type import('hardhat/config').HardhatUserConfig */
const GOELRI_RPC_URL = process.env.GOELRI_RPC_URL;
const PRIVATE_KEY = process.env.PRIVATE_KEY;
module.exports = {
  // solidity: "0.8.18",
  solidity: {
    compilers: [{ version: "0.8.8" }, { version: "0.6.6" }],
  },
  defaultNetwork: "hardhat",
  networks: {
    goerli: {
      url: GOELRI_RPC_URL,
      accounts: [PRIVATE_KEY],
      chainId: 5,
    },
  },
  // 如果不添加这个，那么在yarn hardhat deploy mocks 的时候
  // getNamedAccounts，hardhat没法知晓到底是哪个账户
  namedAccounts: {
    deployer: {
      default: 0, // here this will by default take the first account as deployer
    },
  },
};
