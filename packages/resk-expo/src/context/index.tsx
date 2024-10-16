import React, { useMemo } from 'react';

export function ReskTamaguiProvider({ children, ...rest }: IReskTamaguiProviderProps) {
  return <ReskTamaguiContext.Provider value={{ ...rest }} children={children} />;
}

export type IReskTamaguiProviderProps = {
  children?: React.ReactNode;
}

const ReskTamaguiContext = React.createContext<IReskTamaguiContext>({});

export const useReskTamaguiContext = () => {
  return useMemo(() => {
    return ReskTamaguiContext;
  }, []);
};
export type IReskTamaguiContext = IReskTamaguiProviderProps;
