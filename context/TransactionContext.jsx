import React, { useEffect, useState } from 'react'
import { abi } from "../src/artifacts/contracts/Campaign.sol/CampaignFactory.json"
import { ethers } from 'ethers'
import { useRouter } from 'next/router'

const contractAddress = 0xD4201B010e217EbB78f1aa587d4469d23737637E;

export const TransactionContext = React.createContext()

let eth

if (typeof window !== 'undefined') {
    eth = window.ethereum
}

const getEthereumContract = () => {
    const provider = new ethers.providers.Web3Provider(ethereum)
    const signer = provider.getSigner()
    const transactionContract = new ethers.Contract(
        contractAddress,
        contractABI,
        signer,
    )

    return transactionContract
}

const networks = {
    polygon: {
        chainId: `0x${Number(80001).toString(16)}`,
        chainName: "Polygon Testnet",
        nativeCurrency: {
            name: "MATIC",
            symbol: "MATIC",
            decimals: 18,
        },
        rpcUrls: ["https://rpc-mumbai.maticvigil.com/"],
        blockExplorerUrls: ["https://mumbai.polygonscan.com/"],
    },
};

export const TransactionProvider = ({ children }) => {
    const [currentAccount, setCurrentAccount] = useState()
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter();
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        goal: '',
        image: '',
    })
    console.log(formData);

    useEffect(() => {
        if (isLoading) {
            router.push(`/?loading=${currentAccount}`)
        } else {
            router.push(`/`)
        }
    }, [isLoading])


    const checkIfWalletIsConnected = async (metamask = eth) => {
        try {
            if (!metamask) return alert('Please install metamask ')

            const accounts = await metamask.request({ method: 'eth_accounts' })

            if (accounts.length) {
                setCurrentAccount(accounts[0])
            }
        } catch (error) {
            console.error(error)
            throw new Error('No ethereum object.')
        }
    }


    const connectWallet = async (metamask = eth) => {
        try {
            if (!metamask) return alert('Please install metamask ')

            const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
            if (provider.network !== "matic") {
                await window.ethereum.request({
                    method: "wallet_addEthereumChain",
                    params: [
                        {
                            ...networks["polygon"],
                        },
                    ],
                });
            }
            setIsLoading(true)
            const accounts = await metamask.request({ method: 'eth_requestAccounts' })

            setCurrentAccount(accounts[0])
            setIsLoading(false)
        } catch (error) {
            console.error(error)
            throw new Error('No ethereum object.')
        }
    }
    const logoutWallet = async (metamask = eth) => {
        try {
            if (!metamask) return alert('Please install metamask ')

            await metamask.logout();

        } catch (error) {
            console.error(error)
            throw new Error('Logout Error')
        }
    }

    const handleChange = (e, name) => {
        setFormData(prevState => ({ ...prevState, [name]: e.target.value }))
    }

    useEffect(() => {
        checkIfWalletIsConnected()
    }, [])

    return (
        <TransactionContext.Provider
            value={{
                connectWallet,
                currentAccount,
                isLoading,
                logoutWallet,
                formData,
                setFormData,
                handleChange
            }}
        >
            {children}
        </TransactionContext.Provider>
    )
}