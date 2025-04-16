export async function GET(request: Request) {
  const token = await getToken({ req: request });

  if (!token) {
    return NextResponse.redirect(new URL('/auth/signin', request.url));
  }

  const mobileToken = {
    accessToken: token.accessToken,
    id: token.id,
    expires: token.exp,
  };

  // ✅ Safely get the redirect scheme from env
  const appRedirectScheme = process.env.APP_REDIRECT_SCHEME || 'com.example.vidyastraa_app'; // fallback if needed

  return new Response(`
    <html>
      <head>
        <title>Redirecting to App</title>
      </head>
      <body>
        <script>
          try {
            const tokenData = ${JSON.stringify(mobileToken)};
            localStorage.setItem('next-auth.session-token', JSON.stringify(tokenData));
            document.cookie = '__Secure-next-auth.session-token=' + 
              encodeURIComponent(JSON.stringify(tokenData)) + 
              '; path=/; SameSite=None; Secure; domain=${process.env.NODE_ENV === 'production' ? '.vidyastraa-jeeneet.vercel.app' : ''}';

            // ✅ Use injected appRedirectScheme here
            window.location.href = '${appRedirectScheme}://auth?token=' + 
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
