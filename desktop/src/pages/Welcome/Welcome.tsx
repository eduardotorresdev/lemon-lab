import { Button } from "@components";
import { faFileImport, faPlay } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./Welcome.sass";
import { useProject } from "@hooks";

interface WelcomeProps {
    show: boolean;
}

export const Welcome = ({ show }: WelcomeProps) => {
    const { loading, projects, importFile, openProject, openLastProject } =
        useProject();

    return (
        <div className={`welcome ${show && "welcome--show"}`}>
            <div className="welcome__dialog">
                <h1 className="welcome__title title">
                    lemon<strong>Lab</strong> 🍋
                </h1>

                <div className="welcome__wrapper">
                    <div className="welcome__section">
                        <Button
                            large
                            textAlign="left"
                            loading={loading}
                            onClick={importFile}
                        >
                            <FontAwesomeIcon
                                icon={faFileImport}
                                className="button__icon"
                            />{" "}
                            Importar nova simulação
                        </Button>
                        {projects.length > 0 && (
                            <Button
                                large
                                alt
                                textAlign="left"
                                loading={loading}
                                onClick={openLastProject}
                            >
                                <FontAwesomeIcon
                                    icon={faPlay}
                                    className="button__icon"
                                />{" "}
                                Continuar última simulação
                            </Button>
                        )}
                    </div>

                    {projects.length > 0 && (
                        <div className="welcome__section">
                            <h2 className="welcome__subtitle subtitle">
                                Simulações recentes
                            </h2>
                            <ul className="welcome__list">
                                {projects
                                    .reverse()
                                    .slice(0, 4)
                                    .map(([key, project]) => (
                                        <li
                                            key={key}
                                            className="welcome__item"
                                            onClick={() =>
                                                openProject(project.hash)
                                            }
                                        >
                                            <span className="welcome__name">
                                                {project.name}
                                            </span>
                                            <span className="welcome__file">
                                                {project.fileName}
                                            </span>
                                        </li>
                                    ))}
                            </ul>
                        </div>
                    )}
                </div>

                <span className="welcome__credits">
                    @eduardotorresdev - {new Date().getFullYear()}
                </span>
            </div>
        </div>
    );
};
