import clientPromise from "@/lib/mongodb";

export async function POST(req) {
  const body = await req.json();

  const client = await clientPromise;
  const db = client.db("ecommerce");

  const result = await db.collection("orders").insertOne({
    ...body,
    createdAt: new Date(),
  });

  return Response.json({ success: true, result });
}