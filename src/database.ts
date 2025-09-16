import { MongoClient, Db, Collection, ObjectId } from 'mongodb'

interface Project {
  _id?: string | ObjectId
  title: string
  description: string
  analysis?: any
  kanban?: any
  workflow?: any
  createdAt: Date
  updatedAt: Date
}

class DatabaseService {
  private client: MongoClient
  private db: Db | null = null
  private projects: Collection<Project> | null = null

  constructor() {
    this.client = new MongoClient(process.env.MONGODB_URI!)
  }

  async connect(): Promise<void> {
    try {
      await this.client.connect()
      this.db = this.client.db('priscus')
      this.projects = this.db.collection<Project>('projects')
      console.log('Connected to MongoDB')
    } catch (error) {
      console.error('Failed to connect to MongoDB:', error)
      throw error
    }
  }

  async disconnect(): Promise<void> {
    await this.client.close()
    console.log('Disconnected from MongoDB')
  }

  async saveProject(project: Omit<Project, '_id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    if (!this.projects) {
      throw new Error('Database not connected')
    }

    const now = new Date()
    const projectDoc: Project = {
      ...project,
      createdAt: now,
      updatedAt: now
    }

    const result = await this.projects.insertOne(projectDoc)
    return result.insertedId.toString()
  }

  async updateProject(id: string, updates: Partial<Project>): Promise<void> {
    if (!this.projects) {
      throw new Error('Database not connected')
    }

    // Validate ObjectId format
    if (!ObjectId.isValid(id)) {
      throw new Error(`Invalid project ID format: ${id}`)
    }

    await this.projects.updateOne(
      { _id: new ObjectId(id) } as any,
      { 
        $set: { 
          ...updates, 
          updatedAt: new Date() 
        } 
      }
    )
  }

  async getProject(id: string): Promise<Project | null> {
    if (!this.projects) {
      throw new Error('Database not connected')
    }

    // Validate ObjectId format
    if (!ObjectId.isValid(id)) {
      throw new Error(`Invalid project ID format: ${id}`)
    }

    const project = await this.projects.findOne({ _id: new ObjectId(id) } as any)
    return project ? { ...project, _id: project._id.toString() } : null
  }

  async getAllProjects(): Promise<Project[]> {
    if (!this.projects) {
      throw new Error('Database not connected')
    }

    const projects = await this.projects.find({}).sort({ createdAt: -1 }).toArray()
    return projects.map(project => ({ ...project, _id: project._id.toString() }))
  }

  async deleteProject(id: string): Promise<void> {
    if (!this.projects) {
      throw new Error('Database not connected')
    }

    // Validate ObjectId format
    if (!ObjectId.isValid(id)) {
      throw new Error(`Invalid project ID format: ${id}`)
    }

    await this.projects.deleteOne({ _id: new ObjectId(id) } as any)
  }
}

export const dbService = new DatabaseService()
