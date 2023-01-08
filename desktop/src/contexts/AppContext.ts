import { createContext, Dispatch, SetStateAction } from 'react';

interface AppContextState {
    activeProject: Project | null;
    freq: number;
    currentTicket: number;
    playing: boolean;
    reset: boolean;
    remainingTickets: number;
    totalTickets: number;
}

interface AppContextProps {
    state: AppContextState;
    setState: Dispatch<SetStateAction<AppContextState>>
}

export const AppContext = createContext<AppContextProps>({
    state: {
        activeProject: null,
        freq: 12,
        currentTicket: 0,
        playing: false,
        reset: false,
        remainingTickets: 3000,
        totalTickets: 3000
    },
    setState: () => { }
});