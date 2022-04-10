import { useContext, useEffect, useState } from 'react'
import { ethers } from 'ethers'

import Card from '../components/Card'
import { TransactionContext } from '../context/TransactionContext'
import contractABI from "../src/artifacts/contracts/Campaign.sol/CampaignFactory.json"

const contractAddress = '0x066a327b3aa3D23B4CdCf009d454FD7cE770c793';

export default function Dashboard() {
  const [campaignsData, setCampaignsData] = useState([]);
  const { currentAccount } = useContext(TransactionContext);

  const Request = async () => {
    const provider = new ethers.providers.JsonRpcProvider(
      `${process.env.NEXT_PUBLIC_RPC_URL}`
    );

    const contract = new ethers.Contract(
      contractAddress,
      contractABI.abi,
      provider
    );

    const getAllCampaigns = contract.filters.campaignCreated(null, null, currentAccount);
    const AllCampaigns = await contract.queryFilter(getAllCampaigns);
    const AllData = AllCampaigns.map((e) => {
      return {
        title: e.args.title,
        image: e.args.imgURI,
        owner: e.args.owner,
        timeStamp: parseInt(e.args.timestamp),
        amount: ethers.utils.formatEther(e.args.requiredAmount),
        address: e.args.campaignAddress
      }
    })
    setCampaignsData(AllData)
  }
  useEffect(() => {
    Request();
  }, [])


  return (
    <div className=''>

      <div className='grid grid-cols-1 lg:grid-cols-2'>
        {/* title, amount, desc, date, account */}
        {campaignsData.map((data) => {
          return (

            <Card
              title={data.title}
              amount={data.amount}
              desc={data.owner}
              date={data.timeStamp}
              account={data.address}
              image={data.image}
              key={data.timeStamp}
            />
          )
        })}
      </div>

    </div>
  )

}

