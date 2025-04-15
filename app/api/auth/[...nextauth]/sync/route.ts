import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const token = await getToken({ req: request });
  
  if (!token) {
    return NextResponse.redirect(new URL('/auth/signin', request.url));
  }

  return new Response(`
    <html>
      <body>
        <script>
          try {
            // Store token in localStorage
            localStorage.setItem('next-auth.session-token', ${JSON.stringify(token)});
            // Set cookie as fallback
            document.cookie = 'next-auth.session-token=${token.sessionToken}; path=/; SameSite=Lax; Secure';
            // Redirect to dashboard
            window.location.href = '/student/dashboard';
          } catch(e) {
            console.error('Sync failed:', e);
            window.location.href = '/auth/signin';
          }
        </script>
      </body>
    </html>
  `, {
    headers: {
      'Content-Type': 'text/html',
    },
  });
}