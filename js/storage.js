/**
 * storage.js - LocalStorage & State Management for Muslim Tracker
 */

const STORAGE_KEY = 'muslim_tracker_db_v1';

const DEFAULT_HABITS = [
  { id: 'tilawah_quran', label: 'Tilawah Al-Qur\'an (Min. 1 Halaman)', icon: 'book-open', weight: 15 },
  { id: 'dzikir_pagi', label: 'Dzikir Pagi', icon: 'sun', weight: 10 },
  { id: 'dzikir_petang', label: 'Dzikir Petang', icon: 'sunset', weight: 10 },
  { id: 'sedekah_subuh', label: 'Sedekah Subuh / Infaq Harian', icon: 'heart-handshake', weight: 10 },
  { id: 'menjaga_wudhu', label: 'Mendawamkan Wudhu', icon: 'droplet', weight: 5 },
  { id: 'baca_hadits', label: 'Tadabbur 1 Hadits / Ilmu Syar\'i', icon: 'scroll', weight: 5 },
  { id: 'birrul_walidain', label: 'Birrul Walidain (Doa / Berbakti)', icon: 'smile', weight: 5 },
  { id: 'adab_tidur', label: 'Wudhu & Al-Mulk / Ayat Kursi sebelum Tidur', icon: 'moon', weight: 5 }
];

const DEFAULT_STATE = {
  version: 1,
  profile: {
    name: 'Hamba Allah',
    city: 'Jakarta',
    latitude: -6.2088,
    longitude: 106.8456,
    khatamTargetDate: '',
    khatamStartPage: 1
  },
  settings: {
    soundEnabled: true,
    theme: 'emerald-dark',
    vibrationEnabled: true
  },
  quranProgress: {
    currentJuz: 1,
    currentPage: 1,
    targetDays: 30,
    dailyPageTarget: 20
  },
  qadhaPuasa: {
    totalDebt: 0,
    paidDebt: 0,
    logs: []
  },
  sedekahHistory: [],
  quranLogs: [],
  customHabits: [...DEFAULT_HABITS],
  dailyRecords: {}
};

class StorageManager {
  constructor() {
    this.state = this.load();
  }

  load() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return JSON.parse(JSON.stringify(DEFAULT_STATE));
      const parsed = JSON.parse(raw);
      // Merge with defaults in case of missing keys
      return {
        ...DEFAULT_STATE,
        ...parsed,
        profile: { ...DEFAULT_STATE.profile, ...(parsed.profile || {}) },
        settings: { ...DEFAULT_STATE.settings, ...(parsed.settings || {}) },
        quranProgress: { ...DEFAULT_STATE.quranProgress, ...(parsed.quranProgress || {}) },
        qadhaPuasa: { ...DEFAULT_STATE.qadhaPuasa, ...(parsed.qadhaPuasa || {}) },
        customHabits: parsed.customHabits && parsed.customHabits.length > 0 ? parsed.customHabits : [...DEFAULT_HABITS],
        dailyRecords: parsed.dailyRecords || {}
      };
    } catch (e) {
      console.error('Failed to load from LocalStorage:', e);
      return JSON.parse(JSON.stringify(DEFAULT_STATE));
    }
  }

  save() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
      // Dispatch custom event for cross-component sync
      window.dispatchEvent(new CustomEvent('tracker-data-changed', { detail: this.state }));
    } catch (e) {
      console.error('Failed to save to LocalStorage:', e);
    }
  }

  formatDate(date = new Date()) {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }

  getTodayKey() {
    return this.formatDate(new Date());
  }

  getDailyRecord(dateStr = this.getTodayKey()) {
    if (!this.state.dailyRecords[dateStr]) {
      this.state.dailyRecords[dateStr] = {
        date: dateStr,
        prayers: {
          subuh: { done: false, status: 'none', rawatib: false },
          dzuhur: { done: false, status: 'none', rawatibQobla: false, rawatibBada: false },
          ashar: { done: false, status: 'none', rawatib: false },
          maghrib: { done: false, status: 'none', rawatib: false },
          isya: { done: false, status: 'none', rawatib: false }
        },
        sunnah: {
          tahajjud: false,
          dhuha: false,
          witir: false,
          rawatib: false
        },
        quran: {
          read: false,
          pages: 0,
          surah: '',
          ayahStart: '',
          ayahEnd: '',
          notes: ''
        },
        dzikir: {
          pagi: false,
          petang: false,
          tasbihTotal: 0
        },
        puasa: {
          isFasting: false,
          type: 'none', // 'senin-kamis', 'ayyamul-bidh', 'ramadhan', 'qadha', 'daud', 'lainnya'
          isQadhaPaid: false
        },
        sedekah: {
          done: false,
          amount: 0,
          note: ''
        },
        habits: {},
        score: 0,
        notes: ''
      };
      this.save();
    }
    return this.state.dailyRecords[dateStr];
  }

  updateDailyRecord(dateStr, updaterFn) {
    const record = this.getDailyRecord(dateStr);
    updaterFn(record);
    record.score = this.calculateDayScore(record);
    this.save();
    return record;
  }

  calculateDayScore(record) {
    if (!record) return 0;
    let score = 0;
    const maxScore = 100;

    // 1. Sholat Wajib 5 Waktu (Maksimal 40 poin, masing-masing 8 poin)
    const prayers = record.prayers || {};
    const prayerKeys = ['subuh', 'dzuhur', 'ashar', 'maghrib', 'isya'];
    prayerKeys.forEach(k => {
      const p = prayers[k];
      if (p && p.done) {
        if (p.status === 'masjid') score += 8; // Berjamaah di masjid (full point)
        else if (p.status === 'on_time') score += 7; // Tepat waktu di rumah
        else if (p.status === 'munfarid') score += 6; // Sendiri
        else if (p.status === 'late') score += 4; // Terlambat
        else score += 6;
      }
    });

    // 2. Sholat Sunnah (Maksimal 15 poin)
    const sunnah = record.sunnah || {};
    if (sunnah.tahajjud) score += 5;
    if (sunnah.dhuha) score += 4;
    if (sunnah.witir) score += 3;
    if (sunnah.rawatib) score += 3;

    // 3. Tilawah Qur'an (Maksimal 15 poin)
    const quran = record.quran || {};
    if (quran.read || quran.pages > 0) {
      if (quran.pages >= 20) score += 15; // 1 juz
      else if (quran.pages >= 10) score += 12; // setengah juz
      else if (quran.pages >= 1) score += 10;
      else score += 8;
    }

    // 4. Dzikir Pagi & Petang + Tasbih (Maksimal 15 poin)
    const dzikir = record.dzikir || {};
    if (dzikir.pagi) score += 5;
    if (dzikir.petang) score += 5;
    if (dzikir.tasbihTotal >= 100) score += 5;
    else if (dzikir.tasbihTotal >= 33) score += 3;

    // 5. Sedekah & Puasa (Maksimal 10 poin)
    const puasa = record.puasa || {};
    const sedekah = record.sedekah || {};
    if (puasa.isFasting) score += 5;
    if (sedekah.done || sedekah.amount > 0) score += 5;

    // 6. Habit harian tambahan (Maksimal 5 poin)
    const habitKeys = Object.keys(record.habits || {});
    let checkedHabits = 0;
    habitKeys.forEach(hId => {
      if (record.habits[hId]) checkedHabits++;
    });
    score += Math.min(5, checkedHabits * 1);

    return Math.min(maxScore, Math.round(score));
  }

  calculateStreak() {
    const today = new Date();
    let currentStreak = 0;
    let checkDate = new Date(today);

    while (true) {
      const key = this.formatDate(checkDate);
      const rec = this.state.dailyRecords[key];
      // Jika hari ini belum selesai tapi ada minimal 1 aktivitas, hitung streak
      if (rec && rec.score >= 30) {
        currentStreak++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else if (key === this.getTodayKey()) {
        // Jika hari ini masih kosong, periksa kemarin
        checkDate.setDate(checkDate.getDate() - 1);
        const yKey = this.formatDate(checkDate);
        const yRec = this.state.dailyRecords[yKey];
        if (yRec && yRec.score >= 30) {
          // Kemarin aktif, lanjutkan cek
          currentStreak++;
          checkDate.setDate(checkDate.getDate() - 1);
        } else {
          break;
        }
      } else {
        break;
      }
    }
    return currentStreak;
  }

  getWeeklyData() {
    const result = [];
    const today = new Date();
    const daysName = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];

    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const key = this.formatDate(d);
      const rec = this.state.dailyRecords[key];
      result.push({
        date: key,
        dayName: daysName[d.getDay()],
        dayNumber: d.getDate(),
        score: rec ? rec.score : 0,
        isToday: key === this.getTodayKey()
      });
    }
    return result;
  }

  // Qadha Puasa handlers
  addQadhaDebt(count) {
    this.state.qadhaPuasa.totalDebt = Math.max(0, (this.state.qadhaPuasa.totalDebt || 0) + count);
    this.save();
  }

  payQadhaDebt(count, note = '') {
    const remaining = (this.state.qadhaPuasa.totalDebt || 0) - (this.state.qadhaPuasa.paidDebt || 0);
    const toPay = Math.min(remaining, count);
    if (toPay > 0) {
      this.state.qadhaPuasa.paidDebt = (this.state.qadhaPuasa.paidDebt || 0) + toPay;
      this.state.qadhaPuasa.logs.push({
        id: Date.now().toString(),
        date: this.getTodayKey(),
        count: toPay,
        note: note || 'Qadha Puasa Terbayar'
      });
      this.save();
    }
  }

  // Sedekah Log handlers
  addSedekah(amount, category = 'Sedekah Subuh', note = '') {
    const item = {
      id: Date.now().toString(),
      date: this.getTodayKey(),
      timestamp: new Date().toISOString(),
      amount: Number(amount) || 0,
      category,
      note
    };
    this.state.sedekahHistory.unshift(item);
    
    // update today's daily record sedekah
    this.updateDailyRecord(this.getTodayKey(), rec => {
      rec.sedekah.done = true;
      rec.sedekah.amount = (rec.sedekah.amount || 0) + Number(amount);
      if (note) rec.sedekah.note = note;
    });

    this.save();
    return item;
  }

  // Tilawah Log handlers
  addQuranLog(surahName, ayahStart, ayahEnd, pagesCount, notes = '') {
    const log = {
      id: Date.now().toString(),
      date: this.getTodayKey(),
      timestamp: new Date().toISOString(),
      surah: surahName,
      ayahStart,
      ayahEnd,
      pages: Number(pagesCount) || 1,
      notes
    };
    this.state.quranLogs.unshift(log);

    // update current progress
    this.state.quranProgress.currentPage = Math.min(604, (this.state.quranProgress.currentPage || 1) + Number(pagesCount));
    this.state.quranProgress.currentJuz = Math.min(30, Math.ceil(this.state.quranProgress.currentPage / 20.13));

    // update today's record
    this.updateDailyRecord(this.getTodayKey(), rec => {
      rec.quran.read = true;
      rec.quran.pages = (rec.quran.pages || 0) + Number(pagesCount);
      rec.quran.surah = surahName;
      rec.quran.ayahStart = ayahStart;
      rec.quran.ayahEnd = ayahEnd;
      if (notes) rec.quran.notes = notes;
    });

    this.save();
    return log;
  }

  exportJSON() {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(this.state, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `muslim_tracker_backup_${this.getTodayKey()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  }

  importJSON(jsonString) {
    try {
      const parsed = JSON.parse(jsonString);
      if (!parsed.dailyRecords && !parsed.profile) {
        throw new Error('Format data tidak valid');
      }
      this.state = {
        ...DEFAULT_STATE,
        ...parsed
      };
      this.save();
      return { success: true };
    } catch (e) {
      return { success: false, error: e.message };
    }
  }

  resetAllData() {
    this.state = JSON.parse(JSON.stringify(DEFAULT_STATE));
    this.save();
  }
}

// Global instance
window.storageManager = new StorageManager();

