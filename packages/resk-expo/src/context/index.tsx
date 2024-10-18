import React, { useMemo } from 'react';

export function ReskTamaguiProvider({ children, ...rest }: ReskExpoProviderProps) {
  return <ReskExpoProvider.Provider value={{ ...rest }} children={children} />;
}

export type ReskExpoProviderProps = {
  children?: React.ReactNode;
}

const ReskExpoProvider = React.createContext<IReskExpoProvider>({});

export const useReskExpoProvider = () => {
  return useMemo(() => {
    return ReskExpoProvider;
  }, []);
};
export type IReskExpoProvider = ReskExpoProviderProps;
