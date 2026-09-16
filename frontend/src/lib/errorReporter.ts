export function initErrorReporter() {
  if (typeof window === 'undefined') return;

  const reportUrl = process.env.NEXT_PUBLIC_RUNTIME_ERROR_REPORT_URL;
  if (!reportUrl) return;

  const getAppId = () => {
    if (process.env.NEXT_PUBLIC_APP_ID) return process.env.NEXT_PUBLIC_APP_ID;
    const match = window.location.hostname.match(/^preview-([^.]+)/);
    return match ? match[1] : window.location.hostname;
  };

  const send = (payload: Record<string, string>) => {
    try {
      fetch(reportUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ app_id: getAppId(), ...payload }),
      }).catch(() => {});
    } catch {}
  };

  window.onerror = (message, source, _l, _c, error) => {
    send({ message: String(message), stack: error?.stack || '', url: source || '', user_agent: navigator.userAgent });
  };

  window.onunhandledrejection = (event) => {
    const err = event.reason;
    send({ message: String(err?.message || err), stack: err?.stack || '', url: window.location.href, user_agent: navigator.userAgent });
  };

  const origError = console.error;
  console.error = (...args: any[]) => {
    origError.apply(console, args);
    send({ message: args.map(String).join(' '), stack: '', url: window.location.href, user_agent: navigator.userAgent });
  };
}