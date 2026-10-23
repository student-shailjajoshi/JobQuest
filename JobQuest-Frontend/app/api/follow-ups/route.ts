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
        {
          success: false,
          message: "Please log in to view your follow-ups.",
        },
        { status: 401 },
      );
    }

    const response = await fetch(
      `${API_BASE_URL}/applications/follow-ups`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
        cache: "no-store",
      },
    );

    const data = await response.json().catch(() => null);

    return NextResponse.json(
      data ?? {
        success: false,
        message: "The backend returned an invalid response.",
      },
      { status: response.status },
    );
  } catch {
    return NextResponse.json(
      {
        success: false,
        message: "Unable to load follow-ups. Please try again.",
      },
      { status: 500 },
    );
  }
}