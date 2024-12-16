import { NextResponse } from "next/server";
import db from "@/lib/db";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function POST(request: Request) {
  const { email, password } = await request.json();

  try {
    // Check if the user exists
    const [rows] = await db.query("SELECT * FROM users WHERE email = ?", [email]);
    const user = (rows as any)[0];
    if (!user) {
      return NextResponse.json({ message: "Invalid credentials." }, { status: 400 });
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return NextResponse.json({ message: "Invalid credentials." }, { status: 400 });
    }

    // Create a JWT token with the user's role
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET!,
      { expiresIn: "1h" }
    );

    // Set the token in an HTTP-only cookie
    const response = NextResponse.json({ message: "Login successful.", token, role: user.role }); // Include role in response body
    response.cookies.set("token", token, {
      httpOnly: true,
      path: "/",
      maxAge: 60 * 60, // 1 hour
    });

    return response;
  } catch (error) {
    return NextResponse.json({ message: "Internal server error." }, { status: 500 });
  }
}