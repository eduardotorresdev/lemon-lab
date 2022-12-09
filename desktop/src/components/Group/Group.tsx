import { useGroup } from "@hooks";
import { ReactNode, useEffect, useRef, useState } from "react";
import { GroupContext } from "@contexts";
import "./Group.sass";

type GroupProps = {
    children: ReactNode;
};

export const Group = ({ children }: GroupProps) => {
    const ref = useRef<HTMLDivElement | null>(null);
    const [groupState, setGroupState] = useState({
        children: {},
    });
    const { connectors, drawSvgs } = useGroup();

    useEffect(() => {
        if (!ref.current) return;

        const arr: HTMLElement[] = Array.from(
            ref.current.childNodes as NodeListOf<HTMLElement>
        );
        const parent = arr.shift();
        drawSvgs(parent, arr);
    }, [children, groupState]);

    return (
        <GroupContext.Provider
            value={{ state: groupState, setState: setGroupState }}
        >
            <div className="group">
                <div ref={ref} className="group__wrap">
                    {children}
                </div>
                {connectors.map((connector) => (
                    <div
                        className="group__connector"
                        key={connector.line}
                        style={connector.square}
                    >
                        <svg
                            viewBox={`0 0 ${connector.square.width} ${connector.square.height}`}
                            className="icon"
                        >
                            <path
                                d={connector.line}
                                strokeWidth="1"
                                fill="none"
                                stroke="lightgreen"
                            ></path>
                        </svg>
                    </div>
                ))}
            </div>
        </GroupContext.Provider>
    );
};
