import { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';

import { TransactionContext } from '../context/TransactionContext'

const Navbar = () => {
  const { connectWallet, currentAccount, logoutWallet } = useContext(TransactionContext)
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

  const handleClickSignOut = () => logoutWallet() && router.push("/");


  return (
    <div className="sticky top-0 ">
      <div className="shadow">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between py-2">
            <div className="flex">
              <p className="cursor-pointer text-lg font-semibold ml-2 my-auto">FundRaiser</p>
            </div>

            {/* NavBarItems */}

            <div className="hidden sm:flex sm:items-center">
              <p className="text-black text-sm font-semibold hover:opacity-80 mr-4 cursor-pointer" onClick={handleClickHome} >Campaigns</p>
              <p className="text-black text-sm font-semibold hover:opacity-80 mr-4 cursor-pointer" onClick={handleClickCampaign} >Create Campaign</p>
              <p className="text-black text-sm font-semibold hover:opacity-80 mr-4 cursor-pointer" onClick={handleClickDashboard} >Dashboard</p>
            </div>

            {/* Auth Buttons */}
            <div className="hidden sm:flex sm:items-center space-x-2">
              <>
                {!currentAccount && <div className="">
                  <AuthButton
                    onClick={handleClickSignin}
                    text="Sign In"
                  />
                </div>}
                {currentAccount && <AuthButton
                  text={`${userName}`}
                  onClick={handleClickSignOut}
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
