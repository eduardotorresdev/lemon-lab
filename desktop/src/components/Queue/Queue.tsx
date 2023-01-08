import { faLemon } from "@fortawesome/free-regular-svg-icons";
import {
    faBowlFood,
    faBreadSlice,
    faBurger,
    faCookie,
    faPizzaSlice,
    faTriangleExclamation,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Fragment, useContext, useEffect, useRef, useState } from "react";
import { AppContext } from "../../contexts/AppContext";
import "./Queue.sass";

interface QueueProps {
    type: "normal" | "priority";
    items: {
        id: number;
        priority: number;
    }[];
}

const QUEUE_SIZE = 5;
const ICON = [
    faBurger,
    faLemon,
    faPizzaSlice,
    faBreadSlice,
    faCookie,
    faBowlFood,
    faTriangleExclamation,
];

export const Queue = ({ items = [], type = "normal" }: QueueProps) => {
    const { state } = useContext(AppContext);
    const prevItems = useRef(items);

    const [queue, setQueue] = useState(
        items.map((item) => ({
            id: item.id,
            priority: item.priority,
            icon: ICON[item.id % 6],
        }))
    );

    useEffect(() => {
        if (state.reset) {
            const queue = items.map((item) => ({
                id: item.id,
                priority: item.priority,
                icon: ICON[item.id % 6],
            }))
            setQueue(queue);
            prevItems.current = queue;
        }
    }, [state.reset]);

    useEffect(() => {
        if (prevItems.current.length > items.length) {
            setQueue((queue) => queue.slice(1));
            return;
        }

        if (prevItems.current.length < items.length) {
            setQueue(
                items.map((item) => ({
                    id: item.id,
                    priority: item.priority,
                    icon: ICON[item.id % 6],
                }))
            );
        }

        prevItems.current = items;
    }, [items]);

    let pos = 1;

    return (
        <div className="queue">
            <ul className="queue__list">
                {queue.slice(0, QUEUE_SIZE).map((item) => (
                    <li
                        key={item.id}
                        className={`queue__item queue__item--filled ${
                            item.priority === -1 && "queue__item--interrupted"
                        }`}
                    >
                        <FontAwesomeIcon
                            icon={item.priority === -1 ? ICON[6] : item.icon}
                            className="queue__icon"
                        />
                        <span className="queue__pos">{pos++}º</span>
                        {type === "priority" && item.priority !== -1 && (
                            <span className="queue__priority">
                                {item.priority}
                            </span>
                        )}
                    </li>
                ))}
                {queue.length < QUEUE_SIZE &&
                    Array(Math.max(0, QUEUE_SIZE - queue.length))
                        .fill({
                            id: 0,
                            icon: ICON[0],
                        })
                        .map((item, i) => (
                            <li key={i} className="queue__item">
                                <FontAwesomeIcon
                                    icon={item.icon}
                                    className="queue__icon"
                                />
                                <span className="queue__pos">{pos++}º</span>
                            </li>
                        ))}
            </ul>
            {queue.length > QUEUE_SIZE && (
                <Fragment>
                    <span className={`queue__more`}>
                        +{queue.slice(QUEUE_SIZE).length}
                    </span>
                </Fragment>
            )}
        </div>
    );
};
