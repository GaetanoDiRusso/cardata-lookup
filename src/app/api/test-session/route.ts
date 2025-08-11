import { getServerSession } from 'next-auth'
import { NextResponse } from 'next/server'
import { authOptions } from '../auth/authOptions'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    console.log('🔍 Test Session Endpoint:', {
      hasSession: !!session,
      sessionData: session,
      timestamp: new Date().toISOString()
    })
    
    return NextResponse.json({
      authenticated: !!session,
      user: session?.user || null,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('🔍 Test Session Error:', error)
    return NextResponse.json({ error: 'Failed to get session' }, { status: 500 })
  }
} 