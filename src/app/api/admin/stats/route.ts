import { NextResponse } from 'next/server';
import { checkAuth } from '@/lib/auth-check';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const authResult = await checkAuth();
  if (!authResult.authenticated) {
    return authResult.response;
  }

  try {
    const [totalPages, totalMenuItems, totalTestimonials, publishedPages] = await Promise.all([
      prisma.page.count(),
      prisma.menuItem.count(),
      prisma.testimonial.count(),
      prisma.page.count({ where: { isPublished: true } })
    ]);

    return NextResponse.json({
      totalPages,
      totalMenuItems,
      totalTestimonials,
      publishedPages
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 });
  }
}
