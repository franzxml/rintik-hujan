// --- KONFIGURASI KANVAS ---
const kanvas = document.getElementById('kanvas-hujan');
const konteks = kanvas.getContext('2d');

let lebar = window.innerWidth;
let tinggi = window.innerHeight;
kanvas.width = lebar;
kanvas.height = tinggi;

// --- VARIABEL ANIMASI ---
const tetesan = [];
const cipratan = []; // Array untuk partikel cipratan
const jumlahTetes = 300; // Ditambah sedikit biar makin deras
let angin = 0; // Nilai angin dinamis
let petirOpacity = 0; // Untuk efek kilat

// Inisialisasi Tetesan Hujan
for (let i = 0; i < jumlahTetes; i++) {
  tetesan.push(buatTetesan(true));
}

function buatTetesan(acakY = false) {
  return {
    x: Math.random() * lebar,
    y: acakY ? Math.random() * tinggi : -20,
    panjang: Math.random() * 20 + 10,
    kecepatan: Math.random() * 8 + 5, // Lebih cepat sedikit
    ketebalan: Math.random() * 1 + 0.5
  };
}

// --- FUNGSI UTAMA GAMBAR ---
function gambar() {
  // 1. Bersihkan layar
  konteks.clearRect(0, 0, lebar, tinggi);

  // 2. Efek Petir (Background Flash)
  // Jika petirOpacity > 0, gambar kotak putih transparan di seluruh layar
  if (petirOpacity > 0) {
    konteks.fillStyle = `rgba(255, 255, 255, ${petirOpacity})`;
    konteks.fillRect(0, 0, lebar, tinggi);
    petirOpacity -= 0.02; // Fade out perlahan
    if (petirOpacity < 0) petirOpacity = 0;
  } 
  // Jika tidak ada petir, gambar lapisan malam semi-transparan (vignette effect manual)
  else {
    konteks.fillStyle = 'rgba(0, 8, 20, 0.3)';
    konteks.fillRect(0, 0, lebar, tinggi);
  }

  // 3. Gambar Hujan
  konteks.strokeStyle = 'rgba(170, 220, 255, 0.6)';
  konteks.lineCap = 'round';

  for (let i = 0; i < jumlahTetes; i++) {
    let t = tetesan[i];
    
    konteks.lineWidth = t.ketebalan;
    konteks.beginPath();
    konteks.moveTo(t.x, t.y);
    // Ujung bawah garis mengikuti arah angin
    konteks.lineTo(t.x + angin, t.y + t.panjang);
    konteks.stroke();
  }

  // 4. Gambar Cipratan
  for (let i = 0; i < cipratan.length; i++) {
    let c = cipratan[i];
    konteks.fillStyle = `rgba(170, 220, 255, ${c.opacity})`;
    konteks.beginPath();
    konteks.arc(c.x, c.y, c.radius, 0, Math.PI * 2);
    konteks.fill();
  }

  updateFisika();
}

// --- FUNGSI FISIKA & LOGIKA ---
function updateFisika() {
  // Update Angin (menggunakan Sinus waktu agar berubah arah bolak-balik perlahan)
  const waktu = Date.now() * 0.001;
  angin = Math.sin(waktu) * 3; // Angin bergoyang kiri-kanan

  // Cek Petir Acak
  // 0.3% kemungkinan setiap frame terjadi petir kecil, 0.05% petir besar
  if (Math.random() < 0.001) {
    triggerPetir();
  }

  // Update Tetesan
  for (let i = 0; i < jumlahTetes; i++) {
    let t = tetesan[i];
    t.y += t.kecepatan;
    t.x += angin * 0.5; // Hujan terbawa angin

    // Jika tetesan keluar layar bawah
    if (t.y > tinggi) {
      // Buat cipratan
      buatCipratan(t.x, tinggi);
      
      // Reset tetesan ke atas
      t.y = -20;
      t.x = Math.random() * lebar;
    }
    // Jika tetesan keluar layar samping (karena angin kencang)
    if (t.x > lebar + 20) t.x = -20;
    if (t.x < -20) t.x = lebar + 20;
  }

  // Update Cipratan
  for (let i = cipratan.length - 1; i >= 0; i--) {
    let c = cipratan[i];
    c.y -= c.kecepatanY; // Cipratan naik sedikit
    c.radius += 0.05;    // Cipratan membesar
    c.opacity -= 0.05;   // Cipratan memudar

    if (c.opacity <= 0) {
      cipratan.splice(i, 1); // Hapus jika sudah tidak terlihat
    }
  }
}

function buatCipratan(x, y) {
  // Buat 2-3 partikel kecil per tetesan yang jatuh
  const jumlahPartikel = Math.floor(Math.random() * 2) + 1;
  for (let i = 0; i < jumlahPartikel; i++) {
    cipratan.push({
      x: x + (Math.random() * 10 - 5),
      y: y,
      kecepatanY: Math.random() * 1 + 0.5,
      radius: Math.random() * 1.5,
      opacity: 0.8
    });
  }
}

function triggerPetir() {
  // Play sound effect petir jika ada (opsional), di sini visual saja
  petirOpacity = Math.random() * 0.6 + 0.2; // Opacity acak antara 0.2 - 0.8
  
  // Efek kilat ganda (flicker)
  setTimeout(() => {
    if (Math.random() > 0.5) petirOpacity = Math.random() * 0.5;
  }, 100);
}

function loop() {
  gambar();
  requestAnimationFrame(loop);
}
loop();

// --- RESIZE HANDLER ---
window.addEventListener('resize', () => {
  lebar = window.innerWidth;
  tinggi = window.innerHeight;
  kanvas.width = lebar;
  kanvas.height = tinggi;
});

// --- FITUR JAM DIGITAL ---
function updateJam() {
  const sekarang = new Date();
  const jamEl = document.getElementById('jam');
  const tglEl = document.getElementById('tanggal');

  // Format Waktu HH:MM
  const jam = String(sekarang.getHours()).padStart(2, '0');
  const menit = String(sekarang.getMinutes()).padStart(2, '0');
  jamEl.innerText = `${jam}:${menit}`;

  // Format Tanggal (Contoh: Senin, 15 Des 2025)
  const opsi = { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' };
  tglEl.innerText = sekarang.toLocaleDateString('id-ID', opsi);
}
setInterval(updateJam, 1000); // Update setiap detik
updateJam(); // Jalankan langsung saat load

// --- AUDIO SETUP (Tetap sama, hanya dirapikan) ---
const suaraEl = document.getElementById('suara-hujan');

async function setupAudio() {
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  if (!AudioContext) return;

  const audioCtx = new AudioContext();
  let source;
  try { source = audioCtx.createMediaElementSource(suaraEl); } 
  catch (e) { console.warn(e); }

  const gain = audioCtx.createGain();
  gain.gain.value = 0;
  if (source) source.connect(gain);
  gain.connect(audioCtx.destination);

  try {
    await suaraEl.play();
  } catch (e) { /* Autoplay block handled below */ }

  const fadeIn = () => {
    gain.gain.cancelScheduledValues(audioCtx.currentTime);
    gain.gain.setValueAtTime(0, audioCtx.currentTime);
    gain.gain.linearRampToValueAtTime(0.25, audioCtx.currentTime + 2);
    try { suaraEl.muted = false; } catch(e) {}
  };

  try {
    await audioCtx.resume();
    fadeIn();
  } catch (err) {
    document.body.addEventListener('click', async function resumeOnce() {
      await audioCtx.resume();
      fadeIn();
      this.removeEventListener('click', resumeOnce);
    }, { once: true });
  }
}

window.addEventListener('load', setupAudio);