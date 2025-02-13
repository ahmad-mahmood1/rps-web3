import { NavigateBack } from '@/components/common/navigate-back';
import { CreateGameForm } from '@/components/forms/create-game-form';
import { EnterGameForm } from '@/components/forms/enter-game-form';
import { ROUTES } from '@/constants';
import { useMatch } from 'react-router-dom';

function StartGame() {
  const isCreateGameRoute = useMatch(ROUTES.CREATE_GAME);
  const isEnterGameRoute = useMatch(ROUTES.ENTER_GAME);

  return (
    <div className='grid place-content-center min-h-screen space-y-6'>
      <div>
        <NavigateBack />
      </div>
      {isCreateGameRoute && <CreateGameForm />}
      {isEnterGameRoute && <EnterGameForm />}
    </div>
  );
}

export default StartGame;
