import { NextRequest, NextResponse } from 'next/server'
import { checkAuth } from '@/lib/auth-check';
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const businessInfoSchema = z.object({
  name: z.string().min(1),
  address: z.string().min(1),
  city: z.string().min(1),
  state: z.string().min(1),
  zip: z.string().min(1),
  phone: z.string().min(1),
  email: z.string().email(),
  hours: z.string(), // JSON string
  socialMedia: z.string().optional(), // JSON string
  mapEmbed: z.string().optional(),
})

// GET business info
export async function GET() {
  const authResult = await checkAuth();
  if (!authResult.authenticated) {
    return authResult.response;
  }

  try {
    const businessInfo = await prisma.businessInfo.findFirst()

    if (!businessInfo) {
      return NextResponse.json(null)
    }

    return NextResponse.json(businessInfo)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch business information' },
      { status: 500 }
    )
  }
}

// POST/PUT upsert business info
export async function POST(request: NextRequest) {
  const authResult = await checkAuth();
  if (!authResult.authenticated) {
    return authResult.response;
  }

  try {
    const body = await request.json()
    const validatedData = businessInfoSchema.parse(body)

    // Check if business info exists
    const existing = await prisma.businessInfo.findFirst()

    let businessInfo
    if (existing) {
      businessInfo = await prisma.businessInfo.update({
        where: { id: existing.id },
        data: validatedData
      })
    } else {
      businessInfo = await prisma.businessInfo.create({
        data: validatedData
      })
    }

    return NextResponse.json(businessInfo)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid data', details: error.issues },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { error: 'Failed to save business information' },
      { status: 500 }
    )
  }
}