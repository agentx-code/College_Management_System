// Nexora: small JavaScript layer. Bootstrap's own JS runs the slider, modal, tabs and mobile menu.

(function () {
    var header = document.querySelector('.site-header');
    var menu = document.getElementById('mainNav');
    var toTop = document.getElementById('toTop');

    // Header shadow and back-to-top button
    function onScroll() {
        header.classList.toggle('scrolled', window.scrollY > 8);
        if (toTop) toTop.classList.toggle('show', window.scrollY > 500);
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    if (toTop) toTop.addEventListener('click', function () { window.scrollTo({ top: 0, behavior: 'smooth' }); });

    // Close the mobile menu after tapping a link
    document.querySelectorAll('#mainNav a').forEach(function (a) {
        a.addEventListener('click', function () {
            if (menu.classList.contains('show')) bootstrap.Collapse.getOrCreateInstance(menu).hide();
        });
    });

    // Scroll reveal: adds the class "in" when an element enters the screen (CSS does the animation)
    var revealEls = document.querySelectorAll('.reveal, .section-title');
    if ('IntersectionObserver' in window) {
        var io = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) { entry.target.classList.add('in'); io.unobserve(entry.target); }
            });
        }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
        revealEls.forEach(function (el) { io.observe(el); });
    } else {
        revealEls.forEach(function (el) { el.classList.add('in'); });
    }

    // Number counters (4, 12, 100) count up once when visible
    var counters = document.querySelectorAll('[data-count]');
    function runCounter(el) {
        var end = parseInt(el.getAttribute('data-count'), 10), start = null, dur = 1400;
        function step(ts) {
            if (!start) start = ts;
            var p = Math.min((ts - start) / dur, 1);
            el.textContent = Math.round(end * (1 - Math.pow(1 - p, 3)));
            if (p < 1) requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
    }
    if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        var co = new IntersectionObserver(function (entries) {
            entries.forEach(function (e) { if (e.isIntersecting) { runCounter(e.target); co.unobserve(e.target); } });
        }, { threshold: 0.6 });
        counters.forEach(function (c) { c.textContent = '0'; co.observe(c); });
    }

    // Login modal: change the label for each role
    var LABELS = { Student: 'Roll number', Teacher: 'Employee ID', Parent: 'Registered mobile number', Admin: 'Admin username' };
    var loginModal = document.getElementById('loginModal');
    var loginForm = document.getElementById('loginForm');
    if (loginModal) {
        loginModal.addEventListener('show.bs.modal', function (e) {
            var role = (e.relatedTarget && e.relatedTarget.getAttribute('data-role')) || 'Student';
            document.getElementById('loginRole').textContent = role;
            document.getElementById('loginIdLabel').textContent = LABELS[role];
            loginForm.reset(); loginForm.classList.remove('was-validated');
            document.getElementById('loginNote').classList.add('d-none');
        });
        loginModal.addEventListener('shown.bs.modal', function () { document.getElementById('loginId').focus(); });
        loginForm.addEventListener('submit', function (e) {
            e.preventDefault();
            loginForm.classList.add('was-validated');
            if (loginForm.checkValidity()) document.getElementById('loginNote').classList.remove('d-none');
        });
    }

    // Contact form: Bootstrap validation, demo success message
    var contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();
            contactForm.classList.add('was-validated');
            var ok = document.getElementById('contactOk');
            if (contactForm.checkValidity()) {
                ok.textContent = 'Thank you, ' + document.getElementById('cName').value.trim() + '. This is a demo form, so the message has not been sent yet.';
                ok.classList.remove('d-none');
            } else {
                ok.classList.add('d-none');
            }
        });
    }
})();
