import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("jobquest_token")?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, message: "Please sign in to continue." },
        { status: 401 },
      );
    }

    const { id } = await context.params;

    if (!/^[a-f\d]{24}$/i.test(id)) {
      return NextResponse.json(
        { success: false, message: "Invalid company ID." },
        { status: 400 },
      );
    }

    const response = await fetch(
      `${API_BASE_URL}/companies/${id}/applications`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        cache: "no-store",
      },
    );

    const data = await response.json().catch(() => null);

    return NextResponse.json(
      data ?? {
        success: false,
        message: "Unable to load company applications.",
      },
      { status: response.status },
    );
  } catch {
    return NextResponse.json(
      { success: false, message: "Unable to connect to the server." },
      { status: 500 },
    );
  }
}