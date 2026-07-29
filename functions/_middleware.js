export async function onRequest(context) {
  const { request, next } = context;

  const secFetchDest = request.headers.get('Sec-Fetch-Dest');
  const referer = request.headers.get('Referer') || '';

  const isFromMainApp = referer.includes('uni-education-elearning.pages.dev');
  const isIframe = secFetchDest === 'iframe';

  if (isIframe || isFromMainApp) {
    return next();
  }

  if (secFetchDest === 'document' || secFetchDest === null) {
    return new Response(
      `<!DOCTYPE html>
<html lang="zh-Hant">
<head><meta charset="UTF-8"><title>Uni+</title></head>
<body style="text-align:center;padding:60px 20px;font-family:sans-serif;">
  <h2>請透過 Uni+ 平台登入使用</h2>
  <p>Please access this page through the Uni+ platform.</p>
</body>
</html>`,
      { status: 403, headers: { 'Content-Type': 'text/html; charset=UTF-8' } }
    );
  }

  return next();
}
