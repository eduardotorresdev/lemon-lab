import { useContext, useEffect, useRef } from "react";
import { AppContext } from "@contexts";
interface Coords {
    x: number;
    y: number;
}

const GAP = 50;
const WINDOW_WIDTH = window.innerWidth - GAP * 2;
const ITEM_WIDTH = 280;
const ITEM_HEIGHT = 450;
const ITEMS_PER_ROW = Math.floor(WINDOW_WIDTH / (ITEM_WIDTH + GAP));

const COLUMNS = Array(ITEMS_PER_ROW)
    .fill(0)
    .map((value, index) => {
        return (2 * GAP + ITEM_WIDTH) * index + GAP;
    });

export const useSlot = () => {
    const { state } = useContext(AppContext);
    const lastResources = useRef(state.activeProject?.tickets[0].resources || []);
    const slots = useRef<Coords[]>([]);

    useEffect(() => {
        const newItems = state.activeProject?.tickets[0].resources || [];

        if (newItems.length !== lastResources.current.length)
            slots.current = [];
    }, [state]);

    const getColumn = (coords?: Coords): number | undefined => {
        if (!coords) return COLUMNS[0];

        const item = coords.x;
        const prevColumn = COLUMNS.findIndex((COLUMN) => item <= COLUMN) + 1;

        return COLUMNS[prevColumn % COLUMNS.length];
    };

    const getRow = (index?: number) => {
        const rowNumber = Math.floor(index / ITEMS_PER_ROW);

        return Math.max(GAP, rowNumber * (GAP + ITEM_HEIGHT));
    };

    const getSlot = () => {
        const lastSlot = slots.current.at(-1);
        const column = getColumn(lastSlot);
        const row = getRow(slots.current.length);

        const slot = {
            x: column,
            y: row,
        };

        const newSlots = [...slots.current, slot];

        slots.current = newSlots
            .sort((a, b) => a.y - b.y)
            .sort((a, b) => b.x - b.x);

        return slot;
    };

    return {
        getSlot,
    };
};
