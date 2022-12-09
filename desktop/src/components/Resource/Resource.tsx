import { faLemon } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useRef, useState } from "react";
import "./Resource.sass";

interface ResourceProps {
    metrics: {
        usage: number|null
    };
}

const roundToTen = (x: number) => Math.round(x / 10) * 10;

export const Resource = ({ metrics }: ResourceProps) => {
    const prevUsageRef = useRef(0);
    const [units, setUnits] = useState(Array(10).fill(false));

    useEffect(() => {
        const prevUsage = prevUsageRef.current;

        if (metrics.usage !== prevUsage && metrics.usage) {
            setUnits((units) =>
                units.map(
                    (unit, index) => (index + 1) * 10 <= roundToTen(metrics.usage)
                )
            );

            prevUsageRef.current = metrics.usage;
            return;
        }
    }, [metrics.usage]);

    return (
        <div
            className={`resource ${metrics.usage >= 80 && "resource--overcharge"} ${
                metrics.usage > 60 && metrics.usage < 80 && "resource--alert"
            }`}
        >
            <FontAwesomeIcon icon={faLemon} className="resource__icon" />
            <div className="resource__usage">
                {units.map((value, index) => (
                    <p
                        key={index}
                        className={`resource__unit ${
                            value && "resource__unit--active"
                        }`}
                    >
                        <span className="resource__percentage">
                            {(index + 1) * 10}%
                        </span>
                    </p>
                ))}
            </div>
            <ul className="resource__metrics">
                <li className="resource__metric">
                    <span className="resource__label">Utilização: </span>
                    <span className="resource__value">{metrics.usage?.toFixed(2)}%</span>
                </li>
                <li className="resource__metric">
                    <span className="resource__label">Tempo de espera: </span>
                    <span className="resource__value">2min 30s</span>
                </li>
                <li className="resource__metric">
                    <span className="resource__label">Tempo de atend.: </span>
                    <span className="resource__value">1min 04s</span>
                </li>
            </ul>
        </div>
    );
};
