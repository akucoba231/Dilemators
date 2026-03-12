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
    
    const dataMateri = [
        { id_materi: 'M1', nama_materi: 'Memantul', instruksi: 'Lakukan pantulan bola ke lantai menggunakan satu atau dua tangan secara bergantian.', tujuan: 'Siswa mampu memantulkan bola basket dengan kontrol yang baik.', video: [{judul: 'Teknik Dasar Memantul'}, {judul: 'Memantul Sambil Berjalan'}, {judul: 'Memantul Melewati Rintangan'}] },
        { id_materi: 'M2', nama_materi: 'Menangkap', instruksi: 'Fokuskan pandangan pada bola, tangkap menggunakan kedua tangan secara sigap.', tujuan: 'Siswa mampu menangkap bola yang dilempar dengan berbagai arah yang tepat.', video: [{judul: 'Menangkap Bola Datar'}, {judul: 'Menangkap Bola Lambung'}, {judul: 'Menangkap Bola Menyusur Tanah'}] },
        { id_materi: 'M3', nama_materi: 'Menggiring', instruksi: 'Giring bola dengan kaki bagian dalam atau luar secara perlahan tanpa lepas kendali.', tujuan: 'Siswa dapat menggiring bola melewati rintangan dengan lincah.', video: [{judul: 'Menggiring Kaki Dalam'}, {judul: 'Menggiring Kaki Luar'}, {judul: 'Menggiring Zig-Zag'}] },
        { id_materi: 'M4', nama_materi: 'Menendang', instruksi: 'Gunakan punggung kaki untuk tendangan jarak jauh atau kaki bagian dalam untuk jarak dekat.', tujuan: 'Siswa mampu menendang bola ke arah sasaran secara akurat.', video: [{judul: 'Tendangan Jarak Dekat'}, {judul: 'Tendangan Jarak Jauh'}, {judul: 'Menendang ke Arah Gawang'}] },
        { id_materi: 'M5', nama_materi: 'Memukul', instruksi: 'Pegang tongkat pemukul dengan kuat, pusatkan pandangan, dan ayunkan sejajar pinggang.', tujuan: 'Siswa mampu memukul objek (bola) yang dilambungkan dengan tepat sasaran.', video: [{judul: 'Cara Memegang Tongkat'}, {judul: 'Memukul Bola Diam'}, {judul: 'Memukul Bola Lambung'}] },
        { id_materi: 'M6', nama_materi: 'Melempar', instruksi: 'Ayunkan lengan dari belakang ke depan, lepaskan objek pada titik tertinggi untuk jarak jauh.', tujuan: 'Siswa mampu melempar bola kasti dengan lemparan melambung dan lurus.', video: [{judul: 'Lemparan Melambung'}, {judul: 'Lemparan Lurus Setinggi Dada'}, {judul: 'Lemparan Menyusur Tanah'}] }
    ];

    let currentMateriId = null;
    let tempAbsen = {}; 
    let tempSiswaAktifId = null; 
    let tempUmpanBalikAktif = null;

    function nav(targetId) {
        document.querySelectorAll('.page').forEach(page => page.classList.remove('active'));
        document.getElementById(targetId).classList.add('active');
        if(targetId === 'page-data-siswa') renderTabelSiswa();
        if(targetId === 'page-materi') renderGridMateri();
        if(targetId === 'page-evaluasi') renderTabelEvaluasi();
    }

    function showModal(title, message) {
        document.getElementById('modalTitle').innerText = title;
        document.getElementById('modalBody').innerText = message;
        document.getElementById('globalModal').style.display = 'flex';
    }
    function closeModal(id) { document.getElementById(id).style.display = 'none'; }

    function prosesLogin() {
        const user = document.getElementById('username').value;
        const pass = document.getElementById('password').value;
        if(user === 'admin' && pass === 'admin') {
            document.getElementById('username').value = ''; document.getElementById('password').value = '';
            nav('page-data-siswa');
        } else { showModal("Login Gagal!", "Username atau password salah."); }
    }

    function renderTabelSiswa() {
        const tbody = document.querySelector('#tabelSiswa tbody'); tbody.innerHTML = '';
        if(dataSiswa.length === 0) { tbody.innerHTML = '<tr><td colspan="3">Belum ada data</td></tr>'; return; }
        dataSiswa.forEach((siswa, index) => {
            tbody.innerHTML += `<tr>
                <td>${index + 1}</td>
                <td style="text-align:left;">${siswa.nama_siswa}</td>
                <td>
                    <button class="btn-info" style="padding: 6px 10px; font-size:11px; margin-bottom:4px;" onclick="bukaUbahSiswa('${siswa.id_siswa}')">Ubah</button>
                    <button class="btn-danger" style="padding: 6px 10px; font-size:11px;" onclick="hapusSiswa('${siswa.id_siswa}')">Hapus</button>
                </td>
            </tr>`;
        });
    }

    function bukaFormTambahSiswa() {
        document.getElementById('formSiswaTitle').innerText = "Tambahkan Siswa";
        document.getElementById('inputIdSiswa').value = '';
        document.getElementById('inputNama').value = '';
        document.getElementById('inputKelas').value = '';
        document.getElementById('inputAbsen').value = '';
        document.getElementById('inputSekolah').value = sessionStorage.getItem('tempSekolahDile') || '';
        nav('page-form-siswa');
    }

    function bukaUbahSiswa(id) {
        const siswa = dataSiswa.find(s => s.id_siswa === id);
        if(siswa) {
            document.getElementById('formSiswaTitle').innerText = "Ubah Data Siswa";
            document.getElementById('inputIdSiswa').value = siswa.id_siswa;
            document.getElementById('inputNama').value = siswa.nama_siswa;
            document.getElementById('inputKelas').value = siswa.kelas;
            document.getElementById('inputAbsen').value = siswa.absen;
            document.getElementById('inputSekolah').value = siswa.sekolah;
            nav('page-form-siswa');
        }
    }

    function simpanSiswa() {
        const id = document.getElementById('inputIdSiswa').value;
        const nama = document.getElementById('inputNama').value;
        const kelas = document.getElementById('inputKelas').value;
        const absen = document.getElementById('inputAbsen').value;
        const sekolah = document.getElementById('inputSekolah').value;

        if(!nama || !kelas || !absen || !sekolah) { showModal("Peringatan", "Semua data wajib diisi!"); return; }

        if(id) {
            const index = dataSiswa.findIndex(s => s.id_siswa === id);
            if(index !== -1) dataSiswa[index] = { id_siswa: id, nama_siswa: nama, kelas: kelas, absen: absen, sekolah: sekolah };
        } else {
            dataSiswa.push({ id_siswa: "S" + Date.now(), nama_siswa: nama, kelas: kelas, absen: absen, sekolah: sekolah });
            sessionStorage.setItem('tempSekolahDile', sekolah);
        }
        localStorage.setItem('dileSiswa', JSON.stringify(dataSiswa));
        nav('page-data-siswa');
    }

    function hapusSiswa(id) {
        if(confirm("Hapus siswa ini?")) {
            dataSiswa = dataSiswa.filter(s => s.id_siswa !== id);
            dataPenilaian = dataPenilaian.filter(p => p.id_siswa !== id);
            localStorage.setItem('dileSiswa', JSON.stringify(dataSiswa));
            localStorage.setItem('dilePenilaian', JSON.stringify(dataPenilaian));
            renderTabelSiswa();
        }
    }

    function renderGridMateri() {
        const container = document.getElementById('gridMateriContainer'); container.innerHTML = '';
        dataMateri.forEach(m => { 
            container.innerHTML += `
            <div class="card-materi" onclick="pilihMateri('${m.id_materi}')">
                <div class="icon-box">
                <img src="assets/${m.nama_materi}.png" alt="icon" />
                </div>
                <div class="text-box">${m.nama_materi}</div>
                <svg class="check-icon" viewBox="0 0 24 24"><path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z"/></svg>
            </div>`; 
        });
    }

    function pilihMateri(id) {
        currentMateriId = id; tempAbsen = {}; 
        const materi = dataMateri.find(m => m.id_materi === id);
        document.getElementById('teksInstruksi').innerText = materi.instruksi;
        document.getElementById('teksTujuan').innerText = materi.tujuan;
        document.getElementById('judulVideoMateri').innerText = "Video " + materi.nama_materi;
        let htmlVideo = '';
        materi.video.forEach((v, i) => {
            htmlVideo += `<div class="content-box"><p style="font-weight:900; color:#0288D1; margin-top:0;">🎥 Video ${i+1}: ${v.judul}</p><div style="height:140px; background:#E1F5FE; color:#29B6F6; font-weight:800; display:flex; align-items:center; justify-content:center; border-radius:15px; border:2px dashed #81D4FA;">[Player Video]</div></div>`;
        });
        document.getElementById('containerVideo').innerHTML = htmlVideo;
        renderAbsensi(); nav('page-absen');
    }

    function renderAbsensi() {
        const container = document.getElementById('listAbsensi'); container.innerHTML = '';
        if(dataSiswa.length <= 0){
            container.innerHTML = `
            <div class="illustration-area">
                <img class="login-icon" src="assets/empty.png" alt="aktor-siswa-kosong">
            </div>
                <p class="kembali" style="font-size:1.2em;">Data siswa tidak ditemukan</p>
                <button class="btn-warning" onclick="nav('page-data-siswa')">Isi Data Siswa</button>
            `;
        }
        dataSiswa.forEach(siswa => {
            const status = tempAbsen[siswa.id_siswa] || 'Belum diabsen';
            const isDiabsen = tempAbsen[siswa.id_siswa] ? 'disabled' : '';
            
            container.innerHTML += `<div class="content-box">
                <p style="font-weight:900; margin-top:0; color:#0288D1; font-size:16px;">${siswa.nama_siswa} <span style="font-size:13px; color:#9E9E9E;">(${status})</span></p>
                <div class="top-buttons" style="margin-bottom:0; justify-content:flex-start;">
                    <button class="btn-info" ${isDiabsen} onclick="tempAbsen['${siswa.id_siswa}'] = 'Hadir'; renderAbsensi();" style="padding: 8px 15px; font-size:12px;">Hadir</button>
                    <button class="btn-danger" ${isDiabsen} onclick="tempSiswaAktifId='${siswa.id_siswa}'; document.getElementById('namaSiswaAbsen').innerText='${siswa.nama_siswa}'; document.getElementById('absenModal').style.display='flex';" style="padding: 8px 15px; font-size:12px;">Tidak Hadir</button>
                </div>
            </div>`;
        });
    }

    function simpanAlasanAbsen() { 
        tempAbsen[tempSiswaAktifId] = document.getElementById('alasanAbsen').value; 
        closeModal('absenModal'); 
        renderAbsensi(); 
    }

    function mulaiPenilaian() { renderPenilaian(); nav('page-penilaian'); }

    // ====== FUNGSI RENDER PENILAIAN YANG SUDAH DITAMBAHKAN LOGIKA OTOMATIS ======
    function renderPenilaian() {
        const btnSelesai = document.getElementById('btn-selesai-nilai');
        if(btnSelesai.hasAttribute('disabled')){
            btnSelesai.removeAttribute('disabled');
        }
        const container = document.getElementById('listPenilaian'); container.innerHTML = '';
        if(dataSiswa.length <= 0){
            container.innerHTML = `
            <div class="illustration-area">
                <img class="login-icon" src="assets/empty.png" alt="aktor-siswa-kosong">
            </div>
                <p class="kembali">Data siswa tidak ditemukan</p>
                <button class="btn-warning" onclick="nav('page-data-siswa')">Isi Data Siswa</button>
            `;
            //btnSelesai.setAttribute('disabled','');
        }
        dataSiswa.forEach(siswa => {
            const statusAbsen = tempAbsen[siswa.id_siswa] || 'Hadir';
            const isTidakHadir = ['Sakit', 'Izin', 'Alfa'].includes(statusAbsen);
            
            // LOGIKA OTOMATIS: Jika absen, nilai langsung 0 dan simpan keterangan
            if (isTidakHadir) {
                const cekNilai = dataPenilaian.find(p => p.id_siswa === siswa.id_siswa && p.id_materi === currentMateriId);
                // Jika data belum disave di localStorage, save sekarang
                if (!cekNilai) {
                    dataPenilaian.push({
                        id_penilaian: "P" + Date.now() + Math.floor(Math.random()*1000), 
                        tanggal: new Date().toISOString().split('T')[0],
                        id_siswa: siswa.id_siswa, 
                        id_materi: currentMateriId,
                        kehadiran: statusAbsen,
                        nilai: 0, 
                        umpan_balik: "Otomatis : Siswa tidak hadir karena " + statusAbsen
                    });
                    localStorage.setItem('dilePenilaian', JSON.stringify(dataPenilaian));
                }
            }

            // Ambil ulang data penilaian terbaru dari memori
            const hasScore = dataPenilaian.find(p => p.id_siswa === siswa.id_siswa && p.id_materi === currentMateriId);

            if (isTidakHadir) {
                // Tampilan untuk siswa yang absen
                const statusNilai = `<br><span style="color:#E53935; font-size:13px;">✔ Nilai Otomatis: 0</span>`;
                container.innerHTML += `<div class="content-box">
                    <p style="font-weight:900; margin-top:0; color:#0288D1; font-size:15px;">${siswa.nama_siswa} <span style="font-size:12px; color:#E53935;">(${statusAbsen})</span> ${statusNilai}</p>
                    <div class="top-buttons" style="margin-bottom:0; gap:5px;">
                        <button class="btn-danger" disabled style="padding: 6px 10px; font-size:11px;">Perbaikan</button>
                        <button class="btn-warning" disabled style="padding: 6px 10px; font-size:11px;">Cukup</button>
                        <button class="btn-info" disabled style="padding: 6px 10px; font-size:11px;">Bagus</button>
                    </div>
                    <p style="font-size:11px; color:#757575; margin-top:10px; margin-bottom:0; font-style:italic;">🔒 Terkunci: Umpan balik & nilai 0 diisi otomatis karena status ${statusAbsen}.</p>
                </div>`;
            } else {
                // Tampilan normal untuk siswa hadir
                const statusNilai = hasScore ? `<br><span style="color:#4CAF50; font-size:13px;">✔ Dinilai: ${hasScore.nilai}</span>` : '';
                const isDinilai = hasScore ? 'disabled' : '';

                container.innerHTML += `<div class="content-box">
                    <p style="font-weight:900; margin-top:0; color:#0288D1; font-size:15px;">${siswa.nama_siswa} <span style="font-size:12px; color:#9E9E9E;">(${statusAbsen})</span> ${statusNilai}</p>
                    <div class="top-buttons" style="margin-bottom:0; gap:5px;">
                        <button class="btn-danger" ${isDinilai} onclick="bukaModalNilai('${siswa.id_siswa}', '${siswa.nama_siswa}', 'Perbaikan')" style="padding: 6px 10px; font-size:11px;">Perbaikan</button>
                        <button class="btn-warning" ${isDinilai} onclick="bukaModalNilai('${siswa.id_siswa}', '${siswa.nama_siswa}', 'Cukup')" style="padding: 6px 10px; font-size:11px;">Cukup</button>
                        <button class="btn-info" ${isDinilai} onclick="bukaModalNilai('${siswa.id_siswa}', '${siswa.nama_siswa}', 'Bagus')" style="padding: 6px 10px; font-size:11px;">Bagus</button>
                    </div>
                </div>`;
            }
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

        dataPenilaian = dataPenilaian.filter(p => !(p.id_siswa === tempSiswaAktifId && p.id_materi === currentMateriId));
        dataPenilaian.push({
            id_penilaian: "P" + Date.now(), tanggal: new Date().toISOString().split('T')[0],
            id_siswa: tempSiswaAktifId, id_materi: currentMateriId,
            kehadiran: tempAbsen[tempSiswaAktifId] || 'Hadir',
            nilai: parseInt(nilai), umpan_balik: tempUmpanBalikAktif + " : " + (ket ? ket : "Tanpa catatan")
        });
        localStorage.setItem('dilePenilaian', JSON.stringify(dataPenilaian));
        closeModal('nilaiModal'); 
        renderPenilaian(); 
    }

    function selesaiPenilaian() { showModal("Sukses", "Data pembelajaran tersimpan."); nav('page-materi'); }

    function renderTabelEvaluasi() {
        const tbody = document.querySelector('#tabelEvaluasi tbody'); tbody.innerHTML = '';
        if(dataSiswa.length === 0) { tbody.innerHTML = '<tr><td colspan="3">Belum ada data</td></tr>'; return; }
        dataSiswa.forEach((siswa, index) => {
            tbody.innerHTML += `<tr>
                <td>${index + 1}</td>
                <td style="text-align:left;">${siswa.nama_siswa}</td>
                <td><button class="btn-info" style="padding: 6px 12px; font-size:11px;" onclick="bukaRincianEvaluasi('${siswa.id_siswa}')">Rincian</button></td>
            </tr>`;
        });
    }

    function bukaRincianEvaluasi(id_siswa) {
        const siswa = dataSiswa.find(s => s.id_siswa === id_siswa);
        document.getElementById('rincianNamaSiswa').innerText = siswa.nama_siswa;

        let totalNilai = 0, materiDinilaiCount = 0, htmlBintang = '';

        dataMateri.forEach(materi => {
            const nilaiMateri = dataPenilaian.find(p => p.id_siswa === id_siswa && p.id_materi === materi.id_materi);
            let score = 0;
            if(nilaiMateri) { score = nilaiMateri.nilai; totalNilai += score; materiDinilaiCount++; }

            const starCount = Math.round(score / 20);
            const starsUI = '★'.repeat(starCount) + '☆'.repeat(5 - starCount);

            htmlBintang += `<div class="star-row">
                    <span style="width: 50%; text-align:left;">${materi.nama_materi}</span>
                    <span class="stars" style="width: 50%; text-align:right;">${starsUI}</span>
                </div>`;
        });

        const rataRata = materiDinilaiCount > 0 ? Math.round(totalNilai / materiDinilaiCount) : 0;
        const progressBar = document.getElementById('rincianProgressBar');
        progressBar.style.width = rataRata + '%'; progressBar.innerText = rataRata + '%';

        document.getElementById('rincianBintangMateri').innerHTML = htmlBintang;
        nav('page-rincian-evaluasi');
    }

    function exportExcel() {
        if(dataPenilaian.length === 0) { showModal("Gagal", "Belum ada data nilai."); return; }
        let csvContent = "data:text/csv;charset=utf-8,No,Nama Siswa,Kelas,No Absen,Sekolah,Materi,Tanggal,Kehadiran,Nilai (1-100),Umpan Balik & Keterangan\n";
        dataPenilaian.forEach((p, index) => {
            const siswa = dataSiswa.find(s => s.id_siswa === p.id_siswa) || {};
            const materi = dataMateri.find(m => m.id_materi === p.id_materi) || {};
            const row = [index + 1, `"${siswa.nama_siswa||'-'}"`, `"${siswa.kelas||'-'}"`, `"${siswa.absen||'-'}"`, `"${siswa.sekolah||'-'}"`, `"${materi.nama_materi||'-'}"`, p.tanggal, p.kehadiran, p.nilai, `"${p.umpan_balik||'-'}"`].join(",");
            csvContent += row + "\n";
        });
        const link = document.createElement("a"); link.setAttribute("href", encodeURI(csvContent));
        link.setAttribute("download", "Evaluasi_PJOK_Dilemators.csv"); document.body.appendChild(link);
        link.click(); document.body.removeChild(link);
    }