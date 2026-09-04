let dataSiswa = [];
let dataPenilaian = [];

try {
    const savedSiswa = localStorage.getItem('dileSiswa');
    if(savedSiswa) dataSiswa = JSON.parse(savedSiswa);
} catch(e) { localStorage.removeItem('dileSiswa'); }

try {
    const savedNilai = localStorage.getItem('dilePenilaian');
    if(savedNilai) dataPenilaian = JSON.parse(savedNilai);
} catch(e) { localStorage.removeItem('dilePenilaian'); }

let currentMateriId = null;
let tempAbsen = {}; 
let tempDinilaiSesiIni = {}; 
let tempSiswaAktifId = null; 
let tempUmpanBalikAktif = null;
let tmpPermainan = null;
let kelasAktifSesiIni = "";
let dataGuru = null;

// ==========================================
// FUNGSI UMUM & MODAL PANDUAN
// ==========================================

function getWaktuSekarang() {
    const now = new Date();
    const tgl = now.toLocaleDateString('id-ID', {day:'2-digit', month:'2-digit', year:'numeric'});
    const jam = now.toLocaleTimeString('id-ID', {hour:'2-digit', minute:'2-digit'});
    return `${tgl} ${jam}`;
}

function tanggalSekarang(){
    let dt = new Date();
    return `${dt.getDate()}-${dt.getMonth()}-${dt.getFullYear()}`;
}

function nav(targetId) {
    document.querySelectorAll('.page').forEach(page => page.classList.remove('active'));
    document.getElementById(targetId).classList.add('active');
    if(targetId === 'page-data-siswa') renderTabelSiswa();
    if(targetId === 'page-materi') renderGridMateri();
    if(targetId === 'page-evaluasi') renderTabelEvaluasi();
}

function showModal(title, message, isHTML = false) {
    document.getElementById('modalTitle').innerText = title;
    const modalBody = document.getElementById('modalBody');
    if(isHTML) {
        modalBody.innerHTML = message;
    } else {
        modalBody.innerText = message;
    }
    document.getElementById('globalModal').style.display = 'flex';
}

function closeModal(id) { document.getElementById(id).style.display = 'none'; }

function bukaKonfirmasi(pesan, teksTombol, callbackAksi) {
    document.getElementById('confirmBody').innerText = pesan;
    const btn = document.getElementById('confirmActionBtn');
    btn.innerText = teksTombol; 
    btn.onclick = function() {
        closeModal('confirmModal');
        callbackAksi();
    };
    document.getElementById('confirmModal').style.display = 'flex';
}

function konfirmasiKembali(targetPage, message) {
    bukaKonfirmasi(message, "Ya, Kembali", function() { nav(targetPage); });
}

// FUNGSI PANDUAN ON-DEMAND
function tampilkanPanduan(halaman) {
    let judul = "Panduan Aplikasi";
    let pesan = "";
    
    switch(halaman) {
        case 'login':
            judul = "Panduan Profil Guru";
            pesan = "<ul style='text-align:left; margin:0; padding-left:20px;'><li>Data Profil (Nama, NIP, Sekolah) yang Anda masukkan di sini akan <b>otomatis tercetak sebagai Kop/Header pada file laporan Excel</b>.</li><li style='margin-top:10px;'>Anda tidak perlu mengetik ulang setiap kali mengekspor laporan.</li></ul>";
            showModal(judul, pesan, true);
            break;
        case 'siswa':
            document.getElementById('panduanSiswaModal').style.display = 'flex';
            break;
        case 'materi':
            judul = "Panduan Pembelajaran";
            pesan = "<ul style='text-align:left; margin:0; padding-left:20px;'><li>Silakan pilih <b>Unit Gerak Manipulatif</b> dan <b>Permainan</b>.</li><li style='margin-top:10px;'>Alur berjalan lurus: <b>Pilih Materi ➔ Instruksi & Video ➔ Absensi ➔ Penilaian</b>.</li></ul>";
            showModal(judul, pesan, true);
            break;
        case 'absen':
            judul = "Panduan Sesi Kelas";
            pesan = "<ul style='text-align:left; margin:0; padding-left:20px;'><li>Halaman ini menggunakan <b>Kunci Sesi (Session Lock)</b>.</li><li style='margin-top:10px;'>Anda <b>wajib memilih kelas</b> di dropdown terlebih dahulu agar daftar siswa muncul.</li></ul>";
            showModal(judul, pesan, true);
            break;
        case 'penilaian':
            judul = "Panduan Penilaian";
            pesan = "<ul style='text-align:left; margin:0; padding-left:20px;'><li>Gunakan tombol umpan balik di bawah nama siswa untuk melakukan penilaian.</li><li>Sebuah form akan muncul, masukan nilai siswa dan catatan (opsional), lalu tekan simpan.</li><li style='margin-top:10px;'>Tombol nilai <b>tetap aktif</b> untuk memudahkan perbaikan atau debugging jika Anda ingin mengubah nilai pada sesi yang sama.</li></ul>";
            showModal(judul, pesan, true);
            break;
        case 'evaluasi':
            judul = "Panduan Ekspor Evaluasi";
            pesan = "<ul style='text-align:left; margin:0; padding-left:20px;'><li>Tabel menggunakan format <b>Buku Nilai</b> dengan rata-rata dinamis.</li><li style='margin-top:10px;'>Tombol <b>Export Excel</b> digunakan untuk mengunduh data evaluasi penilaian siswa.</li><li>Anda bisa menggunakan <b>Filter Kelas</b> untuk memilah hanya siswa kelas tertentu yang akan diunduh.</li><li style='margin-top:10px;'>Anda bisa melihat rincian penilaian siswa dengan menggeser tabel ke kanan, lalu menekan tombol <b>rincian</b>.</li></ul>";
            showModal(judul, pesan, true);
            break;
        case 'rincian':
            judul = "Panduan Koreksi Riwayat";
            pesan = "<ul style='text-align:left; margin:0; padding-left:20px;'><li>Klik nama unit gerak untuk melihat riwayat.</li><li style='margin-top:10px;'>Jika ada salah klik atau ingin menghapus <b>nilai percobaan awal yang buruk</b>, klik tanda silang (❌) untuk menghapusnya, nilai rata-rata siswa akan di- <i>update</i>.</li></ul>";
            showModal(judul, pesan, true);
            break;
    }
}

function downloadTemplateSiswa() {
    const ws_data = [
        ["No Abs", "Nama Siswa", "NISN", "JK", "Kelas", "Sekolah"],
        [1, "Andi Budi", "0012345678", "L", "7A", "SDN 1 Contoh"],
        [2, "Siti Aminah", "0087654321", "P", "7A", "SDN 1 Contoh"]
    ];
    const ws = XLSX.utils.aoa_to_sheet(ws_data);
    ws['!cols'] = [{wpx: 40}, {wpx: 150}, {wpx: 100}, {wpx: 50}, {wpx: 60}, {wpx: 150}];
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Template Siswa");
    XLSX.writeFile(wb, "Template_Import_Siswa_Dilemators.xlsx");
}

// ==========================================
// FITUR PROFIL GURU & BREADCRUMB
// ==========================================

function initDataGuru() {
    try {
        const saved = localStorage.getItem('dile-guru');
        if(saved) {
            dataGuru = JSON.parse(saved);
            if(document.getElementById('inputNamaGuru')) document.getElementById('inputNamaGuru').value = dataGuru.nama || '';
            if(document.getElementById('inputNIP')) document.getElementById('inputNIP').value = dataGuru.nip || '';
            if(document.getElementById('inputSekolahGuru')) document.getElementById('inputSekolahGuru').value = dataGuru.sekolah || '';
            renderBreadcrumbs();
        }
    } catch(e) { console.warn("Data guru tidak terbaca:", e); }
}

function simpanDataGuru() {
    const nama = document.getElementById('inputNamaGuru').value;
    const nip = document.getElementById('inputNIP').value;
    const sekolah = document.getElementById('inputSekolahGuru').value;

    if(!nama || !sekolah) { showModal("Peringatan!", "Nama Guru dan Asal Sekolah wajib diisi."); return; }

    dataGuru = { nama: nama, nip: nip, sekolah: sekolah };
    localStorage.setItem('dile-guru', JSON.stringify(dataGuru));
    sessionStorage.setItem('tempSekolahDile', sekolah); 
    
    renderBreadcrumbs();
    nav('page-data-siswa');
}

function renderBreadcrumbs() {
    if(!dataGuru) return;
    const pages = document.querySelectorAll('.page:not(#page-home):not(#page-login)');
    pages.forEach(page => {
        let bc = page.querySelector('.guru-breadcrumb');
        if(!bc) {
            bc = document.createElement('div');
            bc.className = 'guru-breadcrumb';
            const logo = page.querySelector('.logo-image');
            if(logo) logo.insertAdjacentElement('afterend', bc);
        }
        const textNIP = dataGuru.nip ? `(NIP. ${dataGuru.nip})` : '(NIP. -)';
        bc.innerHTML = `<div class="guru-nama">${dataGuru.nama}</div><div class="guru-nip">${textNIP}</div>`;
        bc.style.display = 'block';
    });
}
initDataGuru();

// ==========================================
// FITUR DATA SISWA & IMPORT
// ==========================================

function updateDropdownFilterKelas() {
    const selectFilter = document.getElementById('filterKelasTabel');
    if(!selectFilter) return;
    const currentValue = selectFilter.value;
    const kelasUnik = [...new Set(dataSiswa.map(s => s.kelas).filter(k => k))].sort();
    let htmlOptions = '<option value="">Semua Kelas</option>';
    kelasUnik.forEach(k => { htmlOptions += `<option value="${k}">${k}</option>`; });
    selectFilter.innerHTML = htmlOptions;
    if(kelasUnik.includes(currentValue)) selectFilter.value = currentValue;
}

function terapkanFilterKelas() {
    const nilaiFilter = document.getElementById('filterKelasTabel').value;
    const table = $('#tabelSiswa').DataTable();
    if(nilaiFilter) {
        table.column(4).search('^' + nilaiFilter + '$', true, false).draw();
    } else {
        table.column(4).search('').draw();
    }
}

function renderTabelSiswa() {
    if ($.fn.DataTable.isDataTable('#tabelSiswa')) {
        $('#tabelSiswa').DataTable().destroy();
    }
    const tbody = document.querySelector('#tabelSiswa tbody'); tbody.innerHTML = '';
    
    dataSiswa.forEach(siswa => {
        tbody.innerHTML += `<tr>
            <td style="font-weight:900; color:#01579B;">${siswa.absen}</td>
            <td style="text-align:left;">${siswa.nama_siswa}</td>
            <td>${siswa.nisn || '-'}</td>
            <td style="font-weight:900;">${siswa.jk || '-'}</td>
            <td>${siswa.kelas}</td>
            <td>${siswa.sekolah}</td>
            <td>
                <button class="btn-info" style="padding: 4px 8px; font-size:10px; margin-right:2px;" onclick="bukaUbahSiswa('${siswa.id_siswa}')">Ubah</button>
                <button class="btn-danger" style="padding: 4px 8px; font-size:10px;" onclick="hapusSiswa('${siswa.id_siswa}')">Hapus</button>
            </td>
        </tr>`;
    });

    updateDropdownFilterKelas();

    $('#tabelSiswa').DataTable({
        "order": [[0, "asc"]], "scrollX": true, "pageLength": 10, "lengthChange": false, 
        "language": {
            "search": "Cari:", "zeroRecords": "Tidak ada data siswa ditemukan", "info": "Hal _PAGE_ dari _PAGES_",
            "infoEmpty": "Tidak ada data", "infoFiltered": "(dari _MAX_ total data)",
            "paginate": { "next": "➔", "previous": "⬅" }
        }
    });
    terapkanFilterKelas();
}

function bukaFormTambahSiswa() {
    document.getElementById('formSiswaTitle').innerText = "Tambahkan Siswa";
    document.getElementById('inputIdSiswa').value = '';
    document.getElementById('inputAbsen').value = '';
    document.getElementById('inputNama').value = '';
    document.getElementById('inputNISN').value = '';
    document.getElementsByName('inputJK').forEach(r => r.checked = false);
    document.getElementById('inputKelas').value = '';
    const autoSekolah = dataGuru && dataGuru.sekolah ? dataGuru.sekolah : (sessionStorage.getItem('tempSekolahDile') || '');
    document.getElementById('inputSekolah').value = autoSekolah;
    nav('page-form-siswa');
}

function bukaUbahSiswa(id) {
    const siswa = dataSiswa.find(s => s.id_siswa === id);
    if(siswa) {
        document.getElementById('formSiswaTitle').innerText = "Ubah Data Siswa";
        document.getElementById('inputIdSiswa').value = siswa.id_siswa;
        document.getElementById('inputAbsen').value = siswa.absen;
        document.getElementById('inputNama').value = siswa.nama_siswa;
        document.getElementById('inputNISN').value = siswa.nisn || '';
        document.getElementById('inputKelas').value = siswa.kelas;
        document.getElementById('inputSekolah').value = siswa.sekolah;
        
        const jk = siswa.jk || '';
        document.getElementsByName('inputJK').forEach(r => { r.checked = (r.value === jk); });
        nav('page-form-siswa');
    }
}

function simpanSiswa() {
    const id = document.getElementById('inputIdSiswa').value;
    const absen = document.getElementById('inputAbsen').value;
    const nama = document.getElementById('inputNama').value;
    const nisn = document.getElementById('inputNISN').value;
    const kelas = document.getElementById('inputKelas').value;
    const sekolah = document.getElementById('inputSekolah').value;
    
    let jk = '';
    document.getElementsByName('inputJK').forEach(r => { if(r.checked) jk = r.value; });

    if(!absen || !nama || !nisn || !jk || !kelas || !sekolah) { 
        showModal("Peringatan", "Semua data wajib diisi, termasuk Jenis Kelamin!"); return; 
    }

    if(id) {
        const index = dataSiswa.findIndex(s => s.id_siswa === id);
        if(index !== -1) dataSiswa[index] = { id_siswa: id, absen: absen, nama_siswa: nama, nisn: nisn, jk: jk, kelas: kelas, sekolah: sekolah };
    } else {
        dataSiswa.push({ id_siswa: "S" + Date.now(), absen: absen, nama_siswa: nama, nisn: nisn, jk: jk, kelas: kelas, sekolah: sekolah });
        sessionStorage.setItem('tempSekolahDile', sekolah);
    }
    
    localStorage.setItem('dileSiswa', JSON.stringify(dataSiswa));
    nav('page-data-siswa');
}

function hapusSiswa(id) {
    bukaKonfirmasi("Yakin ingin menghapus data siswa ini beserta seluruh riwayat nilainya?", "Ya, Hapus", function() {
        dataSiswa = dataSiswa.filter(s => s.id_siswa !== id);
        dataPenilaian = dataPenilaian.filter(p => p.id_siswa !== id);
        localStorage.setItem('dileSiswa', JSON.stringify(dataSiswa));
        localStorage.setItem('dilePenilaian', JSON.stringify(dataPenilaian));
        renderTabelSiswa();
    });
}

function prosesImportExcel(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, {type: 'array'});
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        
        const jsonData = XLSX.utils.sheet_to_json(worksheet, {raw: false});
        if (jsonData.length === 0) { showModal("Gagal", "File Excel kosong atau format tidak dikenali."); return; }

        let jumlahBerhasil = 0;
        const autoSekolah = dataGuru && dataGuru.sekolah ? dataGuru.sekolah : (sessionStorage.getItem('tempSekolahDile') || '');

        jsonData.forEach(row => {
            const getVal = (possibleKeys) => {
                const key = Object.keys(row).find(k => possibleKeys.includes(k.toLowerCase().trim()));
                return key ? String(row[key]).trim() : '';
            };

            const absen = getVal(['no', 'no.', 'no abs', 'absen', 'no absen', 'nomor']);
            const nama = getVal(['nama', 'nama siswa', 'nama lengkap']);
            const nisn = getVal(['nisn', 'no induk']);
            const jk = getVal(['jk', 'j/k', 'jenis kelamin', 'l/p']);
            const kelas = getVal(['kelas', 'kls']);
            const sekolah = getVal(['sekolah', 'asal sekolah']) || autoSekolah;

            if (nama && kelas) {
                dataSiswa.push({
                    id_siswa: "S" + Date.now() + Math.floor(Math.random() * 10000),
                    absen: absen || '-', nama_siswa: nama, nisn: nisn || '-',
                    jk: jk ? jk.substring(0, 1).toUpperCase() : '-', kelas: kelas, sekolah: sekolah
                });
                jumlahBerhasil++;
            }
        });

        if(jumlahBerhasil > 0) {
            localStorage.setItem('dileSiswa', JSON.stringify(dataSiswa));
            renderTabelSiswa(); 
            showModal("Sukses", `${jumlahBerhasil} data siswa berhasil diimpor!`);
        } else {
            showModal("Peringatan", "Tidak ada data yang valid dimasukkan. Pastikan kolom 'Nama' dan 'Kelas' tersedia.");
        }
        event.target.value = '';
    };
    reader.readAsArrayBuffer(file);
}

// ==========================================
// ALUR PEMBELAJARAN & ABSENSI
// ==========================================

function renderGridMateri() {
    const container = document.getElementById('gridMateriContainer'); container.innerHTML = '';
    if (typeof dataMateri !== 'undefined') {
        dataMateri.forEach(m => { 
            container.innerHTML += `
            <div class="card-materi" onclick="pilihMateri('${m.id_materi}')">
                <div class="icon-box"><img alt="unit-gerak" src="assets/${m.nama_materi}.png" onerror="this.src='assets/logo_new.png'"/></div>
                <div class="text-box">${m.nama_materi}</div>
                <svg class="check-icon" viewBox="0 0 24 24"><path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z"/></svg>
            </div>`; 
        });
    } else {
        container.innerHTML = '<p>Data materi tidak ditemukan.</p>';
    }
}

function pilihMateri(id) {
    currentMateriId = id; tempAbsen = {}; tempDinilaiSesiIni = {}; 
    const materi = dataMateri.find(m => m.id_materi === id);
    let subMateri = document.getElementById('opsiPermainan');
    subMateri.innerHTML = "";
    let level = ["Mudah","Sedang","Sulit"];
    if(materi && materi.permainan) {
        materi.permainan.forEach((sub,index) => {
            subMateri.innerHTML += `<button class="btn-opsi" type="button" onclick="pilihSubMateri('${id}', ${index})">${sub.nama_permainan} (${level[index]})</button>`;  
        });
        nav('page-permainan');
    }
}

function pilihSubMateri(id, index){
    const materi = dataMateri.find(m => m.id_materi === id);
    tmpPermainan = materi.permainan[index].nama_permainan;

    let instruksiJoin = materi.permainan[index].instruksi ? materi.permainan[index].instruksi.join(' ') : "";
    document.getElementById('teksInstruksi').innerText = instruksiJoin.length <= 0 ? "Ikuti aba-aba dan arahan dari Guru." : instruksiJoin;

    let tmpTujuan = materi.permainan[index].tujuan || "";
    document.getElementById('teksTujuan').innerText = tmpTujuan.length <= 0 ? `Tujuan pembelajaran dari permainan adalah melakukan latihan gerak manipulatif "${materi.nama_materi}."` : tmpTujuan;
    
    document.getElementById('judulVideoMateri').innerText = "Video " + tmpPermainan;
    
    let tmpLangkah = '';
    if(materi.permainan[index].langkah) {
        materi.permainan[index].langkah.forEach((desk,idx) => { tmpLangkah += `<p class="item-langkah">${idx+1}. ${desk}</p>`; })
    }
    document.getElementById('langkahMateri').innerHTML = tmpLangkah;

    let htmlVideo = '';
    if(materi.permainan[index].video && materi.permainan[index].video.length >=1){
        materi.permainan[index].video.forEach((v) => {
            htmlVideo += `
            <div class="content-box">
                <p style="font-weight:900; color:#0288D1; margin-top:0;">🎥 Video Animasi</p>
                <div style="height:auto; background:#E1F5FE; color:#0288D1; font-weight:800; display:flex; align-items:center; justify-content:center; border-radius:15px; border:2px dashed #81D4FA;">
                    <video style="width:100%; aspect-ratio: 4/3;" controls><source src="video/${v}" type="video/mp4" />Browser tidak support.</video>
                </div>
            </div>`;
        });
    } else {
        htmlVideo += `
        <div class="content-box">
            <p style="font-weight:900; color:#0288D1; margin-top:0;">🎥 Animasi dalam produksi.</p>
            <div style="height:auto; background:#E1F5FE; color:#0288D1; font-weight:800; display:flex; align-items:center; justify-content:center; border-radius:15px; border:2px dashed #81D4FA;">
                <video style="width:100%; aspect-ratio: 4/3;" controls><source src="video/maaf.mp4" type="video/mp4" />Browser tidak support.</video>
            </div>
        </div>`;
    }
    document.getElementById('containerVideo').innerHTML = htmlVideo;

    kelasAktifSesiIni = "";
    const selectKelas = document.getElementById('pilihKelasAbsensi');
    const kelasUnik = [...new Set(dataSiswa.map(s => s.kelas).filter(k => k))].sort();
    let htmlOptions = '<option value="">-- Pilih Kelas --</option>';
    kelasUnik.forEach(k => { htmlOptions += `<option value="${k}">${k}</option>`; });
    selectKelas.innerHTML = htmlOptions;

    renderAbsensi(); nav('page-absen');
}

function setKelasAktif() {
    kelasAktifSesiIni = document.getElementById('pilihKelasAbsensi').value;
    renderAbsensi();
}

function renderAbsensi() {
    const container = document.getElementById('listAbsensi'); container.innerHTML = '';
    
    if(dataSiswa.length <= 0){
        container.innerHTML = `<div class="illustration-area"><img class="login-icon" src="assets/empty.png" alt="aktor-siswa-kosong"></div><p class="kembali" style="font-size:1.2em; color:#fff;">Data siswa tidak ditemukan</p><button class="btn-warning" onclick="nav('page-data-siswa')">Isi Data Siswa</button>`;
        return;
    }

    if(!kelasAktifSesiIni) {
        container.innerHTML = `<p style="font-weight:700; color:#fff; text-align:center; margin-top:20px; text-shadow: 2px 2px #000; letter-spacing: 1px; font-size: 1.2em;">Silakan pilih kelas terlebih dahulu untuk memulai sesi absensi.</p>`;
        return;
    }

    const siswaKelasIni = dataSiswa.filter(s => s.kelas === kelasAktifSesiIni);
    if(siswaKelasIni.length === 0) {
         container.innerHTML = `<p style="font-weight:700; color:#E53935; text-align:center; margin-top:20px;">Tidak ada siswa di kelas ini.</p>`; return;
    }

    siswaKelasIni.forEach(siswa => {
        const status = tempAbsen[siswa.id_siswa] || 'Belum diabsen';
        const isDiabsen = tempAbsen[siswa.id_siswa] ? 'disabled' : '';
        
        container.innerHTML += `<div class="content-box">
            <p style="font-weight:900; margin-top:0; color:#01579B; font-size:16px;">${siswa.nama_siswa} <span style="font-size:13px; color:#9E9E9E;">(${status})</span></p>
            <div class="top-buttons" style="margin-bottom:0; justify-content:flex-start;">
                <button class="btn-info" ${isDiabsen} onclick="tempAbsen['${siswa.id_siswa}'] = 'Hadir'; renderAbsensi();" style="padding: 8px 15px; font-size:12px;">Hadir</button>
                <button class="btn-danger" ${isDiabsen} onclick="tempSiswaAktifId='${siswa.id_siswa}'; document.getElementById('namaSiswaAbsen').innerText='${siswa.nama_siswa}'; document.getElementById('absenModal').style.display='flex';" style="padding: 8px 15px; font-size:12px;">Tidak Hadir</button>
            </div>
        </div>`;
    });
}

function simpanAlasanAbsen() { 
    const alasan = document.getElementById('alasanAbsen').value;
    tempAbsen[tempSiswaAktifId] = alasan; 
    dataPenilaian.push({
        id_penilaian: "P" + Date.now() + Math.floor(Math.random()*100),
        tanggal: getWaktuSekarang(), id_siswa: tempSiswaAktifId, id_materi: currentMateriId,
        kehadiran: alasan, nilai: 0, umpan_balik: "Otomatis: Siswa " + alasan
    });
    localStorage.setItem('dilePenilaian', JSON.stringify(dataPenilaian));
    tempDinilaiSesiIni[tempSiswaAktifId] = true;
    closeModal('absenModal'); renderAbsensi(); 
}

// ==========================================
// PENILAIAN SISWA
// ==========================================

function mulaiPenilaian() { renderPenilaian(); nav('page-penilaian'); }

function renderPenilaian() {
    const btnSelesai = document.getElementById('btn-selesai-nilai');
    if(btnSelesai.hasAttribute('disabled')) btnSelesai.removeAttribute('disabled');
    const container = document.getElementById('listPenilaian'); container.innerHTML = '';
    
    if(dataSiswa.length <= 0 || !kelasAktifSesiIni){
        container.innerHTML = `<div class="illustration-area"><img class="login-icon" src="assets/empty.png" alt="aktor-siswa-kosong"></div><p class="kembali" style="color:#fff; cursor:default;">Data siswa / kelas belum siap</p><button class="btn-warning" onclick="nav('page-absen')">Kembali ke Absensi</button>`;
        return;
    }

    const siswaKelasIni = dataSiswa.filter(s => s.kelas === kelasAktifSesiIni);

    siswaKelasIni.forEach(siswa => {
        const kehadiran = tempAbsen[siswa.id_siswa] || 'Hadir';
        const isHadir = kehadiran === 'Hadir';
        const isDinilai = tempDinilaiSesiIni[siswa.id_siswa]; 
        
        let statusText = '';
        let actionButtons = '';

        if (!isHadir) {
            statusText = `<br><span style="color:#E53935; font-size:13px;">✔ Tersimpan Otomatis (Nilai 0)</span>`;
            actionButtons = `<button class="btn-info" disabled style="padding: 6px 10px; font-size:11px; width: 100%; background:#EEEEEE !important; color:#9E9E9E !important;">Data ${kehadiran} Telah Tersimpan</button>`;
        } else {
            if (isDinilai) {
                statusText = `<br><span style="color:#4CAF50; font-size:13px;">✔ Berhasil Dinilai Sesi Ini</span>`;
                actionButtons = `<button class="btn-info" disabled style="padding: 6px 10px; font-size:11px; width: 100%; background:#EEEEEE !important; color:#9E9E9E !important;">Tersimpan ke Riwayat</button>`;
            } else {
                // Diperbarui: Tombol aktif untuk siswa yang belum dinilai
                actionButtons = `
                    <button class="btn-danger" onclick="bukaModalNilai('${siswa.id_siswa}', '${siswa.nama_siswa}', 'Perbaikan')" style="padding: 6px 10px; font-size:11px;">Perbaikan</button>
                    <button class="btn-warning" onclick="bukaModalNilai('${siswa.id_siswa}', '${siswa.nama_siswa}', 'Cukup')" style="padding: 6px 10px; font-size:11px;">Cukup</button>
                    <button class="btn-info" onclick="bukaModalNilai('${siswa.id_siswa}', '${siswa.nama_siswa}', 'Bagus')" style="padding: 6px 10px; font-size:11px;">Bagus</button>
                `;
            }
        }

        container.innerHTML += `<div class="content-box">
            <p style="font-weight:900; margin-top:0; color:#01579B; font-size:15px;">${siswa.nama_siswa} <span style="font-size:12px; color:#9E9E9E;">(${kehadiran})</span> ${statusText}</p>
            <div class="top-buttons" style="margin-bottom:0; gap:5px;">${actionButtons}</div>
        </div>`;
    });
}

function bukaModalNilai(id, nama, umpan) {
    tempSiswaAktifId = id; tempUmpanBalikAktif = umpan;
    document.getElementById('namaSiswaNilai').innerText = nama;
    document.getElementById('labelUmpanBalik').innerText = umpan;
    document.getElementById('inputAngkaNilai').value = '';
    document.getElementById('inputKeteranganNilai').value = '';
    document.getElementById('nilaiModal').style.display = 'flex';
}

function simpanNilaiSiswa() {
    const nilai = document.getElementById('inputAngkaNilai').value;
    const ket = document.getElementById('inputKeteranganNilai').value;
    if(!nilai) { showModal("Peringatan", "Masukkan nilai!"); return; }

    dataPenilaian.push({
        id_penilaian: "P" + Date.now() + Math.floor(Math.random()*100),
        tanggal: getWaktuSekarang(), id_siswa: tempSiswaAktifId, id_materi: currentMateriId,
        kehadiran: tempAbsen[tempSiswaAktifId] || 'Hadir', nilai: parseInt(nilai),
        umpan_balik: tempUmpanBalikAktif + " : " + (ket ? ket : "Tanpa catatan")
    });
    localStorage.setItem('dilePenilaian', JSON.stringify(dataPenilaian));
    
    // Khusus untuk Dilemators di sesi diskusi ini, logika berulang untuk debugging 
    // telah dicabut dan diganti dengan status terkunci (seperti arahan Anda pada instruksi Dilomotors)
    tempDinilaiSesiIni[tempSiswaAktifId] = true;

    closeModal('nilaiModal'); renderPenilaian(); 
}

function selesaiPenilaian() { showModal("Sukses", "Data pembelajaran tersimpan."); nav('page-materi'); }

// ==========================================
// FITUR EVALUASI & EXPORT EXCEL
// ==========================================

function getAvgMateri(id_siswa, id_materi) {
    const riwayat = dataPenilaian.filter(p => p.id_siswa === id_siswa && p.id_materi === id_materi);
    if(riwayat.length === 0) return '-';
    return Math.round(riwayat.reduce((sum, p) => sum + (Number(p.nilai) || 0), 0) / riwayat.length);
}

function updateDropdownFilterEvaluasi() {
    const selectFilter = document.getElementById('filterKelasEvaluasi');
    if(!selectFilter) return;
    const currentValue = selectFilter.value;
    const kelasUnik = [...new Set(dataSiswa.map(s => s.kelas).filter(k => k))].sort();
    let htmlOptions = '<option value="">Semua Kelas</option>';
    kelasUnik.forEach(k => { htmlOptions += `<option value="${k}">${k}</option>`; });
    selectFilter.innerHTML = htmlOptions;
    if(kelasUnik.includes(currentValue)) selectFilter.value = currentValue;
}

function terapkanFilterEvaluasi() {
    const nilaiFilter = document.getElementById('filterKelasEvaluasi').value;
    const table = $('#tabelEvaluasi').DataTable();
    if(nilaiFilter) {
        table.column(3).search('^' + nilaiFilter + '$', true, false).draw(); 
    } else {
        table.column(3).search('').draw();
    }
}

function renderTabelEvaluasi() {
    if ($.fn.DataTable.isDataTable('#tabelEvaluasi')) {
        $('#tabelEvaluasi').DataTable().destroy();
    }
    
    const tbody = document.querySelector('#tabelEvaluasi tbody'); tbody.innerHTML = '';
    
    dataSiswa.forEach(siswa => {
        const riwayatSiswa = dataPenilaian.filter(p => p.id_siswa === siswa.id_siswa);
        const avgTotal = riwayatSiswa.length > 0 ? Math.round(riwayatSiswa.reduce((sum, p) => sum + (Number(p.nilai) || 0), 0) / riwayatSiswa.length) : '-';

        // Berdasarkan ID Manipulatif (M1 - M6)
        const avgM1 = getAvgMateri(siswa.id_siswa, 'M1'); 
        const avgM2 = getAvgMateri(siswa.id_siswa, 'M2'); 
        const avgM3 = getAvgMateri(siswa.id_siswa, 'M3'); 
        const avgM4 = getAvgMateri(siswa.id_siswa, 'M4'); 
        const avgM5 = getAvgMateri(siswa.id_siswa, 'M5'); 
        const avgM6 = getAvgMateri(siswa.id_siswa, 'M6'); 

        tbody.innerHTML += `<tr>
            <td style="font-weight:900; color:#01579B;">${siswa.absen}</td>
            <td style="text-align:left;">${siswa.nama_siswa}</td>
            <td>${siswa.nisn || '-'}</td>
            <td>${siswa.kelas}</td>
            <td style="font-weight:900; color:#0288D1; background:#E1F5FE;">${avgTotal}</td>
            <td>${avgM1}</td><td>${avgM2}</td><td>${avgM3}</td>
            <td>${avgM4}</td><td>${avgM5}</td><td>${avgM6}</td>
            <td><button class="btn-info" style="padding: 4px 10px; font-size:10px;" onclick="bukaRincianEvaluasi('${siswa.id_siswa}')">Rincian</button></td>
        </tr>`;
    });

    updateDropdownFilterEvaluasi();

    $('#tabelEvaluasi').DataTable({
        "order": [[0, "asc"]], "scrollX": true, "pageLength": 10, "lengthChange": false,
        "language": {
            "search": "Cari:", "zeroRecords": "Tidak ada data evaluasi", "info": "Hal _PAGE_ dari _PAGES_",
            "infoEmpty": "Tidak ada data", "infoFiltered": "(dari _MAX_ total data)",
            "paginate": { "next": "➔", "previous": "⬅" }
        }
    });

    terapkanFilterEvaluasi();
}

function exportExcel() {
    if(dataPenilaian.length === 0) { showModal("Gagal", "Belum ada data nilai."); return; }
    
    let excelData = [];
    const namaSekolah = dataGuru && dataGuru.sekolah ? dataGuru.sekolah : "";
    const namaGuru = dataGuru && dataGuru.nama ? dataGuru.nama : "-";
    const nipGuru = dataGuru && dataGuru.nip ? dataGuru.nip : "-";
    
    const kelasFilter = document.getElementById('filterKelasEvaluasi').value;
    const textKelas = kelasFilter ? `Filter: Kelas ${kelasFilter}` : "Filter: Semua Kelas";
    
    excelData.push([`Evaluasi Hasil Penilaian Aplikasi Dilemators ${namaSekolah}`.trim()]);
    excelData.push([`Nama Guru : ${namaGuru}`]);
    excelData.push([`NIP       : ${nipGuru}`]);
    excelData.push([textKelas]);
    excelData.push([]); 
    
    excelData.push(["No Abs", "Nama Siswa", "NISN", "Kelas", "Rata-rata Total", "Memantul", "Menangkap", "Menggiring", "Menendang", "Memukul", "Melempar"]);
    
    let siswaDiproses = dataSiswa;
    if(kelasFilter) siswaDiproses = dataSiswa.filter(s => s.kelas === kelasFilter);
    siswaDiproses.sort((a, b) => (Number(a.absen) || 0) - (Number(b.absen) || 0));

    siswaDiproses.forEach(siswa => {
        const riwayatSiswa = dataPenilaian.filter(p => p.id_siswa === siswa.id_siswa);
        const avgTotal = riwayatSiswa.length > 0 ? Math.round(riwayatSiswa.reduce((sum, p) => sum + (Number(p.nilai) || 0), 0) / riwayatSiswa.length) : '-';

        excelData.push([
            siswa.absen, siswa.nama_siswa, siswa.nisn || '-', siswa.kelas, avgTotal,
            getAvgMateri(siswa.id_siswa, 'M1'), getAvgMateri(siswa.id_siswa, 'M2'),
            getAvgMateri(siswa.id_siswa, 'M3'), getAvgMateri(siswa.id_siswa, 'M4'),
            getAvgMateri(siswa.id_siswa, 'M5'), getAvgMateri(siswa.id_siswa, 'M6')
        ]);
    });

    const ws = XLSX.utils.aoa_to_sheet(excelData);
    if(!ws['!merges']) ws['!merges'] = [];
    ws['!merges'].push({ s: {r: 0, c: 0}, e: {r: 0, c: 10} });
    ws['!merges'].push({ s: {r: 1, c: 0}, e: {r: 1, c: 10} });
    ws['!merges'].push({ s: {r: 2, c: 0}, e: {r: 2, c: 10} });
    ws['!merges'].push({ s: {r: 3, c: 0}, e: {r: 3, c: 10} });
    
    ws['!cols'] = [ {wpx: 40}, {wpx: 160}, {wpx: 80}, {wpx: 60}, {wpx: 100}, {wpx: 70}, {wpx: 70}, {wpx: 70}, {wpx: 70}, {wpx: 70}, {wpx: 70} ];
    
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Rekap Evaluasi");
    XLSX.writeFile(wb, `Evaluasi_${kelasFilter ? kelasFilter : 'SemuaKelas'}_${namaSekolah ? namaSekolah.replace(/\s+/g, '_') : 'Dilemators'}.xlsx`);
}

// ==========================================
// MANAJEMEN RIWAYAT PENILAIAN
// ==========================================

function bukaRincianEvaluasi(id_siswa) {
    const siswa = dataSiswa.find(s => s.id_siswa === id_siswa);
    document.getElementById('rincianNamaSiswa').innerText = siswa.nama_siswa;

    document.getElementById('btnHapusSemuaRiwayat').onclick = function() { hapusSemuaRiwayatSiswa(id_siswa); };

    let htmlBintang = '';
    if (typeof dataMateri !== 'undefined') {
        dataMateri.forEach(materi => {
            const riwayatMateri = dataPenilaian.filter(p => p.id_siswa === id_siswa && p.id_materi === materi.id_materi);
            let uiBintang = '';
            if(riwayatMateri.length > 0) {
                const avgScore = Math.round(riwayatMateri.reduce((sum, p) => sum + (Number(p.nilai) || 0), 0) / riwayatMateri.length);
                const starCount = Math.round(avgScore / 20);
                uiBintang = '<span class="stars">' + '★'.repeat(starCount) + '☆'.repeat(5 - starCount) + ` (${avgScore})</span>`;
            } else {
                uiBintang = `<span style="font-size:12px; color:#9E9E9E;">Belum dinilai</span>`;
            }

            htmlBintang += `<div class="star-row" onclick="bukaRiwayatMateri('${id_siswa}', '${materi.id_materi}')">
                    <span style="width: 50%; text-align:left; color:#01579B; font-weight:900;">➔ ${materi.nama_materi}</span>
                    <span style="width: 50%; text-align:right;">${uiBintang}</span>
                </div>`;
        });
    }

    const riwayatSiswa = dataPenilaian.filter(p => p.id_siswa === id_siswa);
    const rataRataKeseluruhan = riwayatSiswa.length > 0 ? Math.round(riwayatSiswa.reduce((sum, p) => sum + (Number(p.nilai) || 0), 0) / riwayatSiswa.length) : 0;
    
    document.getElementById('rincianNilaiAngka').innerText = rataRataKeseluruhan;
    document.getElementById('rincianBintangMateri').innerHTML = htmlBintang;
    nav('page-rincian-evaluasi');
}

function hapusSemuaRiwayatSiswa(id_siswa) {
    bukaKonfirmasi("PERINGATAN!\n\nAnda yakin ingin menghapus SELURUH riwayat nilai untuk siswa ini? Data tidak dapat dikembalikan.", "Ya, Hapus Semua", function() {
        dataPenilaian = dataPenilaian.filter(p => p.id_siswa !== id_siswa);
        localStorage.setItem('dilePenilaian', JSON.stringify(dataPenilaian));
        renderTabelEvaluasi(); 
        bukaRincianEvaluasi(id_siswa);
        showModal("Sukses", "Seluruh riwayat nilai siswa berhasil dihapus.");
    });
}

function bukaRiwayatMateri(id_siswa, id_materi) {
    const materi = dataMateri.find(m => m.id_materi === id_materi);
    document.getElementById('riwayatJudul').innerText = "Riwayat: " + materi.nama_materi;
    
    const riwayat = dataPenilaian.filter(p => p.id_siswa === id_siswa && p.id_materi === id_materi);
    riwayat.sort((a, b) => b.id_penilaian.localeCompare(a.id_penilaian));

    const tbody = document.getElementById('riwayatBody'); tbody.innerHTML = '';
    
    if(riwayat.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" style="text-align:center; padding:15px;">Belum ada riwayat pembelajaran.</td></tr>';
    } else {
        riwayat.forEach(r => {
            const isHadir = r.kehadiran === 'Hadir';
            const rowColor = isHadir ? '#4A4A4A' : '#E53935';
            const showNilai = isHadir ? r.nilai : '0'; 
            
            tbody.innerHTML += `<tr style="color:${rowColor}; border-bottom:1px solid #E1F5FE;">
                <td>${r.tanggal}</td>
                <td style="font-weight:${isHadir ? '700' : '900'}">${r.kehadiran}</td>
                <td style="font-weight:900; color:#01579B;">${showNilai}</td>
                <td style="text-align:left; line-height:1.2;">${r.umpan_balik}</td>
                <td><button class="btn-danger" style="padding:4px; font-size:10px;" onclick="hapusRiwayatSpesifik('${r.id_penilaian}', '${id_siswa}', '${id_materi}')">❌</button></td>
            </tr>`;
        });
    }
    document.getElementById('riwayatModal').style.display = 'flex';
}

function hapusRiwayatSpesifik(id_penilaian, id_siswa, id_materi) {
    bukaKonfirmasi("Hapus baris penilaian ini?", "Ya, Hapus", function() {
        dataPenilaian = dataPenilaian.filter(p => p.id_penilaian !== id_penilaian);
        localStorage.setItem('dilePenilaian', JSON.stringify(dataPenilaian));
        renderTabelEvaluasi(); 
        bukaRiwayatMateri(id_siswa, id_materi); 
        bukaRincianEvaluasi(id_siswa); 
    });
}
