// Click-to-enlarge for screenshots marked with data-zoom.
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
    document.addEventListener('click', e => {
        const img = e.target.closest('img[data-zoom], .shots img');
        if (!img) return;
        e.preventDefault();
        box = document.createElement('div');
        box.className = 'lightbox';
        box.setAttribute('role', 'dialog');
        box.setAttribute('aria-label', img.alt || 'Image');
        box.innerHTML = '<button class="lightbox-close" type="button" aria-label="Close">&times;</button>';
        const big = document.createElement('img');
        big.src = img.currentSrc || img.src;
        big.alt = img.alt;
        box.appendChild(big);
        box.addEventListener('click', close);
        document.body.appendChild(box);
        requestAnimationFrame(() => box && box.classList.add('open'));
        document.addEventListener('keydown', onKey);
        box.querySelector('.lightbox-close').focus();
    });
})();
