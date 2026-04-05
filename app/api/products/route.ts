import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');

    let query = supabase.from('products').select('*');
    
    if (category && category !== 'All') {
      query = query.eq('category', category);
    }

    const { data: products, error } = await query.order('created_at', { ascending: false });

    if (error) throw error;

    return NextResponse.json({ products }, { status: 200 });
  } catch (error) {
    console.error("Fetch Products Error:", error);
    return NextResponse.json(
      { error: "Error fetching products" },
      { status: 500 }
    );
  }
}
