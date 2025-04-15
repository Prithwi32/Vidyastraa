import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const token = await getToken({ req: request });
  
  if (!token) {
    return NextResponse.redirect(new URL('/auth/signin', request.url));
  }

  // Create a minimal token payload
  const mobileToken = {
    accessToken: token.accessToken,
    id: token.id,
    expires: token.exp
  };

  return new Response(`
    <html>
      <head>
        <title>Redirecting to App</title>
      </head>
      <body>
        <script>
          try {
            const tokenData = ${JSON.stringify(mobileToken)};
            // Store in localStorage
            localStorage.setItem('next-auth.session-token', JSON.stringify(tokenData));
            // Set cookie as fallback
            document.cookie = '__Secure-next-auth.session-token=' + 
              encodeURIComponent(JSON.stringify(tokenData)) + 
              '; path=/; SameSite=None; Secure; domain=${process.env.NODE_ENV === 'production' ? '.vidyastraa-jeeneet.vercel.app' : ''}';
            
            // Redirect to app with token
            window.location.href = '${APP_REDIRECT_SCHEME}://auth?token=' + 
              encodeURIComponent(JSON.stringify(tokenData));
          } catch(e) {
            console.error('Mobile callback error:', e);
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