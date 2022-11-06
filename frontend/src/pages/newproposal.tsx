import {web3, myERC20Contract, StudentSocietyContract} from '../utils/contracts'
import {useEffect, useState} from 'react';
import {Button, Image} from 'antd';
import './index.css'
const GanacheTestChainId = '0x539' // Ganache默认的ChainId = 0x539 = Hex(1337)
const GanacheTestChainName = 'Ganache Test Chain'
const GanacheTestChainRpcUrl = 'http://127.0.0.1:7545'

const NewProposalPage = () => {
    const [account, setAccount] = useState('')

    useEffect(() => {
        const initCheckAccounts = async () => {
            // @ts-ignore
            const {ethereum} = window;
            if (!Boolean(ethereum && ethereum.isMetaMask)) {
                // 尝试获取连接的用户账户
                alert('MetaMask is not installed!');
                return
            }
            try {
                if (ethereum.chainId !== GanacheTestChainId) {
                    const chain = {
                        chainId: GanacheTestChainId, // Chain-ID
                        chainName: GanacheTestChainName, // Chain-Name
                        rpcUrls: [GanacheTestChainRpcUrl], // RPC-URL
                    };
    
                    try {
                        await ethereum.request({method: "wallet_switchEthereumChain", params: [chain]})
                    } catch (switchError: any) {
                        if (switchError.code === 4902) {
                            await ethereum.request({ method: 'wallet_addEthereumChain', params: [chain]
                            });
                        }
                    }
                }
    
                await ethereum.request({method: 'eth_requestAccounts'});
                const accounts = await ethereum.request({method: 'eth_accounts'});
                setAccount(accounts[0] || 'Not able to get accounts');
            } catch (error: any) {
                alert(error.message)
            }
        }

        initCheckAccounts()
    }, [])

    const newProposal = async () => {
        if(account === '') {
            alert('You have not connected wallet yet.')
            return
        }

        if (StudentSocietyContract && myERC20Contract) {
            try {
                let title:any = document.getElementById("title")
                title = title.value
                if (title == null || title === undefined) {
                    alert("请输入标题")
                    return
                }
                let detail:any = document.getElementById("detail")
                detail = detail.value
                if (detail == null || detail === undefined) {
                    alert("请输入详细内容")
                    return
                }
                let timeInput:any = document.getElementById("duration")
                let duration:number = Number(timeInput.value)
                let now = new Date()
                let start:number = Math.ceil(Number(now.getTime()) / 60000) * 60000
                console.log(start+" "+duration*60000)
                let test1 = new Date(start)
                let test2 = new Date(start + duration*60000)
                console.log("发送", test1.toLocaleString(), test2.toLocaleString())
                await myERC20Contract.methods.approve(StudentSocietyContract.options.address, 2000).send({
                    from: account
                })
                await StudentSocietyContract.methods.launch(start, duration*60000, title, detail).send({
                    from: account,
                    gas: 6721975
                })
                alert('successfully launched proposal ' + title)
            } catch (error: any) {
                alert(error.message)
            }
        } else {
            alert('Contract not exists.')
        }
    }


    return (
        <div background-color='azure'>
            <input type="text" id="title" className='titleInput' placeholder='标题'></input>
            <textarea id="detail" rows={20} cols={100} placeholder='正文'></textarea><br></br>
            持续时间：<input type="number" min="1" step="1" id="duration"></input>分钟<br></br>
            <Button onClick={newProposal}>发起提案</Button><br></br>
        </div>
    )
} 

export default NewProposalPage