/**
 * app.js – Main Orchestrator for the redesigned Muslim Tracker
 * Clean, simple SPA controller with page navigation
 */

(function () {
  'use strict';

  const SM = window.storageManager;
  const PC = window.prayerCalculator;
  const QT = window.quranTracker;
  const TC = window.tasbihController;
  const FC = window.fastingController;
  const CC = window.charityController;
  const CITIES = window.INDONESIAN_CITIES;

  let currentPage = 'home';
  let clockTimer = null;
  let prayerTimes = null;
  let activeDzikirTab = 'pagi';

  /* ==========================
     INIT
     ========================== */
  document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initIcons();
    initNav();
    initCitySelector();
    initModals();
    initSurahDropdown();
    initFormHandlers();
    initSettingsPage();
    initTasbih();
    initDzikirTabs();
    initSunnahCheckboxes();
    initFastingCheckboxes();

    updatePrayerTimes();
    startClock();
    renderAll();
  });

  function initIcons() {
    if (window.lucide) window.lucide.createIcons();
  }

  /* ==========================
     NAVIGATION
     ========================== */
  function initNav() {
    document.querySelectorAll('[data-nav]').forEach(btn => {
      btn.addEventListener('click', () => navigateTo(btn.dataset.nav));
    });
  }

  function navigateTo(pageId) {
    currentPage = pageId;

    // Toggle panels
    document.querySelectorAll('.tab-panel').forEach(p => {
      p.classList.toggle('is-active', p.id === `page-${pageId}`);
    });

    // Update bottom nav
    document.querySelectorAll('.bottom-nav .nav-item').forEach(btn => {
      const target = btn.dataset.nav;
      // "Lainnya" covers amal, puasa, sedekah, settings
      const isMore = target === 'amal' && ['amal', 'puasa', 'sedekah', 'settings'].includes(pageId);
      btn.classList.toggle('is-active', target === pageId || isMore);
    });

    // Update desktop nav
    document.querySelectorAll('.top-nav .nav-btn').forEach(btn => {
      btn.classList.toggle('is-active', btn.dataset.nav === pageId);
    });

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'instant' });

    // Re-render the active page
    renderPage(pageId);
    initIcons();
  }

  /* ==========================
     CLOCK & PRAYER TIMES
     ========================== */
  function updatePrayerTimes() {
    const profile = SM.state.profile;
    const city = CITIES[profile.city] || CITIES['Jakarta'];
    prayerTimes = PC.getTimes(new Date(), city.lat, city.lng, city.timezone);
  }

  function startClock() {
    const tick = () => {
      const now = new Date();

      // Header dates
      const hijri = PC.getHijriDate(now);
      setText('header-hijri', hijri.formatted);
      setText('header-masehi', now.toLocaleDateString('id-ID', {
        weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
      }));

      // Greeting
      setText('header-greeting', SM.state.profile.name || 'Hamba Allah');

      // Prayer times pills
      if (prayerTimes) {
        ['imsak','subuh','syuruq','dzuhur','ashar','maghrib','isya'].forEach(k => {
          setText(`pt-${k}`, prayerTimes[k]);
        });

        // Next prayer
        const next = PC.getNextPrayer(prayerTimes, now);
        setText('hero-next-name', next.next.name);
        setText('hero-next-time', next.next.time);

        const totalSec = Math.max(0, Math.floor(next.diffMs / 1000));
        const h = Math.floor(totalSec / 3600);
        const m = Math.floor((totalSec % 3600) / 60);
        const s = totalSec % 60;
        setText('hero-countdown',
          `${pad(h)}:${pad(m)}:${pad(s)} lagi`
        );
      }
    };

    tick();
    clockTimer = setInterval(tick, 1000);
  }

  /* ==========================
     THEME (LIGHT / DARK)
     ========================== */
  function initTheme() {
    let savedTheme = SM.state.settings.theme;
    if (!savedTheme || savedTheme === 'emerald-dark') {
      savedTheme = 'light';
    } else if (savedTheme !== 'light' && savedTheme !== 'dark') {
      savedTheme = 'light';
    }

    applyTheme(savedTheme);

    const toggleBtn = document.getElementById('theme-toggle-btn');
    if (toggleBtn) {
      toggleBtn.addEventListener('click', toggleTheme);
    }
  }

  function applyTheme(theme) {
    const isDark = theme === 'dark';
    if (isDark) {
      document.documentElement.setAttribute('data-theme', 'dark');
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
      document.documentElement.classList.remove('dark');
    }

    SM.state.settings.theme = theme;
    SM.save();

    // Update Header Button
    const icon = document.getElementById('theme-icon');
    const label = document.getElementById('theme-label');
    if (icon) {
      icon.setAttribute('data-lucide', isDark ? 'sun' : 'moon');
    }
    if (label) {
      label.textContent = isDark ? 'Terang' : 'Gelap';
    }

    // Update Settings Page Switcher if exists
    const btnLight = document.getElementById('theme-btn-light');
    const btnDark = document.getElementById('theme-btn-dark');
    if (btnLight && btnDark) {
      btnLight.classList.toggle('is-active', !isDark);
      btnDark.classList.toggle('is-active', isDark);
    }

    initIcons();
  }

  function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
    const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
    applyTheme(nextTheme);
  }

  /* ==========================
     CITY / WILAYAH SELECTOR
     ========================== */
  function initCitySelector() {
    const heroSelect = document.getElementById('city-select');
    const setSelect = document.getElementById('set-city');
    const currentCityKey = SM.state.profile.city || 'Jakarta';

    const optionsHTML = Object.keys(CITIES).map(key => {
      const c = CITIES[key];
      const selected = key === currentCityKey ? 'selected' : '';
      return `<option value="${key}" ${selected}>📍 ${c.label}</option>`;
    }).join('');

    if (heroSelect) {
      heroSelect.innerHTML = optionsHTML;
      heroSelect.addEventListener('change', (e) => onCityChange(e.target.value));
    }

    if (setSelect) {
      setSelect.innerHTML = optionsHTML;
      setSelect.addEventListener('change', (e) => onCityChange(e.target.value));
    }

    updateCityDisplay(currentCityKey);
  }

  function onCityChange(cityKey) {
    const city = CITIES[cityKey];
    if (city) {
      SM.state.profile.city = cityKey;
      SM.state.profile.latitude = city.lat;
      SM.state.profile.longitude = city.lng;
      SM.save();

      // Sync both dropdowns
      const heroSelect = document.getElementById('city-select');
      const setSelect = document.getElementById('set-city');
      if (heroSelect && heroSelect.value !== cityKey) heroSelect.value = cityKey;
      if (setSelect && setSelect.value !== cityKey) setSelect.value = cityKey;

      updateCityDisplay(cityKey);
      updatePrayerTimes();
      renderAll();
    }
  }

  function updateCityDisplay(cityKey) {
    const city = CITIES[cityKey] || CITIES['Jakarta'];
    setText('hero-city-name', city.label);
    setText('sholat-city-display', city.label);
  }

  /* ==========================
     RENDER DISPATCHER
     ========================== */
  function renderAll() {
    renderHome();
    renderPage(currentPage);
  }

  function renderPage(pageId) {
    switch (pageId) {
      case 'home':    renderHome(); break;
      case 'sholat':  renderSholat(); break;
      case 'quran':   renderQuran(); break;
      case 'dzikir':  renderDzikir(); break;
      case 'amal':    renderAmal(); break;
      case 'puasa':   renderPuasa(); break;
      case 'sedekah': renderSedekah(); break;
      case 'settings': renderSettings(); break;
    }
  }

  /* ==========================
     HOME PAGE
     ========================== */
  function renderHome() {
    const rec = SM.getDailyRecord();
    const score = rec.score || 0;
    const streak = SM.calculateStreak();

    setText('home-score-val', score);
    setStyle('home-score-bar', 'width', score + '%');
    setText('home-streak-badge', '🔥 ' + streak);
  }

  /* ==========================
     SHOLAT PAGE
     ========================== */
  const PRAYER_NAMES = [
    { key: 'subuh',   label: 'Subuh',   ptKey: 'subuh' },
    { key: 'dzuhur',  label: 'Dzuhur',  ptKey: 'dzuhur' },
    { key: 'ashar',   label: 'Ashar',   ptKey: 'ashar' },
    { key: 'maghrib', label: 'Maghrib', ptKey: 'maghrib' },
    { key: 'isya',    label: 'Isya',    ptKey: 'isya' }
  ];

  function renderSholat() {
    const rec = SM.getDailyRecord();
    const container = document.getElementById('sholat-cards-list');
    if (!container) return;

    container.innerHTML = PRAYER_NAMES.map(p => {
      const data = rec.prayers[p.key] || { done: false, status: 'none' };
      const time = prayerTimes ? prayerTimes[p.ptKey] : '--:--';

      const chipHTML = (type, label) => {
        let cls = 'prayer-chip';
        if (data.done && data.status === type) {
          cls += type === 'late' ? ' active-warn' : ' active';
        }
        return `<button class="${cls}" data-prayer="${p.key}" data-status="${type}">${label}</button>`;
      };

      return `
        <div class="glass-card glass-card-sm p-3.5 flex items-center justify-between gap-3 interactive-scale">
          <div style="min-width:60px;">
            <p style="margin:0;font-weight:700;font-size:15px;">${p.label}</p>
            <p style="margin:0;font-size:12px;color:var(--text-3);">${time}</p>
          </div>
          <div style="flex:1;display:flex;gap:6px;flex-wrap:wrap;justify-content:flex-end;">
            ${chipHTML('masjid', '🕌 Masjid')}
            ${chipHTML('on_time', '✓ Tepat')}
            ${chipHTML('late', '⏳ Lewat')}
          </div>
        </div>`;
    }).join('');

    // Bind click events
    container.querySelectorAll('.prayer-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        const pKey = chip.dataset.prayer;
        const status = chip.dataset.status;
        SM.updateDailyRecord(SM.getTodayKey(), r => {
          const pp = r.prayers[pKey];
          if (pp.done && pp.status === status) {
            pp.done = false; pp.status = 'none';
          } else {
            pp.done = true; pp.status = status;
          }
        });
        renderSholat();
        renderHome();
      });
    });

    // Sunnah checkboxes
    ['tahajjud','dhuha','witir','rawatib'].forEach(k => {
      const el = document.getElementById(`sun-${k}`);
      if (el) el.checked = !!rec.sunnah[k];
    });

    initIcons();
  }

  function initSunnahCheckboxes() {
    ['tahajjud','dhuha','witir','rawatib'].forEach(k => {
      const el = document.getElementById(`sun-${k}`);
      if (el) {
        el.addEventListener('change', () => {
          SM.updateDailyRecord(SM.getTodayKey(), r => {
            r.sunnah[k] = el.checked;
          });
          renderHome();
        });
      }
    });
  }

  /* ==========================
     QURAN PAGE
     ========================== */
  function renderQuran() {
    const info = QT.getProgressInfo();
    setText('quran-juz', `Juz ${info.currentJuz}`);
    setText('quran-page', `Halaman ${info.currentPage} / 604`);
    setText('quran-pct', `${info.percent}%`);
    setText('quran-est', `~${info.estDaysRemaining} hari lagi`);
    setStyle('quran-bar', 'width', info.percent + '%');

    // Logs
    const logs = SM.state.quranLogs || [];
    const el = document.getElementById('quran-logs-list');
    if (!el) return;

    if (logs.length === 0) {
      el.innerHTML = '<p style="text-align:center;padding:24px;color:var(--text-3);">Belum ada catatan tilawah.</p>';
    } else {
      el.innerHTML = logs.slice(0, 20).map(l => `
        <div style="display:flex;align-items:center;justify-content:space-between;padding:12px 16px;border-bottom:1px solid var(--divider);">
          <div>
            <p style="margin:0;font-weight:600;">${l.surah}</p>
            <p style="margin:0;font-size:11px;color:var(--text-3);">${l.date} · Ayat ${l.ayahStart||1}-${l.ayahEnd||'selesai'} · ${l.pages} hal</p>
          </div>
          <button class="btn btn-ghost btn-sm" style="color:var(--danger);padding:4px;" onclick="window._deleteQuranLog('${l.id}')">
            <i data-lucide="trash-2" style="width:14px;height:14px;"></i>
          </button>
        </div>`).join('');
    }
    initIcons();
  }

  window._deleteQuranLog = function(id) {
    QT.deleteLog(id);
    renderQuran();
  };

  function initSurahDropdown() {
    const sel = document.getElementById('inp-surah');
    if (!sel || !window.SURAH_LIST) return;
    sel.innerHTML = window.SURAH_LIST.map(s =>
      `<option value="${s.name}">${s.no}. ${s.name} (${s.ayat} ayat)</option>`
    ).join('');
  }

  /* ==========================
     DZIKIR & TASBIH PAGE
     ========================== */
  function initTasbih() {
    const tapBtn = document.getElementById('tasbih-tap-btn');
    if (tapBtn) tapBtn.addEventListener('click', () => { TC.increment(); renderTasbihUI(); });

    const resetBtn = document.getElementById('tasbih-reset-btn');
    if (resetBtn) resetBtn.addEventListener('click', () => { TC.reset(); renderTasbihUI(); });

    document.querySelectorAll('.tasbih-preset').forEach(btn => {
      btn.addEventListener('click', () => {
        TC.setPreset(btn.dataset.name, parseInt(btn.dataset.count, 10));
        renderTasbihUI();
      });
    });
  }

  function renderTasbihUI() {
    setText('tasbih-count', TC.count);
    setText('tasbih-label', TC.title);
    setText('tasbih-target-label', TC.target > 0 ? `Target: ${TC.target}` : 'Bebas');

    const ring = document.getElementById('tasbih-ring-circle');
    if (ring && TC.target > 0) {
      const r = 100;
      const c = 2 * Math.PI * r;
      const progress = Math.min(1, TC.count / TC.target);
      ring.style.strokeDasharray = c;
      ring.style.strokeDashoffset = c - progress * c;
    }
  }

  function initDzikirTabs() {
    document.querySelectorAll('.dzikir-tab').forEach(btn => {
      btn.addEventListener('click', () => {
        activeDzikirTab = btn.dataset.dzikir;
        document.querySelectorAll('.dzikir-tab').forEach(b => {
          b.classList.toggle('is-active', b === btn);
          if (b === btn) {
            b.style.background = 'var(--primary)';
            b.style.color = '#fff';
            b.style.borderColor = 'var(--primary)';
          } else {
            b.style.background = '';
            b.style.color = '';
            b.style.borderColor = '';
          }
        });
        renderDzikirList();
      });
    });

    // Style initial active tab
    const activeTab = document.querySelector('.dzikir-tab.is-active');
    if (activeTab) {
      activeTab.style.background = 'var(--primary)';
      activeTab.style.color = '#fff';
      activeTab.style.borderColor = 'var(--primary)';
    }
  }

  function renderDzikir() {
    renderTasbihUI();
    renderDzikirList();
  }

  function renderDzikirList() {
    const items = activeDzikirTab === 'pagi' ? window.DZIKIR_PAGI : window.DZIKIR_PETANG;
    const container = document.getElementById('dzikir-content');
    if (!container || !items) return;

    container.innerHTML = items.map(d => `
      <div class="glass-card p-4 interactive-scale">
        <div class="flex items-center justify-between mb-2">
          <p class="m-0 font-bold text-sm text-emerald-700 dark:text-emerald-400">${d.title}</p>
          <span class="badge badge-green">${d.target}×</span>
        </div>
        <p class="arabic-text my-2.5">${d.arabic}</p>
        <p class="m-0 text-xs italic text-slate-500 dark:text-slate-400">${d.latin}</p>
        <p class="mt-1.5 mb-0 text-xs text-slate-700 dark:text-slate-300">${d.translation}</p>
        <p class="mt-2 mb-0 text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">✨ ${d.fadhilah}</p>
      </div>`).join('');
  }

  /* ==========================
     AMAL HARIAN PAGE
     ========================== */
  function renderAmal() {
    const rec = SM.getDailyRecord();
    const score = rec.score || 0;
    const streak = SM.calculateStreak();

    setText('amal-score', score + '%');
    setText('amal-streak', String(streak));

    // Badge
    const badge = document.getElementById('amal-badge');
    if (badge) {
      if (score >= 90) { badge.textContent = 'Mumtaz'; badge.className = 'badge badge-green'; }
      else if (score >= 75) { badge.textContent = 'Jayyid Jiddan'; badge.className = 'badge badge-green'; }
      else if (score >= 50) { badge.textContent = 'Jayyid'; badge.className = 'badge badge-gold'; }
      else { badge.textContent = 'Semangat!'; badge.className = 'badge badge-red'; }
    }

    // Weekly bars
    const barsEl = document.getElementById('weekly-bars');
    if (barsEl) {
      const data = SM.getWeeklyData();
      barsEl.innerHTML = data.map(d => {
        const h = Math.max(8, d.score);
        const color = d.score >= 80 ? 'var(--primary)' : d.score >= 50 ? 'var(--primary-soft)' : 'var(--border)';
        const todayBorder = d.isToday ? 'border:2px solid var(--primary);' : '';
        return `
          <div style="flex:1;display:flex;flex-direction:column;align-items:center;gap:3px;">
            <span style="font-size:9px;font-weight:700;color:var(--text-3);">${d.score}%</span>
            <div style="width:100%;background:var(--bg-input);border-radius:6px;height:60px;display:flex;align-items:flex-end;padding:2px;">
              <div style="width:100%;height:${h}%;background:${color};border-radius:4px;${todayBorder}transition:height .4s;"></div>
            </div>
            <span style="font-size:10px;font-weight:${d.isToday?'800':'600'};color:${d.isToday?'var(--primary)':'var(--text-3)'};">${d.dayName}</span>
          </div>`;
      }).join('');
    }

    // Habits checklist
    const habitsEl = document.getElementById('habits-checklist');
    if (habitsEl) {
      const habits = SM.state.customHabits || [];
      habitsEl.innerHTML = habits.map((h, i) => {
        const checked = !!rec.habits[h.id];
        const border = i < habits.length - 1 ? 'border-bottom:1px solid var(--divider);' : '';
        return `
          <label style="display:flex;align-items:center;gap:12px;padding:14px 16px;cursor:pointer;${border}${checked ? 'background:var(--primary-10);' : ''}">
            <input type="checkbox" class="checkbox" ${checked ? 'checked' : ''} data-habit="${h.id}" />
            <span style="flex:1;font-size:14px;font-weight:500;${checked ? 'text-decoration:line-through;color:var(--text-3);' : ''}">${h.label}</span>
            <span style="font-size:11px;color:var(--text-3);">+${h.weight||5}</span>
          </label>`;
      }).join('');

      habitsEl.querySelectorAll('[data-habit]').forEach(cb => {
        cb.addEventListener('change', () => {
          SM.updateDailyRecord(SM.getTodayKey(), r => {
            r.habits[cb.dataset.habit] = cb.checked;
          });
          renderAmal();
          renderHome();
        });
      });
    }
  }

  /* ==========================
     PUASA PAGE
     ========================== */
  function initFastingCheckboxes() {
    const check = document.getElementById('fasting-check');
    const type = document.getElementById('fasting-type');
    if (check) check.addEventListener('change', updateFasting);
    if (type) type.addEventListener('change', updateFasting);
  }

  function updateFasting() {
    const check = document.getElementById('fasting-check');
    const type = document.getElementById('fasting-type');
    SM.updateDailyRecord(SM.getTodayKey(), r => {
      r.puasa.isFasting = check?.checked || false;
      r.puasa.type = type?.value || 'none';
    });
    renderHome();
  }

  function renderPuasa() {
    const rec = SM.getDailyRecord();
    const check = document.getElementById('fasting-check');
    const type = document.getElementById('fasting-type');
    if (check) check.checked = !!rec.puasa.isFasting;
    if (type) type.value = rec.puasa.type || 'none';

    // Recommendations
    const hijri = PC.getHijriDate(new Date());
    const recs = FC.getTodayRecommendation(hijri.day, new Date());
    const recEl = document.getElementById('fasting-recs');
    if (recEl) {
      recEl.innerHTML = recs.map(r => `
        <div class="glass-card glass-card-sm p-3 mb-2.5 bg-emerald-50/70 dark:bg-emerald-950/30 border-emerald-500/20 interactive-scale">
          <p class="m-0 font-bold text-xs text-emerald-700 dark:text-emerald-400">🌙 ${r.title}</p>
          <p class="mt-1 mb-0 text-xs text-slate-600 dark:text-slate-300">${r.desc}</p>
        </div>`).join('');
    }

    // Qadha stats
    const q = FC.getQadhaStats();
    setText('qd-total', q.total);
    setText('qd-paid', q.paid);
    setText('qd-remaining', q.remaining);
    setStyle('qd-bar', 'width', q.percent + '%');

    // Qadha logs
    const logsEl = document.getElementById('qd-logs');
    if (logsEl) {
      logsEl.innerHTML = (q.logs || []).map(l => `
        <div style="display:flex;align-items:center;justify-content:space-between;padding:8px 0;border-top:1px solid var(--divider);">
          <div>
            <span style="font-weight:600;color:var(--primary);">${l.count} hari</span>
            <span style="font-size:11px;color:var(--text-3);margin-left:6px;">${l.date} · ${l.note||''}</span>
          </div>
          <button class="btn btn-ghost btn-sm" style="color:var(--danger);padding:2px;" onclick="window._delQadha('${l.id}')">✕</button>
        </div>`).join('');
    }
  }

  window._delQadha = function(id) { FC.deleteQadhaLog(id); renderPuasa(); };

  /* ==========================
     SEDEKAH PAGE
     ========================== */
  function renderSedekah() {
    setText('sed-month', CC.formatRupiah(CC.getMonthlyTotal()));
    setText('sed-all', CC.formatRupiah(CC.getAllTotal()));

    const histEl = document.getElementById('sed-history');
    const list = SM.state.sedekahHistory || [];
    if (!histEl) return;

    if (list.length === 0) {
      histEl.innerHTML = '<p style="text-align:center;padding:24px;color:var(--text-3);">Belum ada catatan sedekah.</p>';
    } else {
      histEl.innerHTML = list.slice(0, 30).map(item => `
        <div style="display:flex;align-items:center;justify-content:space-between;padding:12px 16px;border-bottom:1px solid var(--divider);">
          <div>
            <p style="margin:0;font-weight:600;color:var(--primary);">${CC.formatRupiah(item.amount)}</p>
            <p style="margin:0;font-size:11px;color:var(--text-3);">${item.date} · ${item.category}${item.note ? ' · ' + item.note : ''}</p>
          </div>
          <button class="btn btn-ghost btn-sm" style="color:var(--danger);padding:4px;" onclick="window._delSedekah('${item.id}')">
            <i data-lucide="trash-2" style="width:14px;height:14px;"></i>
          </button>
        </div>`).join('');
    }
    initIcons();
  }

  window._delSedekah = function(id) { CC.deleteSedekah(id); renderSedekah(); };

  /* ==========================
     SETTINGS PAGE
     ========================== */
  function renderSettings() {
    const nameEl = document.getElementById('set-name');
    const targetEl = document.getElementById('set-target');
    const cityEl = document.getElementById('set-city');
    if (nameEl) nameEl.value = SM.state.profile.name || 'Hamba Allah';
    if (targetEl) targetEl.value = SM.state.quranProgress.dailyPageTarget || 20;
    if (cityEl) cityEl.value = SM.state.profile.city || 'Jakarta';

    const currentTheme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
    const btnLight = document.getElementById('theme-btn-light');
    const btnDark = document.getElementById('theme-btn-dark');
    if (btnLight && btnDark) {
      btnLight.classList.toggle('is-active', currentTheme === 'light');
      btnDark.classList.toggle('is-active', currentTheme === 'dark');
    }
  }

  function initSettingsPage() {
    const saveBtn = document.getElementById('set-save-btn');
    if (saveBtn) saveBtn.addEventListener('click', () => {
      SM.state.profile.name = document.getElementById('set-name')?.value || 'Hamba Allah';
      const cityKey = document.getElementById('set-city')?.value;
      if (cityKey && CITIES[cityKey]) {
        onCityChange(cityKey);
      }
      QT.setDailyTarget(document.getElementById('set-target')?.value);
      SM.save();
      renderAll();
      alert('Pengaturan berhasil disimpan!');
    });

    const btnLight = document.getElementById('theme-btn-light');
    const btnDark = document.getElementById('theme-btn-dark');
    if (btnLight) btnLight.addEventListener('click', () => applyTheme('light'));
    if (btnDark) btnDark.addEventListener('click', () => applyTheme('dark'));

    const exportBtn = document.getElementById('btn-export');
    if (exportBtn) exportBtn.addEventListener('click', () => SM.exportJSON());

    const importBtn = document.getElementById('btn-import');
    if (importBtn) importBtn.addEventListener('change', e => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = ev => {
        const res = SM.importJSON(ev.target.result);
        if (res.success) { alert('Data berhasil dipulihkan!'); location.reload(); }
        else alert('Gagal: ' + res.error);
      };
      reader.readAsText(file);
    });

    const resetBtn = document.getElementById('btn-reset');
    if (resetBtn) resetBtn.addEventListener('click', () => {
      if (confirm('Yakin ingin mereset semua data? Tindakan ini tidak dapat dibatalkan.')) {
        SM.resetAllData();
        alert('Data direset.');
        location.reload();
      }
    });
  }

  /* ==========================
     MODALS
     ========================== */
  function initModals() {
    // Open
    document.querySelectorAll('[data-modal]').forEach(btn => {
      btn.addEventListener('click', () => {
        const modal = document.getElementById(btn.dataset.modal);
        if (modal) modal.classList.add('is-open');
      });
    });

    // Close
    document.querySelectorAll('.modal-close').forEach(btn => {
      btn.addEventListener('click', () => {
        btn.closest('.modal-overlay')?.classList.remove('is-open');
      });
    });

    // Close on backdrop click
    document.querySelectorAll('.modal-overlay').forEach(overlay => {
      overlay.addEventListener('click', e => {
        if (e.target === overlay) overlay.classList.remove('is-open');
      });
    });
  }

  function closeModal(id) {
    document.getElementById(id)?.classList.remove('is-open');
  }

  function celebrate() {
    if (window.confetti) {
      window.confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
    }
  }

  /* ==========================
     FORM HANDLERS
     ========================== */
  function initFormHandlers() {
    // Tilawah form
    const tilawahForm = document.getElementById('form-tilawah');
    if (tilawahForm) tilawahForm.addEventListener('submit', e => {
      e.preventDefault();
      SM.addQuranLog(
        document.getElementById('inp-surah').value,
        document.getElementById('inp-ayah1').value,
        document.getElementById('inp-ayah2').value,
        document.getElementById('inp-pages').value,
        document.getElementById('inp-tnotes').value
      );
      closeModal('modal-tilawah');
      tilawahForm.reset();
      renderQuran();
      renderHome();
      celebrate();
    });

    // Sedekah form
    const sedekahForm = document.getElementById('form-sedekah');
    if (sedekahForm) sedekahForm.addEventListener('submit', e => {
      e.preventDefault();
      SM.addSedekah(
        document.getElementById('inp-sed-amount').value,
        document.getElementById('inp-sed-cat').value,
        document.getElementById('inp-sed-note').value
      );
      closeModal('modal-sedekah');
      sedekahForm.reset();
      renderSedekah();
      renderHome();
      celebrate();
    });

    // Qadha add form
    const qAddForm = document.getElementById('form-qadha-add');
    if (qAddForm) qAddForm.addEventListener('submit', e => {
      e.preventDefault();
      SM.addQadhaDebt(Number(document.getElementById('inp-qd-add').value) || 0);
      closeModal('modal-qadha-add');
      qAddForm.reset();
      renderPuasa();
    });

    // Qadha pay form
    const qPayForm = document.getElementById('form-qadha-pay');
    if (qPayForm) qPayForm.addEventListener('submit', e => {
      e.preventDefault();
      SM.payQadhaDebt(
        Number(document.getElementById('inp-qd-pay').value) || 1,
        document.getElementById('inp-qd-note').value
      );
      closeModal('modal-qadha-pay');
      qPayForm.reset();
      renderPuasa();
      celebrate();
    });
  }

  /* ==========================
     UTILITIES
     ========================== */
  function setText(id, text) {
    const el = document.getElementById(id);
    if (el) el.textContent = text;
  }

  function setStyle(id, prop, val) {
    const el = document.getElementById(id);
    if (el) el.style[prop] = val;
  }

  function pad(n) { return String(n).padStart(2, '0'); }

})();
