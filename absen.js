  // Kunci untuk localStorage
        const STORAGE_KEY = 'ABSENSI_DATA';
        
        // Array untuk menampung data
        let dataAbsensi = [];

        // Fungsi yang dijalankan pertama kali saat halaman dimuat
        document.addEventListener('DOMContentLoaded', () => {
            // Ambil data dari localStorage jika ada
            if (localStorage.getItem(STORAGE_KEY)) {
                dataAbsensi = JSON.parse(localStorage.getItem(STORAGE_KEY));
            }
            renderTabel();
        });

        // Menangani form submit
        document.getElementById('formAbsensi').addEventListener('submit', function(e) {
            e.preventDefault(); // Mencegah halaman refresh

            // Mengambil nilai dari form
            const nama = document.getElementById('namaSiswa').value;
            const kelas = document.getElementById('kelasSiswa').value;
            const status = document.getElementById('statusKehadiran').value;

            // Mendapatkan waktu saat ini
            const now = new Date();
            const waktu = `${now.getDate()}/${now.getMonth()+1}/${now.getFullYear()} ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

            // Membuat objek data baru
            const dataBaru = {
                id: +new Date(), // ID unik berdasarkan timestamp
                waktu: waktu,
                nama: nama,
                kelas: kelas,
                status: status
            };

            // Menambahkan ke array
            dataAbsensi.push(dataBaru);
            
            // Simpan ke localStorage
            simpanData();

            // Reset form
            this.reset();

            // Perbarui tampilan
            renderTabel();
        });

        // Fungsi untuk menyimpan data ke localStorage
        function simpanData() {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(dataAbsensi));
        }

        // Fungsi untuk menghapus satu data berdasarkan ID
        function hapusData(id) {
            // Filter array untuk membuang data dengan id yang diklik
            dataAbsensi = dataAbsensi.filter(item => item.id !== id);
            simpanData();
            renderTabel();
        }

        // Fungsi untuk menghapus semua data
        function hapusSemuaData() {
            // Gunakan custom confirm UI di sistem produksi sesungguhnya, tapi di sini kita pakai confirm standar agar simpel untuk pembelajaran
            if(confirm('Apakah Anda yakin ingin menghapus semua data absensi?')) {
                dataAbsensi = [];
                simpanData();
                renderTabel();
            }
        }

        // Fungsi untuk mendapatkan class warna badge berdasarkan status
        function getBadgeClass(status) {
            switch(status) {
                case 'Hadir': return 'bg-hadir text-hadir-800 border-hadir-200';
                case 'Izin': return 'bg-izin text-izin-800 border-izin-200';
                case 'Sakit': return 'bg-sakit text-sakit-800 border-sakit-200';
                case 'Alpa': return 'bg-alpa text-alpa-800 border-alpa-200';
                default: return 'bg-gray-100 text-gray-800';
            }
        }

        // Fungsi utama untuk me-render tabel dan rekapitulasi
        function renderTabel() {
            const tbody = document.getElementById('tabelBody');
            const pesanKosong = document.getElementById('pesanKosong');
            
            // Variabel untuk menghitung rekap
            let countHadir = 0, countIzin = 0, countSakit = 0, countAlpa = 0;
            
            tbody.innerHTML = '';

            if (dataAbsensi.length === 0) {
                pesanKosong.classList.remove('hidden');
            } else {
                pesanKosong.classList.add('hidden');
                
                // Urutkan data terbaru di atas
                const sortedData = [...dataAbsensi].reverse();

                sortedData.forEach((item, index) => {
                    // Hitung rekapitulasi
                    if(item.status === 'Hadir') countHadir++;
                    else if(item.status === 'Izin') countIzin++;
                    else if(item.status === 'Sakit') countSakit++;
                    else if(item.status === 'Alpa') countAlpa++;

                    // Buat baris tabel
                    const tr = document.createElement('tr');
                    tr.className = 'hover:bg-slate-50 transition-colors fade-in';
                    
                    tr.innerHTML = `
                        <td class="p-4 text-center text-slate-500">${index + 1}</td>
                        <td class="p-4 text-sm text-slate-500">${item.waktu}</td>
                        <td class="p-4 font-medium text-slate-800">${item.nama}</td>
                        <td class="p-4 text-slate-600">${item.kelas}</td>
                        <td class="p-4 text-center">
                            <span class="px-3 py-1 rounded-full text-xs font-semibold border ${getBadgeClass(item.status)}">
                                ${item.status}
                            </span>
                        </td>
                        <td class="p-4 text-center">
                            <button onclick="hapusData(${item.id})" class="text-slate-400 hover:text-red-500 transition-colors" title="Hapus Data">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mx-auto" viewBox="0 0 20 20" fill="currentColor">
                                  <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
                                </svg>
                            </button>
                        </td>
                    `;
                    tbody.appendChild(tr);
                });
            }

            // Update UI Rekapitulasi
            document.getElementById('countHadir').innerText = countHadir;
            document.getElementById('countIzin').innerText = countIzin;
            document.getElementById('countSakit').innerText = countSakit;
            document.getElementById('countAlpa').innerText = countAlpa;
        }