// src/pages/api/apply.ts

import { NextApiRequest, NextApiResponse } from 'next';
import db from '@/lib/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { name, email, phone, coverLetter, jobDetails } = req.body;

    try {
      // Store the application data in the database
      await db.query(
        'INSERT INTO applications (name, email, phone, coverLetter, jobId, jobTitle, jobLocation, jobDescription) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [name, email, phone, coverLetter, jobDetails.id, jobDetails.title, jobDetails.location, jobDetails.description]
      );

      res.status(200).json({ message: 'Application submitted successfully' });
    } catch (error) {
      console.error('Error submitting application:', error);
      res.status(500).json({ message: 'Error submitting application', error });
    }
  } else if (req.method === 'GET') {
    try {
      const [rows] = await db.query('SELECT * FROM applications');
      res.status(200).json(rows);
    } catch (error) {
      console.error('Error fetching applications:', error);
      res.status(500).json({ message: 'Error fetching applications', error });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}