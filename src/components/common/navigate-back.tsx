import { Button } from '@/components/ui/button';
import { LuArrowLeft } from 'react-icons/lu';
import { useNavigate } from 'react-router-dom';

export const NavigateBack = () => {
  const navigate = useNavigate();

  return (
    <Button className='rounded-full' onClick={() => navigate(-1)}>
      <LuArrowLeft />
    </Button>
  );
};
