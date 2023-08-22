const networkConfig = {
  5: {
    name: "goerli",
    ethUsdPriceFeed: "0xD4a33860578De61DBAbDc8BFdb98FD742fA7028e",
  },
  137: {
    name: "polygon",
    ethUsdPriceFeed: "0xF9680D99D6C9589e2a93a78A04A279e509205945",
  },
  // 那么hardhat的价格预测怎么做？
};

const develpmentChains = ["hardhat", "localhost"];
const DECIMALS = 8;
const INITIAL_PRICE = 200000000000;

module.exports = {
  networkConfig,
  develpmentChains,
  DECIMALS,
  INITIAL_PRICE,
};
