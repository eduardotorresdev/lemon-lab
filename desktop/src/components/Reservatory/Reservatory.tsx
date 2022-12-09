import { useDrag } from "@hooks";
import { animated } from "react-spring";
import "./Reservatory.sass";

interface ReservatoryProps {
    name: string;
    x: number;
    y: number;
    percentage: number;
}

export const Reservatory = ({ name, x, y, percentage }: ReservatoryProps) => {
    const { bind, styles } = useDrag({ x, y });

    return (
        <animated.div className="reservatory" {...bind()} style={styles}>
            <div className="reservatory__wrap">
                <div
                    className="reservatory__fill"
                    style={{ height: `${percentage}%` }}
                ></div>
                <div className="reservatory__percentage">{`${percentage}%`}</div>
            </div>
            <div className="reservatory__name">{name}</div>
        </animated.div>
    );
};
