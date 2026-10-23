import { NextRequest, NextResponse } from "next/server";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const email = String(body.email ?? "").trim().toLowerCase();
    const password = String(body.password ?? "");

    if (!email || !password) {
      return NextResponse.json(
        {
          success: false,
          message: "Email and password are required.",
        },
        { status: 400 },
      );
    }

    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
      cache: "no-store",
    });

    const result = await response.json().catch(() => null);

    if (!response.ok) {
      return NextResponse.json(
        {
          success: false,
          message: result?.message || "Invalid email or password.",
        },
        { status: response.status },
      );
    }

    const token = result?.data?.token ?? result?.token;
    const user = result?.data?.user ?? result?.user;

    if (!token) {
      return NextResponse.json(
        {
          success: false,
          message: "The authentication server did not return a token.",
        },
        { status: 502 },
      );
    }

    const res = NextResponse.json({
      success: true,
      message: "Login successful.",
      data: { user },
    });

    res.cookies.set("jobquest_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return res;
  } catch {
    return NextResponse.json(
      {
        success: false,
        message: "Unable to connect to the authentication server.",
      },
      { status: 500 },
    );
  }
}