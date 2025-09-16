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
  private connectionPromise: Promise<void> | null = null
  private isConnected = false

  constructor() {
    const uri = process.env.MONGODB_URI
    if (!uri) {
      throw new Error('MONGODB_URI environment variable is not set')
    }
    this.client = new MongoClient(uri)
  }

  async connect(): Promise<void> {
    // If already connected, return immediately
    if (this.isConnected) {
      return
    }

    // If connection is in progress, wait for it
    if (this.connectionPromise) {
      return this.connectionPromise
    }

    // Create new connection promise
    this.connectionPromise = (async () => {
      try {
        await this.client.connect()
        this.db = this.client.db('priscus')
        this.projects = this.db.collection<Project>('projects')
        this.isConnected = true
        console.log('Connected to MongoDB')
      } catch (error) {
        console.error('Failed to connect to MongoDB:', error)
        // Reset connection promise so we can try again
        this.connectionPromise = null
        throw error
      }
    })()

    return this.connectionPromise
  }

  async disconnect(): Promise<void> {
    if (this.client && this.isConnected) {
      await this.client.close()
      this.isConnected = false
      this.connectionPromise = null
      console.log('Disconnected from MongoDB')
    }
  }

  async saveProject(project: Omit<Project, '_id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    await this.ensureConnected()

    const now = new Date()
    const projectDoc: Project = {
      ...project,
      createdAt: now,
      updatedAt: now
    }

    const result = await this.projects!.insertOne(projectDoc)
    return result.insertedId.toString()
  }

  async updateProject(id: string, updates: Partial<Project>): Promise<void> {
    await this.ensureConnected()

    // Validate ObjectId format
    if (!ObjectId.isValid(id)) {
      throw new Error(`Invalid project ID format: ${id}`)
    }

    await this.projects!.updateOne(
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
    await this.ensureConnected()

    // Validate ObjectId format
    if (!ObjectId.isValid(id)) {
      throw new Error(`Invalid project ID format: ${id}`)
    }

    const project = await this.projects!.findOne({ _id: new ObjectId(id) } as any)
    return project ? { ...project, _id: project._id.toString() } : null
  }

  async getAllProjects(): Promise<Project[]> {
    await this.ensureConnected()

    const projects = await this.projects!.find({}).sort({ createdAt: -1 }).toArray()
    return projects.map(project => ({ ...project, _id: project._id.toString() }))
  }

  async deleteProject(id: string): Promise<void> {
    await this.ensureConnected()

    // Validate ObjectId format
    if (!ObjectId.isValid(id)) {
      throw new Error(`Invalid project ID format: ${id}`)
    }

    await this.projects!.deleteOne({ _id: new ObjectId(id) } as any)
  }

  // Helper method to ensure database is connected
  private async ensureConnected(): Promise<void> {
    if (!this.isConnected) {
      await this.connect()
    }
    
    if (!this.projects) {
      throw new Error('Database not connected')
    }
  }
}

export const dbService = new DatabaseService()
