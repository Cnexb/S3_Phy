const TRUSTED_REFERER_HOSTS = [
  "uni-education-elearning.pages.dev",
  "uni-s3-phy.pages.dev",
];

const GATE_HTML = `<!DOCTYPE html>
<html lang="zh-Hant" translate="no">
<head><meta charset="UTF-8"><meta name="google" content="notranslate"><title>Uni+</title></head>
<body style="text-align:center;padding:60px 20px;font-family:sans-serif;">
  <h2>請透過 Uni+ 平台登入使用</h2>
  <p>Please access this page through the Uni+ platform.</p>
</body>
</html>`;

function refererTrusted(referer) {
  if (!referer) return false;
  let hostname = "";
  try {
    hostname = new URL(referer).hostname;
  } catch {
    return TRUSTED_REFERER_HOSTS.some((h) => referer.includes(h));
  }
  return TRUSTED_REFERER_HOSTS.some(
    (h) => hostname === h || hostname.endsWith("." + h),
  );
}

/**
 * UniPlus already authenticated the parent iframe. Notes PDFs are then
 * requested as nested iframes or new tabs whose Referer is the Phy hub
 * (uni-s3-phy.pages.dev), not the platform. Those must still pass.
 */
export function shouldAllowRequest(request) {
  const dest = request.headers.get("Sec-Fetch-Dest");
  const referer = request.headers.get("Referer") || "";

  if (
    dest === "iframe" ||
    dest === "embed" ||
    dest === "object" ||
    dest === "empty"
  ) {
    return true;
  }

  if (refererTrusted(referer)) return true;

  if (dest === "document" || dest == null) return false;
  return true;
}

export async function onRequest(context) {
  const { request, next } = context;
  if (shouldAllowRequest(request)) return next();
  return new Response(GATE_HTML, {
    status: 403,
    headers: { "Content-Type": "text/html; charset=UTF-8" },
  });
}
