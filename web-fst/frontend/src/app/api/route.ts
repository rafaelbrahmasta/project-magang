import { NextResponse } from 'next/server';
import mysql from 'mysql2/promise';

export async function GET() {
    try {
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            port: Number(process.env.DB_PORT) || 3306,
        });

        // Ubah 'fst_table' dengan nama tabel yang ada di database-mu
        const [rows] = await connection.execute('SELECT * FROM fst_table');
        await connection.end();

        return NextResponse.json(rows);
    } catch (error: any) {
        return NextResponse.json({ error: 'Failed to fetch data', details: error.message }, { status: 500 });
    }
}