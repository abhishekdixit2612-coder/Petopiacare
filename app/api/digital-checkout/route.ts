import { NextResponse } from 'next/server';
import Razorpay from 'razorpay';

export async function POST(req: Request) {
  try {
    const { productId, productTitle, amount } = await req.json();

    if (!productId || !productTitle || amount == null) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    const razorpay = new Razorpay({
      key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY!,
      key_secret: process.env.RAZORPAY_SECRET!,
    });

    const order = await razorpay.orders.create({
      amount: Math.round(amount * 100),
      currency: 'INR',
      receipt: `dp_${productId}_${Date.now()}`,
      notes: { productId, productTitle },
    });

    return NextResponse.json({ orderId: order.id, amount: order.amount, currency: order.currency });
  } catch (err) {
    console.error('Digital checkout error:', err);
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
  }
}
