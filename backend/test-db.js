const { Client } = require('pg');
require('dotenv').config();

const client = new Client({
    connectionString: process.env.DATABASE_URL,
});

async function testConnection() {
    try {
        console.log('Testing connection to:', process.env.DATABASE_URL.replace(/:[^:]+@/, ':****@'));
        await client.connect();
        console.log('Successfully connected to PostgreSQL!');
        const res = await client.query('SELECT NOW()');
        console.log('Current time from DB:', res.rows[0].now);
        await client.end();
    } catch (err) {
        console.error('Connection failed:', err.message);
    }
}

testConnection();
