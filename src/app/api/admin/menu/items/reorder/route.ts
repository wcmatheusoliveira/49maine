import { NextRequest, NextResponse } from 'next/server'
import { checkAuth } from '@/lib/auth-check';
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const reorderSchema = z.object({
  items: z.array(z.object({
    id: z.string(),
    order: z.number()
  }))
})

// POST reorder menu items
export async function POST(request: NextRequest) {
  const authResult = await checkAuth();
  if (!authResult.authenticated) {
    return authResult.response;
  }

  try {
    const body = await request.json()
    const { items } = reorderSchema.parse(body)

    // Update each item's order in a transaction
    await prisma.$transaction(
      items.map(item =>
        prisma.menuItem.update({
          where: { id: item.id },
          data: { order: item.order }
        })
      )
    )

    return NextResponse.json({ success: true })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid data', details: error.issues },
        { status: 400 }
      )
    }
    console.error('Failed to reorder menu items:', error)
    return NextResponse.json(
      { error: 'Failed to reorder menu items' },
      { status: 500 }
    )
  }
}
