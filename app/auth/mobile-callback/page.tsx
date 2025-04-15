'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getSession } from 'next-auth/react';

export default function MobileCallback() {
  const router = useRouter();

  useEffect(() => {
    const handleAuth = async () => {
      try {
        const session = await getSession();
        
        if (session?.token) {
          // Encode token for URL safety
          const encodedToken = encodeURIComponent(JSON.stringify(session.token));
          
          // Redirect back to app with token
          window.location.href = `com.example.vidyastraa_app://auth-callback?token=${encodedToken}`;
        } else {
          router.push('/auth/signin');
        }
      } catch (error) {
        console.error('Mobile callback error:', error);
        router.push('/auth/signin');
      }
    };

    handleAuth();
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Redirecting to app...</h1>
        <p className="text-gray-600">Please wait while we transfer your session</p>
      </div>
    </div>
  );
}