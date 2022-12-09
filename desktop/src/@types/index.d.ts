export {};


declare global {
    interface Resource {
        name: string,
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
        queue: number[]
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

    interface Window {
        electron: {
            system: () => ('mac' | 'win' | 'linux'),
            minimize: () => void,
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