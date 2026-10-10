const APP_CONFIG = {
    appName: "Dilemators",
    ownerName: "Tania Dewi Lestari, S. Pd",
    storagePrefix: "dile",
    materiPrefix: "M",
    assetPath: "./assets/",
    videoPath: "./video/",
    colors: {
        primary: "#01579B",
        primaryLight: "#0288D1",
        bgLight: "#E1F5FE",
        btnGradient: "linear-gradient(180deg, #4FC3F7, #0288D1)",
        btnShadow: "#0277BD"
    },
    wordartGradient: "linear-gradient(90deg, #4FC3F7, #01579B)",
    tagline: "Manipulative Motor Skills"
};

const dataMateri = [
  {
    "id_materi": "M1",
    "nama_materi": "Memantul",
    "persiapan": [
      ["Alat", "Bola karet/bola basket kecil berdiameter ±20–25 cm, dipompa cukup keras."],
      ["Alat", "Permukaan lantai atau lapangan yang rata dan keras."],
      ["Area dan pelaksanaan", "Siswa berdiri di satu titik yang ditandai (lingkaran kapur/lakban berdiameter ±1 m)."],
      ["Aba-aba", "\"Pantulkan bola dengan satu tangan sebanyak empat kali tanpa berpindah tempat, lalu tangkap bolanya.\""],
      ["Percobaan", "Penilai memberi satu contoh gerak, siswa melakukan 1 kali percobaan latihan (tidak dinilai), lalu 2 kali percobaan yang dinilai (P1 dan P2)."]
    ],
    "kriteria_materi": [
      ["K1", "Menyentuh bola dengan satu tangan kira-kira setinggi pinggang."],
      ["K2", "Mendorong bola dengan ujung-ujung jari, bukan menepuk dengan telapak tangan."],
      ["K3", "Menguasai bola minimal 4 pantulan berturut-turut tanpa memindahkan kaki untuk mengejar bola."]
    ],
    "tambahan": [
      ["Penilaian", "Nilai = Skor ÷ 6 × 100 (dibulatkan). Ket.: T = Tuntas (≥ 75) · C = Cukup, ulang tes (70–74) · R = Remedial (< 70)"]
    ],
    "permainan": [
      {
        "nama_permainan": "Bola Pantul Bumi",
        "instruksi": [],
        "tujuan": "",
        "langkah": [
          "Guru membentuk beberapa barisan dengan jumlah anggota yang sama dengan jarak sekitar 1 meter.",
          "Guru memberikan instruksi secara lisan tanpa demonstrasi.",
          "Siswa paling depan memantulkan bola 5 kali, lalu lari di tempat 5 detik.",
          "Bola dioper ke belakang melalui atas kepala hingga ke anak terakhir.",
          "Anak terakhir berteriak \"YES!\" lalu semua anggota berlari di tempat."
        ],
        "kriteria_lolos" : [
          "Memantulkan bola ke lantai 5 kali berturut-turut di tempat, bola tetap dekat badan dan tidak lepas.",
          "Berlari di tempat selama 5 detik setelah memantul, lalu tertib mengikuti urutan tugas.",
          "Mengoper bola ke teman di belakang melalui atas kepala tanpa bola jatuh.",
          "Ketiga kriteria terlihat pada minimal 3 dari 5 percobaan.",
        ],
        "video": ["memantul_satu_480p_3.mp4"],
        "level": "Mudah"
      },
      {
        "nama_permainan": "Bola Pantul Zig-Zag",
        "instruksi": [],
        "tujuan": "",
        "langkah": [
          "Guru membentuk barisan dengan jarak antar anak sekitar 2 meter dalam posisi jongkok.",
          "Guru memberi instruksi tanpa demonstrasi.",
          "Siswa memantulkan bola sambil berlari zig-zag melewati teman.",
          "Setelah selesai, siswa bertukar posisi dengan yang jongkok.",
          "Dilanjutkan secara bergantian."
        ],
        "kriteria_lolos": [
          "Memantulkan bola ke lantai dengan telapak tangan sambil berlari zig-zag melewati semua teman yang berjongkok.",
          "Bola tetap terkendali (tidak lepas jauh dan tidak menabrak teman) sampai kembali ke garis awal.",
          "Bertukar posisi dengan teman yang berjongkok dan melanjutkan giliran dengan tertib.",
          "Ketiga kriteria terlihat pada minimal 3 dari 5 percobaan."
        ],
        "video": ["memantul_dua.mp4"],
        "level": "Sedang"
      },
      {
        "nama_permainan": "Turnamen Bola Pantul",
        "instruksi": [],
        "tujuan": "",
        "langkah": [
          "Guru membagi siswa dalam kelompok kecil.",
          "Siswa berlatih memantul di tempat, berjalan, dan berpasangan.",
          "Siswa menyusun strategi menyerang dan bertahan.",
          "Permainan dimulai dari bola pantul guru di tengah lapangan.",
          "Siswa memantulkan bola sambil berlari dan mengoper.",
          "Setiap gol dari bola pantul bernilai 1 poin."
        ],
        "kriteria_lolos": [
          "Memantulkan bola sambil berlari atau berjalan, lalu mengoper ke teman dalam permainan.",
          "Memasukkan bola ke gawang lawan dengan cara dipantulkan (dari luar garis penalti) atau bertahan sebagai penjaga gawang.",
          "Bergantian peran penjaga gawang dan penyerang, serta bekerja sama menyusun strategi dengan kelompok.",
          "Ketiga kriteria terlihat selama pertandingan, minimal pada 3 kali kesempatan bermain."
        ],
        "video": ["memantul_tiga.mp4"],
        "level": "Sulit"
      }
    ]
  },
  {
    "id_materi": "M2",
    "nama_materi": "Menangkap",
    "persiapan": [
      ["Alat", "Bola plastik/karet lunak berdiameter ±10 cm."],
      ["Alat", "Dua garis berjarak ±4,5 m (garis siswa dan garis pelempar)."],
      ["Area dan pelaksanaan", "Siswa berdiri di belakang garisnya. Penilai atau pelempar melambungkan bola dari bawah (ayunan bawah) ke arah dada siswa."],
      ["Aba-aba", "\"Tangkap bola dengan kedua tanganmu.\" Lemparan yang meleset jauh dari dada diulang dan tidak dihitung."],
      ["Percobaan", "Penilai memberi satu contoh gerak, siswa melakukan 1 kali percobaan latihan (tidak dinilai), lalu 2 kali percobaan yang dinilai (P1 dan P2)."]
    ],
    "kriteria_materi": [
      ["K1", "Kedua tangan diposisikan di depan badan dengan siku ditekuk."],
      ["K2", "Lengan menjulur untuk menyambut bola saat bola datang."],
      ["K3", "Bola ditangkap dengan tangan saja, tidak dipeluk ke badan."]
    ],
    "tambahan": [
      ["Penilaian", "Nilai = Skor ÷ 6 × 100 (dibulatkan). Ket.: T = Tuntas (≥ 75) · C = Cukup, ulang tes (70–74) · R = Remedial (< 70)"]
    ],
    "permainan": [
      {
        "nama_permainan": "Menangkap Bola Datar",
        "instruksi": [],
        "tujuan": "",
        "langkah": [
          "Guru membentuk barisan berhadapan dengan jarak 3–5 meter.",
          "Guru menjelaskan teknik secara lisan tanpa demonstrasi.",
          "Siswa berlatih menangkap bola datar dari teman.",
          "Tangan membentuk kantong dan ditarik saat menangkap.",
          "Siswa yang berhasil membantu temannya.",
          "Siswa bergantian posisi sebagai pelempar dan penangkap."
        ],
        "kriteria_lolos": [
          "Membentuk tangan seperti \"kantong\" di depan dada saat bola datang.",
          "Menarik lengan sedikit ke arah badan ketika bola menyentuh telapak tangan untuk meredam laju bola.",
          "Menangkap bola datar dari teman pada jarak 3–5 meter tanpa bola terpental atau jatuh.",
          "Ketiga kriteria terlihat pada minimal 3 dari 5 percobaan."
        ],
        "video": ["menangkap_satu_720p.mp4"],
        "level": "Mudah"
      },
      {
        "nama_permainan": "Menangkap Bola Dinamis",
        "instruksi": [],
        "tujuan": "",
        "langkah": [
          "Setiap siswa memegang bola dan menyebar.",
          "Guru menjelaskan teknik tanpa demonstrasi.",
          "Siswa melempar bola ke atas dan menangkap sambil berjalan.",
          "Tingkat kesulitan ditingkatkan bertahap.",
          "Siswa yang mahir memberi contoh.",
          "Latihan diulang dan diakhiri evaluasi."
        ],
        "kriteria_lolos": [
          "Melempar bola tenis perlahan ke atas (setinggi dada atau sedikit di atas kepala) dengan satu tangan sambil berjalan maju.",
          "Menangkap kembali bola dengan dua tangan dan mata mengikuti bola.",
          "Langkah kaki tetap lancar saat melempar dan menangkap, bola tidak jatuh.",
          "Ketiga kriteria terlihat pada minimal 3 dari 5 percobaan."
        ],
        "video": ["melempar_dua_720p.mp4"],
        "level": "Sedang"
      },
      {
        "nama_permainan": "Turnamen Lempar Tangkap",
        "instruksi": [],
        "tujuan": "",
        "langkah": [
          "Guru membagi kelompok kecil.",
          "Siswa berlatih lempar tangkap dan kerja sama tim.",
          "Siswa melempar bola lambung dalam kelompok.",
          "Jika gagal menangkap, melakukan loncat.",
          "Selanjutnya dilakukan turnamen lempar-tangkap.",
          "Turnamen dilakukan dengan net tali.",
          "Guru akan memimpin turnamen.",
          "Poin diberikan jika bola jatuh di area lawan.",
          "Pemenang ditentukan dari skor terbanyak."
        ],
        "kriteria_lolos": [
          "Menangkap bola lambung dengan sigap, dari teman satu kelompok maupun dari lawan.",
          "Melambungkan atau melempar bola melewati net tali ke area lawan.",
          "Mengikuti aturan: memegang bola maksimal 5 detik dan bermain sportif bersama kelompok.",
          "Ketiga kriteria terlihat selama pertandingan, minimal pada 3 kali kesempatan bermain."
        ],
        "video": ["menangkap_tiga.mp4"],
        "level": "Sulit"
      }
    ]
  },
  {
    "id_materi": "M3",
    "nama_materi": "Menggiring",
    
    "persiapan": [
      ["Alat", "Bola sepak ukuran kecil (nomor 3–4)."],
      ["Alat", "5 kerucut, dipasang zig-zag berjarak ±1,5 m."],
      ["Alat", "Garis start dan garis akhir berjarak ±10 m."],
      ["Area dan pelaksanaan", "Siswa memulai dari garis start, menggiring bola melewati kerucut secara zig-zag, lalu menghentikan bola di garis akhir dengan telapak kaki."],
      ["Aba-aba", "Giring bola melewati semua kerucut, lalu hentikan bola di garis akhir dengan telapak kakimu."],
      ["Percobaan", "Penilai memberi satu contoh gerak, siswa melakukan 1 kali percobaan latihan (tidak dinilai), lalu 2 kali percobaan yang dinilai (P1 dan P2)."]
    ],
    "kriteria_materi": [
      ["K1", "Menyentuh bola dengan kaki bagian dalam atau luar, bukan dengan ujung jari kaki."],
      ["K2", "Bola tetap dekat dengan kaki (kurang dari satu langkah) selama menggiring."],
      ["K3", "Pandangan sesekali diangkat ke depan, tidak terus menunduk ke bola."],
      ["K4", "Mampu berbelok melewati kerucut tanpa kehilangan bola, lalu menghentikan bola dengan telapak kaki."]
    ],
    "tambahan": [
      ["Penilaian", "Nilai = Skor ÷ 8 × 100 (dibulatkan). Ket.: T = Tuntas (≥ 75) · C = Cukup, ulang tes (70–74) · R = Remedial (< 70)"]
    ],

    "permainan": [
      {
        "nama_permainan": "Menggiring Kaki Luar",
        "instruksi": [],
        "tujuan": "",
        "langkah": [
          "Guru membagi kelompok dan membuat dua barisan berhadapan.",
          "Guru menjelaskan tujuan dan memberi kesempatan demonstrasi siswa.",
          "Siswa menggiring bola dengan kaki luar ke barisan depan.",
          "Memberi bola ke teman dan berpindah barisan.",
          "Dilakukan bergantian.",
          "Guru memimpin refleksi."
        ],
        "kriteria_lolos": [
          "Menggiring bola dengan kaki bagian luar sambil berjalan atau berlari kecil.",
          "Bola tetap dekat kaki di setiap langkah (tidak menjauh dari tubuh).",
          "Sampai di depan teman seberang dan memberikan bola dengan kontrol pelan, lalu berpindah ke barisan belakang.",
          "Ketiga kriteria terlihat pada minimal 3 dari 5 percobaan."
        ],
        "video": ["menggiring_satu_480p.mp4"],
        "level": "Mudah"
      },
      {
        "nama_permainan": "Menggiring Zig-Zag",
        "instruksi": [],
        "tujuan": "",
        "langkah": [
          "Guru menyiapkan rintangan zig-zag.",
          "Guru menjelaskan tujuan latihan.",
          "Siswa menggiring bola melewati rintangan.",
          "Menggunakan kombinasi kaki luar dan dalam.",
          "Memberi bola ke teman dan kembali ke barisan.",
          "Guru memimpin refleksi."
        ],
        "kriteria_lolos": [
          "Menggiring bola melewati semua rintangan berliku (jarak 1–2 meter) tanpa menjatuhkan atau menyentuh rintangan.",
          "Memakai kaki bagian luar dan dalam sehingga bola tetap terkontrol saat berbelok.",
          "Di ujung lintasan, memberikan operan terkontrol ke teman berikutnya, lalu berpindah ke barisan belakang.",
          "Ketiga kriteria terlihat pada minimal 3 dari 5 percobaan."
        ],
        "video": ["menggiring_dua.mp4"],
        "level": "Sedang"
      },
      {
        "nama_permainan": "Menggiring Melewati Lawan",
        "instruksi": [],
        "tujuan": "",
        "langkah": [
          "Guru membagi siswa dalam kelompok dengan peran penggiring dan lawan.",
          "Guru menjelaskan tujuan latihan.",
          "Siswa menggiring bola menuju lawan.",
          "Melakukan gerak tipu untuk melewati lawan.",
          "Memberi bola ke teman dan bertukar peran.",
          "Guru memimpin refleksi."
        ],
        "kriteria_lolos": [
          "Mendekati lawan, lalu melakukan gerak tipu atau mengubah arah giringan dengan cepat.",
          "Melewati lawan tanpa kehilangan kontrol bola (bola tidak terebut atau terlepas jauh).",
          "Memberikan bola ke teman seberang dengan kontrol pelan dan bergantian peran sebagai penggiring dan lawan.",
          "Ketiga kriteria terlihat selama pertandingan, minimal pada 3 kali kesempatan bermain."
        ],
        "video": ["menggiring_tiga.mp4"],
        "level": "Sulit"
      }
    ]
  },
  {
    "id_materi": "M4",
    "nama_materi": "Menendang",
    "persiapan": [
      ["Alat", "Bola sepak ukuran kecil (nomor 3–4) atau bola plastik berdiameter ±20–25 cm."],
      ["Alat", "Penanda posisi bola, garis awalan ±3 m di belakang bola, dan dinding/sasaran ±6 m di depan bola."],
      ["Area dan pelaksanaan", "Bola diletakkan diam di tanah. Siswa berdiri di garis awalan, lalu berlari dan menendang bola sekeras mungkin ke arah dinding/sasaran."],
      ["Aba-aba", "\"Larilah ke arah bola dan tendang bola sekeras mungkin ke arah dinding.\""],
      ["Percobaan", "Penilai memberi satu contoh gerak, siswa melakukan 1 kali percobaan latihan (tidak dinilai), lalu 2 kali percobaan yang dinilai (P1 dan P2)."]
    ],
    "kriteria_materi": [
      ["K1", "Melakukan awalan lari yang cepat dan tidak terputus menuju bola."],
      ["K2", "Melakukan langkah panjang atau loncatan kecil tepat sebelum menyentuh bola."],
      ["K3", "Kaki tumpu diletakkan dekat dengan bola."],
      ["K4", "Menendang bola dengan punggung kaki atau kaki bagian dalam, bukan dengan ujung jari kaki."]
    ],
    "tambahan": [
      ["Penilaian", "Nilai = Skor ÷ 8 × 100 (dibulatkan). Ket.: T = Tuntas (≥ 75) · C = Cukup, ulang tes (70–74) · R = Remedial (< 70)"]
    ],
    "permainan": [
      {
        "nama_permainan": "Menendang Bola Dalam",
        "instruksi": [],
        "tujuan": "",
        "langkah": [
          "Guru membentuk barisan berhadapan.",
          "Guru menjelaskan teknik tanpa demonstrasi.",
          "Siswa menendang bola ke teman.",
          "Penerima mengontrol dan mengembalikan bola.",
          "Siswa saling membantu."
        ],
        "kriteria_lolos": [
          "Menendang bola dengan kaki bagian dalam dari posisi berdiri tanpa awalan.",
          "Bola mengarah ke teman yang berada tepat di depan (jarak sekitar 4 meter).",
          "Menghentikan atau mengontrol bola yang diterima dengan kaki bagian dalam sebelum menendangnya kembali.",
          "Ketiga kriteria terlihat pada minimal 3 dari 5 percobaan."
        ],
        "video": ["menendang_satu_720p.mp4"],
        "level": "Mudah"
      },
      {
        "nama_permainan": "Menendang Segitiga Bermuda",
        "instruksi": [],
        "tujuan": "",
        "langkah": [
          "Guru membentuk formasi segitiga.",
          "Guru menjelaskan teknik tanpa demonstrasi.",
          "Siswa mengoper bola pola segitiga.",
          "Siswa depan menendang ke target.",
          "Siswa berpindah kelompok.",
          "Yang gagal membantu merapikan target."
        ],
        "kriteria_lolos": [
          "Menendang bola dengan kaki bagian dalam dengan awalan langkah.",
          "Mengoper bola mengikuti pola segitiga antar kelompok sebelum menembak ke target.",
          "Mengarahkan tendangan ke target cone (jarak sekitar 4 meter), tendangan mengenai atau merobohkan target.",
          "Ketiga kriteria terlihat pada minimal 3 dari 5 percobaan."
        ],
        "video": ["menendang_dua_720p.mp4"],
        "level": "Sedang"
      },
      {
        "nama_permainan": "Turnamen Lempar Tendang",
        "instruksi": [],
        "tujuan": "",
        "langkah": [
          "Guru membagi kelompok kecil.",
          "Siswa berlatih lempar dan tendang.",
          "Kompetisi antar kelompok dimulai.",
          "Jika bola jatuh di area, berpindah ke lawan.",
          "Jika keluar area, lawan mencoba mengenai penendang.",
          "Poin diberikan jika penendang selamat.",
          "Pemenang ditentukan dari poin."
        ],
        "kriteria_lolos": [
          "Melempar bola sendiri, lalu menendangnya (lempar-tendang) keluar dari area throw kick.",
          "Sebagai penendang: sampai ke patok sasaran tanpa terkena bola lawan. Sebagai penjaga: menangkap bola lalu menendang ke arah kaki penendang.",
          "Mengikuti aturan permainan dan bergantian tendangan dengan anggota kelompok.",
          "Ketiga kriteria terlihat selama pertandingan, minimal pada 3 kali kesempatan bermain."
        ],
        "video": ["menendang_tiga_2.mp4"],
        "level": "Sulit"
      }
    ]
  },
  {
    "id_materi": "M5",
    "nama_materi": "Memukul",
    
    "persiapan": [
      ["Alat", "Pemukul plastik ringan (atau pemukul kasti)."],
      ["Alat", "Bola plastik/karet berdiameter ±10 cm."],
      ["Alat", "Tiang penyangga bola (tee/kerucut tinggi) setinggi pinggang siswa."],
      ["Area dan pelaksanaan", "Bola diletakkan di atas tiang setinggi pinggang siswa. Siswa berdiri menyamping di samping tiang dan memukul bola sekeras mungkin lurus ke depan."],
      ["Aba-aba", "\"Pukul bola sekeras mungkin lurus ke depan.\""],
      ["Percobaan", "Penilai memberi satu contoh gerak, siswa melakukan 1 kali percobaan latihan (tidak dinilai), lalu 2 kali percobaan yang dinilai (P1 dan P2)."]
    ],
    "kriteria_materi": [
      ["K1", "Tangan yang dominan memegang pemukul di atas tangan yang tidak dominan."],
      ["K2", "Sisi pinggul dan bahu yang tidak dominan menghadap arah pukulan, kedua kaki sejajar."],
      ["K3", "Pinggul dan bahu berputar saat mengayunkan pemukul."],
      ["K4", "Melangkah dengan kaki yang tidak dominan ke arah pukulan."],
      ["K5", "Bola terpukul lurus ke depan."]
    ],
    "tambahan": [
      ["Penilaian", "Nilai = Skor ÷ 10 × 100 (dibulatkan). Ket.: T = Tuntas (≥ 75) · C = Cukup, ulang tes (70–74) · R = Remedial (< 70)"]
    ],
    "permainan": [
      {
        "nama_permainan": "Memukul Bola Statis Bawah",
        "instruksi": [],
        "tujuan": "",
        "langkah": [
          "Membuat barisan berhadapan.",
          "Guru menjelaskan gerakan.",
          "Siswa memukul bola statis di bawah dengan dua tangan.",
          "Dilakukan bergantian.",
          "Siswa kembali ke belakang barisan."
        ],
        "kriteria_lolos": [
          "Memegang pemukul dengan dua tangan dan memukul bola yang diam di lantai.",
          "Pemukul mengenai bola sehingga bola bergerak ke depan.",
          "Setelah memukul, berlari ke belakang barisan dan bergantian dengan teman secara tertib.",
          "Ketiga kriteria terlihat pada minimal 3 dari 5 percobaan."
        ],
        "video": ["memukul_satu_720p.mp4"],
        "level": "Mudah"
      },
      {
        "nama_permainan": "Memukul Bola Pantul",
        "instruksi": [],
        "tujuan": "",
        "langkah": [
          "Membuat barisan berhadapan.",
          "Guru menjelaskan gerakan.",
          "Siswa memantulkan bola lalu memukul saat naik.",
          "Berjalan maju sambil mengulang.",
          "Setelah selesai kembali ke barisan."
        ],
        "kriteria_lolos": [
          "Memegang bola di satu tangan dan pemukul di tangan lain.",
          "Memantulkan bola ke lantai, lalu memukulnya saat bola memantul naik.",
          "Mengulangi gerakan sambil berjalan maju sampai ujung lintasan, lalu kembali dan menyerahkan peralatan ke teman berikutnya.",
          "Ketiga kriteria terlihat pada minimal 3 dari 5 percobaan."
        ],
        "video": ["memukul_dua_480p.mp4"],
        "level": "Sedang"
      },
      {
        "nama_permainan": "Memukul Bola Melambung",
        "instruksi": [],
        "tujuan": "",
        "langkah": [
          "Guru membagi kelompok atau pasangan.",
          "Guru menjelaskan tujuan.",
          "Pelempar melempar bola melambung.",
          "Pemukul memukul bola.",
          "Siswa berganti peran."
        ],
        "kriteria_lolos": [
          "Sebagai pelempar: memberikan bola dengan ayunan bawah sehingga melambung dengan kecepatan sedang ke area pukul teman.",
          "Sebagai pemukul: memukul bola melambung dengan tongkat hingga bola melambung jauh ke depan.",
          "Bergantian peran (pelempar, pemukul, pengambil bola) dengan tertib.",
          "Ketiga kriteria terlihat selama pertandingan, minimal pada 3 kali kesempatan bermain."
        ],
        "video": ["memukul_tiga.mp4"],
        "level": "Sulit"
      }
    ]
  },
  {
    "id_materi": "M6",
    "nama_materi": "Melempar",
    "persiapan": [
      ["Alat", "Bola tenis atau bola karet kecil berdiameter ±6–7 cm."],
      ["Alat", "Garis lempar berjarak ±6 m dari dinding."],
      ["Area dan pelaksanaan", "Siswa berdiri di belakang garis lempar menghadap dinding, lalu melempar bola sekeras mungkin dengan ayunan dari atas."],
      ["Aba-aba", "\"Lempar bola sekeras mungkin ke arah dinding dengan ayunan tangan dari atas.\""],
      ["Percobaan", "Penilai memberi satu contoh gerak, siswa melakukan 1 kali percobaan latihan (tidak dinilai), lalu 2 kali percobaan yang dinilai (P1 dan P2)."]
    ],
    "kriteria_materi": [
      ["K1", "Ayunan dimulai dengan gerakan tangan dan lengan ke arah bawah."],
      ["K2", "Pinggul dan bahu berputar sampai sisi tubuh yang tidak melempar menghadap dinding."],
      ["K3", "Melangkah dengan kaki yang berlawanan dengan tangan pelempar ke arah dinding."],
      ["K4", "Tangan pelempar melanjutkan gerakan setelah bola lepas, menyilang badan ke arah pinggul sisi yang tidak melempar."]
    ],
    "tambahan": [
      ["Penilaian", "Nilai = Skor ÷ 8 × 100 (dibulatkan). Ket.: T = Tuntas (≥ 75) · C = Cukup, ulang tes (70–74) · R = Remedial (< 70)"]
    ],

    "permainan": [
      {
        "nama_permainan": "Melempar Bola Statis",
        "instruksi": [],
        "tujuan": "",
        "langkah": [
          "Setiap siswa memegang 3 bola.",
          "Guru membagi kelompok pelempar dan penangkap.",
          "Guru menjelaskan tanpa demonstrasi.",
          "Siswa melempar dengan variasi teknik.",
          "Dilakukan dalam posisi statis.",
          "Setelah selesai membantu mengambil bola."
        ],
        "kriteria_lolos": [
          "Melempar dalam posisi statis (berdiri tegak di tempat tanpa melangkah), kekuatan dari bahu dan lengan.",
          "Mencoba teknik lemparan yang berbeda pada tiap bola (atas kepala, samping, bawah) dari 3 bola.",
          "Bola mengarah ke area sasaran; setelah itu membantu mengambil bola lewat jalur samping dan kembali ke barisan belakang.",
          "Ketiga kriteria terlihat pada minimal 3 dari 5 percobaan."
        ],
        "video": ["melempar_satu_480p.mp4"],
        "level": "Mudah"
      },
      {
        "nama_permainan": "Melempar Bola Lambung",
        "instruksi": [],
        "tujuan": "",
        "langkah": [
          "Guru membentuk kelompok.",
          "Guru menjelaskan tanpa demonstrasi.",
          "Siswa melempar bola melambung.",
          "Dilakukan dari posisi statis.",
          "Siswa kembali ke barisan."
        ],
        "kriteria_lolos": [
          "Melempar bola dengan lintasan melambung berbentuk parabola ke arah atas.",
          "Melempar dari posisi tanpa langkah atau kuda-kuda yang stabil, kekuatan dari bahu dan lengan.",
          "Setelah melempar, kembali ke barisan lewat jalur samping dan bergantian dengan teman secara tertib.",
          "Ketiga kriteria terlihat pada minimal 3 dari 5 percobaan."
        ],
        "video": ["melempar_dua.mp4"],
        "level": "Sedang"
      },
      {
        "nama_permainan": "Lempar Poin",
        "instruksi": [],
        "tujuan": "",
        "langkah": [
          "Guru membentuk kelompok kecil.",
          "Guru menjelaskan tujuan.",
          "Siswa berlatih lempar datar melewati tali.",
          "Poin diberikan jika berhasil.",
          "Kompetisi antar kelompok dilakukan.",
          "Kelompok dengan poin terbanyak menang."
        ],
        "kriteria_lolos": [
          "Melempar bola secara datar (tidak melambung) ke sasaran.",
          "Bola melewati ruang tengah di antara dua bentangan tali, dan tidak tertangkap lawan sehingga menghasilkan poin.",
          "Mengikuti aturan \"pindah bola\" saat bola tertangkap dan bermain sportif bersama kelompok.",
          "Ketiga kriteria terlihat selama pertandingan, minimal pada 3 kali kesempatan bermain."
        ],
        "video": ["melempar_tiga.mp4"],
        "level": "Sulit"
      }
    ]
  }
];

const dataMateri_EN = [
  {
    "id_materi": "M1",
    "nama_materi": "Bouncing",
    "persiapan": [
      ["Equipment", "Rubber ball/small basketball with a diameter of ±20–25 cm, pumped quite hard."],
      ["Equipment", "Flat and hard floor or court surface."],
      ["Area and execution", "Students stand on a marked spot (chalk/duct tape circle with a diameter of ±1 m)."],
      ["Command", "\"Bounce the ball with one hand four times without moving from your spot, then catch the ball.\""],
      ["Trials", "The assessor gives one movement example, the student performs 1 practice trial (not graded), then 2 graded trials (T1 and T2)."]
    ],
    "kriteria_materi": [
      ["K1", "Touching the ball with one hand at about waist height."],
      ["K2", "Pushing the ball with fingertips, not slapping it with the palm."],
      ["K3", "Controlling the ball for at least 4 consecutive bounces without moving the feet to chase the ball."]
    ],
    "tambahan": [
      ["Assessment", "Score = Points ÷ 6 × 100 (rounded). Note: P = Passed (≥ 75) · S = Sufficient, retake test (70–74) · R = Remedial (< 70)"]
    ],
    "permainan": [
      {
        "nama_permainan": "Earth Bounce Ball",
        "instruksi": [],
        "tujuan": "",
        "langkah": [
          "The teacher forms several lines with the same number of members at a distance of about 1 meter.",
          "The teacher gives verbal instructions without demonstration.",
          "The first student bounces the ball 5 times, then runs in place for 5 seconds.",
          "The ball is passed backward over the head to the last child.",
          "The last child shouts \"YES!\" then all members run in place."
        ],
        "kriteria_lolos" : [
          "Bouncing the ball to the floor 5 times consecutively in place, the ball remains close to the body and does not slip away.",
          "Running in place for 5 seconds after bouncing, then following the task order in an orderly manner.",
          "Passing the ball to the friend behind over the head without dropping it.",
          "All three criteria are seen in at least 3 out of 5 trials."
        ],
        "video": ["memantul_satu_480p_3.mp4"],
        "level": "Easy"
      },
      {
        "nama_permainan": "Zig-Zag Bounce Ball",
        "instruksi": [],
        "tujuan": "",
        "langkah": [
          "The teacher forms a line with a distance between children of about 2 meters in a squatting position.",
          "The teacher gives instructions without demonstration.",
          "Students bounce the ball while running zig-zag past their friends.",
          "After finishing, students swap positions with those squatting.",
          "Continued alternately."
        ],
        "kriteria_lolos": [
          "Bouncing the ball to the floor with the palm while running zig-zag past all squatting friends.",
          "The ball remains under control (does not bounce far away and does not hit friends) until returning to the starting line.",
          "Swapping positions with the squatting friend and continuing the turn in an orderly manner.",
          "All three criteria are seen in at least 3 out of 5 trials."
        ],
        "video": ["memantul_dua.mp4"],
        "level": "Medium"
      },
      {
        "nama_permainan": "Bounce Ball Tournament",
        "instruksi": [],
        "tujuan": "",
        "langkah": [
          "The teacher divides students into small groups.",
          "Students practice bouncing in place, walking, and in pairs.",
          "Students arrange attacking and defending strategies.",
          "The game starts with a ball bounce from the teacher in the middle of the court.",
          "Students bounce the ball while running and passing.",
          "Every goal from a bounced ball is worth 1 point."
        ],
        "kriteria_lolos": [
          "Bouncing the ball while running or walking, then passing it to a friend in the game.",
          "Putting the ball into the opponent's goal by bouncing it (from outside the penalty area) or defending as a goalkeeper.",
          "Alternating roles between goalkeeper and attacker, and cooperating to arrange strategies with the group.",
          "All three criteria are seen during the match, on at least 3 playing opportunities."
        ],
        "video": ["memantul_tiga.mp4"],
        "level": "Hard"
      }
    ]
  },
  {
    "id_materi": "M2",
    "nama_materi": "Catching",
    "persiapan": [
      ["Equipment", "Plastic/soft rubber ball with a diameter of ±10 cm."],
      ["Equipment", "Two lines at a distance of ±4.5 m (student line and thrower line)."],
      ["Area and execution", "The student stands behind their line. The assessor or thrower tosses the ball from below (underhand swing) towards the student's chest."],
      ["Command", "\"Catch the ball with both hands.\" Throws that miss far from the chest are repeated and not counted."],
      ["Trials", "The assessor gives one movement example, the student performs 1 practice trial (not graded), then 2 graded trials (T1 and T2)."]
    ],
    "kriteria_materi": [
      ["K1", "Both hands are positioned in front of the body with elbows bent."],
      ["K2", "Arms extend to greet the ball as it approaches."],
      ["K3", "The ball is caught with hands only, not hugged to the body."]
    ],
    "tambahan": [
      ["Assessment", "Score = Points ÷ 6 × 100 (rounded). Note: P = Passed (≥ 75) · S = Sufficient, retake test (70–74) · R = Remedial (< 70)"]
    ],
    "permainan": [
      {
        "nama_permainan": "Flat Ball Catch",
        "instruksi": [],
        "tujuan": "",
        "langkah": [
          "The teacher forms lines facing each other at a distance of 3–5 meters.",
          "The teacher explains the technique verbally without demonstration.",
          "Students practice catching flat balls from a friend.",
          "Hands form a pocket and are pulled back when catching.",
          "Successful students help their friends.",
          "Students alternate positions as thrower and catcher."
        ],
        "kriteria_lolos": [
          "Forming hands like a \"pocket\" in front of the chest when the ball approaches.",
          "Pulling the arms slightly towards the body when the ball touches the palms to absorb the ball's pace.",
          "Catching a flat ball from a friend at a distance of 3–5 meters without the ball bouncing off or dropping.",
          "All three criteria are seen in at least 3 out of 5 trials."
        ],
        "video": ["menangkap_satu_720p.mp4"],
        "level": "Easy"
      },
      {
        "nama_permainan": "Dynamic Ball Catch",
        "instruksi": [],
        "tujuan": "",
        "langkah": [
          "Each student holds a ball and spreads out.",
          "The teacher explains the technique without demonstration.",
          "Students throw the ball up and catch it while walking.",
          "The difficulty level is gradually increased.",
          "Proficient students give examples.",
          "The exercise is repeated and ends with an evaluation."
        ],
        "kriteria_lolos": [
          "Throwing a tennis ball slowly upwards (chest-high or slightly above the head) with one hand while walking forward.",
          "Catching the ball back with two hands, with eyes following the ball.",
          "Footsteps remain smooth while throwing and catching, the ball does not drop.",
          "All three criteria are seen in at least 3 out of 5 trials."
        ],
        "video": ["melempar_dua_720p.mp4"],
        "level": "Medium"
      },
      {
        "nama_permainan": "Throw and Catch Tournament",
        "instruksi": [],
        "tujuan": "",
        "langkah": [
          "The teacher divides students into small groups.",
          "Students practice throwing, catching, and teamwork.",
          "Students throw lob balls within the group.",
          "If they fail to catch, they perform a jump.",
          "Next, a throw-and-catch tournament is held.",
          "The tournament is played with a rope net.",
          "The teacher leads the tournament.",
          "A point is awarded if the ball drops in the opponent's area.",
          "The winner is determined by the highest score."
        ],
        "kriteria_lolos": [
          "Catching lob balls alertly, both from group mates and opponents.",
          "Tossing or throwing the ball over the rope net into the opponent's area.",
          "Following rules: holding the ball for a maximum of 5 seconds and playing sportively with the group.",
          "All three criteria are seen during the match, on at least 3 playing opportunities."
        ],
        "video": ["menangkap_tiga.mp4"],
        "level": "Hard"
      }
    ]
  },
  {
    "id_materi": "M3",
    "nama_materi": "Dribbling",
    "persiapan": [
      ["Equipment", "Small sized soccer ball (size 3–4)."],
      ["Equipment", "5 cones, placed zig-zag with a distance of ±1.5 m."],
      ["Equipment", "Start and finish lines at a distance of ±10 m."],
      ["Area and execution", "The student starts from the starting line, dribbles the ball past the cones in a zig-zag manner, then stops the ball at the finish line with the sole of the foot."],
      ["Command", "\"Dribble the ball past all the cones, then stop the ball at the finish line with the sole of your foot.\""],
      ["Trials", "The assessor gives one movement example, the student performs 1 practice trial (not graded), then 2 graded trials (T1 and T2)."]
    ],
    "kriteria_materi": [
      ["K1", "Touching the ball with the inside or outside of the foot, not with the toe."],
      ["K2", "The ball remains close to the feet (less than one step) while dribbling."],
      ["K3", "Looking forward occasionally, not constantly looking down at the ball."],
      ["K4", "Able to turn past the cones without losing the ball, then stopping the ball with the sole of the foot."]
    ],
    "tambahan": [
      ["Assessment", "Score = Points ÷ 8 × 100 (rounded). Note: P = Passed (≥ 75) · S = Sufficient, retake test (70–74) · R = Remedial (< 70)"]
    ],
    "permainan": [
      {
        "nama_permainan": "Outside Foot Dribbling",
        "instruksi": [],
        "tujuan": "",
        "langkah": [
          "The teacher divides groups and makes two facing lines.",
          "The teacher explains the objective and gives a chance for student demonstration.",
          "Students dribble the ball with the outside of the foot to the front line.",
          "Pass the ball to a friend and switch lines.",
          "Done alternately.",
          "The teacher leads reflection."
        ],
        "kriteria_lolos": [
          "Dribbling the ball with the outside of the foot while walking or lightly running.",
          "The ball stays close to the feet at every step (does not move far from the body).",
          "Arriving in front of the friend opposite and passing the ball with a soft touch, then moving to the back line.",
          "All three criteria are seen in at least 3 out of 5 trials."
        ],
        "video": ["menggiring_satu_480p.mp4"],
        "level": "Easy"
      },
      {
        "nama_permainan": "Zig-Zag Dribbling",
        "instruksi": [],
        "tujuan": "",
        "langkah": [
          "The teacher prepares zig-zag obstacles.",
          "The teacher explains the training objective.",
          "Students dribble the ball past the obstacles.",
          "Using a combination of outside and inside foot.",
          "Pass the ball to a friend and return to the line.",
          "The teacher leads reflection."
        ],
        "kriteria_lolos": [
          "Dribbling the ball past all winding obstacles (1-2 meters apart) without knocking down or touching them.",
          "Using the outside and inside of the foot so the ball remains controlled when turning.",
          "At the end of the track, giving a controlled pass to the next friend, then moving to the back line.",
          "All three criteria are seen in at least 3 out of 5 trials."
        ],
        "video": ["menggiring_dua.mp4"],
        "level": "Medium"
      },
      {
        "nama_permainan": "Dribbling Past Opponents",
        "instruksi": [],
        "tujuan": "",
        "langkah": [
          "The teacher divides students into groups with roles as dribblers and opponents.",
          "The teacher explains the training objective.",
          "Students dribble the ball towards the opponent.",
          "Perform a feint to get past the opponent.",
          "Pass the ball to a friend and swap roles.",
          "The teacher leads reflection."
        ],
        "kriteria_lolos": [
          "Approaching the opponent, then performing a feint or changing dribbling direction quickly.",
          "Getting past the opponent without losing ball control (ball is not stolen or kicked far away).",
          "Passing the ball to the opposite friend with a soft touch and alternating roles as dribbler and opponent.",
          "All three criteria are seen during the match, on at least 3 playing opportunities."
        ],
        "video": ["menggiring_tiga.mp4"],
        "level": "Hard"
      }
    ]
  },
  {
    "id_materi": "M4",
    "nama_materi": "Kicking",
    "persiapan": [
      ["Equipment", "Small sized soccer ball (size 3–4) or plastic ball with a diameter of ±20–25 cm."],
      ["Equipment", "Ball position marker, start line ±3 m behind the ball, and wall/target ±6 m in front of the ball."],
      ["Area and execution", "The ball is placed still on the ground. The student stands at the start line, then runs and kicks the ball as hard as possible towards the wall/target."],
      ["Command", "\"Run towards the ball and kick the ball as hard as possible towards the wall.\""],
      ["Trials", "The assessor gives one movement example, the student performs 1 practice trial (not graded), then 2 graded trials (T1 and T2)."]
    ],
    "kriteria_materi": [
      ["K1", "Performing a fast and uninterrupted run-up towards the ball."],
      ["K2", "Taking a long step or short hop right before touching the ball."],
      ["K3", "The plant foot is placed close to the ball."],
      ["K4", "Kicking the ball with the instep or inside of the foot, not with the toe."]
    ],
    "tambahan": [
      ["Assessment", "Score = Points ÷ 8 × 100 (rounded). Note: P = Passed (≥ 75) · S = Sufficient, retake test (70–74) · R = Remedial (< 70)"]
    ],
    "permainan": [
      {
        "nama_permainan": "Inside Foot Kick",
        "instruksi": [],
        "tujuan": "",
        "langkah": [
          "The teacher forms facing lines.",
          "The teacher explains the technique without demonstration.",
          "Students kick the ball to a friend.",
          "The receiver controls and returns the ball.",
          "Students help each other."
        ],
        "kriteria_lolos": [
          "Kicking the ball with the inside of the foot from a standing position without a run-up.",
          "The ball is directed to a friend directly in front (distance of about 4 meters).",
          "Stopping or controlling the received ball with the inside of the foot before kicking it back.",
          "All three criteria are seen in at least 3 out of 5 trials."
        ],
        "video": ["menendang_satu_720p.mp4"],
        "level": "Easy"
      },
      {
        "nama_permainan": "Bermuda Triangle Kick",
        "instruksi": [],
        "tujuan": "",
        "langkah": [
          "The teacher forms a triangle formation.",
          "The teacher explains the technique without demonstration.",
          "Students pass the ball in a triangle pattern.",
          "The front student kicks to the target.",
          "Students change groups.",
          "Those who fail help tidy up the targets."
        ],
        "kriteria_lolos": [
          "Kicking the ball with the inside of the foot with a run-up.",
          "Passing the ball following the triangle pattern between groups before shooting at the target.",
          "Directing the kick to the target cone (distance of about 4 meters), the kick hits or knocks down the target.",
          "All three criteria are seen in at least 3 out of 5 trials."
        ],
        "video": ["menendang_dua_720p.mp4"],
        "level": "Medium"
      },
      {
        "nama_permainan": "Throw and Kick Tournament",
        "instruksi": [],
        "tujuan": "",
        "langkah": [
          "The teacher divides students into small groups.",
          "Students practice throwing and kicking.",
          "Competition between groups begins.",
          "If the ball drops in the area, possession moves to the opponent.",
          "If it goes out of bounds, the opponent tries to hit the kicker.",
          "Points are given if the kicker is safe.",
          "The winner is determined by points."
        ],
        "kriteria_lolos": [
          "Throwing the ball to oneself, then kicking it (throw-kick) out of the throw kick area.",
          "As a kicker: reaching the target pole without getting hit by the opponent's ball. As a guard: catching the ball and kicking it towards the kicker's legs.",
          "Following the rules of the game and alternating kicks with group members.",
          "All three criteria are seen during the match, on at least 3 playing opportunities."
        ],
        "video": ["menendang_tiga_2.mp4"],
        "level": "Hard"
      }
    ]
  },
  {
    "id_materi": "M5",
    "nama_materi": "Striking",
    "persiapan": [
      ["Equipment", "Light plastic bat (or baseball/rounders bat)."],
      ["Equipment", "Plastic/rubber ball with a diameter of ±10 cm."],
      ["Equipment", "Ball batting tee (high cone) at the student's waist height."],
      ["Area and execution", "The ball is placed on a tee at the student's waist height. The student stands sideways next to the tee and hits the ball as hard as possible straight forward."],
      ["Command", "\"Hit the ball as hard as possible straight forward.\""],
      ["Trials", "The assessor gives one movement example, the student performs 1 practice trial (not graded), then 2 graded trials (T1 and T2)."]
    ],
    "kriteria_materi": [
      ["K1", "The dominant hand holds the bat above the non-dominant hand."],
      ["K2", "The non-dominant side of the hip and shoulder faces the hitting direction, both feet are parallel."],
      ["K3", "The hips and shoulders rotate while swinging the bat."],
      ["K4", "Stepping with the non-dominant foot towards the hitting direction."],
      ["K5", "The ball is hit straight forward."]
    ],
    "tambahan": [
      ["Assessment", "Score = Points ÷ 10 × 100 (rounded). Note: P = Passed (≥ 75) · S = Sufficient, retake test (70–74) · R = Remedial (< 70)"]
    ],
    "permainan": [
      {
        "nama_permainan": "Low Static Ball Hitting",
        "instruksi": [],
        "tujuan": "",
        "langkah": [
          "Create facing lines.",
          "The teacher explains the movement.",
          "Students hit a static ball below with two hands.",
          "Done alternately.",
          "Students return to the back of the line."
        ],
        "kriteria_lolos": [
          "Holding the bat with two hands and hitting a ball resting on the floor.",
          "The bat hits the ball so it moves forward.",
          "After hitting, running to the back of the line and alternating with friends in an orderly manner.",
          "All three criteria are seen in at least 3 out of 5 trials."
        ],
        "video": ["memukul_satu_720p.mp4"],
        "level": "Easy"
      },
      {
        "nama_permainan": "Bouncing Ball Hitting",
        "instruksi": [],
        "tujuan": "",
        "langkah": [
          "Create facing lines.",
          "The teacher explains the movement.",
          "Students bounce the ball then hit it as it rises.",
          "Walk forward while repeating.",
          "After finishing, return to the line."
        ],
        "kriteria_lolos": [
          "Holding the ball in one hand and the bat in the other.",
          "Bouncing the ball to the floor, then hitting it as the ball bounces up.",
          "Repeating the movement while walking forward to the end of the track, then returning and handing the equipment to the next friend.",
          "All three criteria are seen in at least 3 out of 5 trials."
        ],
        "video": ["memukul_dua_480p.mp4"],
        "level": "Medium"
      },
      {
        "nama_permainan": "Lob Ball Hitting",
        "instruksi": [],
        "tujuan": "",
        "langkah": [
          "The teacher divides students into groups or pairs.",
          "The teacher explains the objective.",
          "The thrower throws a lob ball.",
          "The hitter hits the ball.",
          "Students swap roles."
        ],
        "kriteria_lolos": [
          "As a thrower: delivering the ball with an underhand swing so it lobs at a medium speed into the friend's hitting area.",
          "As a hitter: hitting the lobbed ball with a bat so it flies far forward.",
          "Alternating roles (thrower, hitter, ball retriever) in an orderly manner.",
          "All three criteria are seen during the match, on at least 3 playing opportunities."
        ],
        "video": ["memukul_tiga.mp4"],
        "level": "Hard"
      }
    ]
  },
  {
    "id_materi": "M6",
    "nama_materi": "Throwing",
    "persiapan": [
      ["Equipment", "Tennis ball or small rubber ball with a diameter of ±6–7 cm."],
      ["Equipment", "Throwing line at a distance of ±6 m from the wall."],
      ["Area and execution", "The student stands behind the throwing line facing the wall, then throws the ball as hard as possible with an overhand swing."],
      ["Command", "\"Throw the ball as hard as possible towards the wall with an overhand swing.\""],
      ["Trials", "The assessor gives one movement example, the student performs 1 practice trial (not graded), then 2 graded trials (T1 and T2)."]
    ],
    "kriteria_materi": [
      ["K1", "The swing starts with a downward movement of the hand and arm."],
      ["K2", "Hips and shoulders rotate until the non-throwing side of the body faces the wall."],
      ["K3", "Stepping with the foot opposite to the throwing hand towards the wall."],
      ["K4", "The throwing hand continues the motion after ball release, crossing the body towards the hip of the non-throwing side."]
    ],
    "tambahan": [
      ["Assessment", "Score = Points ÷ 8 × 100 (rounded). Note: P = Passed (≥ 75) · S = Sufficient, retake test (70–74) · R = Remedial (< 70)"]
    ],
    "permainan": [
      {
        "nama_permainan": "Static Ball Throwing",
        "instruksi": [],
        "tujuan": "",
        "langkah": [
          "Each student holds 3 balls.",
          "The teacher divides groups into throwers and catchers.",
          "The teacher explains without demonstration.",
          "Students throw with technical variations.",
          "Done in a static position.",
          "After finishing, help retrieve the balls."
        ],
        "kriteria_lolos": [
          "Throwing in a static position (standing upright in place without stepping), power from shoulders and arms.",
          "Trying different throwing techniques (overhand, sidearm, underhand) with the 3 balls.",
          "The ball is directed to the target area; afterwards, help retrieve the ball via the side path and return to the back line.",
          "All three criteria are seen in at least 3 out of 5 trials."
        ],
        "video": ["melempar_satu_480p.mp4"],
        "level": "Easy"
      },
      {
        "nama_permainan": "Lob Ball Throwing",
        "instruksi": [],
        "tujuan": "",
        "langkah": [
          "The teacher forms groups.",
          "The teacher explains without demonstration.",
          "Students throw a lob ball.",
          "Done from a static position.",
          "Students return to the line."
        ],
        "kriteria_lolos": [
          "Throwing the ball with a lob trajectory forming an upward parabola.",
          "Throwing from a position without a step or stable stance, power from shoulders and arms.",
          "After throwing, returning to the line via the side path and alternating with friends in an orderly manner.",
          "All three criteria are seen in at least 3 out of 5 trials."
        ],
        "video": ["melempar_dua.mp4"],
        "level": "Medium"
      },
      {
        "nama_permainan": "Point Throw",
        "instruksi": [],
        "tujuan": "",
        "langkah": [
          "The teacher forms small groups.",
          "The teacher explains the objective.",
          "Students practice throwing flat over the rope.",
          "Points are given if successful.",
          "Competition between groups is held.",
          "The group with the most points wins."
        ],
        "kriteria_lolos": [
          "Throwing the ball flat (not lobbed) to the target.",
          "The ball passes through the middle space between two stretched ropes, and is not caught by the opponent, resulting in a point.",
          "Following the \"turnover\" rule when the ball is caught and playing sportively with the group.",
          "All three criteria are seen during the match, on at least 3 playing opportunities."
        ],
        "video": ["melempar_tiga.mp4"],
        "level": "Hard"
      }
    ]
  }
];