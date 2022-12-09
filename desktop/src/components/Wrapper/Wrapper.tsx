import { ReactNode } from "react";
import { Frame } from "@components";
import './Wrapper.sass';

interface WrapperProps {
    children: ReactNode;
}

export const Wrapper = ({ children }: WrapperProps) => {
    return (
        <div className="wrapper">
            <Frame />
            <div className="wrapper__content">{children}</div>
        </div>
    );
};
