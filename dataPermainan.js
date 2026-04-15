const permainan = [
  {
    nama_permainan: "Patung Musik (Freeze Game)",
    instruksi: [],
    tujuan: "",
    langkah: [
      "Musik diputar, anak bebas bergerak di tempat (mengayun tangan, memutar badan, dll).",
      "Saat musik berhenti, semua harus diam seperti patung."
    ],
    video: [],
    tag: ["Menekuk", "Memutar", "Mengayun", "Keseimbangan"]
  },
  {
    nama_permainan: "Ikuti Gerakanku",
    instruksi: [],
    tujuan: "",
    langkah: [
      "Guru atau satu anak jadi pemimpin.",
      "Anak lain menirukan gerakan tanpa berpindah tempat."
    ],
    video: [],
    tag: ["Menekuk", "Memutar", "Meregang"]
  },
  {
    nama_permainan: "Simon Says",
    instruksi: [],
    tujuan: "",
    langkah: [
      "Instruksi hanya dilakukan jika diawali 'Simon says'.",
      "Kalau tidak, yang bergerak dianggap salah."
    ],
    video: [],
    tag: ["Menekuk", "Memutar", "Meregang"]
  },
  {
    nama_permainan: "Tebak Gerakan",
    instruksi: [],
    tujuan: "",
    langkah: [
      "Satu anak memperagakan gerakan di tempat.",
      "Teman lain menebak."
    ],
    video: [],
    tag: ["Memutar", "Mengayun", "Meregang"]
  },
  {
    nama_permainan: "Keseimbangan Satu Kaki",
    instruksi: [],
    tujuan: "",
    langkah: [
      "Anak berdiri dengan satu kaki selama mungkin.",
      "Bisa dibuat lomba."
    ],
    video: [],
    tag: ["Keseimbangan"]
  }
];

const mapTagToMateri = {
  Menekuk: "N1",
  Memutar: "N2",
  Mengayun: "N3",
  Meregang: "N4",
  Keseimbangan: "N5"
};

function generateDataMateri(permainan) {
  const materiMap = {};

  // Inisialisasi materi (biar urutan konsisten)
  Object.entries(mapTagToMateri).forEach(([nama, id]) => {
    materiMap[id] = {
      id_materi: id,
      nama_materi: nama,
      permainan: []
    };
  });

  // Mapping permainan ke materi
  permainan.forEach(p => {
    const tagUnik = [...new Set(p.tag)]; // cegah duplikat tag

    tagUnik.forEach(tag => {
      const materiId = mapTagToMateri[tag];
      //if (!materiId) return;
      if (!materiId) {
        console.warn(`Tag tidak dikenali: ${tag}`);
        return; 
      }

      // Hindari duplikasi permainan dalam materi
      const sudahAda = materiMap[materiId].permainan
        .some(item => item.nama_permainan === p.nama_permainan);

      if (!sudahAda) {
        materiMap[materiId].permainan.push(p);
      }
    });
  });

  return Object.values(materiMap);
}

const dataMateri = generateDataMateri(permainan);