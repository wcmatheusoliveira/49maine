import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// Public API endpoint for fetching menu data for the website
export async function GET() {
  try {
    const categories = await prisma.menuCategory.findMany({
      where: {
        isActive: true
      },
      orderBy: {
        order: 'asc'
      },
      include: {
        items: {
          where: {
            isAvailable: true
          },
          orderBy: {
            order: 'asc'
          }
        }
      }
    })

    // Transform data to match website format
    const menuData = categories.map(category => ({
      title: category.name,
      description: category.description,
      items: category.items.map(item => {
        let price: any = item.price

        // Parse priceOptions if available
        if (item.priceOptions) {
          try {
            const priceVariants = JSON.parse(item.priceOptions)

            // Check if it's multiple sizes (small/large pattern)
            const hasSmallLarge = priceVariants.some((v: any) =>
              v.name.toLowerCase().includes('small') || v.name.toLowerCase().includes('large')
            )

            if (hasSmallLarge) {
              price = {}
              priceVariants.forEach((variant: any) => {
                const name = variant.name.toLowerCase()
                if (name.includes('small')) price.small = variant.price
                else if (name.includes('large')) price.large = variant.price
              })
            } else {
              // Multiple options format
              price = {
                options: priceVariants.map((v: any) => `${v.name} ${v.price}`)
              }
            }
          } catch (e) {
            // If parsing fails, use simple price
            price = item.price
          }
        }

        return {
          name: item.name,
          description: item.description,
          price,
          isPopular: item.isPopular
        }
      })
    }))

    return NextResponse.json(menuData)
  } catch (error) {
    console.error('Failed to fetch menu:', error)
    return NextResponse.json(
      { error: 'Failed to fetch menu' },
      { status: 500 }
    )
  }
}
