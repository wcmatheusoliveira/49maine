import { NextRequest, NextResponse } from 'next/server'
import { checkAuth } from '@/lib/auth-check';
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const categorySchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  order: z.number().int().min(0),
  isActive: z.boolean().default(true),
})

// GET all menu categories
export async function GET() {
  const authResult = await checkAuth();
  if (!authResult.authenticated) {
    return authResult.response;
  }

  try {
    const categories = await prisma.menuCategory.findMany({
      orderBy: { order: 'asc' },
      include: {
        items: {
          orderBy: { order: 'asc' }
        }
      }
    })

    // Convert priceOptions JSON to priceVariants array for admin UI
    const categoriesWithVariants = categories.map(category => ({
      ...category,
      items: category.items.map(item => {
        let priceVariants = []
        if (item.priceOptions) {
          try {
            priceVariants = JSON.parse(item.priceOptions)
          } catch (e) {
            // If parsing fails, use old price field
            if (item.price) {
              priceVariants = [{ name: 'Regular', price: item.price }]
            }
          }
        } else if (item.price) {
          // Legacy items with single price
          priceVariants = [{ name: 'Regular', price: item.price }]
        }

        return {
          ...item,
          priceVariants: priceVariants.length > 0 ? priceVariants : undefined
        }
      })
    }))

    return NextResponse.json(categoriesWithVariants)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch menu categories' },
      { status: 500 }
    )
  }
}

// POST create new category
export async function POST(request: NextRequest) {
  const authResult = await checkAuth();
  if (!authResult.authenticated) {
    return authResult.response;
  }

  try {
    const body = await request.json()
    const validatedData = categorySchema.parse(body)

    const category = await prisma.menuCategory.create({
      data: validatedData
    })

    return NextResponse.json(category, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid data', details: error.issues },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { error: 'Failed to create menu category' },
      { status: 500 }
    )
  }
}

// PUT update category
export async function PUT(request: NextRequest) {
  const authResult = await checkAuth();
  if (!authResult.authenticated) {
    return authResult.response;
  }

  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { error: 'Category ID is required' },
        { status: 400 }
      )
    }

    const body = await request.json()
    const validatedData = categorySchema.parse(body)

    const category = await prisma.menuCategory.update({
      where: { id },
      data: validatedData
    })

    return NextResponse.json(category)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid data', details: error.issues },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { error: 'Failed to update menu category' },
      { status: 500 }
    )
  }
}

// DELETE category
export async function DELETE(request: NextRequest) {
  const authResult = await checkAuth();
  if (!authResult.authenticated) {
    return authResult.response;
  }

  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { error: 'Category ID is required' },
        { status: 400 }
      )
    }

    await prisma.menuCategory.delete({
      where: { id }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete menu category' },
      { status: 500 }
    )
  }
}