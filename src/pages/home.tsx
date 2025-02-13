import { Button } from '@/components/ui/button';
import { ROUTES } from '@/constants';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useNavigate } from 'react-router-dom';
import { useAccount } from 'wagmi';

function Home() {
  const navigate = useNavigate();

  const { isConnected } = useAccount();

  const handleNavigation = (route: string) => navigate(route);

  return (
    <div className='min-h-screen gird place-content-center text-center'>
      <h1>RPS - Web3</h1>
      {!isConnected && (
        <div className='flex items-center justify-center'>
          <ConnectButton />
        </div>
      )}

      {isConnected && (
        <div className='flex items-center justify-center gap-x-2 max-w-2xs mx-auto'>
          <Button onClick={() => handleNavigation(ROUTES.CREATE_GAME)} className='min-w-32'>
            Create Game
          </Button>
          <span className='text-slate-400'>or</span>
          <Button onClick={() => handleNavigation(ROUTES.ENTER_GAME)} className='min-w-32'>
            Enter Game
          </Button>
        </div>
      )}
    </div>
  );
}

export default Home;
