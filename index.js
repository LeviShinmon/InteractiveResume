/* ============================================================
   Adni Onoh — Interactive Resume · index.js
   ------------------------------------------------------------
   Sections:
     1. Skill bar animation (click to fill / reset)
     2. Theme toggle (dark ↔ light, persisted)
     3. Project category filter
     4. Live clock (Buffalo ET)
     5. Command palette (top-bar input)
     6. Footer uptime ticker
   ============================================================ */

(function () {
  'use strict';

  /* ============================================================
     1. Skill bar animation
     ============================================================ */
  const animateBtn = document.getElementById('animateBtn');
  const bars = document.querySelectorAll('.bar-fill');

  if (animateBtn && bars.length) {
    let isFilled = false;
    let busy = false;

    const fillBars = () => {
      bars.forEach((bar, i) => {
        const w = bar.dataset.width;
        setTimeout(() => {
          bar.style.width = w + '%';
          bar.classList.add('animated');
        }, i * 120);
      });
    };

    const resetBars = () => {
      bars.forEach(bar => {
        bar.style.width = '0%';
        bar.classList.remove('animated');
      });
    };

    const setButtonState = (filled) => {
      if (filled) {
        animateBtn.classList.add('filled');
        animateBtn.querySelector('.btn-prompt').textContent = '↺';
        animateBtn.querySelector('.btn-label').textContent = 'reset';
      } else {
        animateBtn.classList.remove('filled');
        animateBtn.querySelector('.btn-prompt').textContent = '$';
        animateBtn.querySelector('.btn-label').textContent = 'run animation';
      }
    };

    animateBtn.addEventListener('click', () => {
      if (busy) return;
      busy = true;
      if (!isFilled) {
        fillBars();
        isFilled = true;
        setButtonState(true);
      } else {
        resetBars();
        isFilled = false;
        setButtonState(false);
      }
      setTimeout(() => { busy = false; }, bars.length * 120 + 200);
    });
  }

  /* ============================================================
     2. Theme toggle
     ============================================================ */
  const themeToggle = document.getElementById('themeToggle');
  const root = document.documentElement;

  if (themeToggle) {
    const themeLabel = themeToggle.querySelector('.theme-label');
    const themeIcon = themeToggle.querySelector('.theme-icon');

    let savedTheme = 'dark';
    try { savedTheme = localStorage.getItem('theme') || 'dark'; }
    catch (e) { /* storage blocked, default applies */ }

    const applyTheme = (theme) => {
      if (theme === 'light') {
        root.setAttribute('data-theme', 'light');
        themeLabel.textContent = 'dark';
        themeIcon.textContent = '◑';
      } else {
        root.removeAttribute('data-theme');
        themeLabel.textContent = 'light';
        themeIcon.textContent = '◐';
      }
    };

    applyTheme(savedTheme);

    themeToggle.addEventListener('click', () => {
      const current = root.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
      const next = current === 'light' ? 'dark' : 'light';
      applyTheme(next);
      try { localStorage.setItem('theme', next); } catch (e) { /* ignore */ }
    });
  }

  /* ============================================================
     3. Project category filter
     ============================================================ */
  const chips = document.querySelectorAll('.filter-chip');
  const projects = document.querySelectorAll('.project[data-category]');

  chips.forEach(chip => {
    chip.addEventListener('click', () => {
      const filter = chip.dataset.filter;

      chips.forEach(c => {
        c.classList.remove('active');
        c.setAttribute('aria-pressed', 'false');
      });
      chip.classList.add('active');
      chip.setAttribute('aria-pressed', 'true');

      projects.forEach(p => {
        let match;
        if (filter === 'all') {
          match = true;
        } else if (filter === 'current') {
          // "current" cross-cuts categories — match any project with a current-tag
          match = p.querySelector('.current-tag') !== null;
        } else {
          match = p.dataset.category === filter;
        }
        p.classList.toggle('hidden', !match);
      });
    });
  });

  // Initialize aria-pressed state on the active chip
  document.querySelector('.filter-chip.active')?.setAttribute('aria-pressed', 'true');

  /* ============================================================
     4. Live clock — Buffalo ET, updates every second
     ============================================================ */
  const clockTime = document.getElementById('clockTime');
  const clockDate = document.getElementById('clockDate');

  if (clockTime && clockDate) {
    const tzOptions = { timeZone: 'America/New_York' };
    const timeFmt = new Intl.DateTimeFormat('en-US', {
      ...tzOptions,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    });
    const dateFmt = new Intl.DateTimeFormat('en-US', {
      ...tzOptions,
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });

    const tick = () => {
      const now = new Date();
      clockTime.textContent = timeFmt.format(now);
      clockDate.textContent = dateFmt.format(now).toLowerCase();
    };
    tick();
    setInterval(tick, 1000);
  }

  /* ============================================================
     5. Command palette — type in the top bar to navigate
     ------------------------------------------------------------
     Accepted commands map to sections. Plain section names work
     too (e.g. "projects" === "tree projects"). Special:
       help    — show available commands inline
       clear   — empty the input
     ============================================================ */
  const cmdInput = document.getElementById('commandInput');

  if (cmdInput) {
    // Map: command (lowercase) → target section id
    const commandMap = {
      // canonical commands (mirror the section headers)
      'cat about.md': 'about',
      'cat about': 'about',
      'ls work': 'work',
      'ls -la work': 'work',
      'ls work/': 'work',
      'grep skills': 'skills',
      'grep -r skills': 'skills',
      'grep -r skills/': 'skills',
      './animate.sh': 'skills',
      'animate.sh': 'skills',
      'tree projects': 'projects',
      'tree projects/': 'projects',
      'cat process.md': 'process',
      'cat process': 'process',
      'cat certifications.txt': 'certs',
      'cat certifications': 'certs',
      'echo contact': 'contact',
      // short aliases — just type the section name
      'about': 'about',
      'work': 'work',
      'skills': 'skills',
      'projects': 'projects',
      'process': 'process',
      'certs': 'certs',
      'certifications': 'certs',
      'contact': 'contact',
    };

    const helpText = 'try: projects · about · work · skills · process · certs · contact · help';

    const flash = (cls, ms = 600) => {
      cmdInput.classList.add(cls);
      setTimeout(() => cmdInput.classList.remove(cls), ms);
    };

    const runCommand = (raw) => {
      // Normalize: lowercase, collapse runs of whitespace, then close the gap
      // between './' or '/' and any following text so './ animate.sh' → './animate.sh'.
      const cmd = raw
        .trim()
        .toLowerCase()
        .replace(/\s+/g, ' ')
        .replace(/(\.?\/)\s+/g, '$1');
      if (!cmd) return;

      if (cmd === 'help' || cmd === '?' || cmd === 'ls' || cmd === 'ls -la') {
        cmdInput.value = '';
        cmdInput.placeholder = helpText;
        flash('success');
        // Restore the regular placeholder after a few seconds
        setTimeout(() => { cmdInput.placeholder = defaultPlaceholder; }, 4500);
        return;
      }

      if (cmd === 'clear' || cmd === 'cls') {
        cmdInput.value = '';
        flash('success');
        return;
      }

      if (cmd === 'whoami') {
        cmdInput.value = '';
        cmdInput.placeholder = 'adni — see About section ↓';
        flash('success');
        setTimeout(() => { cmdInput.placeholder = defaultPlaceholder; }, 3500);
        document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
        return;
      }

      const target = commandMap[cmd];
      if (target) {
        const el = document.getElementById(target);
        if (el) {
          flash('success');
          el.scrollIntoView({ behavior: 'smooth' });
          // Clear input after a beat so the success flash is visible
          setTimeout(() => { cmdInput.value = ''; }, 700);
        }
      } else {
        flash('error', 700);
        cmdInput.placeholder = `command not found: ${raw.trim().slice(0, 30)} — try "help"`;
        setTimeout(() => { cmdInput.placeholder = defaultPlaceholder; }, 3000);
      }
    };

    // Default placeholder rotates between a few hints
    const placeholders = [
      'type "tree projects" to see what I\'ve built ↓',
      'type a command (try "help" or "projects")',
      'type "projects"; recruiter shortcut',
    ];
    let defaultPlaceholder = placeholders[0];

    // Pick a placeholder per page load, weighted toward the projects nudge
    const pickPlaceholder = () => {
      const idx = Math.floor(Math.random() * placeholders.length);
      defaultPlaceholder = placeholders[idx];
      cmdInput.placeholder = defaultPlaceholder;
    };
    pickPlaceholder();

    cmdInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        runCommand(cmdInput.value);
      } else if (e.key === 'Escape') {
        cmdInput.value = '';
        cmdInput.blur();
      }
    });

    // Keyboard shortcut: "/" focuses the input from anywhere on the page
    document.addEventListener('keydown', (e) => {
      if (e.key === '/' && document.activeElement !== cmdInput
          && !/^(input|textarea|select)$/i.test(document.activeElement?.tagName || '')) {
        e.preventDefault();
        cmdInput.focus();
      }
    });
  }

  /* ============================================================
     6. Footer "uptime" — a small honest detail, no fake commits
     ============================================================ */
  const uptimeEl = document.getElementById('footerUptime');
  if (uptimeEl) {
    // Calculate how long ago an arbitrary "session start" was —
    // resets per page load, so it really is the visitor's session.
    const start = Date.now();
    const fmt = () => {
      const s = Math.floor((Date.now() - start) / 1000);
      const m = Math.floor(s / 60);
      const ss = String(s % 60).padStart(2, '0');
      uptimeEl.textContent = `${m}:${ss}`;
    };
    fmt();
    setInterval(fmt, 1000);
  }
})();