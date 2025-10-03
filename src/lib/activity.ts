import { prisma } from './prisma';

interface LogActivityParams {
  action: 'created' | 'updated' | 'deleted';
  entityType: 'menu_item' | 'menu_category' | 'page' | 'section' | 'testimonial' | 'business_info' | 'settings';
  entityId?: string;
  entityName: string;
  description?: string;
  userId?: string;
  metadata?: Record<string, any>;
}

export async function logActivity({
  action,
  entityType,
  entityId,
  entityName,
  description,
  userId,
  metadata
}: LogActivityParams) {
  try {
    await prisma.activityLog.create({
      data: {
        action,
        entityType,
        entityId,
        entityName,
        description,
        userId,
        metadata: metadata ? JSON.stringify(metadata) : null
      }
    });
  } catch (error) {
    console.error('Failed to log activity:', error);
    // Don't throw - activity logging should not break the main operation
  }
}
