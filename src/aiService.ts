import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

export interface ProjectAnalysis {
  score: number
  pillars: Array<{
    name: string
    score: number
    feedback: string
  }>
  advantages: string[]
  disadvantages: string[]
  features: string[]
  recommendations: string[]
}

export interface KanbanData {
  pipelines: Array<{
    id: string
    name: string
    color: string
  }>
  tasks: Array<{
    id: string
    title: string
    description: string
    pipeline: string
    priority: string
    estimatedHours: number
    userStory: string
  }>
}

export interface WorkflowData {
  technicalWorkflow: {
    nodes: Array<{
      id: string
      type: string
      position: { x: number; y: number }
      data: { 
        label: string
        description: string
        details: string[]
        technologies: string[]
        estimatedTime: string
        dependencies: string[]
      }
    }>
    edges: Array<{
      id: string
      source: string
      target: string
      label: string
      type: string
    }>
  }
  userWorkflow: {
    nodes: Array<{
      id: string
      type: string
      position: { x: number; y: number }
      data: {
        label: string
        description: string
        userActions: string[]
        systemResponses: string[]
        painPoints: string[]
        successMetrics: string[]
      }
    }>
    edges: Array<{
      id: string
      source: string
      target: string
      label: string
      condition?: string
    }>
  }
  schemaDiagram: {
    entities: Array<{
      name: string
      fields: Array<{
        name: string
        type: string
        required: boolean
        description: string
        constraints?: string[]
        isPrimaryKey?: boolean
        isForeignKey?: boolean
        references?: string
      }>
      relationships: Array<{
        target: string
        type: string
        description: string
        field?: string
      }>
      position: { x: number; y: number }
    }>
    relationships: Array<{
      id: string
      source: string
      target: string
      type: string
      label: string
      sourceField?: string
      targetField?: string
    }>
  }
}

export class AIService {
  private model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' })

  async analyzeProject(title: string, description: string): Promise<ProjectAnalysis> {
    const prompt = `
    Analyze this project idea and provide a comprehensive evaluation:

    Project Title: ${title}
    Project Description: ${description}

    Please provide a detailed analysis in the following JSON format:
    {
      "score": <overall score from 0-100>,
      "pillars": [
        {
          "name": "Technical Feasibility",
          "score": <score 0-100>,
          "feedback": "<brief feedback>"
        },
        {
          "name": "Market Viability", 
          "score": <score 0-100>,
          "feedback": "<brief feedback>"
        },
        {
          "name": "User Experience",
          "score": <score 0-100>,
          "feedback": "<brief feedback>"
        },
        {
          "name": "Scalability",
          "score": <score 0-100>,
          "feedback": "<brief feedback>"
        },
        {
          "name": "Monetization Potential",
          "score": <score 0-100>,
          "feedback": "<brief feedback>"
        }
      ],
      "advantages": ["<advantage 1>", "<advantage 2>", "<advantage 3>", "<advantage 4>"],
      "disadvantages": ["<disadvantage 1>", "<disadvantage 2>", "<disadvantage 3>", "<disadvantage 4>"],
      "features": ["<suggested feature 1>", "<suggested feature 2>", "<suggested feature 3>", "<suggested feature 4>", "<suggested feature 5>"],
      "recommendations": ["<recommendation 1>", "<recommendation 2>", "<recommendation 3>", "<recommendation 4>"]
    }

    Focus on:
    - Technical complexity and feasibility
    - Market demand and competition
    - User experience considerations
    - Scalability potential
    - Revenue generation possibilities
    - Implementation challenges
    - Suggested features based on the project scope
    - Actionable recommendations for success

    Return only valid JSON, no additional text.
    `

    try {
      const result = await this.model.generateContent(prompt)
      const response = await result.response
      const text = response.text()
      
      // Clean the response to extract JSON
      const jsonMatch = text.match(/\{[\s\S]*\}/)
      if (!jsonMatch) {
        throw new Error('No valid JSON found in AI response')
      }
      
      return JSON.parse(jsonMatch[0])
    } catch (error) {
      console.error('Error analyzing project with AI:', error)
      // Fallback to mock data if AI fails
      return this.getMockAnalysis()
    }
  }

  async generateKanbanBoard(analysis: any, title: string, description: string): Promise<KanbanData> {
    const prompt = `
    Based on the project analysis, generate a comprehensive kanban board for this project:

    Project Title: ${title}
    Project Description: ${description}
    
    Analysis Results:
    - Overall Score: ${analysis.score}/100
    - Features: ${analysis.features.join(', ')}
    - Recommendations: ${analysis.recommendations.join(', ')}

    Please generate a kanban board in the following JSON format:
    {
      "pipelines": [
        {
          "id": "backlog",
          "name": "Backlog",
          "color": "#gray"
        },
        {
          "id": "todo", 
          "name": "To Do",
          "color": "#blue"
        },
        {
          "id": "in-progress",
          "name": "In Progress", 
          "color": "#yellow"
        },
        {
          "id": "review",
          "name": "Review",
          "color": "#purple"
        },
        {
          "id": "done",
          "name": "Done",
          "color": "#green"
        }
      ],
      "tasks": [
        {
          "id": "1",
          "title": "<task title>",
          "description": "<detailed task description>",
          "pipeline": "<pipeline id>",
          "priority": "<high|medium|low>",
          "estimatedHours": <number>,
          "userStory": "As a <user type>, I want <goal> so that <benefit>"
        }
      ]
    }

    Generate 8-12 specific, actionable tasks based on the project requirements. Include:
    - Project setup and architecture
    - Core feature development
    - User authentication (if needed)
    - Database design
    - API development
    - Frontend implementation
    - Testing and QA
    - Deployment setup

    Make tasks specific to this project's features and requirements. Return only valid JSON, no additional text.
    `

    try {
      const result = await this.model.generateContent(prompt)
      const response = await result.response
      const text = response.text()
      
      // Clean the response to extract JSON
      const jsonMatch = text.match(/\{[\s\S]*\}/)
      if (!jsonMatch) {
        throw new Error('No valid JSON found in AI response')
      }
      
      return JSON.parse(jsonMatch[0])
    } catch (error) {
      console.error('Error generating kanban with AI:', error)
      // Fallback to mock data if AI fails
      return this.getMockKanban()
    }
  }

  async generateWorkflow(analysis: any, title: string, description: string): Promise<WorkflowData> {
    const prompt = `
    Based on the project analysis, generate THREE comprehensive workflow diagrams for this project:

    Project Title: ${title}
    Project Description: ${description}
    
    Analysis Results:
    - Overall Score: ${analysis.score}/100
    - Features: ${analysis.features.join(', ')}
    - Recommendations: ${analysis.recommendations.join(', ')}
    - Advantages: ${analysis.advantages.join(', ')}
    - Disadvantages: ${analysis.disadvantages.join(', ')}

    Generate a comprehensive JSON response with THREE workflow types:

    1. TECHNICAL WORKFLOW - Development process flow
    2. USER WORKFLOW - User journey and interactions  
    3. SCHEMA DIAGRAM - Database tables and relationships (like Supabase)

    Return in this EXACT JSON format:
    {
      "technicalWorkflow": {
        "nodes": [
          {
            "id": "start",
            "type": "input",
            "position": { "x": 50, "y": 200 },
            "data": {
              "label": "Project Initialization",
              "description": "Set up project structure and development environment",
              "details": ["Create repository", "Set up CI/CD", "Configure development tools"],
              "technologies": ["Git", "Docker", "VS Code"],
              "estimatedTime": "2-3 days",
              "dependencies": []
            }
          }
        ],
        "edges": [
          {
            "id": "e1",
            "source": "start",
            "target": "planning",
            "label": "Setup Complete",
            "type": "success"
          }
        ]
      },
      "userWorkflow": {
        "nodes": [
          {
            "id": "landing",
            "type": "input",
            "position": { "x": 50, "y": 200 },
            "data": {
              "label": "User Lands on Platform",
              "description": "User discovers and accesses the platform",
              "userActions": ["Visit website", "Browse features", "Read documentation"],
              "systemResponses": ["Show landing page", "Display feature highlights", "Provide demo"],
              "painPoints": ["Slow loading", "Unclear value proposition"],
              "successMetrics": ["Page views", "Time on site", "Bounce rate"]
            }
          }
        ],
        "edges": [
          {
            "id": "e1",
            "source": "landing",
            "target": "signup",
            "label": "User Interested",
            "condition": "User clicks signup"
          }
        ]
      },
      "schemaDiagram": {
        "entities": [
          {
            "name": "User",
            "fields": [
              {
                "name": "id",
                "type": "UUID",
                "required": true,
                "description": "Unique identifier for user",
                "constraints": ["PRIMARY KEY", "NOT NULL"]
              },
              {
                "name": "email",
                "type": "VARCHAR(255)",
                "required": true,
                "description": "User email address",
                "constraints": ["UNIQUE", "NOT NULL"]
              }
            ],
            "relationships": [
              {
                "target": "Project",
                "type": "ONE_TO_MANY",
                "description": "User can have multiple projects"
              }
            ],
            "position": { "x": 100, "y": 100 }
          }
        ],
        "relationships": [
          {
            "id": "r1",
            "source": "User",
            "target": "Project",
            "type": "ONE_TO_MANY",
            "label": "owns"
          }
        ]
      }
    }

    REQUIREMENTS:
    
    TECHNICAL WORKFLOW:
    - Include 8-12 detailed development phases
    - Each node must have: label, description, details[], technologies[], estimatedTime, dependencies[]
    - Use node types: "input", "output", "default", "decision", "process"
    - Include detailed edge labels and types: "success", "error", "conditional", "parallel"
    - Cover: Planning, Architecture, Development, Testing, Deployment, Monitoring, Maintenance
    
    USER WORKFLOW:
    - Include 6-10 user journey steps
    - Each node must have: label, description, userActions[], systemResponses[], painPoints[], successMetrics[]
    - Cover: Discovery, Onboarding, Core Usage, Support, Retention
    - Include conditional edges with conditions
    
    SCHEMA DIAGRAM:
    - Generate 4-8 main entities based on the specific project requirements
    - Each entity must have COMPREHENSIVE fields with ALL details:
      * name, type, required, description, constraints, isPrimaryKey, isForeignKey, references
    - Include proper relationships: ONE_TO_ONE, ONE_TO_MANY, MANY_TO_MANY
    - Position entities logically (x: 50-800, y: 50-600)
    - Include relationship labels and types with sourceField and targetField
    - Use realistic field types: uuid, varchar(255), text, integer, boolean, timestamp, date, etc.
    - Include proper constraints: PRIMARY KEY, FOREIGN KEY, UNIQUE, NOT NULL
    - Add detailed field descriptions explaining the exact purpose of each field
    - For User table: include id, email, password, name, created_at, updated_at, profile_picture, etc.
    - For each entity, show ALL relevant fields that would be needed for the project
    - Make the schema specific to the project type and requirements
    
    Make everything specific to this project type and requirements. Return only valid JSON, no additional text.
    `

    try {
      const result = await this.model.generateContent(prompt)
      const response = await result.response
      const text = response.text()
      
      // Clean the response to extract JSON
      const jsonMatch = text.match(/\{[\s\S]*\}/)
      if (!jsonMatch) {
        throw new Error('No valid JSON found in AI response')
      }
      
      return JSON.parse(jsonMatch[0])
    } catch (error) {
      console.error('Error generating workflow with AI:', error)
      // Fallback to mock data if AI fails
      return this.getMockWorkflow()
    }
  }

  private getMockAnalysis(): ProjectAnalysis {
    return {
      score: 75,
      pillars: [
        { name: 'Technical Feasibility', score: 80, feedback: 'Moderate technical complexity' },
        { name: 'Market Viability', score: 70, feedback: 'Good market potential' },
        { name: 'User Experience', score: 75, feedback: 'User-friendly design possible' },
        { name: 'Scalability', score: 80, feedback: 'Scalable architecture' },
        { name: 'Monetization Potential', score: 65, feedback: 'Multiple revenue streams possible' }
      ],
      advantages: ['Clear value proposition', 'Growing market demand', 'Scalable technology'],
      disadvantages: ['Competitive market', 'Development complexity', 'Initial investment required'],
      features: ['User authentication', 'Core functionality', 'Analytics dashboard', 'Mobile support'],
      recommendations: ['Start with MVP', 'Focus on user research', 'Plan for scalability']
    }
  }

  private getMockKanban(): KanbanData {
    return {
      pipelines: [
        { id: 'backlog', name: 'Backlog', color: '#gray' },
        { id: 'todo', name: 'To Do', color: '#blue' },
        { id: 'in-progress', name: 'In Progress', color: '#yellow' },
        { id: 'review', name: 'Review', color: '#purple' },
        { id: 'done', name: 'Done', color: '#green' }
      ],
      tasks: [
        {
          id: '1',
          title: 'Project Setup & Architecture',
          description: 'Set up development environment and define system architecture',
          pipeline: 'todo',
          priority: 'high',
          estimatedHours: 16,
          userStory: 'As a developer, I want to have a solid foundation so that I can build features efficiently'
        },
        {
          id: '2',
          title: 'User Authentication System',
          description: 'Implement secure user registration and login system',
          pipeline: 'todo',
          priority: 'high',
          estimatedHours: 24,
          userStory: 'As a user, I want to create an account so that I can access personalized features'
        },
        {
          id: '3',
          title: 'Core Feature Development',
          description: 'Build the main functionality based on project requirements',
          pipeline: 'todo',
          priority: 'high',
          estimatedHours: 40,
          userStory: 'As a user, I want to use the core features so that I can achieve my goals'
        },
        {
          id: '4',
          title: 'UI/UX Implementation',
          description: 'Create responsive and intuitive user interface',
          pipeline: 'todo',
          priority: 'medium',
          estimatedHours: 32,
          userStory: 'As a user, I want an intuitive interface so that I can easily navigate the application'
        },
        {
          id: '5',
          title: 'Testing & Quality Assurance',
          description: 'Implement comprehensive testing and bug fixes',
          pipeline: 'todo',
          priority: 'medium',
          estimatedHours: 20,
          userStory: 'As a user, I want a reliable application so that I can trust it with my data'
        },
        {
          id: '6',
          title: 'Database Design',
          description: 'Design and implement database schema and relationships',
          pipeline: 'todo',
          priority: 'high',
          estimatedHours: 12,
          userStory: 'As a developer, I want a well-structured database so that data is organized efficiently'
        },
        {
          id: '7',
          title: 'API Development',
          description: 'Create RESTful API endpoints for frontend communication',
          pipeline: 'todo',
          priority: 'high',
          estimatedHours: 28,
          userStory: 'As a frontend developer, I want API endpoints so that I can fetch and update data'
        },
        {
          id: '8',
          title: 'Deployment & DevOps',
          description: 'Set up production environment and deployment pipeline',
          pipeline: 'todo',
          priority: 'medium',
          estimatedHours: 16,
          userStory: 'As a developer, I want automated deployment so that I can release features quickly'
        }
      ]
    }
  }

  private getMockWorkflow(): WorkflowData {
    return {
      technicalWorkflow: {
        nodes: [
          { 
            id: 'start', 
            type: 'input', 
            position: { x: 50, y: 200 }, 
            data: { 
              label: 'Project Start', 
              description: 'Initial project kickoff and setup',
              details: ['Initialize repository', 'Set up development environment', 'Configure tools'],
              technologies: ['Git', 'Node.js', 'VS Code'],
              estimatedTime: '1-2 days',
              dependencies: []
            } 
          },
          { 
            id: 'planning', 
            type: 'default', 
            position: { x: 200, y: 100 }, 
            data: { 
              label: 'Planning Phase', 
              description: 'Requirements gathering and architecture design',
              details: ['Gather requirements', 'Design system architecture', 'Create technical specifications'],
              technologies: ['Figma', 'Draw.io', 'Confluence'],
              estimatedTime: '3-5 days',
              dependencies: ['start']
            } 
          }
        ],
        edges: [
          { id: 'e1', source: 'start', target: 'planning', label: 'Setup Complete', type: 'success' }
        ]
      },
      userWorkflow: {
        nodes: [
          { 
            id: 'landing', 
            type: 'input', 
            position: { x: 50, y: 200 }, 
            data: {
              label: 'User Lands on Platform',
              description: 'User discovers and accesses the platform',
              userActions: ['Visit website', 'Browse features', 'Read documentation'],
              systemResponses: ['Show landing page', 'Display feature highlights', 'Provide demo'],
              painPoints: ['Slow loading', 'Unclear value proposition'],
              successMetrics: ['Page views', 'Time on site', 'Bounce rate']
            }
          }
        ],
        edges: [
          { id: 'e1', source: 'landing', target: 'signup', label: 'User Interested', condition: 'User clicks signup' }
        ]
      },
      schemaDiagram: {
        entities: [
          {
            name: 'User',
            fields: [
              {
                name: 'id',
                type: 'uuid',
                required: true,
                description: 'Unique identifier for user',
                constraints: ['PRIMARY KEY', 'NOT NULL'],
                isPrimaryKey: true,
                isForeignKey: false
              },
              {
                name: 'email',
                type: 'varchar(255)',
                required: true,
                description: 'User email address for authentication',
                constraints: ['UNIQUE', 'NOT NULL'],
                isPrimaryKey: false,
                isForeignKey: false
              },
              {
                name: 'password',
                type: 'varchar(255)',
                required: true,
                description: 'Hashed user password',
                constraints: ['NOT NULL'],
                isPrimaryKey: false,
                isForeignKey: false
              },
              {
                name: 'name',
                type: 'varchar(255)',
                required: false,
                description: 'User display name',
                constraints: [],
                isPrimaryKey: false,
                isForeignKey: false
              },
              {
                name: 'profile_picture',
                type: 'text',
                required: false,
                description: 'URL to user profile picture',
                constraints: [],
                isPrimaryKey: false,
                isForeignKey: false
              },
              {
                name: 'role',
                type: 'varchar(50)',
                required: false,
                description: 'User role (admin, user, guest)',
                constraints: [],
                isPrimaryKey: false,
                isForeignKey: false
              },
              {
                name: 'is_active',
                type: 'boolean',
                required: true,
                description: 'Whether user account is active',
                constraints: ['NOT NULL'],
                isPrimaryKey: false,
                isForeignKey: false
              },
              {
                name: 'created_at',
                type: 'timestamp',
                required: true,
                description: 'Account creation timestamp',
                constraints: ['NOT NULL'],
                isPrimaryKey: false,
                isForeignKey: false
              },
              {
                name: 'updated_at',
                type: 'timestamp',
                required: false,
                description: 'Account last update timestamp',
                constraints: [],
                isPrimaryKey: false,
                isForeignKey: false
              }
            ],
            relationships: [
              {
                target: 'Project',
                type: 'ONE_TO_MANY',
                description: 'User can have multiple projects',
                field: 'id'
              }
            ],
            position: { x: 100, y: 100 }
          },
          {
            name: 'Project',
            fields: [
              {
                name: 'id',
                type: 'uuid',
                required: true,
                description: 'Unique project identifier',
                constraints: ['PRIMARY KEY', 'NOT NULL'],
                isPrimaryKey: true,
                isForeignKey: false
              },
              {
                name: 'title',
                type: 'varchar(255)',
                required: true,
                description: 'Project title',
                constraints: ['NOT NULL'],
                isPrimaryKey: false,
                isForeignKey: false
              },
              {
                name: 'description',
                type: 'text',
                required: false,
                description: 'Detailed project description',
                constraints: [],
                isPrimaryKey: false,
                isForeignKey: false
              },
              {
                name: 'user_id',
                type: 'uuid',
                required: true,
                description: 'Foreign key to User table',
                constraints: ['NOT NULL'],
                isPrimaryKey: false,
                isForeignKey: true,
                references: 'User.id'
              },
              {
                name: 'status',
                type: 'varchar(50)',
                required: true,
                description: 'Project status (active, completed, archived, paused)',
                constraints: ['NOT NULL'],
                isPrimaryKey: false,
                isForeignKey: false
              },
              {
                name: 'priority',
                type: 'integer',
                required: false,
                description: 'Project priority level (1-5)',
                constraints: [],
                isPrimaryKey: false,
                isForeignKey: false
              },
              {
                name: 'start_date',
                type: 'date',
                required: false,
                description: 'Project start date',
                constraints: [],
                isPrimaryKey: false,
                isForeignKey: false
              },
              {
                name: 'end_date',
                type: 'date',
                required: false,
                description: 'Project end date',
                constraints: [],
                isPrimaryKey: false,
                isForeignKey: false
              },
              {
                name: 'created_at',
                type: 'timestamp',
                required: true,
                description: 'Project creation timestamp',
                constraints: ['NOT NULL'],
                isPrimaryKey: false,
                isForeignKey: false
              },
              {
                name: 'updated_at',
                type: 'timestamp',
                required: false,
                description: 'Project last update timestamp',
                constraints: [],
                isPrimaryKey: false,
                isForeignKey: false
              }
            ],
            relationships: [
              {
                target: 'User',
                type: 'MANY_TO_ONE',
                description: 'Project belongs to one user',
                field: 'user_id'
              },
              {
                target: 'Task',
                type: 'ONE_TO_MANY',
                description: 'Project can have multiple tasks',
                field: 'id'
              }
            ],
            position: { x: 400, y: 100 }
          },
          {
            name: 'Task',
            fields: [
              {
                name: 'id',
                type: 'uuid',
                required: true,
                description: 'Unique task identifier',
                constraints: ['PRIMARY KEY', 'NOT NULL'],
                isPrimaryKey: true,
                isForeignKey: false
              },
              {
                name: 'project_id',
                type: 'uuid',
                required: true,
                description: 'Foreign key to Project table',
                constraints: ['NOT NULL'],
                isPrimaryKey: false,
                isForeignKey: true,
                references: 'Project.id'
              },
              {
                name: 'title',
                type: 'varchar(255)',
                required: true,
                description: 'Task title',
                constraints: ['NOT NULL'],
                isPrimaryKey: false,
                isForeignKey: false
              },
              {
                name: 'description',
                type: 'text',
                required: false,
                description: 'Detailed task description',
                constraints: [],
                isPrimaryKey: false,
                isForeignKey: false
              },
              {
                name: 'status',
                type: 'varchar(50)',
                required: true,
                description: 'Task status (todo, in_progress, completed, cancelled)',
                constraints: ['NOT NULL'],
                isPrimaryKey: false,
                isForeignKey: false
              },
              {
                name: 'priority',
                type: 'integer',
                required: true,
                description: 'Task priority level (1-5)',
                constraints: ['NOT NULL'],
                isPrimaryKey: false,
                isForeignKey: false
              },
              {
                name: 'due_date',
                type: 'date',
                required: false,
                description: 'Task due date',
                constraints: [],
                isPrimaryKey: false,
                isForeignKey: false
              },
              {
                name: 'estimated_hours',
                type: 'integer',
                required: false,
                description: 'Estimated hours to complete task',
                constraints: [],
                isPrimaryKey: false,
                isForeignKey: false
              },
              {
                name: 'assigned_to',
                type: 'uuid',
                required: false,
                description: 'User assigned to this task',
                constraints: [],
                isPrimaryKey: false,
                isForeignKey: true,
                references: 'User.id'
              },
              {
                name: 'created_at',
                type: 'timestamp',
                required: true,
                description: 'Task creation timestamp',
                constraints: ['NOT NULL'],
                isPrimaryKey: false,
                isForeignKey: false
              },
              {
                name: 'updated_at',
                type: 'timestamp',
                required: false,
                description: 'Task last update timestamp',
                constraints: [],
                isPrimaryKey: false,
                isForeignKey: false
              }
            ],
            relationships: [
              {
                target: 'Project',
                type: 'MANY_TO_ONE',
                description: 'Task belongs to one project',
                field: 'project_id'
              },
              {
                target: 'User',
                type: 'MANY_TO_ONE',
                description: 'Task can be assigned to one user',
                field: 'assigned_to'
              }
            ],
            position: { x: 700, y: 100 }
          }
        ],
        relationships: [
          {
            id: 'r1',
            source: 'User',
            target: 'Project',
            type: 'ONE_TO_MANY',
            label: 'owns',
            sourceField: 'id',
            targetField: 'user_id'
          },
          {
            id: 'r2',
            source: 'Project',
            target: 'Task',
            type: 'ONE_TO_MANY',
            label: 'contains',
            sourceField: 'id',
            targetField: 'project_id'
          },
          {
            id: 'r3',
            source: 'User',
            target: 'Task',
            type: 'ONE_TO_MANY',
            label: 'assigned_to',
            sourceField: 'id',
            targetField: 'assigned_to'
          }
        ]
      }
    }
  }
}
