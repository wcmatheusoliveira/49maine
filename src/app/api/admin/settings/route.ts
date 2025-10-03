import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { checkAuth } from '@/lib/auth-check'
import { z } from 'zod'

const settingsSchema = z.object({
  name: z.string().optional(),
  primaryColor: z.string().optional(),
  secondaryColor: z.string().optional(),
  accentColor: z.string().optional(),
  gaMeasurementId: z.string().optional(),
})

// GET site settings
export async function GET() {
  // Check authentication
  const authResult = await checkAuth()
  if (!authResult.authenticated) {
    return authResult.response
  }

  try {
    // Get or create default site settings
    let site = await prisma.site.findFirst()

    if (!site) {
      site = await prisma.site.create({
        data: {
          name: '49Maine',
          primaryColor: '#144663',
          secondaryColor: '#FBF8EB',
          accentColor: '#fbbf24',
        }
      })
    }

    return NextResponse.json(site)
  } catch (error) {
    console.error('Failed to fetch settings:', error)
    return NextResponse.json(
      { error: 'Failed to fetch settings' },
      { status: 500 }
    )
  }
}

// PUT update site settings
export async function PUT(request: NextRequest) {
  // Check authentication
  const authResult = await checkAuth()
  if (!authResult.authenticated) {
    return authResult.response
  }

  try {
    const body = await request.json()
    const validatedData = settingsSchema.parse(body)

    // Get existing site or create one
    let site = await prisma.site.findFirst()

    if (site) {
      site = await prisma.site.update({
        where: { id: site.id },
        data: validatedData
      })
    } else {
      site = await prisma.site.create({
        data: {
          name: validatedData.name || '49Maine',
          primaryColor: validatedData.primaryColor || '#144663',
          secondaryColor: validatedData.secondaryColor || '#FBF8EB',
          accentColor: validatedData.accentColor || '#fbbf24',
        }
      })
    }

    return NextResponse.json(site)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid data', details: error.issues },
        { status: 400 }
      )
    }
    console.error('Failed to update settings:', error)
    return NextResponse.json(
      { error: 'Failed to update settings' },
      { status: 500 }
    )
  }
}
