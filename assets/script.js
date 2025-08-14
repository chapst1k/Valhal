// Small helpers: mark active nav link; print button
(function() {
    // Mark current link
    const path = location.pathname.replace(/index\.html$/, '');
    document.querySelectorAll('nav a').forEach(a => {
        const href = a.getAttribute('href') || '';
        if (href === '.' || href === './') return;
        if (path.endsWith(href) || (href !== '/' && path.includes(href))) {
            a.setAttribute('aria-current', 'page');
        }
    });

    // Print button
    document.querySelectorAll('[data-print]').forEach(btn => {
        btn.addEventListener('click', () => { window.print(); });
    });
})();

// Mobile-collapsible TOC (no HTML edits needed)
(function() {
        const MOBILE_MAX = 719;

        function setupTOC(aside) {
            if (!aside) return;

            // Find heading (or make one if missing)
            let heading = aside.querySelector('h4');
            if (!heading) {
                heading = document.createElement('h4');
                heading.textContent = 'On this page';
                heading.style.margin = '.2rem 0 .4rem';
                aside.prepend(heading);
            }

            // Wrap links (and any non-heading nodes) into a .toc-body
            let body = aside.querySelector('.toc-body');
            if (!body) {
                body = document.createElement('div');
                body.className = 'toc-body';
                const toMove = [];
                Array.from(aside.childNodes).forEach(node => {
                    if (node !== heading && !(node.classList && node.classList.contains('toc-body'))) {
                        toMove.push(node);
                    }
                });
                toMove.forEach(n => body.appendChild(n));
                aside.appendChild(body);
            }

            // Mobile-collapsible TOC with animation + rotating chevron
            (function() {
                const MOBILE_MAX = 719;

                function setupTOC(aside) {
                    if (!aside) return;

                    // Find or create heading
                    let heading = aside.querySelector('h4');
                    if (!heading) {
                        heading = document.createElement('h4');
                        heading.textContent = 'On this page';
                        heading.style.margin = '.2rem 0 .4rem';
                        aside.prepend(heading);
                    }

                    // Wrap links into .toc-body
                    let body = aside.querySelector('.toc-body');
                    if (!body) {
                        body = document.createElement('div');
                        body.className = 'toc-body';
                        const toMove = [];
                        Array.from(aside.childNodes).forEach(node => {
                            if (node !== heading && !(node.classList && node.classList.contains('toc-body'))) {
                                toMove.push(node);
                            }
                        });
                        toMove.forEach(n => body.appendChild(n));
                        aside.appendChild(body);
                    }

                    // Build toggle button with chevron
                    let toggle = aside.querySelector('.toc-toggle');
                    if (!toggle) {
                        toggle = document.createElement('button');
                        toggle.type = 'button';
                        toggle.className = 'toc-toggle';
                        toggle.setAttribute('aria-expanded', 'false');
                        toggle.setAttribute('aria-controls', 'toc-body-' + Math.random().toString(36).slice(2, 8));
                        body.id = toggle.getAttribute('aria-controls');
                        toggle.innerHTML = '<span>Table of contents</span><span class="chev" aria-hidden="true">▾</span>';
                        heading.replaceWith(toggle);
                    }

                    // Helpers to animate height
                    function setExpanded(expanded) {
                        aside.classList.toggle('expanded', expanded);
                        toggle.setAttribute('aria-expanded', String(expanded));
                        if (expanded) {
                            // measure and set max-height to slide open
                            body.style.maxHeight = body.scrollHeight + 'px';
                            body.style.opacity = '1';
                        } else {
                            // slide closed
                            body.style.maxHeight = '0px';
                            body.style.opacity = '0';
                        }
                    }

                    function applyMode() {
                        const isMobile = window.innerWidth <= MOBILE_MAX;
                        if (isMobile) {
                            // Start collapsed on mobile
                            setExpanded(false);
                        } else {
                            // Always open on desktop; remove height clamp
                            aside.classList.add('expanded');
                            toggle.setAttribute('aria-expanded', 'true');
                            body.style.maxHeight = 'none';
                            body.style.opacity = '1';
                        }
                    }

                    // Toggle click
                    toggle.addEventListener('click', () => {
                        const expanded = !aside.classList.contains('expanded');
                        setExpanded(expanded);

                        // If expanding, re-measure after fonts/images settle
                        if (expanded) {
                            requestAnimationFrame(() => {
                                body.style.maxHeight = body.scrollHeight + 'px';
                            });
                        }
                    });

                    // Recalc on resize (content/line-wrap may change height)
                    window.addEventListener('resize', () => {
                        const isMobile = window.innerWidth <= MOBILE_MAX;
                        if (isMobile) {
                            if (aside.classList.contains('expanded')) {
                                body.style.maxHeight = body.scrollHeight + 'px';
                            }
                        } else {
                            aside.classList.add('expanded');
                            toggle.setAttribute('aria-expanded', 'true');
                            body.style.maxHeight = 'none';
                            body.style.opacity = '1';
                        }
                    });

                    // Init
                    applyMode();
                    // Safety: if images load later and change height, refresh when finished
                    window.addEventListener('load', () => {
                        if (aside.classList.contains('expanded') && window.innerWidth <= MOBILE_MAX) {
                            body.style.maxHeight = body.scrollHeight + 'px';
                        }
                    });
                }

                document.addEventListener('DOMContentLoaded', () => {
                    document.querySelectorAll('aside.toc').forEach(setupTOC);
                });
            })();