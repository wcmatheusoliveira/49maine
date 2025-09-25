import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const sectionSchema = z.object({
  type: z.string().min(1),
  name: z.string().min(1),
  order: z.number().int().min(0),
  isVisible: z.boolean().default(true),
  data: z.string(), // JSON string
  pageId: z.string().min(1),
})

// GET sections for a page
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const pageId = searchParams.get('pageId')

    if (!pageId) {
      return NextResponse.json(
        { error: 'Page ID is required' },
        { status: 400 }
      )
    }

    const sections = await prisma.section.findMany({
      where: { pageId },
      orderBy: { order: 'asc' },
      include: {
        components: {
          orderBy: { order: 'asc' }
        }
      }
    })

    return NextResponse.json(sections)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch sections' },
      { status: 500 }
    )
  }
}

// POST create new section
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = sectionSchema.parse(body)

    const section = await prisma.section.create({
      data: validatedData,
      include: {
        components: true
      }
    })

    return NextResponse.json(section, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid data', details: error.errors },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { error: 'Failed to create section' },
      { status: 500 }
    )
  }
}

// PUT update section
export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { error: 'Section ID is required' },
        { status: 400 }
      )
    }

    const body = await request.json()
    const validatedData = sectionSchema.parse(body)

    const section = await prisma.section.update({
      where: { id },
      data: validatedData,
      include: {
        components: true
      }
    })

    return NextResponse.json(section)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid data', details: error.errors },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { error: 'Failed to update section' },
      { status: 500 }
    )
  }
}

// DELETE section
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { error: 'Section ID is required' },
        { status: 400 }
      )
    }

    await prisma.section.delete({
      where: { id }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete section' },
      { status: 500 }
    )
  }
}

// PATCH update section order
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    const { sections } = body as { sections: { id: string; order: number }[] }

    if (!sections || !Array.isArray(sections)) {
      return NextResponse.json(
        { error: 'Sections array is required' },
        { status: 400 }
      )
    }

    // Update each section's order
    await Promise.all(
      sections.map(({ id, order }) =>
        prisma.section.update({
          where: { id },
          data: { order }
        })
      )
    )

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update section order' },
      { status: 500 }
    )
  }
}