import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// Public endpoint - GET all active menu categories with items
export async function GET() {
  try {
    const categories = await prisma.menuCategory.findMany({
      where: {
        isActive: true
      },
      orderBy: { order: 'asc' },
      include: {
        items: {
          where: {
            isAvailable: true
          },
          orderBy: { order: 'asc' }
        }
      }
    })
    return NextResponse.json(categories)
  } catch (error) {
    console.error('Failed to fetch menu categories:', error)
    return NextResponse.json(
      { error: 'Failed to fetch menu categories' },
      { status: 500 }
    )
  }
}