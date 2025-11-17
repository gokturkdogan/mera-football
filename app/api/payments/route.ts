import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import Iyzipay from 'iyzipay'

const iyzipayConfig = {
  apiKey: process.env.IYZICO_API_KEY || '',
  secretKey: process.env.IYZICO_SECRET_KEY || '',
  uri: process.env.IYZICO_BASE_URL || 'https://api.iyzipay.com',
}

const iyzipay = new Iyzipay(iyzipayConfig)

const createPaymentSchema = z.object({
  organizationId: z.string(),
  plan: z.enum(['PREMIUM']),
  cardHolderName: z.string(),
  cardNumber: z.string(),
  expireMonth: z.string(),
  expireYear: z.string(),
  cvc: z.string(),
  price: z.number(),
})

// POST - Create payment (iyzico)
export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get('token')?.value

    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const payload = verifyToken(token)

    if (!payload || payload.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Only admins can make payments' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const validatedData = createPaymentSchema.parse(body)

    // Check if organization exists and user is owner
    const organization = await prisma.organization.findUnique({
      where: { id: validatedData.organizationId },
    })

    if (!organization) {
      return NextResponse.json(
        { error: 'Organization not found' },
        { status: 404 }
      )
    }

    if (organization.ownerId !== payload.userId) {
      return NextResponse.json(
        { error: 'Only organization owner can make payments' },
        { status: 403 }
      )
    }

    // Create payment request
    const request = {
      locale: 'tr',
      conversationId: `ORG_${validatedData.organizationId}_${Date.now()}`,
      price: validatedData.price.toFixed(2),
      paidPrice: validatedData.price.toFixed(2),
      currency: 'TRY',
      installment: '1',
      basketId: `BASKET_${validatedData.organizationId}`,
      paymentCard: {
        cardHolderName: validatedData.cardHolderName,
        cardNumber: validatedData.cardNumber.replace(/\s/g, ''),
        expireMonth: validatedData.expireMonth,
        expireYear: validatedData.expireYear,
        cvc: validatedData.cvc,
        registerCard: '0',
      },
      buyer: {
        id: payload.userId,
        name: payload.email.split('@')[0],
        surname: payload.email.split('@')[0],
        gsmNumber: '+905551234567',
        email: payload.email,
        identityNumber: '11111111111',
        lastLoginDate: new Date().toISOString(),
        registrationDate: new Date().toISOString(),
        registrationAddress: 'Istanbul',
        ip: '85.34.78.112',
        city: 'Istanbul',
        country: 'Turkey',
        zipCode: '34732',
      },
      shippingAddress: {
        contactName: payload.email.split('@')[0],
        city: 'Istanbul',
        country: 'Turkey',
        address: 'Istanbul',
        zipCode: '34732',
      },
      billingAddress: {
        contactName: payload.email.split('@')[0],
        city: 'Istanbul',
        country: 'Turkey',
        address: 'Istanbul',
        zipCode: '34732',
      },
      basketItems: [
        {
          id: 'PREMIUM_PLAN',
          name: 'Premium Plan',
          category1: 'Subscription',
          itemType: 'VIRTUAL',
          price: validatedData.price.toFixed(2),
        },
      ],
    }

    // Make payment
    iyzipay.payment.create(request, async (err: any, result: any) => {
      if (err) {
        console.error('Iyzico payment error:', err)
        // Create failed payment record
        await prisma.payment.create({
          data: {
            userId: payload.userId,
            organizationId: validatedData.organizationId,
            plan: validatedData.plan,
            amount: validatedData.price,
            status: 'FAILED',
            iyzicoResponse: err,
          },
        })

        return NextResponse.json(
          { error: 'Payment failed', details: err },
          { status: 400 }
        )
      }

      // Create payment record
      const payment = await prisma.payment.create({
        data: {
          userId: payload.userId,
          organizationId: validatedData.organizationId,
          plan: validatedData.plan,
          amount: validatedData.price,
          status: result.status === 'success' ? 'COMPLETED' : 'FAILED',
          iyzicoPaymentId: result.paymentId,
          iyzicoResponse: result,
        },
      })

      // Update organization plan if payment successful
      if (result.status === 'success') {
        await prisma.organization.update({
          where: { id: validatedData.organizationId },
          data: {
            plan: 'PREMIUM',
            maxPlayers: 999999,
          },
        })
      }

      return NextResponse.json({
        payment,
        iyzicoResult: result,
      })
    })

    // Note: This is a simplified version. In production, you should handle async callbacks properly
    return NextResponse.json({ message: 'Payment processing...' })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Create payment error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// GET - Get payment history
export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('token')?.value

    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const payload = verifyToken(token)

    if (!payload) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const organizationId = searchParams.get('organizationId')

    const where: any = { userId: payload.userId }
    if (organizationId) {
      where.organizationId = organizationId
    }

    const payments = await prisma.payment.findMany({
      where,
      include: {
        organization: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json({ payments })
  } catch (error) {
    console.error('Get payments error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

