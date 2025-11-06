/**
 * Interfaces for NotifyPlan Core
 * Defines adapters for external services (database, email, SMS)
 */

export interface DatabaseAdapter {
  notification: {
    create(data: any): Promise<any>
    findMany(where: any): Promise<any[]>
    findUnique(where: any): Promise<any | null>
    update(where: any, data: any): Promise<any>
    updateMany(where: any, data: any): Promise<any>
    delete(where: any): Promise<any>
  }
  user: {
    findUnique(where: any): Promise<any | null>
  }
  organization: {
    findUnique(where: any): Promise<any | null>
  }
  project?: {
    findUnique(where: any): Promise<any | null>
  }
}

export interface EmailAdapter {
  sendEmail(
    to: string,
    subject: string,
    body: string,
    options?: {
      from?: string
      fromName?: string
      html?: string
    }
  ): Promise<{ success: boolean; error?: string }>
  
  sendBillReminder(
    email: string,
    name: string,
    bill: {
      title: string
      amount: number
      dueDate: Date
    }
  ): Promise<{ success: boolean; error?: string }>
  
  sendMotivationalEmail(
    email: string,
    name: string,
    achievement: {
      title: string
      description: string
    }
  ): Promise<{ success: boolean; error?: string }>
  
  sendNotificationEmail(
    email: string,
    subject: string,
    message: string
  ): Promise<{ success: boolean; error?: string }>
}

export interface SMSAdapter {
  sendSMS(
    to: string,
    message: string
  ): Promise<{ success: boolean; error?: string; messageId?: string }>
}

export interface PushAdapter {
  sendPush(
    subscription: any,
    payload: {
      title: string
      body: string
      icon?: string
      badge?: string
      data?: Record<string, any>
    }
  ): Promise<{ success: boolean; error?: string }>
}

