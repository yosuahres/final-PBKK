import { NextResponse } from "next/server";
import db from "@/lib/db";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  const { email, password, role } = await request.json();

  try {
    // Check if the user already exists
    const [existingUser] = await db.query("SELECT * FROM users WHERE email = ?", [email]);
    if ((existingUser as any).length > 0) {
      return NextResponse.json({ message: "User already exists." }, { status: 400 });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user into the database with role
    await db.query("INSERT INTO users (email, password, role) VALUES (?, ?, ?)", [email, hashedPassword, role]);

    return NextResponse.json({ message: "User registered successfully." }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: "Error creating user.", error }, { status: 500 });
  }
}