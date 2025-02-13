import { Toaster } from '@/components/ui/toaster';
import { ROUTES } from '@/constants';
import MainLayout from '@/layout/main-layout';
import GameRoom from '@/pages/game-room';
import Home from '@/pages/home';
import StartGame from '@/pages/start-game';
import { useSocket } from '@/socket.io/useSocket';
import { BrowserRouter, Navigate, Outlet, Route, Routes } from 'react-router-dom';
import { useAccount } from 'wagmi';

function App() {
  useSocket();
  const { isConnected } = useAccount();

  return (
    <BrowserRouter>
      <Toaster />
      <Routes>
        <Route element={<MainLayout />}>
          <Route element={<Home />} path={ROUTES.HOME} index />
          <Route element={isConnected ? <Outlet /> : <Navigate to={ROUTES.HOME} />}>
            <Route element={<StartGame />} path={ROUTES.CREATE_GAME} />
            <Route element={<StartGame />} path={ROUTES.ENTER_GAME} />
            <Route element={<GameRoom />} path={ROUTES.ACTIVE_GAME_ROOM} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
