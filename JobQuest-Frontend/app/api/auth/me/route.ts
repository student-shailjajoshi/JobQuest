import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("jobquest_token")?.value;

    if (!token) {
      return NextResponse.json(
        { authenticated: false, user: null },
        { status: 200 },
      );
    }

    const response = await fetch(`${API_BASE_URL}/auth/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
      cache: "no-store",
    });

    if (!response.ok) {
      return NextResponse.json(
        { authenticated: false, user: null },
        { status: 200 },
      );
    }

    const result = await response.json();
    const user = result?.data?.user ?? result?.user ?? null;

    return NextResponse.json({
      authenticated: Boolean(user),
      user,
    });
  } catch {
    return NextResponse.json(
      { authenticated: false, user: null },
      { status: 200 },
    );
  }
}