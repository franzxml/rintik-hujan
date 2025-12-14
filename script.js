// --- KONFIGURASI KANVAS ---
const kanvas = document.getElementById('kanvas-hujan');
const konteks = kanvas.getContext('2d');

let lebar = window.innerWidth;
let tinggi = window.innerHeight;
kanvas.width = lebar;
kanvas.height = tinggi;

// --- VARIABEL ANIMASI ---
const tetesan = [];
const cipratan = [];
const listPetir = []; // Array untuk menyimpan petir aktif
const jumlahTetes = 300;

let angin = 0;
let petirOpacity = 0; // Flash layar putih

// Inisialisasi Tetesan Hujan
for (let i = 0; i < jumlahTetes; i++) {
  tetesan.push(buatTetesan(true));
}

function buatTetesan(acakY = false) {
  return {
    x: Math.random() * lebar,
    y: acakY ? Math.random() * tinggi : -20,
    panjang: Math.random() * 20 + 10,
    kecepatan: Math.random() * 8 + 5,
    ketebalan: Math.random() * 1 + 0.5
  };
}

// --- INTERAKSI USER (BARU) ---
window.addEventListener('mousedown', (e) => {
  // 1. Buat sambaran petir ke posisi mouse
  buatPetir(e.clientX, e.clientY);
  
  // 2. Trigger efek kilat layar penuh (lebih terang dari petir acak)
  petirOpacity = 0.8;
  
  // 3. (Opsional) Kamu bisa play suara guntur di sini jika punya filenya
});

function buatPetir(targetX, targetY) {
  const startX = Math.random() * lebar; // Muncul dari posisi X acak di atas
  const startY = -50; // Di atas layar
  
  // Kita buat titik-titik zigzag dari atas ke bawah
  const segments = [];
  const jumlahSegmen = 15; // Berapa banyak lekukan
  let currentX = startX;
  let currentY = startY;
  
  // Hitung jarak langkah per segmen
  const dx = (targetX - startX) / jumlahSegmen;
  const dy = (targetY - startY) / jumlahSegmen;

  segments.push({x: startX, y: startY});

  for (let i = 1; i < jumlahSegmen; i++) {
    // Tambahkan variasi acak (jitter) ke kiri/kanan agar terlihat seperti listrik
    const jitter = (Math.random() - 0.5) * 80; 
    currentX += dx + jitter;
    currentY += dy;
    segments.push({x: currentX, y: currentY});
  }
  
  // Titik terakhir adalah posisi mouse
  segments.push({x: targetX, y: targetY});

  // Simpan ke array
  listPetir.push({
    path: segments,
    umur: 10, // Petir akan hilang dalam 10 frame (cepat)
    opacity: 1
  });
}

// --- FUNGSI GAMBAR UTAMA ---
function gambar() {
  konteks.clearRect(0, 0, lebar, tinggi);

  // 1. Gambar Flash Layar (Background)
  if (petirOpacity > 0) {
    // Kilat membuat latar belakang jadi putih/terang sesaat
    konteks.fillStyle = `rgba(255, 255, 255, ${petirOpacity})`;
    konteks.fillRect(0, 0, lebar, tinggi);
    
    // Fade out flash
    petirOpacity -= 0.05;
    if (petirOpacity < 0) petirOpacity = 0;
  } else {
    // Gelapkan sedikit (malam) jika tidak ada petir
    konteks.fillStyle = 'rgba(0, 5, 15, 0.3)';
    konteks.fillRect(0, 0, lebar, tinggi);
  }

  // 2. Gambar Hujan
  konteks.strokeStyle = 'rgba(170, 220, 255, 0.6)';
  konteks.lineCap = 'round';

  for (let i = 0; i < jumlahTetes; i++) {
    let t = tetesan[i];
    konteks.lineWidth = t.ketebalan;
    konteks.beginPath();
    konteks.moveTo(t.x, t.y);
    konteks.lineTo(t.x + angin, t.y + t.panjang);
    konteks.stroke();
  }

  // 3. Gambar Sambaran Petir (BARU)
  for (let i = 0; i < listPetir.length; i++) {
    let p = listPetir[i];
    
    // Efek Glow untuk petir
    konteks.shadowBlur = 15;
    konteks.shadowColor = "rgba(255, 255, 200, 0.8)";
    konteks.strokeStyle = `rgba(255, 255, 255, ${p.opacity})`;
    konteks.lineWidth = 3;
    
    konteks.beginPath();
    konteks.moveTo(p.path[0].x, p.path[0].y);
    for (let j = 1; j < p.path.length; j++) {
      konteks.lineTo(p.path[j].x, p.path[j].y);
    }
    konteks.stroke();

    // Reset shadow agar elemen lain tidak ikut bersinar
    konteks.shadowBlur = 0;
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

// --- FUNGSI FISIKA ---
function updateFisika() {
  const waktu = Date.now() * 0.001;
  angin = Math.sin(waktu) * 3;

  // Petir Acak (Background) - Frekuensi dikurangi biar petir klik lebih spesial
  if (Math.random() < 0.0005) { 
    petirOpacity = Math.random() * 0.4 + 0.1;
  }

  // Update Hujan
  for (let i = 0; i < jumlahTetes; i++) {
    let t = tetesan[i];
    t.y += t.kecepatan;
    t.x += angin * 0.5;

    if (t.y > tinggi) {
      buatCipratan(t.x, tinggi);
      t.y = -20;
      t.x = Math.random() * lebar;
    }
    if (t.x > lebar + 20) t.x = -20;
    if (t.x < -20) t.x = lebar + 20;
  }

  // Update Cipratan
  for (let i = cipratan.length - 1; i >= 0; i--) {
    let c = cipratan[i];
    c.y -= c.kecepatanY;
    c.radius += 0.05;
    c.opacity -= 0.05;
    if (c.opacity <= 0) cipratan.splice(i, 1);
  }

  // Update List Petir (Hapus yang sudah mati)
  for (let i = listPetir.length - 1; i >= 0; i--) {
    let p = listPetir[i];
    p.umur--;
    p.opacity = p.umur / 10; // Memudar seiring umur habis
    
    if (p.umur <= 0) {
      listPetir.splice(i, 1);
    }
  }
}

function buatCipratan(x, y) {
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

// --- JAM DIGITAL ---
function updateJam() {
  const sekarang = new Date();
  const jamEl = document.getElementById('jam');
  const tglEl = document.getElementById('tanggal');
  if(jamEl) {
    const jam = String(sekarang.getHours()).padStart(2, '0');
    const menit = String(sekarang.getMinutes()).padStart(2, '0');
    jamEl.innerText = `${jam}:${menit}`;
  }
  if(tglEl) {
    const opsi = { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' };
    tglEl.innerText = sekarang.toLocaleDateString('id-ID', opsi);
  }
}
setInterval(updateJam, 1000);
updateJam();

// --- AUDIO (Tetap sama) ---
const suaraEl = document.getElementById('suara-hujan');
async function setupAudio() {
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  if (!AudioContext) return;
  const audioCtx = new AudioContext();
  let source;
  try { source = audioCtx.createMediaElementSource(suaraEl); } catch (e) {}
  const gain = audioCtx.createGain();
  gain.gain.value = 0;
  if (source) source.connect(gain);
  gain.connect(audioCtx.destination);
  try { await suaraEl.play(); } catch (e) {}
  
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