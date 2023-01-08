import { usePlayer, useProject } from "@hooks";
import React, {
    createContext,
    Dispatch,
    ReactNode,
    SetStateAction,
    useContext,
    useEffect,
    useRef,
    useState,
} from "react";
import { AppContext } from "@contexts";
import "./Menu.sass";

interface DropdownContextProps {
    open: boolean;
    setOpen: Dispatch<SetStateAction<boolean>> | null;
}

const DropdownContext = createContext<DropdownContextProps>({
    open: false,
    setOpen: null,
});

type MenuLinkProps = {
    children: ReactNode;
    disabled?: boolean;
    onClick: (e?: React.MouseEvent<HTMLAnchorElement>) => void;
};

const MenuLink = ({ children, disabled = false, onClick }: MenuLinkProps) => {
    const { setOpen } = useContext(DropdownContext);

    const linkHandler = (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();

        onClick(e);
        setOpen(false);
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
    const context = useContext(DropdownContext);
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

            <DropdownContext.Provider
                value={context.setOpen ? context : { open, setOpen }}
            >
                <ul className="menu__list">{children}</ul>
            </DropdownContext.Provider>
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
                    <MenuLink
                        disabled={state.activeProject === null}
                        onClick={play}
                    >
                        Reproduzir
                    </MenuLink>
                    <MenuLink
                        disabled={state.activeProject === null}
                        onClick={pause}
                    >
                        Pausar
                    </MenuLink>
                    <MenuLink
                        disabled={state.activeProject === null}
                        onClick={speedUp}
                    >
                        Aumentar velocidade
                    </MenuLink>
                    <MenuLink
                        disabled={state.activeProject === null}
                        onClick={speedDown}
                    >
                        Diminuir velocidade
                    </MenuLink>
                    <MenuLink
                        disabled={state.activeProject === null}
                        onClick={restart}
                    >
                        Reiniciar
                    </MenuLink>
                </MenuDropdown>
                <li className="menu__item">
                    <MenuLink onClick={window.electron.showAbout}>
                        Sobre o projeto
                    </MenuLink>
                </li>
            </ul>
        </div>
    );
};
