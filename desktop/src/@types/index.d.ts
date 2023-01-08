export {};


declare global {
    interface Resource {
        name: string,
        type: 'normal'|'priority',
        servedTime: number,
        userTime: number,
        endTime: number,
        metrics: {
            usage: number|null,
            arrivalRate: number|null,
            serviceRate: number|null,
            serviceTime: number|null,
            awaitSystem: number|null,
            awaitQueue: number|null,
        },
        queue: {
            id: number,
            priority: number
        }[]
    }
    
    interface Ticket {
        resources: Resource[]
        containers: Container[]
    }
    interface Project {
        name: string;
        tickets: Ticket[]
    }

    interface Container {
        name: string;
        percentage: number;
    }
    
    interface ProjectLoaded {
        error: boolean;
        message: string;
        file: Project|null;
    }
    interface ProjectImported extends ProjectLoaded {
        filePath: string;
        fileName: string;
    }

    interface ProjectFile {
        name: string;
        fileName: string;
        filePath: string;
        lastOpen: Date;
        hash: string;
    }

    interface Window {
        electron: {
            getProjects: (projects: ProjectFile[]) => void,
            system: () => ('mac' | 'win' | 'linux'),
            showAbout: () => void,
            minimize: () => void,
            on: (event: string, listener: (event: any, data?: any) => void) => void,
            off: (event: string, listener: (event: any, data?: any) => void) => void,
            maximize: () => void,
            quit: () => void,
            importFile: () => Promise<ProjectImported>,
            getFile: (filePath: string) => Promise<ProjectLoaded>,
        };
    }

    interface MinRect {
        top: number;
        left: number;
        width: number;
        height: number;
    }
}

declare module "*.svg" {
    const content: any;
    export default content;
}