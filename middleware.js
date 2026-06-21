// Vercel Edge Middleware — protects /studio with server-side HTTP Basic Auth.
//
// Credentials live ONLY in the STUDIO_USER / STUDIO_PASS environment variables
// (set them in the Vercel dashboard → Project → Settings → Environment Variables).
// Nothing secret is stored in the repository, and because this runs on Vercel's
// edge BEFORE the static file is served, the gate cannot be bypassed from the browser.
//
// If the env vars are not set, access is denied by default (fail closed).

export const config = {
  matcher: ['/studio', '/studio/:path*'],
};

export default function middleware(request) {
  const expectedUser = process.env.STUDIO_USER;
  const expectedPass = process.env.STUDIO_PASS;
  const auth = request.headers.get('authorization');

  if (expectedUser && expectedPass && auth && auth.startsWith('Basic ')) {
    try {
      const decoded = atob(auth.slice(6));
      const sep = decoded.indexOf(':');
      const user = decoded.slice(0, sep);
      const pass = decoded.slice(sep + 1);
      if (user === expectedUser && pass === expectedPass) {
        return; // authenticated — continue to the requested file
      }
    } catch (_) {
      // malformed header — fall through to 401
    }
  }

  return new Response('Authentication required.', {
    status: 401,
    headers: {
      'WWW-Authenticate': 'Basic realm="Studio", charset="UTF-8"',
    },
  });
}
