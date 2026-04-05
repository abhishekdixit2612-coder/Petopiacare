import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { customer_email, customer_name, order_id, total_amount } = body;

    const resendApiKey = process.env.RESEND_API_KEY;
    if (!resendApiKey) {
      console.warn("Resend API Key missing. Skipping email send.");
      return NextResponse.json({ success: true, message: "Skipped (no API key)" }, { status: 200 });
    }

    // Since we didn't install the 'resend' sdk, we can use simple fetch
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${resendApiKey}`,
      },
      body: JSON.stringify({
        from: 'PetopiaCare <orders@petopiacare.in>', // Note: Domain needs to be verified on Resend
        to: [customer_email],
        subject: `Your PetopiaCare Order Confirmation - ${order_id}`,
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #1A7D80;">Thank you, ${customer_name}!</h1>
            <p>Your order <strong>${order_id}</strong> has been received and is currently being processed.</p>
            <p>Total Amount: ₹${total_amount}</p>
            <p>You can expect delivery within 5-7 business days.</p>
            <hr />
            <p style="color: #888;">For questions, contact hello@petopiacare.in</p>
          </div>
        `
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to send email");
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Send Email Error:", error);
    return NextResponse.json(
      { error: "Error sending email" },
      { status: 500 }
    );
  }
}
