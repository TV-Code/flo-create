import { useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import LastViablePathContext from './LastViablePathContext';

const LocationListener = ({ children }) => {
    const [lastViablePath, setLastViablePath] = useState('/');
    const location = useLocation();
  
    useEffect(() => {
        const path = location.pathname;
        const isFormPath = path.endsWith('/new') || (path.match(/\/[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/) && !path.startsWith('/category/'));
        if (!isFormPath) {
          setLastViablePath(path);
        }
      }, [location.pathname]);
  
    return (
      <LastViablePathContext.Provider value={lastViablePath}>
        {children}
      </LastViablePathContext.Provider>
    );
  };

export default LocationListener;