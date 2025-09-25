import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const menuItemSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  price: z.string().optional(),
  priceOptions: z.string().optional(), // JSON string
  image: z.string().optional(),
  isPopular: z.boolean().default(false),
  isAvailable: z.boolean().default(true),
  order: z.number().int().min(0),
  categoryId: z.string().min(1),
  allergens: z.string().optional(), // JSON string
  nutrition: z.string().optional(), // JSON string
})

// GET all menu items
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const categoryId = searchParams.get('categoryId')

    const where = categoryId ? { categoryId } : {}

    const items = await prisma.menuItem.findMany({
      where,
      orderBy: [
        { category: { order: 'asc' } },
        { order: 'asc' }
      ],
      include: {
        category: true
      }
    })
    return NextResponse.json(items)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch menu items' },
      { status: 500 }
    )
  }
}

// POST create new item
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = menuItemSchema.parse(body)

    const item = await prisma.menuItem.create({
      data: validatedData,
      include: {
        category: true
      }
    })

    return NextResponse.json(item, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid data', details: error.errors },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { error: 'Failed to create menu item' },
      { status: 500 }
    )
  }
}

// PUT update item
export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { error: 'Item ID is required' },
        { status: 400 }
      )
    }

    const body = await request.json()
    const validatedData = menuItemSchema.parse(body)

    const item = await prisma.menuItem.update({
      where: { id },
      data: validatedData,
      include: {
        category: true
      }
    })

    return NextResponse.json(item)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid data', details: error.errors },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { error: 'Failed to update menu item' },
      { status: 500 }
    )
  }
}

// DELETE item
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { error: 'Item ID is required' },
        { status: 400 }
      )
    }

    await prisma.menuItem.delete({
      where: { id }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete menu item' },
      { status: 500 }
    )
  }
}