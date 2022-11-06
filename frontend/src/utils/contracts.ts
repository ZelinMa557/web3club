import Addresses from './contract-addresses.json'
import MyERC20 from './abis/MyERC20.json'
import StudentSocietyDAO from './abis/StudentSocietyDAO.json'

const Web3 = require('web3');
// @ts-ignore
let web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:7545"));
// let web3 = new Web3(new ethers.providers.JsonRpcProvider("http://127.0.0.1:7545"));
// 修改地址为部署的合约地址
const myERC20Address = Addresses.erc20
const myERC20ABI = MyERC20.abi
const StudentSocietyDAOAddress = Addresses.StudentSocietyDAO
const StudentSocietyDAOABI = StudentSocietyDAO.abi

// 获取合约实例
const myERC20Contract = new web3.eth.Contract(myERC20ABI, myERC20Address);
const StudentSocietyContract = new web3.eth.Contract(StudentSocietyDAOABI, StudentSocietyDAOAddress);

// 导出web3实例和其它部署的合约
export {web3, myERC20Contract, StudentSocietyContract}