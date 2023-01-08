import { AppContext } from "@contexts";
import { useContext, useEffect } from "react";

// FREQ = TICKETS PER SECOND
const MAX_FREQ = 1500;
const MIN_FREQ = 100;
const INCREMENT_FREQ = 50;

export const usePlayer = () => {
    const { state, setState } = useContext(AppContext);

    const startAt = (percentage: number) => {
        setState((state) => {
            const currentTicket = Math.ceil(
                state.totalTickets * (percentage / 100)
            ) - 1;

            return {
                ...state,
                currentTicket,
                remainingTickets: state.totalTickets - currentTicket,
                reset: true
            };
        });
    };

    const play = () => {
        setState((state) => ({
            ...state,
            playing: true,
            currentTicket:
                state.currentTicket === state.totalTickets - 1
                    ? 0
                    : state.currentTicket,
        }));
    };

    const pause = () => {
        setState((state) => ({
            ...state,
            playing: false,
            reset: true
        }));
    };

    const restart = () => {
        setState((state) => ({
            ...state,
            playing: false,
            currentTicket: 0,
            reset: true
        }));
    };

    const canSpeedUp = () => {
        return state.freq < MAX_FREQ;
    };

    const canSpeedDown = () => {
        return state.freq > MIN_FREQ;
    };

    const speedUp = () => {
        setState((state) => ({
            ...state,
            freq:
                state.freq < MAX_FREQ
                    ? state.freq + INCREMENT_FREQ
                    : state.freq,
        }));
    };

    const speedDown = () => {
        setState((state) => ({
            ...state,
            freq:
                state.freq > MIN_FREQ
                    ? state.freq - INCREMENT_FREQ
                    : state.freq,
        }));
    };

    useEffect(() => {
        const methods = {
            play,
            pause,
            restart,
            speedUp,
            speedDown,
        };
        window.electron.on(
            "player-change-state",
            (
                event,
                flag: "play" | "pause" | "restart" | "speedUp" | "speedDown"
            ) => {
                methods[flag]();
            }
        );
    }, []);

    return {
        state,
        play,
        startAt,
        pause,
        restart,
        canSpeedUp,
        canSpeedDown,
        speedUp,
        speedDown,
    };
};
