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
    const [balance, setBalance] = useState(0)
    const [stackAmount, setStackAmount] = useState("0")
    const [errorMsg, setErrorMsg] = useState('')

    //const dispatch = useNotification()
    const addNotification = useWeb3Notification();

    

    const {runContractFunction: stackHoudl, isLoading, isFetching} = useWeb3Contract({
        abi: abiStack,
        contractAddress: vaultAddressStack,
        functionName: "stake",
        params: [ethers.utils.parseEther(stackAmount)],
        msgValue: ethers.utils.parseEther(stackAmount),
        onSent: () => {
            addNotification({
                type:"info",
                message: "Transaction Sent",
                title: "Tx Notification",
                position: "topR",
                icon: "bell",
            })
        },
        onSuccess: (tx) => handleSuccess(tx),
        onError: (error) => console.log(error),
    })






    async function updateUI() {




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
        <div className="p-5"> 
            Hello from the Stack
            {vaultAddressStack ? (
                <div>
                    <button
                     className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-auto"
                     onClick={async function () {
                            console.log("Button clicked!")
                            await stackHoudl({
                                //value: ethers.utils.parseEther(stackAmount),
                                onSuccess: handleSuccess,
                                onError: (error) => console.log(error),
                            })
                        }}
                        disabled={isLoading || isFetching}
                    >
                        {isLoading || isFetching ? (
                            <div className="animate-spin spinner-border h-8 w-8 border-b-2 rounded-full"></div>
                        ) : (
                            "Stack Houdl"
                        )}
                    </button>
                    <input
                        type="number"
                        value={stackAmount}
                        onChange={(event) => setStackAmount(event.target.value)}
                    />
                    <br/>
                </div>
            ) : (
                <div>No Vault Address Detected</div>
            )}
            
        </div>
    )
}






/* import { useWeb3Contract } from "react-moralis";
import { abiStack, contractAddressesStack } from "../constants";
import { useMoralis } from "react-moralis";
import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { useNotification } from "web3uikit";

export default function HoudlStack() {
  const { web3 } = useMoralis();
  const { addNotification } = useNotification();
  const [stackAmount, setStackAmount] = useState("");

  const handleStackAmountChange = (event) => {
    setStackAmount(event.target.value);
  };

  const handleStake = async () => {
    try {
      const contract = new web3.eth.Contract(abiStack, contractAddressesStack);
      const tokenAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3"; // replace with your custom ERC20 token address
      const tokenContract = new web3.eth.Contract(abiStack, tokenAddress);

      const balance = await tokenContract.methods.balanceOf(web3.eth.defaultAccount).call();
      if (Number(balance) < Number(ethers.utils.parseEther(stackAmount))) {
        throw new Error("Insufficient balance");
      }

      const allowance = await tokenContract.methods.allowance(web3.eth.defaultAccount, contractAddressesStack).call();
      if (Number(allowance) < Number(ethers.utils.parseEther(stackAmount))) {
        await tokenContract.methods.approve(contractAddressesStack, ethers.constants.MaxUint256).send({ from: web3.eth.defaultAccount });
      }

      const { runContractFunction: stackHoudl, isLoading, isFetching } = useWeb3Contract({
        abi: abiStack,
        contractAddress: contractAddressesStack,
        functionName: "stake",
        params: {},
        msgValue: ethers.utils.parseEther(stackAmount)
      });
      
      const { addNotification } = useNotification()
      console.log(addNotification)

      await stackHoudl();
      addNotification({
        title: "Stake successful",
        description: `You have successfully staked ${stackAmount} custom ERC20 tokens.`,
        type: "success",
        timeout: 5000
      });
    } catch (error) {
      addNotification({
        title: "Stake failed",
        description: error.message,
        type: "error",
        timeout: 5000
      });
    }
  };

  return (
    <div>
      <label>
        Amount to stake:
        <input type="number" value={stackAmount} onChange={handleStackAmountChange} />
      </label>
      <button onClick={handleStake}>Stake</button>
    </div>
  );
} */