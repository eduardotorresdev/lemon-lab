import { ArrayXY } from "@svgdotjs/svg.js";
import { useState } from "react";
import { getRect, absToRelative, svg } from "@helpers";

export const useGroup = () => {
    const [connectors, set] = useState<
        {
            square: MinRect;
            line: string;
        }[]
    >([]);

    const getConnectors = (
        element: DOMRect
    ): {
        top: ArrayXY;
        right: ArrayXY;
        left: ArrayXY;
        bottom: ArrayXY;
    } => {
        return {
            top: [element.x + element.width / 2, element.y],
            right: [element.x + element.width, element.y + element.height / 2],
            left: [element.x, element.y + element.height / 2],
            bottom: [element.x + element.width / 2, element.y + element.height],
        };
    };

    const getMedium = (element: DOMRect, axis: "x" | "y") => {
        const offset = 1;
        const length: {
            x: "width";
            y: "height";
        } = {
            x: "width",
            y: "height",
        };

        return (element[axis] + element[length[axis]]) / 2 - offset;
    };

    const getConnector = (
        parent: DOMRect,
        child: DOMRect
    ): {
        axis: "x" | "y";
        point: ArrayXY;
        direction: "top" | "bottom" | "left" | "right";
    } => {
        const mediumX = getMedium(child, "x");
        const mediumY = getMedium(child, "y");
        const connectors = getConnectors(parent);

        if (mediumX < parent.x) {
            return {
                axis: "x",
                point: connectors.left,
                direction: "left",
            };
        }

        if (mediumX > parent.x + parent.width) {
            return {
                axis: "x",
                point: connectors.right,
                direction: "right",
            };
        }

        if (mediumY < parent.y) {
            return {
                axis: "y",
                point: connectors.top,
                direction: "top",
            };
        }

        if (mediumY > parent.y + parent.height) {
            return {
                axis: "y",
                point: connectors.bottom,
                direction: "bottom",
            };
        }

        return null;
    };

    const middlePoints = (
        start: [number, number],
        end: [number, number],
        axis: "x" | "y"
    ): [number, number][] => {
        if (axis === "y") {
            return [
                [start[0], (start[1] + end[1]) / 2],
                [end[0], (start[1] + end[1]) / 2],
            ];
        }

        return [
            [(start[0] + end[0]) / 2, start[1]],
            [(start[0] + end[0]) / 2, end[1]],
        ];
    };

    const mountLine = (
        start: [number, number],
        end: [number, number],
        startAxis: "x" | "y",
        endAxis: "x" | "y"
    ): [number, number][] => {
        if (startAxis !== endAxis) {
            if (startAxis === "x") return [start, [end[0], start[1]], end];

            return [start, [start[0], end[1]], end];
        }

        return [start, ...middlePoints(start, end, startAxis), end];
    };

    const toString = (line: [number, number][]) => {
        const controlPointCalc = svg.controlPoint(svg.line, 0.2);
        const bezierCommandCalc = svg.bezierCommand(controlPointCalc);
        return svg.svgPath(line, bezierCommandCalc);
    };

    const drawLine = (
        pivot: HTMLElement,
        element: HTMLElement,
        square: MinRect
    ): string | null => {
        const parent = getRect(pivot, square);
        const child = getRect(element, square);
        const start = getConnector(parent, child);
        const end = getConnector(child, parent);

        if (!start || !end) {
            return null;
        }

        const line = toString(
            mountLine(start.point, end.point, start.axis, end.axis)
        );

        return line;
    };

    const mountSquare = (
        elements: [HTMLElement, HTMLElement],
        wrapper = document.body
    ) => {
        const arr = elements.map((element) => getRect(element, wrapper));

        const square = arr.reduce(
            (prev, cur) => {
                return {
                    x: prev.x == 0 ? cur.x : Math.min(prev.x, cur.x),
                    y: prev.y == 0 ? cur.y : Math.min(prev.y, cur.y),
                    width: Math.max(prev.x + prev.width, cur.x + cur.width),
                    height: Math.max(prev.y + prev.height, cur.y + cur.height),
                };
            },
            {
                x: 0,
                y: 0,
                width: 0,
                height: 0,
            }
        );

        return {
            left: square.x,
            top: square.y,
            width: square.width - square.x,
            height: square.height - square.y,
        };
    };

    const drawSvgs = (pivot: HTMLElement, elements: HTMLElement[]) => {
        set(
            elements
                .map((element) => {
                    const square = mountSquare([pivot, element]);
                    const line = drawLine(
                        pivot,
                        element,
                        mountSquare([pivot, element])
                    );

                    if (!line) return null;

                    return {
                        square: absToRelative(
                            square,
                            document.querySelector(
                                ".wrapper__content"
                            ) as HTMLElement
                        ),
                        line,
                    };
                })
                .filter((element) => element !== null)
        );
    };

    return { connectors, drawSvgs };
};
