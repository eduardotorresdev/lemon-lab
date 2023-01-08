import { usePlayer, useProject } from "@hooks";
import React, {
    ReactNode,
    useContext,
    useEffect,
    useRef,
    useState,
} from "react";
import { AppContext } from "@contexts";
import "./Menu.sass";

type MenuLinkProps = {
    children: ReactNode;
    disabled?: boolean;
    onClick: (e?: React.MouseEvent<HTMLAnchorElement>) => void;
};

const MenuLink = ({ children, disabled = false, onClick }: MenuLinkProps) => {
    const linkHandler = (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();

        onClick(e);
    };

    return (
        <a
            href="/"
            className={`menu__link ${disabled && "menu__link--disabled"}`}
            onClick={linkHandler}
        >
            {children}
        </a>
    );
};

type MenuDropdownProps = {
    title: string;
    children: ReactNode;
};

const MenuDropdown = ({ title, children }: MenuDropdownProps) => {
    const ref = useRef<HTMLLIElement | undefined>();
    const [open, setOpen] = useState(false);

    const openHandler = (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        setOpen((open) => !open);
    };

    useEffect(() => {
        const listener = function (this: HTMLElement, e: MouseEvent) {
            if (!ref.current?.contains(e.target as HTMLElement)) setOpen(false);
        };
        document.body.addEventListener("click", listener);
    }, []);

    return (
        <li ref={ref} className={`menu__item ${open && "menu__item--open"}`}>
            <MenuLink onClick={openHandler}>{title}</MenuLink>

            <ul className="menu__list">{children}</ul>
        </li>
    );
};

export const Menu = () => {
    const { importFile, projects, openProject } = useProject();
    const { play, pause, restart, speedUp, speedDown } = usePlayer();
    const { state, setState } = useContext(AppContext);

    return (
        <div className="menu">
            <ul className="menu__list">
                <MenuDropdown title="@lemon-lab">
                    <MenuLink onClick={importFile}>
                        Abrir uma nova simulação
                    </MenuLink>
                    <MenuDropdown title="Simulações recentes">
                        {projects
                            .reverse()
                            .slice(0, 4)
                            .map(([key, project]) => (
                                <MenuLink
                                    key={key}
                                    onClick={() => openProject(project.hash)}
                                >
                                    {project.name}
                                </MenuLink>
                            ))}
                    </MenuDropdown>
                    <MenuLink
                        disabled={state.activeProject === null}
                        onClick={() =>
                            setState((state) => ({
                                ...state,
                                activeProject: null,
                            }))
                        }
                    >
                        Fechar simulação ativa
                    </MenuLink>
                    <MenuLink onClick={window.electron.quit}>
                        Encerrar @lemon-lab
                    </MenuLink>
                </MenuDropdown>
                <MenuDropdown title="Simulação">
                    <MenuLink onClick={play}>Reproduzir</MenuLink>
                    <MenuLink onClick={pause}>Pausar</MenuLink>
                    <MenuLink onClick={speedUp}>
                        Aumentar velocidade
                    </MenuLink>
                    <MenuLink onClick={speedDown}>
                        Diminuir velocidade
                    </MenuLink>
                    <MenuLink onClick={restart}>Reiniciar</MenuLink>
                </MenuDropdown>
                <li className="menu__item">
                    <MenuLink onClick={window.electron.showAbout}>Sobre o projeto</MenuLink>
                </li>
            </ul>
        </div>
    );
};
