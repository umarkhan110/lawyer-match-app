import { db } from "@/firebase/config";
import { collection, doc, getDocs, query, updateDoc, where } from "firebase/firestore";
import { headers } from "next/headers";
const stripe = require("stripe")(process.env.NEXT_PUBLIC_STRIPE_SERVER_KEY);
export async function POST(request) {
  const body = await request.text();
  const signature = headers().get("Stripe-Signature") ?? "";

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET || ""
    );
    console.log("event", event);
  } catch (err) {
    return new Response(
      `Webhook Error: ${err ? err.message : "Unknown Error"}`,
      { status: 400 }
    );
  }

  const session = event.data.object;

  if (!session) {
    return new Response(session, {
      status: 200,
    });
  }
  // const userDocRef = doc(db, "users", session?.metadata?.userId);

  if (event.type === "checkout.session.completed") {
    const subscription = await stripe.subscriptions.retrieve(
      session.subscription
    );
    await updateDoc(userDocRef, {
      stripeSubscriptionId: subscription.id,
      stripeCustomerId: subscription.customer,
      stripePriceId: subscription.items.data[0].price.id,
      stripeCurrentPeriodEnd: new Date(subscription.current_period_end * 1000),
      subscriptionStatus: "active",
      subscriptionEndDate: new Date(subscription.current_period_end * 1000)
    });
  }

  if (event.type === "invoice.payment_succeeded") {
    const subscription = await stripe.subscriptions.retrieve(
      session.subscription
    );

    const usersCollectionRef = collection(db, "users");
    const stripeCustomerId = subscription.customer;
    const q = query(usersCollectionRef, where("stripeCustomerId", "==", stripeCustomerId));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      querySnapshot.forEach(async (doc) => {
        const userDocRef = doc.ref;
        
        await updateDoc(userDocRef, {
          stripePriceId: subscription.items.data[0].price.id,
          stripeCurrentPeriodEnd: new Date(subscription.current_period_end * 1000),
        });
      });
    } else {
      console.log("No matching documents.");
    }

  }

  if (event.type === "customer.subscription.updated") {
    try {
      const usersCollectionRef = collection(db, "users");
      const stripeCustomerId = session.customer;
      const q = query(usersCollectionRef, where("stripeCustomerId", "==", stripeCustomerId));
      const querySnapshot = await getDocs(q);
  
      querySnapshot.forEach(async (doc) => {
        const userDocRef = doc.ref;
        
        try {
          await updateDoc(userDocRef, {
            stripePriceId: subscription.items.data[0].price.id,
            stripeCurrentPeriodEnd: new Date(subscription.current_period_end * 1000),
          });
        } catch (updateError) {
          console.error("Error updating user document: ", updateError);
          return new Response(updateError, { status: 200 })
        }
      });
    } catch (error) {
      console.error("Error handling subscription update: ", error);
      return new Response(error, { status: 200 })
    }
  }
  

  return new Response("querySnapshot", { status: 200 });
}

