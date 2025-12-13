'use client';

import { Suspense } from 'react';
import { useState, FormEvent } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';

function LoginForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const callbackUrl = searchParams.get('callbackUrl') || '/admin';
    const error = searchParams.get('error');

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState(error ? 'Invalid email or password' : '');

    async function handleSubmit(e: FormEvent) {
        e.preventDefault();
        setIsLoading(true);
        setErrorMessage('');

        try {
            const result = await signIn('credentials', {
                email,
                password,
                redirect: false,
            });

            if (result?.error) {
                setErrorMessage('Invalid email or password');
                setIsLoading(false);
            } else {
                router.push(callbackUrl);
            }
        } catch {
            setErrorMessage('An error occurred. Please try again.');
            setIsLoading(false);
        }
    }

    return (
        <div className="login-card">
            <div className="login-header">
                <Image
                    src="/images/merkadagency-logo.png"
                    alt="MerkadAgency"
                    width={180}
                    height={45}
                    className="login-logo"
                />
                <h1>Admin Login</h1>
                <p>Sign in to access the dashboard</p>
            </div>

            <form onSubmit={handleSubmit} className="login-form">
                {errorMessage && (
                    <div className="login-error">
                        {errorMessage}
                    </div>
                )}

                <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="admin@merkadagency.com"
                        required
                        autoComplete="email"
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        required
                        autoComplete="current-password"
                    />
                </div>

                <button
                    type="submit"
                    className="login-button"
                    disabled={isLoading}
                >
                    {isLoading ? 'Signing in...' : 'Sign In'}
                </button>
            </form>

            <div className="login-footer">
                <a href="/">← Back to website</a>
            </div>
        </div>
    );
}

function LoginLoading() {
    return (
        <div className="login-card">
            <div className="login-header">
                <div className="loading-spinner"></div>
                <p>Loading...</p>
            </div>
        </div>
    );
}

export default function LoginPage() {
    return (
        <div className="login-page">
            <div className="login-container">
                <Suspense fallback={<LoginLoading />}>
                    <LoginForm />
                </Suspense>
            </div>
        </div>
    );
}
