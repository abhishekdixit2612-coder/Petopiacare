import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';

const admin = () => createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      productId, productTitle, downloadUrl,
      customerName, customerEmail, amountPaid,
      razorpayOrderId, razorpayPaymentId, razorpaySignature,
      isFree,
    } = body;

    // Verify Razorpay signature for paid orders
    if (!isFree) {
      const expectedSig = crypto
        .createHmac('sha256', process.env.RAZORPAY_SECRET!)
        .update(`${razorpayOrderId}|${razorpayPaymentId}`)
        .digest('hex');

      if (expectedSig !== razorpaySignature) {
        return NextResponse.json({ error: 'Invalid payment signature' }, { status: 400 });
      }
    }

    // Save the digital order
    const { data, error } = await admin().from('digital_orders').insert([{
      product_id: productId,
      product_title: productTitle,
      customer_name: customerName,
      customer_email: customerEmail,
      amount_paid: amountPaid ?? 0,
      razorpay_order_id: razorpayOrderId ?? null,
      razorpay_payment_id: razorpayPaymentId ?? null,
      download_url: downloadUrl,
      status: 'paid',
    }]).select('id').single();

    if (error) {
      // Table might not exist yet — return download URL anyway
      console.error('Digital order save error (non-fatal):', error.message);
    }

    return NextResponse.json({ ok: true, orderId: data?.id, downloadUrl });
  } catch (err) {
    console.error('Digital orders error:', err);
    return NextResponse.json({ error: 'Failed to record order' }, { status: 500 });
  }
}
