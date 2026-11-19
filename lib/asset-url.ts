export function getRuntimeBasePath(): string {
  const configured = (process.env.NEXT_PUBLIC_BASE_PATH ?? '').trim().replace(/\/$/, '');
  if (configured) return configured;

  if (typeof document !== 'undefined') {
    const nextScript = document.querySelector('script[src*="/_next/static/"]') as HTMLScriptElement | null;
    if (nextScript) {
      try {
        const pathname = new URL(nextScript.src, window.location.origin).pathname;
        const idx = pathname.indexOf('/_next/static/');
        if (idx > 0) {
          return pathname.slice(0, idx);
        }
      } catch {
        // ignore URL parse error
      }
    }
  }

  return '';
}

export function resolveAssetUrl(url: string | null | undefined): string {
  if (!url) return '';
  if (
    url.startsWith('http://') ||
    url.startsWith('https://') ||
    url.startsWith('data:') ||
    url.startsWith('blob:')
  ) {
    return url;
  }
  const basePath = getRuntimeBasePath();
  if (!basePath || !url.startsWith('/') || url.startsWith(`${basePath}/`)) {
    return url;
  }
  return `${basePath}${url}`;
}
