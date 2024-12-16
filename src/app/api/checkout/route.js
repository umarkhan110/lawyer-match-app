import { NextResponse } from "next/server";
const stripe = require("stripe")(process.env.NEXT_PUBLIC_STRIPE_SERVER_KEY);

import { absoluteUrl } from "@/app/lib/utils";
export async function POST(req) {
  console.log(req)
  const data = await req.json();
  const billingUrl = absoluteUrl("lawyer");
  try {

    const stripeSession = await stripe.checkout.sessions.create({
      success_url: billingUrl,
      cancel_url: billingUrl,
      payment_method_types: ["card"],
      mode: "subscription",
      billing_address_collection: "auto",
      customer_email: data.email,
      line_items: [
        {
          price: data.stripePriceId,
          quantity: 1,
        },
      ],
      metadata: {
        userId: data.userId,
        email: data.email
      },
    });

    return NextResponse.json({
      success: true,
      res: {
        url: stripeSession.url
      },
    });
  } catch (err) {
    console.log(err);
    return NextResponse.json({ success: false, message: err.message });
  }
}
