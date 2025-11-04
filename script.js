// Ambil elemen kanvas
const kanvas = document.getElementById('kanvas-hujan');
const konteks = kanvas.getContext('2d');

// Atur ukuran awal kanvas
let lebar = window.innerWidth;
let tinggi = window.innerHeight;
kanvas.width = lebar;
kanvas.height = tinggi;

// Data tetesan hujan
const tetesan = [];
const jumlahTetes = 250;

// Buat tetesan acak
for (let i = 0; i < jumlahTetes; i++) {
  tetesan.push({
    x: Math.random() * lebar,
    y: Math.random() * tinggi,
    panjang: Math.random() * 20 + 10,
    kecepatan: Math.random() * 5 + 4,
    ketebalan: Math.random() * 0.8 + 0.2
  });
}

// Gambar hujan
function gambar() {
  konteks.clearRect(0, 0, lebar, tinggi);

  // Tambahkan kabut tipis agar hujan menyatu dengan latar
  konteks.fillStyle = 'rgba(0, 20, 40, 0.25)';
  konteks.fillRect(0, 0, lebar, tinggi);

  // Gambar tetesan hujan
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

// Gerakkan tetesan hujan
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

// Jalankan animasi
function loop() {
  gambar();
  requestAnimationFrame(loop);
}
loop();

// Resize dinamis
window.addEventListener('resize', () => {
  lebar = window.innerWidth;
  tinggi = window.innerHeight;
  kanvas.width = lebar;
  kanvas.height = tinggi;
});

// Putar suara otomatis tanpa interaksi
const suara = document.getElementById('suara-hujan');
window.addEventListener('load', () => {
  suara.play();
  setTimeout(() => {
    suara.muted = false;
    suara.volume = 0.25; // volume lembut
  }, 2000);
});