import { NextRequest, NextResponse } from 'next/server'
import { checkAuth } from '@/lib/auth-check';
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const reorderSchema = z.object({
  categories: z.array(z.object({
    id: z.string(),
    order: z.number()
  }))
})

// POST reorder menu categories
export async function POST(request: NextRequest) {
  const authResult = await checkAuth();
  if (!authResult.authenticated) {
    return authResult.response;
  }

  try {
    const body = await request.json()
    const { categories } = reorderSchema.parse(body)

    // Update each category's order in a transaction
    await prisma.$transaction(
      categories.map(category =>
        prisma.menuCategory.update({
          where: { id: category.id },
          data: { order: category.order }
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
    console.error('Failed to reorder categories:', error)
    return NextResponse.json(
      { error: 'Failed to reorder categories' },
      { status: 500 }
    )
  }
}
