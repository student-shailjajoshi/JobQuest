
import { NextRequest, NextResponse } from "next/server";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:5000/api/v1";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const name = String(body.name ?? "").trim();
    const email = String(body.email ?? "").trim().toLowerCase();
    const password = String(body.password ?? "");

    if (!name || !email || !password) {
      return NextResponse.json(
        {
          success: false,
          message: "Name, email, and password are required.",
        },
        { status: 400 }
      );
    }

    if (name.length < 2 || name.length > 100) {
      return NextResponse.json(
        {
          success: false,
          message: "Name must be between 2 and 100 characters.",
        },
        { status: 400 }
      );
    }

    if (password.length < 8 || password.length > 128) {
      return NextResponse.json(
        {
          success: false,
          message: "Password must be between 8 and 128 characters.",
        },
        { status: 400 }
      );
    }

    const response = await fetch(
      `${API_BASE_URL}/auth/register`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
        cache: "no-store",
      }
    );

    const responseText = await response.text();

    let result: any = null;

    try {
      result = responseText ? JSON.parse(responseText) : null;
    } catch {
      result = null;
    }

    if (!response.ok) {
      console.error(
        "Registration backend error:",
        response.status,
        result ?? responseText
      );

      return NextResponse.json(
        {
          success: false,
          message:
            result?.message ||
            `Registration failed. Backend returned status ${response.status}.`,
          errors: result?.errors,
        },
        { status: response.status }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message:
          result?.message || "Account created successfully.",
        data: {
          user: result?.data?.user ?? result?.user ?? null,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration route error:", error);

    return NextResponse.json(
      {
        success: false,
        message:
          "Unable to connect to the authentication server. Check that the backend is running and its URL is correct.",
      },
      { status: 500 }
    );
  }
}
