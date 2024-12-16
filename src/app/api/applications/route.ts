import { NextRequest, NextResponse } from 'next/server';
import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'your_db_password',
  database: 'your_db_name',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'ID is required' }, { status: 400 });
  }

  try {
    const connection = await pool.getConnection();
    const query = 'DELETE FROM applications WHERE id = ?';
    await connection.execute(query, [id]);
    connection.release();

    return NextResponse.json({ message: 'Application deleted successfully' }, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}