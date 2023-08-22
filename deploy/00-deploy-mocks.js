// 00 表示预先执行
// 为什么要使用mock？因为我们的合约需要获得ETH/usd，而这个又需要
// 调用链上的价格合约，那么ETH、Goerli、Polgon上都有这样合约的地址
// 但我们在本地测试的时候没有，怎么办呢，使用mock自己在本地创建这样的合约
// const { network } = require("hardhat");
// const {
//   develpmentChains,
//   DECIMALS,
//   INITIAL_ANSWER,
// } = require("../helper-hardhat-config");

// module.exports = async ({ getNamedAccounts, deployments }) => {
//   const { deploy, log } = deployments;
//   const { deployer } = await getNamedAccounts();
//   const chainId = network.config.chainId;

//   if (develpmentChains.includes(network.name)) {
//     log("local network detected! Deploying mocks...");
//     await deploy("MockV3Aggregator", {
//       contract: "MockV3Aggregator",
//       from: deployer,
//       log: true,
//       //   部署合约需要传入的参数，构造函数需要的参数
//       args: [DECIMALS, INITIAL_ANSWER],
//     });
//     log("Mocks deployed!");
//     log("-----------------------------------------------");
//   }
// };
// 给模块脚本打上标签：all或者mocks
const { network } = require("hardhat");
const { DECIMALS, INITIAL_PRICE } = require("../helper-hardhat-config");
// 对于每一个deploy文件夹的js文件，都需要导出一个异步函数，该函数中将接收一个对象作为参数
// 其中 getNamedAccounts 和 deployments 是其中的属性和方法
module.exports = async ({ getNamedAccounts, deployments }) => {
  /**
   * getNamedAccounts deployments 都是Hardhat Runtime Environment（HRE）的一部分，用于在Hardhat中部署智能合约
   * deployments 对象包含了Hardhat的部署API，可以用来部署智能合约
   * getNameAccounts 函数可以用来获取预定义的账户，例如deployer和tokenOwner
   * deployer 是部署智能合约的账户地址，他是通过调用getNameAccounts()函数获取的
   * 这个例子当中，deployer是预定义的账户之一
   * 我们需要指定deployer是hardhat默认账户的哪一个，在hardhat.config.js中定义
   */
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();
  const chainId = network.config.chainId;
  // If we are on a local development network, we need to deploy mocks!
  if (chainId == 31337) {
    log("Local network detected! Deploying mocks...");
    await deploy("MockV3Aggregator", {
      contract: "MockV3Aggregator",
      from: deployer,
      log: true,
      args: [DECIMALS, INITIAL_PRICE],
    });
    log("Mocks Deployed!");
    log("------------------------------------------------");
    log(
      "You are deploying to a local network, you'll need a local network running to interact"
    );
    log(
      "Please run `npx hardhat console` to interact with the deployed smart contracts!"
    );
    log("------------------------------------------------");
  }
};
// 给模块脚本打上标签：all或者mocks
module.exports.tags = ["all", "mocks"];
