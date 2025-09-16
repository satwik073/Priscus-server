import { ObjectId } from 'mongodb';
interface Project {
    _id?: string | ObjectId;
    title: string;
    description: string;
    analysis?: any;
    kanban?: any;
    workflow?: any;
    createdAt: Date;
    updatedAt: Date;
}
declare class DatabaseService {
    private client;
    private db;
    private projects;
    constructor();
    connect(): Promise<void>;
    disconnect(): Promise<void>;
    saveProject(project: Omit<Project, '_id' | 'createdAt' | 'updatedAt'>): Promise<string>;
    updateProject(id: string, updates: Partial<Project>): Promise<void>;
    getProject(id: string): Promise<Project | null>;
    getAllProjects(): Promise<Project[]>;
    deleteProject(id: string): Promise<void>;
}
export declare const dbService: DatabaseService;
export {};
//# sourceMappingURL=database.d.ts.map