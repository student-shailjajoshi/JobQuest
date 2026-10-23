import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("jobquest_token")?.value;

    if (!token) {
      return NextResponse.json(
        {
          success: false,
          message: "Please sign in to continue.",
        },
        { status: 401 },
      );
    }

    const response = await fetch(`${API_BASE_URL}/dashboard`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      return NextResponse.json(
        {
          success: false,
          message: data?.message || "Unable to load dashboard data.",
        },
        { status: response.status },
      );
    }

    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      {
        success: false,
        message: "Unable to connect to the server.",
      },
      { status: 500 },
    );
  }
}