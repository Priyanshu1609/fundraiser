import { useContext, useEffect } from 'react'
import { ethers } from 'ethers'

import Card from '../components/Card'
import { TransactionContext } from '../context/TransactionContext'
import contractABI from "../src/artifacts/contracts/Campaign.sol/CampaignFactory.json"

const contractAddress = '0x35cc3c9CDfCBD324e9de15947213a2D650a2dd35';

export default function Dashboard() {
  const [campaignsData, setCampaignsData] = useState([]);
  const { currentAccount } = useContext(TransactionContext);

  const Request = async () => {
    const provider = new ethers.providers.JsonRpcProvider(
      'https://speedy-nodes-nyc.moralis.io/1f78a0705fba1289cf96bf3b/polygon/mumbai'
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
              key={data.id}
            />
          )
        })}
      </div>

    </div>
  )

}

