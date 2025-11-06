/**
 * NotifyPlan Core - Main export
 * Standalone notification system for SaaS
 */

export * from './types'
export * from './interfaces'
export * from './orchestrator'
export { DigestEngine } from './digest'
export { WorkflowEngine } from './workflow'
export { CompatibilityLayer } from './compatibility'
export type { VersionInfo, CompatibilityResult } from './compatibility'

