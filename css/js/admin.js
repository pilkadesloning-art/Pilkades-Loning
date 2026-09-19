async function loadRekap() {
    try {
        const data = await fetch(API_URL + '?action=getRekap').then(r => r.json());
        
        // Info
        document.getElementById('infoBox').innerHTML = `
            <b>📍 Desa:</b> ${data.config.namaDesa} | 
            <b>Kecamatan:</b> ${data.config.namaKec}<br>
            <b>📅 Tanggal:</b> ${data.config.tanggal}
        `;
        
        // Status TPS
        let statusHTML = '<div class="status-tps">';
        data.detailTPS.forEach(tps => {
            const kelas = tps.status === 'LOCKED' ? 'terkunci' : 
                         tps.pemilih > 0 ? 'sudah' : 'belum';
            statusHTML += `
                <div class="status-card status-${kelas}">
                    TPS ${tps.tps}<br>
                    ${tps.pemilih} suara
                </div>
            `;
        });
        statusHTML += '</div>';
        document.getElementById('statusTPS').innerHTML = statusHTML;
        
        // Tabel
        let html = `
            <table>
                <thead>
                    <tr>
                        <th>TPS</th>
                        <th>Pemilih</th>
                        <th>Tidak Sah</th>
                        ${data.namaCalon.map(n => `<th>${n}</th>`).join('')}
                        <th>Total Sah</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
        `;
        
        data.detailTPS.forEach(tps => {
            html += `
                <tr>
                    <td><b>TPS ${tps.tps}</b></td>
                    <td>${tps.pemilih}</td>
                    <td>${tps.tidakSah}</td>
                    ${tps.calon.map(v => `<td>${v}</td>`).join('')}
                    <td><b>${tps.sah}</b></td>
                    <td>${tps.status}</td>
                </tr>
            `;
        });
        
        // Total
        html += `
            <tr class="total-row">
                <td>TOTAL</td>
                <td>${data.totalPemilih}</td>
                <td>${data.totalTidakSah}</td>
                ${data.totalCalon.map(v => `<td>${v}</td>`).join('')}
                <td>${data.totalSah}</td>
                <td>-</td>
            </tr>
        </tbody></table>`;
        
        document.getElementById('tabelRekap').innerHTML = html;
        
        // Pemenang
        document.getElementById('pemenangBox').innerHTML = `
            <div class="winner-box">
                <h2>🏆 PEMENANG SEMENTARA</h2>
                <div class="name">${data.pemenang}</div>
                <div>${data.maxSuara} suara (${data.pctPemenang}%)</div>
            </div>
        `;
    } catch (error) {
        alert('Error: ' + error.message);
    }
}

window.onload = loadRekap;
setInterval(loadRekap, 30000); // Auto-refresh tiap 30 detik
