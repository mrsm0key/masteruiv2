import { useWeb3Contract } from "react-moralis"
import { abiStack ,contractAddressesStack, abi, contractAddresses } from "../constants"
import { useMoralis } from "react-moralis"
import { useEffect, useState } from "react"
import { ethers } from "ethers"
import { useNotification as useWeb3Notification } from "web3uikit"




export default function HoudlStack() {
    const { chainId: chainIdHex, isWeb3Enabled } = useMoralis()
    const chainId = parseInt(chainIdHex)
    const vaultAddressStack = chainId in contractAddressesStack ? contractAddressesStack[chainId][0] : null
    

    //custom
    //const [balance, setBalance] = useState(0)
    
    //const [errorMsg, setErrorMsg] = useState('')

    //const dispatch = useNotification()
    //const addNotification = useWeb3Notification();








    //const [addedValue, setAddedValue] = useState('0');
    const { account, web3 } = useMoralis();
    //const [amount, setAmount] = useState('');
    const spender = '0xAC5E915f460A065Dd63f07d483cB8c9A4FdF2EE7'; //stack add goerli 
    const _abi = abi;
    const contractAddresses = '0x9a6c5d4c5114035f745479d65f9111895c9765f7'; //hdl add goerli 

    const handleAllowance = async () => {
      try {
        const contract = new ethers.Contract(contractAddresses, _abi, web3.getSigner());
        const tx = await contract.increaseAllowance(spender, 10000000000000000000000000000000000n, { from: account });      
        console.log('Transaction sent:', tx.hash);
        const receipt = await tx.wait();
        console.log('Transaction success:', receipt);
  
        // Call the other function after the allowance transaction is successful
        // const otherTx = await otherContract.otherFunction(/* other function params here */);
        // console.log('Other transaction sent:', otherTx.hash);
        // const otherReceipt = await otherTx.wait();
        // console.log('Other transaction success:', otherReceipt);
      } catch (error) {
        console.log('Error in handleAllowance: ', error);
      }
    }


    const [stakeAmount, setStackAmount] = useState("0")
    const _abiStake = abiStack;
  

    const stakeHoudl = async () => {
      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner()
        const contract = new ethers.Contract(vaultAddressStack, _abiStake, signer);
        const parsedAmount = ethers.utils.parseUnits(stakeAmount, 'ether');
        const tx = await contract.stake(parsedAmount);
        console.log('Transaction sent:', tx.hash);
        const receipt = await tx.wait();
        console.log('Transaction success:', receipt);
      } catch (error) {
        console.error('Error staking tokens:', error);
      }
    }

    const [unStakeAmount, setUnStackAmount] = useState("0")

    const unStakeHoudl = async () => {
      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner()
        const contract = new ethers.Contract(vaultAddressStack, _abiStake, signer);
        const parsedAmount = ethers.utils.parseUnits(unStakeAmount, 'ether');
        const tx = await contract.unstake(parsedAmount);
        console.log('Transaction sent:', tx.hash);
        const receipt = await tx.wait();
        console.log('Transaction success:', receipt);
      } catch (error) {
        console.error('Error staking tokens:', error);
      }
    }



    const [xhdlTotalSupply, setXHdlTotalSupply] = useState("0")


    const {runContractFunction: totalXHDL} = useWeb3Contract({
      abi: _abiStake,
      contractAddress: vaultAddressStack,
      functionName: "totalXHDL",
      params: {},
  })







    







    async function updateUI() {
            const xhdlTotalSupplyFromCall = ( await totalXHDL()).toString()
            setXHdlTotalSupply(xhdlTotalSupplyFromCall)



    }

    useEffect(() => {
        if(isWeb3Enabled){
            updateUI()
        }
    }, [isWeb3Enabled])


    const handleSuccess = async function (tx) {
        await tx.wait(1)
        handleNewNotification(tx)
        updateUI()
    }
    const handleNewNotification = function () {
        dispatch({
            type:"info",
            message: "Transaction Complete",
            title: "Tx Notification",
            position: "topR",
            icon: "bell",
        })
    }

    return (
      <div>
      {vaultAddressStack ? (
        <div>
            <div>
            <button 
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-auto"
              onClick={handleAllowance}>Staking Auth</button>
          </div>
          <br />
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-auto"
            onClick={stakeHoudl}
           // disabled={isLoading || isFetching}
          >
            Stake Houdl
          </button>
          <input
            type="number"
            value={stakeAmount}
            onChange={(event) => setStackAmount(event.target.value)}
          />
          <br/>
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-auto"
            onClick={unStakeHoudl}
           // disabled={isLoading || isFetching}
          >
            unStake Houdl
          </button>
          <input
            type="number"
            value={unStakeAmount}
            onChange={(event) => setUnStackAmount(event.target.value)}
          />
          <br/>
            Total xHdl Supply : {ethers.utils.formatUnits(xhdlTotalSupply)} xHdl
        </div>
      ) : (
        <div>No Vault Address Detected</div>
      )}
    </div>
    )
}

