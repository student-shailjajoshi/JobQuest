import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

async function getToken() {
  const cookieStore = await cookies();
  return cookieStore.get("jobquest_token")?.value;
}

export async function GET() {
  try {
    const token = await getToken();

    if (!token) {
      return NextResponse.json(
        { success: false, message: "Please sign in to continue." },
        { status: 401 },
      );
    }

    const response = await fetch(`${API_BASE_URL}/applications`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

    const data = await response.json().catch(() => null);

    return NextResponse.json(data ?? {
      success: false,
      message: "Unable to load applications.",
    }, { status: response.status });
  } catch {
    return NextResponse.json(
      { success: false, message: "Unable to connect to the server." },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = await getToken();

    if (!token) {
      return NextResponse.json(
        { success: false, message: "Please sign in to continue." },
        { status: 401 },
      );
    }

    const body = await request.json();

    const response = await fetch(`${API_BASE_URL}/applications`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
      cache: "no-store",
    });

    const data = await response.json().catch(() => null);

    return NextResponse.json(data ?? {
      success: false,
      message: "Unable to create application.",
    }, { status: response.status });
  } catch {
    return NextResponse.json(
      { success: false, message: "Unable to connect to the server." },
      { status: 500 },
    );
  }
}