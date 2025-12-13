'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function CrmAutomationsRedirect() {
    const router = useRouter();

    useEffect(() => {
        router.replace('/crm-automation');
    }, [router]);

    return (
        <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100vh',
            background: '#0F1220',
            color: '#fff'
        }}>
            <p>Redirecting...</p>
        </div>
    );
}
