import React from 'react';

interface AboutPageProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex flex-col bg-gray-950 text-gray-300 animate-in slide-in-from-bottom-10 fade-in duration-300">
      {/* Header */}
      <header className="bg-gray-900 border-b border-gray-800 p-4 shadow-lg sticky top-0 z-10">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600/20 p-2 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-blue-400">
                <path strokeLinecap="round" strokeLinejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Tentang Aplikasi</h2>
              <p className="text-xs text-gray-400">Informasi Detail Infographic Prompt Builder</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-200 rounded-lg transition-colors border border-gray-700"
          >
            <span className="hidden sm:inline text-sm font-medium">Tutup</span>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 scrollbar-thin scrollbar-thumb-gray-800 scrollbar-track-transparent">
        <div className="max-w-4xl mx-auto prose prose-invert prose-sm sm:prose-base prose-headings:text-blue-400 prose-headings:font-bold prose-h2:text-2xl prose-h3:text-xl prose-strong:text-gray-100 prose-ul:list-disc prose-li:my-1">
          <h2>INFOGRAPHIC PROMPT BUILDER</h2>
          
          <h3>1. Deskripsi</h3>
          <p>Infographic Prompt Builder adalah aplikasi web berbasis React yang didukung oleh teknologi Google Gemini AI. Aplikasi ini dirancang untuk membantu konten kreator, dosen, mahasiswa, serta pelaku UMKM dalam menyusun prompt (perintah teks) yang detail, terstruktur, dan optimal guna menghasilkan gambar infografis berkualitas tinggi.</p>
          <p>Aplikasi ini menyederhanakan proses prompt engineering yang umumnya kompleks menjadi alur kerja yang intuitif dan terpandu. Melalui antarmuka berbasis formulir yang komprehensif serta fitur analisis konten otomatis, pengguna dapat merancang prompt secara sistematis dan efisien. Prompt yang dihasilkan telah dioptimalkan untuk digunakan pada berbagai mesin AI Image Generator, seperti:</p>
          <ul>
            <li>Nano Banana Pro</li>
            <li>Midjourney</li>
            <li>DALL·E 3</li>
            <li>Stable Diffusion</li>
          </ul>
          <p>Dengan pendekatan ini, pengguna dari berbagai latar belakang—mulai dari pemula hingga profesional—dapat menciptakan prompt yang presisi untuk mewujudkan visi kreatif mereka, sehingga mampu menghasilkan gambar infografis yang profesional, akurat, dan estetis.</p>

          <h3>2. Fitur Utama</h3>
          <p>Aplikasi ini dilengkapi dengan serangkaian fitur canggih yang dirancang untuk efisiensi dan kontrol kreatif maksimal:</p>
          
          <h4>Generator Konten Otomatis (Auto-Generate):</h4>
          <ul>
            <li><strong>Analisis Teks:</strong> Pengguna cukup memasukkan sebuah topik sederhana (misal: "Sejarah Kemerdekaan Indonesia"), dan AI akan secara otomatis menghasilkan seluruh struktur konten infografis, termasuk judul, subjudul, dan beberapa seksi informasi yang relevan.</li>
            <li><strong>Analisis Dokumen (PDF):</strong> Pengguna dapat mengunggah file PDF. Sistem AI akan memindai, menganalisis, dan mengekstrak poin-poin kunci dari dokumen tersebut untuk membangun kerangka infografis yang koheren.</li>
            <li><strong>Analisis Gambar:</strong> Dengan mengunggah gambar referensi, AI dapat menganalisis gaya visual, layout, dan tema gambar tersebut untuk kemudian mereplikasinya dalam bentuk struktur konten baru.</li>
          </ul>

          <h4>Kontrol Kualitas dan Akurasi:</h4>
          <ul>
            <li><strong>Mode "Excellent":</strong> Sebuah saklar untuk menambahkan serangkaian perintah peningkat kualitas (quality boosters) dan negative prompts untuk hasil gambar yang lebih sinematik, detail, dan bebas dari artefak umum.</li>
            <li><strong>Mode "Akurasi Tinggi":</strong> Fitur krusial yang menambahkan instruksi spesifik pada prompt untuk memastikan AI memberikan prioritas tertinggi pada akurasi visual tokoh publik, logo brand, atau produk terkenal.</li>
          </ul>

          <h4>Pembangun Prompt Terpandu (Guided Builder):</h4>
          <ul>
            <li><strong>Formulir Komprehensif:</strong> Antarmuka utama yang memungkinkan pengguna mengisi setiap detail infografis, mulai dari Judul, Subjek Utama, hingga Atribut Visual yang spesifik.</li>
            <li><strong>Seksi Dinamis:</strong> Pengguna dapat dengan mudah menambah, menghapus, dan menyusun beberapa bagian (seksi) informasi, masing-masing dengan judul, teks poin, dan petunjuk visualnya sendiri.</li>
            <li><strong>Panel Tambahan:</strong> Opsi untuk mengintegrasikan elemen infografis umum seperti Timeline, Peta Lokasi, Kotak Fakta (Factbox), Statistik, dan Kutipan.</li>
            <li><strong>Galeri Gaya Visual Interaktif:</strong> Menyediakan koleksi lebih dari 10 gaya visual yang telah dioptimalkan, seperti Vintage Illustrative, 3D Realistic, Modern Flat Design, Cyberpunk, dan lainnya. Setiap pilihan gaya secara otomatis menyisipkan fragmen prompt teknis untuk mencapai estetika yang diinginkan.</li>
          </ul>

          <h4>Hasil Real-time dan Aset Pendukung:</h4>
          <ul>
            <li><strong>Live Preview Prompt:</strong> Panel "Prompt Result" akan secara otomatis memperbarui prompt akhir secara real-time seiring pengguna mengisi formulir.</li>
            <li><strong>Generator Caption Otomatis:</strong> Sistem secara cerdas membuat draf caption media sosial yang menarik, lengkap dengan hook, poin utama, call-to-action, dan tagar relevan yang disesuaikan dengan tujuan dan konten infografis.</li>
          </ul>

          <h4>Manajemen Proyek dan Ekspor:</h4>
          <ul>
            <li><strong>Simpan & Riwayat:</strong> Pengguna dapat menyimpan konfigurasi proyek mereka ke riwayat untuk diakses atau dimodifikasi kembali di kemudian hari.</li>
            <li><strong>Bagikan sebagai Template:</strong> Membuat sebuah tautan unik yang dapat dibagikan, memungkinkan orang lain untuk memuat konfigurasi prompt yang sama persis.</li>
            <li><strong>Ekspor ke PDF:</strong> Menghasilkan dokumen PDF profesional yang merangkum seluruh rencana proyek, termasuk struktur konten, prompt akhir, dan caption media sosial. Sangat berguna untuk kolaborasi tim atau presentasi klien.</li>
          </ul>

          <h3>3. Fungsi & Manfaat</h3>
          <ul>
            <li><strong>Menyederhanakan Prompt Engineering:</strong> Mengeliminasi kebutuhan untuk menghafal sintaksis prompt yang kompleks. Pengguna fokus pada "apa" yang ingin dibuat, bukan "bagaimana" cara menulisnya.</li>
            <li><strong>Meningkatkan Kualitas Output AI:</strong> Dengan prompt yang terstruktur dan kaya akan detail, hasil gambar dari generator AI menjadi lebih relevan, koheren, dan berkualitas tinggi.</li>
            <li><strong>Mempercepat Alur Kerja Kreatif:</strong> Fitur Auto-Generate dapat mengubah ide mentah menjadi rencana konten yang matang dalam hitungan detik, menghemat waktu riset dan penyusunan.</li>
            <li><strong>Menjamin Konsistensi Visual:</strong> Dengan menyimpan dan memuat proyek, pengguna dapat memastikan bahwa serangkaian infografis memiliki gaya dan struktur yang konsisten.</li>
            <li><strong>Menjadi Alat Pra-Produksi:</strong> Berfungsi sebagai jembatan antara tahap perencanaan konten dan tahap generasi visual, memastikan semua elemen telah dipertimbangkan sebelum prompt dieksekusi.</li>
          </ul>

          <h3>4. Target Pasar</h3>
          <p>Aplikasi ini dirancang untuk audiens yang luas, termasuk:</p>
          <ul>
            <li>Content Creators & Social Media Managers</li>
            <li>Digital Marketers</li>
            <li>Dosen, Guru, dan Mahasiswa</li>
            <li>Profesional Bisnis & Analis Data</li>
            <li>Desainer Grafis</li>
            <li>Penggiat AI</li>
          </ul>

          <h3>5. Cara Penggunaan</h3>
          <h4>A. Alur Kerja Cepat (Menggunakan Auto-Generate):</h4>
          <ul>
            <li>Pilih Sumber Konten: Di panel "Auto Generate", pilih salah satu dari tiga mode: Input Teks, Upload PDF, atau Upload Image.</li>
            <li>Berikan Input.</li>
            <li>Atur Opsi Kualitas (Opsional).</li>
            <li>Klik tombol "Analisa & Generate".</li>
            <li>Gunakan Hasil: Periksa prompt dan Caption di panel "Prompt Result". Salin dan gunakan pada platform text-to-image AI favorit Anda.</li>
          </ul>

          <h4>B. Alur Kerja Manual (Kontrol Penuh):</h4>
          <ul>
            <li>Buka Konfigurasi: Klik panel "Konfigurasi Infografis" untuk membukanya.</li>
            <li>Tentukan Fondasi: Pilih Tujuan dan Rasio gambar yang diinginkan.</li>
            <li>Pilih Gaya Visual.</li>
            <li>Isi Detail Konten.</li>
            <li>Bangun Seksi Informasi.</li>
            <li>Pilih Panel Tambahan.</li>
            <li>Amati Hasil Real-time.</li>
            <li>Gunakan Hasil: Periksa prompt dan Caption di panel "Prompt Result". Salin dan gunakan pada platform text-to-image AI favorit Anda.</li>
            <li>Finalisasi: Setelah puas, Anda bisa menyalin prompt dan caption, menyimpan proyek ke riwayat, atau mengekspornya sebagai PDF.</li>
          </ul>

        </div>
      </main>
    </div>
  );
};
