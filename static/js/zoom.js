// Click-to-enlarge for screenshots (img[data-zoom], .shots img) and
// in-page YouTube playback for .video-thumb buttons.
(function () {
    let box = null;
    function close() {
        if (!box) return;
        box.classList.remove('open');
        const b = box; box = null;
        setTimeout(() => b.remove(), 200);
        document.removeEventListener('keydown', onKey);
    }
    function onKey(e) { if (e.key === 'Escape') close(); }
    function open(content, label) {
        box = document.createElement('div');
        box.className = 'lightbox';
        box.setAttribute('role', 'dialog');
        box.setAttribute('aria-label', label || 'Media');
        box.innerHTML = '<button class="lightbox-close" type="button" aria-label="Close">&times;</button>';
        box.appendChild(content);
        box.addEventListener('click', close);
        document.body.appendChild(box);
        requestAnimationFrame(() => box && box.classList.add('open'));
        document.addEventListener('keydown', onKey);
        box.querySelector('.lightbox-close').focus();
    }
    document.addEventListener('click', e => {
        const video = e.target.closest('.video-thumb[data-yt]');
        if (video) {
            e.preventDefault();
            const frame = document.createElement('iframe');
            const start = video.dataset.start ? `&start=${video.dataset.start}` : '';
            frame.src = `https://www.youtube-nocookie.com/embed/${video.dataset.yt}?autoplay=1&rel=0${start}`;
            frame.className = 'video-frame';
            frame.title = video.getAttribute('aria-label') || 'Video';
            frame.allow = 'autoplay; encrypted-media; picture-in-picture; fullscreen';
            frame.allowFullscreen = true;
            open(frame, frame.title);
            return;
        }
        const img = e.target.closest('img[data-zoom], .shots img');
        if (!img) return;
        e.preventDefault();
        const big = document.createElement('img');
        big.src = img.currentSrc || img.src;
        big.alt = img.alt;
        open(big, img.alt);
    });
})();
