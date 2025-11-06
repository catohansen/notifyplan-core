/**
 * WorkflowEngine - Multi-step notification workflows
 * 
 * Standalone version for NotifyPlan 2.0 SaaS
 */

import type { DatabaseAdapter } from './interfaces'
import type { NotificationOrchestrator } from './orchestrator'
import type { NotificationPayload, NotificationPriority } from './types'

export type WorkflowStepType = 'send' | 'delay' | 'condition' | 'escalate' | 'complete'

export interface WorkflowStep {
  id: string
  type: WorkflowStepType
  config: Record<string, any>
  nextStepId?: string
  condition?: (context: WorkflowContext) => boolean | Promise<boolean>
}

export interface WorkflowContext {
  userId: string
  workflowId: string
  stepId: string
  data: Record<string, any>
  history: WorkflowStepHistory[]
  startedAt: Date
}

export interface WorkflowStepHistory {
  stepId: string
  executedAt: Date
  success: boolean
  result?: any
  error?: string
}

export interface NotificationWorkflow {
  id: string
  name: string
  description: string
  trigger: WorkflowTrigger
  steps: WorkflowStep[]
  enabled: boolean
}

export interface WorkflowTrigger {
  type: 'immediate' | 'scheduled' | 'event' | 'condition'
  config: Record<string, any>
}

export class WorkflowEngine {
  private db: DatabaseAdapter
  private orchestrator: NotificationOrchestrator
  private activeWorkflows: Map<string, WorkflowContext> = new Map()

  constructor(db: DatabaseAdapter, orchestrator: NotificationOrchestrator) {
    this.db = db
    this.orchestrator = orchestrator
    // Start workflow processor
    this.startWorkflowProcessor()
  }

  /**
   * Start a notification workflow
   */
  async startWorkflow(
    userId: string,
    workflow: NotificationWorkflow
  ): Promise<string> {
    try {
      const workflowId = `workflow_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      
      const context: WorkflowContext = {
        userId,
        workflowId,
        stepId: workflow.steps[0]?.id || '',
        data: {},
        history: [],
        startedAt: new Date()
      }

      this.activeWorkflows.set(workflowId, context)

      // Execute first step
      if (workflow.steps[0]) {
        await this.executeStep(workflowId, workflow.steps[0], context, workflow)
      }

      return workflowId
    } catch (error) {
      console.error('Error starting workflow:', error)
      throw error
    }
  }

  /**
   * Execute a workflow step
   */
  private async executeStep(
    workflowId: string,
    step: WorkflowStep,
    context: WorkflowContext,
    workflow: NotificationWorkflow
  ): Promise<void> {
    try {
      const startTime = new Date()
      let success = false
      let result: any = null
      let error: string | undefined

      try {
        switch (step.type) {
          case 'send':
            result = await this.executeSendStep(step, context)
            success = true
            break

          case 'delay':
            await this.executeDelayStep(step, context)
            success = true
            break

          case 'condition':
            result = await this.executeConditionStep(step, context)
            success = true
            break

          case 'escalate':
            result = await this.executeEscalateStep(step, context)
            success = true
            break

          case 'complete':
            await this.executeCompleteStep(step, context)
            success = true
            break
        }
      } catch (err) {
        error = (err as Error).message
        success = false
      }

      // Record step execution
      context.history.push({
        stepId: step.id,
        executedAt: startTime,
        success,
        result,
        error
      })

      // Update context
      context.stepId = step.nextStepId || ''
      this.activeWorkflows.set(workflowId, context)

      // Execute next step if successful and next step exists
      if (success && step.nextStepId) {
        const nextStep = workflow.steps.find(s => s.id === step.nextStepId)
        if (nextStep) {
          // Check condition if present
          if (step.condition) {
            const conditionResult = await step.condition(context)
            if (conditionResult) {
              await this.executeStep(workflowId, nextStep, context, workflow)
            }
          } else {
            await this.executeStep(workflowId, nextStep, context, workflow)
          }
        }
      }
    } catch (error) {
      console.error('Error executing workflow step:', error)
      throw error
    }
  }

  /**
   * Execute send step
   */
  private async executeSendStep(
    step: WorkflowStep,
    context: WorkflowContext
  ): Promise<any> {
    const payload: NotificationPayload = {
      userId: context.userId,
      type: step.config.type || 'system',
      title: step.config.title || 'Notification',
      message: step.config.message || '',
      priority: step.config.priority || 'medium',
      channels: step.config.channels,
      data: {
        ...step.config.data,
        workflowId: context.workflowId,
        stepId: step.id
      }
    }

    return await this.orchestrator.send(payload)
  }

  /**
   * Execute delay step
   */
  private async executeDelayStep(
    step: WorkflowStep,
    context: WorkflowContext
  ): Promise<void> {
    const delayMs = step.config.delay || 0
    
    if (delayMs > 0) {
      await new Promise(resolve => setTimeout(resolve, delayMs))
    }
  }

  /**
   * Execute condition step
   */
  private async executeConditionStep(
    step: WorkflowStep,
    context: WorkflowContext
  ): Promise<boolean> {
    if (step.condition) {
      return await step.condition(context)
    }
    return true
  }

  /**
   * Execute escalate step
   */
  private async executeEscalateStep(
    step: WorkflowStep,
    context: WorkflowContext
  ): Promise<any> {
    // Increase priority
    const currentPriority = context.data.priority || 'medium'
    const priorities: NotificationPriority[] = ['low', 'medium', 'high', 'urgent']
    const currentIndex = priorities.indexOf(currentPriority as NotificationPriority)
    const nextPriority = priorities[Math.min(currentIndex + 1, priorities.length - 1)] as NotificationPriority

    context.data.priority = nextPriority

    // Send escalated notification
    const payload: NotificationPayload = {
      userId: context.userId,
      type: step.config.type || 'system',
      title: `[ESKALERT] ${step.config.title || 'Notification'}`,
      message: step.config.message || '',
      priority: nextPriority,
      channels: ['email', 'sms', 'push'], // Escalated notifications use all channels
      data: {
        ...step.config.data,
        workflowId: context.workflowId,
        stepId: step.id,
        escalated: true
      }
    }

    return await this.orchestrator.send(payload)
  }

  /**
   * Execute complete step
   */
  private async executeCompleteStep(
    step: WorkflowStep,
    context: WorkflowContext
  ): Promise<void> {
    // Mark workflow as complete
    this.activeWorkflows.delete(context.workflowId)
  }

  /**
   * Start workflow processor (runs periodically)
   */
  private startWorkflowProcessor(): void {
    // Process workflows every minute
    setInterval(async () => {
      await this.processWorkflows()
    }, 60 * 1000)
  }

  /**
   * Process active workflows
   */
  private async processWorkflows(): Promise<void> {
    for (const [workflowId, context] of this.activeWorkflows.entries()) {
      try {
        // Check if workflow has timed out
        const timeout = 24 * 60 * 60 * 1000 // 24 hours
        if (Date.now() - context.startedAt.getTime() > timeout) {
          this.activeWorkflows.delete(workflowId)
          continue
        }

        // Process workflow (check for scheduled steps, etc.)
        // This would check for delayed steps that are ready to execute
      } catch (error) {
        console.error(`Error processing workflow ${workflowId}:`, error)
      }
    }
  }

  /**
   * Get workflow status
   */
  getWorkflowStatus(workflowId: string): WorkflowContext | null {
    return this.activeWorkflows.get(workflowId) || null
  }

  /**
   * Cancel workflow
   */
  cancelWorkflow(workflowId: string): boolean {
    return this.activeWorkflows.delete(workflowId)
  }
}

