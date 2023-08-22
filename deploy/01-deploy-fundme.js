const { network } = require("hardhat");
const { networkConfig } = require("../helper-hardhat-config");

// const { verify } = require("../utils/verify");
require("dotenv").config();

module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();
  const chainId = network.config.chainId;

  let ethUsdPriceFeedAddress; // 记录到底是本地网络还是主网测试网络
  if (chainId == 31337) {
    const ethUsdAggregator = await deployments.get("MockV3Aggregator"); // 得到mocks部署成功的实例
    ethUsdPriceFeedAddress = ethUsdAggregator.address;
  } else {
    ethUsdPriceFeedAddress = networkConfig[chainId]["ethUsdPriceFeed"];
  }
  log("----------------------------------------------------");
  log("Deploying FundMe and waiting for confirmations...");
  const fundMe = await deploy("FundMe", {
    from: deployer,
    args: [ethUsdPriceFeedAddress],
    log: true,
    // we need to wait if on a live network so we can verify properly
    // waitConfirmations: network.config.blockConfirmations || 1,
  });
  log(`FundMe deployed at ${fundMe.address}`);

  //   if (
  //     !developmentChains.includes(network.name) &&
  //     process.env.ETHERSCAN_API_KEY
  //   ) {
  //     await verify(fundMe.address, [ethUsdPriceFeedAddress]);
  //   }
};

module.exports.tags = ["all", "fundme"];

// const aa = () => {
//   console.log("hello world");
// };
// // 在部署文件中导出部署函数
// module.exports.default = aa;
