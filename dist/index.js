import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { z } from 'zod';
import { AIService } from './aiService.js';
import { dbService } from './database.js';
import { GoogleGenerativeAI } from '@google/generative-ai';
const app = express();
app.use(cors());
app.use(express.json());
// Initialize AI service
const aiService = new AIService();
// Validation schemas
const ProjectAnalysisSchema = z.object({
    title: z.string().min(1, 'Title is required'),
    description: z.string().min(10, 'Description must be at least 10 characters')
});
// Initialize database connection
dbService.connect().catch(console.error);
// Gemini API setup
const geminiApiKey = process.env.GEMINI_API_KEY;
if (!geminiApiKey) {
    throw new Error('GEMINI_API_KEY is not set in environment variables');
}
const genAI = new GoogleGenerativeAI(geminiApiKey);
// API Routes
app.get('/health', (_req, res) => {
    res.json({ status: 'ok' });
});
app.post('/api/analyze-project', async (req, res) => {
    try {
        const { title, description } = ProjectAnalysisSchema.parse(req.body);
        // Save project to database
        const projectId = await dbService.saveProject({ title, description });
        // Get AI analysis
        const analysis = await aiService.analyzeProject(title, description);
        // Update project with analysis
        await dbService.updateProject(projectId, { analysis });
        res.json({ success: true, data: analysis, projectId });
    }
    catch (error) {
        if (error instanceof z.ZodError) {
            res.status(400).json({ success: false, error: error.issues });
        }
        else {
            console.error('Error analyzing project:', error);
            res.status(500).json({ success: false, error: 'Internal server error' });
        }
    }
});
app.post('/api/generate-kanban', async (req, res) => {
    try {
        const { analysis, projectId, title, description } = req.body;
        if (!analysis || !projectId) {
            return res.status(400).json({ success: false, error: 'Analysis and projectId are required' });
        }
        // Generate kanban with AI
        const kanban = await aiService.generateKanbanBoard(analysis, title || 'Project', description || '');
        // Update project with kanban
        await dbService.updateProject(projectId, { kanban });
        res.json({ success: true, data: kanban });
    }
    catch (error) {
        console.error('Error generating kanban:', error);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
});
app.post('/api/generate-workflow', async (req, res) => {
    try {
        const { analysis, projectId, title, description } = req.body;
        if (!analysis || !projectId) {
            return res.status(400).json({ success: false, error: 'Analysis and projectId are required' });
        }
        // Generate workflow with AI
        const workflow = await aiService.generateWorkflow(analysis, title || 'Project', description || '');
        // Update project with workflow
        await dbService.updateProject(projectId, { workflow });
        res.json({ success: true, data: workflow });
    }
    catch (error) {
        console.error('Error generating workflow:', error);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
});
// Get all projects
app.get('/api/projects', async (req, res) => {
    try {
        const projects = await dbService.getAllProjects();
        res.json({ success: true, data: projects });
    }
    catch (error) {
        console.error('Error fetching projects:', error);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
});
// Get specific project
app.get('/api/projects/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const project = await dbService.getProject(id);
        if (!project) {
            return res.status(404).json({ success: false, error: 'Project not found' });
        }
        res.json({ success: true, data: project });
    }
    catch (error) {
        console.error('Error fetching project:', error);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
});
// Delete project
app.delete('/api/projects/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await dbService.deleteProject(id);
        res.json({ success: true, message: 'Project deleted successfully' });
    }
    catch (error) {
        console.error('Error deleting project:', error);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
});
app.post('/api/database-flow', async (req, res) => {
    // Return static schema matching the image, with field types and mappings
    const flowData = {
        tables: [
            {
                name: 'Notion',
                fields: [
                    { name: 'id', type: 'text' },
                    { name: 'accessToken', type: 'text' },
                    { name: 'workspaceId', type: 'text' },
                    { name: 'databaseId', type: 'text' },
                    { name: 'workspaceName', type: 'text' },
                    { name: 'workspaceIcon', type: 'text' },
                    { name: 'userId', type: 'text' }
                ],
                x: 50,
                y: 100,
            },
            {
                name: 'LocalGoogleCredential',
                fields: [
                    { name: 'id', type: 'text' },
                    { name: 'accessToken', type: 'text' },
                    { name: 'folderId', type: 'text' },
                    { name: 'pageToken', type: 'text' },
                    { name: 'channelId', type: 'bool' },
                    { name: 'subscribed', type: 'bool' },
                    { name: 'createdAt', type: 'timestamp' },
                    { name: 'updatedAt', type: 'timestamp' },
                    { name: 'userId', type: 'int4' }
                ],
                x: 350,
                y: 80,
            },
            {
                name: 'Slack',
                fields: [
                    { name: 'id', type: 'text' },
                    { name: 'appId', type: 'text' },
                    { name: 'authedUserId', type: 'text' },
                    { name: 'authedUserToken', type: 'text' },
                    { name: 'slackAccessToken', type: 'text' },
                    { name: 'botUserId', type: 'text' },
                    { name: 'teamId', type: 'text' },
                    { name: 'teamName', type: 'text' },
                    { name: 'userId', type: 'text' }
                ],
                x: 650,
                y: 120,
            }
        ],
        mappings: [
            // Map userId between all tables
            { from: { table: 'Notion', field: 'userId' }, to: { table: 'LocalGoogleCredential', field: 'userId' } },
            { from: { table: 'LocalGoogleCredential', field: 'userId' }, to: { table: 'Slack', field: 'userId' } }
        ]
    };
    res.json(flowData);
});
// Database schema endpoint with detailed table structure
app.get('/api/database-schema', async (_req, res) => {
    const schema = {
        entities: [
            {
                name: 'User',
                fields: [
                    { name: 'id', type: 'uuid', required: true, description: 'Unique identifier for the user', constraints: ['PRIMARY KEY', 'NOT NULL'], isPrimaryKey: true, isForeignKey: false },
                    { name: 'email', type: 'varchar(255)', required: true, description: "User's email address", constraints: ['UNIQUE', 'NOT NULL'], isPrimaryKey: false, isForeignKey: false },
                    { name: 'password', type: 'varchar(255)', required: true, description: 'Hashed user password', constraints: ['NOT NULL'], isPrimaryKey: false, isForeignKey: false },
                    { name: 'name', type: 'varchar(255)', required: false, description: 'User display name', constraints: [], isPrimaryKey: false, isForeignKey: false },
                    { name: 'profile_picture', type: 'text', required: false, description: 'URL to user profile picture', constraints: [], isPrimaryKey: false, isForeignKey: false },
                    { name: 'role', type: 'varchar(50)', required: false, description: 'User role (admin, user, guest)', constraints: [], isPrimaryKey: false, isForeignKey: false },
                    { name: 'is_active', type: 'boolean', required: true, description: 'Whether user account is active', constraints: ['NOT NULL'], isPrimaryKey: false, isForeignKey: false },
                    { name: 'created_at', type: 'timestamp', required: true, description: 'Account creation timestamp', constraints: ['NOT NULL'], isPrimaryKey: false, isForeignKey: false },
                    { name: 'updated_at', type: 'timestamp', required: false, description: 'Account last update timestamp', constraints: [], isPrimaryKey: false, isForeignKey: false }
                ],
                relationships: [
                    { target: 'Project', type: 'ONE_TO_MANY', description: 'One user can have many projects', field: 'id' },
                    { target: 'ThemePurchase', type: 'ONE_TO_MANY', description: 'User can purchase multiple themes', field: 'id' }
                ],
                position: { x: 100, y: 100 }
            },
            {
                name: 'Project',
                fields: [
                    { name: 'id', type: 'uuid', required: true, description: 'Unique identifier for the project', constraints: ['PRIMARY KEY', 'NOT NULL'], isPrimaryKey: true, isForeignKey: false },
                    { name: 'name', type: 'varchar(255)', required: true, description: 'Name of the project', constraints: ['NOT NULL'], isPrimaryKey: false, isForeignKey: false },
                    { name: 'description', type: 'text', required: false, description: 'Detailed project description', constraints: [], isPrimaryKey: false, isForeignKey: false },
                    { name: 'user_id', type: 'uuid', required: true, description: 'Foreign key to the User table', constraints: ['NOT NULL'], isPrimaryKey: false, isForeignKey: true, references: 'User.id' },
                    { name: 'status', type: 'varchar(50)', required: true, description: 'Project status (active, completed, archived)', constraints: ['NOT NULL'], isPrimaryKey: false, isForeignKey: false },
                    { name: 'priority', type: 'integer', required: false, description: 'Project priority level (1-5)', constraints: [], isPrimaryKey: false, isForeignKey: false },
                    { name: 'start_date', type: 'date', required: false, description: 'Project start date', constraints: [], isPrimaryKey: false, isForeignKey: false },
                    { name: 'end_date', type: 'date', required: false, description: 'Project end date', constraints: [], isPrimaryKey: false, isForeignKey: false },
                    { name: 'created_at', type: 'timestamp', required: true, description: 'Project creation timestamp', constraints: ['NOT NULL'], isPrimaryKey: false, isForeignKey: false },
                    { name: 'updated_at', type: 'timestamp', required: false, description: 'Project last update timestamp', constraints: [], isPrimaryKey: false, isForeignKey: false }
                ],
                relationships: [
                    { target: 'User', type: 'MANY_TO_ONE', description: 'Project belongs to a user', field: 'user_id' },
                    { target: 'Task', type: 'ONE_TO_MANY', description: 'Project can have many tasks', field: 'id' },
                    { target: 'ThemeSettings', type: 'ONE_TO_ONE', description: 'Project has theme settings', field: 'id' }
                ],
                position: { x: 500, y: 100 }
            },
            {
                name: 'Task',
                fields: [
                    { name: 'id', type: 'uuid', required: true, description: 'Unique identifier for the task', constraints: ['PRIMARY KEY', 'NOT NULL'], isPrimaryKey: true, isForeignKey: false },
                    { name: 'project_id', type: 'uuid', required: true, description: 'Foreign key to Project table', constraints: ['NOT NULL'], isPrimaryKey: false, isForeignKey: true, references: 'Project.id' },
                    { name: 'title', type: 'varchar(255)', required: true, description: 'Task title', constraints: ['NOT NULL'], isPrimaryKey: false, isForeignKey: false },
                    { name: 'description', type: 'text', required: false, description: 'Detailed task description', constraints: [], isPrimaryKey: false, isForeignKey: false },
                    { name: 'status', type: 'varchar(50)', required: true, description: 'Task status (todo, in_progress, completed)', constraints: ['NOT NULL'], isPrimaryKey: false, isForeignKey: false },
                    { name: 'priority', type: 'integer', required: true, description: 'Task priority level (1-5)', constraints: ['NOT NULL'], isPrimaryKey: false, isForeignKey: false },
                    { name: 'due_date', type: 'date', required: false, description: 'Task due date', constraints: [], isPrimaryKey: false, isForeignKey: false },
                    { name: 'estimated_hours', type: 'integer', required: false, description: 'Estimated hours to complete task', constraints: [], isPrimaryKey: false, isForeignKey: false },
                    { name: 'assigned_to', type: 'uuid', required: false, description: 'User assigned to this task', constraints: [], isPrimaryKey: false, isForeignKey: true, references: 'User.id' },
                    { name: 'created_at', type: 'timestamp', required: true, description: 'Task creation timestamp', constraints: ['NOT NULL'], isPrimaryKey: false, isForeignKey: false },
                    { name: 'updated_at', type: 'timestamp', required: false, description: 'Task last update timestamp', constraints: [], isPrimaryKey: false, isForeignKey: false }
                ],
                relationships: [
                    { target: 'Project', type: 'MANY_TO_ONE', description: 'Task belongs to a project', field: 'project_id' },
                    { target: 'User', type: 'MANY_TO_ONE', description: 'Task can be assigned to a user', field: 'assigned_to' }
                ],
                position: { x: 500, y: 400 }
            },
            {
                name: 'ThemeSettings',
                fields: [
                    { name: 'id', type: 'uuid', required: true, description: 'Unique identifier for theme settings', constraints: ['PRIMARY KEY', 'NOT NULL'], isPrimaryKey: true, isForeignKey: false },
                    { name: 'project_id', type: 'uuid', required: true, description: 'Foreign key to Project table', constraints: ['NOT NULL'], isPrimaryKey: false, isForeignKey: true, references: 'Project.id' },
                    { name: 'theme_name', type: 'varchar(100)', required: true, description: 'Name of the selected theme', constraints: ['NOT NULL'], isPrimaryKey: false, isForeignKey: false },
                    { name: 'primary_color', type: 'varchar(7)', required: false, description: 'Primary color hex code', constraints: [], isPrimaryKey: false, isForeignKey: false },
                    { name: 'secondary_color', type: 'varchar(7)', required: false, description: 'Secondary color hex code', constraints: [], isPrimaryKey: false, isForeignKey: false },
                    { name: 'font_family', type: 'varchar(100)', required: false, description: 'Selected font family', constraints: [], isPrimaryKey: false, isForeignKey: false },
                    { name: 'font_size', type: 'integer', required: false, description: 'Base font size in pixels', constraints: [], isPrimaryKey: false, isForeignKey: false },
                    { name: 'is_dark_mode', type: 'boolean', required: true, description: 'Whether dark mode is enabled', constraints: ['NOT NULL'], isPrimaryKey: false, isForeignKey: false },
                    { name: 'created_at', type: 'timestamp', required: true, description: 'Theme settings creation timestamp', constraints: ['NOT NULL'], isPrimaryKey: false, isForeignKey: false },
                    { name: 'updated_at', type: 'timestamp', required: false, description: 'Theme settings last update timestamp', constraints: [], isPrimaryKey: false, isForeignKey: false }
                ],
                relationships: [
                    { target: 'Project', type: 'ONE_TO_ONE', description: 'Theme settings belong to a project', field: 'project_id' }
                ],
                position: { x: 900, y: 100 }
            },
            {
                name: 'ThemePurchase',
                fields: [
                    { name: 'id', type: 'uuid', required: true, description: 'Unique identifier for theme purchase', constraints: ['PRIMARY KEY', 'NOT NULL'], isPrimaryKey: true, isForeignKey: false },
                    { name: 'user_id', type: 'uuid', required: true, description: 'Foreign key to User table', constraints: ['NOT NULL'], isPrimaryKey: false, isForeignKey: true, references: 'User.id' },
                    { name: 'theme_name', type: 'varchar(100)', required: true, description: 'Name of the purchased theme', constraints: ['NOT NULL'], isPrimaryKey: false, isForeignKey: false },
                    { name: 'purchase_price', type: 'decimal(10,2)', required: true, description: 'Price paid for the theme', constraints: ['NOT NULL'], isPrimaryKey: false, isForeignKey: false },
                    { name: 'purchase_date', type: 'timestamp', required: true, description: 'Date and time of purchase', constraints: ['NOT NULL'], isPrimaryKey: false, isForeignKey: false },
                    { name: 'payment_method', type: 'varchar(50)', required: false, description: 'Payment method used (credit_card, paypal, etc.)', constraints: [], isPrimaryKey: false, isForeignKey: false },
                    { name: 'transaction_id', type: 'varchar(255)', required: false, description: 'External transaction ID', constraints: [], isPrimaryKey: false, isForeignKey: false },
                    { name: 'is_active', type: 'boolean', required: true, description: 'Whether the purchase is still active', constraints: ['NOT NULL'], isPrimaryKey: false, isForeignKey: false },
                    { name: 'created_at', type: 'timestamp', required: true, description: 'Purchase record creation timestamp', constraints: ['NOT NULL'], isPrimaryKey: false, isForeignKey: false }
                ],
                relationships: [
                    { target: 'User', type: 'MANY_TO_ONE', description: 'Theme purchase belongs to a user', field: 'user_id' }
                ],
                position: { x: 100, y: 400 }
            }
        ],
        relationships: [
            { id: 'u-p', source: 'User', target: 'Project', type: 'ONE_TO_MANY', label: 'owns', sourceField: 'id', targetField: 'user_id' },
            { id: 'p-t', source: 'Project', target: 'Task', type: 'ONE_TO_MANY', label: 'has', sourceField: 'id', targetField: 'project_id' },
            { id: 'p-ts', source: 'Project', target: 'ThemeSettings', type: 'ONE_TO_ONE', label: 'has_theme', sourceField: 'id', targetField: 'project_id' },
            { id: 'u-tp', source: 'User', target: 'ThemePurchase', type: 'ONE_TO_MANY', label: 'purchases', sourceField: 'id', targetField: 'user_id' },
            { id: 'u-t', source: 'User', target: 'Task', type: 'ONE_TO_MANY', label: 'assigned_to', sourceField: 'id', targetField: 'assigned_to' }
        ]
    };
    res.json({ success: true, data: schema });
});
const port = process.env.PORT || 4000;
app.listen(port, () => {
    console.log(`Server listening on http://localhost:${port}`);
});
//# sourceMappingURL=index.js.map