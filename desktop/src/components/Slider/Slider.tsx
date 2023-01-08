import { MutableRefObject, useEffect, useRef } from "react";
import { animated, useSpring } from "react-spring";
import { useDrag } from "@use-gesture/react";
import "./Slider.sass";

interface SliderProps {
    percentage: number;
    onSlide?: (percentage?: number) => void;
    onSlideStart?: () => void;
    onSlideEnd?: () => void;
}

export const Slider = ({
    percentage,
    onSlide = () => {},
    onSlideStart = () => {},
    onSlideEnd = () => {},
}: SliderProps) => {
    const initial = useRef(0);
    const debounce = useRef(0);
    const barRef = useRef<HTMLDivElement>();
    const markerRef = useRef<HTMLDivElement>();
    const isDragging = useRef(false);
    const [{ width }, progressApi] = useSpring(() => ({ width: 0 }));
    const [{ left }, markerApi] = useSpring(() => ({ left: 0 }));

    const getLeft = (ref: MutableRefObject<HTMLDivElement>) => {
        const rect = ref.current.getBoundingClientRect();

        return rect.left;
    };

    useEffect(() => {
        initial.current = getLeft(markerRef) - getLeft(barRef);
    }, []);

    useEffect(() => {
        progressApi.start({ width: percentage });
        if (!isDragging.current) markerApi.start({ left: percentage });
    }, [percentage]);

    const bind: any = useDrag(({ down, movement: [x] }) => {
        if (!down) {
            initial.current = getLeft(markerRef) - getLeft(barRef);
            isDragging.current = false;
            onSlideEnd();
            return;
        }

        isDragging.current = true;
        onSlideStart()
        const offset = Math.min(
            initial.current + x,
            barRef.current.clientWidth
        );
        if (offset > 0 && offset < barRef.current.clientWidth) {
            const percentage = Math.ceil(
                (offset / barRef.current.clientWidth) * 100
            );
            markerApi.start({ left: percentage, immediate: true });
            clearTimeout(debounce.current);
            debounce.current = setTimeout(() => {
                onSlide(percentage);
            }, 250) as unknown as number;
        }
    });

    return (
        <div className="slider">
            <div className="slider__bar" ref={barRef}>
                <animated.div
                    className="slider__progress"
                    style={{ width: width.to((value) => `${value}%`) }}
                ></animated.div>
                <animated.div
                    {...bind()}
                    style={{
                        left: left.to((value) => `${value}%`),
                        touchAction: "none"
                    }}
                    ref={markerRef}
                    className="slider__marker"
                ></animated.div>
            </div>
        </div>
    );
};
