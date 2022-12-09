import { createContext, Dispatch, SetStateAction } from 'react';

interface GroupContextState {
    children: { [key: string]: [number, number] }
}

interface GroupContextProps {
    state: GroupContextState;
    setState: Dispatch<SetStateAction<GroupContextState>>
}

export const GroupContext = createContext<GroupContextProps>({
    state: {
        children: {}
    },
    setState: () => { }
});