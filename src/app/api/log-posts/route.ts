import { NextRequest, NextResponse } from 'next/server';

const WORDPRESS_API_URL = 'https://merkadagency.com/wp-json/wp/v2';

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const queryString = searchParams.toString();

    try {
        const response = await fetch(`${WORDPRESS_API_URL}/posts?${queryString}`, {
            headers: {
                'Content-Type': 'application/json',
            },
            next: { revalidate: 60 } // Cache for 1 minute
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch posts: ${response.status}`);
        }

        const data = await response.json();

        // Create response with headers to key pagination info
        const res = NextResponse.json(data);

        const totalPages = response.headers.get('X-WP-TotalPages');
        const total = response.headers.get('X-WP-Total');

        if (totalPages) res.headers.set('X-WP-TotalPages', totalPages);
        if (total) res.headers.set('X-WP-Total', total);

        return res;
    } catch (error) {
        console.error('Error proxying posts:', error);
        return NextResponse.json([], { status: 500 });
    }
}
