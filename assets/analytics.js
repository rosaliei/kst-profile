/* Analytics for kst-devops.com
 *
 * Inert until MEASUREMENT_ID is set — nothing loads, no cookies, no requests.
 * Paste the G-XXXXXXXXXX value from Google Analytics into MEASUREMENT_ID below
 * and it starts working on the next deploy.
 *
 * Consent: GA4 sets cookies, so Consent Mode v2 defaults to denied and nothing
 * is stored until the visitor accepts. Delete the banner block at the bottom if
 * you would rather not ask.
 */
(function () {
  "use strict";

  var MEASUREMENT_ID = "PASTE-YOUR-G-ID-HERE";
  var STORAGE_KEY = "kst-consent";

  if (MEASUREMENT_ID.indexOf("G-") !== 0) return; // not configured yet

  window.dataLayer = window.dataLayer || [];
  function gtag() { window.dataLayer.push(arguments); }
  window.gtag = gtag;

  function stored(k) {
    try { return localStorage.getItem(k); } catch (e) { return null; }
  }
  function remember(k, v) {
    try { localStorage.setItem(k, v); } catch (e) { /* private mode */ }
  }

  // ---- consent defaults: nothing stored until the visitor says yes ----
  var choice = stored(STORAGE_KEY);
  gtag("consent", "default", {
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
    analytics_storage: choice === "yes" ? "granted" : "denied",
    wait_for_update: 500,
  });

  // ---- load gtag.js ----
  var s = document.createElement("script");
  s.async = true;
  s.src = "https://www.googletagmanager.com/gtag/js?id=" + MEASUREMENT_ID;
  document.head.appendChild(s);

  gtag("js", new Date());
  gtag("config", MEASUREMENT_ID, { anonymize_ip: true });

  // ---- the two clicks worth knowing about on this site ----
  document.addEventListener("click", function (e) {
    var a = e.target.closest && e.target.closest("a");
    if (!a || !a.href) return;

    if (/excalidraw\.com/.test(a.href)) {
      gtag("event", "board_open", {
        board_url: a.href,
        from_page: location.pathname,
      });
    } else if (/\/assets\/.*\.pdf$/i.test(a.href)) {
      gtag("event", "cv_download", { file: a.href.split("/").pop() });
    }
  });

  // ---- consent banner (delete this block to stop asking) ----
  if (choice) return;

  document.addEventListener("DOMContentLoaded", function () {
    var css = document.createElement("style");
    css.textContent =
      "#kst-consent{position:fixed;left:16px;right:16px;bottom:16px;z-index:9999;" +
      "max-width:520px;margin:0 auto;background:#FFFDF7;color:#16161D;" +
      "border:3px solid #16161D;border-radius:16px;box-shadow:6px 6px 0 #16161D;" +
      "padding:16px 18px;font:400 14.5px/1.55 Inter,system-ui,sans-serif}" +
      "#kst-consent p{margin:0 0 12px}" +
      "#kst-consent .row{display:flex;gap:10px;flex-wrap:wrap}" +
      "#kst-consent button{font:700 14px Inter,system-ui,sans-serif;cursor:pointer;" +
      "border:3px solid #16161D;border-radius:11px;padding:8px 16px;" +
      "box-shadow:3px 3px 0 #16161D;background:#FFFDF7;color:#16161D}" +
      "#kst-consent button.yes{background:#FFD24C}" +
      "#kst-consent button:active{transform:translate(3px,3px);box-shadow:0 0 0 #16161D}";
    document.head.appendChild(css);

    var box = document.createElement("div");
    box.id = "kst-consent";
    box.innerHTML =
      "<p>I use Google Analytics to see which posts get read. " +
      "It sets a cookie. Nothing is stored unless you say yes.</p>" +
      '<div class="row"><button class="yes">Fine by me</button>' +
      "<button class=\"no\">No thanks</button></div>";
    document.body.appendChild(box);

    box.querySelector(".yes").onclick = function () {
      remember(STORAGE_KEY, "yes");
      gtag("consent", "update", { analytics_storage: "granted" });
      box.remove();
    };
    box.querySelector(".no").onclick = function () {
      remember(STORAGE_KEY, "no");
      box.remove();
    };
  });
})();
