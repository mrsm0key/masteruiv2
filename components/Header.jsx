import { useMoralis } from "react-moralis"
import { useEffect } from "react"

export default function Header() {
    const { enableWeb3, account, isWeb3Enabled, Moralis, deactivateWeb3, isWeb3EnableLoading } = useMoralis()

    useEffect(() => {
        if (isWeb3Enabled) return
        if (typeof window !== "undefined") {
            if (window.localStorage.getItem("connected")) {
                enableWeb3()
            }
        }
    }, [isWeb3Enabled])

    useEffect(() => {
        Moralis.onAccountChanged((newAccount) => {
            console.log(`Account changed to ${newAccount}`)
            if (newAccount == null) {
                window.localStorage.removeItem("connected")
                deactivateWeb3()
                console.log("Null account found")
            }
        })
    }, [])

    return (
        <div className="p-5 border-b-2 flex flex-row">
            <h1 className="py-4 px-4 font-blog text-3xl">Houdl vault</h1>
            {account ? (
                <div className="ml-auto py-2 px-4">
                    Connected wallet : {account.slice(0, 6)}...{account.slice(account.length - 4)}
                </div>
            ) : (
                <button
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-auto"
                    onClick={async () => {
                        await enableWeb3()
                        if (typeof window !== "undefined") {
                            window.localStorage.setItem("connected", "injected")
                        }
                    }}
                    disabled={isWeb3EnableLoading}
                >
                    Connect
                </button>
            )}
        </div>
    )
}

/* // This file is to show what making a connect button looks like behind the scenes!

import { useEffect } from "react"



// Top navbar
export default function ManualHeader() {
    const { enableWeb3, isWeb3Enabled, isWeb3EnableLoading, account, Moralis, deactivateWeb3 } =
        useMoralis()

    useEffect(() => {
        if (
            !isWeb3Enabled &&
            typeof window !== "undefined" &&
            window.localStorage.getItem("connected")
        ) {
            enableWeb3()
            // enableWeb3({provider: window.localStorage.getItem("connected")}) // add walletconnect
        }
    }, [isWeb3Enabled])
    // no array, run on every render
    // empty array, run once
    // dependency array, run when the stuff in it changesan

    useEffect(() => {
        Moralis.onAccountChanged((newAccount) => {
            console.log(`Account changed to ${newAccount}`)
            if (newAccount == null) {
                window.localStorage.removeItem("connected")
                deactivateWeb3()
                console.log("Null Account found")
            }
        })
    }, [])

    return (
        <nav className="p-5 border-b-2">
            <ul className="">
                <li className="flex flex-row">
                    {account ? (
                        <div className="ml-auto py-2 px-4">
                            Connected to {account.slice(0, 6)}...
                            {account.slice(account.length - 4)}
                        </div>
                    ) : (
                        <button
                            onClick={async () => {
                                // await walletModal.connect()
                                const ret = await enableWeb3()
                                if (typeof ret !== "undefined") {
                                    // depends on what button they picked
                                    if (typeof window !== "undefined") {
                                        window.localStorage.setItem("connected", "injected")
                                        // window.localStorage.setItem("connected", "walletconnect")
                                    }
                                }
                            }}
                            disabled={isWeb3EnableLoading}
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-auto"
                        >
                            Connect
                        </button>
                    )}
                </li>
            </ul>
        </nav>
    )
}
 */
