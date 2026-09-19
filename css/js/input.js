const urlParams = new URLSearchParams(window.location.search);
const tpsNumber = parseInt(urlParams.get('tps'));

async function loadInputPage() {
    document.getElementById('tpsNumber').textContent = tpsNumber;
    document.getElementById('tpsNum').textContent = tpsNumber;
    
    try {
        const config = await fetch(API_URL + '?action=getConfig').then(r => r.json());
        document.getElementById('desaInfo').textContent = 
            `Desa ${config.namaDesa} | ${config.tanggal}`;
        
        // Load existing data
        const data = await fetch(API_URL + `?action=getDataTPS&tps=${tpsNumber}`).then(r => r.json());
        
        document.getElementById('pemilih').value = data.pemilih;
        document.getElementById('tidakSah').value = data.tidakSah;
        
        // Generate calon inputs
        const jmlCalon = parseInt(config.jmlCalon);
        let html = '';
        for (let i = 1; i <= jmlCalon; i++) {
            html += `
                <div class="form-group">
                    <label>🗳️ Suara untuk ${config['calon'+i]}</label>
                    <input type="number" class="calon-input" 
                           id="calon${i}" min="0" 
                           value="${data['calon'+i] || 0}"
                           onchange="updateSummary()">
                </div>
            `;
        }
        document.getElementById('calonInputs').innerHTML = html;
        updateSummary();
        
        if (data.status === 'LOCKED') {
            document.querySelectorAll('input').forEach(i => i.disabled = true);
            document.querySelector('.btn-primary').style.display = 'none';
            document.getElementById('btnLock').style.display = 'none';
            showStatus('🔒 Data sudah dikunci', 'error');
        }
    } catch (error) {
        showStatus('❌ ' + error.message, 'error');
    }
}

function updateSummary() {
    let total = 0;
    document.querySelectorAll('.calon-input').forEach(input => {
        total += parseInt(input.value) || 0;
    });
    document.getElementById('summary').innerHTML = 
        `<b>Total Suara Sah: ${total}</b>`;
}

document.getElementById('inputForm').onsubmit = async function(e) {
    e.preventDefault();
    
    const data = {
        action: 'saveTPS',
        tps: tpsNumber,
        pemilih: parseInt(document.getElementById('pemilih').value),
        tidakSah: parseInt(document.getElementById('tidakSah').value),
        calon1: parseInt(document.getElementById('calon1').value),
        calon2: parseInt(document.getElementById('calon2').value),
        calon3: parseInt(document.getElementById('calon3').value)
    };
    
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            body: JSON.stringify(data)
        }).then(r => r.json());
        
        showStatus('✅ Data tersimpan: ' + response.waktu, 'success');
    } catch (error) {
        showStatus('❌ ' + error.message, 'error');
    }
};

async function lockData() {
    if (!confirm('Yakin ingin mengunci data TPS ' + tpsNumber + '?')) return;
    
    try {
        await fetch(API_URL, {
            method: 'POST',
            body: JSON.stringify({
                action: 'lockTPS',
                tps: tpsNumber
            })
        });
        
        showStatus('🔒 Data dikunci (FINAL)', 'success');
        document.querySelectorAll('input').forEach(i => i.disabled = true);
        document.querySelector('.btn-primary').style.display = 'none';
        document.getElementById('btnLock').style.display = 'none';
    } catch (error) {
        showStatus('❌ ' + error.message, 'error');
    }
}

function showStatus(msg, type) {
    const bar = document.getElementById('statusBar');
    bar.className = 'status-bar status-' + type;
    bar.textContent = msg;
}

window.onload = loadInputPage;
