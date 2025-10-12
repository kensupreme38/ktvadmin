/**
 * API Route để test Supabase connection
 * Truy cập: http://localhost:9002/api/test-supabase
 */

import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const supabase = await createClient();

    // Test connection bằng cách query một bảng đơn giản
    // Nếu chưa có bảng, sẽ có error (expected)
    const { data, error } = await supabase
      .from("ktvs")
      .select("count")
      .limit(1);

    if (error) {
      // Nếu bảng chưa tồn tại
      if (
        error.code === "PGRST116" ||
        error.message.includes("does not exist")
      ) {
        return NextResponse.json(
          {
            status: "connected",
            message:
              "Supabase connection OK! Nhưng chưa có tables. Hãy tạo database schema.",
            error: error.message,
            guide: "Xem SUPABASE-GUIDE.md để tạo database schema",
          },
          { status: 200 }
        );
      }

      return NextResponse.json(
        {
          status: "error",
          message: "Supabase connection error",
          error: error.message,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      status: "success",
      message: "Supabase connection and database OK!",
      data,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        status: "error",
        message: "Failed to connect to Supabase",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
