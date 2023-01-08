import { useDrag as dragEngine } from "@use-gesture/react";
import { useContext, useRef } from "react";
import { useSpring } from "react-spring";
import { generateId, getRect } from "@helpers";
import { GroupContext } from "../contexts/GroupContext";

interface useDragProps {
    x?: number;
    y?: number;
    fixed?: boolean;
    canDrag?: {
        current: boolean;
    };
}

const FRAME_HEIGHT = 32;
const DRAG_BOUNDS_GAP = 10;

export const useDrag = (
    { x = 0, y = 0, fixed, canDrag = { current: true } }: useDragProps = {
        x: 0,
        y: 0,
        fixed: false,
    }
) => {
    const { setState } = useContext(GroupContext);
    const idRef = useRef(generateId());
    const dragRef = useRef<HTMLElement | undefined>();
    const initial = useRef({ posX: x, posY: y });
    const [{ posX, posY }, api] = useSpring(() => ({
        posX: x,
        posY: y,
        config: {
            mass: 1,
            friction: 20,
            tension: 180,
        },
        onChange: (result: any) =>
            setState((state) => ({
                children: {
                    ...state.children,
                    [idRef.current]: [result.value.posX, result.value.posY],
                },
            })),
    }));
    const bind: any = dragEngine(({ down, cancel, movement: [posX, posY] }) => {
        if (!canDrag.current) cancel();

        if (!down) {
            initial.current = {
                posX: initial.current.posX + posX,
                posY: initial.current.posY + posY,
            };
            return;
        }

        api.start({
            posX: initial.current.posX + posX,
            posY: initial.current.posY + posY,
        });
    });

    return {
        dragRef,
        bind,
        styles: { x: posX, y: posY, touchAction: "none" },
    };
};
