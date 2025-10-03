import { NextRequest, NextResponse } from 'next/server'
import { checkAuth } from '@/lib/auth-check';
import { prisma } from '@/lib/prisma'
import { logActivity } from '@/lib/activity'
import { z } from 'zod'

const priceVariantSchema = z.object({
  name: z.string(),
  price: z.string(),
})

const menuItemSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  price: z.string().optional(),
  priceVariants: z.array(priceVariantSchema).optional(), // Will be converted to priceOptions
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
  const authResult = await checkAuth();
  if (!authResult.authenticated) {
    return authResult.response;
  }

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

    // Convert priceOptions JSON to priceVariants array for admin UI
    const itemsWithVariants = items.map(item => {
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

    return NextResponse.json(itemsWithVariants)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch menu items' },
      { status: 500 }
    )
  }
}

// POST create new item
export async function POST(request: NextRequest) {
  const authResult = await checkAuth();
  if (!authResult.authenticated) {
    return authResult.response;
  }

  try {
    const body = await request.json()
    const validatedData = menuItemSchema.parse(body)

    // Convert priceVariants array to priceOptions JSON string
    const { priceVariants, ...dataWithoutVariants } = validatedData
    const dataToSave = {
      ...dataWithoutVariants,
      priceOptions: priceVariants ? JSON.stringify(priceVariants) : undefined,
      // Keep first variant in price field for backward compatibility
      price: priceVariants && priceVariants.length > 0 ? priceVariants[0].price : undefined
    }

    const item = await prisma.menuItem.create({
      data: dataToSave,
      include: {
        category: true
      }
    })

    // Log activity
    await logActivity({
      action: 'created',
      entityType: 'menu_item',
      entityId: item.id,
      entityName: item.name,
      description: `Added to ${item.category.name}`
    })

    return NextResponse.json(item, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid data', details: error.issues },
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
  const authResult = await checkAuth();
  if (!authResult.authenticated) {
    return authResult.response;
  }

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

    // Convert priceVariants array to priceOptions JSON string
    const { priceVariants, ...dataWithoutVariants } = validatedData
    const dataToSave = {
      ...dataWithoutVariants,
      priceOptions: priceVariants ? JSON.stringify(priceVariants) : undefined,
      // Keep first variant in price field for backward compatibility
      price: priceVariants && priceVariants.length > 0 ? priceVariants[0].price : undefined
    }

    const item = await prisma.menuItem.update({
      where: { id },
      data: dataToSave,
      include: {
        category: true
      }
    })

    // Log activity
    await logActivity({
      action: 'updated',
      entityType: 'menu_item',
      entityId: item.id,
      entityName: item.name,
      description: `Updated in ${item.category.name}`
    })

    return NextResponse.json(item)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid data', details: error.issues },
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
  const authResult = await checkAuth();
  if (!authResult.authenticated) {
    return authResult.response;
  }

  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { error: 'Item ID is required' },
        { status: 400 }
      )
    }

    // Get item details before deleting
    const item = await prisma.menuItem.findUnique({
      where: { id },
      include: { category: true }
    })

    if (!item) {
      return NextResponse.json(
        { error: 'Item not found' },
        { status: 404 }
      )
    }

    await prisma.menuItem.delete({
      where: { id }
    })

    // Log activity
    await logActivity({
      action: 'deleted',
      entityType: 'menu_item',
      entityId: id,
      entityName: item.name,
      description: `Removed from ${item.category.name}`
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete menu item' },
      { status: 500 }
    )
  }
}