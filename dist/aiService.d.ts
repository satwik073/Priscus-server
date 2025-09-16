export interface ProjectAnalysis {
    score: number;
    pillars: Array<{
        name: string;
        score: number;
        feedback: string;
    }>;
    advantages: string[];
    disadvantages: string[];
    features: string[];
    recommendations: string[];
}
export interface KanbanData {
    pipelines: Array<{
        id: string;
        name: string;
        color: string;
    }>;
    tasks: Array<{
        id: string;
        title: string;
        description: string;
        pipeline: string;
        priority: string;
        estimatedHours: number;
        userStory: string;
    }>;
}
export interface WorkflowData {
    technicalWorkflow: {
        nodes: Array<{
            id: string;
            type: string;
            position: {
                x: number;
                y: number;
            };
            data: {
                label: string;
                description: string;
                details: string[];
                technologies: string[];
                estimatedTime: string;
                dependencies: string[];
            };
        }>;
        edges: Array<{
            id: string;
            source: string;
            target: string;
            label: string;
            type: string;
        }>;
    };
    userWorkflow: {
        nodes: Array<{
            id: string;
            type: string;
            position: {
                x: number;
                y: number;
            };
            data: {
                label: string;
                description: string;
                userActions: string[];
                systemResponses: string[];
                painPoints: string[];
                successMetrics: string[];
            };
        }>;
        edges: Array<{
            id: string;
            source: string;
            target: string;
            label: string;
            condition?: string;
        }>;
    };
    schemaDiagram: {
        entities: Array<{
            name: string;
            fields: Array<{
                name: string;
                type: string;
                required: boolean;
                description: string;
                constraints?: string[];
                isPrimaryKey?: boolean;
                isForeignKey?: boolean;
                references?: string;
            }>;
            relationships: Array<{
                target: string;
                type: string;
                description: string;
                field?: string;
            }>;
            position: {
                x: number;
                y: number;
            };
        }>;
        relationships: Array<{
            id: string;
            source: string;
            target: string;
            type: string;
            label: string;
            sourceField?: string;
            targetField?: string;
        }>;
    };
}
export declare class AIService {
    private model;
    analyzeProject(title: string, description: string): Promise<ProjectAnalysis>;
    generateKanbanBoard(analysis: any, title: string, description: string): Promise<KanbanData>;
    generateWorkflow(analysis: any, title: string, description: string): Promise<WorkflowData>;
    private getMockAnalysis;
    private getMockKanban;
    private getMockWorkflow;
}
//# sourceMappingURL=aiService.d.ts.map