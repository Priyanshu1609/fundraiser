import React, { useEffect, useState } from 'react'
import { ethers } from 'ethers'
import { useRouter } from 'next/router'
import { toast } from 'react-toastify';

import contractABI from "../src/artifacts/contracts/Campaign.sol/CampaignFactory.json"
const contractAddress = '0x066a327b3aa3D23B4CdCf009d454FD7cE770c793';
// const contractAddress = '0x5FbDB2315678afecb367f032d93F642f64180aa3';

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
        contractABI.abi,
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
    const [isLoading, setIsLoading] = useState(false);
    const [address, setAddress] = useState("");
    const router = useRouter();

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        amount: '',
    })
    const [image, setImage] = useState(null)
    const [imageUrl, setImageUrl] = useState('https://ik.imagekit.io/q5edmtudmz/FB_IMG_15658659197157667_wOd8n5yFyXI.jpg')

    const ImageHandler = e => {
        setImage(e.target.files[0])
    }


    const startCampaign = async (e) => {
        e.preventDefault();
        console.log('Started submiting')
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();

        if (formData.title === "") {
            alert("Title Field Is Empty");
        } else if (formData.description === "") {
            alert("Description Field Is Empty");
        } else if (formData.amount === "") {
            alert("Required Amount Field Is Empty");
        }
        else if (imageUrl.length === 0) {
            alert("Files Upload Required")
        }
        else {
            setIsLoading(true);

            const contract = getEthereumContract();

            const CampaignAmount = ethers.utils.parseEther(formData.amount);

            const { title, description } = formData;

            const campaignData = await contract.createCampaign(
                title,
                CampaignAmount,
                imageUrl,
                description
            );

            await campaignData.wait();
            console.log('Campaign Address', campaignData.to);
            console.log('Contract', campaignData);
            alert('Campaign Created Successfully', campaignData.to);
            router.push('/')
            // router.push(`/${campaignData.to}`);
            setIsLoading(false)
            setAddress(campaignData.to);
        }
    }


    const checkIfWalletIsConnected = async (metamask = eth) => {
        try {
            if (!metamask) return alert('Please install metamask ')

            const accounts = await metamask.request({ method: 'eth_accounts' })

            if (accounts.length) {
                setCurrentAccount(accounts[0])
            }
        } catch (error) {
            setIsLoading(false)
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
            setIsLoading(false)
            console.error(error)
            throw new Error('No ethereum object.')
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
                setIsLoading,
                formData,
                setFormData,
                handleChange,
                image,
                ImageHandler,
                setImageUrl,
                isLoading,
                startCampaign,
            }}
        >
            {children}
        </TransactionContext.Provider>
    )
}