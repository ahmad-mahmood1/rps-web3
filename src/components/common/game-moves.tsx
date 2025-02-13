import { MOVES } from '@/constants';
import { GameMove } from '@/types';
import { Button } from '@/components/ui/button';

type GameMovesProps = {
  selectedMove: GameMove | undefined;
  setSelectedMove: (move: GameMove) => void;
};

function GameMoves({ selectedMove, setSelectedMove }: GameMovesProps) {
  return (
    <div className='flex items-center gap-2 flex-wrap'>
      {Object.keys(MOVES).map((move) => (
        <Button
          variant={selectedMove === move ? 'default' : 'outline'}
          className='cursor-pointer'
          onClick={() => setSelectedMove(move as GameMove)}
          key={move}
        >
          {move}
        </Button>
      ))}
    </div>
  );
}

export default GameMoves;
