/**
 * Shared types for NotifyPlan Core
 */

export type NotificationChannel = 'email' | 'sms' | 'push' | 'inapp'
export type NotificationPriority = 'low' | 'medium' | 'high' | 'urgent'
export type NotificationType = 
  | 'bill_due' 
  | 'budget_alert' 
  | 'debt_reminder'
  | 'achievement'
  | 'score_improvement'
  | 'challenge'
  | 'reminder'
  | 'system'
  | 'admin'
  | string // Allow custom types

export interface NotificationPayload {
  userId: string
  organizationId?: string
  projectId?: string
  type: NotificationType
  title: string
  message: string
  priority?: NotificationPriority
  channels?: NotificationChannel[]
  data?: Record<string, any>
  scheduledAt?: Date
  expiresAt?: Date
}

export interface NotificationResult {
  success: boolean
  channels: {
    channel: NotificationChannel
    success: boolean
    error?: string
  }[]
  notificationId?: string
}

export interface UserNotificationPreferences {
  email: boolean
  sms: boolean
  push: boolean
  inapp: boolean
}

