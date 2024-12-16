import { NextResponse } from "next/server";
import db from "@/lib/db"; // Ensure this path is correct and db is properly configured

export async function GET() {
  try {
    const [rows] = await db.query("SELECT * FROM jobs");
    return NextResponse.json(rows);
  } catch (error) {
    return NextResponse.json({ message: "Error fetching jobs.", error }, { status: 500 });
  }
}