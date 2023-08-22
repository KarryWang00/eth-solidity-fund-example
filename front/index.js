// 这是两种不同的模式
// hardhat部分是部署合约，前端部分是交互合约（根绝合约地址，交互，比如调用函数，查询链上信息）

// 判断有没有metamask钱包
//   if (window.ethereum !== undefined) {
//     // request方法使用MetaMask向以太坊提交RPC URL请求，eth_requstAccounts请求连接MetaMask
//     // 连接成功后，意味着网站具有调用MetaMask API的权限
//     window.ethereum.request({ method: "eth_requestAccounts" });
//   }
// 但是当我们断开账户连接后，发现还是会显示重新连接，所以将函数最好表示为异步函数
import { ethers } from "./cdn.ethers.io_lib_ethers-5.6.esm.min.js";
import { abi, contractAddress } from "./constant.js";
// https://cdn.ethers.io/lib/ethers-5.6.esm.min.js
const connectButton = document.getElementById("connectButton");
const fundButton = document.getElementById("fundButton");
const fundInput = document.getElementById("fundInput");
const balanceButton = document.getElementById("balanceButton");
const withdrawButton = document.getElementById("withdrawButton");
connectButton.onclick = connect;
fundButton.onclick = fund;
balanceButton.onclick = getBalance;
withdrawButton.onclick = withdraw;
// connectButton.onclick = connect;
// fundButton.onclick = fund;
async function connect() {
  if (window.ethereum !== undefined) {
    await window.ethereum.request({ method: "eth_requestAccounts" });
    console.log("connected!");
  } else {
    console.log("No MetaMask!");
  }
}
async function fund() {
  const ethAmount = fundInput.value;
  // window.ethereum是一个全局API变量，他是以太坊的提供器之一
  // 可以让网页与以太坊进行交互
  // 例如读取区块链数据或发送交易信息到网络
  if (window.ethereum !== undefined) {
    console.log(`Fund Amount: ${ethAmount}`);
    // connected metamask
    /**
     * 功能：创建了一个新的ethers.js库中的Web3Provider类的实例
     * Web3Provider类用于使用Web3 API连接到以太坊节点
     * window.ethereum对象是由MetaMask或其他以太坊钱包注入的以太坊提供程序的引用
     */
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    /**
     * Signer 签名类
     * 在ethers中，Signer签名类是以太坊账户的抽象，可用于对消息和交易进行签名，并将签名的交易发送到以太坊网络
     * 并更改区块链状态。Signer是抽象类并不能直接实例化，我们需要使用他的子类：wallet钱包类
     * 从provider获得signer对象，signer对象可以用来签署交易，signer对象包含了一个私钥，用于对交易的签名
     */
    const signer = provider.getSigner();
    /**
     * 功能：contract ： 声明合约可写变量
     * signer是wallet对象，生明可写合约变量，你需要提供signer，而在声明可读合约你只需要提供provider变量
     */
    const contract = new ethers.Contract(contractAddress, abi, signer); // 将字符串转为ETH
    // 查看合约的部署者地址
    const owner = await contract.getOwner();
    console.log(`owner address: ${owner}`);
    try {
      // 合约交互，发起一个transaction
      const transactionResponse = await contract.fund({
        value: ethers.utils.parseEther(ethAmount),
      });
      // 等待交易上链
      await transactionResponse.wait();
      // 等待合约调用fund这个函数结束
      await listenForTransactionMine(transactionResponse, provider);
      console.log("done");
    } catch (error) {
      console.log(error);
    }
  } else {
    console.log("No MetaMask!");
  }
}
/**
 *
 * @param {*} transactionResponse 当前交易
 * @param {*} provider provider对象
 * @returns
 */
function listenForTransactionMine(transactionResponse, provider) {
  return new Promise((resovle, reject) => {
    console.log(`Mining ${transactionResponse.hash}...`);
    // provider.on(eventName, listener) 监听事件，listerer：一个function
    // provider.on，provider对象中有一个监听方法，且持续监听合约的事件
    // provider.once，provider对象有一个合约监听方法，但我们只监听一次合约释放事件
    provider.once(transactionResponse.hash, (transactionReceipt) => {
      console.log(transactionReceipt);
      console.log(
        `completed with ${transactionReceipt.confirmations} confirmations`
      );
      resovle();
    });
  });
}

async function getBalance() {
  if (window.ethereum !== undefined) {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    // const contract = new ethers.Contract(contractAddress, abi, signer);
    // 通过provider查询合约地址，合约账户中的余额，而不是通过合约地址调用合约里的函数查询某个账户的余额
    const balance = await provider.getBalance(contractAddress);
    console.log(ethers.utils.formatEther(balance));
  } else {
    console.log("No MetaMask!");
  }
}

async function withdraw() {
  if (window.ethereum !== undefined) {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(contractAddress, abi, signer);
    try {
      const transactionResponse = await contract.withdraw();
      await transactionResponse.wait();
    } catch (error) {
      console.log(error);
    }
  } else {
    console.log("No MetaMask!");
  }
}
