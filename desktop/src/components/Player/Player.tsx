import { useCallback, useContext, useEffect, useRef, useState } from "react";
import "./Player.sass";
import { useDrag, usePlayer } from "@hooks";
import { animated, useSpring } from "react-spring";
import { Button, Slider } from "@components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faMinus,
    faPlay,
    faPause,
    faPlus,
} from "@fortawesome/free-solid-svg-icons";

const GAP = 10;
const PLAYER_WIDTH = 400;

export const Player = () => {
    const {
        state,
        startAt,
        play,
        pause,
        canSpeedUp,
        canSpeedDown,
        speedUp,
        speedDown,
    } = usePlayer();
    const canDrag = useRef(true)
    const [percentage, setPercentage] = useState(0);
    const { bind, styles } = useDrag({
        x: window.innerWidth - PLAYER_WIDTH - GAP,
        y: 32 + GAP,
        fixed: true,
        canDrag
    });

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
        return (state.currentTicket / state.totalTickets) * 100;
    }, [state.currentTicket, state.totalTickets]);

    useEffect(() => {
        const percentage = getPercentage();
        setPercentage(percentage);
    }, [state.currentTicket, state.totalTickets]);

    return (
        <animated.div
            {...bind()}
            className={`player ${state.activeProject && "player--show"}`}
            style={styles}
        >
            <h3 className="player__title title">{state.activeProject?.name}</h3>
            <div className="player__controls">
                <Slider
                    percentage={percentage}
                    onSlide={(percentage) => startAt(percentage)}
                    onSlideStart={() => {
                        canDrag.current = false;
                    }}
                    onSlideEnd={() => {
                        canDrag.current = true;
                    }}
                />
                <Button
                    className="player__play"
                    onClick={() => {
                        state.playing ? pause() : play();
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
                        onClick={speedUp}
                        disabled={!canSpeedUp()}
                        className="player__action player__action--increment"
                    >
                        <FontAwesomeIcon icon={faPlus} />
                    </Button>{" "}
                    {state.freq} Tickets/min{" "}
                    <Button
                        onClick={speedDown}
                        disabled={!canSpeedDown()}
                        className="player__action player__action--decrement"
                    >
                        <FontAwesomeIcon icon={faMinus} />
                    </Button>
                </span>
            </div>
        </animated.div>
    );
};
