import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    console.log("Form submission received:", {
      timestamp: new Date().toISOString(),
      data: body,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Form data received and logged successfully",
        timestamp: new Date().toISOString(),
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error processing form submission:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to process form submission",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
