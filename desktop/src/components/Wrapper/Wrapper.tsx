import { ReactNode, useEffect } from "react";
import { Button, Frame, Menu, Modal, useModal } from "@components";
import "./Wrapper.sass";

interface WrapperProps {
    children: ReactNode;
}

export const Wrapper = ({ children }: WrapperProps) => {
    const { open, toggle } = useModal();

    useEffect(() => {
        window.electron.on("show-about", (event) => {
            toggle(true);
        });
    }, []);

    return (
        <div className="wrapper">
            <Frame />
            {window.electron.system() !== "mac" && <Menu />}
            <div className="wrapper__content">{children}</div>
            <Modal
                title="Sobre"
                toggle={toggle}
                open={open}
                footer={<Button onClick={() => toggle()}>Voltar</Button>}
            >
                <p>
                    Esse programa é um fruto do trabalho de conclusão de curso
                    em ciências da computação, do aluno da Universidade Federal
                    do Maranhão, Eduardo José Torres Rocha.
                </p>
                <p>
                    Para entender mais sobre a construção do projeto, assim
                    como os seus objetivos, basta acessar o{" "}
                    <a target="_blank" href="https://github.com/eduardotorresdev/lemon-lab">repositório</a> no GitHub.
                </p>
                <i>
                    Este é um projeto público, livre, sem fins lucrativos e
                    completamente aberto a contribuições.
                    <br />
                    <br />
                    Torne-se um contribuidor! ❤️☕️
                </i>
            </Modal>
        </div>
    );
};
