/**
 * JustScale — Shared JavaScript
 * GSAP + ScrollTrigger powered animations + premium interaction systems
 */
(function() {
    'use strict';

    /* ---- 1. Grain texture overlay ---- */
    var c = document.createElement('canvas');
    c.width = 256; c.height = 256;
    var cx = c.getContext('2d');
    var img = cx.createImageData(256, 256);
    for (var i = 0; i < img.data.length; i += 4) {
        var v = Math.random() * 255;
        img.data[i] = img.data[i+1] = img.data[i+2] = v;
        img.data[i+3] = 12;
    }
    cx.putImageData(img, 0, 0);
    var grain = document.createElement('div');
    grain.style.cssText = 'position:fixed;inset:0;pointer-events:none;z-index:9999;opacity:0.25;mix-blend-mode:multiply;';
    grain.style.backgroundImage = 'url(' + c.toDataURL() + ')';
    grain.style.backgroundRepeat = 'repeat';
    document.body.appendChild(grain);

    /* ---- 1b. Dynamic Background ---- */
    var bgDynamic = document.createElement('div');
    bgDynamic.className = 'bg-dynamic';
    bgDynamic.innerHTML = '<div class="bg-dot-grid"></div>'
        + '<div class="bg-aurora"></div>'
        + '<div class="bg-blob bg-blob--1"></div>'
        + '<div class="bg-blob bg-blob--2"></div>'
        + '<div class="bg-blob bg-blob--3"></div>';
    document.body.insertBefore(bgDynamic, document.body.firstChild);

    // Stagger blob fade-in
    setTimeout(function() {
        var blobs = bgDynamic.querySelectorAll('.bg-blob');
        blobs.forEach(function(blob, i) {
            setTimeout(function() {
                blob.style.transition = 'opacity 1.5s ease';
                blob.style.opacity = '1';
            }, i * 300);
        });
    }, 600);

    /* ---- 1c. Floating Illustrations — removed ---- */
    var pageEl = document.getElementById('page');

    /* ---- 2. Custom Cursor System (removed) ---- */

    /* ---- 3. Scroll Progress Bar ---- */
    var progressBar = document.querySelector('.scroll-progress');
    if (progressBar) {
        window.addEventListener('scroll', function() {
            var scrollTop = window.scrollY;
            var docHeight = document.documentElement.scrollHeight - window.innerHeight;
            if (docHeight > 0) {
                progressBar.style.width = ((scrollTop / docHeight) * 100) + '%';
            }
        }, { passive: true });
    }

    /* ---- 4. Page fade-in ---- */
    var page = document.getElementById('page');
    requestAnimationFrame(function() {
        requestAnimationFrame(function() { page.classList.add('loaded'); });
    });

    /* ---- 5. Nav scroll ---- */
    var nav = document.getElementById('nav');
    window.addEventListener('scroll', function() {
        nav.classList.toggle('scrolled', window.scrollY > 60);
    }, { passive: true });

    /* ---- 6. GSAP Hero Timeline ---- */
    var heroTitle = document.querySelector('.hero h1');
    var rule = document.getElementById('rule');
    var sub = document.getElementById('sub');
    var heroCta = document.getElementById('heroCta');
    var crossLink = document.getElementById('crossLink');
    var orb = document.querySelector('.orb');

    if (typeof gsap !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);

        // Hero entrance timeline
        var heroTl = gsap.timeline({ delay: 0.5 });

        // A. Hero word-by-word reveal
        if (heroTitle) {
            var heroText = heroTitle.textContent;
            var heroWords = heroText.split(/\s+/);
            heroTitle.innerHTML = heroWords.map(function(word) {
                return '<span class="hero-word">' + word + '</span>';
            }).join(' ');
            // Container visible immediately — words carry the animation
            heroTitle.style.opacity = '1';
            heroTitle.style.transform = 'none';

            var heroWordEls = heroTitle.querySelectorAll('.hero-word');
            heroTl.fromTo(heroWordEls, {
                opacity: 0,
                y: 25,
                filter: 'blur(4px)'
            }, {
                opacity: 1,
                y: 0,
                filter: 'blur(0px)',
                duration: 0.8,
                ease: 'expo.out',
                stagger: 0.09
            }, 0);
        }

        // D. Gold rule shimmer after expansion
        heroTl.to(rule, {
            width: 56,
            duration: 1.2,
            ease: 'expo.out',
            onComplete: function() {
                if (rule) rule.classList.add('shimmer');
            }
        }, 0.3);

        heroTl.to(sub, {
            opacity: 1,
            y: 0,
            duration: 0.9,
            ease: 'expo.out'
        }, 0.45);

        if (heroCta) {
            heroTl.to(heroCta, {
                opacity: 1,
                y: 0,
                duration: 0.9,
                ease: 'expo.out'
            }, 0.6);
        }

        if (crossLink) {
            heroTl.to(crossLink, {
                opacity: 1,
                y: 0,
                duration: 0.9,
                ease: 'expo.out'
            }, 0.75);
        }

        /* ---- 7. Parallax Orb ---- */
        if (orb) {
            gsap.to(orb, {
                y: -80,
                scrollTrigger: {
                    trigger: '.hero',
                    start: 'top top',
                    end: 'bottom top',
                    scrub: 1
                }
            });
        }

        /* ---- 7b. Floating Icon Parallax — removed ---- */

        /* ---- 8. Choreographed Section Entrances ---- */
        // Direction-varied reveals: labels from left, titles from below,
        // subs from right, buttons scale up with bounce
        gsap.utils.toArray('.sr').forEach(function(el) {
            // Skip elements inside transition sections — they have their own scrub animation
            if (el.closest('.transition-section')) return;
            // E. Skip fw-cards — dedicated stagger below
            if (el.classList.contains('fw-card')) return;
            // F. Skip qual-cols — dedicated slide entrance below
            if (el.classList.contains('qual-col')) return;

            var fromVars = { opacity: 0, y: 20 };
            var toVars = { opacity: 1, y: 0, duration: 0.9, ease: 'expo.out' };

            if (el.classList.contains('section-label')) {
                fromVars = { opacity: 0, x: -30, y: 0 };
                toVars = { opacity: 1, x: 0, y: 0, duration: 0.8, ease: 'expo.out' };
            } else if (el.classList.contains('section-title') || el.classList.contains('math-big')) {
                // B. Word-by-word reveal for section titles
                var titleText = el.textContent;
                var titleWords = titleText.split(/\s+/);
                el.innerHTML = titleWords.map(function(word) {
                    return '<span class="title-word">' + word + '</span>';
                }).join(' ');
                el.style.opacity = '1';
                el.style.transform = 'none';

                gsap.fromTo(el.querySelectorAll('.title-word'), {
                    opacity: 0,
                    y: 20,
                    filter: 'blur(3px)'
                }, {
                    opacity: 1,
                    y: 0,
                    filter: 'blur(0px)',
                    duration: 0.7,
                    ease: 'expo.out',
                    stagger: 0.06,
                    scrollTrigger: {
                        trigger: el,
                        start: 'top 88%',
                        toggleActions: 'play none none none'
                    }
                });
                return; // Skip generic fromTo
            } else if (el.classList.contains('section-sub')) {
                fromVars = { opacity: 0, x: 30, y: 0 };
                toVars = { opacity: 1, x: 0, y: 0, duration: 0.8, ease: 'expo.out' };
            } else if (el.classList.contains('btn')) {
                fromVars = { opacity: 0, scale: 0.9, y: 0 };
                toVars = { opacity: 1, scale: 1, y: 0, duration: 0.7, ease: 'back.out(1.7)' };
            }

            toVars.scrollTrigger = {
                trigger: el,
                start: 'top 88%',
                toggleActions: 'play none none none'
            };

            gsap.fromTo(el, fromVars, toVars);
        });

        /* ---- 9. Card stagger reveals ---- */
        document.querySelectorAll('.cards-grid, #problemCards').forEach(function(grid) {
            var cards = grid.querySelectorAll('.card');
            if (cards.length === 0) return;

            gsap.fromTo(cards, {
                opacity: 0,
                y: 30
            }, {
                opacity: 1,
                y: 0,
                duration: 0.9,
                ease: 'expo.out',
                stagger: 0.12,
                scrollTrigger: {
                    trigger: grid,
                    start: 'top 85%',
                    toggleActions: 'play none none none'
                },
                onComplete: function() {
                    cards.forEach(function(card) {
                        card.style.transition = 'transform 0.2s ease, border-color 0.4s, box-shadow 0.4s';
                    });
                }
            });
        });

        /* ---- 10. Step card stagger reveals ---- */
        var stepGrid = document.getElementById('stepGrid');
        if (stepGrid) {
            var steps = stepGrid.querySelectorAll('.step-card');
            gsap.fromTo(steps, {
                opacity: 0,
                y: 20
            }, {
                opacity: 1,
                y: 0,
                duration: 0.9,
                ease: 'expo.out',
                stagger: 0.12,
                scrollTrigger: {
                    trigger: stepGrid,
                    start: 'top 85%',
                    toggleActions: 'play none none none'
                }
            });
        }

        /* ---- 10b. Framework card GSAP stagger ---- */
        var fwGrid = document.querySelector('.framework-grid');
        if (fwGrid) {
            var fwCards = fwGrid.querySelectorAll('.fw-card');
            gsap.fromTo(fwCards, {
                opacity: 0,
                y: 30
            }, {
                opacity: 1,
                y: 0,
                duration: 0.9,
                ease: 'expo.out',
                stagger: 0.15,
                scrollTrigger: {
                    trigger: fwGrid,
                    start: 'top 85%',
                    toggleActions: 'play none none none'
                }
            });
        }

        /* ---- 10c. Qualification grid slide entrance ---- */
        var qualYes = document.querySelector('.qual-yes');
        var qualNo = document.querySelector('.qual-no');
        if (qualYes) {
            gsap.fromTo(qualYes, { opacity: 0, x: -40 }, {
                opacity: 1,
                x: 0,
                duration: 0.9,
                ease: 'expo.out',
                scrollTrigger: {
                    trigger: qualYes,
                    start: 'top 85%',
                    toggleActions: 'play none none none'
                }
            });
        }
        if (qualNo) {
            gsap.fromTo(qualNo, { opacity: 0, x: 40 }, {
                opacity: 1,
                x: 0,
                duration: 0.9,
                ease: 'expo.out',
                stagger: 0.1,
                scrollTrigger: {
                    trigger: qualNo,
                    start: 'top 85%',
                    toggleActions: 'play none none none'
                }
            });
        }

        /* ---- 11. Blur-to-clear agitation text ---- */
        var agitationEl = document.getElementById('agitation');
        if (agitationEl) {
            var paragraphs = agitationEl.querySelectorAll('p');
            paragraphs.forEach(function(p) {
                if (p.classList.contains('gold-text')) {
                    // Character reveal for gold text lines
                    var text = p.textContent;
                    var html = '';
                    for (var ci = 0; ci < text.length; ci++) {
                        if (text[ci] === ' ') {
                            html += ' ';
                        } else {
                            html += '<span class="char">' + text[ci] + '</span>';
                        }
                    }
                    p.innerHTML = html;
                    p.classList.add('gold-text');
                } else {
                    // Blur-word treatment for regular paragraphs
                    var words = p.textContent.split(' ');
                    p.innerHTML = words.map(function(word) {
                        return '<span class="blur-word">' + word + '</span>';
                    }).join(' ');
                }
            });

            // Scroll-triggered blur clear
            var allWords = agitationEl.querySelectorAll('.blur-word');
            allWords.forEach(function(word) {
                ScrollTrigger.create({
                    trigger: word,
                    start: 'top 90%',
                    end: 'top 60%',
                    scrub: 2,
                    onUpdate: function(self) {
                        if (self.progress > 0.15) {
                            word.classList.add('clear');
                        }
                    }
                });
            });

            // Gold text character reveal — scroll triggered
            var goldTexts = agitationEl.querySelectorAll('.gold-text');
            goldTexts.forEach(function(p) {
                var chars = p.querySelectorAll('.char');
                if (chars.length === 0) return;
                ScrollTrigger.create({
                    trigger: p,
                    start: 'top 85%',
                    once: true,
                    onEnter: function() {
                        chars.forEach(function(ch, idx) {
                            setTimeout(function() {
                                ch.classList.add('revealed');
                            }, idx * 45);
                        });
                    }
                });
            });
        }

        /* ---- 12. Transition Section Effects ---- */
        document.querySelectorAll('.transition-section').forEach(function(section) {
            // Text entrance + scale scrubbed to scroll
            // These elements have .sr class in CSS (opacity:0, translateY:20px)
            // We handle their full entrance here — they're skipped in the .sr loop above
            var texts = section.querySelectorAll('.transition-big, .transition-gold, .transition-small');
            if (texts.length > 0) {
                gsap.fromTo(texts, { opacity: 0, y: 20, scale: 0.95 }, {
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    scrollTrigger: {
                        trigger: section,
                        start: 'top 85%',
                        end: 'top 40%',
                        scrub: 1
                    }
                });
            }

            // Gold line draws across
            var line = section.querySelector('.transition-line');
            if (line) {
                gsap.fromTo(line, { width: '0%' }, {
                    width: '50%',
                    scrollTrigger: {
                        trigger: section,
                        start: 'top 70%',
                        end: 'top 30%',
                        scrub: 1
                    }
                });
            }

            // Background brightness pulse on enter
            gsap.fromTo(section, { filter: 'brightness(1)' }, {
                filter: 'brightness(1.08)',
                duration: 0.6,
                yoyo: true,
                repeat: 0,
                ease: 'power2.inOut',
                scrollTrigger: {
                    trigger: section,
                    start: 'top 75%',
                    toggleActions: 'play none none none'
                },
                onComplete: function() {
                    gsap.to(section, { filter: 'brightness(1)', duration: 0.6, ease: 'power2.inOut' });
                }
            });
        });

        /* ---- 13. Floating Parallax Shapes ---- */
        document.querySelectorAll('.floating-shape').forEach(function(shape) {
            var speed = shape.classList.contains('shape-circle') ? 0.3 : 0.5;
            var parentSection = shape.parentElement;

            // Parallax drift
            gsap.to(shape, {
                y: -100 * speed,
                rotation: shape.classList.contains('shape-diamond') ? '+=90' : 0,
                scrollTrigger: {
                    trigger: parentSection,
                    start: 'top bottom',
                    end: 'bottom top',
                    scrub: 1
                }
            });

            // Fade in based on section visibility
            gsap.fromTo(shape, { opacity: 0 }, {
                opacity: 1,
                scrollTrigger: {
                    trigger: parentSection,
                    start: 'top 80%',
                    end: 'top 50%',
                    scrub: 1
                }
            });
        });

    } else {
        // ---- GSAP FALLBACK ----
        if (heroTitle) {
            setTimeout(function() {
                heroTitle.style.opacity = '1';
                heroTitle.style.transform = 'translateY(0)';
                heroTitle.style.transition = 'opacity 1s cubic-bezier(0.16, 1, 0.3, 1), transform 1s cubic-bezier(0.16, 1, 0.3, 1)';
            }, 500);
        }

        setTimeout(function() {
            rule.style.width = '56px';
            rule.style.transition = 'width 1.2s cubic-bezier(0.16, 1, 0.3, 1)';
        }, 1100);

        setTimeout(function() {
            sub.style.opacity = '1';
            sub.style.transform = 'translateY(0)';
            sub.style.transition = 'all 0.9s cubic-bezier(0.16, 1, 0.3, 1)';
        }, 1300);

        if (heroCta) {
            setTimeout(function() {
                heroCta.style.opacity = '1';
                heroCta.style.transform = 'translateY(0)';
                heroCta.style.transition = 'all 0.9s cubic-bezier(0.16, 1, 0.3, 1)';
            }, 1500);
        }

        if (crossLink) {
            setTimeout(function() {
                crossLink.style.opacity = '1';
                crossLink.style.transform = 'translateY(0)';
                crossLink.style.transition = 'all 0.9s cubic-bezier(0.16, 1, 0.3, 1)';
            }, 1700);
        }

        // Fallback scroll reveals
        var srEls = document.querySelectorAll('.sr');
        var observer = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                    entry.target.style.transition = 'opacity 0.9s cubic-bezier(0.16, 1, 0.3, 1), transform 0.9s cubic-bezier(0.16, 1, 0.3, 1)';
                    observer.unobserve(entry.target);
                }
            });
        }, { rootMargin: '0px 0px -60px 0px', threshold: 0.1 });
        srEls.forEach(function(el) { observer.observe(el); });

        // Fallback card reveals
        document.querySelectorAll('.cards-grid, #problemCards').forEach(function(grid) {
            var cardObs = new IntersectionObserver(function(entries) {
                entries.forEach(function(entry) {
                    if (entry.isIntersecting) {
                        var cards = entry.target.querySelectorAll('.card');
                        cards.forEach(function(card, idx) {
                            setTimeout(function() {
                                card.style.opacity = '1';
                                card.style.transform = 'translateY(0)';
                                card.style.transition = 'opacity 0.9s cubic-bezier(0.16, 1, 0.3, 1), transform 0.9s cubic-bezier(0.16, 1, 0.3, 1)';
                            }, idx * 120);
                        });
                        cardObs.unobserve(entry.target);
                    }
                });
            }, { rootMargin: '0px 0px -60px 0px', threshold: 0.1 });
            cardObs.observe(grid);
        });

        // Fallback step card reveals
        var stepGrid = document.getElementById('stepGrid');
        if (stepGrid) {
            var stepObs = new IntersectionObserver(function(entries) {
                entries.forEach(function(entry) {
                    if (entry.isIntersecting) {
                        var fbSteps = entry.target.querySelectorAll('.step-card');
                        fbSteps.forEach(function(step, idx) {
                            setTimeout(function() {
                                step.style.opacity = '1';
                                step.style.transform = 'translateY(0)';
                                step.style.transition = 'opacity 0.9s cubic-bezier(0.16, 1, 0.3, 1), transform 0.9s cubic-bezier(0.16, 1, 0.3, 1)';
                            }, idx * 120);
                        });
                        stepObs.unobserve(entry.target);
                    }
                });
            }, { rootMargin: '0px 0px -60px 0px', threshold: 0.1 });
            stepObs.observe(stepGrid);
        }

        // Fallback agitation text
        var agitationEl = document.getElementById('agitation');
        if (agitationEl) {
            var agitObs = new IntersectionObserver(function(entries) {
                entries.forEach(function(entry) {
                    if (entry.isIntersecting) {
                        var ps = entry.target.querySelectorAll('p');
                        ps.forEach(function(p, idx) {
                            setTimeout(function() {
                                p.style.opacity = '1';
                                p.style.transform = 'translateY(0)';
                                p.style.transition = 'opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)';
                            }, idx * 120);
                        });
                        agitObs.unobserve(entry.target);
                    }
                });
            }, { rootMargin: '0px 0px -60px 0px', threshold: 0.1 });
            agitObs.observe(agitationEl);
        }
    }

    /* ---- 14. SVG Icon Draw Animation on Hover ---- */
    document.querySelectorAll('.card-icon svg, .step-icon svg, .fw-icon svg').forEach(function(svg) {
        var paths = svg.querySelectorAll('path, line, polyline, circle, ellipse, polygon');
        var card = svg.closest('.card, .step-card, .fw-card');
        if (!card) return;

        // Store timeout IDs to prevent race condition on rapid hover/unhover
        var cleanupTimeouts = [];

        card.addEventListener('mouseenter', function() {
            // Clear any pending cleanup timeouts
            cleanupTimeouts.forEach(function(id) { clearTimeout(id); });
            cleanupTimeouts = [];

            paths.forEach(function(path) {
                if (path.getTotalLength) {
                    var len = path.getTotalLength();
                    path.style.strokeDasharray = len;
                    path.style.transition = 'none';
                    path.style.strokeDashoffset = len + '';
                    void path.offsetWidth;
                    path.style.transition = 'stroke-dashoffset 0.5s cubic-bezier(0.16, 1, 0.3, 1)';
                    path.style.strokeDashoffset = '0';
                }
            });
        });

        card.addEventListener('mouseleave', function() {
            paths.forEach(function(path) {
                if (path.getTotalLength) {
                    var len = path.getTotalLength();
                    path.style.transition = 'stroke-dashoffset 0.3s ease-in';
                    path.style.strokeDashoffset = len + '';
                    // Clean up after animation — restore visible state
                    var tid = setTimeout(function() {
                        path.style.strokeDasharray = '';
                        path.style.strokeDashoffset = '';
                        path.style.transition = '';
                    }, 350);
                    cleanupTimeouts.push(tid);
                }
            });
        });
    });

    /* ---- 15. Enhanced 3D Card Tilt + Dynamic Shadows ---- */
    document.querySelectorAll('.card, .step-card').forEach(function(card) {
        card.addEventListener('mousemove', function(e) {
            var r = card.getBoundingClientRect();
            var x = e.clientX - r.left;
            var y = e.clientY - r.top;
            card.style.setProperty('--mouse-x', x + 'px');
            card.style.setProperty('--mouse-y', y + 'px');

            // 3D tilt at 2° + subtle dynamic shadow
            var cxPos = x - r.width / 2;
            var cyPos = y - r.height / 2;
            var rx = (cyPos / r.height) * -2;
            var ry = (cxPos / r.width) * 2;

            // Shadow offsets opposite to tilt — capped to stay subtle
            var shadowX = Math.round(-ry * 1.5);
            var shadowY = Math.round(-rx * 1.5 + 16);

            card.style.transform = 'perspective(800px) rotateX(' + rx + 'deg) rotateY(' + ry + 'deg) translateY(-2px)';
            card.style.boxShadow = shadowX + 'px ' + shadowY + 'px 50px rgba(0,0,0,0.03), 0 20px 50px rgba(0,0,0,0.08), inset 0 0 0 1px rgba(0,0,0,0.06)';
        });
        card.addEventListener('mouseleave', function() {
            card.style.transform = '';
            card.style.boxShadow = '';
        });
    });

    /* ---- 16. Magnetic CTA buttons ---- */
    document.querySelectorAll('.mag-btn').forEach(function(btn) {
        btn.addEventListener('mousemove', function(e) {
            var r = btn.getBoundingClientRect();
            var dx = e.clientX - r.left - r.width / 2;
            var dy = e.clientY - r.top - r.height / 2;
            btn.style.transition = 'none';
            btn.style.transform = 'translate(' + (dx * 0.14) + 'px,' + (dy * 0.14) + 'px)';
        });
        btn.addEventListener('mouseleave', function() {
            btn.style.transition = 'transform 0.4s cubic-bezier(0.16,1,0.3,1)';
            btn.style.transform = '';
        });
    });

    /* ---- 17. Page transition on navigate ---- */
    document.querySelectorAll('a[href$=".html"]').forEach(function(link) {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            var href = link.getAttribute('href');
            page.classList.add('exit');
            page.classList.remove('loaded');
            setTimeout(function() { window.location.href = href; }, 400);
        });
    });

    /* ---- 18. FAQ Accordion (if present) ---- */
    document.querySelectorAll('.faq-q').forEach(function(q) {
        q.addEventListener('click', function() {
            var parent = q.parentElement;
            var isOpen = parent.classList.contains('open');
            document.querySelectorAll('.faq-item.open').forEach(function(item) {
                item.classList.remove('open');
            });
            if (!isOpen) {
                parent.classList.add('open');
            }
        });
    });

})();
