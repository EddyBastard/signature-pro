(function () {
  "use strict";
  var $ = function (q, s) { return (s || document).querySelector(q); };
  var $$ = function (q, s) { return Array.prototype.slice.call((s || document).querySelectorAll(q)); };
  var esc = function (v) { return String(v == null ? "" : v).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); };
  function safe(fn, n) { try { fn(); } catch (e) { console.warn("[" + n + "]", e); } }
  var F = "Arial,Helvetica,sans-serif";
  var S = { tpl: "classic", ico: "circle", color: "#2563eb", photo: "" };
  var NET = [["li", "in", "LinkedIn"], ["ig", "ig", "Instagram"], ["fb", "f", "Facebook"], ["x", "X", "X"], ["yt", "yt", "YouTube"]];
  var url = function (v) { return /^(https?:|mailto:|tel:)/i.test(v) ? v : "https://" + v; };

  function data() {
    var d = {};
    $$("[data-f]").forEach(function (e) { d[e.dataset.f] = e.value.trim(); });
    d.img = d.imgurl || S.photo;
    return d;
  }
  function head(d, c) {
    var sub = [d.role, d.company].filter(Boolean).map(esc).join(" &middot; ");
    return (d.name ? '<div style="font:bold 17px ' + F + ";color:" + c + ';margin:0 0 2px">' + esc(d.name) + "</div>" : "") +
      (sub ? '<div style="font:13px ' + F + ';color:#555555;margin:0 0 8px">' + sub + "</div>" : "");
  }
  function contacts(d, c, inline) {
    var a = [];
    if (d.phone) a.push(["T", '<a href="tel:' + esc(d.phone.replace(/[^\d+]/g, "")) + '" style="color:#333333;text-decoration:none">' + esc(d.phone) + "</a>"]);
    if (d.email) a.push(["E", '<a href="mailto:' + esc(d.email) + '" style="color:#333333;text-decoration:none">' + esc(d.email) + "</a>"]);
    if (d.web) a.push(["W", '<a href="' + esc(url(d.web)) + '" style="color:' + c + ';text-decoration:none">' + esc(d.web.replace(/^https?:\/\//i, "")) + "</a>"]);
    if (!a.length) return "";
    var it = a.map(function (p) { return '<span style="color:' + c + ';font-weight:bold">' + p[0] + "</span>&nbsp; " + p[1]; });
    return '<div style="font:13px/1.6 ' + F + ';color:#333333">' + it.join(inline ? " &nbsp;|&nbsp; " : "<br>") + "</div>";
  }
  function social(d, c, st) {
    var l = NET.filter(function (n) { return d[n[0]]; });
    if (!l.length) return "";
    var body;
    if (st === "text") {
      body = l.map(function (n) { return '<a href="' + esc(url(d[n[0]])) + '" style="font:bold 12px ' + F + ";color:" + c + ';text-decoration:none">' + n[2] + "</a>"; }).join(" &nbsp;/&nbsp; ");
    } else {
      body = '<table cellpadding="0" cellspacing="0" border="0"><tr>' + l.map(function (n) {
        return '<td width="26" height="26" align="center" bgcolor="' + c + '" style="border-radius:' + (st === "circle" ? "50%" : "4px") + '"><a href="' + esc(url(d[n[0]])) + '" style="display:block;font:bold 11px/26px ' + F + ';color:#ffffff;text-decoration:none">' + n[1] + '</a></td><td width="6"></td>';
      }).join("") + "</tr></table>";
    }
    return '<div style="margin-top:10px">' + body + "</div>";
  }
  function img(d, r) {
    return d.img ? '<img src="' + esc(d.img) + '" width="84" height="84" alt="" style="display:block;width:84px;height:84px;border-radius:' + r + ';object-fit:cover">' : "";
  }
  function build() {
    var d = data(), c = S.color, i = img(d, S.tpl === "modern" ? "8px" : "50%");
    var body = head(d, c) + contacts(d, c, S.tpl === "minimal") + social(d, c, S.ico);
    var w = 'cellpadding="0" cellspacing="0" border="0" style="font-family:' + F + '"';
    if (S.tpl === "modern") return "<table " + w + '><tr><td width="4" bgcolor="' + c + '"></td><td width="14"></td>' + (i ? '<td valign="top" style="padding-right:14px">' + i + "</td>" : "") + '<td valign="top">' + body + "</td></tr></table>";
    if (S.tpl === "minimal") return "<table " + w + "><tr>" + (i ? '<td valign="middle" style="padding-right:14px">' + i + "</td>" : "") + '<td valign="middle">' + head(d, c) + '</td></tr><tr><td colspan="2" style="border-top:2px solid ' + c + ';padding-top:8px">' + contacts(d, c, true) + social(d, c, S.ico) + "</td></tr></table>";
    return "<table " + w + "><tr>" + (i ? '<td valign="top" style="padding-right:16px">' + i + "</td>" : "") + '<td valign="top"' + (i ? ' style="border-left:2px solid ' + c + ';padding-left:16px"' : "") + ">" + body + "</td></tr></table>";
  }
  function render() { var h = build(); $("#sigOut").innerHTML = h; $("#code").value = h; }

  function pressed(group, attr, val) {
    $$("button", $(group)).forEach(function (b) { b.setAttribute("aria-pressed", String(b.getAttribute(attr) === val)); });
  }
  function msg(t, bad) { var m = $("#msg"); m.textContent = t; m.style.color = bad ? "#b91c1c" : "#15803d"; setTimeout(function () { m.textContent = ""; }, 3500); }
  function pop() { setTimeout(function () { var d = $("#adPop"); if (d && d.showModal && !d.open) d.showModal(); }, 350); }
  function done() { msg("✓ ¡Firma copiada! Pégala en los ajustes de tu correo."); pop(); }

  function copy() {
    var h = build();
    var fallback = function () {
      var r = document.createRange(), sel = window.getSelection();
      r.selectNode($("#sigOut")); sel.removeAllRanges(); sel.addRange(r);
      var ok = false;
      try { ok = document.execCommand("copy"); } catch (e) {}
      sel.removeAllRanges();
      if (ok) done(); else msg("No se pudo copiar. Usa “Ver código HTML” o descarga el archivo.", true);
    };
    if (navigator.clipboard && window.ClipboardItem) {
      navigator.clipboard.write([new ClipboardItem({
        "text/html": new Blob([h], { type: "text/html" }),
        "text/plain": new Blob([$("#sigOut").innerText], { type: "text/plain" })
      })]).then(done, fallback);
    } else fallback();
  }
  function download() {
    var h = '<!doctype html><html><head><meta charset="utf-8"><title>Firma de correo</title></head><body>' + build() + "</body></html>";
    var a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([h], { type: "text/html" }));
    a.download = "firma-correo.html";
    document.body.appendChild(a); a.click(); a.remove();
    msg("✓ Archivo descargado."); pop();
  }
  function photo(f) {
    if (!f) return;
    var r = new FileReader();
    r.onload = function () {
      var im = new Image();
      im.onload = function () {
        var k = 168, cv = document.createElement("canvas"), m = Math.min(im.width, im.height);
        cv.width = cv.height = k;
        cv.getContext("2d").drawImage(im, (im.width - m) / 2, (im.height - m) / 2, m, m, 0, 0, k, k);
        S.photo = cv.toDataURL("image/jpeg", 0.85);
        $("#photoNote").hidden = false; render();
      };
      im.src = r.result;
    };
    r.readAsDataURL(f);
  }

  function boot() {
    safe(function () {
      $$("[data-f]").forEach(function (e) { e.addEventListener("input", render); });
      $("#tpl").addEventListener("click", function (e) { var b = e.target.closest("[data-tpl]"); if (!b) return; S.tpl = b.dataset.tpl; pressed("#tpl", "data-tpl", S.tpl); render(); });
      $("#ico").addEventListener("click", function (e) { var b = e.target.closest("[data-ico]"); if (!b) return; S.ico = b.dataset.ico; pressed("#ico", "data-ico", S.ico); render(); });
      $(".colors").addEventListener("click", function (e) { var b = e.target.closest("[data-c]"); if (!b) return; S.color = b.dataset.c; $("#color").value = S.color; render(); });
      $("#color").addEventListener("input", function (e) { S.color = e.target.value; render(); });
      $("#tabs").addEventListener("click", function (e) {
        var b = e.target.closest("[data-client]"); if (!b) return;
        $("#frame").dataset.client = b.dataset.client; $("#cname").textContent = b.textContent;
        pressed("#tabs", "data-client", b.dataset.client);
      });
      $("#file").addEventListener("change", function (e) { photo(e.target.files[0]); });
      $("#copy").addEventListener("click", copy);
      $("#dl").addEventListener("click", download);
    }, "events");
    safe(function () {
      var d = $("#adPop");
      $$("[data-close]", d).forEach(function (b) { b.addEventListener("click", function () { d.close(); }); });
      d.addEventListener("click", function (e) { if (e.target === d) d.close(); });
    }, "popup");
    safe(function () {
      var t = $("#adToast"), shown = false;
      try { shown = sessionStorage.getItem("sp_toast") === "1"; } catch (e) {}
      $(".x", t).addEventListener("click", function () { t.hidden = true; try { sessionStorage.setItem("sp_toast", "1"); } catch (e) {} });
      if (!shown) setTimeout(function () { t.hidden = false; }, 6000);
    }, "toast");
    safe(render, "render");
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot); else boot();
})();
