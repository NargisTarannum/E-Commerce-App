import { getCurrentUser } from "@/lib/auth";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) return Response.json({ message: "Not authenticated." }, { status: 401 });
    return Response.json({ user });
  } catch (err) {
    console.error("[me]", err);
    return Response.json({ message: "Something went wrong." }, { status: 500 });
  }
}
