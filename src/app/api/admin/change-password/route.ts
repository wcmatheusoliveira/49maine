import { NextRequest, NextResponse } from 'next/server'
import { checkAuth } from '@/lib/auth-check'
import { prisma } from '@/lib/prisma'
import { hash } from 'bcryptjs'
import { z } from 'zod'

const passwordSchema = z.object({
  newPassword: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string()
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"]
})

export async function POST(request: NextRequest) {
  const authResult = await checkAuth()
  if (!authResult.authenticated) {
    return authResult.response
  }

  const userEmail = authResult.session?.user?.email
  if (!userEmail) {
    return NextResponse.json(
      { error: 'User email not found in session' },
      { status: 400 }
    )
  }

  try {
    const body = await request.json()
    const validatedData = passwordSchema.parse(body)

    // Hash the new password
    const hashedPassword = await hash(validatedData.newPassword, 12)

    // Update the user's password
    await prisma.user.update({
      where: { email: userEmail },
      data: { password: hashedPassword }
    })

    return NextResponse.json({
      success: true,
      message: 'Password updated successfully'
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid data', details: error.issues },
        { status: 400 }
      )
    }
    console.error('Failed to update password:', error)
    return NextResponse.json(
      { error: 'Failed to update password' },
      { status: 500 }
    )
  }
}
