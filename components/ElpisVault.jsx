import { useWeb3Contract } from "react-moralis"
import {abi, contractAddresses} from "../constants"
import { useMoralis } from "react-moralis"
import { useEffect, useState } from "react"
import { ethers } from "ethers"
import { useNotification } from "web3uikit"




export default function ElpisVault() {
    const { chainId: chainIdHex, isWeb3Enabled } = useMoralis()
    const chainId = parseInt(chainIdHex)
    const vaultAddress = chainId in contractAddresses ? contractAddresses[chainId][0] : null
    const [elpisTotalSupply, setElpisTotalSupply] = useState("420")
    const [mintAmount, setMintAmount] = useState("0")
    const [elpisMintPrice, elpisGetMintPrice] = useState("0")
    const [elpisDeltaMint, elpisGetDeltaMint] = useState("0")

    const dispatch = useNotification()


    const {runContractFunction: mintElpis, isLoading, isFetching} = useWeb3Contract({
        abi: abi,
        contractAddress: vaultAddress,
        functionName: "deposit",
        params: {},
        msgValue: ethers.utils.parseEther(mintAmount)
    })

    


////////////// home made shit ////////////
    const [currentAccountBalance, setCurrentAccountBalance] = useState(ethers.BigNumber.from(0));
    const getCurrentAccountBalance = async () => {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner()
        const currentAccount = await signer.getAddress()

        const contract = new ethers.Contract(vaultAddress, abi, provider) 
        const balance = await contract.balanceOf(currentAccount)
        console.log(`Current account balance: ${balance.toString()}`)
        return ethers.BigNumber.from(balance.toString())
    }
//////////////////




    const {runContractFunction: totalSupply} = useWeb3Contract({
        abi: abi,
        contractAddress: vaultAddress,
        functionName: "totalSupply",
        params: {},
    })

    const {runContractFunction: getMintPrice} = useWeb3Contract({
        abi: abi,
        contractAddress: vaultAddress,
        functionName: "getMintPrice",
        params: {},
    })

    const {runContractFunction: getDeltaMint} = useWeb3Contract({
        abi: abi,
        contractAddress: vaultAddress,
        functionName: "getDeltaMint",
        params: {},
    })

    async function updateUI() {
            const elpisTotalSupplyFromCall = ( await totalSupply()).toString()
            setElpisTotalSupply(elpisTotalSupplyFromCall)
            const elpisGetMintPriceFromCall = ( await getMintPrice()).toString()
            elpisGetMintPrice(elpisGetMintPriceFromCall)
            const elpisGetDeltaMintFromCall = ( await getDeltaMint()).toString()
            elpisGetDeltaMint(elpisGetDeltaMintFromCall)


            //getCurrentAccountBalance()


            //elpis user balance
            //const elpisUserBalanceFromCall = (balanceOf()).toString()
            //setElpisUserBalance(elpisUserBalanceFromCall)

            /* const elpisUserBalanceFromCall = getCurrentAccountBalance()
            setCurrentAccountBalance(elpisUserBalanceFromCall) */

            const balance = await getCurrentAccountBalance();
            setCurrentAccountBalance(balance)

           





    }

    useEffect(() => {
        if(isWeb3Enabled){
            updateUI()
            getCurrentAccountBalance()
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
            Hello from the Vault
            {vaultAddress ? (
                <div>
                    <button
                     className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-auto"
                     onClick={async function () {
                            await mintElpis({
                                value: ethers.utils.parseEther(mintAmount),
                                onSuccess: handleSuccess,
                                onError: (error) => console.log(error),
                            })
                        }}
                        disabled={isLoading || isFetching}
                    >
                        {isLoading || isFetching ? (
                            <div className="animate-spin spinner-border h-8 w-8 border-b-2 rounded-full"></div>
                        ) : (
                            "Deposit Ethers"
                        )}
                    </button>
                    <input
                        type="number"
                        value={mintAmount}
                        onChange={(event) => setMintAmount(event.target.value)}
                    />
                    <br/>
                    Total Elpis Supply : {ethers.utils.formatUnits(elpisTotalSupply)} ELP
                    <br/>
                    Elpis Mint Price : {ethers.utils.formatUnits(elpisMintPrice, "ether")} ETH
                    <br/>
                    Elpis Delta Mint : {ethers.utils.formatUnits(elpisDeltaMint)} ELP
                    <br/>
                    Personal Elpis Balance : {ethers.utils.formatUnits(currentAccountBalance)} ELP
                </div>
            ) : (
                <div>No Vault Address Detected</div>
            )}
            
        </div>
    )
}
