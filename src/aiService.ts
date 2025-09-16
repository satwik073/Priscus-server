import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

export interface ProjectAnalysis {
  score: number
  summary?: string
  pillars: Array<{
    name: string
    score: number
    feedback: string
    strengths?: string[]
    challenges?: string[]
    architectureRecommendations?: string[]
    riskAssessment?: {
      level: string
      factors: string[]
      mitigations: string[]
    }
    targetAudience?: string[]
    marketSize?: string
    competitiveLandscape?: string[]
    differentiators?: string[]
    goToMarketStrategy?: string[]
    userJourneyHighlights?: string[]
    painPointsAddressed?: string[]
    accessibilityConsiderations?: string[]
    userRetentionStrategies?: string[]
    userResearchRecommendations?: string[]
    technicalScalability?: string[]
    businessScalability?: string[]
    resourceRequirements?: string[]
    growthLimitations?: string[]
    internationalExpansion?: string[]
    revenueModels?: string[]
    pricingStrategies?: string[]
    customerAcquisitionCost?: string
    lifetimeValue?: string
    breakEvenAnalysis?: string
    securityConsiderations?: string[]
    complianceRequirements?: string[]
    dataPrivacyApproach?: string[]
    securityTestingRecommendations?: string[]
    disruptionFactor?: string
    patentPotential?: string[]
    futureTrendAlignment?: string[]
    evolutionPotential?: string[]
  }>
  advantages: Array<{ title: string; description: string }>
  disadvantages: Array<{ title: string; description: string }>
  features: Array<{
    title: string
    description: string
    priority: string
    complexity: string
    userImpact: string
  }>
  recommendations: Array<{
    title: string
    description: string
    implementationSteps: string[]
    expectedOutcome: string
    timeframe: string
  }>
  technicalAnalysis?: any
  marketAnalysis?: any
  financialAnalysis?: any
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
    Analyze this project idea and provide an extremely comprehensive, in-depth evaluation with hyper-detailed insights:

    Project Title: ${title}
    Project Description: ${description}

    Please provide an exhaustive analysis in the following JSON format:
    {
      "score": <overall score from 0-100>,
      "summary": "<2-3 paragraph executive summary of the entire project analysis, highlighting key strengths, challenges, and unique opportunities>",
      "pillars": [
        {
          "name": "Technical Feasibility",
          "score": <score 0-100>,
          "feedback": "<detailed 3-5 sentence feedback>",
          "strengths": ["<strength 1 with technical justification>", "<strength 2>", "<strength 3>", "<strength 4>"],
          "challenges": ["<challenge 1 with potential mitigation strategy>", "<challenge 2>", "<challenge 3>", "<challenge 4>"],
          "architectureRecommendations": ["<specific architecture pattern recommendation>", "<tech stack recommendation>", "<implementation approach>", "<deployment strategy>"],
          "riskAssessment": {
            "level": "<high|medium|low>",
            "factors": ["<risk factor 1>", "<risk factor 2>", "<risk factor 3>"],
            "mitigations": ["<mitigation strategy 1>", "<mitigation strategy 2>", "<mitigation strategy 3>"]
          }
        },
        {
          "name": "Market Viability", 
          "score": <score 0-100>,
          "feedback": "<detailed 3-5 sentence feedback>",
          "targetAudience": ["<detailed primary persona>", "<secondary persona>", "<tertiary persona>"],
          "marketSize": "<market size analysis with numbers>",
          "competitiveLandscape": ["<competitor 1 with strengths/weaknesses>", "<competitor 2>", "<competitor 3>", "<competitor 4>"],
          "differentiators": ["<unique selling proposition 1>", "<differentiator 2>", "<differentiator 3>"],
          "goToMarketStrategy": ["<GTM strategy 1>", "<strategy 2>", "<strategy 3>"],
          "riskAssessment": {
            "level": "<high|medium|low>",
            "factors": ["<risk factor 1>", "<risk factor 2>", "<risk factor 3>"],
            "mitigations": ["<mitigation strategy 1>", "<mitigation strategy 2>", "<mitigation strategy 3>"]
          }
        },
        {
          "name": "User Experience",
          "score": <score 0-100>,
          "feedback": "<detailed 3-5 sentence feedback>",
          "userJourneyHighlights": ["<key user journey point 1>", "<point 2>", "<point 3>", "<point 4>"],
          "painPointsAddressed": ["<pain point 1 with solution>", "<pain point 2>", "<pain point 3>", "<pain point 4>"],
          "accessibilityConsiderations": ["<accessibility consideration 1>", "<consideration 2>", "<consideration 3>"],
          "userRetentionStrategies": ["<retention strategy 1>", "<strategy 2>", "<strategy 3>"],
          "userResearchRecommendations": ["<research method 1>", "<method 2>", "<method 3>"],
          "riskAssessment": {
            "level": "<high|medium|low>",
            "factors": ["<risk factor 1>", "<risk factor 2>", "<risk factor 3>"],
            "mitigations": ["<mitigation strategy 1>", "<mitigation strategy 2>", "<mitigation strategy 3>"]
          }
        },
        {
          "name": "Scalability",
          "score": <score 0-100>,
          "feedback": "<detailed 3-5 sentence feedback>",
          "technicalScalability": ["<scaling strategy 1>", "<strategy 2>", "<strategy 3>", "<strategy 4>"],
          "businessScalability": ["<business scaling approach 1>", "<approach 2>", "<approach 3>"],
          "resourceRequirements": ["<resource requirement 1>", "<requirement 2>", "<requirement 3>", "<requirement 4>"],
          "growthLimitations": ["<limitation 1 with workaround>", "<limitation 2>", "<limitation 3>"],
          "internationalExpansion": ["<international consideration 1>", "<consideration 2>", "<consideration 3>"],
          "riskAssessment": {
            "level": "<high|medium|low>",
            "factors": ["<risk factor 1>", "<risk factor 2>", "<risk factor 3>"],
            "mitigations": ["<mitigation strategy 1>", "<mitigation strategy 2>", "<mitigation strategy 3>"]
          }
        },
        {
          "name": "Monetization Potential",
          "score": <score 0-100>,
          "feedback": "<detailed 3-5 sentence feedback>",
          "revenueModels": ["<revenue model 1 with projected effectiveness>", "<model 2>", "<model 3>", "<model 4>"],
          "pricingStrategies": ["<pricing strategy 1>", "<strategy 2>", "<strategy 3>"],
          "customerAcquisitionCost": "<detailed CAC analysis>",
          "lifetimeValue": "<detailed LTV analysis>",
          "breakEvenAnalysis": "<break-even timeline and requirements>",
          "riskAssessment": {
            "level": "<high|medium|low>",
            "factors": ["<risk factor 1>", "<risk factor 2>", "<risk factor 3>"],
            "mitigations": ["<mitigation strategy 1>", "<mitigation strategy 2>", "<mitigation strategy 3>"]
          }
        },
        {
          "name": "Security & Compliance",
          "score": <score 0-100>,
          "feedback": "<detailed 3-5 sentence feedback>",
          "securityConsiderations": ["<security consideration 1>", "<consideration 2>", "<consideration 3>", "<consideration 4>"],
          "complianceRequirements": ["<compliance requirement 1>", "<requirement 2>", "<requirement 3>"],
          "dataPrivacyApproach": ["<data privacy approach 1>", "<approach 2>", "<approach 3>"],
          "securityTestingRecommendations": ["<security testing recommendation 1>", "<recommendation 2>", "<recommendation 3>"],
          "riskAssessment": {
            "level": "<high|medium|low>",
            "factors": ["<risk factor 1>", "<risk factor 2>", "<risk factor 3>"],
            "mitigations": ["<mitigation strategy 1>", "<mitigation strategy 2>", "<mitigation strategy 3>"]
          }
        },
        {
          "name": "Innovation Potential",
          "score": <score 0-100>,
          "feedback": "<detailed 3-5 sentence feedback>",
          "disruptionFactor": "<assessment of how disruptive this solution is>",
          "patentPotential": ["<patentable aspect 1>", "<aspect 2>", "<aspect 3>"],
          "futureTrendAlignment": ["<future trend 1 and how project aligns>", "<trend 2>", "<trend 3>"],
          "evolutionPotential": ["<future evolution possibility 1>", "<possibility 2>", "<possibility 3>"],
          "riskAssessment": {
            "level": "<high|medium|low>",
            "factors": ["<risk factor 1>", "<risk factor 2>", "<risk factor 3>"],
            "mitigations": ["<mitigation strategy 1>", "<mitigation strategy 2>", "<mitigation strategy 3>"]
          }
        }
      ],
      "advantages": [
        {"title": "<advantage 1>", "description": "<detailed explanation of advantage 1 with examples and impact>"},
        {"title": "<advantage 2>", "description": "<detailed explanation of advantage 2 with examples and impact>"},
        {"title": "<advantage 3>", "description": "<detailed explanation of advantage 3 with examples and impact>"},
        {"title": "<advantage 4>", "description": "<detailed explanation of advantage 4 with examples and impact>"},
        {"title": "<advantage 5>", "description": "<detailed explanation of advantage 5 with examples and impact>"}
      ],
      "disadvantages": [
        {"title": "<disadvantage 1>", "description": "<detailed explanation of disadvantage 1 with potential mitigation strategies>"},
        {"title": "<disadvantage 2>", "description": "<detailed explanation of disadvantage 2 with potential mitigation strategies>"},
        {"title": "<disadvantage 3>", "description": "<detailed explanation of disadvantage 3 with potential mitigation strategies>"},
        {"title": "<disadvantage 4>", "description": "<detailed explanation of disadvantage 4 with potential mitigation strategies>"},
        {"title": "<disadvantage 5>", "description": "<detailed explanation of disadvantage 5 with potential mitigation strategies>"}
      ],
      "features": [
        {"title": "<feature 1>", "description": "<detailed description>", "priority": "<must-have|should-have|nice-to-have>", "complexity": "<high|medium|low>", "userImpact": "<high|medium|low>"},
        {"title": "<feature 2>", "description": "<detailed description>", "priority": "<must-have|should-have|nice-to-have>", "complexity": "<high|medium|low>", "userImpact": "<high|medium|low>"},
        {"title": "<feature 3>", "description": "<detailed description>", "priority": "<must-have|should-have|nice-to-have>", "complexity": "<high|medium|low>", "userImpact": "<high|medium|low>"},
        {"title": "<feature 4>", "description": "<detailed description>", "priority": "<must-have|should-have|nice-to-have>", "complexity": "<high|medium|low>", "userImpact": "<high|medium|low>"},
        {"title": "<feature 5>", "description": "<detailed description>", "priority": "<must-have|should-have|nice-to-have>", "complexity": "<high|medium|low>", "userImpact": "<high|medium|low>"},
        {"title": "<feature 6>", "description": "<detailed description>", "priority": "<must-have|should-have|nice-to-have>", "complexity": "<high|medium|low>", "userImpact": "<high|medium|low>"},
        {"title": "<feature 7>", "description": "<detailed description>", "priority": "<must-have|should-have|nice-to-have>", "complexity": "<high|medium|low>", "userImpact": "<high|medium|low>"},
        {"title": "<feature 8>", "description": "<detailed description>", "priority": "<must-have|should-have|nice-to-have>", "complexity": "<high|medium|low>", "userImpact": "<high|medium|low>"}
      ],
      "recommendations": [
        {"title": "<recommendation 1>", "description": "<detailed explanation>", "implementationSteps": ["<step 1>", "<step 2>", "<step 3>"], "expectedOutcome": "<detailed outcome>", "timeframe": "<short-term|medium-term|long-term>"},
        {"title": "<recommendation 2>", "description": "<detailed explanation>", "implementationSteps": ["<step 1>", "<step 2>", "<step 3>"], "expectedOutcome": "<detailed outcome>", "timeframe": "<short-term|medium-term|long-term>"},
        {"title": "<recommendation 3>", "description": "<detailed explanation>", "implementationSteps": ["<step 1>", "<step 2>", "<step 3>"], "expectedOutcome": "<detailed outcome>", "timeframe": "<short-term|medium-term|long-term>"},
        {"title": "<recommendation 4>", "description": "<detailed explanation>", "implementationSteps": ["<step 1>", "<step 2>", "<step 3>"], "expectedOutcome": "<detailed outcome>", "timeframe": "<short-term|medium-term|long-term>"},
        {"title": "<recommendation 5>", "description": "<detailed explanation>", "implementationSteps": ["<step 1>", "<step 2>", "<step 3>"], "expectedOutcome": "<detailed outcome>", "timeframe": "<short-term|medium-term|long-term>"}
      ],
      "technicalAnalysis": {
        "recommendedStack": {
          "frontend": ["<tech 1 with rationale>", "<tech 2 with rationale>", "<tech 3 with rationale>"],
          "backend": ["<tech 1 with rationale>", "<tech 2 with rationale>", "<tech 3 with rationale>"],
          "database": ["<tech 1 with rationale>", "<tech 2 with rationale>"],
          "devops": ["<tech 1 with rationale>", "<tech 2 with rationale>", "<tech 3 with rationale>"],
          "security": ["<tech 1 with rationale>", "<tech 2 with rationale>"]
        },
        "architecturePatterns": ["<pattern 1 with applicability explanation>", "<pattern 2>", "<pattern 3>"],
        "scalingStrategy": "<detailed scaling strategy>",
        "performanceConsiderations": ["<consideration 1>", "<consideration 2>", "<consideration 3>"],
        "securityConsiderations": ["<consideration 1>", "<consideration 2>", "<consideration 3>"]
      },
      "marketAnalysis": {
        "targetMarket": "<detailed target market analysis>",
        "competitiveLandscape": "<detailed competitive landscape analysis>",
        "marketTrends": ["<trend 1 with relevance>", "<trend 2>", "<trend 3>", "<trend 4>"],
        "growthOpportunities": ["<opportunity 1>", "<opportunity 2>", "<opportunity 3>"],
        "entryBarriers": ["<barrier 1 with strategy to overcome>", "<barrier 2>", "<barrier 3>"]
      },
      "financialAnalysis": {
        "developmentCosts": "<estimated development cost breakdown>",
        "operationalCosts": "<estimated operational cost breakdown>",
        "revenueProjections": "<detailed revenue projections>",
        "breakevenAnalysis": "<breakeven analysis>",
        "fundingRequirements": "<funding requirements and potential sources>",
        "roi": "<return on investment analysis>"
      }
    }

    Focus on:
    - Highly detailed technical complexity and feasibility analysis
    - Comprehensive market demand and competition assessment with actual examples
    - In-depth user experience considerations with specific pain points addressed
    - Thorough scalability potential analysis with technical architecture recommendations
    - Extensive revenue generation possibilities with actual monetization strategies
    - Implementation challenges with detailed mitigation approaches
    - Suggested features based on deep understanding of project scope with prioritization
    - Actionable recommendations with implementation steps
    - Security and compliance considerations relevant to this specific project
    - Detailed technical stack recommendations with reasoning
    - Comprehensive financial projections

    Ensure all data is:
    - Extremely detailed and specific to this project (not generic)
    - Actionable with clear next steps
    - Comprehensive covering all aspects of the project
    - Realistic and practical for implementation
    - Based on current industry best practices and trends

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
    // Extract features in more structured way
    let featuresText = '';
    if (Array.isArray(analysis.features)) {
      if (typeof analysis.features[0] === 'object' && analysis.features[0].title) {
        // New format with detailed features
        featuresText = analysis.features.map((f: any) => 
          `${f.title} (${f.priority}): ${f.description}`
        ).join('\n- ');
      } else {
        // Old format with simple string array
        featuresText = analysis.features.join('\n- ');
      }
    }

    // Extract recommendations in more structured way
    let recommendationsText = '';
    if (Array.isArray(analysis.recommendations)) {
      if (typeof analysis.recommendations[0] === 'object' && analysis.recommendations[0].title) {
        // New format with detailed recommendations
        recommendationsText = analysis.recommendations.map((r: any) => 
          `${r.title}: ${r.description} (${r.timeframe})`
        ).join('\n- ');
      } else {
        // Old format with simple string array
        recommendationsText = analysis.recommendations.join('\n- ');
      }
    }

    const prompt = `
    Based on the project analysis, generate an ULTRA-COMPREHENSIVE and IMPLEMENTATION-READY kanban board for this project:

    Project Title: ${title}
    Project Description: ${description}
    
    Analysis Results:
    - Overall Score: ${analysis.score}/100
    - Features: 
      - ${featuresText}
    - Recommendations: 
      - ${recommendationsText}

    Please generate a detailed, production-ready kanban board in the following JSON format:
    {
      "pipelines": [
        {
          "id": "backlog",
          "name": "Backlog",
          "color": "#808080",
          "description": "Items identified but not yet ready for development",
          "workInProgressLimit": 0,
          "policies": ["Items must have basic description", "Can contain items in any state of definition"]
        },
        {
          "id": "planning", 
          "name": "Planning & Analysis",
          "color": "#C5D9F1",
          "description": "Items being researched, defined and estimated",
          "workInProgressLimit": 5,
          "policies": ["All items must have acceptance criteria before moving forward", "Technical approach must be documented"]
        },
        {
          "id": "todo", 
          "name": "Ready for Development",
          "color": "#2E75B6",
          "description": "Fully defined items ready for implementation",
          "workInProgressLimit": 10,
          "policies": ["Must be fully specced", "Must have effort estimate", "Must have priority"]
        },
        {
          "id": "in-progress",
          "name": "In Development", 
          "color": "#FFC000",
          "description": "Items actively being worked on by developers",
          "workInProgressLimit": 6,
          "policies": ["Developer must be assigned", "Should not remain here longer than 5 days", "Blockers must be flagged"]
        },
        {
          "id": "review",
          "name": "Code Review",
          "color": "#7030A0",
          "description": "Code complete and awaiting peer review",
          "workInProgressLimit": 4,
          "policies": ["Must have pull request", "All tests must pass", "Requires approval from at least one senior developer"]
        },
        {
          "id": "testing",
          "name": "QA & Testing",
          "color": "#C55A11",
          "description": "Ready for quality assurance testing",
          "workInProgressLimit": 5,
          "policies": ["All acceptance criteria must be verified", "Regression tests must be run", "Any bugs must be documented"]
        },
        {
          "id": "ready-deploy",
          "name": "Ready for Deployment",
          "color": "#00B050",
          "description": "Fully tested and ready for production",
          "workInProgressLimit": 8,
          "policies": ["All tests passing", "Documentation updated", "Deployment plan approved"]
        },
        {
          "id": "done",
          "name": "Deployed to Production",
          "color": "#375623",
          "description": "Successfully deployed to production environment",
          "workInProgressLimit": 0,
          "policies": ["Monitored for at least 24 hours", "Stakeholder sign-off received", "Metrics collection confirmed"]
        }
      ],
      "tasks": [
        {
          "id": "task-1",
          "title": "Project Setup & Environment Configuration",
          "description": "Initialize repository structure and configure development, staging, and production environments with proper CI/CD pipelines and infrastructure as code",
          "pipeline": "todo",
          "priority": "critical",
          "estimatedHours": 16,
          "userStory": "As a developer, I want a fully configured development environment so that I can start implementing features efficiently",
          "assignee": "DevOps Lead",
          "labels": ["infrastructure", "devops", "setup"],
          "dependencies": [],
          "acceptanceCriteria": [
            "Git repository initialized with proper branching strategy",
            "Development, staging, and production environments configured",
            "CI/CD pipelines established and tested",
            "Documentation for setup process created",
            "All team members can access and run project locally"
          ],
          "subtasks": [
            { "title": "Create repository and branch structure", "completed": false, "estimatedHours": 2 },
            { "title": "Set up development environment", "completed": false, "estimatedHours": 4 },
            { "title": "Configure CI/CD pipeline", "completed": false, "estimatedHours": 6 },
            { "title": "Set up staging and production environments", "completed": false, "estimatedHours": 4 }
          ],
          "comments": [
            { "author": "Tech Lead", "text": "Make sure to use Infrastructure as Code for all environment setup", "timestamp": "2023-08-15T10:30:00Z" }
          ],
          "createdAt": "2023-08-15T09:00:00Z",
          "updatedAt": "2023-08-15T10:30:00Z",
          "dueDate": "2023-08-18T17:00:00Z",
          "storyPoints": 8,
          "businessValue": "high",
          "riskLevel": "medium",
          "testStrategy": "Manual verification with documentation",
          "additionalResources": [
            { "type": "document", "url": "https://example.com/setup-docs", "description": "Environment setup best practices" }
          ]
        }
      ]
    }

    Generate 15-20 DETAILED, SPECIFIC tasks based on the project requirements. 
    
    Each task MUST include ALL of these properties:
    - id: Unique identifier (e.g., "task-1", "task-2", etc.)
    - title: Clear, concise title describing the task
    - description: Comprehensive description of what needs to be done and why
    - pipeline: Initial pipeline placement (most should start in "backlog" or "planning")
    - priority: "critical", "high", "medium", or "low"
    - estimatedHours: Realistic time estimate based on complexity
    - userStory: In format "As a [role], I want [goal] so that [benefit]"
    - assignee: Suggested role for assignment (leave empty for some tasks)
    - labels: Array of relevant tags/categories
    - dependencies: Array of task IDs this task depends on
    - acceptanceCriteria: Array of specific criteria that define when task is complete
    - subtasks: Array of smaller steps with { title, completed, estimatedHours }
    - comments: Array of relevant notes/comments
    - createdAt: Creation timestamp (use recent dates)
    - updatedAt: Last update timestamp
    - dueDate: Realistic due date based on dependencies and timeline
    - storyPoints: Fibonacci number (1, 2, 3, 5, 8, 13, 21) reflecting complexity
    - businessValue: "critical", "high", "medium", or "low"
    - riskLevel: "high", "medium", or "low"
    - testStrategy: How this task will be tested/verified
    - additionalResources: Array of helpful resources, documentation, etc.

    Your tasks MUST cover ALL these aspects:
    - Project infrastructure setup and architecture
    - Database design and implementation
    - Backend API development
    - Authentication and authorization system
    - Core feature development aligned with project requirements
    - Frontend implementation with responsive design
    - Integration with third-party services (if applicable)
    - Comprehensive testing strategy (unit, integration, E2E)
    - Security implementation and testing
    - Performance optimization
    - Documentation creation
    - Deployment pipeline
    - User experience and interface design
    - Analytics and monitoring implementation
    - Maintenance and support planning

    Make tasks EXTREMELY SPECIFIC to this project's unique features and requirements. Do not use generic examples.
    Tasks should represent a complete implementation roadmap for the entire project.
    Distribute tasks across different pipelines (most in backlog/planning, some in todo, few in other stages).
    Create realistic dependencies between tasks.
    Set appropriate estimated hours (small tasks: 2-8 hours, medium: 8-24, large: 24-40).
    Ensure acceptance criteria are specific, measurable, and testable.

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
      console.error('Error generating kanban with AI:', error)
      // Fallback to mock data if AI fails
      return this.getMockKanban()
    }
  }

  async generateWorkflow(analysis: any, title: string, description: string): Promise<WorkflowData> {
    // Extract features in more structured way
    let featuresText = '';
    if (Array.isArray(analysis.features)) {
      if (typeof analysis.features[0] === 'object' && analysis.features[0].title) {
        // New format with detailed features
        featuresText = analysis.features.map((f: any) => 
          `${f.title} (${f.priority}): ${f.description}`
        ).join('\n- ');
      } else {
        // Old format with simple string array
        featuresText = analysis.features.join('\n- ');
      }
    }

    // Extract recommendations in more structured way
    let recommendationsText = '';
    if (Array.isArray(analysis.recommendations)) {
      if (typeof analysis.recommendations[0] === 'object' && analysis.recommendations[0].title) {
        // New format with detailed recommendations
        recommendationsText = analysis.recommendations.map((r: any) => 
          `${r.title}: ${r.description} (${r.timeframe})`
        ).join('\n- ');
      } else {
        // Old format with simple string array
        recommendationsText = analysis.recommendations.join('\n- ');
      }
    }

    // Extract technical stack if available in new format
    let techStackText = '';
    if (analysis.technicalAnalysis && analysis.technicalAnalysis.recommendedStack) {
      const stack = analysis.technicalAnalysis.recommendedStack;
      techStackText = `
      - Frontend: ${Array.isArray(stack.frontend) ? stack.frontend.join(', ') : 'Not specified'}
      - Backend: ${Array.isArray(stack.backend) ? stack.backend.join(', ') : 'Not specified'}
      - Database: ${Array.isArray(stack.database) ? stack.database.join(', ') : 'Not specified'}
      - DevOps: ${Array.isArray(stack.devops) ? stack.devops.join(', ') : 'Not specified'}
      `;
    }

    const prompt = `
    Based on the project analysis, generate EXTREMELY DETAILED and COMPREHENSIVE workflow diagrams and schema for this project:

    Project Title: ${title}
    Project Description: ${description}
    
    Analysis Results:
    - Overall Score: ${analysis.score}/100
    - Features: 
      - ${featuresText}
    - Recommendations: 
      - ${recommendationsText}
    ${techStackText ? `- Recommended Tech Stack: ${techStackText}` : ''}

    Generate an ultra-comprehensive JSON response with THREE workflow types:

    1. TECHNICAL WORKFLOW - Exhaustive development process flow
    2. USER WORKFLOW - Complete user journey and interactions  
    3. SCHEMA DIAGRAM - Comprehensive database tables and relationships

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
              "dependencies": [],
              "deliverables": ["Repository structure", "Development environment", "CI/CD pipeline"],
              "resources": ["Senior DevOps Engineer", "Development Team Lead"],
              "risks": ["Environment inconsistency", "Integration issues"],
              "mitigationStrategies": ["Containerization", "Infrastructure as Code"],
              "acceptanceCriteria": ["CI/CD pipeline passes all tests", "All developers can run project locally"]
            }
          }
        ],
        "edges": [
          {
            "id": "e1",
            "source": "start",
            "target": "planning",
            "label": "Setup Complete",
            "type": "success",
            "description": "Project repository and environment ready for development",
            "conditions": ["CI/CD pipeline functional", "Development environments verified"],
            "documentation": "Link to setup documentation"
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
              "successMetrics": ["Page views", "Time on site", "Bounce rate"],
              "userPersona": "New potential customer exploring the solution",
              "userNeeds": ["Quick understanding of value proposition", "Easy navigation", "Clear next steps"],
              "emotionalState": ["Curious", "Evaluating", "Potentially skeptical"],
              "conversionGoals": ["Sign up for trial", "Contact sales", "Subscribe to newsletter"],
              "accessibilityRequirements": ["Screen reader compatible", "Keyboard navigable", "Color contrast compliant"],
              "designConsiderations": ["Prominent value proposition", "Clear CTA buttons", "Social proof elements"]
            }
          }
        ],
        "edges": [
          {
            "id": "e1",
            "source": "landing",
            "target": "signup",
            "label": "User Interested",
            "condition": "User clicks signup",
            "frequency": "50% of visitors",
            "optimizationOpportunities": ["A/B test CTA positioning", "Improve value proposition clarity"],
            "expectedTimeframe": "Within 30 seconds of landing",
            "fallbackPath": "To 'Learn More' or 'Documentation' pages"
          }
        ]
      },
      "schemaDiagram": {
        "entities": [
          {
            "name": "User",
            "description": "Stores all user account information and authentication details",
            "fields": [
              {
                "name": "id",
                "type": "uuid",
                "required": true,
                "description": "Unique identifier for the user account",
                "constraints": ["PRIMARY KEY", "NOT NULL"],
                "isPrimaryKey": true,
                "isForeignKey": false,
                "defaultValue": "uuid_generate_v4()",
                "indexType": "PRIMARY KEY",
                "validationRules": ["Must be a valid UUID"],
                "example": "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11"
              },
              {
                "name": "email",
                "type": "varchar(255)",
                "required": true,
                "description": "User's email address used for login and communications",
                "constraints": ["UNIQUE", "NOT NULL"],
                "isPrimaryKey": false,
                "isForeignKey": false,
                "validationRules": ["Must be a valid email format", "Case insensitive uniqueness check"],
                "indexType": "UNIQUE B-TREE",
                "example": "user@example.com"
              }
            ],
            "relationships": [
              {
                "target": "Project",
                "type": "ONE_TO_MANY",
                "description": "User can create and own multiple projects",
                "field": "id",
                "targetField": "user_id",
                "onDelete": "CASCADE",
                "onUpdate": "CASCADE",
                "businessRules": ["User must be verified before creating projects", "Maximum 10 active projects per user"]
              }
            ],
            "position": { "x": 100, "y": 100 },
            "indexes": [
              {
                "name": "idx_user_email",
                "fields": ["email"],
                "type": "BTREE",
                "unique": true
              },
              {
                "name": "idx_user_created_at",
                "fields": ["created_at"],
                "type": "BTREE",
                "unique": false
              }
            ],
            "triggers": [
              {
                "name": "user_after_insert",
                "timing": "AFTER INSERT",
                "operation": "Create default settings for new user"
              }
            ],
            "constraints": [
              {
                "name": "valid_email_check",
                "definition": "CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$')"
              }
            ],
            "partitioning": "None",
            "estimatedRowCount": "100,000 - 1,000,000",
            "cacheStrategy": "Cache frequently accessed user profiles",
            "dataRetentionPolicy": "Retain indefinitely, archive after 2 years of inactivity"
          }
        ],
        "relationships": [
          {
            "id": "r1",
            "source": "User",
            "target": "Project",
            "type": "ONE_TO_MANY",
            "label": "owns",
            "sourceField": "id",
            "targetField": "user_id",
            "cardinality": "1:N",
            "mandatorySource": true,
            "mandatoryTarget": true,
            "description": "Each user can own multiple projects, and each project must have exactly one owner",
            "businessRules": ["Only the owner can delete a project", "Owner can transfer ownership to another user"],
            "referentialIntegrity": {
              "onDelete": "CASCADE",
              "onUpdate": "CASCADE"
            },
            "documentation": "User to Project ownership relationship, defines access control and administrative rights"
          }
        ]
      }
    }

    TECHNICAL WORKFLOW REQUIREMENTS:
    
    - Include 10-15 highly detailed development phases
    - Each node MUST include ALL of the following exhaustive details:
      * label: Clear, concise name for the phase
      * description: Detailed explanation of the phase purpose
      * details: Comprehensive array of specific tasks in this phase
      * technologies: Specific technologies, frameworks, tools used in this phase
      * estimatedTime: Realistic timeframe with range (e.g., "3-5 days")
      * dependencies: IDs of phases that must be completed before this one
      * deliverables: Specific artifacts produced during this phase
      * resources: Types of team members or specific roles needed
      * risks: Potential issues or challenges that might arise
      * mitigationStrategies: Specific approaches to mitigate identified risks
      * acceptanceCriteria: Clear conditions that define when this phase is complete
    
    - Use varied node types: "input", "output", "default", "decision", "process", "subprocess", "service", "event"
    - Create complex edges with detailed labels, types, conditions, and documentation
    - Edge types must include: "success", "error", "conditional", "parallel", "retry", "timeout", "default"
    - Cover ALL development phases in detail:
      * Project Initiation & Planning
      * Requirements Gathering & Analysis
      * System Architecture Design
      * Database Design
      * Frontend Development Architecture
      * Backend Development Architecture
      * API Design & Development
      * Authentication & Authorization System
      * Core Feature Development
      * Integration Points
      * Testing Strategy (Unit, Integration, E2E)
      * Security Implementation
      * Performance Optimization
      * Deployment Pipeline
      * Monitoring & Observability
      * Maintenance & Support Plan
    
    USER WORKFLOW REQUIREMENTS:
    
    - Include 8-12 comprehensive user journey steps
    - Each node MUST include ALL of the following details:
      * label: Clear name of the user journey step
      * description: Detailed explanation of what happens in this step
      * userActions: Comprehensive array of all possible user interactions
      * systemResponses: Detailed array of how the system responds to each action
      * painPoints: Potential usability issues, frustrations, or obstacles
      * successMetrics: Specific KPIs to measure success at this step
      * userPersona: Description of the user at this stage (new/returning/etc.)
      * userNeeds: Specific user needs being addressed at this step
      * emotionalState: Likely emotional reactions during this step
      * conversionGoals: Specific actions you want users to take
      * accessibilityRequirements: Accessibility considerations for this step
      * designConsiderations: UX/UI design elements critical for this step
    
    - Cover ALL user journey phases in detail:
      * Discovery & Awareness
      * First Visit & Initial Impression
      * Registration/Signup Process
      * Onboarding Experience
      * Core Feature Usage
      * Advanced Feature Discovery
      * Account Management
      * Support & Help Seeking
      * Upgrade/Downgrade Paths
      * Renewal/Retention Touchpoints
      * Feedback Collection
      * Offboarding (if applicable)
    
    - Create complex edges showing all possible user paths with:
      * Detailed condition descriptions
      * Expected frequency/probability
      * Optimization opportunities
      * Expected timeframes
      * Fallback paths
    
    SCHEMA DIAGRAM REQUIREMENTS:
    
    - Generate 8-15 richly detailed entities tailored to the project's specific needs
    - Each entity MUST include:
      * Comprehensive name and description of purpose
      * Position coordinates for visual layout
      * Complete set of indexes, triggers, constraints, partitioning strategy
      * Estimated row count and data volume
      * Caching strategy and data retention policy
    
    - Each field MUST include ALL of these details:
      * name: Database column name
      * type: Precise database type with size/precision (varchar(255), numeric(10,2), etc.)
      * required: Boolean indicating whether null is allowed
      * description: Detailed purpose of the field
      * constraints: Array of all constraints (PRIMARY KEY, FOREIGN KEY, UNIQUE, NOT NULL, CHECK, etc.)
      * isPrimaryKey: Boolean flag for primary key fields
      * isForeignKey: Boolean flag for foreign key fields
      * references: For foreign keys, the referenced table.column
      * defaultValue: Default value or expression
      * indexType: Type of index if field is indexed
      * validationRules: Business validation rules
      * example: Example of valid data
    
    - Each relationship MUST include ALL of these details:
      * id: Unique identifier for the relationship
      * source: Source entity name
      * target: Target entity name
      * type: Relationship type (ONE_TO_ONE, ONE_TO_MANY, MANY_TO_MANY)
      * label: Descriptive name for the relationship
      * sourceField: Field in source entity
      * targetField: Field in target entity
      * cardinality: Formal cardinality notation (1:1, 1:N, N:M)
      * mandatorySource: Whether source must exist
      * mandatoryTarget: Whether target must exist
      * description: Detailed description of relationship purpose
      * businessRules: Business rules governing the relationship
      * referentialIntegrity: onDelete and onUpdate behaviors
      * documentation: Additional notes or explanation
    
    - Include ALL of these common entities with ALL required fields:
      * Users & Authentication
      * Profiles/Settings
      * Content/Data specific to project
      * Categories/Tags/Classifications
      * Activity/Logging
      * Notifications
      * Permissions/Roles
      * Audit Trails
      * Configurations
      * Relationships between entities
    
    - Apply advanced database design best practices:
      * Proper normalization (3NF or 4NF)
      * Appropriate denormalization for performance where needed
      * Effective indexing strategy
      * Partitioning strategy for large tables
      * Data integrity constraints
      * Performance optimization considerations
      * Security considerations at data level
    
    Make everything ULTRA-SPECIFIC to this project's unique requirements. Do not use generic examples.
    Generate data that is exhaustively detailed, technically accurate, and immediately implementable.
    Return only valid JSON with no additional text.
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
      
      try {
        return JSON.parse(jsonMatch[0])
      } catch (parseError) {
        console.error('Error parsing JSON response:', parseError)
        throw new Error('Invalid JSON format in AI response')
      }
    } catch (error) {
      console.error('Error generating workflow with AI:', error)
      // Fallback to mock data if AI fails
      return this.getMockWorkflow()
    }
  }

  private getMockAnalysis(): ProjectAnalysis {
    return {
      score: 85,
      summary: "This project demonstrates strong potential with an innovative approach to solving a real market need. The technical implementation is feasible with modern technologies, though some scaling challenges may arise as the user base grows. The market opportunity is substantial with limited direct competition in this specific niche. User experience will be critical to driving adoption, and the monetization strategy appears viable based on projected user value. Overall, this project has excellent prospects for success with proper execution and attention to the identified recommendations.",
      pillars: [
        { 
          name: "Technical Feasibility", 
          score: 80, 
          feedback: "The project is technically feasible using modern web technologies. The architecture should be designed with scalability in mind from the start. Most technical challenges have established solutions, though integration complexity may require careful planning.",
          strengths: [
            "Core functionality can be implemented with established technologies",
            "No cutting-edge research or unproven tech required",
            "Modular architecture will support incremental development",
            "Clear separation of concerns possible in the technical design"
          ],
          challenges: [
            "Real-time data synchronization across devices may present challenges",
            "Security implementation for sensitive user data requires careful design",
            "Integration with multiple third-party services increases complexity",
            "Potential performance bottlenecks at scale need early consideration"
          ],
          architectureRecommendations: [
            "Microservices architecture for core system components",
            "React/Next.js frontend with Node.js/Express backend",
            "MongoDB for flexible data schema with Redis caching layer",
            "Containerized deployment with Kubernetes for scalability"
          ],
          riskAssessment: {
            level: "medium",
            factors: [
              "Integration complexity with third-party services",
              "Data security and compliance requirements",
              "Performance at scale with large datasets"
            ],
            mitigations: [
              "Early integration testing with mock services",
              "Security review at architecture and implementation phases",
              "Performance testing with simulated load early in development"
            ]
          }
        },
        { 
          name: "Market Viability", 
          score: 85, 
          feedback: "Strong market opportunity with growing demand for this type of solution. The target audience is well-defined and accessible through established channels. Competition exists but has not fully addressed the specific pain points this project aims to solve.",
          targetAudience: [
            "Primary: Tech-savvy professionals aged 25-45 who need efficient workflow management",
            "Secondary: Small to medium businesses looking for cost-effective solutions",
            "Tertiary: Enterprise teams seeking specialized functionality not available in generic tools"
          ],
          marketSize: "The total addressable market is estimated at $3.5B with a serviceable obtainable market of approximately $500M growing at 15% annually",
          competitiveLandscape: [
            "Competitor A: Strong market presence but outdated UI and limited integration capabilities",
            "Competitor B: Modern solution but pricing that excludes small businesses",
            "Competitor C: Similar features but poor user experience and customer support",
            "Competitor D: New entrant with limited feature set and no established user base"
          ],
          differentiators: [
            "Unique approach to workflow automation not present in competing solutions",
            "Superior user experience with intuitive interface",
            "Flexible pricing model accessible to businesses of all sizes",
            "Advanced analytics capabilities beyond what competitors offer"
          ],
          goToMarketStrategy: [
            "Freemium model to drive initial adoption and word-of-mouth growth",
            "Content marketing focusing on specific use cases and pain points",
            "Strategic partnerships with complementary service providers",
            "Targeted digital advertising to key user segments"
          ],
          riskAssessment: {
            level: "low",
            factors: [
              "Established competitors with brand recognition",
              "Potential for larger companies to replicate features",
              "Market education required for innovative aspects"
            ],
            mitigations: [
              "Clear differentiation in marketing materials",
              "Rapid feature development to maintain competitive edge",
              "Building community and brand loyalty through exceptional support"
            ]
          }
        },
        { 
          name: "User Experience", 
          score: 90, 
          feedback: "The proposed user experience addresses critical pain points in existing solutions. The intuitive design and streamlined workflows will be a key differentiator. Mobile responsiveness and accessibility should be prioritized from the start.",
          userJourneyHighlights: [
            "Simplified onboarding with guided setup process",
            "Intuitive dashboard with personalized workflow suggestions",
            "Streamlined task management with minimal clicks",
            "Seamless collaboration features integrated into natural workflow"
          ],
          painPointsAddressed: [
            "Complex setup process in competing products solved with templates and wizards",
            "Confusing navigation replaced with context-aware interface",
            "Steep learning curve eliminated through progressive disclosure of features",
            "Poor mobile experience addressed with fully responsive design"
          ],
          accessibilityConsiderations: [
            "WCAG 2.1 AA compliance for all core features",
            "Screen reader compatibility throughout the application",
            "Keyboard navigation for all interactive elements",
            "Color contrast and text sizing meeting accessibility standards"
          ],
          userRetentionStrategies: [
            "Regular feature updates based on user feedback",
            "In-app guides for advanced features",
            "Email nurture campaign highlighting value-adding use cases",
            "Loyalty rewards for long-term users and referrals"
          ],
          userResearchRecommendations: [
            "Usability testing with representative users before launch",
            "A/B testing of key conversion flows",
            "User interviews to validate pain points and solutions",
            "Analytics implementation to track user behavior patterns"
          ],
          riskAssessment: {
            level: "low",
            factors: [
              "Feature bloat affecting simplicity of interface",
              "Different user segments having conflicting needs",
              "Mobile experience compromises due to feature complexity"
            ],
            mitigations: [
              "Rigorous feature prioritization process",
              "Persona-based design validation",
              "Mobile-first design approach for core features"
            ]
          }
        },
        { 
          name: "Scalability", 
          score: 75, 
          feedback: "The solution architecture supports horizontal scaling for most components. Database scaling may become a challenge with very large datasets. Infrastructure costs will need careful management as the user base grows. A phased scaling plan is recommended.",
          technicalScalability: [
            "Stateless application servers allow horizontal scaling",
            "Caching strategy for frequently accessed data",
            "Asynchronous processing for background tasks",
            "CDN integration for static assets and global delivery"
          ],
          businessScalability: [
            "Pricing model that scales with customer value",
            "Automated customer onboarding to support rapid growth",
            "Documentation and knowledge base to reduce support burden",
            "Partner ecosystem to extend reach and capabilities"
          ],
          resourceRequirements: [
            "DevOps expertise for infrastructure management",
            "Customer success team scaling with user base",
            "Engineering team expansion for feature development",
            "Marketing resources for growth initiatives"
          ],
          growthLimitations: [
            "Database performance at high scale - can be addressed with sharding",
            "Support team bandwidth - mitigated with self-service tools",
            "Feature development velocity - managed with modular architecture",
            "Market saturation in primary segments - expansion to adjacent markets"
          ],
          internationalExpansion: [
            "Localization framework from initial architecture",
            "Regional data storage for compliance and performance",
            "Cultural adaptation of UX for key markets",
            "Region-specific pricing and payment methods"
          ],
          riskAssessment: {
            level: "medium",
            factors: [
              "Rapid growth outpacing infrastructure planning",
              "Technical debt accumulation affecting scalability",
              "Cost management at scale affecting profitability"
            ],
            mitigations: [
              "Regular scalability testing and planning",
              "Technical debt reduction as part of regular sprint work",
              "Cost optimization as a continuous process"
            ]
          }
        },
        { 
          name: "Monetization Potential", 
          score: 85, 
          feedback: "Multiple viable revenue streams with a clear path to monetization. The tiered subscription model aligns well with customer value perception. Enterprise upsell potential is significant. Payback period on customer acquisition is favorable based on projected lifetime value.",
          revenueModels: [
            "Tiered subscription model based on features and usage limits",
            "Enterprise licensing with custom terms and integrations",
            "Marketplace for third-party extensions with revenue sharing",
            "Professional services for customization and implementation"
          ],
          pricingStrategies: [
            "Freemium tier for individual users with conversion path to paid",
            "Team and business tiers with per-user pricing",
            "Enterprise tier with custom pricing based on specific needs",
            "Annual discount to improve cash flow and reduce churn"
          ],
          customerAcquisitionCost: "Estimated CAC of $200-300 per customer with optimizations possible through content marketing and referral programs",
          lifetimeValue: "Projected LTV of $1500-2500 based on 18-24 month average subscription duration and expansion revenue",
          breakEvenAnalysis: "Expected to reach break-even at 18 months with 5,000 paying customers based on current cost projections",
          riskAssessment: {
            level: "low",
            factors: [
              "Price sensitivity in small business segment",
              "Churn risk if core value not quickly realized",
              "Competitive pricing pressure"
            ],
            mitigations: [
              "Value-based pricing with clear ROI demonstration",
              "Strong onboarding to ensure early value delivery",
              "Feature differentiation to reduce direct price comparison"
            ]
          }
        },
        {
          name: "Security & Compliance",
          score: 80,
          feedback: "The project has good awareness of security requirements. Implementation of industry standard security practices will be essential. Compliance with relevant regulations has been considered in the architecture. Regular security audits should be scheduled.",
          securityConsiderations: [
            "Authentication system with MFA and session management",
            "Encryption of sensitive data in transit and at rest",
            "Regular dependency updates and vulnerability scanning",
            "Secure API design with proper authorization checks"
          ],
          complianceRequirements: [
            "GDPR compliance for handling European user data",
            "SOC 2 certification roadmap for enterprise customers",
            "CCPA compliance for California residents",
            "Industry-specific requirements based on target markets"
          ],
          dataPrivacyApproach: [
            "Minimizing collection of personal data",
            "Clear user consent processes and privacy controls",
            "Data retention policies and automatic purging",
            "Transparency in data usage and processing"
          ],
          securityTestingRecommendations: [
            "Regular penetration testing by third-party experts",
            "Automated security scanning in CI/CD pipeline",
            "Threat modeling during feature design phase",
            "Bug bounty program for responsible disclosure"
          ],
          riskAssessment: {
            level: "medium",
            factors: [
              "Handling of sensitive user data",
              "Integration security with third-party services",
              "Evolving compliance landscape"
            ],
            mitigations: [
              "Security review as part of development process",
              "Careful vetting and monitoring of integrations",
              "Regular compliance reviews and updates"
            ]
          }
        }
      ],
      advantages: [
        {
          title: "Innovative Approach to User Workflow",
          description: "The project introduces a novel approach to workflow management that significantly reduces the learning curve and time-to-value. By focusing on contextual awareness and predictive suggestions, users can achieve their goals with fewer steps than competing solutions. This advantage is particularly valuable for new users and can drive both adoption and retention."
        },
        {
          title: "Comprehensive Integration Ecosystem",
          description: "Unlike competitors that offer limited integrations, this solution provides a robust ecosystem of connections to popular tools and services. The planned integration framework allows for both native integrations and user-created connections, creating a platform effect that increases value over time and raises switching costs for users."
        },
        {
          title: "Superior Data Analytics Capabilities",
          description: "The advanced analytics engine provides insights that competitors don't offer, allowing users to optimize their workflows based on actual usage patterns. This data-driven approach creates tangible ROI for business users and helps individuals improve productivity with personalized recommendations backed by their own behavior."
        },
        {
          title: "Flexible Architecture for Customization",
          description: "The modular design allows for extensive customization without custom development. This addresses a key pain point in enterprise adoption where specific workflows need adaptation. The template system and rule engine enable users to tailor the system to their needs while maintaining upgradeability, unlike hardcoded customizations."
        },
        {
          title: "Optimized Mobile Experience",
          description: "While competitors offer mobile apps as an afterthought, this solution is designed with a mobile-first approach for key workflows. The offline capabilities and synchronized experience across devices enable true productivity for distributed and remote teams, addressing the reality of modern work patterns."
        }
      ],
      disadvantages: [
        {
          title: "Initial Learning Curve for Advanced Features",
          description: "Despite efforts to simplify the interface, power users will still face a learning curve for advanced features. This can be mitigated through contextual help, interactive tutorials, and a well-designed progressive disclosure system that introduces complexity only when needed."
        },
        {
          title: "Development Complexity and Timeline",
          description: "The ambitious feature set will require significant development resources and time to implement fully. Risk of scope creep is substantial. This can be addressed by adopting a phased implementation approach with a clear MVP definition and ruthless prioritization of features based on user value."
        },
        {
          title: "Integration Maintenance Overhead",
          description: "The extensive integration ecosystem creates ongoing maintenance requirements as third-party APIs evolve. Each integration adds potential points of failure. This can be managed through a robust monitoring system, automated testing of integrations, and a clear deprecation policy for problematic or underused integrations."
        },
        {
          title: "Pricing Perception Challenges",
          description: "The value-based pricing model may face resistance in markets accustomed to simpler or freemium tools. Some potential customers may not immediately recognize the ROI. This can be countered with targeted case studies, ROI calculators, and a limited freemium tier that demonstrates core value before conversion."
        },
        {
          title: "Data Migration Barriers to Adoption",
          description: "Users of competing systems face friction in migrating existing data and workflows, creating a barrier to switching. This can be addressed by developing comprehensive migration tools, providing migration services for larger clients, and creating clear documentation for common migration scenarios."
        }
      ],
      features: [
        {
          title: "Intelligent Workflow Automation",
          description: "AI-powered system that learns from user behavior to automate repetitive tasks and suggest optimizations to workflows. Includes customizable triggers, conditions, and actions with a visual builder interface.",
          priority: "must-have",
          complexity: "high",
          userImpact: "high"
        },
        {
          title: "Cross-Platform Synchronization",
          description: "Seamless experience across web, desktop, and mobile applications with real-time synchronization and offline capability. Changes made on any device are reflected everywhere once connectivity is restored.",
          priority: "must-have",
          complexity: "medium",
          userImpact: "high"
        },
        {
          title: "Advanced Analytics Dashboard",
          description: "Comprehensive analytics showing productivity metrics, workflow efficiencies, bottlenecks, and trend analysis. Includes customizable reports, export options, and scheduled delivery.",
          priority: "should-have",
          complexity: "medium",
          userImpact: "medium"
        },
        {
          title: "Integration Ecosystem",
          description: "Pre-built connections to popular productivity tools, project management systems, and communication platforms. Includes API and webhook support for custom integrations.",
          priority: "must-have",
          complexity: "high",
          userImpact: "high"
        },
        {
          title: "Collaborative Workspaces",
          description: "Team-based workspaces with role-based permissions, shared workflows, and collaborative editing capabilities. Includes activity feeds, commenting, and notification systems.",
          priority: "should-have",
          complexity: "medium",
          userImpact: "high"
        },
        {
          title: "Template Marketplace",
          description: "Library of pre-built workflow templates for common use cases that users can import and customize. Includes both official and community-contributed templates with rating system.",
          priority: "nice-to-have",
          complexity: "low",
          userImpact: "medium"
        },
        {
          title: "Natural Language Processing Interface",
          description: "Ability to create and modify workflows using natural language commands. System interprets user intent and translates it into workflow actions.",
          priority: "nice-to-have",
          complexity: "high",
          userImpact: "medium"
        },
        {
          title: "Enterprise Security Controls",
          description: "Advanced security features including SSO integration, role-based access control, audit logging, and compliance reporting. Includes data loss prevention and sensitive data handling.",
          priority: "should-have",
          complexity: "medium",
          userImpact: "high"
        }
      ],
      recommendations: [
        {
          title: "Develop Phased MVP Approach",
          description: "Create a clear roadmap with phased deliverables, starting with a focused MVP that delivers core value. This approach reduces time-to-market and allows for user feedback to inform subsequent development phases.",
          implementationSteps: [
            "Define core feature set that delivers minimum viable value",
            "Create detailed specifications for MVP features",
            "Establish metrics to evaluate MVP success",
            "Develop feedback collection mechanisms"
          ],
          expectedOutcome: "Faster time to market with a product that addresses core user needs, while establishing a foundation for future development based on actual user feedback rather than assumptions.",
          timeframe: "short-term"
        },
        {
          title: "Conduct Competitive User Testing",
          description: "Perform structured usability testing comparing your solution against key competitors with actual target users. This will identify specific pain points and advantages to emphasize in both development and marketing.",
          implementationSteps: [
            "Identify 3-5 key competitors for comparison",
            "Design task-based scenarios covering core user journeys",
            "Recruit 8-12 participants matching target user profiles",
            "Document findings and prioritize improvements"
          ],
          expectedOutcome: "Clear understanding of competitive advantages and user experience gaps, resulting in targeted improvements that directly address user needs and differentiate from competitors.",
          timeframe: "short-term"
        },
        {
          title: "Implement Early Adopter Program",
          description: "Create a structured early adopter program that provides select users with pre-release access in exchange for regular feedback and usage data. This creates a feedback loop and develops product champions.",
          implementationSteps: [
            "Define criteria for early adopter selection",
            "Create feedback collection framework",
            "Develop incentives for participation",
            "Establish communication channels for direct interaction"
          ],
          expectedOutcome: "Engaged user base providing regular feedback, identification of issues before wide release, and development of case studies and testimonials for marketing.",
          timeframe: "medium-term"
        },
        {
          title: "Develop Integration Certification Program",
          description: "Create a formal certification process for third-party integrations to ensure quality and reliability. This will scale the integration ecosystem while maintaining user experience standards.",
          implementationSteps: [
            "Define technical requirements for integrations",
            "Create testing and certification process",
            "Develop documentation and support resources for integration partners",
            "Establish partner tiers with appropriate benefits"
          ],
          expectedOutcome: "Growing ecosystem of reliable integrations that extend product functionality while maintaining quality standards and user experience.",
          timeframe: "long-term"
        },
        {
          title: "Implement Modular Architecture",
          description: "Design the system with a modular, microservices-based architecture to support independent scaling, development, and deployment of components. This approach will support long-term growth and flexibility.",
          implementationSteps: [
            "Define service boundaries and interfaces",
            "Establish shared infrastructure and communication patterns",
            "Implement CI/CD pipeline supporting independent deployment",
            "Create monitoring and observability framework"
          ],
          expectedOutcome: "Scalable, maintainable system that supports rapid iteration and independent scaling of components based on usage patterns.",
          timeframe: "medium-term"
        }
      ],
      technicalAnalysis: {
        recommendedStack: {
          frontend: [
            "React with TypeScript for type safety and developer productivity",
            "Next.js for server-side rendering and improved performance",
            "TailwindCSS for consistent, responsive design system"
          ],
          backend: [
            "Node.js with Express for API services, optimized for JavaScript developers",
            "GraphQL for flexible data querying and reduced over-fetching",
            "Microservices architecture for scalability and team autonomy"
          ],
          database: [
            "MongoDB for flexible schema and document-oriented data model",
            "Redis for caching and real-time features"
          ],
          devops: [
            "Docker and Kubernetes for containerization and orchestration",
            "GitHub Actions for CI/CD automation",
            "Terraform for infrastructure as code"
          ],
          security: [
            "Auth0 for authentication and authorization",
            "OWASP security practices implementation",
            "Regular security audits and penetration testing"
          ]
        },
        architecturePatterns: [
          "Microservices for scalability and independent service deployment",
          "Event-driven architecture for loose coupling between components",
          "CQRS pattern for separating read and write operations"
        ],
        scalingStrategy: "Horizontal scaling of stateless services with auto-scaling based on load metrics. Database sharding for data growth with read replicas for query performance. CDN for static assets and edge caching for global performance.",
        performanceConsiderations: [
          "Implement efficient data access patterns and indexing",
          "Optimize frontend bundle size and loading strategy",
          "Use caching at multiple levels (browser, CDN, application, database)"
        ],
        securityConsiderations: [
          "Regular security audits and vulnerability scanning",
          "Principle of least privilege for all system components",
          "Data encryption both in transit and at rest"
        ]
      },
      marketAnalysis: {
        targetMarket: "Primary focus on knowledge workers and teams in technology, marketing, and professional services sectors. Secondary focus on SMBs with 10-250 employees across industries. Initial geographic focus on North America and Western Europe with English language support.",
        competitiveLandscape: "The market has established players with broader feature sets but less specialized functionality. Key competitors include established workflow platforms targeting enterprises with complex needs and simpler tools focusing on individuals and small teams. A gap exists for mid-market solutions that balance power and usability.",
        marketTrends: [
          "Increasing demand for no-code/low-code automation solutions",
          "Growing preference for integrated workspace tools over point solutions",
          "Rising importance of mobile and remote work capabilities",
          "Shift toward AI-assisted productivity and decision making"
        ],
        growthOpportunities: [
          "Vertical-specific templates and workflows for industries like marketing, software development, and professional services",
          "Enterprise expansion through dedicated account management and custom implementation services",
          "Geographic expansion through localization and region-specific features",
          "Integration marketplace with revenue sharing model"
        ],
        entryBarriers: [
          "User switching costs and data migration challenges - address with import tools and onboarding assistance",
          "Enterprise procurement processes - mitigate with security certifications and compliance documentation",
          "Awareness in crowded market - overcome with focused content marketing and targeted advertising"
        ]
      },
      financialAnalysis: {
        developmentCosts: "Initial development through MVP: $350,000-450,000. Ongoing development: $40,000-60,000 monthly depending on team size and feature velocity.",
        operationalCosts: "Cloud infrastructure: $8,000-15,000 monthly scaling with usage. Customer support and success: $10,000-30,000 monthly. Marketing and sales: $20,000-40,000 monthly.",
        revenueProjections: "Year 1: $300,000-500,000. Year 2: $1.2M-1.8M. Year 3: $3M-5M based on projected user growth and average revenue per user of $20-50 monthly.",
        breakevenAnalysis: "Expected breakeven at 18-24 months with 5,000-8,000 paying users depending on average revenue per user and operational cost management.",
        fundingRequirements: "Seed round of $1.5M-2M to reach MVP and initial market traction. Series A of $5M-8M for scaling team and market expansion.",
        roi: "Projected 3-year ROI of 150-200% based on revenue projections and total investment. Potential exit valuation of 5-8x ARR after 4-5 years."
      }
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
