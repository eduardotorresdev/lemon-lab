import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faMinus,
    faTimes,
    faArrows,
} from "@fortawesome/free-solid-svg-icons";
import "./Frame.sass";
import { faWindowMaximize } from "@fortawesome/free-regular-svg-icons";

interface FrameControlsProps {
    platform: 'mac'|'win'|'linux'
}

const FrameControls = ({platform}: FrameControlsProps) => (
    <div className="frame__controls">
        <button
            type="button"
            onClick={() => window.electron.quit()}
            className="frame__control frame__control--close"
        >
            <FontAwesomeIcon icon={faTimes} className="frame__icon" />
        </button>
        <button
            type="button"
            onClick={() => window.electron.minimize()}
            className="frame__control frame__control--minimize"
        >
            <FontAwesomeIcon icon={faMinus} className="frame__icon" />
        </button>
        <button
            type="button"
            onClick={() => window.electron.maximize()}
            className="frame__control frame__control--maximize"
        >
            <FontAwesomeIcon icon={platform === 'win' ? faWindowMaximize : faArrows} className="frame__icon" />
        </button>
    </div>
);

export const Frame = () => {
    const platform = window.electron.system();

    return (
        <div className={`frame frame--${platform}`} onDoubleClick={() => window.electron.maximize()}>
            <FrameControls platform={platform} />
            <h5 className="frame__title title">lemonLab 🍋</h5>
        </div>
    );
};
