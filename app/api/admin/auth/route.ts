import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function POST(request: Request) {
  try {
    const { password } = await request.json()
    console.log('Received password:', password)

    if (password !== process.env.NEXT_PUBLIC_ADMIN_PASSWORD) {
      return NextResponse.json(
        { error: 'Invalid password' },
        { status: 401 }
      )
    }

    const token = btoa(`:${password}`)
    const response = NextResponse.json({ success: true })
    
    cookies().set('adminAuth', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60 // 7 days
    })
    
    return response
  } catch (error) {
    console.error('Authentication error:', error)
    return NextResponse.json(
      { error: 'Server configuration error' },
      { status: 500 }
    )
  }
}

export async function DELETE() {
  cookies().delete('adminAuth')
  return NextResponse.json({ success: true })
} 