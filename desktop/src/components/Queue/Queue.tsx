import { faLemon } from "@fortawesome/free-regular-svg-icons";
import {
    faBowlFood,
    faBreadSlice,
    faBurger,
    faCookie,
    faPizzaSlice,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Fragment, useContext, useEffect, useState } from "react";
import { AppContext } from "../../contexts/AppContext";
import "./Queue.sass";

interface QueueProps {
    items: number[];
    onPull?: () => void;
}

const QUEUE_SIZE = 4;
const ICON = [
    faBurger,
    faLemon,
    faPizzaSlice,
    faBreadSlice,
    faCookie,
    faBowlFood,
];

let id = 1;

export const Queue = ({ items = [1, 3, 5, 7], onPull }: QueueProps) => {
    const { state } = useContext(AppContext);
    const [shake, setShake] = useState(false);

    const [queue, setQueue] = useState(
        items
            .concat(Array(Math.max(0, 4 - items.length)).fill(null))
            .map((item, i) => ({
                id: id++,
                icon: ICON[i % 6],
                active: item !== null,
            }))
    );

    useEffect(() => {
        if (state.playing === true && state.currentTicket === 0)
            setQueue(
                items
                    .concat(Array(Math.max(0, 4 - items.length)).fill(null))
                    .map((item, i) => ({
                        id: id++,
                        icon: ICON[i % 6],
                        active: item !== null,
                    }))
            ),
            id = 1
    }, [state.playing]);

    useEffect(() => {
        if (queue.length > items.length) {
            setQueue((queue) =>
                queue.slice(1).concat([
                    {
                        id: queue[0].id,
                        icon: ICON[queue.length % 6],
                        active: false,
                    },
                ])
            );
            onPull && onPull();
            return;
        }

        if (queue.length < items.length) {
            setQueue((queue) => {
                const activeSlots = queue.filter((item) => item.active);

                const arr = [...queue];
                arr[activeSlots.length] = {
                    id: id++,
                    icon: ICON[id % 6],
                    active: true,
                };

                return arr;
            });
        }

        setShake(false);
        setShake(true);
    }, [items]);

    return (
        <div className="queue">
            <ul className="queue__list">
                {queue.slice(0, QUEUE_SIZE).map((item, i) => (
                    <li
                        key={item.id}
                        className={`queue__item ${
                            item.active && "queue__item--filled"
                        }`}
                    >
                        <FontAwesomeIcon
                            icon={item.icon}
                            className="queue__icon"
                        />
                        <span className="queue__pos">{i + 1}º</span>
                    </li>
                ))}
            </ul>
            {queue.filter((item) => item.active).length > QUEUE_SIZE && (
                <Fragment>
                    <span
                        className={`queue__more ${
                            shake && "queue__more--shake"
                        }`}
                        onAnimationEnd={() => setShake(false)}
                    >
                        ...
                    </span>
                    <ul className="queue__sublist">
                        {queue
                            .slice(4)
                            .filter((item) => item.active)
                            .map((item, i) => (
                                <li
                                    key={item.id}
                                    className={`queue__item ${
                                        item.active && "queue__item--filled"
                                    }`}
                                >
                                    <FontAwesomeIcon
                                        icon={item.icon}
                                        className="queue__icon"
                                    />
                                    <span className="queue__pos">
                                        {i + 1 + QUEUE_SIZE}º
                                    </span>
                                </li>
                            ))}
                    </ul>
                </Fragment>
            )}
        </div>
    );
};
