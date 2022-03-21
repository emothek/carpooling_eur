import React, { useEffect, useState } from 'react';
import NetInfo from '@react-native-community/netinfo';

export const NetworkContext = React.createContext({ isConnected: true });

export function NetworkProvider (props) {
  const [isConnected, setIsConnected] = useState(true);

  handleConnectivity = isConnected => setIsConnected(isConnected);

  useEffect(()=>{
    const unsubscribe = NetInfo.addEventListener(listener => {
      handleConnectivity(listener.isConnected);
    })

    return () => {
      unsubscribe()
    }
  }, [])

  return(
    <NetworkContext.Provider value={isConnected}>
      {props.children}
    </NetworkContext.Provider>
  )
}
 