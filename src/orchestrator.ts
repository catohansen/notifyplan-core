/**
 * NotificationOrchestrator - Multi-channel notification routing
 * 
 * Standalone version for NotifyPlan 2.0 SaaS
 * Uses adapters for database, email, SMS, and push services
 */

import type { 
  DatabaseAdapter, 
  EmailAdapter, 
  SMSAdapter, 
  PushAdapter 
} from './interfaces'
import type {
  NotificationPayload,
  NotificationResult,
  NotificationChannel,
  NotificationPriority,
  NotificationType,
  UserNotificationPreferences
} from './types'

export class NotificationOrchestrator {
  private static instance: NotificationOrchestrator | null = null
  private db: DatabaseAdapter
  private email: EmailAdapter
  private sms: SMSAdapter
  private push?: PushAdapter

  private constructor(
    db: DatabaseAdapter,
    email: EmailAdapter,
    sms: SMSAdapter,
    push?: PushAdapter
  ) {
    this.db = db
    this.email = email
    this.sms = sms
    this.push = push
  }

  /**
   * Create new instance (not singleton for multi-tenant)
   */
  public static create(
    db: DatabaseAdapter,
    email: EmailAdapter,
    sms: SMSAdapter,
    push?: PushAdapter
  ): NotificationOrchestrator {
    return new NotificationOrchestrator(db, email, sms, push)
  }

  /**
   * Get singleton instance (for backward compatibility)
   */
  public static getInstance(
    db?: DatabaseAdapter,
    email?: EmailAdapter,
    sms?: SMSAdapter,
    push?: PushAdapter
  ): NotificationOrchestrator {
    if (!NotificationOrchestrator.instance) {
      if (!db || !email || !sms) {
        throw new Error('NotificationOrchestrator requires adapters. Use create() method.')
      }
      NotificationOrchestrator.instance = new NotificationOrchestrator(db, email, sms, push)
    }
    return NotificationOrchestrator.instance
  }

  /**
   * Send notification through optimal channels
   */
  async send(payload: NotificationPayload): Promise<NotificationResult> {
    try {
      // Get user preferences
      const userPreferences = await this.getUserPreferences(payload.userId)
      
      // Determine optimal channels
      const channels = payload.channels || this.determineChannels(
        payload.type,
        payload.priority || 'medium',
        userPreferences
      )

      // Create notification record in database
      const notification = await this.db.notification.create({
        userId: payload.userId,
        organizationId: payload.organizationId,
        projectId: payload.projectId,
        type: payload.type,
        title: payload.title,
        message: payload.message,
        read: false,
        scheduledAt: payload.scheduledAt || new Date(),
        sentAt: null,
        createdAt: new Date()
      })

      // Send through each channel
      const results = await Promise.allSettled(
        channels.map(channel => this.sendToChannel(channel, payload, notification.id))
      )

      // Update notification with sent status
      const sentAt = results.some(r => r.status === 'fulfilled') ? new Date() : null
      await this.db.notification.update({
        where: { id: notification.id },
        data: { sentAt }
      })

      // Format results
      const channelResults = results.map((result, index) => ({
        channel: channels[index],
        success: result.status === 'fulfilled',
        error: result.status === 'rejected' ? (result.reason as Error).message : undefined
      }))

      return {
        success: channelResults.some(r => r.success),
        channels: channelResults,
        notificationId: notification.id
      }
    } catch (error) {
      console.error('Error orchestrating notification:', error)
      return {
        success: false,
        channels: [],
        notificationId: undefined
      }
    }
  }

  /**
   * Determine optimal channels based on type and priority
   */
  private determineChannels(
    type: NotificationType,
    priority: NotificationPriority,
    preferences: UserNotificationPreferences
  ): NotificationChannel[] {
    const channels: NotificationChannel[] = []

    // Always include in-app notification
    channels.push('inapp')

    // High priority notifications get multiple channels
    if (priority === 'urgent' || priority === 'high') {
      if (preferences.email) channels.push('email')
      if (preferences.sms && (priority === 'urgent' || type === 'bill_due')) {
        channels.push('sms')
      }
      if (preferences.push) channels.push('push')
    }

    // Medium priority - email + push
    if (priority === 'medium') {
      if (preferences.email) channels.push('email')
      if (preferences.push) channels.push('push')
    }

    // Low priority - only email
    if (priority === 'low') {
      if (preferences.email) channels.push('email')
    }

    // Type-specific routing
    switch (type) {
      case 'bill_due':
      case 'debt_reminder':
        // Financial alerts always get email + push
        if (preferences.email && !channels.includes('email')) channels.push('email')
        if (preferences.push && !channels.includes('push')) channels.push('push')
        break
      
      case 'achievement':
      case 'score_improvement':
        // Achievements get push for instant gratification
        if (preferences.push && !channels.includes('push')) channels.push('push')
        break
      
      case 'reminder':
        // Reminders get email for persistence
        if (preferences.email && !channels.includes('email')) channels.push('email')
        break
    }

    return channels
  }

  /**
   * Send notification to specific channel
   */
  private async sendToChannel(
    channel: NotificationChannel,
    payload: NotificationPayload,
    notificationId: string
  ): Promise<void> {
    switch (channel) {
      case 'email':
        await this.sendEmail(payload)
        break
      
      case 'sms':
        await this.sendSMS(payload)
        break
      
      case 'push':
        if (this.push) {
          await this.sendPush(payload)
        }
        break
      
      case 'inapp':
        // Already created in database
        break
    }
  }

  /**
   * Send email notification
   */
  private async sendEmail(payload: NotificationPayload): Promise<void> {
    try {
      const user = await this.db.user.findUnique({
        where: { id: payload.userId }
      })

      if (!user?.email) {
        throw new Error('User email not found')
      }

      // Map notification type to email template
      switch (payload.type) {
        case 'bill_due':
          await this.email.sendBillReminder(
            user.email,
            user.name || 'User',
            {
              title: payload.title,
              amount: payload.data?.amount || 0,
              dueDate: payload.data?.dueDate ? new Date(payload.data.dueDate) : new Date()
            }
          )
          break
        
        case 'achievement':
          await this.email.sendMotivationalEmail(
            user.email,
            user.name || 'User',
            {
              title: payload.title,
              description: payload.message
            }
          )
          break
        
        default:
          // Generic notification email
          await this.email.sendNotificationEmail(
            user.email,
            payload.title,
            payload.message
          )
      }
    } catch (error) {
      console.error('Error sending email notification:', error)
      throw error
    }
  }

  /**
   * Send SMS notification
   */
  private async sendSMS(payload: NotificationPayload): Promise<void> {
    try {
      const user = await this.db.user.findUnique({
        where: { id: payload.userId }
      })

      if (!user?.phone) {
        throw new Error('User phone not found')
      }

      // Format SMS message (max 160 chars)
      const smsMessage = `${payload.title}: ${payload.message}`.substring(0, 160)

      const result = await this.sms.sendSMS(user.phone, smsMessage)
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to send SMS')
      }
    } catch (error) {
      console.error('Error sending SMS notification:', error)
      throw error
    }
  }

  /**
   * Send push notification
   */
  private async sendPush(payload: NotificationPayload): Promise<void> {
    if (!this.push) {
      throw new Error('Push adapter not configured')
    }

    try {
      // Get user's push subscription from database
      const user = await this.db.user.findUnique({
        where: { id: payload.userId }
      })

      if (!user?.pushSubscription) {
        throw new Error('User push subscription not found')
      }

      await this.push.sendPush(
        user.pushSubscription,
        {
          title: payload.title,
          body: payload.message,
          icon: payload.data?.icon,
          badge: payload.data?.badge,
          data: {
            type: payload.type,
            notificationId: payload.data?.notificationId,
            ...payload.data
          }
        }
      )
    } catch (error) {
      console.error('Error sending push notification:', error)
      throw error
    }
  }

  /**
   * Get user notification preferences
   */
  private async getUserPreferences(userId: string): Promise<UserNotificationPreferences> {
    try {
      const user = await this.db.user.findUnique({
        where: { id: userId }
      })

      if (!user) {
        return this.getDefaultPreferences()
      }

      // Parse notification preferences from user settings
      // For now, return defaults based on available contact methods
      return {
        email: !!user.email,
        sms: !!user.phone,
        push: !!user.pushSubscription,
        inapp: true
      }
    } catch (error) {
      console.error('Error getting user preferences:', error)
      return this.getDefaultPreferences()
    }
  }

  /**
   * Get default notification preferences
   */
  private getDefaultPreferences(): UserNotificationPreferences {
    return {
      email: true,
      sms: false,
      push: true,
      inapp: true
    }
  }
}

