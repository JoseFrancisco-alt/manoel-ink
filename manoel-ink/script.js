/* =========================================================
   CONTEÚDO — edite aqui. Coloque as fotos na pasta img/
   e preencha "photos" com os caminhos (ex.: "img/t01-1.jpg").
   Lista vazia = mostra o placeholder.
   ========================================================= */
const WHATSAPP = ""; // só números com DDI+DDD, ex.: "5582999999999"

// Fotos tiradas do Instagram @manoel.ink (out/2026). Trocar pelos originais em alta quando ele mandar.
const WORKS = [
  { title: "Blackwork autoral",  place: "Braço · Anime",                    cat: "geek",      photos: ["img/t01-1.jpg", "img/t01-2.jpg"] },
  { title: "Shenlong",           place: "Antebraço · Anime",                cat: "geek",      photos: ["img/t04-1.jpg"] },
  { title: "Dragão",             place: "Antebraço · Blackwork",            cat: "blackwork", photos: ["img/t02-1.jpg"] },
  { title: "Homenagem",          place: "Braço · Fine line",                cat: "fineline",  photos: ["img/t03-1.jpg", "img/t03-2.jpg"] },
  { title: "Anjo caído",         place: "Antebraço · Blackwork + vermelho", cat: "blackwork", photos: ["img/t06-1.jpg"] },
  { title: "Floral",             place: "Costas · Fine line",               cat: "fineline",  photos: ["img/t07-1.jpg"] },
  { title: "Kanji",              place: "Antebraço · Lettering",            cat: "fineline",  photos: ["img/t08-1.jpg"] },
  { title: "CyberTribal",        place: "Mão · Blackwork",                  cat: "blackwork", photos: ["img/t09-1.jpg"] },
  { title: "Suminagashi",        place: "Antebraço · Blackwork + vermelho", cat: "blackwork", photos: ["img/t10-1.jpg"] },
  { title: "Amor",               place: "Antebraço · Lettering",            cat: "fineline",  photos: ["img/t11-1.jpg", "img/t11-2.jpg"] },
  { title: "Máscara oriental",   place: "Antebraço · Oriental",             cat: "geek",      photos: ["img/t12-1.jpg", "img/t12-2.jpg"] },
  { title: "Homenagem ao BK",    place: "Braço · Retrato",                  cat: "blackwork", photos: ["img/t05-1.jpg"] },
];

const HEALED = [
  { name: "Peça 01", before: "", after: "" },
  { name: "Peça 02", before: "", after: "" },
  { name: "Peça 03", before: "", after: "" },
];

const FLASHES = [
  { name: "[Nome do flash]", size: "≈ 8 cm",  price: "[VALOR]", available: true,  img: "" },
  { name: "[Nome do flash]", size: "≈ 12 cm", price: "[VALOR]", available: true,  img: "" },
  { name: "[Nome do flash]", size: "≈ 15 cm", price: "[VALOR]", available: false, img: "" },
  { name: "[Nome do flash]", size: "≈ 10 cm", price: "[VALOR]", available: true,  img: "" },
];

/* ========================================================= */

const $ = (s, el = document) => el.querySelector(s);
const waLink = (text) => `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(text)}`;
const media = (src, label) => src
  ? `<img src="${src}" alt="${label}" loading="lazy">`
  : `<div class="ph"><span>${label}</span></div>`;

/* nav mobile */
const burger = $("#burger"), navLinks = $("#navLinks");
burger.addEventListener("click", () => {
  const open = navLinks.classList.toggle("open");
  burger.setAttribute("aria-expanded", open);
});
navLinks.addEventListener("click", (e) => {
  if (e.target.tagName === "A") { navLinks.classList.remove("open"); burger.setAttribute("aria-expanded", false); }
});

/* trabalhos */
const worksEl = $("#works");
worksEl.innerHTML = WORKS.map((w, i) => `
  <button class="work reveal" data-cat="${w.cat}" data-i="${i}">
    <div class="work-media">
      ${w.photos.length > 1 ? `<span class="work-count">1/${w.photos.length}</span>` : ""}
      ${media(w.photos[0], "Foto")}
    </div>
    <h3>${w.title}</h3>
    <p>${w.place}</p>
  </button>`).join("");

function updateCount() {
  const n = worksEl.querySelectorAll(".work:not(.hide)").length;
  $("#worksCount").textContent = `Mostrando ${n} trabalho${n === 1 ? "" : "s"} · clique numa foto pra ver o post completo`;
}
updateCount();

$("#filters").addEventListener("click", (e) => {
  const btn = e.target.closest(".chip");
  if (!btn) return;
  document.querySelectorAll(".chip").forEach((c) => c.classList.toggle("active", c === btn));
  const f = btn.dataset.filter;
  worksEl.querySelectorAll(".work").forEach((w, i) => {
    const show = f === "all" || w.dataset.cat === f;
    w.classList.toggle("hide", !show);
    w.classList.remove("enter");
    if (show) { void w.offsetWidth; w.style.animationDelay = `${(i % 6) * 40}ms`; w.classList.add("enter"); }
  });
  updateCount();
});

/* lightbox */
const lb = $("#lightbox");
let cur = { work: 0, photo: 0 };
function renderLb() {
  const w = WORKS[cur.work];
  const total = Math.max(w.photos.length, 1);
  $("#lbImg").innerHTML = media(w.photos[cur.photo], `Foto ${cur.photo + 1} do post`);
  $("#lbTitle").textContent = `${w.title} — ${w.place}`;
  $("#lbCount").textContent = `${cur.photo + 1} / ${total}`;
}
function step(d) {
  const w = WORKS[cur.work];
  const next = cur.photo + d;
  if (next >= 0 && next < w.photos.length) { cur.photo = next; }
  else {
    // passa para o próximo/anterior trabalho visível
    const visible = [...worksEl.querySelectorAll(".work:not(.hide)")].map((el) => +el.dataset.i);
    const idx = visible.indexOf(cur.work);
    cur.work = visible[(idx + d + visible.length) % visible.length];
    cur.photo = d > 0 ? 0 : Math.max(WORKS[cur.work].photos.length - 1, 0);
  }
  renderLb();
}
worksEl.addEventListener("click", (e) => {
  const card = e.target.closest(".work");
  if (!card) return;
  cur = { work: +card.dataset.i, photo: 0 };
  renderLb();
  lb.hidden = false;
  document.body.style.overflow = "hidden";
  $("#lbClose").focus();
});
function closeLb() { lb.hidden = true; document.body.style.overflow = ""; }
$("#lbClose").onclick = closeLb;
$("#lbPrev").onclick = () => step(-1);
$("#lbNext").onclick = () => step(1);
lb.addEventListener("click", (e) => { if (e.target === lb) closeLb(); });
document.addEventListener("keydown", (e) => {
  if (lb.hidden) return;
  if (e.key === "Escape") closeLb();
  if (e.key === "ArrowRight") step(1);
  if (e.key === "ArrowLeft") step(-1);
});

/* cicatrizadas — comparador */
const compare = $("#compare"), range = $("#compareRange");
const before = $(".before", compare), after = $(".after", compare), handle = $(".compare-handle", compare);
function setPos(v) { before.style.clipPath = `inset(0 ${100 - v}% 0 0)`; handle.style.left = `${v}%`; }
range.addEventListener("input", () => setPos(range.value));
function showHealed(i) {
  const h = HEALED[i];
  [[before, h.before], [after, h.after]].forEach(([el, src]) => {
    el.style.backgroundImage = src ? `url("${src}")` : "";
    el.classList.toggle("is-ph", !src);
  });
  document.querySelectorAll("#healedPick .chip").forEach((c, j) => c.classList.toggle("active", j === i));
}
$("#healedPick").innerHTML = HEALED.map((h, i) => `<button class="chip" data-i="${i}">${h.name}</button>`).join("");
$("#healedPick").addEventListener("click", (e) => { const b = e.target.closest(".chip"); if (b) showHealed(+b.dataset.i); });
showHealed(0);
// pequena "dica" de interação quando aparece na tela
new IntersectionObserver(([en], obs) => {
  if (!en.isIntersecting) return;
  obs.disconnect();
  let t = 0; const id = setInterval(() => { t += 0.05; const v = 50 + Math.sin(t * 4) * 18 * Math.max(0, 1 - t); setPos(v); range.value = v; if (t >= 1) clearInterval(id); }, 16);
}, { threshold: 0.6 }).observe(compare);

/* flashes */
$("#flashGrid").innerHTML = FLASHES.map((f, i) => {
  const n = String(i + 1).padStart(2, "0");
  const msg = `Oi, Manoel! Quero reservar o flash ${n} — ${f.name} (${f.size}).`;
  return `
  <article class="flash reveal ${f.available ? "" : "reserved"}" style="transition-delay:${i * 70}ms">
    ${media(f.img, `Desenho · flash ${n}`)}
    <div class="flash-meta">
      <h3>${f.name}</h3>
      <span class="badge ${f.available ? "" : "off"}">${f.available ? "Disponível" : "Reservado"}</span>
    </div>
    <small>${f.size} · ${f.price}</small>
    ${f.available
      ? `<a class="btn btn-red" href="${waLink(msg)}" target="_blank" rel="noopener">Quero esse</a>`
      : `<span class="btn">Já tem dono</span>`}
  </article>`;
}).join("");

/* formulário de orçamento */
const fIdea = $("#fIdea"), fPlace = $("#fPlace"), fSize = $("#fSize"), fFile = $("#fFile");
function buildMsg() {
  const idea = fIdea.value.trim() || "[sua ideia aqui]";
  let msg = `Oi, Manoel! Quero fazer uma tattoo.\nIdeia: ${idea}\nLocal: ${fPlace.value}\nTamanho: ${fSize.value}`;
  if (fFile.files[0]) msg += `\n(Vou mandar a foto de referência aqui no chat)`;
  $("#msgPreview").textContent = msg;
  $("#waBtn").href = waLink(msg);
}
[fIdea, fPlace, fSize].forEach((el) => el.addEventListener("input", buildMsg));
fFile.addEventListener("change", () => {
  const f = fFile.files[0];
  $("#uploadText").innerHTML = f
    ? `<b>✓ ${f.name}</b> · anexe essa foto no WhatsApp depois de enviar`
    : `<b>UPLOAD</b> · foto de referência (opcional)`;
  buildMsg();
});
buildMsg();
$("#waFooter").href = waLink("Oi, Manoel!");

/* reveal on scroll */
const io = new IntersectionObserver((entries) => {
  entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); } });
}, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
document.querySelectorAll(".reveal").forEach((el) => io.observe(el));

/* =========================================================
   CAMADA CRIATIVA
   ========================================================= */
const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
const finePointer = matchMedia("(hover: hover) and (pointer: fine)").matches;

/* preloader — a palavra vai sendo "tatuada" */
(() => {
  const loader = $("#loader");
  if (reduce || sessionStorageGet("seenLoader")) { loader.remove(); return; }
  document.body.classList.add("loading");
  let n = 0;
  const tick = setInterval(() => {
    n = Math.min(100, n + Math.ceil(Math.random() * 9));
    $("#loaderNum").textContent = n;
    $("#loaderFill").style.clipPath = `inset(0 ${100 - n}% 0 0)`;
    if (n >= 100) {
      clearInterval(tick);
      setTimeout(() => { loader.classList.add("done"); document.body.classList.remove("loading"); }, 250);
      setTimeout(() => loader.remove(), 1300);
      sessionStorageSet("seenLoader", "1");
    }
  }, 45);
})();
function sessionStorageGet(k) { try { return sessionStorage.getItem(k); } catch { return null; } }
function sessionStorageSet(k, v) { try { sessionStorage.setItem(k, v); } catch {} }

/* blur reveal palavra por palavra */
document.querySelectorAll("[data-blur]").forEach((el) => {
  const walk = (node) => {
    [...node.childNodes].forEach((c) => {
      if (c.nodeType === 3) {
        const frag = document.createDocumentFragment();
        c.textContent.split(/(\s+)/).forEach((part) => {
          if (!part) return;
          if (/^\s+$/.test(part)) { frag.append(part); return; }
          const s = document.createElement("span"); s.className = "w"; s.textContent = part; frag.append(s);
        });
        c.replaceWith(frag);
      } else if (c.nodeType === 1) walk(c);
    });
  };
  walk(el);
  el.querySelectorAll(".w").forEach((w, i) => (w.style.transitionDelay = `${i * 25}ms`));
  io.observe(el);
});

/* cursor customizado */
if (finePointer && !reduce) {
  document.body.classList.add("has-cursor");
  const c = $("#cursor"), dot = $("#cursorDot"), label = $("#cursorLabel");
  let x = innerWidth / 2, y = innerHeight / 2, cx = x, cy = y;
  addEventListener("mousemove", (e) => { x = e.clientX; y = e.clientY; dot.style.transform = `translate(${x}px,${y}px)`; });
  (function loop() { cx += (x - cx) * 0.18; cy += (y - cy) * 0.18; c.style.transform = `translate(${cx}px,${cy}px)`; requestAnimationFrame(loop); })();
  document.querySelectorAll(".work").forEach((el) => (el.dataset.cursor = "Ver"));
  document.querySelectorAll(".flash:not(.reserved)").forEach((el) => (el.dataset.cursor = "Quero"));
  document.addEventListener("mouseover", (e) => {
    const lab = e.target.closest("[data-cursor]");
    const hov = e.target.closest("a, button, summary, select, textarea, label");
    c.classList.toggle("label", !!lab);
    c.classList.toggle("hover", !lab && !!hov);
    label.textContent = lab ? lab.dataset.cursor : "";
  });
}

/* respingo de tinta no clique */
if (!reduce) {
  addEventListener("pointerdown", (e) => {
    if (e.target.closest("input, textarea, select")) return;
    const s = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    s.setAttribute("viewBox", "0 0 100 100"); s.classList.add("ink");
    const r = () => 30 + Math.random() * 14;
    let d = "";
    for (let i = 0; i < 10; i++) {
      const a = (i / 10) * Math.PI * 2, rr = i % 2 ? r() * .55 : r();
      d += `${i ? "L" : "M"}${50 + Math.cos(a) * rr},${50 + Math.sin(a) * rr}`;
    }
    s.innerHTML = `<path d="${d}Z" fill="${Math.random() > .5 ? "#d4211c" : "#121212"}"/>
      <circle cx="${50 + (Math.random() - .5) * 90}" cy="${50 + (Math.random() - .5) * 90}" r="4" fill="#d4211c"/>
      <circle cx="${50 + (Math.random() - .5) * 90}" cy="${50 + (Math.random() - .5) * 90}" r="2.5" fill="#121212"/>`;
    s.style.left = e.clientX + "px"; s.style.top = e.clientY + "px";
    document.body.append(s);
    setTimeout(() => s.remove(), 750);
  });
}

/* botões magnéticos */
if (finePointer && !reduce) {
  document.querySelectorAll("[data-magnetic], .nav-cta, #waBtn").forEach((b) => {
    b.addEventListener("mousemove", (e) => {
      const r = b.getBoundingClientRect();
      b.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * 0.3}px, ${(e.clientY - r.top - r.height / 2) * 0.4}px)`;
    });
    b.addEventListener("mouseleave", () => (b.style.transform = ""));
  });
}

/* parallax do hero com o mouse */
if (finePointer && !reduce) {
  const hv = $("#heroVisual");
  addEventListener("mousemove", (e) => {
    const dx = e.clientX - innerWidth / 2, dy = e.clientY - innerHeight / 2;
    hv.querySelectorAll("[data-depth]").forEach((el) => {
      const d = +el.dataset.depth;
      el.style.translate = `${dx * d}px ${dy * d}px`;
    });
    const photo = hv.querySelector(".hero-photo");
    if (photo) photo.style.translate = `${dx * -0.015}px ${dy * -0.01}px`;
  });
}

/* spotlight nas fotos dos trabalhos */
worksEl.addEventListener("mousemove", (e) => {
  const m = e.target.closest(".work-media");
  if (!m) return;
  const r = m.getBoundingClientRect();
  m.style.setProperty("--mx", `${e.clientX - r.left}px`);
  m.style.setProperty("--my", `${e.clientY - r.top}px`);
});

/* tilt card nos flashes */
if (finePointer && !reduce) {
  document.querySelectorAll(".flash").forEach((card) => {
    card.addEventListener("mousemove", (e) => {
      const r = card.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height;
      card.style.transition = "transform .1s linear, box-shadow .35s";
      card.style.transform = `rotateX(${(0.5 - py) * 14}deg) rotateY(${(px - 0.5) * 16}deg) translateZ(0)`;
      card.style.setProperty("--gx", `${px * 100}%`);
      card.style.setProperty("--gy", `${py * 100}%`);
    });
    card.addEventListener("mouseleave", () => {
      card.style.transition = "transform .6s var(--ease), box-shadow .35s";
      card.style.transform = "";
    });
  });
}

/* marquee entorta com a velocidade do scroll */
if (!reduce) {
  const mq = document.querySelector(".marquee");
  let lastY = scrollY, timer;
  addEventListener("scroll", () => {
    const v = Math.max(-2.5, Math.min(2.5, (scrollY - lastY) * 0.08));
    lastY = scrollY;
    mq.style.setProperty("--skew", `${-v}deg`);
    clearTimeout(timer);
    timer = setTimeout(() => mq.style.setProperty("--skew", "0deg"), 120);
  }, { passive: true });
}

/* contadores */
const countIO = new IntersectionObserver((entries) => {
  entries.forEach((en) => {
    if (!en.isIntersecting) return;
    countIO.unobserve(en.target);
    const el = en.target, end = +el.dataset.count, t0 = performance.now();
    if (el.dataset.suffix) el.setAttribute("data-suffix", el.dataset.suffix);
    const step = (t) => {
      const p = Math.min(1, (t - t0) / 1400);
      el.textContent = Math.round(end * (1 - Math.pow(1 - p, 3)));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  });
}, { threshold: 0.6 });
document.querySelectorAll("[data-count]").forEach((el) => countIO.observe(el));

/* letras do rodapé */
(() => {
  const logo = $("#footerLogo");
  logo.innerHTML = [..."MANOEL.INK"].map((ch) => `<span class="ch"${ch === "." ? ' style="color:var(--red)"' : ""}>${ch}</span>`).join("");
})();
