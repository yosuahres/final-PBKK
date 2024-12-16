const mysql = require('mysql2/promise');

const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'authApp',
};

const jobs = [
  {
    title: 'Software Engineer',
    location: 'San Francisco, CA',
    description: 'As a Software Engineer at Tech Corp, you will be responsible for developing and maintaining web applications. You will work closely with our product and design teams to create user-friendly and efficient software solutions. Your role will involve writing clean, scalable code, debugging and testing applications, and collaborating with other engineers to improve our development processes.',
    company_name: 'Tech Corp',
    salaries: '120000',
    types: 'Tech',
    company_description: 'A leading tech company.',
  },
  {
    title: 'Data Scientist',
    location: 'New York, NY',
    description: 'As a Data Scientist at Data Inc, you will analyze and interpret complex data to help our company make informed decisions. You will use statistical methods and machine learning techniques to uncover patterns and insights from large datasets. Your responsibilities will include data cleaning, model building, and presenting findings to stakeholders.',
    company_name: 'Data Inc',
    salaries: '110000',
    types: 'Tech',
    company_description: 'A data-driven company.',
  },
  {
    title: 'Product Manager',
    location: 'Austin, TX',
    description: 'As a Product Manager at Product Co, you will oversee the development and launch of new products. You will work with cross-functional teams to define product requirements, create roadmaps, and ensure timely delivery. Your role will involve market research, user feedback analysis, and prioritizing features to meet business goals.',
    company_name: 'Product Co',
    salaries: '130000',
    types: 'Tech',
    company_description: 'A product-focused company.',
  },
  {
    title: 'UX Designer',
    location: 'Seattle, WA',
    description: 'As a UX Designer at Design Studio, you will design user-friendly interfaces for our digital products. You will conduct user research, create wireframes and prototypes, and collaborate with developers to implement your designs. Your goal will be to enhance the user experience and ensure our products are intuitive and visually appealing.',
    company_name: 'Design Studio',
    salaries: '90000',
    types: 'Design',
    company_description: 'A creative design studio.',
  },
  {
    title: 'DevOps Engineer',
    location: 'Boston, MA',
    description: 'As a DevOps Engineer at Infra Solutions, you will manage our infrastructure and deployment processes. You will automate workflows, monitor system performance, and ensure the reliability and scalability of our applications. Your role will involve working with development teams to integrate DevOps practices and improve our CI/CD pipelines.',
    company_name: 'Infra Solutions',
    salaries: '115000',
    types: 'Tech',
    company_description: 'An infrastructure solutions company.',
  },
  {
    title: 'Marketing Specialist',
    location: 'Chicago, IL',
    description: 'As a Marketing Specialist at Marketing Experts, you will develop and execute marketing strategies to promote our products and services. You will create content, manage social media campaigns, and analyze marketing data to measure effectiveness. Your responsibilities will include market research, competitor analysis, and identifying new opportunities for growth.',
    company_name: 'Marketing Experts',
    salaries: '80000',
    types: 'Marketing',
    company_description: 'A marketing consultancy.',
  },
  {
    title: 'Sales Manager',
    location: 'Los Angeles, CA',
    description: 'As a Sales Manager at Sales Pros, you will lead our sales team to achieve revenue targets. You will develop sales strategies, manage client relationships, and provide training and support to your team. Your role will involve setting sales goals, tracking performance, and identifying new business opportunities.',
    company_name: 'Sales Pros',
    salaries: '95000',
    types: 'Sales',
    company_description: 'A sales-driven company.',
  },
  {
    title: 'HR Manager',
    location: 'Denver, CO',
    description: 'As an HR Manager at HR Solutions, you will manage all aspects of human resources, including recruitment, employee relations, and performance management. You will develop HR policies, oversee employee benefits, and ensure compliance with labor laws. Your role will involve supporting employee development and fostering a positive work environment.',
    company_name: 'HR Solutions',
    salaries: '85000',
    types: 'HR',
    company_description: 'A human resources consultancy.',
  },
  {
    title: 'Customer Support',
    location: 'Miami, FL',
    description: 'As a Customer Support representative at Support Hub, you will provide assistance to our customers via phone, email, and chat. You will resolve issues, answer questions, and ensure customer satisfaction. Your responsibilities will include documenting support interactions, escalating complex issues, and contributing to our knowledge base.',
    company_name: 'Support Hub',
    salaries: '60000',
    types: 'Support',
    company_description: 'A customer support company.',
  },
  {
    title: 'Finance Analyst',
    location: 'San Diego, CA',
    description: 'As a Finance Analyst at Finance Experts, you will analyze financial data to support business decisions. You will create financial models, prepare reports, and provide insights on financial performance. Your role will involve budgeting, forecasting, and identifying cost-saving opportunities.',
    company_name: 'Finance Experts',
    salaries: '105000',
    types: 'Finance',
    company_description: 'A financial consultancy.',
  },
];

async function insertJobs() {
  try {
    const connection = await mysql.createConnection(dbConfig);
    const insertQuery = 'INSERT INTO jobs (title, location, description, company_name, salaries, types, company_description) VALUES (?, ?, ?, ?, ?, ?, ?)';

    for (const job of jobs) {
      await connection.execute(insertQuery, [
        job.title,
        job.location,
        job.description,
        job.company_name,
        job.salaries,
        job.types,
        job.company_description,
      ]);
    }

    await connection.end();
    console.log('Jobs inserted successfully.');
  } catch (error) {
    console.error('Failed to insert jobs:', error);
  }
}

insertJobs();