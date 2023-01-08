import localforage from "localforage";
import sha256 from "crypto-js/sha256";
import { useContext, useEffect, useState } from "react";
import { AppContext } from "../contexts/AppContext";

export const useProject = () => {
    const { setState } = useContext(AppContext);
    const [projects, setProjects] = useState(new Map<string, ProjectFile>());
    const [loading, setLoading] = useState(false);

    const findProjects = async () => {
        const projects =
            (await localforage.getItem<Map<string, ProjectFile>>("projects")) ||
            new Map<string, ProjectFile>();

        return projects;
    };

    const importFile = async () => {
        setLoading(true);

        try {
            const response: ProjectImported =
                await window.electron.importFile();

            if(!response.file) return;

            const hash = sha256(response.filePath).toString();

            const projects = await findProjects();

            const project = projects.get(hash) || {
                name: response.file.name,
                fileName: response.fileName,
                filePath: response.filePath,
                lastOpen: new Date(),
                hash,
            };

            if (projects.has(hash)) {
                projects.delete(hash);
            }

            projects.set(hash, project);
            await localforage.setItem("projects", projects);
            setProjects(projects);

            const activeProject = await getProject(hash);
            const totalTickets = activeProject.tickets.length;

            setState((state) => ({
                ...state,
                activeProject,
                remainingTickets: totalTickets,
                totalTickets,
            }));

            return response;
        } catch (error) {
            console.log(error);
            alert("Ocorreu um erro ao carregar o arquivo");
        } finally {
            setLoading(false);
        }
    };

    const getProject = async (hash: string) => {
        const projects = await findProjects();
        const project = projects.get(hash);

        if (!project) return undefined;

        const response = await window.electron.getFile(project.filePath);

        return response.file;
    };

    const openProject = async (hash: string) => {
        const activeProject = await getProject(hash);
        const totalTickets = activeProject.tickets.length;

        if (activeProject)
            setState((state) => ({
                ...state,
                activeProject,
                remainingTickets: totalTickets,
                totalTickets,
            }));
    };

    const openLastProject = async () => {
        const projects = await findProjects();

        if (projects.size === 0) {
            alert("Não há nenhum projeto recente");
            return;
        }

        const project = Array.from(projects).pop()[1];

        const activeProject = await getProject(project.hash);
        const totalTickets = activeProject.tickets.length;
        setState((state) => ({
            ...state,
            activeProject,
            remainingTickets: totalTickets,
            totalTickets,
        }));
    };

    useEffect(() => {
        let isMounted = true;

        async function search() {
            const response = await findProjects();

            if (isMounted) setProjects(response);
        }
        search();

        return () => {
            isMounted = false;
        };
    }, []);

    useEffect(() => {
        if(projects.size > 0) window.electron.getProjects(Array.from(projects.values()))
    }, [projects]);

    useEffect(() => {
        window.electron.on('open-project', (event, hash) => {
            openProject(hash)
        })
    }, [])

    useEffect(() => {
        window.electron.on('open-project-file', () => {
            importFile()
        })
    }, [])

    return {
        loading,
        importFile,
        projects: Array.from(projects),
        getProject,
        openProject,
        openLastProject,
    };
};
