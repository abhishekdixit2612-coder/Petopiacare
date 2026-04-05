import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { 
      customer_name, customer_email, customer_phone, total_amount, 
      razorpay_order_id, razorpay_payment_id, shipping_address, 
      city, pincode, cart_items 
    } = body;

    // 1. Save Order Header
    const { data: orderData, error: orderError } = await supabase
      .from('orders')
      .insert([{
        customer_name,
        customer_email,
        customer_phone,
        total_amount,
        razorpay_order_id,
        razorpay_payment_id,
        shipping_address,
        city,
        pincode,
        status: 'paid'
      }])
      .select('id')
      .single();

    if (orderError || !orderData) {
      throw orderError || new Error("Failed to create order");
    }

    const orderId = orderData.id;

    // 2. Save Order Items
    const formattedItems = cart_items.map((item: any) => ({
      order_id: orderId,
      product_id: item.id,
      quantity: item.quantity,
      price_at_purchase: item.price,
    }));

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(formattedItems);

    if (itemsError) {
      throw itemsError;
    }

    return NextResponse.json({ success: true, order_id: orderId }, { status: 200 });
  } catch (error) {
    console.error("Save Order Error:", error);
    return NextResponse.json(
      { error: "Error saving order" },
      { status: 500 }
    );
  }
}
