/**
 * prayer-times.js - Offline Astronomical Prayer Time Calculator & Hijri Date Converter
 * Standard: Kementerian Agama Republik Indonesia (Kemenag RI)
 * Fajr Angle: 20°, Isha Angle: 18°
 */

const INDONESIAN_CITIES = {
  'Jakarta': { lat: -6.2088, lng: 106.8456, timezone: 7, label: 'DKI Jakarta (WIB)' },
  'Surabaya': { lat: -7.2575, lng: 112.7521, timezone: 7, label: 'Surabaya, Jawa Timur (WIB)' },
  'Bandung': { lat: -6.9175, lng: 107.6191, timezone: 7, label: 'Bandung, Jawa Barat (WIB)' },
  'Medan': { lat: 3.5952, lng: 98.6722, timezone: 7, label: 'Medan, Sumatera Utara (WIB)' },
  'Semarang': { lat: -6.9667, lng: 110.4167, timezone: 7, label: 'Semarang, Jawa Tengah (WIB)' },
  'Makassar': { lat: -5.1477, lng: 119.4327, timezone: 8, label: 'Makassar, Sulsel (WITA)' },
  'Palembang': { lat: -2.9761, lng: 104.7754, timezone: 7, label: 'Palembang, Sumsel (WIB)' },
  'Yogyakarta': { lat: -7.7956, lng: 110.3695, timezone: 7, label: 'DI Yogyakarta (WIB)' },
  'Denpasar': { lat: -8.6705, lng: 115.2126, timezone: 8, label: 'Denpasar, Bali (WITA)' },
  'Padang': { lat: -0.9471, lng: 100.4172, timezone: 7, label: 'Padang, Sumatera Barat (WIB)' },
  'Banda Aceh': { lat: 5.5483, lng: 95.3238, timezone: 7, label: 'Banda Aceh, Aceh (WIB)' },
  'Banjarmasin': { lat: -3.3167, lng: 114.5901, timezone: 8, label: 'Banjarmasin, Kalsel (WITA)' },
  'Samarinda': { lat: -0.5016, lng: 117.1537, timezone: 8, label: 'Samarinda, Kaltim (WITA)' },
  'Pontianak': { lat: -0.0263, lng: 109.3425, timezone: 7, label: 'Pontianak, Kalbar (WIB)' },
  'Mataram': { lat: -8.5769, lng: 116.1018, timezone: 8, label: 'Mataram, Lombok (WITA)' },
  'Pekanbaru': { lat: 0.5071, lng: 101.4478, timezone: 7, label: 'Pekanbaru, Riau (WIB)' },
  'Bandar Lampung': { lat: -5.4500, lng: 105.2667, timezone: 7, label: 'Bandar Lampung (WIB)' },
  'Manado': { lat: 1.4748, lng: 124.8421, timezone: 8, label: 'Manado, Sulut (WITA)' },
  'Ambon': { lat: -3.6547, lng: 128.1906, timezone: 9, label: 'Ambon, Maluku (WIT)' },
  'Jayapura': { lat: -2.5916, lng: 140.6690, timezone: 9, label: 'Jayapura, Papua (WIT)' }
};

const HIJRI_MONTHS = [
  'Muharram', 'Shafar', 'Rabi\'ul Awwal', 'Rabi\'ul Akhir',
  'Jumadil Awwal', 'Jumadil Akhir', 'Rajab', 'Sya\'ban',
  'Ramadhan', 'Syawwal', 'Dzulqa\'dah', 'Dzulhijjah'
];

class PrayerTimesCalculator {
  constructor() {
    this.degToRad = Math.PI / 180.0;
    this.radToDeg = 180.0 / Math.PI;
  }

  // Trigonometric helpers in degrees
  sinDeg(deg) { return Math.sin(deg * this.degToRad); }
  cosDeg(deg) { return Math.cos(deg * this.degToRad); }
  tanDeg(deg) { return Math.tan(deg * this.degToRad); }
  asinDeg(x) { return Math.asin(x) * this.radToDeg; }
  acosDeg(x) { return Math.acos(x) * this.radToDeg; }
  atanDeg(x) { return Math.atan(x) * this.radToDeg; }
  atan2Deg(y, x) { return Math.atan2(y, x) * this.radToDeg; }

  // Range normalization
  fixAngle(a) {
    a = a - 360.0 * Math.floor(a / 360.0);
    return a < 0 ? a + 360.0 : a;
  }

  fixHour(h) {
    h = h - 24.0 * Math.floor(h / 24.0);
    return h < 0 ? h + 24.0 : h;
  }

  // Julian Day
  julianDate(year, month, day) {
    if (month <= 2) {
      year -= 1;
      month += 12;
    }
    const A = Math.floor(year / 100);
    const B = 2 - A + Math.floor(A / 4);
    return Math.floor(365.25 * (year + 4716)) + Math.floor(30.6001 * (month + 1)) + day + B - 1524.5;
  }

  // Sun coordinates
  sunPosition(jd) {
    const D = jd - 2451545.0;
    const g = this.fixAngle(357.529 + 0.98560028 * D);
    const q = this.fixAngle(280.459 + 0.98564736 * D);
    const L = this.fixAngle(q + 1.915 * this.sinDeg(g) + 0.020 * this.sinDeg(2 * g));
    const e = 23.439 - 0.00000036 * D;
    const d = this.asinDeg(this.sinDeg(e) * this.sinDeg(L));
    let RA = this.atan2Deg(this.cosDeg(e) * this.sinDeg(L), this.cosDeg(L)) / 15.0;
    RA = this.fixHour(RA);
    const EqT = q / 15.0 - RA;
    return { declination: d, equationOfTime: EqT };
  }

  // Calculate prayer times
  getTimes(date, latitude, longitude, timezone = 7) {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const jd = this.julianDate(year, month, day);

    const sun = this.sunPosition(jd);
    const dec = sun.declination;
    const eqt = sun.equationOfTime;

    // Midday (Transit / Dhuhr)
    const noon = this.fixHour(12 + timezone - longitude / 15.0 - eqt);

    // Kemenag standard angles:
    // Subuh (Fajr): 20 degrees
    // Isya (Isha): 18 degrees
    // Sunrise/Sunset: 0.833 degrees
    const fajrAngle = 20.0;
    const ishaAngle = 18.0;
    const sunAngle = 0.833;

    // Hour angle helper
    const getHourAngle = (angle) => {
      const cosH = (this.sinDeg(-angle) - this.sinDeg(latitude) * this.sinDeg(dec)) /
                   (this.cosDeg(latitude) * this.cosDeg(dec));
      if (cosH < -1 || cosH > 1) return null;
      return this.acosDeg(cosH) / 15.0;
    };

    // Asr calculation (Shafi'i shadow ratio = 1)
    const asrAltitude = this.atanDeg(1 / (1 + this.tanDeg(Math.abs(latitude - dec))));
    const cosAsr = (this.sinDeg(asrAltitude) - this.sinDeg(latitude) * this.sinDeg(dec)) /
                   (this.cosDeg(latitude) * this.cosDeg(dec));
    const asrHA = this.acosDeg(Math.max(-1, Math.min(1, cosAsr))) / 15.0;

    const sunriseHA = getHourAngle(sunAngle);
    const fajrHA = getHourAngle(fajrAngle);
    const ishaHA = getHourAngle(ishaAngle);

    // Add ihtiyat (safety buffer) of 2 minutes for Indonesia
    const ihtiyat = 2 / 60.0;

    const dhuhrTime = noon + ihtiyat;
    const asrTime = noon + asrHA + ihtiyat;
    const maghribTime = noon + sunriseHA + ihtiyat;
    const ishaTime = noon + ishaHA + ihtiyat;
    const sunriseTime = noon - sunriseHA - ihtiyat;
    const fajrTime = noon - fajrHA + ihtiyat;
    const imsakTime = fajrTime - (10 / 60.0);
    const dhuhaTime = sunriseTime + (20 / 60.0);

    return {
      imsak: this.formatTime(imsakTime),
      subuh: this.formatTime(fajrTime),
      syuruq: this.formatTime(sunriseTime),
      dhuha: this.formatTime(dhuhaTime),
      dzuhur: this.formatTime(dhuhrTime),
      ashar: this.formatTime(asrTime),
      maghrib: this.formatTime(maghribTime),
      isya: this.formatTime(ishaTime)
    };
  }

  formatTime(timeInHours) {
    if (isNaN(timeInHours)) return '--:--';
    const hours = Math.floor(timeInHours);
    const minutes = Math.floor((timeInHours - hours) * 60);
    const h = String(this.fixHour(hours)).padStart(2, '0');
    const m = String(minutes).padStart(2, '0');
    return `${h}:${m}`;
  }

  // Convert time "HH:MM" to Date object on given date
  timeStrToDate(timeStr, baseDate = new Date()) {
    const [h, m] = timeStr.split(':').map(Number);
    const d = new Date(baseDate);
    d.setHours(h, m, 0, 0);
    return d;
  }

  getNextPrayer(times, now = new Date()) {
    const list = [
      { name: 'Subuh', key: 'subuh', time: times.subuh },
      { name: 'Syuruq', key: 'syuruq', time: times.syuruq },
      { name: 'Dzuhur', key: 'dzuhur', time: times.dzuhur },
      { name: 'Ashar', key: 'ashar', time: times.ashar },
      { name: 'Maghrib', key: 'maghrib', time: times.maghrib },
      { name: 'Isya', key: 'isya', time: times.isya }
    ];

    const currentMinutes = now.getHours() * 60 + now.getMinutes() + now.getSeconds() / 60;

    for (let i = 0; i < list.length; i++) {
      const [h, m] = list[i].time.split(':').map(Number);
      const prayerMinutes = h * 60 + m;
      if (prayerMinutes > currentMinutes) {
        const diffMs = (prayerMinutes - currentMinutes) * 60 * 1000;
        return {
          current: list[i === 0 ? list.length - 1 : i - 1],
          next: list[i],
          diffMs
        };
      }
    }

    // After Isha, next is tomorrow's Subuh
    const [sh, sm] = list[0].time.split(':').map(Number);
    const subuhMinutesTomorrow = (24 * 60) + (sh * 60 + sm);
    const diffMs = (subuhMinutesTomorrow - currentMinutes) * 60 * 1000;
    return {
      current: list[list.length - 1],
      next: { ...list[0], name: 'Subuh (Besok)' },
      diffMs
    };
  }

  // Approximate Hijri date converter
  getHijriDate(date = new Date()) {
    const day = date.getDate();
    const month = date.getMonth();
    const year = date.getFullYear();

    let m = month + 1;
    let y = year;
    if (m < 3) {
      y -= 1;
      m += 12;
    }

    let a = Math.floor(y / 100);
    let b = 2 - a + Math.floor(a / 4);
    if (y < 1583) b = 0;
    if (y === 1582) {
      if (m > 10) b = -10;
      if (m === 10) {
        b = 0;
        if (day > 4) b = -10;
      }
    }

    const jd = Math.floor(365.25 * (y + 4716)) + Math.floor(30.6001 * (m + 1)) + day + b - 1524;
    const l = jd - 1948440 + 10632;
    const n = Math.floor((l - 1) / 10631);
    const remL = l - 10631 * n + 354;
    const j = (Math.floor((10985 - remL) / 5316)) * (Math.floor((50 * remL) / 17719)) +
              (Math.floor(remL / 5670)) * (Math.floor((43 * remL) / 15238));
    const remL2 = remL - (Math.floor((30 - j) / 15)) * (Math.floor((17719 * j) / 50)) -
                  (Math.floor(j / 16)) * (Math.floor((15238 * j) / 43)) + 29;
    const hijriMonth = Math.floor((24 * remL2) / 709);
    const hijriDay = remL2 - Math.floor((709 * hijriMonth) / 24);
    const hijriYear = 30 * n + j - 30;

    const monthIndex = Math.max(0, Math.min(11, hijriMonth - 1));
    return {
      day: hijriDay,
      month: HIJRI_MONTHS[monthIndex],
      year: hijriYear,
      formatted: `${hijriDay} ${HIJRI_MONTHS[monthIndex]} ${hijriYear} H`
    };
  }
}

// Global instance
window.prayerCalculator = new PrayerTimesCalculator();
window.INDONESIAN_CITIES = INDONESIAN_CITIES;

