import { faLemon } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useRef, useState } from "react";
import { getTimeString, getRateString } from "@helpers";
import "./Resource.sass";

const roundToTen = (x: number) => Math.round(x / 10) * 10;

export const Resource = ({
    name,
    metrics,
}: Pick<Resource, "metrics" | "name">) => {
    const prevUsageRef = useRef(0);
    const [units, setUnits] = useState(Array(10).fill(false));

    useEffect(() => {
        const prevUsage = prevUsageRef.current;

        if (metrics.usage !== prevUsage && metrics.usage) {
            setUnits((units) =>
                units.map(
                    (unit, index) =>
                        (index + 1) * 10 <= roundToTen(metrics.usage)
                )
            );

            prevUsageRef.current = metrics.usage;
            return;
        }
    }, [metrics.usage]);

    return (
        <div
            className={`resource ${
                metrics.usage >= 80 && "resource--overcharge"
            } ${metrics.usage > 60 && metrics.usage < 80 && "resource--alert"}`}
        >
            <div className="resource__header">
                <FontAwesomeIcon icon={faLemon} className="resource__icon" />
                <h1 className="resource__title">{name}</h1>
            </div>
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
                    <span className="resource__value">
                        {metrics.usage ? `${metrics.usage?.toFixed(2)}%`: ''}
                    </span>
                </li>
                <li className="resource__metric">
                    <span className="resource__label">Taxa de chegada: </span>
                    <span className="resource__value">
                        {getRateString(metrics.arrivalRate)}
                    </span>
                </li>
                <li className="resource__metric">
                    <span className="resource__label">
                        Taxa de atendimento:{" "}
                    </span>
                    <span className="resource__value">
                        {getRateString(metrics.serviceRate)}
                    </span>
                </li>
                <li className="resource__metric">
                    <span className="resource__label">
                        Tempo de atendimento:{" "}
                    </span>
                    <span className="resource__value">
                        {getTimeString(metrics.serviceTime)}
                    </span>
                </li>
                <li className="resource__metric">
                    <span className="resource__label">Tempo de fila: </span>
                    <span className="resource__value">
                        {getTimeString(metrics.awaitQueue)}
                    </span>
                </li>
                <li className="resource__metric">
                    <span className="resource__label">Tempo de sistema: </span>
                    <span className="resource__value">
                        {getTimeString(metrics.awaitSystem)}
                    </span>
                </li>
            </ul>
        </div>
    );
};
