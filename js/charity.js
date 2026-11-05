/**
 * charity.js - Sedekah & Infaq Yaumiyah Tracker
 */

class CharityController {
  constructor() {}

  formatRupiah(number) {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(number);
  }

  getMonthlyTotal() {
    const list = window.storageManager.state.sedekahHistory || [];
    const now = new Date();
    const currentMonthPrefix = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

    let total = 0;
    list.forEach(item => {
      if (item.date && item.date.startsWith(currentMonthPrefix)) {
        total += Number(item.amount) || 0;
      }
    });
    return total;
  }

  getAllTotal() {
    const list = window.storageManager.state.sedekahHistory || [];
    return list.reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0);
  }

  deleteSedekah(id) {
    window.storageManager.state.sedekahHistory = (window.storageManager.state.sedekahHistory || []).filter(item => item.id !== id);
    window.storageManager.save();
  }
}

window.charityController = new CharityController();

