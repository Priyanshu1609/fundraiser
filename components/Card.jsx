import React from 'react'
import { useRouter } from 'next/router'

const Card = ({ title, amount, desc, date, account, image }) => {

    const router = useRouter();
    const handleClick = () => {
        router.push(`/${account}`);
    }
    console.log('Image in card', image)
    return (
        <div className="flex shadow-lg  mx-6 md:mx-auto my-8 md:max-w-2xl h-72">
            <img className="h-full w-full md:w-1/3  object-cover rounded-lg rounded-r-none pb-5/6" src='https://ik.imagekit.io/q5edmtudmz/FB_IMG_15658659197157667_wOd8n5yFyXI.jpg' alt="bag" />
            <div className="w-full relative md:w-2/3 px-4 py-4 rounded-lg">
                <div className="flex items-center">
                    <h2 className="text-xl text-gray-800 font-medium mr-auto">{title}</h2>
                </div>
                <p className="text-sm text-semibold mt-4">
                    Owner : {desc}
                </p>
                <div className="grid grid-cols-2 items-center rounded-xl mt-4 space-y-1 w-full">

                    <span >Campaign Address:</span><p className="text-black text-sm font-semibold border px-2 py-1 rounded-lg hover:text-black hover:border-black">{`${account.slice(0, 6)}...${account.slice(30)}`}</p>
                    <span>Account :</span><p className="text-black text-sm font-semibold border px-2 py-1 rounded-lg hover:text-black hover:border-black">{amount}</p>
                    <span>Date :</span><p className="text-black text-sm font-semibold border px-2 py-1 rounded-lg hover:text-black hover:border-black">{new Date(date * 1000).toLocaleString()}</p>

                </div>

                <button onClick={handleClick} className=" text-black text-sm font-semibold border px-4 py-2 rounded-lg hover:text-black hover:border-black w-[90%] mb-4 bottom-0 absolute">Go To Campaign</button>
            </div>
        </div>

    )
}

export default Card