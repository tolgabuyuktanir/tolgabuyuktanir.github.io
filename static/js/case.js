(function () {
    const root = document.documentElement;
    const store = {
        get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
        set(k, v) { try { localStorage.setItem(k, v); } catch (e) { /* ignore */ } }
    };
    const urlLang = new URLSearchParams(location.search).get('lang');
    const browserLang = (navigator.language || 'tr').toLowerCase().startsWith('tr') ? 'tr' : 'en';
    const setLang = lang => { root.lang = lang === 'en' ? 'en' : 'tr'; store.set('lang', root.lang); };
    setLang(urlLang || store.get('lang') || browserLang);
    document.getElementById('langToggle').addEventListener('click', () => setLang(root.lang === 'tr' ? 'en' : 'tr'));

    const nav = document.getElementById('nav');
    const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    document.getElementById('year').textContent = new Date().getFullYear();
})();
