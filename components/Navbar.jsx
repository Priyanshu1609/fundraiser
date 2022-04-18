import { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';

import { TransactionContext } from '../context/TransactionContext'

const Navbar = () => {
  const { connectWallet, currentAccount } = useContext(TransactionContext)
  const [userName, setUserName] = useState('')

  useEffect(() => {
    if (!currentAccount) return;
    setUserName(
      `${currentAccount.slice(0, 7)}...${currentAccount.slice(35)}`,
    )
  }, [currentAccount])

  const router = useRouter();

  const handleClickSignin = () => connectWallet();

  const handleClickCampaign = () => router.push("/createCampaign");

  const handleClickHome = () => router.push("/");

  const handleClickDashboard = () => router.push("/dashboard");


  return (
    <div className="sticky top-0">
      <div className="shadow ">
        <div className="container mx-auto px-4 bg-white">
          <div className="flex items-center justify-between py-2">
            <div className="flex" onClick={handleClickHome}>
              <p className="cursor-pointer text-lg font-semibold ml-2 my-auto">FundRaiser</p>
            </div>

            {/* NavBarItems */}

            {currentAccount && <div className="flex items-center mx-2">
              <button className="text-black text-sm font-semibold hover:opacity-80 mr-4 cursor-pointer" onClick={handleClickHome} >Campaigns</button>
              <button className="text-black text-sm font-semibold hover:opacity-80 mr-4 cursor-pointer" onClick={handleClickCampaign} >Create Campaign</button>
              {/* <button disabled className="text-black text-sm font-semibold hover:opacity-80 mr-4 cursor-pointer " onClick={handleClickDashboard} >Dashboard</button> */}
            </div>}

            {/* Auth Buttons */}
            <div className="space-x-2">
              <>
                {!currentAccount && <div className="flexitems-center">
                  <AuthButton
                    onClick={handleClickSignin}
                    text="Sign In"
                  />
                </div>}
                {currentAccount && <AuthButton
                  text={`${userName}`}
                />}
              </>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const AuthButton = ({ text, onClick, disabled }) => {
  return (
    <button
      className="text-black text-sm font-semibold border px-4 py-2 rounded-lg hover:text-black hover:border-black"
      onClick={onClick}
      disabled={disabled}
    >
      {text}
    </button>
  );
};

export default Navbar;
