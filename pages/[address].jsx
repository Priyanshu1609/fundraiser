import React, { useState, useContext, useEffect } from 'react'
import { ethers } from 'ethers';
import Modal from 'react-modal'

import { TransactionContext } from '../context/TransactionContext';
import Campaign from '../src/artifacts/contracts/Campaign.sol/Campaign.json'
import CampaignFactory from '../src/artifacts/contracts/Campaign.sol/CampaignFactory.json'
import TransactionLoader from '../components/TransactionLoader';

const contractAddress = '0x066a327b3aa3D23B4CdCf009d454FD7cE770c793';
// const contractAddress = '0x5FbDB2315678afecb367f032d93F642f64180aa3';


Modal.setAppElement('#__next')

const customStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        transform: 'translate(-50%, -50%)',
        backgroundColor: '#0a0b0d',
        padding: 0,
        border: 'none',
    },
    overlay: {
        backgroundColor: 'rgba(10, 11, 13, 0.75)',
    },
}

const Details = ({ Data, DonationsData }) => {

    const [amount, setAmount] = useState();
    const [change, setChange] = useState(false);
    const [mydonations, setMydonations] = useState([]);
    const [newData, setNewData] = useState({})
    const [newDonations, setNewDonations] = useState([])
    const [close, setClose] = useState(false);

    const { isLoading, setIsLoading, currentAccount } = useContext(TransactionContext);

    console.log('My Donations', mydonations);

    const Request = async () => {

        await window.ethereum.request({ method: 'eth_requestAccounts' });
        const Web3provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = Web3provider.getSigner();
        const Address = await signer.getAddress();

        const provider = new ethers.providers.JsonRpcProvider(
            `${process.env.NEXT_PUBLIC_RPC_URL}`
        );

        const contract = new ethers.Contract(
            Data.address,
            Campaign.abi,
            provider
        );
        setIsLoading(true);
        const MyDonations = contract.filters.donated(Address);
        const MyAllDonations = await contract.queryFilter(MyDonations);
        ;

        setMydonations(MyAllDonations.map((e) => {
            return {
                donar: e.args.donar,
                amount: ethers.utils.formatEther(e.args.amount),
                timestamp: parseInt(e.args.timestamp)
            }
        }));

        const title = await contract.title();
        const requiredAmount = await contract.requiredAmount();
        const image = await contract.image();
        const storyUrl = await contract.story();
        const owner = await contract.owner();
        const recievedAmount = await contract.recievedAmount();

        const Donations = contract.filters.donated();
        const AllDonations = await contract.queryFilter(Donations);


        const newData = {
            address: Data.address,
            title,
            requiredAmount: ethers.utils.formatEther(requiredAmount),
            image,
            recievedAmount: ethers.utils.formatEther(recievedAmount),
            storyUrl,
            owner,
        }
        setNewData(newData)

        setNewDonations(AllDonations.map((e) => {
            return {
                donar: e.args.donar,
                amount: ethers.utils.formatEther(e.args.amount),
                timestamp: parseInt(e.args.timestamp)
            }
        }));
        setIsLoading(false);

        if (newData.requiredAmount === newData.recievedAmount) {
            setClose(true);
            releaseFunds();
        }

    }
    useEffect(() => {
        Request();
    }, [change])

    const DonateFunds = async () => {
        try {
            console.log('Donating funds', amount)
            if (newData.requiredAmount - newData.recievedAmount < amount) {
                console.log('Recived', newData.recievedAmount)
                console.log('Required', newData.requiredAmount)
                alert('Amount is greater than required amount')
                return;
            }
            if (newData.requiredAmount === newData.recievedAmount + amount) {
                console.log('campaign Closed')
                releaseFunds();
                setClose(true);
            }
            if (!amount) {
                alert('Cannot donate, Either the campaign closed or required amount doesnot match')
                return;
            }

            await window.ethereum.request({ method: 'eth_requestAccounts' });
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();

            const contract = new ethers.Contract(Data.address, Campaign.abi, signer);
            setIsLoading(true)
            const transaction = await contract.donate({ value: ethers.utils.parseEther(amount) });
            await transaction.wait();
            setIsLoading(false)
            setChange(true);
            setAmount('');
            alert('Donation Successful')



        } catch (error) {
            setIsLoading(false)
            console.error(error);
        }
    }
    const WithDrawFunds = async () => {
        try {

            if (newData.recievedAmount <= 0) {
                alert('Make a donation first')
                return;
            }
            await window.ethereum.request({ method: 'eth_requestAccounts' });
            setIsLoading(true)
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();

            const contract = new ethers.Contract(Data.address, Campaign.abi, signer);

            const transaction = await contract.withdraw();
            await transaction.wait();
            setChange(true);
            setIsLoading(false);
            alert('Withdrawal Successful')

        } catch (error) {
            setIsLoading(false)
            console.error(error);
        }
    }
    const releaseFunds = async () => {
        alert('Campaign Closed')
        try {

            await window.ethereum.request({ method: 'eth_requestAccounts' });
            setIsLoading(true)
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();

            const contract = new ethers.Contract(Data.address, Campaign.abi, signer);

            const transaction = await contract.releaseFunds();
            await transaction.wait();
            setIsLoading(false);
            alert('Funds Released, Campaign Closed')

        } catch (error) {
            setIsLoading(false)
            console.error(error);
        }
    }



    return (
        <div className="text-gray-700 body-font overflow-hidden bg-white">
            <div className="container px-5 py-16 mx-auto">
                <div className="lg:w-4/5 mx-auto flex flex-wrap">
                    <img alt="ecommerce" className="lg:w-1/2 w-full h-[32rem] object-cover object-center rounded border border-gray-200" src="https://ik.imagekit.io/q5edmtudmz/FB_IMG_15658659197157667_wOd8n5yFyXI.jpg" />
                    <div className="lg:w-1/2 w-full lg:pl-10 lg:py-6 mt-6 lg:mt-0">
                        <h1 className="text-gray-900 text-3xl title-font font-medium mb-1">{Data.title}</h1>
                        <p className="leading-relaxed">{Data.storyUrl}</p>
                        <div className="flex mt-4 space-x-3">
                            <button className="text-black text-sm  border px-4 py-2 rounded-lg hover:text-black hover:border-black mt-4 w-full">Required Amount : <span className='font-semibold'>{newData.requiredAmount} </span>MATIC</button>
                            <button className="text-black text-sm  border px-4 py-2 rounded-lg hover:text-black hover:border-black mt-4 w-full">Recieved Amount :   <span className='font-semibold'>{newData.recievedAmount} </span>MATIC</button>
                        </div>
                        {!close && <div>
                            <div className='mt-4'>
                                <div className="flex w-full space-x-3">
                                    <input
                                        type='number'
                                        className="px-4 py-2 rounded-lg border border-gray-300 w-full "
                                        placeholder="Enter Amount"
                                        value={amount}
                                        onChange={e => setAmount(e.target.value)}
                                    />
                                    <button
                                        onClick={DonateFunds}
                                        className='text-black text-sm h-full border px-4 py-3 rounded-lg hover:text-black hover:border-black  w-full'>Donate</button>
                                </div>
                            </div>
                            <button
                                onClick={WithDrawFunds}
                                className='text-black text-sm mt-4 border px-4 py-3 rounded-lg hover:text-black hover:border-black  w-full'>
                                WithDraw
                            </button>
                        </div>}
                        {close &&
                            <div>
                                <button
                                    disabled
                                    className='text-red-500 text-sm mt-4 border px-4 py-3 rounded-lg  hover:border-red-500  w-full'>
                                    Campaign Closed
                                </button>

                            </div>
                        }
                        <div>
                            <div>
                                <p className='font-semibold mt-4 text-lg'>Recent Donation:</p>
                                {newDonations.map((e) => {
                                    return (
                                        <div className='w-full border my-2 p-2 flex items-center justify-evenly' key={e.timestamp}>
                                            <p>{e.donar.slice(0, 6)}...{e.donar.slice(39)}</p>
                                            <p>{e.amount} Matic</p>
                                            <p>{new Date(e.timestamp * 1000).toLocaleString()}</p>
                                        </div>
                                    )
                                })
                                }
                            </div>
                            <div>
                                <p className='font-semibold mt-4 text-lg'>My Past Donation</p>
                                {mydonations.map((e) => {
                                    return (
                                        <div className='w-full border my-2 p-2 flex items-center justify-evenly' key={e.timestamp}>
                                            <p>{e.donar.slice(0, 6)}...{e.donar.slice(39)}</p>
                                            <p>{e.amount} Matic</p>
                                            <p>{new Date(e.timestamp * 1000).toLocaleString()}</p>
                                        </div>
                                    )
                                })
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Modal isOpen={isLoading} style={customStyles}>
                <TransactionLoader />
            </Modal>
        </div>
    )
}

export default Details

export async function getStaticPaths() {
    const provider = new ethers.providers.JsonRpcProvider(
        `${process.env.NEXT_PUBLIC_RPC_URL}`
    );

    const contract = new ethers.Contract(
        contractAddress,
        CampaignFactory.abi,
        provider
    );

    const getAllCampaigns = contract.filters.campaignCreated();
    const AllCampaigns = await contract.queryFilter(getAllCampaigns);

    return {
        paths: AllCampaigns.map((e) => ({
            params: {
                address: e.args.campaignAddress.toString(),
            }
        })),
        fallback: "blocking"
    }
}

export async function getStaticProps(context) {
    const provider = new ethers.providers.JsonRpcProvider(
        `${process.env.NEXT_PUBLIC_RPC_URL}`
    );

    const contract = new ethers.Contract(
        context.params.address,
        Campaign.abi,
        provider
    );

    const title = await contract.title();
    const requiredAmount = await contract.requiredAmount();
    const image = await contract.image();
    const storyUrl = await contract.story();
    const owner = await contract.owner();
    const recievedAmount = await contract.recievedAmount();

    const Donations = contract.filters.donated();
    const AllDonations = await contract.queryFilter(Donations);


    const Data = {
        address: context.params.address,
        title,
        requiredAmount: ethers.utils.formatEther(requiredAmount),
        image,
        recievedAmount: ethers.utils.formatEther(recievedAmount),
        storyUrl,
        owner,
    }

    const DonationsData = AllDonations.map((e) => {
        return {
            donar: e.args.donar,
            amount: ethers.utils.formatEther(e.args.amount),
            timestamp: parseInt(e.args.timestamp)
        }
    });

    return {
        props: {
            Data,
            DonationsData
        }
    }


}