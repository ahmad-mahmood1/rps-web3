import { ConnectButton } from '@rainbow-me/rainbowkit';
import { Outlet } from 'react-router-dom';
import { useAccount } from 'wagmi';

function MainLayout() {
  const { isConnected } = useAccount();

  return (
    <>
      <div className='p-2 font-bold flex items-center justify-between absolute top-1.5 min-w-screen font-mono'>
        <p>Testnet - Sepolia</p>
        {isConnected && <ConnectButton />}
      </div>
      <div className='min-h-screen grid place-content-center px-10 py-2 font-mono'>
        <Outlet />
      </div>
    </>
  );
}

export default MainLayout;
