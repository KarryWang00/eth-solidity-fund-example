// SPDX-License-Identifier: MIT
pragma solidity ^0.6.0;

// 使用mock提供的获取价格合约，可以在本地运行
// 但是这里会出现solidity版本报错，我们的项目使用的合约不可能全部统一一个版本
// 所以我们要在部署的时候支持合约的不同的版本
import "@chainlink/contracts/src/v0.6/tests/MockV3Aggregator.sol";
