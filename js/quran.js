/**
 * quran.js - Al-Qur'an Tilawah & Khatam Tracker with 114 Surah Metadata
 */

const SURAH_LIST = [
  { no: 1, name: 'Al-Fatihah', arabic: 'الفاتحة', ayat: 7, type: 'Makkiyyah' },
  { no: 2, name: 'Al-Baqarah', arabic: 'البقرة', ayat: 286, type: 'Madaniyyah' },
  { no: 3, name: 'Ali \'Imran', arabic: 'آل عمران', ayat: 200, type: 'Madaniyyah' },
  { no: 4, name: 'An-Nisa\'', arabic: 'النساء', ayat: 176, type: 'Madaniyyah' },
  { no: 5, name: 'Al-Ma\'idah', arabic: 'المائدة', ayat: 120, type: 'Madaniyyah' },
  { no: 6, name: 'Al-An\'am', arabic: 'الأنعام', ayat: 165, type: 'Makkiyyah' },
  { no: 7, name: 'Al-A\'raf', arabic: 'الأعراف', ayat: 206, type: 'Makkiyyah' },
  { no: 8, name: 'Al-Anfal', arabic: 'الأنفال', ayat: 75, type: 'Madaniyyah' },
  { no: 9, name: 'At-Taubah', arabic: 'التوبة', ayat: 129, type: 'Madaniyyah' },
  { no: 10, name: 'Yunus', arabic: 'يونس', ayat: 109, type: 'Makkiyyah' },
  { no: 11, name: 'Hud', arabic: 'هود', ayat: 123, type: 'Makkiyyah' },
  { no: 12, name: 'Yusuf', arabic: 'يوسف', ayat: 111, type: 'Makkiyyah' },
  { no: 13, name: 'Ar-Ra\'d', arabic: 'الرعد', ayat: 43, type: 'Madaniyyah' },
  { no: 14, name: 'Ibrahim', arabic: 'إبراهيم', ayat: 52, type: 'Makkiyyah' },
  { no: 15, name: 'Al-Hijr', arabic: 'الحجر', ayat: 99, type: 'Makkiyyah' },
  { no: 16, name: 'An-Nahl', arabic: 'النحل', ayat: 128, type: 'Makkiyyah' },
  { no: 17, name: 'Al-Isra\'', arabic: 'الإسراء', ayat: 111, type: 'Makkiyyah' },
  { no: 18, name: 'Al-Kahf', arabic: 'الكهف', ayat: 110, type: 'Makkiyyah' },
  { no: 19, name: 'Maryam', arabic: 'مريم', ayat: 98, type: 'Makkiyyah' },
  { no: 20, name: 'Ta-Ha', arabic: 'طه', ayat: 135, type: 'Makkiyyah' },
  { no: 21, name: 'Al-Anbiya\'', arabic: 'الأنبياء', ayat: 112, type: 'Makkiyyah' },
  { no: 22, name: 'Al-Hajj', arabic: 'الحج', ayat: 78, type: 'Madaniyyah' },
  { no: 23, name: 'Al-Mu\'minun', arabic: 'المؤمنون', ayat: 118, type: 'Makkiyyah' },
  { no: 24, name: 'An-Nur', arabic: 'النور', ayat: 64, type: 'Madaniyyah' },
  { no: 25, name: 'Al-Furqan', arabic: 'الفرقان', ayat: 77, type: 'Makkiyyah' },
  { no: 26, name: 'Asy-Syu\'ara\'', arabic: 'الشعراء', ayat: 227, type: 'Makkiyyah' },
  { no: 27, name: 'An-Naml', arabic: 'النمل', ayat: 93, type: 'Makkiyyah' },
  { no: 28, name: 'Al-Qasas', arabic: 'القصص', ayat: 88, type: 'Makkiyyah' },
  { no: 29, name: 'Al-\'Ankabut', arabic: 'العنكبوت', ayat: 69, type: 'Makkiyyah' },
  { no: 30, name: 'Ar-Rum', arabic: 'الروم', ayat: 60, type: 'Makkiyyah' },
  { no: 31, name: 'Luqman', arabic: 'لقمان', ayat: 34, type: 'Makkiyyah' },
  { no: 32, name: 'As-Sajdah', arabic: 'السجدة', ayat: 30, type: 'Makkiyyah' },
  { no: 33, name: 'Al-Ahzab', arabic: 'الأحزاب', ayat: 73, type: 'Madaniyyah' },
  { no: 34, name: 'Saba\'', arabic: 'سبإ', ayat: 54, type: 'Makkiyyah' },
  { no: 35, name: 'Fatir', arabic: 'فاطر', ayat: 45, type: 'Makkiyyah' },
  { no: 36, name: 'Ya-Sin', arabic: 'يس', ayat: 83, type: 'Makkiyyah' },
  { no: 37, name: 'As-Saffat', arabic: 'الصافات', ayat: 182, type: 'Makkiyyah' },
  { no: 38, name: 'Sad', arabic: 'ص', ayat: 88, type: 'Makkiyyah' },
  { no: 39, name: 'Az-Zumar', arabic: 'الزمر', ayat: 75, type: 'Makkiyyah' },
  { no: 40, name: 'Ghafir', arabic: 'غافر', ayat: 85, type: 'Makkiyyah' },
  { no: 41, name: 'Fussilat', arabic: 'فصلت', ayat: 54, type: 'Makkiyyah' },
  { no: 42, name: 'Asy-Syura', arabic: 'الشورى', ayat: 53, type: 'Makkiyyah' },
  { no: 43, name: 'Az-Zukhruf', arabic: 'الزخرف', ayat: 89, type: 'Makkiyyah' },
  { no: 44, name: 'Ad-Dukhan', arabic: 'الدخان', ayat: 59, type: 'Makkiyyah' },
  { no: 45, name: 'Al-Jasiyah', arabic: 'الجاثية', ayat: 37, type: 'Makkiyyah' },
  { no: 46, name: 'Al-Ahqaf', arabic: 'الأحقاف', ayat: 35, type: 'Makkiyyah' },
  { no: 47, name: 'Muhammad', arabic: 'محمد', ayat: 38, type: 'Madaniyyah' },
  { no: 48, name: 'Al-Fath', arabic: 'الفتح', ayat: 29, type: 'Madaniyyah' },
  { no: 49, name: 'Al-Hujurat', arabic: 'الحجرات', ayat: 18, type: 'Madaniyyah' },
  { no: 50, name: 'Qaf', arabic: 'ق', ayat: 45, type: 'Makkiyyah' },
  { no: 51, name: 'Az-Zariyat', arabic: 'الذاريات', ayat: 60, type: 'Makkiyyah' },
  { no: 52, name: 'At-Tur', arabic: 'الطور', ayat: 49, type: 'Makkiyyah' },
  { no: 53, name: 'An-Najm', arabic: 'النجم', ayat: 62, type: 'Makkiyyah' },
  { no: 54, name: 'Al-Qamar', arabic: 'القمر', ayat: 55, type: 'Makkiyyah' },
  { no: 55, name: 'Ar-Rahman', arabic: 'الرحمن', ayat: 78, type: 'Madaniyyah' },
  { no: 56, name: 'Al-Waqi\'ah', arabic: 'الواقعة', ayat: 96, type: 'Makkiyyah' },
  { no: 57, name: 'Al-Hadid', arabic: 'الحديد', ayat: 29, type: 'Madaniyyah' },
  { no: 58, name: 'Al-Mujadilah', arabic: 'المجادلة', ayat: 22, type: 'Madaniyyah' },
  { no: 59, name: 'Al-Hasyr', arabic: 'الحشر', ayat: 24, type: 'Madaniyyah' },
  { no: 60, name: 'Al-Mumtahanah', arabic: 'الممتحنة', ayat: 13, type: 'Madaniyyah' },
  { no: 61, name: 'As-Saff', arabic: 'الصف', ayat: 14, type: 'Madaniyyah' },
  { no: 62, name: 'Al-Jumu\'ah', arabic: 'الجمعة', ayat: 11, type: 'Madaniyyah' },
  { no: 63, name: 'Al-Munafiqun', arabic: 'المنافقون', ayat: 11, type: 'Madaniyyah' },
  { no: 64, name: 'At-Taghabun', arabic: 'التغابن', ayat: 18, type: 'Madaniyyah' },
  { no: 65, name: 'At-Talaq', arabic: 'الطلاق', ayat: 12, type: 'Madaniyyah' },
  { no: 66, name: 'At-Tahrim', arabic: 'التحريم', ayat: 12, type: 'Madaniyyah' },
  { no: 67, name: 'Al-Mulk', arabic: 'الملك', ayat: 30, type: 'Makkiyyah' },
  { no: 68, name: 'Al-Qalam', arabic: 'القلم', ayat: 52, type: 'Makkiyyah' },
  { no: 69, name: 'Al-Haqqah', arabic: 'الحاقة', ayat: 52, type: 'Makkiyyah' },
  { no: 70, name: 'Al-Ma\'arij', arabic: 'المعارج', ayat: 44, type: 'Makkiyyah' },
  { no: 71, name: 'Nuh', arabic: 'نوح', ayat: 28, type: 'Makkiyyah' },
  { no: 72, name: 'Al-Jinn', arabic: 'الجن', ayat: 28, type: 'Makkiyyah' },
  { no: 73, name: 'Al-Muzzammil', arabic: 'المزمل', ayat: 20, type: 'Makkiyyah' },
  { no: 74, name: 'Al-Muddassir', arabic: 'المدثر', ayat: 56, type: 'Makkiyyah' },
  { no: 75, name: 'Al-Qiyamah', arabic: 'القيامة', ayat: 40, type: 'Makkiyyah' },
  { no: 76, name: 'Al-Insan', arabic: 'الإنسان', ayat: 31, type: 'Madaniyyah' },
  { no: 77, name: 'Al-Mursalat', arabic: 'المرسلات', ayat: 50, type: 'Makkiyyah' },
  { no: 78, name: 'An-Naba\'', arabic: 'النبإ', ayat: 40, type: 'Makkiyyah' },
  { no: 79, name: 'An-Nazi\'at', arabic: 'النازعات', ayat: 46, type: 'Makkiyyah' },
  { no: 80, name: '\'Abasa', arabic: 'عبس', ayat: 42, type: 'Makkiyyah' },
  { no: 81, name: 'At-Takwir', arabic: 'التكوير', ayat: 29, type: 'Makkiyyah' },
  { no: 82, name: 'Al-Infitar', arabic: 'الانفطار', ayat: 19, type: 'Makkiyyah' },
  { no: 83, name: 'Al-Mutaffifin', arabic: 'المطففين', ayat: 36, type: 'Makkiyyah' },
  { no: 84, name: 'Al-Insyiqaq', arabic: 'الانشقاق', ayat: 25, type: 'Makkiyyah' },
  { no: 85, name: 'Al-Buruj', arabic: 'البروج', ayat: 22, type: 'Makkiyyah' },
  { no: 86, name: 'At-Tariq', arabic: 'الطارق', ayat: 17, type: 'Makkiyyah' },
  { no: 87, name: 'Al-A\'la', arabic: 'الأعلى', ayat: 19, type: 'Makkiyyah' },
  { no: 88, name: 'Al-Ghasyiyah', arabic: 'الغاشية', ayat: 26, type: 'Makkiyyah' },
  { no: 89, name: 'Al-Fajr', arabic: 'الفجر', ayat: 30, type: 'Makkiyyah' },
  { no: 90, name: 'Al-Balad', arabic: 'البلد', ayat: 20, type: 'Makkiyyah' },
  { no: 91, name: 'Asy-Syams', arabic: 'الشمس', ayat: 15, type: 'Makkiyyah' },
  { no: 92, name: 'Al-Lail', arabic: 'الليل', ayat: 21, type: 'Makkiyyah' },
  { no: 93, name: 'Ad-Duha', arabic: 'الضحى', ayat: 11, type: 'Makkiyyah' },
  { no: 94, name: 'Asy-Syarh', arabic: 'الشرح', ayat: 8, type: 'Makkiyyah' },
  { no: 95, name: 'At-Tin', arabic: 'التين', ayat: 8, type: 'Makkiyyah' },
  { no: 96, name: 'Al-\'Alaq', arabic: 'العلق', ayat: 19, type: 'Makkiyyah' },
  { no: 97, name: 'Al-Qadr', arabic: 'القدر', ayat: 5, type: 'Makkiyyah' },
  { no: 98, name: 'Al-Bayyinah', arabic: 'البينة', ayat: 8, type: 'Madaniyyah' },
  { no: 99, name: 'Az-Zalzalah', arabic: 'الزلزلة', ayat: 8, type: 'Madaniyyah' },
  { no: 100, name: 'Al-\'Adiyat', arabic: 'العاديات', ayat: 11, type: 'Makkiyyah' },
  { no: 101, name: 'Al-Qari\'ah', arabic: 'القارعة', ayat: 11, type: 'Makkiyyah' },
  { no: 102, name: 'At-Takasur', arabic: 'التكاثر', ayat: 8, type: 'Makkiyyah' },
  { no: 103, name: 'Al-\'Asr', arabic: 'العصر', ayat: 3, type: 'Makkiyyah' },
  { no: 104, name: 'Al-Humazah', arabic: 'الهمزة', ayat: 9, type: 'Makkiyyah' },
  { no: 105, name: 'Al-Fil', arabic: 'الفيل', ayat: 5, type: 'Makkiyyah' },
  { no: 106, name: 'Quraisy', arabic: 'قريش', ayat: 4, type: 'Makkiyyah' },
  { no: 107, name: 'Al-Ma\'un', arabic: 'الماعون', ayat: 7, type: 'Makkiyyah' },
  { no: 108, name: 'Al-Kausar', arabic: 'الكوثر', ayat: 3, type: 'Makkiyyah' },
  { no: 109, name: 'Al-Kafirun', arabic: 'الكافرون', ayat: 6, type: 'Makkiyyah' },
  { no: 110, name: 'An-Nasr', arabic: 'النصر', ayat: 3, type: 'Madaniyyah' },
  { no: 111, name: 'Al-Lahab', arabic: 'اللهب', ayat: 5, type: 'Makkiyyah' },
  { no: 112, name: 'Al-Ikhlas', arabic: 'الإخلاص', ayat: 4, type: 'Makkiyyah' },
  { no: 113, name: 'Al-Falaq', arabic: 'الفلق', ayat: 5, type: 'Makkiyyah' },
  { no: 114, name: 'An-Nas', arabic: 'الناس', ayat: 6, type: 'Makkiyyah' }
];

class QuranTracker {
  constructor() {
    this.totalPages = 604;
    this.totalJuz = 30;
  }

  getProgressInfo() {
    const state = window.storageManager.state.quranProgress || { currentPage: 1, currentJuz: 1 };
    const currentPage = Math.max(1, Math.min(this.totalPages, state.currentPage || 1));
    const currentJuz = Math.max(1, Math.min(30, Math.ceil(currentPage / 20.13)));
    const percent = ((currentPage / this.totalPages) * 100).toFixed(1);
    const remainingPages = this.totalPages - currentPage;

    const dailyTarget = state.dailyPageTarget || 20;
    const estDaysRemaining = Math.ceil(remainingPages / (dailyTarget > 0 ? dailyTarget : 1));

    return {
      currentPage,
      currentJuz,
      percent,
      remainingPages,
      dailyTarget,
      estDaysRemaining
    };
  }

  setPageDirectly(page) {
    const validPage = Math.max(1, Math.min(this.totalPages, Number(page) || 1));
    window.storageManager.state.quranProgress.currentPage = validPage;
    window.storageManager.state.quranProgress.currentJuz = Math.min(30, Math.ceil(validPage / 20.13));
    window.storageManager.save();
  }

  setDailyTarget(pages) {
    window.storageManager.state.quranProgress.dailyPageTarget = Number(pages) || 20;
    window.storageManager.save();
  }

  deleteLog(id) {
    window.storageManager.state.quranLogs = (window.storageManager.state.quranLogs || []).filter(l => l.id !== id);
    window.storageManager.save();
  }
}

window.quranTracker = new QuranTracker();
window.SURAH_LIST = SURAH_LIST;

