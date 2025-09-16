import { MongoClient, Db, Collection, ObjectId } from 'mongodb';
class DatabaseService {
    constructor() {
        this.db = null;
        this.projects = null;
        this.client = new MongoClient(process.env.MONGODB_URI);
    }
    async connect() {
        try {
            await this.client.connect();
            this.db = this.client.db('priscus');
            this.projects = this.db.collection('projects');
            console.log('Connected to MongoDB');
        }
        catch (error) {
            console.error('Failed to connect to MongoDB:', error);
            throw error;
        }
    }
    async disconnect() {
        await this.client.close();
        console.log('Disconnected from MongoDB');
    }
    async saveProject(project) {
        if (!this.projects) {
            throw new Error('Database not connected');
        }
        const now = new Date();
        const projectDoc = {
            ...project,
            createdAt: now,
            updatedAt: now
        };
        const result = await this.projects.insertOne(projectDoc);
        return result.insertedId.toString();
    }
    async updateProject(id, updates) {
        if (!this.projects) {
            throw new Error('Database not connected');
        }
        // Validate ObjectId format
        if (!ObjectId.isValid(id)) {
            throw new Error(`Invalid project ID format: ${id}`);
        }
        await this.projects.updateOne({ _id: new ObjectId(id) }, {
            $set: {
                ...updates,
                updatedAt: new Date()
            }
        });
    }
    async getProject(id) {
        if (!this.projects) {
            throw new Error('Database not connected');
        }
        // Validate ObjectId format
        if (!ObjectId.isValid(id)) {
            throw new Error(`Invalid project ID format: ${id}`);
        }
        const project = await this.projects.findOne({ _id: new ObjectId(id) });
        return project ? { ...project, _id: project._id.toString() } : null;
    }
    async getAllProjects() {
        if (!this.projects) {
            throw new Error('Database not connected');
        }
        const projects = await this.projects.find({}).sort({ createdAt: -1 }).toArray();
        return projects.map(project => ({ ...project, _id: project._id.toString() }));
    }
    async deleteProject(id) {
        if (!this.projects) {
            throw new Error('Database not connected');
        }
        // Validate ObjectId format
        if (!ObjectId.isValid(id)) {
            throw new Error(`Invalid project ID format: ${id}`);
        }
        await this.projects.deleteOne({ _id: new ObjectId(id) });
    }
}
export const dbService = new DatabaseService();
//# sourceMappingURL=database.js.map