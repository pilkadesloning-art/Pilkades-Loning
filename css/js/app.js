// Load config dan TPS list
async function loadHome() {
    try {
        const config = await fetch(API_URL + '?action=getConfig').then(r => r.json());
        
        document.getElementById('infoBox').innerHTML = `
            <b> Desa:</b> ${config.namaDesa} | 
            <b>Kecamatan:</b> ${config.namaKec}<br>
            <b>📅 Tanggal:</b> ${config.tanggal}
        `;

        const tpsData = await fetch(API_URL + '?action=getAllTPS').then(r => r.json());
        
        const grid = document.getElementById('tpsGrid');
        grid.innerHTML = '';
        
        tpsData.forEach(tps => {
            const status = tps.status === 'LOCKED' ? 'terkunci' : 
                          tps.pemilih > 0 ? 'sudah' : '';
            const label = tps.status === 'LOCKED' ? '🔒' : 
                         tps.pemilih > 0 ? '✓' : '○';
            
            grid.innerHTML += `
                <a href="input-tps.html?tps=${tps.tps}" 
                   class="tps-card ${status}">
                    TPS ${tps.tps}<br>
                    <small>${label} ${tps.pemilih} suara</small>
                </a>
            `;
        });
    } catch (error) {
        document.getElementById('infoBox').innerHTML = 
            `<span style="color:red">❌ Error: ${error.message}</span>`;
    }
}

window.onload = loadHome;
