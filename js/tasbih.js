/**
 * tasbih.js - Digital Tasbih with Audio Synthesis & Dzikir Pagi-Petang Collection
 */

class SoundSynthesizer {
  constructor() {
    this.ctx = null;
  }

  init() {
    if (!this.ctx && (window.AudioContext || window.webkitAudioContext)) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioCtx();
    }
  }

  playClick() {
    try {
      this.init();
      if (!this.ctx) return;
      if (this.ctx.state === 'suspended') {
        this.ctx.resume();
      }

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(300, this.ctx.currentTime + 0.05);

      gain.gain.setValueAtTime(0.3, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.05);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.05);
    } catch (e) {
      // Audio might be blocked before first user gesture
    }
  }

  playComplete() {
    try {
      this.init();
      if (!this.ctx) return;
      if (this.ctx.state === 'suspended') {
        this.ctx.resume();
      }

      const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6 arpeggio
      notes.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        const startTime = this.ctx.currentTime + idx * 0.08;
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, startTime);

        gain.gain.setValueAtTime(0.25, startTime);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.25);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(startTime);
        osc.stop(startTime + 0.25);
      });
    } catch (e) {}
  }
}

const DZIKIR_PAGI = [
  {
    id: 'dp_1',
    title: 'Ayat Kursi',
    arabic: 'اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ ۚ لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ ۚ لَّهُ مَا فِي السَّمَاوَاتِ وَمَا فِي الْأَرْضِ ۗ مَن ذَا الَّذِي يَشْفَعُ عِندَهُ إِلَّا بِإِذْنِهِ ۚ يَعْلَمُ مَا بَيْنَ أَيْدِيهِمْ وَمَا خَلْفَهُمْ ۖ وَلَا يُحِيطُونَ بِشَيْءٍ مِّنْ عِلْمِهِ إِلَّا بِمَا شَاءَ ۚ وَسِعَ كُرْسِيُّهُ السَّمَاوَاتِ وَالْأَرْضَ ۖ وَلَا يَئُودُهُ حِفْظُهُمَا ۚ وَهُوَ الْعَلِيُّ الْعَظِيمُ',
    latin: "Allahu laa ilaaha illaa huwal hayyul qayyuum...",
    translation: 'Allah, tidak ada Tuhan (yang berhak disembah) melainkan Dia Yang Hidup kekal lagi terus menerus mengurus (makhluk-Nya)... (QS. Al-Baqarah: 255)',
    target: 1,
    fadhilah: 'Siapa yang membacanya di pagi hari maka ia dilindungi dari gangguan jin hingga petang. (HR. Al-Hakim)'
  },
  {
    id: 'dp_2',
    title: 'Surat Al-Ikhlas, Al-Falaq, & An-Nas',
    arabic: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ ﴿ قُلْ هُوَ اللَّهُ أَحَدٌ ... ﴾ & ﴿ قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ ... ﴾ & ﴿ قُلْ أَعُوذُ بِرَبِّ النَّاسِ ... ﴾',
    latin: "Membaca Al-Ikhlas, Al-Falaq, dan An-Nas masing-masing 3 kali",
    translation: 'Katakanlah: Dialah Allah, Yang Maha Esa... (Masing-masing dibaca 3 kali)',
    target: 3,
    fadhilah: 'Siapa membacanya 3 kali saat pagi dan petang, akan mencukupinya dari segala sesuatu. (HR. Abu Dawud & At-Tirmidzi)'
  },
  {
    id: 'dp_3',
    title: 'Sayyidul Istighfar',
    arabic: 'اللَّهُمَّ أَنْتَ رَبِّي لَا إِلَهَ إِلَّا أَنْتَ، خَلَقْتَنِي وَأَنَا عَبْدُكَ، وَأَنَا عَلَى عَهْدِكَ وَوَعْدِكَ مَا اسْتَطَعْتُ، أَعُوذُ بِكَ مِنْ شَرِّ مَا صَنَعْتُ، أَبُوءُ لَكَ بِنِعْمَتِكَ عَلَيَّ، وَأَبُوءُ بِذَنْبِي فَاغْفِرْ لِي فَإِنَّهُ لَا يَغْفِرُ الذُّنُوبَ إِلَّا أَنْتَ',
    latin: 'Allahumma anta rabbii laa ilaaha illaa anta, khalaqtanii wa anaa \'abduka...',
    translation: 'Ya Allah, Engkau adalah Rabbku, tidak ada Ilah yang berhak disembah selain Engkau. Engkau yang menciptakan aku dan aku adalah hamba-Mu...',
    target: 1,
    fadhilah: 'Barangsiapa mengucapkannya di waktu pagi dengan penuh keyakinan lalu meninggal sebelum petang, ia termasuk penghuni surga. (HR. Bukhari)'
  },
  {
    id: 'dp_4',
    title: 'Doa Perlindungan Pagi Hari',
    arabic: 'أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ، لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ',
    latin: 'Ash-bahnaa wa ash-bahal mulku lillaah, walhamdulillaah, laa ilaaha illallaah wahdahu laa syariika lah...',
    translation: 'Kami telah memasuki waktu pagi dan kerajaan hanya milik Allah, segala puji bagi Allah...',
    target: 1,
    fadhilah: 'Dzikir pagi memuji keagungan Allah dan memohon kebaikan hari ini. (HR. Muslim)'
  },
  {
    id: 'dp_5',
    title: 'Doa Memohon Perlindungan dari Kejelekan Makhluk (3x)',
    arabic: 'بِسْمِ اللَّهِ الَّذِي لَا يَضُرُّ مَعَ اسْمِهِ شَيْءٌ فِي الْأَرْضِ وَلَا فِي السَّمَاءِ وَهُوَ السَّمِيعُ الْعَلِيمُ',
    latin: "Bismillaahilladzii laa yadhurru ma'asmihi syai-un fil ardhi wa laa fis-samaa-i wa huwas-samii'ul 'aliim",
    translation: 'Dengan menyebut nama Allah yang dengan nama-Nya tidak ada sesuatu pun di bumi maupun di langit yang dapat membahayakan, dan Dia Maha Mendengar lagi Maha Mengetahui.',
    target: 3,
    fadhilah: 'Tidak akan tertimpa mudharat atau bahaya apa pun. (HR. Abu Dawud & Tirmidzi)'
  },
  {
    id: 'dp_6',
    title: 'Keridhoan kepada Allah, Islam, & Nabi Muhammad (3x)',
    arabic: 'رَضِيتُ بِاللَّهِ رَبًّا، وَبِالْإِسْلَامِ دِينًا، وَبِمُحَمَّدٍ صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ نَبِيًّا',
    latin: "Radhiitu billaahi rabbaa, wa bil-islaami diinaa, wa bi-muhammadin shallallaahu 'alaihi wa sallama nabiyyaa",
    translation: 'Aku ridha Allah sebagai Rabbku, Islam sebagai agamaku, dan Muhammad shallallahu \'alaihi wa sallam sebagai Nabiku.',
    target: 3,
    fadhilah: 'Pantas bagi Allah untuk meridhoinya pada hari kiamat. (HR. Abu Dawud & Ahmad)'
  },
  {
    id: 'dp_7',
    title: 'Doa Keselamatan & Kesehatan Tubuh (3x)',
    arabic: 'اللَّهُمَّ عَافِنِي فِي بَدَنِي، اللَّهُمَّ عَافِنِي فِي سَمْعِي، اللَّهُمَّ عَافِنِي فِي بَصَرِي، لَا إِلَهَ إِلَّا أَنْتَ',
    latin: "Allahumma 'aafinii fii badanii, Allahumma 'aafinii fii sam'ii, Allahumma 'aafinii fii basharii, laa ilaaha illaa anta",
    translation: 'Ya Allah, selamatkanlah tubuhku (dari penyakit). Ya Allah, selamatkanlah pendengaranku. Ya Allah, selamatkanlah penglihatanku. Tidak ada Tuhan yang berhak disembah selain Engkau.',
    target: 3,
    fadhilah: 'Menjaga kesehatan fisik dan panca indera dalam ketaatan. (HR. Abu Dawud)'
  },
  {
    id: 'dp_8',
    title: 'Subhanallahi wa Bihamdih (100x)',
    arabic: 'سُبْحَانَ اللَّهِ وَبِحَمْدِهِ',
    latin: 'Subhanallaahi wa bihamdih',
    translation: 'Maha Suci Allah dan segala puji bagi-Nya.',
    target: 100,
    fadhilah: 'Dihapuskan dosa-dosanya meskipun sebanyak buih di lautan. (HR. Bukhari & Muslim)'
  }
];

const DZIKIR_PETANG = [
  {
    id: 'dpet_1',
    title: 'Ayat Kursi',
    arabic: 'اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ ۚ لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ ...',
    latin: "Allahu laa ilaaha illaa huwal hayyul qayyuum...",
    translation: 'Membaca Ayat Kursi saat petang hari untuk perlindungan hingga pagi.',
    target: 1,
    fadhilah: 'Dilindungi dari gangguan setan hingga waktu pagi. (HR. Al-Hakim)'
  },
  {
    id: 'dpet_2',
    title: 'Surat Al-Ikhlas, Al-Falaq, & An-Nas',
    arabic: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ ﴿ قُلْ هُوَ اللَّهُ أَحَدٌ ... ﴾ & ﴿ قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ ... ﴾ & ﴿ قُلْ أَعُوذُ بِرَبِّ النَّاسِ ... ﴾',
    latin: "Membaca Al-Ikhlas, Al-Falaq, dan An-Nas masing-masing 3 kali",
    translation: 'Masing-masing dibaca 3 kali saat petang hari.',
    target: 3,
    fadhilah: 'Mencukupi pembacanya dari segala marabahaya. (HR. Tirmidzi)'
  },
  {
    id: 'dpet_3',
    title: 'Sayyidul Istighfar',
    arabic: 'اللَّهُمَّ أَنْتَ رَبِّي لَا إِلَهَ إِلَّا أَنْتَ، خَلَقْتَنِي وَأَنَا عَبْدُكَ، وَأَنَا عَلَى عهدِكَ وَوَعْدِكَ مَا اسْتَطَعْتُ، أَعُوذُ بِكَ مِنْ شَرِّ مَا صَنَعْتُ...',
    latin: 'Allahumma anta rabbii laa ilaaha illaa anta...',
    translation: 'Sayyidul Istighfar saat petang hari.',
    target: 1,
    fadhilah: 'Barangsiapa membacanya saat petang lalu meninggal di malamnya, ia masuk surga. (HR. Bukhari)'
  },
  {
    id: 'dpet_4',
    title: 'Doa Perlindungan Petang Hari',
    arabic: 'أَمْسَيْنَا وَأَمْسَى الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ، لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ',
    latin: 'Amsaynaa wa amsal mulku lillaah, walhamdulillaah...',
    translation: 'Kami telah memasuki waktu petang dan kerajaan hanya milik Allah, segala puji bagi Allah...',
    target: 1,
    fadhilah: 'Menyerahkan perlindungan malam hari hanya kepada Allah. (HR. Muslim)'
  },
  {
    id: 'dpet_5',
    title: 'Memohon Perlindungan Kalimat Allah dari Bahaya (3x)',
    arabic: 'أَعُوذُ بِكَلِمَاتِ اللَّهِ التَّامَّاتِ مِنْ شَرِّ مَا خَلَقَ',
    latin: "A'uudzu bikalimaatillaahit-taammaati min syarri maa khalaq",
    translation: 'Aku berlindung dengan kalimat-kalimat Allah yang sempurna dari kejahatan makhluk yang Dia ciptakan.',
    target: 3,
    fadhilah: 'Tidak akan ada racun, sengatan binatang, atau gangguan yang membahayakannya malam itu. (HR. Muslim)'
  },
  {
    id: 'dpet_6',
    title: 'Bismillaahilladzii Laa Yadhurru (3x)',
    arabic: 'بِسْمِ اللَّهِ الَّذِي لَا يَضُرُّ مَعَ اسْمِهِ شَيْءٌ فِي الْأَرْضِ وَلَا فِي السَّمَاءِ وَهُوَ السَّمِيعُ الْعَلِيمُ',
    latin: "Bismillaahilladzii laa yadhurru ma'asmihi syai-un fil ardhi wa laa fis-samaa-i wa huwas-samii'ul 'aliim",
    translation: 'Dengan menyebut nama Allah yang dengan nama-Nya tidak ada sesuatu pun di bumi maupun di langit yang dapat membahayakan...',
    target: 3,
    fadhilah: 'Terhindar dari marabahaya tiba-tiba. (HR. Abu Dawud)'
  }
];

class TasbihController {
  constructor() {
    this.sound = new SoundSynthesizer();
    this.count = 0;
    this.target = 33;
    this.totalCount = 0;
    this.title = 'Subhanallah';
    this.dzikirProgress = {}; // { [id]: count }
  }

  setPreset(name, target) {
    this.title = name;
    this.target = target;
    this.count = 0;
    this.render();
  }

  increment() {
    this.count++;
    this.totalCount++;
    this.sound.playClick();

    if (navigator.vibrate) {
      navigator.vibrate(25);
    }

    if (this.target > 0 && this.count === this.target) {
      this.sound.playComplete();
      if (navigator.vibrate) {
        navigator.vibrate([60, 50, 100]);
      }
      if (window.confetti) {
        window.confetti({
          particleCount: 40,
          spread: 60,
          origin: { y: 0.7 }
        });
      }
    }

    // Save total tasbih count in today's daily record
    if (window.storageManager) {
      window.storageManager.updateDailyRecord(window.storageManager.getTodayKey(), rec => {
        rec.dzikir.tasbihTotal = (rec.dzikir.tasbihTotal || 0) + 1;
      });
    }

    this.render();
  }

  reset() {
    this.count = 0;
    this.render();
  }

  render() {
    const countEl = document.getElementById('tasbih-count');
    const targetEl = document.getElementById('tasbih-target');
    const titleEl = document.getElementById('tasbih-title');

    if (countEl) countEl.innerText = this.count;
    if (targetEl) targetEl.innerText = this.target > 0 ? `Target: ${this.target}` : 'Bebas (Tanpa Target)';
    if (titleEl) titleEl.innerText = this.title;

    // Progress ring rendering is handled by app.js renderTasbihUI()
  }
}

window.tasbihController = new TasbihController();
window.DZIKIR_PAGI = DZIKIR_PAGI;
window.DZIKIR_PETANG = DZIKIR_PETANG;

