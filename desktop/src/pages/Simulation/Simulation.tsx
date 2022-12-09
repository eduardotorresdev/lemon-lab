import {
    Resource,
    Bridge,
    Player,
    Reservatory,
    Group,
    Queue,
} from "@components";
import { useSlot } from "@hooks";
import { useContext, useEffect, useRef } from "react";
import { AppContext } from "@contexts";
import "./Simulation.sass";

export const Simulation = () => {
    const { getSlot } = useSlot();
    const { state, setState } = useContext(AppContext);
    const lastInterval = useRef(null);

    useEffect(() => {
        clearInterval(lastInterval.current);

        if (!state.playing || state.currentTicket === state.totalTickets - 1)
            return;

        lastInterval.current = setInterval(() => {
            setState((state) => {
                if (state.currentTicket === state.totalTickets - 1) {
                    return {
                        ...state,
                        playing: false,
                    };
                }

                return {
                    ...state,
                    currentTicket: state.currentTicket + 1,
                };
            });
        }, 60000 / state.freq); // 1 minuto

        return () => {
            clearInterval(lastInterval.current);
        };
    }, [state.freq, state.playing]);

    return (
        <div className="simulation">
            <Group>
                {state.activeProject?.tickets[
                    state.currentTicket
                ].resources.map((resource) => {
                    const slot = getSlot();

                    return (
                        <Bridge
                            key={slot.x + slot.y + ""}
                            x={slot.x}
                            y={slot.y}
                        >
                            <Resource name={resource.name} metrics={resource.metrics} />
                            <Queue items={resource.queue}></Queue>
                        </Bridge>
                    );
                })}
                {state.activeProject?.tickets[
                    state.currentTicket
                ].containers.map((container) => {
                    const slot = getSlot();

                    return (
                        <Reservatory
                            key={container.name}
                            name={container.name}
                            x={slot.x}
                            y={slot.y}
                            percentage={container.percentage}
                        />
                    );
                })}
            </Group>
            <Player />
        </div>
    );
};
