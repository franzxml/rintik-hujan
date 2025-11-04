// CANVAS HUJAN (tidak diubah dari versi sebelumnya)
const kanvas = document.getElementById('kanvas-hujan');
const konteks = kanvas.getContext('2d');

let lebar = window.innerWidth;
let tinggi = window.innerHeight;
kanvas.width = lebar;
kanvas.height = tinggi;

const tetesan = [];
const jumlahTetes = 250;

for (let i = 0; i < jumlahTetes; i++) {
  tetesan.push({
    x: Math.random() * lebar,
    y: Math.random() * tinggi,
    panjang: Math.random() * 20 + 10,
    kecepatan: Math.random() * 5 + 4,
    ketebalan: Math.random() * 0.8 + 0.2
  });
}

function gambar() {
  konteks.clearRect(0, 0, lebar, tinggi);
  konteks.fillStyle = 'rgba(0, 20, 40, 0.25)';
  konteks.fillRect(0, 0, lebar, tinggi);

  konteks.strokeStyle = 'rgba(0,180,255,0.6)';
  for (let i = 0; i < jumlahTetes; i++) {
    let t = tetesan[i];
    konteks.lineWidth = t.ketebalan;
    konteks.beginPath();
    konteks.moveTo(t.x, t.y);
    konteks.lineTo(t.x, t.y + t.panjang);
    konteks.stroke();
  }
  gerak();
}

function gerak() {
  for (let i = 0; i < jumlahTetes; i++) {
    let t = tetesan[i];
    t.y += t.kecepatan;
    if (t.y > tinggi) {
      t.y = -20;
      t.x = Math.random() * lebar;
    }
  }
}

function loop() {
  gambar();
  requestAnimationFrame(loop);
}
loop();

window.addEventListener('resize', () => {
  lebar = window.innerWidth;
  tinggi = window.innerHeight;
  kanvas.width = lebar;
  kanvas.height = tinggi;
});

// AUDIO: pakai Web Audio API untuk unmute terprogram
const suaraEl = document.getElementById('suara-hujan');

async function setupAudio() {
  // buat AudioContext dan node gain
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  if (!AudioContext) {
    console.warn('Web Audio API tidak tersedia di browser ini.');
    return;
  }

  const audioCtx = new AudioContext();
  // koneksi MediaElement ke AudioContext
  let source;
  try {
    source = audioCtx.createMediaElementSource(suaraEl);
  } catch (e) {
    console.warn('Tidak bisa membuat MediaElementSource. CORS atau format mungkin bermasalah.', e);
  }

  const gain = audioCtx.createGain();
  // mulai dengan nol volume di gain. Kita akan meramp ke volume target.
  gain.gain.value = 0;
  if (source) source.connect(gain);
  gain.connect(audioCtx.destination);

  // coba play elemen (muted) agar browser mengizinkan autoplay
  try {
    await suaraEl.play();
  } catch (e) {
    // pemutaran mungkin diblokir, lanjutkan karena kita akan coba resume AudioContext
    console.warn('Play awal diblokir:', e);
  }

  // coba resume audioCtx. Beberapa browser mengizinkan resume jika elemen autoplay (muted) sedang berjalan.
  try {
    await audioCtx.resume();
    // ramp dari 0 ke target dalam 2 detik
    const targetVolume = 0.25;
    const now = audioCtx.currentTime;
    gain.gain.cancelScheduledValues(now);
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(targetVolume, now + 2);
    // jika elemen masih dimuted, angkat muted agar kontrol elemen sinkron
    try { suaraEl.muted = false; } catch (e) { /* tidak kritikal */ }
    console.log('AudioContext running. Suara diaktifkan otomatis.');
    return;
  } catch (err) {
    console.warn('AudioContext tidak bisa diresume tanpa interaksi:', err);
  }

  // fallback: pasang event sekali untuk resume jika browser memang blokir
  document.body.addEventListener('click', async function resumeOnClick() {
    try {
      await audioCtx.resume();
      const now = audioCtx.currentTime;
      gain.gain.cancelScheduledValues(now);
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.25, now + 1.5);
      try { suaraEl.muted = false; } catch (e) {}
      console.log('AudioContext diresume melalui klik pengguna.');
    } catch (e) {
      console.warn('Gagal resume setelah klik:', e);
    }
    this.removeEventListener('click', resumeOnClick);
  }, { once: true });

  // juga pasang fallback timer untuk mencoba lagi setelah 3 detik
  setTimeout(async () => {
    if (audioCtx.state !== 'running') {
      try {
        await audioCtx.resume();
        const now = audioCtx.currentTime;
        gain.gain.cancelScheduledValues(now);
        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(0.25, now + 2);
        try { suaraEl.muted = false; } catch (e) {}
        console.log('Percobaan resume otomatis kedua berhasil.');
      } catch (e) {
        console.warn('Percobaan resume otomatis kedua gagal. Periksa pengaturan autoplay browser.');
      }
    }
  }, 3000);
}

// jalankan setup audio saat halaman load
window.addEventListener('load', () => {
  setupAudio();
});
