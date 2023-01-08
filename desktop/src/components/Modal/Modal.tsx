import "./Modal.sass";
import ReactDOM from "react-dom";
import { ReactNode, useState } from "react";
import { Button } from "..";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClose } from "@fortawesome/free-solid-svg-icons";

interface useModalProps {
    initialOpen?: boolean;
}

export const useModal = (
    { initialOpen }: useModalProps = { initialOpen: false }
) => {
    const [open, setOpen] = useState(initialOpen);

    const toggle = (state: boolean | undefined = undefined) => {
        setOpen((open) => (state === undefined ? !open : state));
    };

    return {
        open,
        toggle,
    };
};

interface ModalProps {
    open: boolean;
    title: string;
    footer: ReactNode;
    toggle: (state?: boolean | undefined) => void;
    children: ReactNode;
}

export const Modal = ({
    open,
    title,
    footer,
    toggle,
    children,
}: ModalProps) => {
    return ReactDOM.createPortal(
        <div className={`modal ${open && "modal--open"}`}>
            <div className="modal__dialog">
                <div className="modal__header">
                    <h1 className="modal__title">{title}</h1>
                    <Button
                        onClick={() => toggle(false)}
                        className="modal__button"
                    >
                        <FontAwesomeIcon icon={faClose} />
                    </Button>
                </div>
                <div className="modal__body">{children}</div>
                {footer && <div className="modal__footer">{footer}</div>}
            </div>
        </div>,
        document.querySelector("#modal")
    );
};
