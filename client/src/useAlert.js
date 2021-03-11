import { useContext } from 'react';
import Context from './Context';

const useAlert = () => {
  const alerter = useContext(Context);

  return alerter;
};

export default useAlert;