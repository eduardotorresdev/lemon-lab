import { Children, forwardRef, Fragment, ReactNode } from "react";
import { animated } from "react-spring";
import { useDrag } from "@hooks";
import "./Bridge.sass";

interface BridgeProps {
    x?: number;
    y?: number;
    children: ReactNode;
}

export const Bridge = ({ x = 50, y = 50, children }: BridgeProps) => {
    const { bind, styles } = useDrag({ x, y });

    return (
        <animated.div className="bridge" {...bind()} style={styles}>
            {Children.map(children, (child, index) => (
                <Fragment>
                    <div className="bridge__item">{child}</div>
                    {index < Children.count(children) - 1 && (
                        <div className={`bridge__connector`}>
                            <span>Bridge</span>
                        </div>
                    )}
                </Fragment>
            ))}
        </animated.div>
    );
};
