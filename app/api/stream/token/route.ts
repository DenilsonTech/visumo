import { NextResponse } from "next/server";
import { createStreamToken } from "@/actions/stream.actions";

export async function GET() {
  try {
    const token = await createStreamToken();

    return NextResponse.json({ token });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to create Stream token";

    const status = message === "User is not logged in" ? 401 : 500;

    return NextResponse.json({ error: message }, { status });
  }
}
