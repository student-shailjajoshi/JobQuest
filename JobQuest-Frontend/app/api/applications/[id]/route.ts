import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

type RouteContext = {
  params: Promise<{ id: string }>;
};

async function forwardRequest(
  request: NextRequest,
  context: RouteContext,
  method: "GET" | "PATCH" | "PUT" | "DELETE",
) {
  try {
    const { id } = await context.params;

    if (!/^[a-f\d]{24}$/i.test(id)) {
      return NextResponse.json(
        { success: false, message: "Invalid application ID." },
        { status: 400 },
      );
    }

    const cookieStore = await cookies();
    const token = cookieStore.get("jobquest_token")?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, message: "Please sign in to continue." },
        { status: 401 },
      );
    }

    const headers: HeadersInit = {
      Authorization: `Bearer ${token}`,
    };

    const options: RequestInit = {
      method,
      headers,
      cache: "no-store",
    };

    if (method === "PATCH" || method === "PUT") {
      const body = await request.json();

      headers["Content-Type"] = "application/json";
      options.body = JSON.stringify(body);
    }

    const response = await fetch(
      `${API_BASE_URL}/applications/${id}`,
      options,
    );

    if (response.status === 204) {
      return new NextResponse(null, { status: 204 });
    }

    const data = await response.json().catch(() => null);

    return NextResponse.json(
      data ?? {
        success: false,
        message: "Unable to process the application request.",
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

export async function GET(
  request: NextRequest,
  context: RouteContext,
) {
  return forwardRequest(request, context, "GET");
}

export async function PATCH(
  request: NextRequest,
  context: RouteContext,
) {
  return forwardRequest(request, context, "PATCH");
}

export async function PUT(
  request: NextRequest,
  context: RouteContext,
) {
  return forwardRequest(request, context, "PUT");
}

export async function DELETE(
  request: NextRequest,
  context: RouteContext,
) {
  return forwardRequest(request, context, "DELETE");
}