import {
    Children,
    ForwardedRef,
    forwardRef,
    Fragment,
    ReactNode,
    useEffect,
    useImperativeHandle,
    useRef,
    useState,
} from "react";
import { animated } from "react-spring";
import { useDrag } from "@hooks";
import "./Bridge.sass";

interface BridgeProps {
    x?: number;
    y?: number;
    queue?: number[];
    children: ReactNode;
}

export interface BridgeRef {
    sendPackage: () => void;
}

export const Bridge = forwardRef(
    ({ x = 50, y = 50, queue, children }: BridgeProps, ref: ForwardedRef<BridgeRef>) => {
        const [sending, setSending] = useState(false);
        const prevQueue = useRef([]);
        const { bind, styles } = useDrag({ x, y });

        const sendPackage = () => {
            setSending(false);
            setSending(true);
        };

        useImperativeHandle(ref, () => ({
            sendPackage,
        }));

        useEffect(() => {
            if(queue.length !== prevQueue.current.length) {
                setSending(false);
                setSending(true);
                prevQueue.current = queue;
            }
        }, [queue]);

        return (
            <animated.div className="bridge" {...bind()} style={styles}>
                {Children.map(children, (child, index) => (
                    <Fragment>
                        <div className="bridge__item">{child}</div>
                        {index < Children.count(children) - 1 && (
                            <div
                                className={`bridge__connector ${
                                    sending && "bridge__connector--sending"
                                }`}
                                onAnimationEnd={() => setSending(false)}
                            >
                                <span>Bridge</span>
                            </div>
                        )}
                    </Fragment>
                ))}
            </animated.div>
        );
    }
);
