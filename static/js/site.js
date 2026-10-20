(function () {
    const root = document.documentElement;
    root.classList.add('js');

    // ---------- language ----------
    const store = {
        get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
        set(k, v) { try { localStorage.setItem(k, v); } catch (e) { /* ignore */ } }
    };
    const urlLang = new URLSearchParams(location.search).get('lang');
    const browserLang = (navigator.language || 'tr').toLowerCase().startsWith('tr') ? 'tr' : 'en';
    setLang(urlLang || store.get('lang') || browserLang);

    function setLang(lang) {
        lang = lang === 'en' ? 'en' : 'tr';
        root.lang = lang;
        store.set('lang', lang);
        document.title = lang === 'tr'
            ? 'Dr. Tolga Büyüktanır · Yazılım Mimarisi & Yapay Zekâ'
            : 'Dr. Tolga Büyüktanır · Software Architecture & AI';
    }
    document.getElementById('langToggle').addEventListener('click', () => {
        setLang(root.lang === 'tr' ? 'en' : 'tr');
    });

    // ---------- nav ----------
    const nav = document.getElementById('nav');
    const progress = document.querySelector('.scroll-progress');
    const onScroll = () => {
        nav.classList.toggle('scrolled', window.scrollY > 20);
        const h = document.documentElement.scrollHeight - window.innerHeight;
        progress.style.width = (h > 0 ? (window.scrollY / h) * 100 : 0) + '%';
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    const menuBtn = document.getElementById('menuBtn');
    const navLinks = document.getElementById('navLinks');
    menuBtn.addEventListener('click', () => {
        const open = navLinks.classList.toggle('open');
        menuBtn.setAttribute('aria-expanded', open);
        menuBtn.innerHTML = open ? '<i class="bi bi-x-lg"></i>' : '<i class="bi bi-list"></i>';
    });
    navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
        navLinks.classList.remove('open');
        menuBtn.setAttribute('aria-expanded', 'false');
        menuBtn.innerHTML = '<i class="bi bi-list"></i>';
    }));

    // active section highlight
    const linkFor = {};
    navLinks.querySelectorAll('a[href^="#"]').forEach(a => { linkFor[a.getAttribute('href').slice(1)] = a; });
    const spy = new IntersectionObserver(entries => {
        entries.forEach(e => {
            const link = linkFor[e.target.id];
            if (link && e.isIntersecting) {
                Object.values(linkFor).forEach(l => l.classList.remove('active'));
                link.classList.add('active');
            }
        });
    }, { rootMargin: '-45% 0px -50% 0px' });
    Object.keys(linkFor).forEach(id => { const s = document.getElementById(id); if (s) spy.observe(s); });

    // ---------- reveal ----------
    const revealer = new IntersectionObserver(entries => {
        entries.forEach(e => {
            if (e.isIntersecting) { e.target.classList.add('in'); revealer.unobserve(e.target); }
        });
    }, { threshold: 0.12 });
    document.querySelectorAll('.reveal').forEach((el, i) => {
        el.style.transitionDelay = (i % 4) * 70 + 'ms';
        revealer.observe(el);
    });

    // ---------- counters ----------
    const counter = new IntersectionObserver(entries => {
        entries.forEach(e => {
            if (!e.isIntersecting) return;
            const el = e.target;
            const target = +el.dataset.count;
            const suffix = el.dataset.suffix || '';
            const start = performance.now();
            const dur = 1400;
            const tick = now => {
                const p = Math.min((now - start) / dur, 1);
                el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3))) + suffix;
                if (p < 1) requestAnimationFrame(tick);
            };
            requestAnimationFrame(tick);
            counter.unobserve(el);
        });
    }, { threshold: 0.6 });
    document.querySelectorAll('[data-count]').forEach(el => counter.observe(el));

    // ---------- typed words ----------
    const words = {
        tr: ['yazılım mimarisi', 'yapay zekâ', 'büyük veri', 'bilgisayarlı görü', 'LLM ajanları'],
        en: ['software architecture', 'AI', 'big data', 'computer vision', 'LLM agents']
    };
    function typer(el, list) {
        if (!el) return;
        let w = 0, c = list[0].length, deleting = false;
        const step = () => {
            const word = list[w];
            if (!deleting && c === word.length) { deleting = true; return setTimeout(step, 1800); }
            if (deleting && c === 0) { deleting = false; w = (w + 1) % list.length; }
            c += deleting ? -1 : 1;
            el.textContent = list[w].slice(0, c);
            setTimeout(step, deleting ? 45 : 85);
        };
        setTimeout(step, 1800);
    }
    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        typer(document.getElementById('typed'), words.tr);
        typer(document.getElementById('typedEn'), words.en);
    }

    // ---------- service card spotlight ----------
    document.querySelectorAll('.service').forEach(card => {
        card.addEventListener('pointermove', e => {
            const r = card.getBoundingClientRect();
            card.style.setProperty('--mx', (e.clientX - r.left) + 'px');
            card.style.setProperty('--my', (e.clientY - r.top) + 'px');
        });
    });

    // ---------- filters ----------
    function setupFilter(buttons, items, attr, key) {
        buttons.forEach(btn => btn.addEventListener('click', () => {
            buttons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const f = btn.dataset[key];
            items.forEach(it => {
                const cats = (it.getAttribute(attr) || '').split(/\s+/);
                const show = f === 'all' || cats.includes(f);
                it.classList.toggle('hide', !show);
                if (show) it.classList.add('in');
            });
        }));
    }
    // show the first projects, reveal the rest on demand
    const grid = document.getElementById('projectGrid');
    const moreBtn = document.getElementById('moreProjects');
    const moreWrap = moreBtn.parentElement;
    const projects = grid.querySelectorAll('.project');
    const VISIBLE = 11;
    let expanded = false;
    projects.forEach((p, i) => { if (i >= VISIBLE) p.classList.add('extra'); });
    moreBtn.querySelector('.more-count').textContent = `(+${Math.max(projects.length - VISIBLE, 0)})`;
    moreBtn.addEventListener('click', () => {
        expanded = true;
        grid.classList.remove('collapsed');
        grid.querySelectorAll('.extra').forEach(p => p.classList.add('in'));
        moreWrap.classList.add('hidden');
    });
    document.querySelectorAll('#projects .filter').forEach(btn => btn.addEventListener('click', () => {
        const all = btn.dataset.filter === 'all';
        grid.classList.toggle('collapsed', all && !expanded);
        moreWrap.classList.toggle('hidden', !all || expanded);
    }));

    setupFilter(
        document.querySelectorAll('#projects .filter'),
        projects, 'data-cat', 'filter');
    // publications: show the latest few, reveal the rest on demand
    const pubList = document.getElementById('pubs');
    const pubs = pubList.querySelectorAll('.pub');
    const morePubs = document.getElementById('morePubs');
    const PUB_VISIBLE = 6;
    let pubsExpanded = false;
    pubs.forEach((p, i) => { if (i >= PUB_VISIBLE) p.classList.add('extra'); });
    morePubs.querySelector('.more-count').textContent = `(+${Math.max(pubs.length - PUB_VISIBLE, 0)})`;
    morePubs.addEventListener('click', () => {
        pubsExpanded = true;
        pubList.classList.remove('collapsed');
        morePubs.parentElement.classList.add('hidden');
    });
    document.querySelectorAll('#pubFilters .filter').forEach(btn => btn.addEventListener('click', () => {
        const all = btn.dataset.pub === 'all';
        pubList.classList.toggle('collapsed', all && !pubsExpanded);
        morePubs.parentElement.classList.toggle('hidden', !all || pubsExpanded);
    }));

    setupFilter(
        document.querySelectorAll('#pubFilters .filter'),
        pubs, 'data-type', 'pub');

    // ---------- contact drafts ----------
    const messageBox = document.getElementById('messageBox');
    const topicSelect = document.getElementById('topicSelect');
    const chips = document.querySelectorAll('.draft-chip');
    chips.forEach(chip => chip.addEventListener('click', () => {
        chips.forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        const text = chip.dataset[root.lang === 'en' ? 'en' : 'tr'];
        messageBox.value = text;
        const opt = topicSelect.querySelector(`option[data-key="${chip.dataset.topic}"]`);
        if (opt) opt.selected = true;
        // select the first [placeholder] so the visitor can type over it
        messageBox.focus();
        const start = text.indexOf('[');
        const end = text.indexOf(']', start);
        if (start >= 0 && end > start) messageBox.setSelectionRange(start, end + 1);
    }));

    // ---------- contact form -> email or WhatsApp draft ----------
    document.getElementById('contactForm').addEventListener('submit', e => {
        e.preventDefault();
        const d = new FormData(e.target);
        const sign = `— ${d.get('name')}${d.get('company') ? ' / ' + d.get('company') : ''}`;
        const channel = e.submitter && e.submitter.dataset.channel;
        if (channel === 'whatsapp') {
            const text = `${d.get('message')}\n\n${sign}`;
            window.open('https://wa.me/905546442494?text=' + encodeURIComponent(text), '_blank', 'noopener');
            return;
        }
        const subject = `[tolgabuyuktanir.github.io] ${d.get('topic')} — ${d.get('name')}${d.get('company') ? ' / ' + d.get('company') : ''}`;
        const body = `${d.get('message')}\n\n${sign}`;
        location.href = 'mailto:tolgabuyuktanir@gmail.com?subject=' + encodeURIComponent(subject) +
            '&body=' + encodeURIComponent(body);
    });

    document.getElementById('year').textContent = new Date().getFullYear();

    // ---------- hero network canvas ----------
    const canvas = document.getElementById('heroCanvas');
    const ctx = canvas.getContext('2d');
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let pts = [], W = 0, H = 0, dpr = 1, mouse = { x: -9999, y: -9999 }, running = true;

    function resize() {
        dpr = Math.min(window.devicePixelRatio || 1, 2);
        W = canvas.clientWidth; H = canvas.clientHeight;
        canvas.width = W * dpr; canvas.height = H * dpr;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        const n = Math.min(80, Math.floor((W * H) / 18000));
        pts = Array.from({ length: n }, () => ({
            x: Math.random() * W, y: Math.random() * H,
            vx: (Math.random() - 0.5) * 0.18, vy: (Math.random() - 0.5) * 0.18,
            r: Math.random() * 1.6 + 0.6
        }));
    }
    function draw() {
        ctx.clearRect(0, 0, W, H);
        const max = 130;
        for (let i = 0; i < pts.length; i++) {
            const p = pts[i];
            if (!reduce) {
                p.x += p.vx; p.y += p.vy;
                if (p.x < 0 || p.x > W) p.vx *= -1;
                if (p.y < 0 || p.y > H) p.vy *= -1;
            }
            for (let j = i + 1; j < pts.length; j++) {
                const q = pts[j];
                const dx = p.x - q.x, dy = p.y - q.y, d = Math.hypot(dx, dy);
                if (d < max) {
                    ctx.strokeStyle = `rgba(29,78,216,${(1 - d / max) * 0.16})`;
                    ctx.lineWidth = 1;
                    ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y); ctx.stroke();
                }
            }
            const md = Math.hypot(p.x - mouse.x, p.y - mouse.y);
            if (md < 180) {
                ctx.strokeStyle = `rgba(14,116,144,${(1 - md / 180) * 0.35})`;
                ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(mouse.x, mouse.y); ctx.stroke();
            }
            ctx.fillStyle = 'rgba(71,85,105,.35)';
            ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fill();
        }
        if (running && !reduce) requestAnimationFrame(draw);
    }
    window.addEventListener('resize', () => { resize(); if (reduce) draw(); });
    canvas.parentElement.addEventListener('pointermove', e => {
        const r = canvas.getBoundingClientRect();
        mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top;
    });
    canvas.parentElement.addEventListener('pointerleave', () => { mouse.x = mouse.y = -9999; });
    new IntersectionObserver(([e]) => {
        const was = running; running = e.isIntersecting;
        if (running && !was && !reduce) requestAnimationFrame(draw);
    }).observe(canvas);
    resize(); draw();
})();
