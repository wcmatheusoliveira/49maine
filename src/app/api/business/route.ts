import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// Public endpoint - GET business info
export async function GET() {
  try {
    const businessInfo = await prisma.businessInfo.findFirst()

    if (!businessInfo) {
      return NextResponse.json(null)
    }

    return NextResponse.json(businessInfo)
  } catch (error) {
    console.error('Failed to fetch business information:', error)
    return NextResponse.json(
      { error: 'Failed to fetch business information' },
      { status: 500 }
    )
  }
}