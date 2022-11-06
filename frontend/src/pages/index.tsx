import {web3, myERC20Contract, StudentSocietyContract} from '../utils/contracts'
import { NavLink, Route } from 'react-router-dom';
import {useEffect, useState} from 'react';
import {Button, Image} from 'antd';
import ReactDOM from 'react-dom';
import './index.css';

const GanacheTestChainId = '0x539' // Ganache默认的ChainId = 0x539 = Hex(1337)
const GanacheTestChainName = 'Ganache Test Chain'
const GanacheTestChainRpcUrl = 'http://127.0.0.1:7545'
const HomePage = () => {
    const [account, setAccount] = useState('')
    const [accountBalance, setAccountBalance] = useState(0)
    let proposalList:any[] = []
    let commitTasks:any[] = []

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

    useEffect(() => {
        const getAccountInfo = async () => {
            if (myERC20Contract) {
                const ab = await myERC20Contract.methods.balanceOf(account).call()
                setAccountBalance(ab)
            } else {
                alert('Contract not exists.')
            }
        }

        if(account !== '') {
            getAccountInfo()
        }
    }, [account])

    const getAirdrop = async () => {
        if(account === "") {
            alert("你还没有连接账户，请先连接账户！")
            return
        }
        if (StudentSocietyContract && myERC20Contract) {
            try {
                await myERC20Contract.methods.airdrop().send({
                    from: account
                })
                alert("空投已经到账，请刷新查看")
            } catch (error: any) {
                alert("您已经领取过空投")
            }
        } else {
            alert("contract not exist.")
        }
    }

    const getProposal = async (index:number) => {
        if (StudentSocietyContract && myERC20Contract) {
            try {
                let proposal = await StudentSocietyContract.methods.getProposal(index).call()
                return proposal
            } catch (error: any) {
                alert(error.message)
            }
        } else {
            alert("contract not exist.")
        }
    }

    const getProposalCount = async () => {
        if (StudentSocietyContract && myERC20Contract) {
            try {
                let cnt = await StudentSocietyContract.methods.getProposalCount().call({
                    from: account
                })
                return cnt
            } catch (error: any) {
                alert(error.message)
            }
        } else {
            alert("contract not exist.")
        }
    }

    async function vote (index:number, approve:boolean) {
        if (StudentSocietyContract && myERC20Contract) {
            try {
                await myERC20Contract.methods.approve(StudentSocietyContract.options.address, 500).send({
                    from: account
                })
                await StudentSocietyContract.methods.vote(index, approve).send({
                    from: account,
                    gas: 100000
                })
                alert("投票成功！")
            } catch (error: any) {
                alert(error.message)
            }
        } else {
            alert("contract not exist.")
        }
    }


    const commit = async (index:number) => {
        if (StudentSocietyContract && myERC20Contract) {
            await StudentSocietyContract.methods.commit(index).send({
               from: account,
               gas: 100000
            })
        } else {
            alert("contract not exist.")
        }
    }

    function Proposal(proposal:any) {
        console.log(proposal.startTime, proposal.duration)
        let start:number = proposal.startTime
        let duration:number = proposal.duration
        let startTime = new Date(Number(start))
        let endTime = new Date(Number(Number(start) + Number(duration)))
        console.log("接收", startTime.toLocaleString(), endTime.toLocaleString())
        let commited = proposal.commited
        let approveCnt = proposal.approveCount
        let disapproCnt = proposal.disapproveCount
        var voteComponent
        if(commited === false) {
            voteComponent = <div className='smallfont'>
                                <p>投票进行中，点击下方按钮进行投票</p>
                                <button className='green' onClick={()=>vote(proposal.index, true)} margin-right='2%'>支持</button>
                                <button className='red' onClick={()=>vote(proposal.index, false)}>反对</button>
                            </div>
        }
        else {
            var voteResultComponent
            if (approveCnt > disapproCnt) {
                voteResultComponent = <div>
                                            <p>提案通过，赞成{approveCnt}票，反对{disapproCnt}票</p>
                                      </div>
            }
            else {
                voteResultComponent = <div>
                                            <p>提案被否决，赞成{approveCnt}票，反对{disapproCnt}票</p>
                                      </div>
            }
            voteComponent = <div className='smallfont'>
                                <p>投票已截止</p>
                                {voteResultComponent}
                            </div>
        }
        return (
            <div className='proposal'>
                <h3 className='titleInput'>{proposal.name}</h3>
                <p>{proposal.discription}</p>
                <p className='smallfont'>开始时间：{startTime.toLocaleString()} 截至时间：{endTime.toLocaleString()}</p>
                {voteComponent}
            </div>
        );
    }

    async function getAllProposal() {
        proposalList = []
        commitTasks = []
        let cnt:number = await getProposalCount()
        if(cnt === 0) {
            return
        }
        var i:number
        for(i = cnt-1; i >= 0; i--) {
            let proposal = await getProposal(i)
            commitTasks.push(proposal)
            proposalList.push(Proposal(proposal))
            console.log("get proposal:", proposal)
        }
        console.log("proposal list: ",proposalList)
        console.log("commit task: ",commitTasks)
        ReactDOM.render(proposalList, document.getElementById('pros'))
        tryCommit()
    }

    const Sleep = (ms:number)=> {
        return new Promise(resolve=>setTimeout(resolve, ms))
    }

    async function tryCommit() {
        let needLoop:boolean = true
        while(needLoop) {
            needLoop = false
            let now = new Date()
            let now_time:number = Math.floor(now.getTime()/60000)*60000
            for(let p of commitTasks) {
                console.log(p);
                if(Number((Number(p.startTime) + Number(p.duration))) < Number(now_time) && p.commited === false) {
                    commit(p.index)
                    console.log("commit", p);
                }
                else if(p.commited === false) {
                    console.log(Number((Number(p.startTime) + Number(p.duration))), Number(now_time))
                    needLoop = true
                }
            }
            console.log("finish commit loop at " + now)
            await Sleep(1000 * 60)
        }
    }

    const onClickConnectWallet = async () => {
        // @ts-ignore
        const {ethereum} = window;
        if (!Boolean(ethereum && ethereum.isMetaMask)) {
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

        if (myERC20Contract) {
            const ab = await myERC20Contract.methods.balanceOf(account).call()
            setAccountBalance(ab)
        } else {
            alert('Contract not exists.')
        }
    }

    const flush = async ()=> {
        try {
            const ab = await myERC20Contract.methods.balanceOf(account).call()
            
            setAccountBalance(ab)
        } catch (error: any) {
            alert("出错了："+error.message)
        }
    }

    return (
        <div>
            <div className='header'>
                <h1>Web3 Club</h1>
                <Button onClick={onClickConnectWallet} margin-right='2%'>连接钱包</Button>
                <Button onClick={getAirdrop} margin-right='2%'>领取空投</Button>
                <Button onClick={flush}>刷新余额</Button>
                <p>当前账户：{account}  账户余额：{accountBalance} Qcoin</p>
            </div>
            <div>
                <NavLink to='/newproposal'>点我发起新提案</NavLink><br></br>
                <Button onClick={getAllProposal} className='allProposal'>查看所有提案</Button>
            </div>
            <div id='pros'></div>
        </div>
    )
} 

export default HomePage