import { NextRequest, NextResponse } from 'next/server';
import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'authApp',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

export async function POST(req: NextRequest) {
  const { name, email, phone, resume, coverLetter } = await req.json();

  try {
    const connection = await pool.getConnection();
    const query = `
      INSERT INTO applications (name, email, phone, resume, cover_letter)
      VALUES (?, ?, ?, ?, ?)
    `;
    const [result] = await connection.execute(query, [name, email, phone, resume, coverLetter]);
    connection.release();

    return NextResponse.json({ id: result.insertId }, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const connection = await pool.getConnection();
    const query = 'SELECT * FROM applications';
    const [rows] = await connection.execute(query);
    connection.release();

    return NextResponse.json(rows, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const jobId = searchParams.get('id');

  if (!jobId) {
    return NextResponse.json({ error: 'Job ID is required' }, { status: 400 });
  }

  try {
    const connection = await pool.getConnection();
    const query = 'DELETE FROM applications WHERE id = ?';
    await connection.execute(query, [jobId]);
    connection.release();

    return NextResponse.json({ message: 'Job deleted successfully' }, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}