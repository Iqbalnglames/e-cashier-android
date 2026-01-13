import { createContext, ReactNode, useContext, useState } from "react";

type FloatingNavContextType = {
    hide: boolean;
    setHide: (value: boolean) => void;
}

type FloatingNavProviderProps = {
  children: ReactNode;
};

const FloatingNavContext = createContext<FloatingNavContextType | null>(null)

export function FloatingNavProvider({ children }: FloatingNavProviderProps) {
    const [ hide, setHide ] = useState(false)
    return(
        <FloatingNavContext.Provider value={{ hide, setHide }}>
            {children}
        </FloatingNavContext.Provider>
    )
}

export function useFloatingNav() {
    const context = useContext(FloatingNavContext)

    if(!context) {
        throw new Error('useFloatingNav must be used inside FloatingNavProvider')
    }
    return context
}