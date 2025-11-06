/**
 * DigestEngine - Combines multiple notifications into digest summaries
 * 
 * Standalone version for NotifyPlan 2.0 SaaS
 */

import type { DatabaseAdapter } from './interfaces'
import type { NotificationType, NotificationChannel } from './types'
import type { NotificationOrchestrator } from './orchestrator'

export interface DigestConfig {
  enabled: boolean
  maxNotifications: number
  timeWindow: number // minutes
  groupBy: 'type' | 'priority' | 'category'
  channels: NotificationChannel[]
}

export interface DigestGroup {
  type: NotificationType
  count: number
  notifications: Array<{
    id: string
    type: NotificationType
    title: string
    message: string
    createdAt: Date
  }>
  summary: string
}

export class DigestEngine {
  private db: DatabaseAdapter
  private orchestrator: NotificationOrchestrator
  private config: DigestConfig

  constructor(
    db: DatabaseAdapter,
    orchestrator: NotificationOrchestrator,
    config?: Partial<DigestConfig>
  ) {
    this.db = db
    this.orchestrator = orchestrator
    this.config = {
      enabled: true,
      maxNotifications: 5,
      timeWindow: 60, // 1 hour
      groupBy: 'type',
      channels: ['email', 'inapp'],
      ...config
    }
  }

  /**
   * Process pending notifications and create digests if needed
   */
  async processDigests(userId: string): Promise<void> {
    if (!this.config.enabled) {
      return
    }

    try {
      // Get pending notifications for user
      const pendingNotifications = await this.db.notification.findMany({
        where: {
          userId,
          read: false,
          sentAt: null,
          scheduledAt: {
            lte: new Date()
          }
        },
        orderBy: {
          createdAt: 'asc'
        },
        take: 50 // Limit to prevent too many notifications
      })

      if (pendingNotifications.length === 0) {
        return
      }

      // Group notifications
      const groups = this.groupNotifications(pendingNotifications)

      // Create digests for groups with multiple notifications
      for (const group of groups) {
        if (group.count > this.config.maxNotifications) {
          await this.createDigest(userId, group)
        } else {
          // Send individual notifications
          for (const notification of group.notifications) {
            await this.orchestrator.send({
              userId,
              type: notification.type as NotificationType,
              title: notification.title,
              message: notification.message,
              priority: 'medium',
              data: {
                notificationId: notification.id
              }
            })

            // Mark as sent
            await this.db.notification.update(
              { id: notification.id },
              { sentAt: new Date() }
            )
          }
        }
      }
    } catch (error) {
      console.error('Error processing digests:', error)
    }
  }

  /**
   * Group notifications by type
   */
  private groupNotifications(notifications: any[]): DigestGroup[] {
    const groups = new Map<NotificationType, DigestGroup>()

    for (const notification of notifications) {
      const type = notification.type as NotificationType
      
      if (!groups.has(type)) {
        groups.set(type, {
          type,
          count: 0,
          notifications: [],
          summary: ''
        })
      }

      const group = groups.get(type)!
      group.count++
      group.notifications.push({
        id: notification.id,
        type: notification.type as NotificationType,
        title: notification.title,
        message: notification.message,
        createdAt: notification.createdAt
      })
    }

    // Generate summaries for each group
    for (const group of groups.values()) {
      group.summary = this.generateSummary(group)
    }

    return Array.from(groups.values())
  }

  /**
   * Generate digest summary
   */
  private generateSummary(group: DigestGroup): string {
    switch (group.type) {
      case 'bill_due':
        return `Du har ${group.count} regninger som forfaller snart`
      
      case 'budget_alert':
        return `Du har ${group.count} budsjettvarsler`
      
      case 'debt_reminder':
        return `Du har ${group.count} gjeldspåminnelser`
      
      case 'achievement':
        return `Du har oppnådd ${group.count} achievements!`
      
      case 'score_improvement':
        return `Din score har forbedret seg ${group.count} ganger`
      
      case 'challenge':
        return `Du har ${group.count} nye utfordringer`
      
      case 'reminder':
        return `Du har ${group.count} påminnelser`
      
      default:
        return `Du har ${group.count} nye varsler`
    }
  }

  /**
   * Create and send digest notification
   */
  private async createDigest(userId: string, group: DigestGroup): Promise<void> {
    try {
      // Create digest title
      const title = this.getDigestTitle(group)
      
      // Create digest message with details
      const message = this.createDigestMessage(group)

      // Send digest notification
      await this.orchestrator.send({
        userId,
        type: 'system',
        title,
        message,
        priority: 'medium',
        channels: this.config.channels,
        data: {
          digest: true,
          type: group.type,
          count: group.count,
          notificationIds: group.notifications.map(n => n.id)
        }
      })

      // Mark all grouped notifications as sent
      await this.db.notification.updateMany(
        {
          id: {
            in: group.notifications.map(n => n.id)
          }
        },
        {
          sentAt: new Date()
        }
      )
    } catch (error) {
      console.error('Error creating digest:', error)
    }
  }

  /**
   * Get digest title
   */
  private getDigestTitle(group: DigestGroup): string {
    const emoji = this.getTypeEmoji(group.type)
    return `${emoji} ${group.count} nye varsler`
  }

  /**
   * Create digest message with details
   */
  private createDigestMessage(group: DigestGroup): string {
    const lines: string[] = []
    lines.push(group.summary)
    lines.push('')
    
    // Add top 3 most important notifications
    const topNotifications = group.notifications
      .slice(0, 3)
      .map(n => `• ${n.title}`)
    
    lines.push(...topNotifications)
    
    if (group.count > 3) {
      lines.push(`... og ${group.count - 3} flere`)
    }

    return lines.join('\n')
  }

  /**
   * Get emoji for notification type
   */
  private getTypeEmoji(type: NotificationType): string {
    switch (type) {
      case 'bill_due': return '📄'
      case 'budget_alert': return '💰'
      case 'debt_reminder': return '⚠️'
      case 'achievement': return '🏆'
      case 'score_improvement': return '📈'
      case 'challenge': return '🎯'
      case 'reminder': return '⏰'
      default: return '🔔'
    }
  }

  /**
   * Update digest configuration
   */
  updateConfig(config: Partial<DigestConfig>): void {
    this.config = {
      ...this.config,
      ...config
    }
  }

  /**
   * Get current configuration
   */
  getConfig(): DigestConfig {
    return { ...this.config }
  }
}

