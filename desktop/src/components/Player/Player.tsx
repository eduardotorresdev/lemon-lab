import { useCallback, useContext, useEffect, useState } from "react";
import { AppContext } from "@contexts";
import "./Player.sass";
import { useDrag } from "@hooks";
import { animated, useSpring } from "react-spring";
import { Button } from "@components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faMinus,
    faPlay,
    faPause,
    faPlus,
} from "@fortawesome/free-solid-svg-icons";

const MAX_FREQ = 1500;
const MIN_FREQ = 100;
const INCREMENT_FREQ = 50;

const GAP = 10;
const PLAYER_WIDTH = 400;

export const Player = () => {
    const { state, setState } = useContext(AppContext);
    const [{ width }, api] = useSpring(() => ({ width: 0 }));
    const { bind, styles } = useDrag({
        x: window.innerWidth - PLAYER_WIDTH - GAP,
        y: 32 + GAP,
        fixed: true,
    });

    const increment = () => {
        setState((state) => ({
            ...state,
            freq:
                state.freq < MAX_FREQ
                    ? state.freq + INCREMENT_FREQ
                    : state.freq,
        }));
    };

    const decrement = () => {
        setState((state) => ({
            ...state,
            freq:
                state.freq > MIN_FREQ
                    ? state.freq - INCREMENT_FREQ
                    : state.freq,
        }));
    };

    const getFormattedTime = useCallback((minutes: number) => {
        const seconds = minutes * 60;
        const m = Math.floor((seconds % 3600) / 60)
            .toString()
            .padStart(2, "0");
        const s = Math.floor((seconds % 3600) % 60)
            .toString()
            .padStart(2, "0");

        return `${m}:${s}`;
    }, []);

    const getCurrentTime = useCallback(() => {
        return getFormattedTime(state.currentTicket / state.freq);
    }, [state]);

    const getTotalTime = useCallback(() => {
        return getFormattedTime(state.totalTickets / state.freq);
    }, [state]);

    const getPercentage = useCallback(() => {
        return (
           (state.currentTicket / state.totalTickets) * 100
        );
    }, [state.currentTicket, state.totalTickets]);

    useEffect(() => {
        const percentage = getPercentage();
        api.start({ width: percentage });
    }, [state.currentTicket, state.totalTickets]);

    return (
        <animated.div
            className={`player ${state.activeProject && "player--show"}`}
            {...bind()}
            style={styles}
        >
            <h3 className="player__title title">{state.activeProject?.name}</h3>
            <div className="player__controls">
                <div className="player__timeline">
                    <span className="player__bar">
                        <animated.span
                            className="player__progress"
                            style={{ width: width.to((value) => `${value}%`) }}
                        ></animated.span>
                        <span className="player__marker"></span>
                    </span>
                </div>
                <Button
                    className="player__play"
                    onClick={() => {
                        setState((state) => ({
                            ...state,
                            playing: !state.playing,
                            currentTicket:
                                !state.playing &&
                                state.currentTicket === state.totalTickets - 1
                                    ? 0
                                    : state.currentTicket,
                        }));
                    }}
                >
                    <FontAwesomeIcon icon={state.playing ? faPause : faPlay} />
                </Button>
                <span className="player__time">
                    {getCurrentTime()}/{getTotalTime()}
                </span>
                <span className="player__tickets">
                    -{state.remainingTickets} Tickets
                </span>
                <span className="player__freq">
                    <Button
                        onClick={increment}
                        disabled={state.freq === MAX_FREQ}
                        className="player__action player__action--increment"
                    >
                        <FontAwesomeIcon icon={faPlus} />
                    </Button>{" "}
                    {state.freq} Tickets/min{" "}
                    <Button
                        onClick={decrement}
                        disabled={state.freq === MIN_FREQ}
                        className="player__action player__action--decrement"
                    >
                        <FontAwesomeIcon icon={faMinus} />
                    </Button>
                </span>
            </div>
        </animated.div>
    );
};
