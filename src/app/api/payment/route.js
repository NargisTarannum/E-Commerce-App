import Razorpay from "razorpay";

export async function POST(req) {
  const body = await req.json();

  const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });

  const order = await razorpay.orders.create({
    amount: body.amount * 100,
    currency: "INR",
  });

  return Response.json(order);
}