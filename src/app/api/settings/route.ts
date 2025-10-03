import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// Public API endpoint for fetching site settings
export async function GET() {
  try {
    let site = await prisma.site.findFirst()

    if (!site) {
      // Return default settings if none exist
      site = {
        id: 'default',
        name: '49Maine',
        logo: null,
        favicon: null,
        primaryColor: '#144663',
        secondaryColor: '#FBF8EB',
        accentColor: '#fbbf24',
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    }

    return NextResponse.json(site)
  } catch (error) {
    console.error('Failed to fetch settings:', error)
    return NextResponse.json(
      {
        id: 'default',
        name: '49Maine',
        primaryColor: '#144663',
        secondaryColor: '#FBF8EB',
        accentColor: '#fbbf24',
      },
      { status: 200 }
    )
  }
}
