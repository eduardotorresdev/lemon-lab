import { MouseEvent, ReactNode } from "react";
import "./Button.sass";

interface ButtonProps {
    type?: "button" | "submit" | "reset";
    alt?: boolean;
    large?: boolean;
    textAlign?: "left" | "right" | "center";
    className?: string;
    disabled?: boolean;
    loading?: boolean;
    onClick?: (e: MouseEvent<HTMLButtonElement>) => void;
    children: ReactNode;
}

export const Button = ({
    type = "button",
    large = false,
    alt = false,
    textAlign = "center",
    onClick,
    className,
    loading,
    disabled,
    children,
}: ButtonProps) => {
    return (
        <button
            type={type}
            disabled={disabled}
            className={`button
                ${large && "button--lg"}
                ${alt && "button--alt"}
                ${loading && "button--loading"}
                ${className}
            `}
            style={{ textAlign }}
            onClick={(e) => onClick && onClick(e)}
        >
            {children}
            <div className="button__loading">
                <span className="button__circle button__circle--1"></span>
                <span className="button__circle button__circle--2"></span>
                <span className="button__circle button__circle--3"></span>
                <span className="button__circle button__circle--4"></span>
            </div>
        </button>
    );
};
