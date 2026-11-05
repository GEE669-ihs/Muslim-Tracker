/**
 * fasting.js - Shaum (Puasa) & Qadha Debt Tracker
 */

class FastingController {
  constructor() {}

  isSeninKamis(date = new Date()) {
    const day = date.getDay();
    return day === 1 || day === 4; // 1 = Senin, 4 = Kamis
  }

  isAyyamulBidh(hijriDay) {
    return hijriDay === 13 || hijriDay === 14 || hijriDay === 15;
  }

  getTodayRecommendation(hijriDay, date = new Date()) {
    const recs = [];
    if (this.isSeninKamis(date)) {
      const dayName = date.getDay() === 1 ? 'Senin' : 'Kamis';
      recs.push({
        title: `Puasa Sunnah ${dayName}`,
        desc: `Rasulullah ﷺ biasa berpuasa pada hari Senin dan Kamis. (HR. Tirmidzi)`
      });
    }
    if (this.isAyyamulBidh(hijriDay)) {
      recs.push({
        title: `Puasa Ayyamul Bidh (${hijriDay} Hijriyah)`,
        desc: `Puasa 3 hari setiap pertengahan bulan Hijriyah setara dengan puasa sepanjang tahun.`
      });
    }
    return recs;
  }

  getQadhaStats() {
    const q = window.storageManager.state.qadhaPuasa || { totalDebt: 0, paidDebt: 0, logs: [] };
    const total = q.totalDebt || 0;
    const paid = q.paidDebt || 0;
    const remaining = Math.max(0, total - paid);
    const percent = total > 0 ? Math.min(100, Math.round((paid / total) * 100)) : 100;
    return {
      total,
      paid,
      remaining,
      percent,
      logs: q.logs || []
    };
  }

  deleteQadhaLog(id) {
    const q = window.storageManager.state.qadhaPuasa;
    const item = (q.logs || []).find(l => l.id === id);
    if (item) {
      q.paidDebt = Math.max(0, (q.paidDebt || 0) - item.count);
      q.logs = q.logs.filter(l => l.id !== id);
      window.storageManager.save();
    }
  }
}

window.fastingController = new FastingController();

