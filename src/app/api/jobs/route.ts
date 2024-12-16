import { NextResponse } from 'next/server';
import mysql from 'mysql2/promise';

const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'authApp',
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const title = searchParams.get('title') || '';
  const location = searchParams.get('location') || '';
  const industry = searchParams.get('industry') || '';
  const typesOnly = searchParams.get('typesOnly') === 'true';

  try {
    const connection = await mysql.createConnection(dbConfig);
    let query = '';
    let params = [];

    if (typesOnly) {
      query = 'SELECT DISTINCT types FROM jobs';
    } else {
      query = 'SELECT id, title, location, description, company_name, salaries, types, company_description FROM jobs WHERE title LIKE ? AND location LIKE ? AND types LIKE ?';
      params = [`%${title}%`, `%${location}%`, `%${industry}%`];
    }

    const [rows] = await connection.execute(query, params);
    await connection.end();
    return NextResponse.json(rows);
  } catch (error) {
    console.error('Failed to fetch jobs:', error);
    return NextResponse.json({ error: 'Failed to fetch jobs' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { title, location, description, company_name, salaries, types, company_description } = await request.json();
    console.log('Received data:', { title, location, description, company_name, salaries, types, company_description });

    const connection = await mysql.createConnection(dbConfig);
    const [result] = await connection.execute(
      'INSERT INTO jobs (title, location, description, company_name, salaries, types, company_description) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [title, location, description, company_name, salaries, types, company_description]
    );
    await connection.end();

    console.log('Insert result:', result);
    return NextResponse.json({ id: result.insertId, title, location, description, company_name, salaries, types, company_description });
  } catch (error) {
    console.error('Failed to insert job:', error);
    return NextResponse.json({ error: 'Failed to insert job' }, { status: 500 });
  }
}