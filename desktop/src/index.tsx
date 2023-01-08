import { render } from "react-dom";
import { Welcome, Simulation } from "@pages";
import "@sass/index.sass";
import { AppContext } from "@contexts";
import { useEffect, useState } from "react";
import localforage from "localforage";
import { Wrapper } from "@components";

localforage.config({
    driver: localforage.INDEXEDDB,
    name: "@lemonLab",
});

const App = () => {
    const [app, setApp] = useState({
        activeProject: null,
        freq: 180,
        currentTicket: 0,
        reset: false,
        playing: false,
        remainingTickets: 2000,
        totalTickets: 2000,
    });

    useEffect(() => {
        window.electron.on("close-current-simulation", () => {
            setApp((app) => ({ ...app, activeProject: null }));
        });
    }, []);

    return (
        <AppContext.Provider value={{ state: app, setState: setApp }}>
            <Wrapper>
                <Welcome show={app.activeProject === null} />
                <Simulation />
            </Wrapper>
        </AppContext.Provider>
    );
};

render(<App />, document.querySelector("#root"));
