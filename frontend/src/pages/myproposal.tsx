import {web3, myERC20Contract, StudentSocietyContract} from '../utils/contracts'
import {useEffect, useState} from 'react';
const GanacheTestChainId = '0x539' // Ganache默认的ChainId = 0x539 = Hex(1337)
const GanacheTestChainName = 'Ganache Test Chain'
const GanacheTestChainRpcUrl = 'http://127.0.0.1:7545'