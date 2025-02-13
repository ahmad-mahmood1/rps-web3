import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

// get user confirmation on page refresh, reload or navigation
export const useBlockNavigation = (shouldBlock: boolean) => {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const onBeforeUnload = (ev: Event) => {
      if (shouldBlock) {
        ev.returnValue = true;
      }
    };

    const handlePopState = () => {
      if (shouldBlock) {
        const confirmNavigation = window.confirm('Please wait until game deployment is being processed');
        if (!confirmNavigation) {
          // Stay on same url in case user cancels navigation
          navigate(pathname);
        }
      }
    };

    window.addEventListener('popstate', handlePopState);

    window.addEventListener('beforeunload', onBeforeUnload);

    return () => {
      window.removeEventListener('popstate', handlePopState);

      window.removeEventListener('beforeunload', onBeforeUnload);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shouldBlock]);
};
