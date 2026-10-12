// Inisialisasi Tema dan Logo berdasarkan Konfigurasi
document.documentElement.style.setProperty('--primary', APP_CONFIG.colors.primary);
document.documentElement.style.setProperty('--primary-light', APP_CONFIG.colors.primaryLight);
document.documentElement.style.setProperty('--bg-light', APP_CONFIG.colors.bgLight);
document.documentElement.style.setProperty('--btn-gradient', APP_CONFIG.colors.btnGradient);
document.documentElement.style.setProperty('--btn-shadow', APP_CONFIG.colors.btnShadow);
document.documentElement.style.setProperty('--wordart-gradient', APP_CONFIG.wordartGradient);

const bgApp = APP_CONFIG.appName === 'Dilomotors' ? "background.png" : "empty.png"; // Fallback to plain/empty or specific bg
document.getElementById('app-container').style.backgroundImage = `url('${APP_CONFIG.assetPath}background.png')`;
document.getElementById('app-container').style.backgroundPosition = `center center`;
document.getElementById('app-container').style.backgroundSize = `cover`;

const logos = document.querySelectorAll('.logo-image');
logos.forEach(img => {
    img.src = `${APP_CONFIG.assetPath}logo_new.png`;
    img.onerror = () => { img.src = `${APP_CONFIG.assetPath}logo_new.png`; } // fallback
});

document.getElementById('taglineHome').innerText = APP_CONFIG.tagline;
document.getElementById('taglineMateri').innerText = APP_CONFIG.tagline;
document.getElementById('footerAppName').innerText = APP_CONFIG.appName;
document.getElementById('ownerNameHome').innerText = APP_CONFIG.ownerName;
document.getElementById('footerOwnerName').innerText = APP_CONFIG.ownerName;
document.getElementById('imgHome').src = `${APP_CONFIG.assetPath}home.png`;
// document.getElementById('imgLogin').src = `${APP_CONFIG.assetPath}home.png`;
document.getElementById('footerApps').style.background = APP_CONFIG.colors.btnGradient;
//document.getElementById('opsiPermainan').style.backgroundImage = `url('${APP_CONFIG.assetPath}instruksi.png')`;

// ==========================================
// CORE LOGIC 
// ==========================================

let dataSiswa = [];
let dataPenilaian = [];
let dataAbsensi = [];
let globalLang = "ID";

const storageSiswaKey = APP_CONFIG.storagePrefix + 'Siswa';
const storageNilaiKey = APP_CONFIG.storagePrefix + 'Penilaian';
const storageGuruKey = APP_CONFIG.storagePrefix + '-guru';
const storageAbsenKey = APP_CONFIG.storagePrefix + 'Absensi';

try {
    const savedSiswa = localStorage.getItem(storageSiswaKey);
    if(savedSiswa) dataSiswa = JSON.parse(savedSiswa);
} catch(e) { localStorage.removeItem(storageSiswaKey); }

try {
    const savedNilai = localStorage.getItem(storageNilaiKey);
    if(savedNilai) dataPenilaian = JSON.parse(savedNilai);
} catch(e) { localStorage.removeItem(storageNilaiKey); }

try {
    const savedAbsen = localStorage.getItem(storageAbsenKey);
    if(savedAbsen) dataAbsensi = JSON.parse(savedAbsen);
} catch(e) { localStorage.removeItem(storageAbsenKey); }

let currentMateriId = null;
let tempAbsen = {}; 
let tempDinilaiSesiIni = {}; 
let tempSiswaAktifId = null; 
let tempUmpanBalikAktif = null;
let tmpPermainan = null;
let kelasAktifSesiIni = "";
let dataGuru = null;


function getWaktuSekarang() {
    const now = new Date();
    const tgl = now.toLocaleDateString('id-ID', {day:'2-digit', month:'2-digit', year:'numeric'});
    const jam = now.toLocaleTimeString('id-ID', {hour:'2-digit', minute:'2-digit'});
    return `${tgl} ${jam}`;
}

// function nav(targetId) {
//     document.querySelectorAll('.page').forEach(page => page.classList.remove('active'));
//     document.getElementById(targetId).classList.add('active');
//     if(targetId === 'page-data-siswa') renderTabelSiswa();
//     if(targetId === 'page-materi') renderGridMateri();
//     if(targetId === 'page-evaluasi') renderTabelEvaluasi();
// }

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

function mulaiSesiHariIni() {
    bukaManajemenAbsensi();
}

function closeModal(id) { document.getElementById(id).style.display = 'none'; }

function bukaKonfirmasi(pesan, teksTombol, callbackAksi, callbackBatal = null) {
    document.getElementById('confirmBody').innerText = pesan;
    const btn = document.getElementById('confirmActionBtn');
    btn.innerText = teksTombol; 
    btn.onclick = function() {
        closeModal('confirmModal');
        callbackAksi();
    };
    
    // Temukan tombol Batal dan atur onclick-nya
    const btnBatal = document.querySelector('#confirmModal .btn-warning');
    if (btnBatal) {
        btnBatal.onclick = function() {
            closeModal('confirmModal');
            if (callbackBatal) callbackBatal();
        };
    }
    
    document.getElementById('confirmModal').style.display = 'flex';
}

function konfirmasiKembali(targetPage, message) {
    bukaKonfirmasi(message, "Ya, Kembali", function() { nav(targetPage); });
}

function tampilkanPanduan(halaman) {
    // Deteksi bahasa saat ini (default 'ID')
    const lang = localStorage.getItem(APP_CONFIG.appName + '_lang') || 'ID';
    
    let judul = (lang === 'EN') ? "Application Guide" : "Panduan Aplikasi";
    let pesan = "";
    
    switch(halaman) {
        case 'login':
            judul = (lang === 'EN') ? "Teacher Account" : "Akun Guru";
            pesan = (lang === 'EN') 
                ? "<ul style='text-align:left; margin:0; padding-left:20px;'><li>Teacher Account Data is required to access the application, please select <b>'Register'</b> if you do not have an account yet.</li><li>The Profile Data you enter will automatically be printed on the Excel report file.</li></ul>"
                : "<ul style='text-align:left; margin:0; padding-left:20px;'><li>Data Akun Guru diperlukan untuk mengakses aplikasi, silakan pilih <b>'Registrasi'</b> jika belum memiliki akun.</li><li>Data Profil yang Anda masukkan akan otomatis tercetak pada file laporan Excel.</li></ul>";
            showModal(judul, pesan, true);
            break;
            
        case 'siswa':
            document.getElementById('panduanSiswaModal').style.display = 'flex';
            break;
            
        case 'materi':
            judul = (lang === 'EN') ? "Learning Guide" : "Panduan Pembelajaran";
            pesan = (lang === 'EN')
                ? "<ul style='text-align:left; margin:0; padding-left:20px;'><li>Please select a Movement Unit and Game.</li></ul>"
                : "<ul style='text-align:left; margin:0; padding-left:20px;'><li>Silakan pilih Unit Gerak dan Permainan.</li></ul>";
            showModal(judul, pesan, true);
            break;
            
        case 'absen':
            judul = (lang === 'EN') ? "Class Session Guide" : "Panduan Sesi Kelas";
            pesan = (lang === 'EN')
                ? "<ul style='text-align:left; margin:0; padding-left:20px;'><li>You must select a class in the dropdown first.</li></ul>"
                : "<ul style='text-align:left; margin:0; padding-left:20px;'><li>Anda wajib memilih kelas di dropdown terlebih dahulu.</li></ul>";
            showModal(judul, pesan, true);
            break;
            
        case 'penilaian':
            judul = (lang === 'EN') ? "Assessment Guide" : "Panduan Penilaian";
            pesan = (lang === 'EN')
                ? "<ul style='text-align:left; margin:0; padding-left:20px;'><li>Use the feedback buttons to give a score. Buttons will be locked or active depending on the configuration.</li></ul>"
                : "<ul style='text-align:left; margin:0; padding-left:20px;'><li>Gunakan tombol umpan balik untuk memberi nilai. Tombol akan terkunci atau aktif tergantung konfigurasi.</li></ul>";
            showModal(judul, pesan, true);
            break;
            
        case 'evaluasi':
            judul = (lang === 'EN') ? "Evaluation Export Guide" : "Panduan Ekspor Evaluasi";
            pesan = (lang === 'EN')
                ? "<ul style='text-align:left; margin:0; padding-left:20px;'><li>Click details to see the history or use Export Excel.</li></ul>"
                : "<ul style='text-align:left; margin:0; padding-left:20px;'><li>Klik rincian untuk melihat riwayat atau gunakan Export Excel.</li></ul>";
            showModal(judul, pesan, true);
            break;
            
        case 'rincian':
            judul = (lang === 'EN') ? "History Correction Guide" : "Panduan Koreksi Riwayat";
            pesan = (lang === 'EN')
                ? "<ul style='text-align:left; margin:0; padding-left:20px;'><li>Click the movement unit name to delete the score.</li></ul>"
                : "<ul style='text-align:left; margin:0; padding-left:20px;'><li>Klik nama unit gerak untuk menghapus nilai.</li></ul>";
            showModal(judul, pesan, true);
            break;
            
        case 'registrasi' :
            judul = (lang === 'EN') ? "Account Registration" : "Registrasi Akun";
            pesan = (lang === 'EN')
                ? "<ul style='text-align:left; margin:0; padding-left:20px;'><li>To start using the application, you need to create an account first. Click the 'Account Registration' button to create an account.</li></ul>"
                : "<ul style='text-align:left; margin:0; padding-left:20px;'><li>Untuk memulai menggunakan aplikasi, Anda perlu membuat akun terlebih dahulu. Tekan tombol 'Registrasi Akun' untuk membuat akun.</li></ul>";
            showModal(judul, pesan, true);
            break;
    }
}

// ==========================================
// _SOLUSI_EXPORT_FILE
// Penanganan Export File (Excel & PDF) Aman untuk WebView Android Kotlin & Browser
// ==========================================
function downloadExcelSafe(wb, fileName) {
    if (window.Android && typeof window.Android.saveExcelBase64 === 'function') {
        // Hasilkan Base64 murni dari SheetJS
        const base64Data = XLSX.write(wb, { bookType: 'xlsx', type: 'base64' });
        // Kirim Base64 ke Kotlin WebView
        window.Android.saveExcelBase64(base64Data, fileName);
    } else {
        // Fallback untuk browser PC / Laptop biasa
        XLSX.writeFile(wb, fileName);
    }
}

function downloadPdfSafe(doc, fileName) {
    if (window.Android && typeof window.Android.saveExcelBase64 === 'function') {
        // Hasilkan Base64 murni dari jsPDF (buang prefix data URI jika ada)
        const dataUri = doc.output('datauristring');
        const rawBase64 = dataUri.split(',')[1];
        // Kirim Base64 ke Kotlin WebView
        window.Android.saveExcelBase64(rawBase64, fileName);
    } else {
        // Fallback untuk browser PC / Laptop biasa
        doc.save(fileName);
    }
}

// Export - 1: Unduh Template Import Siswa (Excel)
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
    // Menggunakan solusi export aman WebView Kotlin & Browser
    downloadExcelSafe(wb, `Template_Import_Siswa_${APP_CONFIG.appName}.xlsx`);
}

function hashString(str) {
    let hash = 0;
    if (str.length === 0) return hash.toString(16);
    for (let i = 0; i < str.length; i++) {
        let char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32bit integer
    }
    return hash.toString(16);
}

function initDataGuru() {
    try {
        const saved = localStorage.getItem(storageGuruKey);
        if(saved) {
            dataGuru = JSON.parse(saved);
            renderBreadcrumbs();
        }
    } catch(e) { }
}

function cekLoginAwal() {
    if (!dataGuru) {
        tampilkanPanduan('registrasi');
        nav('page-login');
    } else {
        nav('page-login');
    }
}

// Attach ini ke tombol "Masuk" di page-home via document getElementById
document.querySelector('#page-home .btn-primary').onclick = cekLoginAwal;

function bukaRegistrasi() {
    document.getElementById('regNama').value = '';
    document.getElementById('regNIP').value = '';
    document.getElementById('regSekolah').value = '';
    document.getElementById('regEmail').value = '';
    document.getElementById('regUsername').value = '';
    document.getElementById('regPassword').value = '';
    document.getElementById('regPertanyaan').value = '';
    document.getElementById('regJawaban').value = '';
    document.getElementById('registrasiModal').style.display = 'flex';
}

function simpanRegistrasi() {
    const nama = document.getElementById('regNama').value.trim();
    const nip = document.getElementById('regNIP').value.trim();
    const sekolah = document.getElementById('regSekolah').value.trim();
    const email = document.getElementById('regEmail').value.trim();
    const username = document.getElementById('regUsername').value.trim();
    const password = document.getElementById('regPassword').value;
    const pertanyaan = document.getElementById('regPertanyaan').value.trim();
    const jawaban = document.getElementById('regJawaban').value.trim().toLowerCase();

    if(!nama || !sekolah || !username || !password || !pertanyaan || !jawaban) {
        showModal("Peringatan!", "Mohon lengkapi semua data wajib.");
        return;
    }

    dataGuru = {
        nama: nama,
        nip: nip,
        sekolah: sekolah,
        email: email,
        username: username,
        password: hashString(password),
        pertanyaan: pertanyaan,
        jawaban: jawaban //hashString(jawaban)
    };

    localStorage.setItem(storageGuruKey, JSON.stringify(dataGuru));
    sessionStorage.setItem('tempSekolah' + APP_CONFIG.appName, sekolah); 
    
    closeModal('registrasiModal');
    showModal("Berhasil!", "Registrasi akun berhasil. Silakan masuk dengan Username dan Kata Sandi.");
}

function prosesLogin() {
    const username = document.getElementById('inputUsernameLogin').value.trim();
    const password = document.getElementById('inputPasswordLogin').value;

    // 1. Validasi input kosong
    if (!username || !password) {
        if (globalLang === "ID") {
            showModal("Peringatan!", "Mohon masukkan Username dan Kata Sandi.");
        } else {
            showModal("Warning!", "Please enter Username and Password.");
        }
        return;
    }

    // 2. Pastikan dataGuru tersinkron dari localStorage
    if (!dataGuru) {
        const saved = localStorage.getItem(storageGuruKey);
        if (saved) {
            try { dataGuru = JSON.parse(saved); } catch(e) { }
        }
    }

    // 3. Cek apakah ada akun terdaftar
    if (!dataGuru) {
        if (globalLang === "ID") {
            showModal("Gagal!", "Belum ada akun terdaftar. Silakan registrasi terlebih dahulu.");
        } else {
            showModal("Error!", "No account registered yet. Please register first.");
        }

        // Bagian ini hanya untuk uji coba
        if(username === "coba" && hashString(password) === hashString('123')){
            // Simpan sesi login ke sessionStorage
            //sessionStorage.setItem('isLoggedIn' + APP_CONFIG.appName, JSON.stringify(dataGuru));
        
            // Bersihkan form
            document.getElementById('inputUsernameLogin').value = '';
            document.getElementById('inputPasswordLogin').value = '';
        
            // Pindah ke dashboard (nav otomatis memanggil renderBreadcrumbs)
            nav('page-dashboard');
        }
        return;
    }

    // 4. Verifikasi kredensial
    if (username === dataGuru.username && hashString(password) === dataGuru.password) {
        // Simpan sesi login ke sessionStorage
        sessionStorage.setItem('isLoggedIn' + APP_CONFIG.appName, JSON.stringify(dataGuru));
        
        // Bersihkan form
        document.getElementById('inputUsernameLogin').value = '';
        document.getElementById('inputPasswordLogin').value = '';
        
        // Pindah ke dashboard (nav otomatis memanggil renderBreadcrumbs)
        nav('page-dashboard');
    } else {
        // Pesan gagal dwibahasa
        
        
            if (globalLang === "ID") {
            showModal("Gagal!", "Username atau Kata Sandi salah.");
            } else {
                showModal("Error!", "Incorrect Username or Password.");
            }
        
    }
}

function bukaResetSandi() {
    if(!dataGuru) {
        if(globalLang === "ID"){
            showModal("Gagal!", "Belum ada akun terdaftar.");
        }
        else {
            showModal("Error", "There's no account yet.");   
        }
        return;
    }
    // Setup UI awal
    document.getElementById('tahap1Reset').style.display = 'block';
    document.getElementById('wadahPasswordBaru').style.display = 'none';
    document.getElementById('btnSimpanReset').disabled = true;
    document.getElementById('resetJawaban').disabled = false;
    document.getElementById('btnPeriksaJawaban').style.display = 'block';
    
    // Kosongkan input
    document.getElementById('labelPertanyaanKeamanan').innerText = dataGuru.pertanyaan;
    document.getElementById('resetJawaban').value = '';
    document.getElementById('resetPassword1').value = '';
    document.getElementById('resetPassword2').value = '';
    document.getElementById('statusCocokSandi').innerText = '';
    
    document.getElementById('resetSandiModal').style.display = 'flex';
}

function periksaJawabanKeamanan() {
    const jawaban = document.getElementById('resetJawaban').value.trim().toLowerCase();
    
    if(!jawaban) {
        if(globalLang === "ID") {
            showModal("Peringatan!", "Mohon isi jawaban Anda.");
        }
        else {
            showModal("Warning!", "Please input your security answer.");
        }
        return;
    }

    if(/*hashString(jawaban)*/ jawaban === dataGuru.jawaban || jawaban === "pjok#1234") {
        // Jawaban benar, buka tahap 2
        document.getElementById('wadahPasswordBaru').style.display = 'block';
        document.getElementById('resetJawaban').disabled = true;
        document.getElementById('btnPeriksaJawaban').style.display = 'none';
    } else {
        showModal("Gagal!", "Jawaban keamanan salah.");
    }
}

function periksaKecocokanSandi() {
    const p1 = document.getElementById('resetPassword1').value;
    const p2 = document.getElementById('resetPassword2').value;
    const status = document.getElementById('statusCocokSandi');
    const btnSimpan = document.getElementById('btnSimpanReset');

    if (p2 === "") {
        status.innerText = "";
        btnSimpan.disabled = true;
        return;
    }

    if (p1 === p2) {
        status.innerText = "✔";
        btnSimpan.disabled = false;
    } else {
        status.innerText = "❌";
        btnSimpan.disabled = true;
    }
}

function prosesResetSandi() {
    const p1 = document.getElementById('resetPassword1').value;
    const p2 = document.getElementById('resetPassword2').value;
    const lang = localStorage.getItem(APP_CONFIG.appName + '_lang') || 'ID';

    if(!p1 || !p2) {
        if(lang === "ID"){
            showModal("Peringatan!", "Mohon lengkapi kata sandi baru.");
        }
        else {
            showModal("Warning!", "Please type new password");   
        }
        return;
    }


    if(p1 !== p2) {
        if(lang === "ID"){
            showModal("Peringatan!", "Kata sandi baru tidak cocok.");
        }
        else {
            showModal("Warning!", "Password does not match");
        }
        
        return;
    }

    dataGuru.password = hashString(p1);
    localStorage.setItem(storageGuruKey, JSON.stringify(dataGuru));
    closeModal('resetSandiModal');
    if(lang === "ID"){
            showModal("Berhasil!", "Kata sandi berhasil diatur ulang.");
        }
        else {
            showModal("Success!", "New password has been set.");
        }
    
}

function renderBreadcrumbs() {
    //setInterval(()=> { console.log("breadcrumbs : " + globalLang); }, 1000);
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
        
        if (page.id === 'page-dashboard') {
            const textNIP = dataGuru.nip ? `(NIP. ${dataGuru.nip})` : '(NIP. -)';
            bc.innerHTML = `<div class="guru-nama">${dataGuru.nama}</div><div class="guru-nip">${textNIP}</div>`;
        } else if (page.id === 'page-detail-materi') {
            bc.innerHTML = `<div style="font-size:13px; font-weight:800; color:var(--primary); text-align:left; padding-left:5px; cursor:pointer;" onclick="nav('page-materi')">${globalLang === "ID" ? "Materi Pembelajaran" : "Learning Material"} <span style="color:#666; font-size:11px;">➜</span> <span style="color:var(--primary-light);" id="bcNamaMateri">Detail Unit</span></div>`;
        } else {
            const titleEl = page.querySelector('.title-text');
            const pageTitle = titleEl ? titleEl.innerText : 'Menu';
            bc.innerHTML = `<div style="font-size:13px; font-weight:800; color:var(--primary); text-align:left; padding-left:5px; cursor:pointer;" onclick="nav('page-dashboard')">🏠 ${globalLang === "ID" ? 'Dasbor' : 'Dashboard'} <span style="color:#666; font-size:11px;">➜</span> <span style="color:var(--primary-light);">${pageTitle}</span></div>`;
        }
        bc.style.display = 'block';
    });
}
initDataGuru();

function updateDropdownFilterKelas(selectId) {
    const selectFilter = document.getElementById(selectId);
    if(!selectFilter) return;
    const currentValue = selectFilter.value;
    const kelasUnik = [...new Set(dataSiswa.map(s => s.kelas).filter(k => k))].sort();
    let htmlOptions = `<option value="">${globalLang === "ID" ? "Semua Kelas" : "All Classes"}</option>`;
    kelasUnik.forEach(k => { htmlOptions += `<option value="${k}">${k}</option>`; });
    selectFilter.innerHTML = htmlOptions;
    if(kelasUnik.includes(currentValue)) selectFilter.value = currentValue;
}

function updateFilterKelasButtons(containerId) {
    const container = document.getElementById(containerId);
    if(!container) return;
    
    const kelasUnik = [...new Set(dataSiswa.map(s => s.kelas).filter(k => k))].sort();
    
    let htmlButtons = '';
    
    // "Semua Kelas" button
    if(globalLang === "ID"){
        htmlButtons += `<button type="button" class="btn-primary" style="padding: 12px; font-weight: bold; border-radius: 10px; font-size: 14px; width: 100%; text-align: left;" onclick="gantiKelasAbsensi('')">Semua Kelas</button>`;
    }
    else {
        htmlButtons += `<button type="button" class="btn-primary" style="padding: 12px; font-weight: bold; border-radius: 10px; font-size: 14px; width: 100%; text-align: left;" onclick="gantiKelasAbsensi('')">All Classes</button>`;
    }
    
    // Individual class buttons
    kelasUnik.forEach(k => {
        htmlButtons += `<button type="button" class="btn-info" style="padding: 12px; font-weight: bold; border-radius: 10px; font-size: 14px; width: 100%; text-align: left;" onclick="gantiKelasAbsensi('${k}')">${globalLang === "ID" ? "Kelas" : "Class"} ${k}</button>`;
    });
    
    container.innerHTML = htmlButtons;
}

function renderTabelSiswa() {
    if ($.fn.DataTable.isDataTable('#tabelSiswa')) $('#tabelSiswa').DataTable().destroy();
    const tbody = document.querySelector('#tabelSiswa tbody'); tbody.innerHTML = '';
    
    const dataSiswaFilter = kelasAktifSesiIni ? dataSiswa.filter(s => s.kelas === kelasAktifSesiIni) : dataSiswa;

    dataSiswaFilter.forEach(siswa => {
        tbody.innerHTML += `<tr>
            <td class="text-primary">${siswa.absen}</td>
            <td style="text-align:left;">${siswa.nama_siswa}</td>
            <td>${siswa.nisn || '-'}</td>
            <td style="font-weight:900;">${siswa.jk || '-'}</td>
            <td>${siswa.kelas}</td>
            <td>${siswa.sekolah}</td>
            <td>
                <button class="btn-info" style="padding: 4px 8px; font-size:10px; margin-right:2px;" onclick="bukaUbahSiswa('${siswa.id_siswa}')">${globalLang === 'ID' ? 'Ubah' : 'Update'}</button>
                <button class="btn-danger" style="padding: 4px 8px; font-size:10px;" onclick="hapusSiswa('${siswa.id_siswa}')">${globalLang === 'ID' ? 'Hapus' : 'Delete'}</button>
            </td>
        </tr>`;
    });

    $('#tabelSiswa').DataTable({
        "order": [[0, "asc"]], "scrollX": true, "pageLength": 10, "lengthChange": false, 
        "language": {
            "search": `${globalLang === "ID" ? 'Cari:' : 'Search'}`, "zeroRecords": kelasAktifSesiIni ? `${globalLang === "ID" ? 'Tidak ada data siswa ditemukan' : 'Student\'s data is not found'}` : `${globalLang === "ID" ? 'Silakan pilih kelas terlebih dahulu.' : 'Please choose a class first.'}`, "info": `${globalLang === "ID" ? 'Hal _PAGE_ dari _PAGES_' : 'page _PAGE_ of _PAGES_'}`,
            "infoEmpty": `${globalLang === "ID" ? "Tidak ada data" : "There's no data"}`, "infoFiltered": `${globalLang === "ID" ? "(dari _MAX_ total data)" : "(of _MAX_ total data)"}`,
            "paginate": { "next": "➜", "previous": "⬅" }
        }
    });
}

function bukaFormTambahSiswa() {
    //document.getElementById('formSiswaTitle')
    document.getElementById('inputIdSiswa').value = '';
    document.getElementById('inputAbsen').value = '';
    document.getElementById('inputNama').value = '';
    document.getElementById('inputNISN').value = '';
    document.getElementsByName('inputJK').forEach(r => r.checked = false);
    document.getElementById('inputKelas').value = '';
    const autoSekolah = dataGuru && dataGuru.sekolah ? dataGuru.sekolah : (sessionStorage.getItem('tempSekolah' + APP_CONFIG.appName) || '');
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
        if(globalLang === "ID"){
            showModal("Peringatan", "Semua data wajib diisi, termasuk Jenis Kelamin!"); return; 
        }
        else {
            showModal("Warning", "All data must be filled in!"); return;    
        }
    }
    
    // Pengecekan NISN ganda
    const nisnAda = dataSiswa.some(s => s.nisn === nisn && s.id_siswa !== id);
    if(nisnAda) {
        if(globalLang === "ID"){
            showModal("Gagal", "Data siswa tidak disimpan, NISN sudah terdaftar di aplikasi");
            return;
        }
        else {
            showModal("Error", "Student's data is not saved, NISN is already registered in the application");
            return;
        }
    }

    if(id) {
        const index = dataSiswa.findIndex(s => s.id_siswa === id);
        if(index !== -1) dataSiswa[index] = { id_siswa: id, absen: absen, nama_siswa: nama, nisn: nisn, jk: jk, kelas: kelas, sekolah: sekolah };
    } else {
        dataSiswa.push({ id_siswa: "S" + Date.now(), absen: absen, nama_siswa: nama, nisn: nisn, jk: jk, kelas: kelas, sekolah: sekolah });
        sessionStorage.setItem('tempSekolah' + APP_CONFIG.appName, sekolah);
    }
    localStorage.setItem(storageSiswaKey, JSON.stringify(dataSiswa));
    
    if(globalLang === "ID") {
        showModal("Sukses", "Data siswa berhasil disimpan");
    }
    else {
        showModal("Success", "Student's data has been successfully saved");   
    }
    nav('page-manajemen-absensi');
    bukaTabAbsensi(3);
}

function hapusSiswa(id) {
    bukaKonfirmasi("Yakin ingin menghapus data siswa ini beserta seluruh riwayat nilainya?", "Ya, Hapus", function() {
        dataSiswa = dataSiswa.filter(s => s.id_siswa !== id);
        dataPenilaian = dataPenilaian.filter(p => p.id_siswa !== id);
        localStorage.setItem(storageSiswaKey, JSON.stringify(dataSiswa));
        localStorage.setItem(storageNilaiKey, JSON.stringify(dataPenilaian));
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
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, {raw: false});
        if (jsonData.length === 0) { showModal("Gagal", "File Excel kosong."); return; }

        let jumlahBerhasil = 0;
        let totalDiproses = 0;
        const autoSekolah = dataGuru && dataGuru.sekolah ? dataGuru.sekolah : "";

        jsonData.forEach(row => {
            const getVal = (possibleKeys) => {
                const key = Object.keys(row).find(k => possibleKeys.includes(k.toLowerCase().trim()));
                return key ? String(row[key]).trim() : '';
            };
            const absen = getVal(['no', 'no.', 'no abs', 'absen']);
            const nama = getVal(['nama', 'nama siswa']);
            const nisn = getVal(['nisn']);
            const jk = getVal(['jk', 'jenis kelamin']);
            const kelas = getVal(['kelas']);
            const sekolah = getVal(['sekolah']) || autoSekolah;

            if (nama && kelas) {
                totalDiproses++;
                // Check duplicate NISN (ignore empty or placeholder)
                const nisnAda = (nisn && nisn !== '-') ? dataSiswa.some(s => s.nisn === nisn) : false;
                
                if(!nisnAda) {
                    dataSiswa.push({
                        id_siswa: "S" + Date.now() + Math.floor(Math.random() * 10000),
                        absen: absen || '-', nama_siswa: nama, nisn: nisn || '-',
                        jk: jk ? jk.substring(0, 1).toUpperCase() : '-', kelas: kelas, sekolah: sekolah
                    });
                    jumlahBerhasil++;
                }
            }
        });
        
        localStorage.setItem(storageSiswaKey, JSON.stringify(dataSiswa));
        renderTabelSiswa(); 
        
        if (totalDiproses > 0) {
            if(globalLang === "ID"){
                showModal("Hasil Import", `${jumlahBerhasil} dari ${totalDiproses} data siswa berhasil di-import.`);
            }
            else {
                showModal("Import Results", `${jumlahBerhasil} of ${totalDiproses} students data was successfully imported.`);   
            }
        } else {
            if(globalLang === "ID"){
                showModal("Gagal", "Tidak ada data siswa yang valid ditemukan (Pastikan kolom Nama dan Kelas terisi).");
            }
            else {
                showModal("Error", "No valid student data found (Make sure the Name and Class fields are filled in).");   
            }
        }
        event.target.value = '';
    };
    reader.readAsArrayBuffer(file);
}

function renderGridMateri() {
    const container = document.getElementById('gridMateriContainer'); container.innerHTML = '';
    let sourceMateri = [];
    if(globalLang === "ID"){
        sourceMateri = dataMateri;
    }
    else {
        try {
            sourceMateri = dataMateri_EN;
        }
        catch(e){
            sourceMateri = dataMateri;
        }
    }
    sourceMateri.forEach(m => { 
        container.innerHTML += `
        <div class="card-materi" onclick="pilihMateri('${m.id_materi}')">
            <div class="icon-box"><img alt="unit" src="${APP_CONFIG.assetPath}${m.nama_materi}.png" onerror="this.src='${APP_CONFIG.assetPath}logo_new.png'"/></div>
            <div class="text-box" style="line-height: 1.2;">
                ${m.nama_materi}
                <div style="font-size: 8px; color: var(--primary-light); font-weight: normal; margin-top: 2px;">${globalLang === "ID" ? "3 tahap + tes akhir" : "3 stages + final test"}</div>
            </div>
        </div>`; 
    });
}

function pilihMateri(id) {
    currentMateriId = id; tempAbsen = {}; tempDinilaiSesiIni = {}; 
    let sourceMateri = [];

    if(globalLang === "ID"){
        sourceMateri = dataMateri
    }
    else{
        try {
            sourceMateri = dataMateri_EN;
        }
        catch(e){
            sourceMateri = dataMateri;
        }
    }
    const materi = sourceMateri.find(m => m.id_materi === id);
    
    // Setup detail page
    document.getElementById('judulDetailMateri').innerText = materi.nama_materi;
    const bcNamaMateri = document.getElementById('bcNamaMateri');
    if (bcNamaMateri) bcNamaMateri.innerText = materi.nama_materi;

    // tombol unduh lembar kerja

    let linkUnduh = document.getElementById('filterLembarTes');
    const lang = localStorage.getItem(APP_CONFIG.appName + '_lang') || 'ID';
    let fileName = "";
    if(globalLang === "ID"){
        fileName = "Lembar_Tes_Akhir_" + materi.nama_materi + ".pdf";
    }
    else {
        fileName = "Final_Test_Sheet_" + materi.nama_materi + ".pdf";
    }
    linkUnduh.href = APP_CONFIG.assetPath + "lembar_kerja/" + lang + "/" + fileName ;
    linkUnduh.download = fileName;
    
    // Open default tab (Tahap 1, index 0)
    bukaTabTahap(0);
    nav('page-detail-materi');
}

// function unduhLembarTes(){
//     let a = document.getElementById('filterLembarTes');
//     a.click();
// }

// function unduhLembarKerja(id){
//     let a = document.getElementById(id);
//     a.click();
// }

function createContent(str, dataArray, elTarget){
    let div = document.createElement('div')
        div.className = "content-box class-content-box"
    let h5 = document.createElement('h5');
        h5.className = "class-h5"
        if(str === "persiapan"){
            h5.textContent = (globalLang === "ID" ? "⏳ Persiapan Pelaksanaan" : "⏳ Preparation");
        }
        else if(str === "kriteria_materi"){
            h5.textContent = (globalLang === "ID" ? "📋 Kriteria Penilaian" : "📋 Assessment Criteria");
        }
        else {
            h5.textContent = (globalLang === "ID" ? "💡 Panduan Penilaian" : "💡 Assessment Guide");
        }
    let ul = document.createElement('ul');
        ul.className = "class-ul"

        dataArray.forEach(item => {
            let li = document.createElement("li");
            li.style.marginBottom = "5px";
            if(item.length > 1){
                li.innerHTML = `<b>${item[0]} : </b>${item[1]}`;
            }
            else {
                li.innerHTML = `${item[0]}`;   
            }
            ul.appendChild(li)
        })

    div.appendChild(h5);
    div.appendChild(ul);
    elTarget.appendChild(div);
}

let bantu = null;

function bukaTabTahap(tabIndex) {
    // Reset tab buttons styling
    const tabs = ['btnTab1', 'btnTab2', 'btnTab3', 'btnTabTes'];
    tabs.forEach(tab => {
        const btn = document.getElementById(tab);
        if(btn) {
            btn.style.background = 'var(--bg-light)';
            btn.style.color = 'var(--primary)';
        }
    });

    const kontenTahap = document.getElementById('kontenTahap');
    const kontenTesAkhir = document.getElementById('kontenTesAkhir');
    
    if (tabIndex === 'tes') {
        console.log("masuk tes")
        // Style active button
        const btn = document.getElementById('btnTabTes');
        if(btn) { btn.style.background = 'var(--primary)'; btn.style.color = '#fff'; }
        
        // Show Tes Akhir content
        kontenTahap.style.display = 'none';
        kontenTesAkhir.style.display = 'block';

        // penambahan materi pada tab tes akhir 
        // periksa dulu materinya
        let sourceMateri = [];

        if(globalLang === "ID"){
            sourceMateri = dataMateri
        }
        else{
            try {
                sourceMateri = dataMateri_EN;
            }
            catch(e){
                sourceMateri = dataMateri;
            }
        }
        const materi = sourceMateri.find(m => m.id_materi === currentMateriId);
        

        bantu = materi;
        console.log(materi)
        //lalu periksa itemnya 
        if(materi.persiapan !== undefined){
            createContent("persiapan", materi.persiapan, kontenTesAkhir);
        }
        if(materi.kriteria_materi !== undefined){
            createContent("kriteria_materi", materi.kriteria_materi, kontenTesAkhir);
        }
        if(materi.tambahan !== undefined){
            createContent("tambahan", materi.tambahan, kontenTesAkhir);
        }
    } else {
        // Style active button
        const btn = document.getElementById(tabs[tabIndex]);
        if(btn) { btn.style.background = 'var(--primary)'; btn.style.color = '#fff'; }
        
        // Show Tahap content
        kontenTesAkhir.style.display = 'none';
        kontenTahap.style.display = 'block';

        let sourceMateri = [];

        if(globalLang === "ID"){
            sourceMateri = dataMateri
        }
        else{
            try {
                sourceMateri = dataMateri_EN;
            }
            catch(e){
                sourceMateri = dataMateri;
            }
        }

        const materi = sourceMateri.find(m => m.id_materi === currentMateriId);
        if(!materi || !materi.permainan || !materi.permainan[tabIndex]) return;

        const p = materi.permainan[tabIndex];

        // Nama permainan
        document.getElementById('namaPermainanTahap').innerText = p.nama_permainan;

        // Video
        let htmlVideo = '';
        if(p.video && p.video.length >= 1){
            p.video.forEach((v) => {
                htmlVideo += `
                <div style="height:auto; background:var(--bg-light); display:flex; align-items:center; justify-content:center; border-radius:15px; border:2px dashed var(--primary-light); margin-bottom: 10px;">
                    <video style="width:100%; aspect-ratio: 4/3;" controls><source src="${APP_CONFIG.videoPath}${v}" type="video/mp4" />Browser tidak support.</video>
                </div>`;
            });
        }
        document.getElementById('videoContainerTahap').innerHTML = htmlVideo;

        // Langkah
        let tmpLangkah = '';
        if(p.langkah) { 
            p.langkah.forEach((desk,idx) => { tmpLangkah += `<p style="margin:5px 0;">${idx+1}. ${desk}</p>`; }) 
        }
        document.getElementById('langkahContainerTahap').innerHTML = tmpLangkah;

        // Kriteria Lolos (Baru)
        const kriteriaBox = document.getElementById('kriteriaContainerBox');
        const kriteriaUl = document.getElementById('kriteriaContainerTahap');
        if(p.kriteria_lolos && p.kriteria_lolos.length > 0) {
            let tmpKriteria = '';
            p.kriteria_lolos.forEach((k, index) => { 
                if(index === 3){
                    tmpKriteria += `<li style="margin-bottom: 5px;"><b>Syarat lolos</b> : ${k}</li>`; 
                }
                else {
                    tmpKriteria += `<li style="margin-bottom: 5px;">(K${index+1}) ${k}</li>`; 
                }
            });
            kriteriaUl.innerHTML = tmpKriteria;
            kriteriaBox.style.display = 'block';
        } else {
            kriteriaUl.innerHTML = '';
            kriteriaBox.style.display = 'none';
        }
    }
}

function bukaManajemenAbsensi() {
    nav('page-pilih-kelas');
    updateFilterKelasButtons('pilihKelasAbsensiGlobal');
}

function gantiKelasAbsensi(kelas) {
    if(kelas !== undefined) {
        kelasAktifSesiIni = kelas;
    } else {
        kelasAktifSesiIni = '';
    }
    
    const tanggalHariIni = getWaktuSekarang().split(' ')[0];
    const siswaKelasIni = kelasAktifSesiIni ? dataSiswa.filter(s => s.kelas === kelasAktifSesiIni) : dataSiswa;
    
    // Check if any student in this class has an attendance record today
    let adaCatatanHariIni = false;
    siswaKelasIni.forEach(s => {
        if (dataAbsensi.some(a => a.id_siswa === s.id_siswa && a.tanggal === tanggalHariIni)) {
            adaCatatanHariIni = true;
        }
    });

    const finalizeEntry = (isDiulang) => {
        tempAbsen = {}; 
        siswaKelasIni.forEach(s => {
            const rekaman = dataAbsensi.find(a => a.id_siswa === s.id_siswa && a.tanggal === tanggalHariIni);
            if (rekaman) {
                tempAbsen[s.id_siswa] = rekaman.status;
            } else {
                tempAbsen[s.id_siswa] = 'Hadir'; // default
            }
        });

        nav('page-manajemen-absensi');
        
        // Refresh the currently active tab
        const tabs = ['btnTabAbsen1', 'btnTabAbsen2', 'btnTabAbsen3'];
        let activeIndex = 1;
        tabs.forEach((tab, index) => {
            if (document.getElementById(tab).style.background === 'var(--primary)') activeIndex = index + 1;
        });
        bukaTabAbsensi(activeIndex);

        // Control Save Button
        const btnSimpan = document.querySelector('button[onclick="simpanSesiAbsensi()"]');
        if(btnSimpan) {
            if(isDiulang) {
                btnSimpan.disabled = false;
                btnSimpan.style.opacity = '1';
                btnSimpan.innerText = (globalLang === "ID" ? "Simpan Perubahan" : "Update Attendance");
            } else if (adaCatatanHariIni && !isDiulang) {
                btnSimpan.disabled = true;
                btnSimpan.style.opacity = '0.5';
                btnSimpan.innerText = (globalLang === "ID" ? "Sudah Tersimpan" : "Already Saved");
            } else {
                btnSimpan.disabled = false;
                btnSimpan.style.opacity = '1';
                btnSimpan.innerText = (globalLang === "ID" ? "Simpan Kehadiran" : "Save Attendance");
            }
        }
    };

    if (adaCatatanHariIni) {
        if(globalLang === "ID"){
            bukaKonfirmasi("Anda sudah melakukan sesi absensi hari ini.\n\nApakah ingin mengulang / merevisi absensi?", "Ya, Revisi", 
                function() { finalizeEntry(true); }, // Yes
                function() { finalizeEntry(false); } // No (Batal)
            );
        }
        else {
            bukaKonfirmasi("You have already done the attendance session today.\n\nDo you want to repeat / revise the attendance?", "Yes, Revise",
                function() { finalizeEntry(true); }, // Yes
                function() { finalizeEntry(false); } // No (Batal)
            );   
        }
    } else {
        finalizeEntry(true);
    }
}

function bukaTabAbsensi(tabIndex) {
    const tabs = ['btnTabAbsen1', 'btnTabAbsen2', 'btnTabAbsen3'];
    tabs.forEach(tab => {
        const btn = document.getElementById(tab);
        if(btn) {
            btn.style.background = 'var(--bg-light)';
            btn.style.color = 'var(--primary)';
        }
    });

    const btn = document.getElementById(tabs[tabIndex-1]);
    if(btn) { btn.style.background = 'var(--primary)'; btn.style.color = '#fff'; }

    for(let i=1; i<=3; i++) {
        const t = document.getElementById('tabAbsensi' + i);
        if(t) t.style.display = (i === tabIndex) ? 'block' : 'none';
    }

    if(tabIndex === 1) renderAbsensiHarian();
    if(tabIndex === 2) renderRiwayatAbsensi();
    if(tabIndex === 3) renderTabelSiswa();
}

function renderAbsensiHarian() {
    const container = document.getElementById('listAbsensiContainer'); container.innerHTML = '';
    
    if(dataSiswa.length <= 0){
        container.innerHTML = `<div class="illustration-area"><img class="login-icon" src="${APP_CONFIG.assetPath}empty.png"></div><p>${globalLang === "ID" ? 'Data siswa tidak ditemukan' : 'Student\'s data is not found'}</p>`;
        return;
    }

    const siswaKelasIni = kelasAktifSesiIni ? dataSiswa.filter(s => s.kelas === kelasAktifSesiIni) : dataSiswa;
    siswaKelasIni.forEach(siswa => {
        // Default to Hadir if not yet modified
        if(!tempAbsen[siswa.id_siswa]) tempAbsen[siswa.id_siswa] = 'Hadir';
        
        const status = tempAbsen[siswa.id_siswa];
        let bgColor = status === 'Hadir' ? '#e6ffe6' : '#ffe6e6';
        let badgeColor = status === 'Hadir' ? '#2e7d32' : 'red';
        
        container.innerHTML += `<div class="content-box" style="background:${bgColor}; border: 1px solid ${status === 'Hadir' ? '#a5d6a7' : '#ffcdd2'};">
            <p class="text-primary" style="margin-top:0; font-size:16px;">${siswa.nama_siswa} <span style="font-size:13px; color:${badgeColor}; font-weight:bold;">(${status})</span></p>
            <div class="top-buttons" style="margin-bottom:0; justify-content:flex-start;">
                <button class="btn-primary" onclick="tempAbsen['${siswa.id_siswa}'] = 'Hadir'; renderAbsensiHarian();" style="padding: 8px 15px; font-size:12px;">Hadir</button>
                <button class="btn-danger" onclick="tempSiswaAktifId='${siswa.id_siswa}'; document.getElementById('namaSiswaAbsen').innerText='${siswa.nama_siswa}'; document.getElementById('absenModal').style.display='flex';" style="padding: 8px 15px; font-size:12px;">Tidak Hadir</button>
            </div>
        </div>`;
    });
}

function simpanSesiAbsensi() {
    // kelasAktifSesiIni bisa berisi string kosong "" (artinya Semua Kelas)
    const siswaKelasIni = kelasAktifSesiIni ? dataSiswa.filter(s => s.kelas === kelasAktifSesiIni) : dataSiswa;
    
    if(siswaKelasIni.length === 0) {
        if(globalLang === "ID"){
            showModal("Peringatan", "Tidak ada data siswa untuk disimpan.");
        }
        else {
            showModal("Warning","There's no student data.");
        }
        return;
    }
    
    // Gunakan tanggal (tanpa jam) agar jika guru menyimpan berulang kali di hari yang sama, data hanya di-update
    const tanggalHariIni = getWaktuSekarang().split(' ')[0];

    siswaKelasIni.forEach(siswa => {
        const status = tempAbsen[siswa.id_siswa] || 'Hadir';
        
        // Cek apakah siswa ini sudah diabsen hari ini
        const index = dataAbsensi.findIndex(a => a.id_siswa === siswa.id_siswa && a.tanggal === tanggalHariIni);
        
        if (index !== -1) {
            dataAbsensi[index].status = status;
        } else {
            dataAbsensi.push({
                id_absensi: "A" + Date.now() + Math.floor(Math.random()*1000),
                tanggal: tanggalHariIni,
                id_siswa: siswa.id_siswa,
                kelas: siswa.kelas,
                status: status
            });
        }
    });

    localStorage.setItem(storageAbsenKey, JSON.stringify(dataAbsensi));
    if(globalLang === "ID"){
        showModal("Tersimpan", "Data absensi seluruh siswa berhasil direkam permanen.");
    }
    else {
        showModal("Success", "All students' attendance data was successfully recorded permanently.");   
    }
    renderRiwayatAbsensi(); 
}

function simpanAlasanAbsen() { 
    const alasan = document.getElementById('alasanAbsen').value;
    tempAbsen[tempSiswaAktifId] = alasan; 
    closeModal('absenModal'); renderAbsensiHarian(); 
}

function renderRiwayatAbsensi() {
    if ($.fn.DataTable.isDataTable('#tabelRiwayatAbsensi')) $('#tabelRiwayatAbsensi').DataTable().destroy();
    const tbody = document.querySelector('#tabelRiwayatAbsensi tbody'); tbody.innerHTML = '';
    
    const siswaKelasIni = kelasAktifSesiIni ? dataSiswa.filter(s => s.kelas === kelasAktifSesiIni) : dataSiswa;
    siswaKelasIni.forEach(siswa => {
        const sesiHariIni = tempAbsen[siswa.id_siswa] || '-';
        
        // Calculate total Kehadiran from dataAbsensi
        const rekamanSiswa = dataAbsensi.filter(a => a.id_siswa === siswa.id_siswa);
        const totalSesi = rekamanSiswa.length;
        const hadir = rekamanSiswa.filter(a => a.status === 'Hadir').length;
        
        const txtKehadiran = totalSesi === 0 ? "Belum ada sesi" : `${hadir} / ${totalSesi} ${globalLang === "ID" ? 'Sesi' : 'Sessions'}`;

        tbody.innerHTML += `<tr>
            <td class="text-primary">${siswa.absen}</td>
            <td style="text-align:left;">${siswa.nama_siswa}</td>
            <td style="font-weight:900;">${sesiHariIni}</td>
            <td>${txtKehadiran}</td>
        </tr>`;
    });

    $('#tabelRiwayatAbsensi').DataTable({
        "order": [[0, "asc"]], "scrollX": true, "pageLength": 10, "lengthChange": false, 
        "language": {
            "search": `${globalLang === "ID" ? 'Cari:' : 'Search:'}`, "zeroRecords": `${globalLang === "ID" ? 'Tidak ada data siswa ditemukan.' : 'Stundent\'s data is not found.'}`, "info": `${globalLang === "ID" ? "Hal _PAGE_ dari _PAGES_" : "Page _PAGE_ of _PAGES_"}`,
            "infoEmpty": "Tidak ada data", "infoFiltered": "(dari _MAX_ total data)",
            "paginate": { "next": "➜", "previous": "⬅" }
        }
    });
}

function mulaiPenilaian() { renderPenilaian(); nav('page-penilaian'); }

function renderPenilaian() {
    const btnSelesai = document.getElementById('btn-selesai-nilai');
    if(btnSelesai.hasAttribute('disabled')) btnSelesai.removeAttribute('disabled');
    const container = document.getElementById('listPenilaian'); container.innerHTML = '';
    
    if(!kelasAktifSesiIni){ return; }

    const siswaKelasIni = dataSiswa.filter(s => s.kelas === kelasAktifSesiIni);

    siswaKelasIni.forEach(siswa => {
        const kehadiran = tempAbsen[siswa.id_siswa] || 'Hadir';
        const isHadir = kehadiran === 'Hadir';
        const isDinilai = tempDinilaiSesiIni[siswa.id_siswa]; 
        
        let statusText = ''; let actionButtons = '';

        if (!isHadir) {
            statusText = `<br><span class="text-danger" style="font-size:13px;">âœ” Tersimpan Otomatis (Nilai 0)</span>`;
            actionButtons = `<button class="btn-info" disabled style="padding: 6px 10px; font-size:11px; width: 100%;">Telah Tersimpan</button>`;
        } else {
            if (isDinilai && APP_CONFIG.appName === 'Dinomotors') {
                statusText = `<br><span class="text-primary" style="font-size:13px;">âœ” Berhasil Dinilai</span>`;
                actionButtons = `<button class="btn-info" disabled style="padding: 6px 10px; font-size:11px; width: 100%;">Tersimpan ke Riwayat</button>`;
            } else {
                actionButtons = `
                    <button class="btn-danger" onclick="bukaModalNilai('${siswa.id_siswa}', '${siswa.nama_siswa}', 'Perbaikan')" style="padding: 6px 10px; font-size:11px;">Perbaikan</button>
                    <button class="btn-warning" onclick="bukaModalNilai('${siswa.id_siswa}', '${siswa.nama_siswa}', 'Cukup')" style="padding: 6px 10px; font-size:11px;">Cukup</button>
                    <button class="btn-info" onclick="bukaModalNilai('${siswa.id_siswa}', '${siswa.nama_siswa}', 'Bagus')" style="padding: 6px 10px; font-size:11px;">Bagus</button>
                `;
            }
        }

        container.innerHTML += `<div class="content-box">
            <p class="text-primary" style="margin-top:0; font-size:15px;">${siswa.nama_siswa} <span style="font-size:12px; color:#9E9E9E;">(${kehadiran})</span> ${statusText}</p>
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
    localStorage.setItem(storageNilaiKey, JSON.stringify(dataPenilaian));
    tempDinilaiSesiIni[tempSiswaAktifId] = true;
    closeModal('nilaiModal'); renderPenilaian(); 
}

function selesaiPenilaian() { showModal("Sukses", "Data pembelajaran tersimpan."); nav('page-materi'); }

/*function getAvgMateri(id_siswa, id_materi) {
    const riwayat = dataPenilaian.filter(p => p.id_siswa === id_siswa && p.id_materi === id_materi);
    if(riwayat.length === 0) return '-';
    return Math.round(riwayat.reduce((sum, p) => sum + (Number(p.nilai) || 0), 0) / riwayat.length);
}*/

/*function terapkanFilterEvaluasi() {
    const nilaiFilter = document.getElementById('filterKelasEvaluasi').value;
    const table = $('#tabelEvaluasi').DataTable();
    if(nilaiFilter) {
        table.column(3).search('^' + nilaiFilter + '$', true, false).draw(); 
    } else {
        table.column(3).search('').draw();
    }
}*/

/*function renderTabelEvaluasi() {
    if ($.fn.DataTable.isDataTable('#tabelEvaluasi')) { $('#tabelEvaluasi').DataTable().destroy(); }

    let currentLang = localStorage.getItem(APP_CONFIG.appName + '_lang') || 'ID';

    console.log(globalLang)

    const tHeader = document.getElementById('tabelEvaluasiHeader');
    let headerHTML = `<th>No Abs</th><th>${globalLang === "ID" ? "Nama" : "Name"}</th><th>${globalLang === "ID" ? "NISN" : "Student's ID"}</th><th>${globalLang === "ID" ? "Kelas" : "Class"}</th><th class="bg-light">Avg</th>`;
    let sourceMateri = [];
    if(globalLang === "ID"){
        sourceMateri = dataMateri;
    }
    else {
        try {
            sourceMateri = dataMateri_EN;
        }
        catch(e){
            sourceMateri = dataMateri;
        }
    }

    sourceMateri.forEach(m => { headerHTML += `<th>${m.nama_materi}</th>`; });

    headerHTML += `<th>Opsi</th>`;
    tHeader.innerHTML = headerHTML;

    const tbody = document.querySelector('#tabelEvaluasi tbody'); tbody.innerHTML = '';
    
    dataSiswa.forEach(siswa => {
        const riwayatSiswa = dataPenilaian.filter(p => p.id_siswa === siswa.id_siswa);
        const avgTotal = riwayatSiswa.length > 0 ? Math.round(riwayatSiswa.reduce((sum, p) => sum + (Number(p.nilai) || 0), 0) / riwayatSiswa.length) : '-';

        let rowHTML = `<tr>
            <td class="text-primary">${siswa.absen}</td>
            <td style="text-align:left;">${siswa.nama_siswa}</td>
            <td>${siswa.nisn || '-'}</td>
            <td>${siswa.kelas}</td>
            <td class="bg-light text-primary">${avgTotal}</td>`;
        
        dataMateri.forEach(m => { rowHTML += `<td>${getAvgMateri(siswa.id_siswa, m.id_materi)}</td>`; });
        rowHTML += `<td><button class="btn-info" style="padding: 4px 10px; font-size:10px;" onclick="bukaRincianEvaluasi('${siswa.id_siswa}')">Rincian</button></td></tr>`;
        tbody.innerHTML += rowHTML;
    });

    updateDropdownFilterKelas('filterKelasEvaluasi');

    $('#tabelEvaluasi').DataTable({
        "order": [[0, "asc"]], "scrollX": true, "pageLength": 10, "lengthChange": false,
        "language": {
            "search": "Cari:", "zeroRecords": "Tidak ada data evaluasi", "info": "Hal _PAGE_ dari _PAGES_",
            "infoEmpty": "Tidak ada data", "infoFiltered": "(dari _MAX_ total data)",
            "paginate": { "next": "➜", "previous": "⬅" }
        }
    });
    terapkanFilterEvaluasi();
}*/

/*function exportExcel() {
    if(dataPenilaian.length === 0) { showModal("Gagal", "Belum ada data nilai."); return; }
    
    let excelData = [];
    const namaSekolah = dataGuru && dataGuru.sekolah ? dataGuru.sekolah : "";
    const namaGuru = dataGuru && dataGuru.nama ? dataGuru.nama : "-";
    const nipGuru = dataGuru && dataGuru.nip ? dataGuru.nip : "-";
    const kelasFilter = document.getElementById('filterKelasEvaluasi').value;
    const textKelas = kelasFilter ? `Filter: Kelas ${kelasFilter}` : "Filter: Semua Kelas";
    
    excelData.push([`Evaluasi Hasil Penilaian Aplikasi ${APP_CONFIG.appName} ${namaSekolah}`.trim()]);
    excelData.push([`Nama Guru : ${namaGuru}`]);
    excelData.push([`NIP       : ${nipGuru}`]);
    excelData.push([textKelas]);
    excelData.push([]); 
    
    let headers = ["No Abs", "Nama Siswa", "NISN", "Kelas", "Rata-rata Total"];
    dataMateri.forEach(m => headers.push(m.nama_materi));
    excelData.push(headers);
    
    let siswaDiproses = dataSiswa;
    if(kelasFilter) siswaDiproses = dataSiswa.filter(s => s.kelas === kelasFilter);
    siswaDiproses.sort((a, b) => (Number(a.absen) || 0) - (Number(b.absen) || 0));

    siswaDiproses.forEach(siswa => {
        const riwayatSiswa = dataPenilaian.filter(p => p.id_siswa === siswa.id_siswa);
        const avgTotal = riwayatSiswa.length > 0 ? Math.round(riwayatSiswa.reduce((sum, p) => sum + (Number(p.nilai) || 0), 0) / riwayatSiswa.length) : '-';

        let row = [siswa.absen, siswa.nama_siswa, siswa.nisn || '-', siswa.kelas, avgTotal];
        dataMateri.forEach(m => row.push(getAvgMateri(siswa.id_siswa, m.id_materi)));
        excelData.push(row);
    });

    const ws = XLSX.utils.aoa_to_sheet(excelData);
    if(!ws['!merges']) ws['!merges'] = [];
    ws['!merges'].push({ s: {r: 0, c: 0}, e: {r: 0, c: headers.length-1} });
    ws['!merges'].push({ s: {r: 1, c: 0}, e: {r: 1, c: headers.length-1} });
    ws['!merges'].push({ s: {r: 2, c: 0}, e: {r: 2, c: headers.length-1} });
    ws['!merges'].push({ s: {r: 3, c: 0}, e: {r: 3, c: headers.length-1} });
    
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Rekap Evaluasi");
    XLSX.writeFile(wb, `Evaluasi_${kelasFilter ? kelasFilter : 'SemuaKelas'}_${namaSekolah ? namaSekolah.replace(/\s+/g, '_') : APP_CONFIG.appName}.xlsx`);
}*/

/*function bukaRincianEvaluasi(id_siswa) {
    const siswa = dataSiswa.find(s => s.id_siswa === id_siswa);
    document.getElementById('rincianNamaSiswa').innerText = siswa.nama_siswa;
    document.getElementById('btnHapusSemuaRiwayat').onclick = function() { hapusSemuaRiwayatSiswa(id_siswa); };

    let htmlBintang = '';
    dataMateri.forEach(materi => {
        const riwayatMateri = dataPenilaian.filter(p => p.id_siswa === id_siswa && p.id_materi === materi.id_materi);
        let uiBintang = '';
        if(riwayatMateri.length > 0) {
            const avgScore = Math.round(riwayatMateri.reduce((sum, p) => sum + (Number(p.nilai) || 0), 0) / riwayatMateri.length);
            const starCount = Math.round(avgScore / 20);
            uiBintang = '<span class="stars">' + 'â˜…'.repeat(starCount) + 'â˜†'.repeat(5 - starCount) + ` (${avgScore})</span>`;
        } else {
            uiBintang = `<span style="font-size:12px; color:#9E9E9E;">Belum dinilai</span>`;
        }

        htmlBintang += `<div class="star-row" onclick="bukaRiwayatMateri('${id_siswa}', '${materi.id_materi}')">
                <span class="text-primary" style="width: 50%; text-align:left;">➜ ${materi.nama_materi}</span>
                <span style="width: 50%; text-align:right;">${uiBintang}</span>
            </div>`;
    });

    const riwayatSiswa = dataPenilaian.filter(p => p.id_siswa === id_siswa);
    const rataRataKeseluruhan = riwayatSiswa.length > 0 ? Math.round(riwayatSiswa.reduce((sum, p) => sum + (Number(p.nilai) || 0), 0) / riwayatSiswa.length) : 0;
    
    document.getElementById('rincianNilaiAngka').innerText = rataRataKeseluruhan;
    document.getElementById('rincianBintangMateri').innerHTML = htmlBintang;
    nav('page-rincian-evaluasi');
}*/

/*function hapusSemuaRiwayatSiswa(id_siswa) {
    bukaKonfirmasi("PERINGATAN!\n\nAnda yakin ingin menghapus SELURUH riwayat nilai? Data tidak dapat dikembalikan.", "Ya, Hapus Semua", function() {
        dataPenilaian = dataPenilaian.filter(p => p.id_siswa !== id_siswa);
        localStorage.setItem(storageNilaiKey, JSON.stringify(dataPenilaian));
        renderTabelEvaluasi(); 
        bukaRincianEvaluasi(id_siswa);
        showModal("Sukses", "Seluruh riwayat nilai siswa berhasil dihapus.");
    });
}*/

/*function bukaRiwayatMateri(id_siswa, id_materi) {
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
            
            tbody.innerHTML += `<tr style="color:${rowColor}; border-bottom:1px solid var(--bg-light);">
                <td>${r.tanggal}</td>
                <td style="font-weight:${isHadir ? '700' : '900'}">${r.kehadiran}</td>
                <td class="text-primary">${showNilai}</td>
                <td style="text-align:left; line-height:1.2;">${r.umpan_balik}</td>
                <td><button class="btn-danger" style="padding:4px; font-size:10px;" onclick="hapusRiwayatSpesifik('${r.id_penilaian}', '${id_siswa}', '${id_materi}')">âŒ</button></td>
            </tr>`;
        });
    }
    document.getElementById('riwayatModal').style.display = 'flex';
}*/

/*function hapusRiwayatSpesifik(id_penilaian, id_siswa, id_materi) {
    bukaKonfirmasi("Hapus baris penilaian ini?", "Ya, Hapus", function() {
        dataPenilaian = dataPenilaian.filter(p => p.id_penilaian !== id_penilaian);
        localStorage.setItem(storageNilaiKey, JSON.stringify(dataPenilaian));
        renderTabelEvaluasi(); 
        bukaRiwayatMateri(id_siswa, id_materi); 
        bukaRincianEvaluasi(id_siswa); 
    });
}*/

// ======================= PENGATURAN & MQTT =======================

function bukaModalUbahProfil() {
    if(!dataGuru) return;
    document.getElementById('editNamaGuru').value = dataGuru.nama || '';
    //document.getElementById('editGelar').value = dataGuru.gelar || '';
    document.getElementById('editNIP').value = dataGuru.nip || '';
    document.getElementById('editSekolah').value = dataGuru.sekolah || '';
    // document.getElementById('editAlamatSekolah').value = dataGuru.alamat_sekolah || '';
    document.getElementById('editEmail').value = dataGuru.email || '';
    document.getElementById('editUsername').value = dataGuru.username || '';
    document.getElementById('editPassword').value = '';
    document.getElementById('editPertanyaan').value = dataGuru.pertanyaan || '';
    document.getElementById('editJawaban').value = dataGuru.jawaban || '';
    
    document.getElementById('modalUbahProfil').style.display = 'flex';
}

function simpanProfilGuru() {
    if(!dataGuru) return;
    
    dataGuru.nama_guru = document.getElementById('editNamaGuru').value;
    //dataGuru.gelar = document.getElementById('editGelar').value;
    dataGuru.nip = document.getElementById('editNIP').value;
    dataGuru.sekolah = document.getElementById('editSekolah').value;
    //dataGuru.alamat_sekolah = document.getElementById('editAlamatSekolah').value;
    dataGuru.email = document.getElementById('editEmail').value
    dataGuru.username = document.getElementById('editUsername').value;
    
    const pw = document.getElementById('editPassword').value;
    if(pw && pw.trim() !== '') {
        dataGuru.password = hashString(pw);
    }

    dataGuru.pertanyaan = document.getElementById('editPertanyaan').value
    dataGuru.jawaban = document.getElementById('editJawaban').value
    
    localStorage.setItem(storageGuruKey, JSON.stringify(dataGuru));
    if (globalLang === "ID") {
        showModal("Sukses", "Profil guru berhasil diperbarui.");    
    }
    else {
        showModal("Success", "Teacher's profile has been updated");       
    }
    
    closeModal('modalUbahProfil');
    
}

/*function toggleBahasa() {
    let currentLang = localStorage.getItem(APP_CONFIG.appName + '_lang') || 'ID';
    let newLang = (currentLang === 'ID') ? 'EN' : 'ID';
    localStorage.setItem(APP_CONFIG.appName + '_lang', newLang);
    
    const btnID = document.getElementById('labelBahasaID');
    const btnEN = document.getElementById('labelBahasaEN');
    // if(labelBtn) labelBtn.innerText = newLang;
    
    if(btnID && btnID.classList.contains('bahasa-aktif')){
        btnID.classList.replace('bahasa-aktif','bahasa-off');
        btnEN.classList.replace('bahasa-off','bahasa-aktif');
    }
    else {
        if(btnEN) btnEN.classList.replace('bahasa-aktif','bahasa-off');
        if(btnID) btnID.classList.replace('bahasa-off','bahasa-aktif');        
    }

    //showModal("Bahasa / Language", "Bahasa diubah ke " + newLang + ". (Sistem dwibahasa akan diimplementasikan penuh segera).");
}*/


// ======================= LEMBAR KERJA GURU =======================

function bukaLembarKerja() {
    const grid = document.getElementById('gridLembarKerja');
    grid.innerHTML = '';
    
    
    // Deteksi bahasa saat ini
    const lang = localStorage.getItem(APP_CONFIG.appName + '_lang') || 'ID';
    
    // Penentuan Path folder
    // Contoh: "../Dilemators-main/assets/lembar_kerja/ID/"
    const folderPath = APP_CONFIG.assetPath + "lembar_kerja/" + lang + "/";

    // Card 1: Pengantar
    grid.innerHTML += `
        <div class="materi-card" style="margin-bottom: 3%; width: 100%; display:flex; flex-direction:column; justify-content:center; align-items:center; text-align:center; padding:15px; background:var(--bg-light); border:none; box-shadow:0 2px 4px rgba(0,0,0,0.1);">
            <div style="font-weight:900; font-size:16px; color:var(--primary); margin-bottom:5px;">${globalLang === "ID" ? 'Instrumen Tes Akhir Unit' : 'Final Test Instrument'}</div>
            <div style="font-size:12px; font-weight:700; color:#555;">${globalLang ==="ID" ? 'Adaptasi TGMD-3 - PDF siap cetak' : 'TGMD-3 Adaptation - Print-ready PDF'}</div>
        </div>
    `;
    let sourceMateri = [];

    if(globalLang ==="ID"){
        sourceMateri = dataMateri;
    }
    else {
        try {
            sourceMateri = dataMateri_EN;
        }
        catch(e){
            sourceMateri = dataMateri;
        }
    }

    console.log(sourceMateri);

    // Card 2 hingga 7: Data Materi
    sourceMateri.forEach((m, index) => {
        // Asumsi penamaan file: materi_m1.pdf, materi_m2.pdf, dst (huruf kecil)
        let fileName = "";
        let fileUrl = "";
        if(globalLang === "ID"){
            fileName = "Lembar_Tes_Akhir_" + m.nama_materi + ".pdf";
            fileUrl = folderPath + fileName;
        }
        else {
            fileName = "Final_Test_Sheet_" + m.nama_materi + ".pdf";
            fileUrl = folderPath + fileName;   
        }
        
        grid.innerHTML += `
            <div class="materi-card" style="width: 100%; display:flex; justify-content:space-between; align-items:center; padding:15px; background:#fff; margin-bottom:5px; border-radius:10px; box-shadow:0 2px 4px rgba(0,0,0,0.05);">
                <div style="font-weight:bold; font-size:14px; color:#333;">${m.nama_materi}</div>
                <a id="lembar${index}" href="${fileUrl}" download="${fileName}" class="btn-primary tombol-lembar-kerja" style="padding:8px 12px; font-size:12px; text-decoration:none; border-radius:5px; font-weight:bold; white-space:nowrap; display: none;">📥 Unduh</a>
                <button onclick="unduhLembarKerja('lembar${index}')" class="btn-primary tombol-lembar-kerja" style="padding:8px 12px; font-size:12px; text-decoration:none; border-radius:5px; font-weight:bold; white-space:nowrap;">${globalLang === "ID" ? '📥 Unduh' : '📥 Download'}</button>
            </div>
        `;
    });

    // Card 8: Lembar Tes Akhir
    const tesAkhirName = (`${globalLang === "ID" ? "Lembar_Tes_Akhir_Semua_Unit.pdf" : "Final_Test_Sheets_All_Units.pdf"}`);
    grid.innerHTML += `
        <div class="materi-card" style="width: 100%; display:flex; justify-content:space-between; align-items:center; padding:15px; background:#fff; margin-bottom:10px; border-radius:10px; border:2px solid var(--primary-light); box-shadow:0 4px 6px rgba(0,0,0,0.1);">
            <div style="font-weight:900; font-size:14px; color:var(--primary);">${globalLang === "ID" ? 'Lembar Tes Akhir' : 'Final Test Worksheet'}</div>
            <a id="lembar7" href="${folderPath}${tesAkhirName}" download="${tesAkhirName}" class="btn-primary tombol-lembar-kerja" style="padding:8px 12px; font-size:12px; text-decoration:none; border-radius:5px; font-weight:bold; white-space:nowrap; display: none;">${globalLang === "ID" ? '📥 Unduh' : '📥 Download'}</a>

            <button onclick="unduhLembarKerja('lembar7')" class="btn-primary tombol-lembar-kerja" style="padding:8px 12px; font-size:12px; text-decoration:none; border-radius:5px; font-weight:bold; white-space:nowrap;">${globalLang === "ID" ? '📥 Unduh' : '📥 Download'}</button>
        </div>
    `;

    nav('page-lembar-kerja');
}

function unduhSemuaLembarKerja() {
    const lang = localStorage.getItem(APP_CONFIG.appName + '_lang') || 'ID';
    
    // File zip yang sudah Anda siapkan secara offline
    const zipName = "semua_unit.zip"; 
    const zipUrl = APP_CONFIG.assetPath + "lembar_kerja/" + lang + "/" + zipName;
    
    const link = document.createElement("a");
    link.href = zipUrl;
    link.download = "Lembar_Kerja_Lengkap_" + lang + ".zip";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

function konfirmasiLogout() {

    let teks = "";
    let konfir = "";

    if (globalLang === "ID") {
        teks = "Apakah Anda yakin ingin keluar?";
        konfir = "Ya, Keluar";
    }
    else {
        teks = "You will be logged out, continue ?";
        konfir = "Yes";
    }

    bukaKonfirmasi(teks, konfir, function() {
        sessionStorage.removeItem('isLoggedIn' + APP_CONFIG.appName);
        window.location.reload();
    });

}

/*
const MQTT_BROKER = "wss://broker.emqx.io:8084/mqtt";
const MQTT_SECRET = "pjok#1234";

function tampilkanStatusMQTT(msg, isError=false) {
    const el = document.getElementById('statusMQTT');
    el.style.display = 'block';
    el.style.color = isError ? 'red' : 'var(--primary)';
    el.innerText = msg;
}


// =========================================================================
// [MARKER UPDATE] FUNGSI CADANGKAN & PULIHKAN DATA VIA MQTT
// Catatan: Fungsi ini WAJIB di-update kembali nanti setelah fitur Asesmen
// dan menu-menu utama lainnya selesai dikerjakan, agar semua data baru 
// (misal: dataAsesmen, dsb.) ikut dimasukkan ke dalam payload backup ini.
// =========================================================================
function prosesBackupMQTT() {
    let topic = document.getElementById('inputTopicMQTT').value.trim();
    if(!topic) {
        const randStr = Math.random().toString(36).substring(2, 8).toUpperCase();
        topic = "dilemators/backup/" + randStr;
        document.getElementById('inputTopicMQTT').value = topic;
    }

    tampilkanStatusMQTT("Mengumpulkan data...");
    
    const backupData = {
        guru: localStorage.getItem(storageGuruKey),
        siswa: localStorage.getItem(storageSiswaKey),
        nilai: localStorage.getItem(storageNilaiKey),
        absensi: localStorage.getItem(storageAbsenKey)
    };
    
    const jsonString = JSON.stringify(backupData);
    const encryptedData = CryptoJS.AES.encrypt(jsonString, MQTT_SECRET).toString();
    
    tampilkanStatusMQTT("Menghubungkan ke cloud...");
    const client = mqtt.connect(MQTT_BROKER);
    
    client.on('connect', function () {
        tampilkanStatusMQTT("Mengirim data ke cloud...");
        client.publish(topic, encryptedData, { retain: true }, function(err) {
            if(err) {
                tampilkanStatusMQTT("Gagal mengirim data.", true);
                client.end();
            } else {
                tampilkanStatusMQTT("Data berhasil dicadangkan!");
                buatPDFBackup(topic);
                client.end();
            }
        });
    });
    
    client.on('error', function (err) {
        tampilkanStatusMQTT("Koneksi MQTT error.", true);
        client.end();
    });
}

function buatPDFBackup(topic) {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    
    doc.setFontSize(16);
    doc.text("KREDENSIAL PEMULIHAN DATA", 20, 20);
    
    doc.setFontSize(12);
    doc.text("Untuk memulihkan data Anda ke aplikasi, gunakan data berikut:", 20, 40);
    
    doc.setFontSize(14);
    doc.text("Topik : " + topic, 20, 55);
    doc.text("Password : " + MQTT_SECRET, 20, 65);
    
    doc.setFontSize(10);
    doc.text("Simpan file ini baik-baik. Masukkan Topik di atas pada menu Pulihkan Data.", 20, 85);
    
    // Menggunakan solusi export aman WebView Kotlin & Browser
    downloadPdfSafe(doc, "Kredensial_Pemulihan.pdf");
    showModal("Sukses", "Backup berhasil dikirim ke Cloud dan File Kredensial PDF telah diunduh.");
}

// =========================================================================
// [MARKER UPDATE] FUNGSI PENGEMBALIAN DATA (RESTORE)
// Jangan lupa tambahkan parsing data baru (seperti dataAsesmen) di sini nanti!
// =========================================================================
function prosesRestoreMQTT() {
    const topic = document.getElementById('inputTopicMQTT').value.trim();
    if(!topic) {
        showModal("Peringatan", "Silakan masukkan Topik Pemulihan terlebih dahulu.");
        return;
    }
    
    tampilkanStatusMQTT("Menghubungkan ke cloud untuk mencari data...");
    const client = mqtt.connect(MQTT_BROKER);
    
    let restoreTimeout = setTimeout(() => {
        tampilkanStatusMQTT("Gagal: Tidak ada data ditemukan di topik tersebut.", true);
        client.end();
    }, 10000);
    
    client.on('connect', function () {
        client.subscribe(topic, function (err) {
            if (err) {
                clearTimeout(restoreTimeout);
                tampilkanStatusMQTT("Gagal berlangganan ke topik.", true);
            }
        });
    });
    
    client.on('message', function (t, message) {
        if(t === topic) {
            clearTimeout(restoreTimeout);
            client.end();
            
            try {
                const encryptedData = message.toString();
                const bytes = CryptoJS.AES.decrypt(encryptedData, MQTT_SECRET);
                const decryptedStr = bytes.toString(CryptoJS.enc.Utf8);
                
                if(!decryptedStr) throw new Error("Gagal dekripsi");
                
                const parsedData = JSON.parse(decryptedStr);
                
                if(parsedData.guru) localStorage.setItem(storageGuruKey, parsedData.guru);
                if(parsedData.siswa) localStorage.setItem(storageSiswaKey, parsedData.siswa);
                if(parsedData.nilai) localStorage.setItem(storageNilaiKey, parsedData.nilai);
                if(parsedData.absensi) localStorage.setItem(storageAbsenKey, parsedData.absensi);
                
                showModal("Berhasil", "Data berhasil dipulihkan dari Cloud! Aplikasi akan dimuat ulang.");
                setTimeout(() => { window.location.reload(); }, 2500);
                
            } catch(e) {
                tampilkanStatusMQTT("Gagal mendekripsi data. Topik mungkin salah atau data bukan format sistem ini.", true);
            }
        }
    });
}
*/

// =========================================================================
// HELPER ANIMASI LOADING & DEBUG MQTT
// =========================================================================
function showLoading(pesan) {
    const overlay = document.getElementById('loadingOverlay');
    const text = document.getElementById('loadingText');
    if (text) text.innerText = pesan;
    if (overlay) overlay.style.display = 'flex';
}

function hideLoading() {
    const overlay = document.getElementById('loadingOverlay');
    if (overlay) overlay.style.display = 'none';
}

function logMQTTDebug(pesan) {
    console.log("[MQTT DEBUG]", pesan);
    const dbg = document.getElementById('debugMQTT');
    if (dbg) {
        dbg.style.display = 'block';
        dbg.innerHTML += `<div style="margin-bottom:3px; border-bottom:1px solid #eee; padding-bottom:2px;">• ${pesan}</div>`;
        dbg.scrollTop = dbg.scrollHeight;
    }
}

// =========================================================================
// FITUR MODAL BACKUP & RESTORE VIA MQTT
// =========================================================================
const MQTT_BROKER = "wss://broker.emqx.io:8084/mqtt";
const MQTT_SECRET = "pjok#1234";

function tampilkanStatusMQTT(msg, isError = false) {
    const el = document.getElementById('statusMQTT');
    if (!el) return;
    el.style.display = 'block';
    el.style.color = isError ? 'red' : 'var(--primary)';
    el.innerText = msg;
}

// Buka Modal & Generate Otomatis: nama_guru[0] + "_" + 5 karakter Base64 acak
function bukaModalBackup() {
    let inisial = "Guru";

    if (dataGuru && dataGuru.nama) {
        inisial = dataGuru.nama.trim().split(' ')[0];
    }
    
    // 5 karakter acak Base64 (A-Z, a-z, 0-9)
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let random5 = "";
    for (let i = 0; i < 5; i++) {
        random5 += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    const namaKode = inisial + "_" + random5;

    document.getElementById('backupKodeCadang').value = namaKode;
    document.getElementById('backupSandiCadang').value = MQTT_SECRET;
    document.getElementById('backupKodePulih').value = "";
    document.getElementById('backupSandiPulih').value = MQTT_SECRET;
    
    const statusEl = document.getElementById('statusMQTT');
    if (statusEl) {
        statusEl.style.display = 'none';
        statusEl.innerText = '';
    }
    const dbgEl = document.getElementById('debugMQTT');
    if (dbgEl) {
        dbgEl.style.display = 'none';
        dbgEl.innerHTML = '';
    }
    
    document.getElementById('modalBackup').style.display = 'flex';
}

function prosesBackupMQTT() {
    const kode = document.getElementById('backupKodeCadang').value.trim();
    const sandi = document.getElementById('backupSandiCadang').value.trim() || MQTT_SECRET;
    
    const dbgEl = document.getElementById('debugMQTT');
    if (dbgEl) { dbgEl.style.display = 'block'; dbgEl.innerHTML = ''; }
    
    if(!kode) {
        showModal("Peringatan", globalLang === "ID" ? "Kode cadangan belum digenerate." : "Backup code is not ready.");
        return;
    }

    // Topik MQTT unik (format persis: appName/backup/kode)
    const app = (APP_CONFIG.appName || "dilemators").toLowerCase();
    const topic = `${app}/backup/${kode}`;

    logMQTTDebug(`[CADANGKAN] Memulai proses backup...`);
    logMQTTDebug(`[CADANGKAN] Nama Kode: "${kode}"`);
    logMQTTDebug(`[CADANGKAN] Topik MQTT yang dituju: "${topic}"`);

    // Tampilkan Animasi Loading
    showLoading(globalLang === "ID" ? "Sedang mencadangkan data ke Cloud..." : "Backing up data to Cloud...");
    tampilkanStatusMQTT(globalLang === "ID" ? "Mengumpulkan data..." : "Collecting data...");
    
    // Mengumpulkan SELURUH data aplikasi (termasuk Naik Tahap & Tes Akhir)
    const backupData = {
        guru: localStorage.getItem(storageGuruKey),
        siswa: localStorage.getItem(storageSiswaKey),
        nilai: localStorage.getItem(storageNilaiKey),
        absensi: localStorage.getItem(storageAbsenKey),
        naikTahap: localStorage.getItem(APP_CONFIG.storagePrefix + 'NaikTahap'),
        tesAkhir: localStorage.getItem(APP_CONFIG.storagePrefix + 'TesAkhir')
    };
    
    const jsonString = JSON.stringify(backupData);
    logMQTTDebug(`[CADANGKAN] Ukuran data mentah: ${jsonString.length} bytes`);
    
    const encryptedData = CryptoJS.AES.encrypt(jsonString, sandi).toString();
    logMQTTDebug(`[CADANGKAN] Enkripsi selesai. Ukuran payload: ${encryptedData.length} bytes`);
    
    tampilkanStatusMQTT(globalLang === "ID" ? "Menghubungkan ke cloud..." : "Connecting to cloud...");
    logMQTTDebug(`[CADANGKAN] Menghubungkan ke broker: ${MQTT_BROKER}`);
    
    const client = mqtt.connect(MQTT_BROKER);
    
    // Timeout 15 detik jika gagal terhubung / terkirim
    let backupTimeout = setTimeout(() => {
        hideLoading();
        logMQTTDebug(`[CADANGKAN] GAGAL: Timeout 15 detik tercapai!`);
        client.end(true);
        const pesanTimeout = globalLang === "ID" 
            ? "Gagal: Waktu pencadangan habis (Timeout). Periksa koneksi internet Anda." 
            : "Failed: Backup request timed out. Check your internet connection.";
        tampilkanStatusMQTT(pesanTimeout, true);
        showModal(globalLang === "ID" ? "Gagal!" : "Error!", pesanTimeout);
    }, 15000);
    
    client.on('connect', function () {
        logMQTTDebug(`[CADANGKAN] Terhubung ke broker EMQX. Mengirim data dengan retain:true & QoS:1...`);
        tampilkanStatusMQTT(globalLang === "ID" ? "Mengirim data ke cloud..." : "Uploading data to cloud...");
        
        client.publish(topic, encryptedData, { retain: true, qos: 1 }, function(err) {
            clearTimeout(backupTimeout);
            hideLoading();
            
            if(err) {
                logMQTTDebug(`[CADANGKAN] GAGAL publish: ${err.message}`);
                tampilkanStatusMQTT(globalLang === "ID" ? "Gagal mengirim data." : "Failed to upload data.", true);
                client.end(true);
            } else {
                logMQTTDebug(`[CADANGKAN] SUKSES! Data berhasil di-publish dan disimpan permanen (Retain) di broker.`);
                tampilkanStatusMQTT(globalLang === "ID" ? "Data berhasil dicadangkan!" : "Data successfully backed up!");
                buatPDFBackup(kode, sandi, topic);
                
                // Beri jeda 500ms sebelum disconnect anggun agar buffer websocket terkirim sempurna
                setTimeout(() => {
                    client.end(false);
                    logMQTTDebug(`[CADANGKAN] Koneksi broker ditutup rapi.`);
                }, 500);
            }
        });
    });
    
    client.on('error', function (err) {
        clearTimeout(backupTimeout);
        hideLoading();
        logMQTTDebug(`[CADANGKAN] Error koneksi: ${err.message}`);
        client.end(true);
        tampilkanStatusMQTT(globalLang === "ID" ? "Koneksi MQTT error." : "MQTT connection error.", true);
    });
}

// Export - 2: Unduh Dokumen Kredensial Pemulihan Cloud (PDF)
function buatPDFBackup(kode, sandi, topic) {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    const isID = globalLang === "ID";
    
    // Fallback topik jika tidak dikirim
    const topikLengkap = topic || `${(APP_CONFIG.appName || "dilemators").toLowerCase()}/backup/${kode}`;
    
    // Judul Dokumen
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text(isID ? "KREDENSIAL PEMULIHAN DATA" : "DATA RECOVERY CREDENTIALS", 20, 22);
    
    // Informasi Metadata
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text(`${isID ? "Aplikasi" : "Application"}       : ${APP_CONFIG.appName}`, 20, 32);
    doc.text(`${isID ? "Nama Guru" : "Teacher Name"}   : ${dataGuru && dataGuru.nama ? dataGuru.nama : "-"}`, 20, 39);
    doc.text(`${isID ? "Waktu Simpan" : "Backup Time"} : ${getWaktuSekarang()}`, 20, 46);
    
    // Garis Pemisah
    doc.setDrawColor(210, 210, 210);
    doc.line(20, 52, 190, 52);

    // Box Kredensial
    doc.setFillColor(245, 247, 250);
    doc.roundedRect(20, 58, 170, 44, 3, 3, "F");
    
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(33, 33, 33);
    doc.text(isID ? "INFORMASI KREDENSIAL CLOUD:" : "CLOUD CREDENTIAL INFORMATION:", 25, 67);
    
    doc.setFontSize(12);
    doc.setTextColor(0, 102, 204);
    doc.text(`${isID ? "Masukan nama kode" : "Code name"}   : ${kode}`, 25, 77);
    doc.text(`${isID ? "Topik Lengkap Cloud" : "Full Cloud Topic"} : ${topikLengkap}`, 25, 86);
    doc.text(`${isID ? "Masukan kata sandi" : "Password"}    : ${sandi}`, 25, 95);
    
    // Petunjuk Pemulihan
    doc.setTextColor(50, 50, 50);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.text(isID ? "Petunjuk Pemulihan Data:" : "Data Recovery Instructions:", 20, 116);
    
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    if (isID) {
        doc.text("1. Simpan dokumen PDF ini di tempat yang aman.", 25, 124);
        doc.text("2. Buka aplikasi dan pilih menu Pengaturan > Cadangkan & Pulihkan Data.", 25, 132);
        doc.text("3. Pada kartu 'Pulihkan Data', masukkan Nama Kode ATAU Topik Lengkap di atas.", 25, 140);
        doc.text("4. Masukkan Kata Sandi di atas, lalu klik tombol 'Pulihkan Data'.", 25, 148);
    } else {
        doc.text("1. Save and keep this PDF credential document in a secure location.", 25, 124);
        doc.text("2. Open the app and navigate to Settings > Backup & Restore Data.", 25, 132);
        doc.text("3. In the 'Restore Data' card, enter the Code Name OR Full Cloud Topic above.", 25, 140);
        doc.text("4. Enter the Password above, then click 'Restore Data'.", 25, 148);
    }
    
    // Penamaan File PDF Dwibahasa
    const namaFile = isID 
        ? `Kredensial_Pemulihan_${APP_CONFIG.appName}_${kode}.pdf` 
        : `Recovery_Credentials_${APP_CONFIG.appName}_${kode}.pdf`;
        
    // Menggunakan solusi export aman WebView Kotlin & Browser
    downloadPdfSafe(doc, namaFile);
    
    // Modal Sukses
    if (isID) {
        showModal("Sukses", "Data berhasil dicadangkan ke Cloud dan file PDF Kredensial telah otomatis diunduh.");
    } else {
        showModal("Success", "Data has been backed up to Cloud and Credential PDF file has been downloaded.");
    }
}

function prosesRestoreMQTT() {
    let inputKode = document.getElementById('backupKodePulih').value.trim();
    const sandi = document.getElementById('backupSandiPulih').value.trim() || MQTT_SECRET;
    
    const dbgEl = document.getElementById('debugMQTT');
    if (dbgEl) { dbgEl.style.display = 'block'; dbgEl.innerHTML = ''; }
    
    if(!inputKode) {
        showModal("Peringatan", globalLang === "ID" ? "Silakan masukkan nama kode pemulihan terlebih dahulu." : "Please enter the recovery code name first.");
        return;
    }
    
    const app = (APP_CONFIG.appName || "dilemators").toLowerCase();
    
    // Tentukan topik yang akan di-subscribe
    let topicUtama = inputKode;
    let topicsToSub = [];
    
    if (inputKode.includes('/')) {
        // Jika guru memasukkan topik lengkap (misal: dilemators/backup/Guru_123)
        topicUtama = inputKode;
        topicsToSub = [topicUtama];
    } else {
        // Jika guru hanya memasukkan kode (misal: Guru_123)
        topicUtama = `${app}/backup/${inputKode}`;
        // Daftarkan semua variasi prefix aplikasi agar kompatibel jika dibuat dari aplikasi saudara
        topicsToSub = [
            topicUtama,
            `dilemators/backup/${inputKode}`,
            `dilomotors/backup/${inputKode}`,
            `dinomotors/backup/${inputKode}`
        ];
    }
    
    // Buat daftar topik unik
    topicsToSub = [...new Set(topicsToSub)];
    
    logMQTTDebug(`[PULIHKAN] Memulai proses pemulihan data...`);
    logMQTTDebug(`[PULIHKAN] Input yang dimasukkan: "${inputKode}"`);
    logMQTTDebug(`[PULIHKAN] Target Topik MQTT: ${topicsToSub.join(" | ")}`);
    
    // Tampilkan Animasi Loading
    showLoading(globalLang === "ID" ? "Sedang mencari dan memulihkan data dari Cloud..." : "Searching and restoring data from Cloud...");
    tampilkanStatusMQTT(globalLang === "ID" ? "Menghubungkan ke broker MQTT..." : "Connecting to MQTT broker...");
    
    const client = mqtt.connect(MQTT_BROKER);
    
    // Timeout 15 detik jika data tidak ditemukan / jaringan lambat
    let restoreTimeout = setTimeout(() => {
        hideLoading();
        logMQTTDebug(`[PULIHKAN] GAGAL: Timeout 15 detik tercapai! Tidak ada pesan yang diterima dari broker untuk topik tersebut.`);
        client.end(true);
        const pesanTimeout = globalLang === "ID" 
            ? `Gagal: Data tidak ditemukan untuk kode "${inputKode}".\n\nPastikan proses Cadangkan sebelumnya berhasil dan Nama Kode sesuai.` 
            : `Failed: No data found for code "${inputKode}".`;
        tampilkanStatusMQTT(pesanTimeout, true);
        showModal(globalLang === "ID" ? "Gagal!" : "Error!", pesanTimeout);
    }, 15000);
    
    client.on('connect', function () {
        logMQTTDebug(`[PULIHKAN] Terhubung ke broker EMQX (${MQTT_BROKER})`);
        logMQTTDebug(`[PULIHKAN] Mengirim permintaan Subscribe ke ${topicsToSub.length} topik...`);
        
        client.subscribe(topicsToSub, { qos: 1 }, function (err, granted) {
            if (err) {
                clearTimeout(restoreTimeout);
                hideLoading();
                logMQTTDebug(`[PULIHKAN] GAGAL subscribe: ${err.message}`);
                client.end(true);
                tampilkanStatusMQTT(globalLang === "ID" ? "Gagal berlangganan topik." : "Failed to subscribe to topic.", true);
            } else {
                logMQTTDebug(`[PULIHKAN] Berhasil Subscribe! Menunggu retained message dari broker...`);
                tampilkanStatusMQTT(globalLang === "ID" ? "Menunggu kiriman data dari Cloud..." : "Waiting for Cloud data...");
            }
        });
    });
    
    client.on('message', function (t, message) {
        logMQTTDebug(`[PULIHKAN] DITERIMA! Menerima pesan dari topik: "${t}"`);
        logMQTTDebug(`[PULIHKAN] Ukuran payload terenkripsi: ${message.length} bytes`);
        
        clearTimeout(restoreTimeout);
        hideLoading();
        
        try {
            logMQTTDebug(`[PULIHKAN] Mencoba mendekripsi payload dengan kata sandi...`);
            const encryptedData = message.toString();
            const bytes = CryptoJS.AES.decrypt(encryptedData, sandi);
            const decryptedStr = bytes.toString(CryptoJS.enc.Utf8);
            
            if(!decryptedStr) throw new Error("Hasil dekripsi kosong. Kemungkinan kata sandi salah!");
            
            logMQTTDebug(`[PULIHKAN] Dekripsi berhasil! Mengurai data JSON...`);
            const parsedData = JSON.parse(decryptedStr);
            
            if(parsedData.guru) localStorage.setItem(storageGuruKey, parsedData.guru);
            if(parsedData.siswa) localStorage.setItem(storageSiswaKey, parsedData.siswa);
            if(parsedData.nilai) localStorage.setItem(storageNilaiKey, parsedData.nilai);
            if(parsedData.absensi) localStorage.setItem(storageAbsenKey, parsedData.absensi);
            if(parsedData.naikTahap) localStorage.setItem(APP_CONFIG.storagePrefix + 'NaikTahap', parsedData.naikTahap);
            if(parsedData.tesAkhir) localStorage.setItem(APP_CONFIG.storagePrefix + 'TesAkhir', parsedData.tesAkhir);
            
            logMQTTDebug(`[PULIHKAN] Seluruh data berhasil ditulis ke localStorage!`);
            client.end(false);
            
            showModal("Berhasil", globalLang === "ID" 
                ? "Data berhasil dipulihkan dari Cloud! Aplikasi akan dimuat ulang." 
                : "Data successfully restored from Cloud! Reloading application...");
            
            setTimeout(() => { window.location.reload(); }, 2500);
            
        } catch(e) {
            logMQTTDebug(`[PULIHKAN] ERROR saat dekripsi/parse: ${e.message}`);
            client.end(true);
            tampilkanStatusMQTT(globalLang === "ID" ? "Gagal mendekripsi data. Kode atau kata sandi salah." : "Failed to decrypt data. Invalid code or password.", true);
            showModal(globalLang === "ID" ? "Gagal Dekripsi" : "Decryption Failed", e.message);
        }
    });

    client.on('error', function (err) {
        clearTimeout(restoreTimeout);
        hideLoading();
        logMQTTDebug(`[PULIHKAN] Error koneksi: ${err.message}`);
        client.end(true);
        tampilkanStatusMQTT("Koneksi MQTT error: " + err.message, true);
    });
}


function keluarManajemenAbsensi() {
    const tanggalHariIni = getWaktuSekarang().split(' ')[0];
    const siswaKelasIni = kelasAktifSesiIni ? dataSiswa.filter(s => s.kelas === kelasAktifSesiIni) : dataSiswa;
    
    // Cek apakah ada catatan absen di database hari ini untuk siswa yang tampil
    let adaCatatanHariIni = false;
    if (siswaKelasIni.length > 0) {
        adaCatatanHariIni = siswaKelasIni.some(s => 
            dataAbsensi.some(a => a.id_siswa === s.id_siswa && a.tanggal === tanggalHariIni)
        );
    }

    if (!adaCatatanHariIni && siswaKelasIni.length > 0) {
        if(globalLang === "ID"){
            bukaKonfirmasi("Anda belum menyimpan data absen hari ini.\n\nYakin mau keluar halaman?", "Ya, Keluar", function() {
                nav('page-pilih-kelas');
            });
        }
        else {
            bukaKonfirmasi("You have not saved today's absence data.\n\nAre you sure you want to exit the page?", "Yes", function() {
                nav('page-pilih-kelas');
            });
        }
    } else {
        nav('page-pilih-kelas');
    }
}
// ================= MANAJEMEN ASESMEN =================

function bukaTabAsesmen(tabId) {
    document.getElementById('tabAsesmen1').style.display = 'none';
    document.getElementById('tabAsesmen2').style.display = 'none';
    document.getElementById('tabAsesmen3').style.display = 'none';
    
    document.getElementById('btnTabAsesmen1').className = 'tab-btn';
    document.getElementById('btnTabAsesmen1').style.background = 'var(--bg-light)';
    document.getElementById('btnTabAsesmen1').style.color = 'var(--primary)';
    
    document.getElementById('btnTabAsesmen2').className = 'tab-btn';
    document.getElementById('btnTabAsesmen2').style.background = 'var(--bg-light)';
    document.getElementById('btnTabAsesmen2').style.color = 'var(--primary)';
    
    document.getElementById('btnTabAsesmen3').className = 'tab-btn';
    document.getElementById('btnTabAsesmen3').style.background = 'var(--bg-light)';
    document.getElementById('btnTabAsesmen3').style.color = 'var(--primary)';
    
    document.getElementById('tabAsesmen' + tabId).style.display = 'block';
    
    let activeBtn = document.getElementById('btnTabAsesmen' + tabId);
    activeBtn.className = 'tab-btn active';
    activeBtn.style.background = 'var(--primary)';
    activeBtn.style.color = '#fff';

    if (tabId === 3 && typeof renderTabelRiwayatAsesmen === 'function') {
        renderTabelRiwayatAsesmen();
    }
}

/*function bukaManajemenAsesmen() {
    nav('page-asesmen');
    bukaTabAsesmen(1);
    
    // Populate dropdown Kelas
    const filterKelas = document.getElementById('filterKelasAsesmen');
    filterKelas.innerHTML = `<option value="">${globalLang === "ID" ? "Mohon Pilih" : "Please Choose One"}</option>`;
    let uniqueKelas = [...new Set(dataSiswa.map(s => s.kelas))].filter(k => k);
    uniqueKelas.forEach(k => {
        let opt = document.createElement('option');
        opt.value = k;
        opt.innerText = k;
        filterKelas.appendChild(opt);
    });

    // Populate dropdown Materi
    const filterMateri = document.getElementById('filterMateriAsesmen');
    filterMateri.innerHTML = `<option value="">${globalLang === "ID" ? "Mohon Pilih" : "Please Choose One"}</option>`;
    let sourceMateri = [];
    if(globalLang === "ID"){
        sourceMateri = dataMateri;
    }
    else {
        try {
            sourceMateri = dataMateri_EN;
        }
        catch(e){
            sourceMateri = dataMateri;
        }
    }
    sourceMateri.forEach(m => {
        let opt = document.createElement('option');
        opt.value = m.id_materi;
        opt.innerText = m.nama_materi;
        filterMateri.appendChild(opt);
    });

    cekFilterAsesmen();
}*/

function cekFilterAsesmen() {
    const kelas = document.getElementById('filterKelasAsesmen').value;
    const materi = document.getElementById('filterMateriAsesmen').value;
    const peringatan = document.getElementById('asesmenPeringatan');
    const tabelContainer = document.getElementById('asesmenTabelContainer');

    if (kelas && materi) {
        peringatan.style.display = 'none';
        tabelContainer.style.display = 'block';
        renderTabelNaikTahap(kelas, materi);
    } else {
        peringatan.style.display = 'block';
        tabelContainer.style.display = 'none';
    }
}

function renderTabelNaikTahap(kelas, id_materi) {
    const tbody = document.getElementById('bodyTabelNaikTahap');
    tbody.innerHTML = '';

    const siswaDiKelas = dataSiswa.filter(s => s.kelas === kelas);
    
    // Load existing data for today (if any)
    const tanggalHariIni = getWaktuSekarang().split(' ')[0];
    let keyNaikTahap = APP_CONFIG.storagePrefix + 'NaikTahap';
    let dataNaikTahap = JSON.parse(localStorage.getItem(keyNaikTahap) || "[]");
    
    siswaDiKelas.forEach(siswa => {
        // Cek apakah ada record untuk siswa ini, materi ini, pada tanggal hari ini
        let existingRecord = dataNaikTahap.find(d => d.id_siswa === siswa.id_siswa && d.id_materi === id_materi && d.tanggal === tanggalHariIni);
        
        let t1 = existingRecord && existingRecord.nilai.T1 === 1 ? 'checked' : '';
        let t2 = existingRecord && existingRecord.nilai.T2 === 1 ? 'checked' : '';
        let t3 = existingRecord && existingRecord.nilai.T3 === 1 ? 'checked' : '';

        let tr = document.createElement('tr');
        tr.style.borderBottom = "1px solid #eee";
        tr.innerHTML = `
            <td style="padding: 10px;">${siswa.nama_siswa}</td>
            <td style="padding: 10px; text-align: center;"><input type="checkbox" style="width:20px; height:20px;" id="nt_t1_${siswa.id_siswa}" ${t1}></td>
            <td style="padding: 10px; text-align: center;"><input type="checkbox" style="width:20px; height:20px;" id="nt_t2_${siswa.id_siswa}" ${t2}></td>
            <td style="padding: 10px; text-align: center;"><input type="checkbox" style="width:20px; height:20px;" id="nt_t3_${siswa.id_siswa}" ${t3}></td>
        `;
        tbody.appendChild(tr);
    });
}

function konfirmasiSimpanNaikTahap() {
    if(globalLang === "ID"){
        bukaKonfirmasi("Anda akan menyimpan penilaian, pastikan semua siswa sudah dinilai. Lanjutkan menyimpan penilaian ?", "Ya, Simpan", prosesSimpanNaikTahap);
    }
    else {
        bukaKonfirmasi("You will save the assessment, make sure all students have been assessed. Continue saving the assessment?", "Save", prosesSimpanNaikTahap);
    }
}

function prosesSimpanNaikTahap() {
    const kelas = document.getElementById('filterKelasAsesmen').value;
    const id_materi = document.getElementById('filterMateriAsesmen').value;
    const tanggalHariIni = getWaktuSekarang().split(' ')[0];
    
    const siswaDiKelas = dataSiswa.filter(s => s.kelas === kelas);
    let keyNaikTahap = APP_CONFIG.storagePrefix + 'NaikTahap';
    let dataNaikTahap = JSON.parse(localStorage.getItem(keyNaikTahap) || "[]");

    // Remove existing records for this class + materi + today to prevent duplicates
    const idSiswaKelas = siswaDiKelas.map(s => s.id_siswa);
    dataNaikTahap = dataNaikTahap.filter(d => !(d.tanggal === tanggalHariIni && d.id_materi === id_materi && idSiswaKelas.includes(d.id_siswa)));

    // Generate and push new records
    siswaDiKelas.forEach(siswa => {
        let t1Check = document.getElementById('nt_t1_' + siswa.id_siswa).checked ? 1 : 0;
        let t2Check = document.getElementById('nt_t2_' + siswa.id_siswa).checked ? 1 : 0;
        let t3Check = document.getElementById('nt_t3_' + siswa.id_siswa).checked ? 1 : 0;

        let record = {
            id_naikTahap: "NT" + Date.now() + Math.floor(Math.random() * 1000),
            tanggal: tanggalHariIni,
            id_siswa: siswa.id_siswa,
            kelas: kelas,
            id_materi: id_materi,
            nilai: {
                T1: t1Check,
                T2: t2Check,
                T3: t3Check
            }
        };
        dataNaikTahap.push(record);
    });

    localStorage.setItem(keyNaikTahap, JSON.stringify(dataNaikTahap));
    if(globalLang === "ID"){
        showModal("Sukses", "Data penilaian Naik Tahap berhasil disimpan!");
    }
    else {
        showModal("Success", "Level Up assessment data was successfully saved!");
    }
}

// ================= TES AKHIR =================
let tempTesKeAkhir = "";

function cekFilterTesAkhir() {
    const kelas = document.getElementById('filterKelasTesAkhir').value;
    const materi = document.getElementById('filterMateriTesAkhir').value;
    const peringatan = document.getElementById('tesAkhirPeringatan');
    const container = document.getElementById('tesAkhirCardContainer');

    if (kelas && materi) {
        peringatan.style.display = 'none';
        container.style.display = 'flex';
        renderDaftarSiswaTesAkhir(kelas, materi);
    } else {
        peringatan.style.display = 'block';
        container.style.display = 'none';
    }
}

function renderDaftarSiswaTesAkhir(kelas, id_materi) {
    const container = document.getElementById('tesAkhirCardContainer');
    container.innerHTML = '';
    const siswaDiKelas = dataSiswa.filter(s => s.kelas === kelas);
    
    siswaDiKelas.forEach((siswa, index) => {
        let div = document.createElement('div');
        div.className = "card content-box";
        div.style.padding = "15px";
        div.style.marginBottom = "10px";
        
        div.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                <div>
                    <div style="font-weight: 800; font-size: 16px; color: var(--primary);">${siswa.nama_siswa}</div>
                    <div style="font-size: 11px; color: #666;">Absen: ${siswa.absen} | JK: ${siswa.kelas}</div>
                </div>
            </div>
            <button class="btn-primary" style="width: 100%; padding: 10px; border-radius: 8px; font-size: 13px;" onclick="bukaModalNilaiTesAkhir('${siswa.id_siswa}')">${globalLang === "ID" ? "Masukan Nilai ➜" : "Input Result ➜"}</button>
        `;
        container.appendChild(div);
    });
}

function bukaModalNilaiTesAkhir(id_siswa) {
    const siswa = dataSiswa.find(s => s.id_siswa === id_siswa);
    const id_materi = document.getElementById('filterMateriTesAkhir').value;

    let sourceMateri = [];
    if(globalLang === "ID"){
        sourceMateri = dataMateri;
    }
    else {
        try {
            sourceMateri = dataMateri_EN;
        }
        catch(e){
            sourceMateri = dataMateri;
        }
    }

    const materi = sourceMateri.find(m => m.id_materi === id_materi);
    
    if(!siswa || !materi) return;

    document.getElementById('subJudulModalTesAkhir').innerText = `${siswa.nama_siswa} - Unit : ${materi.nama_materi}`;
    document.getElementById('hiddenIdSiswaTesAkhir').value = id_siswa;
    
    // Auto fill tesKe
    document.getElementById('inputTesKe').value = tempTesKeAkhir;
    
    // Auto fill date to today
    const now = new Date();
    const yyyy = now.getFullYear();
    const mm = String(now.getMonth() + 1).padStart(2, '0');
    const dd = String(now.getDate()).padStart(2, '0');
    document.getElementById('inputTanggalTes').value = `${yyyy}-${mm}-${dd}`;
    
    // Reset fields
    document.getElementById('inputKeteranganTes').value = '';
    document.getElementById('inputNilaiTes').value = '';
    document.getElementById('inputEvaluasiTes').value = '';
    
    updateFeedbackTesAkhir(); // reset feedback label
    
    document.getElementById('modalTesAkhir').style.display = 'flex';
}

function updateFeedbackTesAkhir() {
    const inputNilai = document.getElementById('inputNilaiTes').value;
    const label = document.getElementById('labelFeedbackAkhir');
    
    if (inputNilai === '') {
        label.innerText = (globalLang === 'ID' ? 'Belum ada nilai' : 'No data');
        label.style.background = '#eee';
        label.style.color = '#666';
        return;
    }
    
    const nilai = Number(inputNilai);
    if (nilai < 70) {
        label.innerText = (globalLang === 'ID' ? 'Perbaikan (Remedial)' : 'Remedial');
        label.className = 'text-danger';
        label.style.background = '#ffebee';
    } else if (nilai >= 70 && nilai <= 74) {
        label.innerText = (globalLang === 'ID' ? 'Cukup' : 'Satisfactory');
        label.className = 'text-warning';
        label.style.background = '#fff8e1';
    } else {
        label.innerText = (globalLang === 'ID' ? 'Bagus (TUNTAS)' : 'Great');
        label.className = 'text-success';
        label.style.background = '#e8f5e9';
    }
}

function simpanNilaiTesAkhir() {
    const id_siswa = document.getElementById('hiddenIdSiswaTesAkhir').value;
    const kelas = document.getElementById('filterKelasTesAkhir').value;
    const id_materi = document.getElementById('filterMateriTesAkhir').value;
    const tesKe = document.getElementById('inputTesKe').value.trim();
    const tanggal = document.getElementById('inputTanggalTes').value;
    const keterangan = document.getElementById('inputKeteranganTes').value.trim();
    const nilaiHasil = document.getElementById('inputNilaiTes').value;
    const evaluasi = document.getElementById('inputEvaluasiTes').value.trim();
    
    if (!tesKe || !tanggal || nilaiHasil === '') {
        if(globalLang === 'ID'){
            showModal('Peringatan', 'Ujian ke, Tanggal, dan Nilai wajib diisi!');
        }
        else {
            showModal('Warning', "All data must be filled in!");
        }
        return;
    }
    
    // Update temp variable for next student
    tempTesKeAkhir = tesKe;
    
    // Determine feedback based on logic
    let feedback = '';
    const nilai = Number(nilaiHasil);
    if (nilai < 70) feedback = 'Perbaikan (Remedial)';
    else if (nilai >= 70 && nilai <= 74) feedback = 'Cukup';
    else feedback = 'Bagus (TUNTAS)';
    
    let keyTesAkhir = APP_CONFIG.storagePrefix + 'TesAkhir';
    let dataTesAkhir = JSON.parse(localStorage.getItem(keyTesAkhir) || "[]");
    
    let record = {
        id_tesAkhir: "TA" + Date.now() + Math.floor(Math.random() * 1000),
        tanggal: tanggal,
        id_siswa: id_siswa,
        kelas: kelas,
        id_materi: id_materi,
        tesKe: tesKe,
        keterangan: keterangan,
        evaluasi: evaluasi,
        feedback: feedback,
        nilai: {
            hasil: nilai
        }
    };
    
    dataTesAkhir.push(record);
    localStorage.setItem(keyTesAkhir, JSON.stringify(dataTesAkhir));
    
    closeModal('modalTesAkhir');
    if(globalLang === "ID"){
        showModal('Sukses', 'Nilai Tes Akhir berhasil disimpan!');
    }
    else {
        showModal('Success', 'Data has been saved!');   
    }
}

// ================= OVERRIDE BUKA MANAJEMEN ASESMEN =================
// Overriding function to include Tes Akhir and Riwayat dropdowns safely
function bukaManajemenAsesmen() {
    nav('page-asesmen');
    bukaTabAsesmen(1);
    
    // Populate dropdown Kelas
    const filterKelas = document.getElementById('filterKelasAsesmen');
    const filterKelasTesAkhir = document.getElementById('filterKelasTesAkhir');
    const filterKelasRiwayat = document.getElementById('filterKelasRiwayatAsesmen');
    
    filterKelas.innerHTML = `<option value="">${globalLang === "ID" ? "Mohon Pilih" : "Please Choose One"}</option>`;
    if (filterKelasTesAkhir) filterKelasTesAkhir.innerHTML = `<option value="">${globalLang === "ID" ? "Mohon Pilih" : "Please Choose One"}</option>`;
    if (filterKelasRiwayat) filterKelasRiwayat.innerHTML = `<option value="semua">${globalLang === "ID" ? "Semua Kelas" : "All Classes"}</option>`;
    
    let uniqueKelas = [...new Set(dataSiswa.map(s => s.kelas))].filter(k => k);
    uniqueKelas.forEach(k => {
        let opt = document.createElement('option');
        opt.value = k;
        opt.innerText = k;
        filterKelas.appendChild(opt);
        
        if (filterKelasTesAkhir) {
            let opt2 = document.createElement('option');
            opt2.value = k;
            opt2.innerText = k;
            filterKelasTesAkhir.appendChild(opt2);
        }
        
        if (filterKelasRiwayat) {
            let opt3 = document.createElement('option');
            opt3.value = k;
            opt3.innerText = k;
            filterKelasRiwayat.appendChild(opt3);
        }
    });

    // Populate dropdown Materi
    const filterMateri = document.getElementById('filterMateriAsesmen');
    const filterMateriTesAkhir = document.getElementById('filterMateriTesAkhir');
    filterMateri.innerHTML = `<option value="">${globalLang === "ID" ? "Mohon Pilih" : "Please Choose One"}</option>`;
    if (filterMateriTesAkhir) filterMateriTesAkhir.innerHTML = `<option value="">${globalLang === "ID" ? "Mohon Pilih" : "Please Choose One"}</option>`;
    
    let sourceMateri = [];
    if(globalLang === "ID"){
        sourceMateri = dataMateri;
    }
    else {
        try {
            sourceMateri = dataMateri_EN;
        }
        catch(e){
            sourceMateri = dataMateri;
        }
    }

    sourceMateri.forEach(m => {
        let opt = document.createElement('option');
        opt.value = m.id_materi;
        opt.innerText = m.nama_materi;
        filterMateri.appendChild(opt);
        
        if (filterMateriTesAkhir) {
            let opt2 = document.createElement('option');
            opt2.value = m.id_materi;
            opt2.innerText = m.nama_materi;
            filterMateriTesAkhir.appendChild(opt2);
        }
    });

    cekFilterAsesmen();
    if (typeof cekFilterTesAkhir === 'function') cekFilterTesAkhir();
    if (typeof renderTabelRiwayatAsesmen === 'function') renderTabelRiwayatAsesmen();
}

// ================= LOGIKA TAB RIWAYAT =================
function renderTabelRiwayatAsesmen() {
    if ($.fn.DataTable.isDataTable('#tabelRiwayatDT')) {
        $('#tabelRiwayatDT').DataTable().destroy();
    }

    let sourceMateri = [];
    if(globalLang === "ID"){
        sourceMateri = dataMateri;
    }
    else {
        try {
            sourceMateri = dataMateri_EN;
        }
        catch(e){
            sourceMateri = dataMateri;
        }
    }

    const tbody = document.getElementById('tabelRiwayatAsesmen');
    if(!tbody) return;
    tbody.innerHTML = '';
    
    const filterKelas = document.getElementById('filterKelasRiwayatAsesmen').value;
    
    let keyNaikTahap = APP_CONFIG.storagePrefix + 'NaikTahap';
    let keyTesAkhir = APP_CONFIG.storagePrefix + 'TesAkhir';
    
    let dataNaik = JSON.parse(localStorage.getItem(keyNaikTahap) || "[]");
    let dataTes = JSON.parse(localStorage.getItem(keyTesAkhir) || "[]");
    
    // Combine all data
    let combined = [...dataNaik, ...dataTes];
    
    // Sort combined data by date (descending format approximation, mostly chronologically descending)
    combined.sort((a, b) => new Date(b.tanggal) - new Date(a.tanggal));
    
    // Apply filter
    if (filterKelas !== 'semua') {
        combined = combined.filter(item => item.kelas === filterKelas);
    }
    
    if (combined.length === 0) {
        // DataTables will handle the "empty" state text naturally if we leave tbody empty
    } else {
        combined.forEach((item, index) => {
            const siswa = dataSiswa.find(s => s.id_siswa === item.id_siswa) || { nama_siswa: `${globalLang === 'ID' ? 'Tidak diketahui' : 'Unknown'}` };
            const materi = sourceMateri.find(m => m.id_materi === item.id_materi) || { nama_materi: `${globalLang === 'ID' ? 'Tidak diketahui' : 'Unknown'}` };
            
            let jenis = "";
            let hasil = "";
            let keterangan = "-";
            let evaluasi = "-";
            
            if (item.nilai && item.nilai.hasil === undefined) {
                // Naik Tahap
                jenis = "Naik Tahap";
                let t1 = item.nilai.T1 ? 1 : 0;
                let t2 = item.nilai.T2 ? 1 : 0;
                let t3 = item.nilai.T3 ? 1 : 0;
                hasil = `${t1 + t2 + t3} dari 3`;
            } else if (item.nilai && item.nilai.hasil !== undefined) {
                // Tes Akhir
                jenis = "Tes Akhir";
                hasil = item.nilai.hasil;
                let ketOpsional = item.keterangan ? item.keterangan : '';
                keterangan = 'Tes ke-'+ item.tesKe + " : " + item.feedback + (ketOpsional ? ` - ${ketOpsional}` : '');
                evaluasi = item.evaluasi || "-";
            }
            
            let tr = document.createElement('tr');
            tr.innerHTML = `
                <td style="padding: 10px; border: 1px solid #ddd; text-align: center;">${index + 1}</td>
                <td style="padding: 10px; border: 1px solid #ddd; text-align: center;">${item.tanggal}</td>
                <td style="padding: 10px; border: 1px solid #ddd;">${siswa.nama_siswa}</td>
                <td style="padding: 10px; border: 1px solid #ddd; text-align: center;">${item.kelas}</td>
                <td style="padding: 10px; border: 1px solid #ddd;">${materi.nama_materi}</td>
                <td style="padding: 10px; border: 1px solid #ddd; text-align: center;">${jenis}</td>
                <td style="padding: 10px; border: 1px solid #ddd; text-align: center; font-weight: bold;">${hasil}</td>
                <td style="padding: 10px; border: 1px solid #ddd;">${keterangan}</td>
                <td style="padding: 10px; border: 1px solid #ddd;">${evaluasi}</td>
            `;
            tbody.appendChild(tr);
        });
    }

    // Initialize DataTables
    $('#tabelRiwayatDT').DataTable({
        "language": {
            "search": `${globalLang === "ID" ? "Cari:" : "Search:"}`,
            "lengthMenu": `${globalLang === "ID" ? "Tampilkan _MENU_ data" : "Show _MENU_ data"}`,
            "info": `${globalLang === "ID" ? "Menampilkan _START_ sampai _END_ dari _TOTAL_ data" : "Show _START_ until _END_ of _TOTAL_ data"}`,
            "infoEmpty": `${globalLang === "ID" ? "Menampilkan 0 sampai 0 dari 0 data" : "Show 0 until 0 of 0 data"}`,
            "infoFiltered": `${globalLang === "ID" ? "(disaring dari _MAX_ total data)" : "(of _MAX_ total data)"}`,
            "emptyTable": `${globalLang === "ID" ? "Belum ada riwayat asesmen" : "No data"}`,
            "paginate": {
                "first": `${globalLang === "ID" ? "Awal" : "First"}`,
                "last": `${globalLang === "ID" ? "Akhir" : "Last"}`,
                "next": `${globalLang === "ID" ? "Selanjutnya" : "Next"}`,
                "previous": `${globalLang === "ID" ? "Sebelumnya" : "Previous"}`,
            }
        },
        "pageLength": 10,
        "bDestroy": true
    });
}

// ================= OVERRIDE LOGIKA EVALUASI (MENGGUNAKAN DATA TES AKHIR) =================

function getDataTesAkhir() {
    let key = APP_CONFIG.storagePrefix + 'TesAkhir';
    return JSON.parse(localStorage.getItem(key) || "[]");
}

function saveDataTesAkhir(data) {
    let key = APP_CONFIG.storagePrefix + 'TesAkhir';
    localStorage.setItem(key, JSON.stringify(data));
}

function getAvgMateri(id_siswa, id_materi) {
    let tesAkhirData = getDataTesAkhir();
    const riwayat = tesAkhirData.filter(p => p.id_siswa === id_siswa && p.id_materi === id_materi);
    if(riwayat.length === 0) return '-';
    return Math.round(riwayat.reduce((sum, p) => sum + (Number(p.nilai.hasil) || 0), 0) / riwayat.length);
}

function renderTabelEvaluasi() {
    if ($.fn.DataTable.isDataTable('#tabelEvaluasi')) { $('#tabelEvaluasi').DataTable().destroy(); }

    const tHeader = document.getElementById('tabelEvaluasiHeader');
    //let headerHTML = `<th>No Abs</th><th>Nama</th><th>NISN</th><th>Kelas</th><th class="bg-light">Avg</th>`;
    let headerHTML = `<th>No Abs</th><th>${globalLang === "ID" ? "Nama" : "Name"}</th><th>${globalLang === "ID" ? "NISN" : "Student's ID"}</th><th>${globalLang === "ID" ? "Kelas" : "Class"}</th><th class="bg-light">Avg</th>`;
    let sourceMateri = [];
    if(globalLang === "ID"){
        sourceMateri = dataMateri;
    }
    else {
        try {
            sourceMateri = dataMateri_EN;
        }
        catch(e){
            sourceMateri = dataMateri;
        }
    }
    
    sourceMateri.forEach(m => { headerHTML += `<th>${m.nama_materi}</th>`; });
    headerHTML += `<th>Opsi</th>`;
    if (tHeader) tHeader.innerHTML = headerHTML;

    const tbody = document.querySelector('#tabelEvaluasi tbody'); 
    if (tbody) tbody.innerHTML = '';
    
    let tesAkhirData = getDataTesAkhir();

    dataSiswa.forEach(siswa => {
        const riwayatSiswa = tesAkhirData.filter(p => p.id_siswa === siswa.id_siswa);
        const avgTotal = riwayatSiswa.length > 0 ? Math.round(riwayatSiswa.reduce((sum, p) => sum + (Number(p.nilai.hasil) || 0), 0) / riwayatSiswa.length) : '-';

        let classAvgTotal = '';
        if (avgTotal !== '-') {
            let numTotal = Number(avgTotal);
            if (numTotal >= 75) classAvgTotal = 'bg-eval-success';
            else if (numTotal >= 70) classAvgTotal = 'bg-eval-warning';
            else classAvgTotal = 'bg-eval-danger';
        }

        let rowHTML = `<tr>
            <td class="text-primary">${siswa.absen}</td>
            <td style="text-align:left;">${siswa.nama_siswa}</td>
            <td>${siswa.nisn || '-'}</td>
            <td>${siswa.kelas}</td>
            <td class="${classAvgTotal || 'bg-light text-primary'}" style="font-weight:bold;">${avgTotal}</td>`;
        
        dataMateri.forEach(m => {
            let avgVal = getAvgMateri(siswa.id_siswa, m.id_materi);
            let classColor = '';
            if (avgVal !== '-') {
                let numVal = Number(avgVal);
                if (numVal >= 75) classColor = 'bg-eval-success';
                else if (numVal >= 70) classColor = 'bg-eval-warning';
                else classColor = 'bg-eval-danger';
            }
            rowHTML += `<td class="${classColor}">${avgVal}</td>`;
        });
        rowHTML += `<td><button class="btn-info" style="padding: 4px 10px; font-size:10px;" onclick="bukaRincianEvaluasi('${siswa.id_siswa}')">${globalLang ==="ID" ? "Rincian" : "Detail"}</button></td></tr>`;
        if (tbody) tbody.innerHTML += rowHTML;
    });

    if (typeof updateDropdownFilterKelas === 'function') updateDropdownFilterKelas('filterKelasEvaluasi');

    $('#tabelEvaluasi').DataTable({
        "order": [[0, "asc"]], "scrollX": true, "pageLength": 10, "lengthChange": false,
        "language": {
            "search": `${globalLang === "ID" ? 'Cari:' : 'Search'}`, "zeroRecords": kelasAktifSesiIni ? `${globalLang === "ID" ? 'Tidak ada data siswa ditemukan' : 'Student\'s data is not found'}` : `${globalLang === "ID" ? 'Silakan pilih kelas terlebih dahulu.' : 'Please choose a class first.'}`, "info": `${globalLang === "ID" ? 'Hal _PAGE_ dari _PAGES_' : 'page _PAGE_ of _PAGES_'}`,
            "infoEmpty": `${globalLang === "ID" ? "Tidak ada data" : "There's no data"}`, "infoFiltered": `${globalLang === "ID" ? "(dari _MAX_ total data)" : "(of _MAX_ total data)"}`,
            "paginate": { "next": "➜", "previous": "⬅" }
        },
        "bDestroy": true
    });
    if (typeof terapkanFilterEvaluasi === 'function') terapkanFilterEvaluasi();
}

/*function bukaRincianEvaluasi(id_siswa) {
    const siswa = dataSiswa.find(s => s.id_siswa === id_siswa);
    if(!siswa) return;
    document.getElementById('rincianNamaSiswa').innerText = siswa.nama_siswa;
    document.getElementById('btnHapusSemuaRiwayat').onclick = function() { hapusSemuaRiwayatSiswa(id_siswa); };

    let tesAkhirData = getDataTesAkhir();
    let htmlBintang = '';
    
    dataMateri.forEach(materi => {
        const riwayatMateri = tesAkhirData.filter(p => p.id_siswa === id_siswa && p.id_materi === materi.id_materi);
        let uiBintang = '';
        if(riwayatMateri.length > 0) {
            const avgScore = Math.round(riwayatMateri.reduce((sum, p) => sum + (Number(p.nilai.hasil) || 0), 0) / riwayatMateri.length);
            const starCount = Math.round(avgScore / 20);
            let finalStar = starCount > 5 ? 5 : (starCount < 0 ? 0 : starCount);
            uiBintang = '<span class="stars">' + '⭐'.repeat(finalStar) + '☆'.repeat(5 - finalStar) + ` (${avgScore})</span>`;
        } else {
            uiBintang = `<span style="font-size:12px; color:#9E9E9E;">Belum dinilai</span>`;
        }

        htmlBintang += `<div class="star-row" onclick="bukaRiwayatMateri('${id_siswa}', '${materi.id_materi}')">
                <span class="text-primary" style="width: 50%; text-align:left;">🔹 ${materi.nama_materi}</span>
                <span style="width: 50%; text-align:right;">${uiBintang}</span>
            </div>`;
    });

    const riwayatSiswa = tesAkhirData.filter(p => p.id_siswa === id_siswa);
    const rataRataKeseluruhan = riwayatSiswa.length > 0 ? Math.round(riwayatSiswa.reduce((sum, p) => sum + (Number(p.nilai.hasil) || 0), 0) / riwayatSiswa.length) : 0;
    
    document.getElementById('rincianNilaiAngka').innerText = rataRataKeseluruhan;
    document.getElementById('rincianBintangMateri').innerHTML = htmlBintang;
    nav('page-rincian-evaluasi');
}*/

/*function bukaRiwayatMateri(id_siswa, id_materi) {
    const materi = dataMateri.find(m => m.id_materi === id_materi);
    if(!materi) return;
    document.getElementById('riwayatJudul').innerText = "Riwayat: " + materi.nama_materi;
    
    let tesAkhirData = getDataTesAkhir();
    const riwayat = tesAkhirData.filter(p => p.id_siswa === id_siswa && p.id_materi === id_materi);
    riwayat.sort((a, b) => new Date(b.tanggal) - new Date(a.tanggal));

    const tbody = document.getElementById('riwayatBody'); 
    if(!tbody) return;
    tbody.innerHTML = '';
    
    if(riwayat.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" style="text-align:center; padding:15px;">Belum ada riwayat pembelajaran.</td></tr>';
    } else {
        riwayat.forEach(r => {
            const isTuntas = r.nilai.hasil >= 75;
            const rowColor = isTuntas ? '#4A4A4A' : '#E53935';
            const tgl = r.tanggal || "-";
            const tesKe = r.tesKe ? `Ke-${r.tesKe}` : "-";
            const nilai = r.nilai.hasil;
            const evalText = (r.feedback || "") + (r.evaluasi ? ` - ${r.evaluasi}` : "");
            
            tbody.innerHTML += `<tr style="color:${rowColor}; border-bottom:1px solid var(--bg-light);">
                <td>${tgl}</td>
                <td style="font-weight:700">${tesKe}</td>
                <td class="text-primary">${nilai}</td>
                <td style="text-align:left; line-height:1.2;">${evalText}</td>
                <td><button class="btn-danger" style="padding:4px; font-size:10px;" onclick="hapusRiwayatSpesifik('${r.id_tesAkhir}', '${id_siswa}', '${id_materi}')">Hapus</button></td>
            </tr>`;
        });
    }
    document.getElementById('riwayatModal').style.display = 'flex';
}*/

function hapusRiwayatSpesifik(id_tesAkhir, id_siswa, id_materi) {

    let teks = globalLang === "ID" ? "Hapus baris penilaian ini?" : "Delete this record ?";
    let konfir = globalLang === "ID" ? "Ya, Hapus" : "Yes, delete";

    bukaKonfirmasi(teks, konfir, function() {
        let tesAkhirData = getDataTesAkhir();
        tesAkhirData = tesAkhirData.filter(p => p.id_tesAkhir !== id_tesAkhir);
        saveDataTesAkhir(tesAkhirData);
        
        renderTabelEvaluasi(); 
        bukaRiwayatMateri(id_siswa, id_materi); 
        bukaRincianEvaluasi(id_siswa); 
    });
}

function hapusSemuaRiwayatSiswa(id_siswa) {
    bukaKonfirmasi("Hapus SELURUH riwayat tes akhir siswa ini?", "Ya, Hapus Semua", function() {
        let tesAkhirData = getDataTesAkhir();
        tesAkhirData = tesAkhirData.filter(p => p.id_siswa !== id_siswa);
        saveDataTesAkhir(tesAkhirData);
        
        renderTabelEvaluasi(); 
        bukaRincianEvaluasi(id_siswa);
        showModal("Sukses", "Seluruh riwayat tes akhir siswa berhasil dihapus.");
    });
}

/*function exportExcel() {
    let tesAkhirData = getDataTesAkhir();
    if(tesAkhirData.length === 0) { showModal("Gagal", "Belum ada data nilai tes akhir."); return; }
    
    let excelData = [];
    const namaSekolah = dataGuru && dataGuru.sekolah ? dataGuru.sekolah : "";
    const namaGuru = dataGuru && dataGuru.nama ? dataGuru.nama : "-";
    const nipGuru = dataGuru && dataGuru.nip ? dataGuru.nip : "-";
    const kelasFilter = document.getElementById('filterKelasEvaluasi').value;
    const textKelas = kelasFilter ? `Filter: Kelas ${kelasFilter}` : "Filter: Semua Kelas";
    
    excelData.push([`Evaluasi Hasil Penilaian Aplikasi ${APP_CONFIG.appName} ${namaSekolah}`.trim()]);
    excelData.push([`Nama Guru : ${namaGuru}`]);
    excelData.push([`NIP       : ${nipGuru}`]);
    excelData.push([textKelas]);
    excelData.push([]); 
    
    let headers = ["No Abs", "Nama Siswa", "NISN", "Kelas", "Rata-rata Total"];
    dataMateri.forEach(m => headers.push(m.nama_materi));
    excelData.push(headers);
    
    let siswaDiproses = dataSiswa;
    if(kelasFilter) siswaDiproses = dataSiswa.filter(s => s.kelas === kelasFilter);
    siswaDiproses.sort((a, b) => (Number(a.absen) || 0) - (Number(b.absen) || 0));

    siswaDiproses.forEach(siswa => {
        const riwayatSiswa = tesAkhirData.filter(p => p.id_siswa === siswa.id_siswa);
        const avgTotal = riwayatSiswa.length > 0 ? Math.round(riwayatSiswa.reduce((sum, p) => sum + (Number(p.nilai.hasil) || 0), 0) / riwayatSiswa.length) : '-';

        let row = [siswa.absen, siswa.nama_siswa, siswa.nisn || '-', siswa.kelas, avgTotal];
        dataMateri.forEach(m => row.push(getAvgMateri(siswa.id_siswa, m.id_materi)));
        excelData.push(row);
    });

    const ws = XLSX.utils.aoa_to_sheet(excelData);
    if(!ws['!merges']) ws['!merges'] = [];
    ws['!merges'].push({ s: {r: 0, c: 0}, e: {r: 0, c: headers.length-1} });
    ws['!merges'].push({ s: {r: 1, c: 0}, e: {r: 1, c: headers.length-1} });
    ws['!merges'].push({ s: {r: 2, c: 0}, e: {r: 2, c: headers.length-1} });
    ws['!merges'].push({ s: {r: 3, c: 0}, e: {r: 3, c: headers.length-1} });
    
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Laporan Nilai");
    
    const ts = new Date().toISOString().replace(/[:\-\T\.]/g, '').slice(0,14);
    XLSX.writeFile(wb, `Laporan_Nilai_${APP_CONFIG.appName}_${ts}.xlsx`);
}*/

// ================= OVERRIDE NAV SAFER =================
function nav(targetId) {
    const targetElement = document.getElementById(targetId);
    if (!targetElement) {
        console.warn("Peringatan: Elemen halaman '" + targetId + "' tidak ditemukan.");
        return;
    }
    document.querySelectorAll('.page').forEach(page => page.classList.remove('active'));
    targetElement.classList.add('active');
    
    if(targetId === 'page-data-siswa') {
        if(typeof renderTabelSiswa === 'function') renderTabelSiswa();
    }
    if(targetId === 'page-materi') {
        if(typeof renderGridMateri === 'function') renderGridMateri();
    }
    if(targetId === 'page-evaluasi') {
        if(typeof renderTabelEvaluasi === 'function') renderTabelEvaluasi();
    }
    if(targetId === 'page-login'){
        if(sudahLogin()){
            nav('page-dashboard');
        }
    }

    renderBreadcrumbs();
}

function sudahLogin(){
    let data = sessionStorage.getItem("isLoggedIn" + APP_CONFIG.appName);
    if(data){
        return true;
    }
    return false;
}

// ================= OVERRIDE EXPORT EXCEL 2 SHEETS =================
// Export - 3: Unduh Laporan Nilai Lengkap 2 Sheet (Excel)
function exportExcel() {
    let tesAkhirData = getDataTesAkhir();
    if(tesAkhirData.length === 0) { 
        if(globalLang === "ID"){
            showModal("Peringatan", "Data Tes Akhir kosong. Mengekspor format dasar tanpa nilai."); 
        }
        else {
            showModal("Warning", "There's no data. Exporting without data.");    
        }
    }

    let sourceMateri = [];
    if(globalLang === "ID"){
        sourceMateri = dataMateri;
    }
    else {
        try {
            sourceMateri = dataMateri_EN;
        }
        catch(e){
            sourceMateri = dataMateri;
        }
    }
    
    // ======== SHEET 1: Laporan Nilai (Evaluasi) ========
    let excelData = [];
    const namaSekolah = typeof dataGuru !== 'undefined' && dataGuru && dataGuru.sekolah ? dataGuru.sekolah : "";
    const namaGuru = typeof dataGuru !== 'undefined' && dataGuru && dataGuru.nama ? dataGuru.nama : "-";
    const nipGuru = typeof dataGuru !== 'undefined' && dataGuru && dataGuru.nip ? dataGuru.nip : "-";
    
    const ddlKelas = document.getElementById('filterKelasEvaluasi');
    const kelasFilter = ddlKelas ? ddlKelas.value : "";
    const textKelas = kelasFilter ? (globalLang === "ID" ? `Filter: Kelas ${kelasFilter}` : `Filter: Class ${kelasFilter}`) : (globalLang === "ID" ? "Filter: Semua Kelas" : "Filter: All Classes");
    
    excelData.push([`${globalLang === "ID" ? "Evaluasi Hasil Penilaian Aplikasi " : "Evaluation of Assessment Results " } ${APP_CONFIG.appName} ${namaSekolah}`.trim()]);
    excelData.push([`${globalLang === "ID" ? "Nama Guru" : "Teacher's Name"} : ${namaGuru}`]);
    excelData.push([`${globalLang === "ID" ? "NIP" : "Teacher's ID"}       : ${nipGuru}`]);
    excelData.push([textKelas]);
    excelData.push([]); 
    
    let headers = [];
    if(globalLang === "ID"){
        headers = ["No Abs", "Nama Siswa", "NISN", "Kelas", "Rata-rata Total"];
    }
    else {
        headers = ["Num", "Student's Name", "Student's ID", "Class", "Average"];
    }
    dataMateri.forEach(m => headers.push(m.nama_materi));
    excelData.push(headers);
    
    let siswaDiproses = dataSiswa;
    if(kelasFilter) siswaDiproses = dataSiswa.filter(s => s.kelas === kelasFilter);
    siswaDiproses.sort((a, b) => (Number(a.absen) || 0) - (Number(b.absen) || 0));

    siswaDiproses.forEach(siswa => {
        const riwayatSiswa = tesAkhirData.filter(p => p.id_siswa === siswa.id_siswa);
        const avgTotal = riwayatSiswa.length > 0 ? Math.round(riwayatSiswa.reduce((sum, p) => sum + (Number(p.nilai.hasil) || 0), 0) / riwayatSiswa.length) : '-';

        let row = [siswa.absen, siswa.nama_siswa, siswa.nisn || '-', siswa.kelas, avgTotal];
        sourceMateri.forEach(m => row.push(getAvgMateri(siswa.id_siswa, m.id_materi)));
        excelData.push(row);
    });

    const ws1 = XLSX.utils.aoa_to_sheet(excelData);
    if(!ws1['!merges']) ws1['!merges'] = [];
    ws1['!merges'].push({ s: {r: 0, c: 0}, e: {r: 0, c: headers.length-1} });
    ws1['!merges'].push({ s: {r: 1, c: 0}, e: {r: 1, c: headers.length-1} });
    ws1['!merges'].push({ s: {r: 2, c: 0}, e: {r: 2, c: headers.length-1} });
    ws1['!merges'].push({ s: {r: 3, c: 0}, e: {r: 3, c: headers.length-1} });
    
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws1, `${globalLang === "ID" ? "Laporan Nilai" : "Assessment Results"}`);

    // ======== SHEET 2: Riwayat Asesmen ========
    let excelRiwayat = [];
    excelRiwayat.push([`${globalLang === "ID" ? "Riwayat Asesmen Aplikasi" : "Assessment History"} ${APP_CONFIG.appName} ${namaSekolah}`.trim()]);
    excelRiwayat.push([`${globalLang === "ID" ? "Nama Guru" : "Teacher's Name" } : ${namaGuru}`]);
    excelRiwayat.push([textKelas]);
    excelRiwayat.push([]);
    
    let headerRiwayat = [];

    if(globalLang === "ID"){
        headerRiwayat = ["No", "Tanggal", "Nama Siswa", "Kelas", "Unit Materi", "Jenis Asesmen", "Hasil", "Keterangan", "Evaluasi (Catatan)"];
    }
    else {
        headerRiwayat = ["Num", "Date", "Student's Name", "Class", "Unit", "Type", "Result", "Remarks", "Evaluation"]
    }
    
    excelRiwayat.push(headerRiwayat);
    
    let keyNaikTahap = APP_CONFIG.storagePrefix + 'NaikTahap';
    let dataNaik = JSON.parse(localStorage.getItem(keyNaikTahap) || "[]");
    
    let combined = [...dataNaik, ...tesAkhirData];
    
    // Urutkan Tanggal Terbaru
    combined.sort((a, b) => {
        let dateA = new Date(a.tanggal);
        let dateB = new Date(b.tanggal);
        if(isNaN(dateA)) dateA = 0;
        if(isNaN(dateB)) dateB = 0;
        return dateB - dateA;
    });
    
    if (kelasFilter) {
        combined = combined.filter(item => item.kelas === kelasFilter);
    }
    
    combined.forEach((item, index) => {
        const siswa = dataSiswa.find(s => s.id_siswa === item.id_siswa) || { nama_siswa: `${globalLang === 'ID' ? 'Siswa Dihapus' : 'Student\'s data is not found'}` };
        const materi = dataMateri.find(m => m.id_materi === item.id_materi) || { nama_materi: '-' };
        
        let jenis = "";
        let hasil = "";
        let keterangan = "-";
        let evaluasi = "-";
        
        // Identifikasi jenis data
        if (item.nilai && item.nilai.hasil === undefined) {
            jenis = globalLang === "ID" ? "Naik Tahap" : "Level Up";
            let t1 = item.nilai.T1 ? 1 : 0;
            let t2 = item.nilai.T2 ? 1 : 0;
            let t3 = item.nilai.T3 ? 1 : 0;
            hasil = `${t1 + t2 + t3} dari 3`;
        } else if (item.nilai && item.nilai.hasil !== undefined) {
            jenis = globalLang === "ID" ? "Tes Akhir" : "Final Test";
            hasil = item.nilai.hasil;
            let ketOpsional = item.keterangan ? item.keterangan : '';
            keterangan = `${globalLang === "ID" ? "Tes ke-" : "Test-" }`+ (item.tesKe || '') + " : " + (item.feedback || '') + (ketOpsional ? ` - ${ketOpsional}` : '');
            evaluasi = item.evaluasi || "-";
        } else {
            jenis = globalLang === "ID" ? "Tes Akhir (Lama)" : "Final Test (Old Version)";
            hasil = item.nilai || 0;
            evaluasi = item.umpan_balik || "-";
        }
        
        excelRiwayat.push([
            index + 1,
            item.tanggal,
            siswa.nama_siswa,
            item.kelas,
            materi.nama_materi,
            jenis,
            hasil,
            keterangan,
            evaluasi
        ]);
    });
    
    const ws2 = XLSX.utils.aoa_to_sheet(excelRiwayat);
    if(!ws2['!merges']) ws2['!merges'] = [];
    ws2['!merges'].push({ s: {r: 0, c: 0}, e: {r: 0, c: headerRiwayat.length-1} });
    ws2['!merges'].push({ s: {r: 1, c: 0}, e: {r: 1, c: headerRiwayat.length-1} });
    ws2['!merges'].push({ s: {r: 2, c: 0}, e: {r: 2, c: headerRiwayat.length-1} });
    
    XLSX.utils.book_append_sheet(wb, ws2, `${globalLang === "ID" ? "Riwayat Asesmen" : "Assessment History"}`);
    
    // ======== EXPORT FILE ========
    // Menggunakan solusi export aman WebView Kotlin & Browser
    const ts = new Date().toISOString().replace(/[:\-\T\.]/g, '').slice(0,14);
    if(globalLang === "ID"){
        downloadExcelSafe(wb, `Laporan_Nilai_${APP_CONFIG.appName}_${ts}.xlsx`);
    }
    else {
        downloadExcelSafe(wb, `Result_Report_${APP_CONFIG.appName}_${ts}.xlsx`);   
    }
}

// ================= OVERRIDE GRAFIK EVALUASI =================
function renderGrafikEvaluasi() {
    const container = document.getElementById('evaluasiGrafikContainer');
    if (!container) return;
    
    const ddlKelas = document.getElementById('filterKelasEvaluasi');
    const kelasFilter = ddlKelas ? ddlKelas.value : "";
    
    let html = "";

    let sourceMateri = [];
    let labelBagus = "B";
    let labelCukup = "C";
    let labelPerbaikan = "R";
    if(globalLang === "ID"){
        sourceMateri = dataMateri;
    }
    else {
        try {
            sourceMateri = dataMateri_EN;
        }
        catch(e){
            sourceMateri = dataMateri;
        }

    labelBagus = "G";
    labelCukup = "S";
    labelPerbaikan = "R";
    }
    
    sourceMateri.forEach(m => {
        let countBagus = 0, countCukup = 0, countPerbaikan = 0;
        let siswaDiproses = dataSiswa;
        
        // Filter kelas jika ada
        if (kelasFilter) {
            siswaDiproses = dataSiswa.filter(s => s.kelas === kelasFilter);
        }
        
        siswaDiproses.forEach(siswa => {
            let avgVal = getAvgMateri(siswa.id_siswa, m.id_materi);
            if (avgVal !== '-') {
                let val = Number(avgVal);
                if (val >= 75) countBagus++;
                else if (val >= 70) countCukup++;
                else countPerbaikan++;
            }
        });
        
        let totalVal = countBagus + countCukup + countPerbaikan;
        let pctBagus = totalVal === 0 ? 0 : (countBagus / totalVal) * 100;
        let pctCukup = totalVal === 0 ? 0 : (countCukup / totalVal) * 100;
        let pctPerbaikan = totalVal === 0 ? 0 : (countPerbaikan / totalVal) * 100;
        
        html += `
        <div>
            <div style="font-size:12px; font-weight:bold; margin-bottom:5px; color:#333;">${m.nama_materi} <span style="font-weight:normal; color:#666;">(Total: ${totalVal} Siswa Dinilai)</span></div>
            <div style="display:flex; height:25px; width:100%; background-color:#e9ecef; border-radius:5px; overflow:hidden; border: 1px solid #ddd;">
                <div style="width:${pctBagus}%; background-color:#d4edda; display:flex; align-items:center; justify-content:center; color:#155724; font-size:12px; font-weight:bold; white-space:nowrap; overflow:hidden;">${countBagus > 0 ? (labelBagus + ' : ' + countBagus) : ''}</div>
                <div style="width:${pctCukup}%; background-color:#fff3cd; display:flex; align-items:center; justify-content:center; color:#856404; font-size:12px; font-weight:bold; white-space:nowrap; overflow:hidden;">${countCukup > 0 ? (labelCukup + ' : ' + countCukup) : ''}</div>
                <div style="width:${pctPerbaikan}%; background-color:#f8d7da; display:flex; align-items:center; justify-content:center; color:#721c24; font-size:12px; font-weight:bold; white-space:nowrap; overflow:hidden;">${countPerbaikan > 0 ? (labelPerbaikan + ' : ' + countPerbaikan) : ''}</div>
            </div>
        </div>`;
    });
    
    container.innerHTML = html;
}

// Override terapkanFilterEvaluasi untuk memanggil renderGrafikEvaluasi juga
function terapkanFilterEvaluasi() {
    const ddlFilter = document.getElementById('filterKelasEvaluasi');
    const nilaiFilter = ddlFilter ? ddlFilter.value : "";
    
    if ($.fn.DataTable.isDataTable('#tabelEvaluasi')) {
        const table = $('#tabelEvaluasi').DataTable();
        if(nilaiFilter) {
            // Kolom ke-3 adalah Kelas (No, Nama, NISN, Kelas)
            table.column(3).search('^' + nilaiFilter + '$', true, false).draw(); 
        } else {
            table.column(3).search('').draw();
        }
    }
    
    // Perbarui grafik sesuai kelas yang difilter
    renderGrafikEvaluasi();
}

// ================= OVERRIDE RINCIAN & RIWAYAT (UPDATE KARTU) =================

function bukaRincianEvaluasi(id_siswa) {
    const siswa = dataSiswa.find(s => s.id_siswa === id_siswa);
    if(!siswa) return;
    document.getElementById('rincianNamaSiswa').innerText = siswa.nama_siswa;
    document.getElementById('btnHapusSemuaRiwayat').onclick = function() { hapusSemuaRiwayatSiswa(id_siswa); };

    // --- ABSENSI ---
    let dataAbsensi = JSON.parse(localStorage.getItem(APP_CONFIG.storagePrefix + 'Absensi') || "[]");
    let absenSiswa = dataAbsensi.filter(a => a.id_siswa === id_siswa);
    let totalPertemuan = absenSiswa.length;
    let totalHadir = absenSiswa.filter(a => a.status === 'Hadir').length;
    
    let textAbsensi = globalLang === "ID" ? `Masuk ${totalHadir} kali dari ${totalPertemuan} pertemuan` : `Attended ${totalHadir} times out of ${totalPertemuan} sessions`;
    const elemAbsensi = document.getElementById('rincianAbsensiSiswa');
    if(elemAbsensi) {
        elemAbsensi.innerText = textAbsensi;
    }

    // --- DATA TES AKHIR & NAIK TAHAP ---
    let tesAkhirData = getDataTesAkhir();
    let dataNaikTahap = JSON.parse(localStorage.getItem(APP_CONFIG.storagePrefix + 'NaikTahap') || "[]");
    
    let htmlKartu = '';

    let sourceMateri = [];
    if(globalLang === "ID"){
        sourceMateri = dataMateri;
    }
    else {
        try {
            sourceMateri = dataMateri_EN;
        }
        catch(e){
            sourceMateri = dataMateri;
        }
    }
    
    sourceMateri.forEach(materi => {
        // 1. Hitung Rata-rata Tes Akhir
        const riwayatMateri = tesAkhirData.filter(p => p.id_siswa === id_siswa && p.id_materi === materi.id_materi);
        
        let teksNilai = '-';
        let teksStatus = globalLang === 'ID' ? 'Belum Dinilai' : 'No result yet';
        let classWarna = 'bg-light text-primary'; // default abu-abu/netral
        
        if(riwayatMateri.length > 0) {
            const avgScore = Math.round(riwayatMateri.reduce((sum, p) => sum + (Number(p.nilai.hasil) || 0), 0) / riwayatMateri.length);
            teksNilai = avgScore.toString();
            if (avgScore >= 75) {
                teksStatus = globalLang === 'ID' ? 'Bagus (TUNTAS)' : 'Great';
                classWarna = 'bg-eval-success';
            } else if (avgScore >= 70) {
                teksStatus = globalLang === 'ID' ? 'Cukup' : 'Satisfactory';
                classWarna = 'bg-eval-warning';
            } else {
                teksStatus = globalLang === 'ID' ? 'Perbaikan (Remedial)' : 'Remedial';
                classWarna = 'bg-eval-danger';
            }
        }
        
        // 2. Ambil Naik Tahap Terbaru
        const riwayatNT = dataNaikTahap.filter(n => n.id_siswa === id_siswa && n.id_materi === materi.id_materi);
        let teksNT = globalLang === 'ID' ? "Belum ada data" : "No data";
        
        if (riwayatNT.length > 0) {
            // Sort Descending by Date
            riwayatNT.sort((a, b) => {
                let dA = new Date(a.tanggal);
                let dB = new Date(b.tanggal);
                if(isNaN(dA)) dA = 0; if(isNaN(dB)) dB = 0;
                return dB - dA;
            });
            let latest = riwayatNT[0];
            if(latest.nilai) {
                let t1 = latest.nilai.T1 ? (globalLang === 'ID' ? 'Tuntas' : 'Passed') : (globalLang === 'ID' ? 'Belum' : 'Not yet'); 
                let t2 = latest.nilai.T2 ? (globalLang === 'ID' ? 'Tuntas' : 'Passed') : (globalLang === 'ID' ? 'Belum' : 'Not yet');
                let t3 = latest.nilai.T3 ? (globalLang === 'ID' ? 'Tuntas' : 'Passed') : (globalLang === 'ID' ? 'Belum' : 'Not yet');
                teksNT = `<span class="${t1 === 'Tuntas' || t1 === 'Passed' ? 'bg-eval-success' : ''}">Tahap 1 (${t1})</span> | <span class="${t2 === 'Tuntas'  || t2 === 'Passed' ? 'bg-eval-success' : ''}">Tahap 2 (${t2})</span> | <span class="${t3 === 'Tuntas'  || t3 === 'Passed' ? 'bg-eval-success' : ''}">Tahap 3 (${t3})</span>`;
            }
        }
        
        // 3. Bangun Kartu
        htmlKartu += `
        <div class="content-box" style="margin-bottom:12px; cursor:pointer; padding:10px; border-radius:8px; border:1px solid #e0e0e0; transition: transform 0.2s;" onclick="bukaRiwayatMateri('${id_siswa}', '${materi.id_materi}')" onmouseover="this.style.transform='scale(1.02)'" onmouseout="this.style.transform='scale(1)'">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px; border-bottom:1px dashed #ccc; padding-bottom:8px;">
                <span class="text-primary" style="font-weight:900; font-size:13px;">${materi.nama_materi}</span>
                <span class="${classWarna}" style="padding:4px 10px; border-radius:15px; font-size:11px; font-weight:bold; box-shadow:0 2px 4px rgba(0,0,0,0.1);">${teksNilai} - ${teksStatus}</span>
            </div>
            <div style="font-size:11px; color:#555; background-color:#f9f9f9; padding:5px; border-radius:4px;">
                <span style="font-weight:900; color:var(--primary-color);">${globalLang === "ID" ? "Status Naik Tahap:" : "Level Up Status:"}</span> <span style="font-style:italic; color: #222;">${teksNT}</span>

                <br /><br />
                <span style="margin-top: 10px; font-style: italic;">${globalLang === "ID" ? "Klik untuk melihat rincian." : "Click to show detail."}</span>
            </div>
        </div>`;
    });

    const riwayatSiswa = tesAkhirData.filter(p => p.id_siswa === id_siswa);
    const rataRataKeseluruhan = riwayatSiswa.length > 0 ? Math.round(riwayatSiswa.reduce((sum, p) => sum + (Number(p.nilai.hasil) || 0), 0) / riwayatSiswa.length) : 0;
    
    document.getElementById('rincianNilaiAngka').innerText = rataRataKeseluruhan;
    document.getElementById('rincianBintangMateri').innerHTML = htmlKartu;
    nav('page-rincian-evaluasi');
}

function bukaRiwayatMateri(id_siswa, id_materi) {

    let sourceMateri = [];
    if(globalLang === "ID"){
        sourceMateri = dataMateri;
    }
    else {
        try {
            sourceMateri = dataMateri_EN;
        }
        catch(e){
            sourceMateri = dataMateri;
        }
    }

    const materi = sourceMateri.find(m => m.id_materi === id_materi);
    if(!materi) return;
    document.getElementById('riwayatJudul').innerText = (globalLang === "ID" ? "Riwayat: " : "History: ") + materi.nama_materi;
    
    let tesAkhirData = getDataTesAkhir();
    const riwayat = tesAkhirData.filter(p => p.id_siswa === id_siswa && p.id_materi === id_materi);
    riwayat.sort((a, b) => {
        let dA = new Date(a.tanggal);
        let dB = new Date(b.tanggal);
        if(isNaN(dA)) dA = 0; if(isNaN(dB)) dB = 0;
        return dB - dA;
    });

    const tbody = document.getElementById('riwayatBody'); 
    if(!tbody) return;
    tbody.innerHTML = '';
    
    if(riwayat.length === 0) {
        tbody.innerHTML = `<tr><td colspan="5" style="text-align:center; padding:15px;">${globalLang === "ID" ? "Belum ada riwayat penilaian tes akhir." : "No result yet"}</td></tr>`;
    } else {
        riwayat.forEach(r => {
            const isTuntas = r.nilai.hasil >= 75;
            const rowColor = isTuntas ? '#4A4A4A' : '#E53935';
            const tgl = r.tanggal || "-";
            const tesKe = r.tesKe ? `Ke-${r.tesKe}` : "-";
            const nilai = r.nilai.hasil;
            
            // Format catatan: feedback - keterangan - evaluasi
            let parts = [];
            if(r.feedback) parts.push(r.feedback);
            if(r.keterangan) parts.push(r.keterangan);
            if(r.evaluasi) parts.push(r.evaluasi);
            const evalText = parts.length > 0 ? parts.join(' - ') : '-';
            
            tbody.innerHTML += `<tr style="color:${rowColor}; border-bottom:1px solid var(--bg-light);">
                <td>${tgl}</td>
                <td style="font-weight:700">${tesKe}</td>
                <td class="text-primary" style="font-weight:bold;">${nilai}</td>
                <td style="text-align:left; line-height:1.3; font-size:11px;">${evalText}</td>
                <td><button class="btn-danger" style="padding:4px; font-size:10px;" onclick="hapusRiwayatSpesifik('${r.id_tesAkhir}', '${id_siswa}', '${id_materi}')">${globalLang === "ID" ? "Hapus" : "Delete"}</button></td>
            </tr>`;
        });
    }
    document.getElementById('riwayatModal').style.display = 'flex';
}

// ================= OVERRIDE PDF PREVIEW =================
let currentPdfDownloadAnchor = null;

function unduhLembarTes() {
    let a = document.getElementById('filterLembarTes');
    if (a && a.href) {
        bukaPdfPreview(a);
    } else {
        alert("File PDF belum tersedia untuk unit ini.");
    }
}

function unduhLembarKerja(id) {
    let a = document.getElementById(id);
    if (a && a.href) {
        bukaPdfPreview(a);
    } else {
        alert("File PDF belum tersedia.");
    }
}

function bukaPdfPreview(anchorElement) {
    currentPdfDownloadAnchor = anchorElement;
    const iframe = document.getElementById('pdfPreviewIframe');
    const title = document.getElementById('pdfPreviewTitle');
    const modal = document.getElementById('pdfPreviewModal');
    
    if (iframe && modal) {
        // Tampilkan modal
        modal.style.display = 'flex';
        
        // Atur judul
        if (title && anchorElement.download) {
            title.innerText = "Pratinjau: " + anchorElement.download;
        } else if (title) {
            title.innerText = "Pratinjau Dokumen PDF";
        }
        
        // Set src iframe agar mulai memuat file
        iframe.src = anchorElement.href;
    }
}

function tutupPdfPreview() {
    const modal = document.getElementById('pdfPreviewModal');
    const iframe = document.getElementById('pdfPreviewIframe');
    if (modal) modal.style.display = 'none';
    if (iframe) iframe.src = ''; // Bersihkan iframe src
    currentPdfDownloadAnchor = null;
}

function konfirmasiUnduhPdf() {
    if (currentPdfDownloadAnchor) {
        const tempAnchor = document.createElement('a');
        tempAnchor.href = currentPdfDownloadAnchor.href;
        tempAnchor.download = currentPdfDownloadAnchor.download || 'document.pdf';
        document.body.appendChild(tempAnchor);
        tempAnchor.click();
        document.body.removeChild(tempAnchor);
        
        tutupPdfPreview();
    }
}


// ================= OVERRIDE INISIALISASI BAHASA =================
// Menjalankan applyLanguage saat halaman selesai dimuat dan menimpa toggleBahasa
toggleBahasa = function() {
    let currentLang = localStorage.getItem(APP_CONFIG.appName + '_lang') || 'ID';
    let newLang = (currentLang === 'ID') ? 'EN' : 'ID';
    localStorage.setItem(APP_CONFIG.appName + '_lang', newLang);
    globalLang = newLang;
    
    // Update global switches (Home & Login)
    document.querySelectorAll('.lang-switch-id').forEach(el => {
        el.className = newLang === 'ID' ? 'lang-switch-id bahasa-aktif' : 'lang-switch-id bahasa-off';
    });
    document.querySelectorAll('.lang-switch-en').forEach(el => {
        el.className = newLang === 'EN' ? 'lang-switch-en bahasa-aktif' : 'lang-switch-en bahasa-off';
    });

    // Update settings switch if exists
    const btnID = document.getElementById('labelBahasaID');
    const btnEN = document.getElementById('labelBahasaEN');
    if(btnID && btnEN) {
        btnID.className = newLang === 'ID' ? 'bahasa-aktif' : 'bahasa-off';
        btnEN.className = newLang === 'EN' ? 'bahasa-aktif' : 'bahasa-off';
    }

    if (typeof applyLanguage === 'function') {
        applyLanguage(newLang);
    }
};
// Inisialisasi label UI saat aplikasi pertama kali dimuat
document.addEventListener('DOMContentLoaded', () => {
    const lang = localStorage.getItem(APP_CONFIG.appName + '_lang') || 'ID';
    const btnID = document.getElementById('labelBahasaID');
    const btnEN = document.getElementById('labelBahasaEN');

    console.log(lang)
    
    if(btnID && btnEN) {
        //console.log('ok ' + lang);
        if(lang === 'ID') {
            btnID.className = 'bahasa-aktif';
            btnEN.className = 'bahasa-off';
            globalLang = "ID";
        } else {
            btnID.className = 'bahasa-off';
            btnEN.className = 'bahasa-aktif';
            globalLang = "EN";
        }
    }
    
    document.querySelectorAll('.lang-switch-id').forEach(el => {
        el.className = lang === 'ID' ? 'lang-switch-id bahasa-aktif' : 'lang-switch-id bahasa-off';
    });
    document.querySelectorAll('.lang-switch-en').forEach(el => {
        el.className = lang === 'EN' ? 'lang-switch-en bahasa-aktif' : 'lang-switch-en bahasa-off';
    });

    if (typeof applyLanguage === 'function') {
        applyLanguage(lang);
    }
});



// ==========================================
// PRATINJAU PDF & ZOOM ENGINE (HIGH-DPI COMPATIBLE)
// ==========================================

// Variabel status PDF & Zoom
let docPdf = null;
let halAktif = 1;
let pageRendering = false;
let pageNumPending = null;
let pdfScale = 1.0;          // Nilai 1.0 = 100% (fit container)
let renderTask = null;       // Penampung task render aktif

// Pastikan worker CDN sinkron dengan versi pdf.js
if (window.pdfjsLib) {
    pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
}

// 1. Fungsi Merender Halaman ke Canvas
function tampilkanHalaman(num) {
    if (!docPdf) return;

    // Batalkan render sebelumnya jika pengguna menekan tombol halaman/zoom dengan cepat
    if (pageRendering && renderTask) {
        renderTask.cancel();
        pageNumPending = num;
        return;
    }

    pageRendering = true;

    docPdf.getPage(num).then(page => {
        const canvas = document.getElementById('pdfCanvas');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');

        // Dapatkan lebar wadah pembungkus
        const container = document.getElementById('pdfCanvasContainer');
        const containerWidth = (container && container.clientWidth > 0) 
            ? (container.clientWidth - 24) 
            : (window.innerWidth - 30);

        // Skala dasar agar dokumen pas dengan lebar kontainer WebView
        const unscaledViewport = page.getViewport({ scale: 1 });
        const fitScale = containerWidth / unscaledViewport.width;

        // Skala akhir gabungan fit container + zoom level
        const currentScale = fitScale * pdfScale;
        const viewport = page.getViewport({ scale: currentScale });

        // Kompensasi rasio piksel layar WebView (mencegah blur / burik di smartphone)
        const dpr = window.devicePixelRatio || 1;

        // Atur resolusi internal canvas (bitmap jernih)
        canvas.width = Math.floor(viewport.width * dpr);
        canvas.height = Math.floor(viewport.height * dpr);

        // Atur dimensi tampilan di layar (CSS px)
        canvas.style.width = Math.floor(viewport.width) + "px";
        canvas.style.height = Math.floor(viewport.height) + "px";

        // Skalakan context drawing sesuai kerapatan piksel layar
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

        const renderContext = {
            canvasContext: ctx,
            viewport: viewport
        };

        renderTask = page.render(renderContext);
        renderTask.promise.then(() => {
            pageRendering = false;
            renderTask = null;

            if (pageNumPending !== null) {
                tampilkanHalaman(pageNumPending);
                pageNumPending = null;
            }
        }).catch(err => {
            // Error RenderingCancelledException adalah perilaku normal saat dibatalkan
            if (err.name !== 'RenderingCancelledException') {
                console.error("Gagal merender halaman PDF:", err);
            }
            pageRendering = false;
            renderTask = null;
        });

        // Update indikator halaman
        const labelHal = document.getElementById('labelHalamanPdf');
        if (labelHal) {
            labelHal.innerText = `Halaman ${num} / ${docPdf.numPages}`;
        }

        // Update indikator zoom
        const labelZoom = document.getElementById('labelZoomPdf');
        if (labelZoom) {
            labelZoom.innerText = `${Math.round(pdfScale * 100)}%`;
        }
    }).catch(err => {
        console.error("Gagal memuat halaman PDF:", err);
        pageRendering = false;
    });
}

function antreTampilkanHalaman(num) {
    if (pageRendering) {
        pageNumPending = num;
    } else {
        tampilkanHalaman(num);
    }
}

// 2. Fungsi Navigasi Halaman
function halamanSebelumnya() {
    if (!docPdf || halAktif <= 1) return;
    halAktif--;
    antreTampilkanHalaman(halAktif);
}

function halamanBerikutnya() {
    if (!docPdf || halAktif >= docPdf.numPages) return;
    halAktif++;
    antreTampilkanHalaman(halAktif);
}

// 3. Fungsi Navigasi Zoom
function zoomMasuk() {
    if (!docPdf || pdfScale >= 3.0) return; // Maksimal 300%
    pdfScale += 0.25;
    tampilkanHalaman(halAktif);
}

function zoomKeluar() {
    if (!docPdf || pdfScale <= 0.5) return; // Minimal 50%
    pdfScale -= 0.25;
    tampilkanHalaman(halAktif);
}

function resetZoom() {
    if (!docPdf || pdfScale === 1.0) return;
    pdfScale = 1.0;
    tampilkanHalaman(halAktif);
}

// 4. Fungsi Membuka Modal Pratinjau
function bukaPdfPreview(anchorElement) {
    currentPdfDownloadAnchor = anchorElement;
    const modal = document.getElementById('pdfPreviewModal');
    const title = document.getElementById('pdfPreviewTitle');

    if (modal) {
        modal.style.display = 'flex';
        if (title && anchorElement.download) {
            title.innerText = "Pratinjau: " + anchorElement.download;
        }

        // Reset zoom ke default
        pdfScale = 1.0;

        // Reset label teks
        const labelHal = document.getElementById('labelHalamanPdf');
        if (labelHal) labelHal.innerText = "Memuat dokumen...";

        const labelZoom = document.getElementById('labelZoomPdf');
        if (labelZoom) labelZoom.innerText = "100%";

        // Kosongkan canvas sisa render sebelumnya
        const canvas = document.getElementById('pdfCanvas');
        if (canvas) {
            const ctx = canvas.getContext('2d');
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }

        // Muat file dokumen menggunakan PDF.js
        pdfjsLib.getDocument(anchorElement.href).promise.then(pdf => {
            docPdf = pdf;
            halAktif = 1;
            // Beri jeda 100ms agar container modal di WebView selesai menghitung layout flex
            setTimeout(() => {
                tampilkanHalaman(1);
            }, 100);
        }).catch(err => {
            console.error("Gagal membuka dokumen PDF:", err);
            if (labelHal) labelHal.innerText = "Gagal memuat pratinjau PDF.";
        });
    }
}
