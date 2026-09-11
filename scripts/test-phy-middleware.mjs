/**
 * Offline gate tests. Does not call Cloudflare or Supabase.
 */
import assert from "node:assert/strict";
import { shouldAllowRequest } from "../functions/_middleware.js";

function req({ dest, referer, url = "https://uni-s3-phy.pages.dev/notes/reflection-en.pdf" }) {
  const headers = new Headers();
  if (dest !== undefined && dest !== null) headers.set("Sec-Fetch-Dest", dest);
  if (referer) headers.set("Referer", referer);
  return new Request(url, { headers });
}

function check(name, fn) {
  fn();
  console.log("ok  " + name);
}

check("iframe from UniPlus still allowed", () => {
  assert.equal(
    shouldAllowRequest(
      req({ dest: "iframe", referer: "https://uni-education-elearning.pages.dev/subject/phy" }),
    ),
    true,
  );
});

check("notes preview iframe from Phy hub allowed", () => {
  assert.equal(
    shouldAllowRequest(
      req({ dest: "iframe", referer: "https://uni-s3-phy.pages.dev/" }),
    ),
    true,
  );
});

check("Chrome PDF viewer refetch as document from Phy hub is allowed", () => {
  assert.equal(
    shouldAllowRequest(
      req({ dest: "document", referer: "https://uni-s3-phy.pages.dev/" }),
    ),
    true,
  );
});

check("Open PDF in new tab from hub is allowed", () => {
  assert.equal(
    shouldAllowRequest(
      req({ dest: "document", referer: "https://uni-s3-phy.pages.dev/#/optics/notes" }),
    ),
    true,
  );
});

check("HEAD/fetch probe of a note is allowed", () => {
  assert.equal(
    shouldAllowRequest(req({ dest: "empty", referer: "https://uni-s3-phy.pages.dev/" })),
    true,
  );
});

check("direct document visit without referer is still gated", () => {
  assert.equal(shouldAllowRequest(req({ dest: "document", referer: "" })), false);
});

check("direct visit with missing Sec-Fetch-Dest is still gated", () => {
  assert.equal(shouldAllowRequest(req({ dest: null, referer: "" })), false);
});

check("untrusted referer document visit is gated", () => {
  assert.equal(
    shouldAllowRequest(req({ dest: "document", referer: "https://evil.example/" })),
    false,
  );
});

console.log("all passed");
