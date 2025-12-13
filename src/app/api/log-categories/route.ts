import { NextResponse } from 'next/server';

const WORDPRESS_API_URL = 'https://merkadagency.com/wp-json/wp/v2';

export async function GET() {
    try {
        const response = await fetch(`${WORDPRESS_API_URL}/categories?per_page=100`, {
            headers: {
                'Content-Type': 'application/json',
            },
            next: { revalidate: 3600 } // Cache for 1 hour
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch categories: ${response.status}`);
        }

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error('Error proxying categories:', error);
        return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 });
    }
}
