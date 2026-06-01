"""Tiny dev server that mimics Vercel cleanUrls behavior.

Serves files from ./public, maps /features -> /features.html, redirects /features.html -> /features,
and 404s for missing files. Run: python dev-server.py 8000
"""
import sys, os, http.server, urllib.parse

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'public')

class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *a, **kw):
        super().__init__(*a, directory=ROOT, **kw)

    def _rewrite(self):
        """Return (status, body) for a redirect, or None to fall through to file serving."""
        parsed = urllib.parse.urlparse(self.path)
        path = parsed.path
        query = ('?' + parsed.query) if parsed.query else ''

        if path.endswith('.html') and path != '/index.html':
            return ('redirect', path[:-5] + query)

        if path in ('/', '/index.html'):
            self.path = '/index.html' + query
            return None

        candidate = os.path.join(ROOT, path.lstrip('/') + '.html')
        if os.path.isfile(candidate):
            self.path = path + '.html' + query
        return None

    def _send_redirect(self, location):
        self.send_response(308)
        self.send_header('Location', location)
        self.end_headers()

    def do_GET(self):
        r = self._rewrite()
        if r and r[0] == 'redirect':
            return self._send_redirect(r[1])
        return super().do_GET()

    def do_HEAD(self):
        r = self._rewrite()
        if r and r[0] == 'redirect':
            return self._send_redirect(r[1])
        return super().do_HEAD()

port = int(sys.argv[1]) if len(sys.argv) > 1 else 8000
with http.server.ThreadingHTTPServer(('127.0.0.1', port), Handler) as httpd:
    httpd.daemon_threads = True
    print(f'serving public/ at http://127.0.0.1:{port}  (clean URLs)')
    httpd.serve_forever()
