// --- 1. DATABASE PREZZI (PUN e PSV) ---
const DB_PRICES = {
    pun: { '07': 0.112, '08': 0.121, '09': 0.115, '10': 0.108, '11': 0.119, '12': 0.132, '01': 0.124, '02': 0.115 },
    psv: { '07': 0.36, '08': 0.38, '09': 0.40, '10': 0.42, '11': 0.45, '12': 0.48, '01': 0.45, '02': 0.42 }
};

const months = [
    {v:'07', t:'Luglio 2025'}, {v:'08', t:'Agosto 2025'}, {v:'09', t:'Settembre 2025'},
    {v:'10', t:'Ottobre 2025'}, {v:'11', t:'Novembre 2025'}, {v:'12', t:'Dicembre 2025'},
    {v:'01', t:'Gennaio 2026'}, {v:'02', t:'Febbraio 2026'}
];

// --- 2. INIZIALIZZAZIONE INTERFACCIA ---
document.addEventListener('DOMContentLoaded', () => {
    const mSelL = document.getElementById('monthLuce');
    const mSelG = document.getElementById('monthGas');
    if(mSelL && mSelG) {
        months.forEach(m => {
            mSelL.add(new Option(m.t, m.v));
            mSelG.add(new Option(m.t, m.v));
        });
    }
    document.getElementById('utilityType').onchange = toggleSections;
    toggleSections();
});

function toggleSections() {
    const val = document.getElementById('utilityType').value;
    document.getElementById('light-section').style.display = val.includes('light') ? 'block' : 'none';
    document.getElementById('gas-section').style.display = val.includes('gas') ? 'block' : 'none';
}

// --- 3. LOGICA DI CALCOLO E REPORT ---
document.getElementById('calculator-form').onsubmit = function(e) {
    e.preventDefault();
    const offer = document.getElementById('selectedOffer').value;
    const userType = document.getElementById('userType').value;
    const utente = document.getElementById('clientName').value;
    const utility = document.getElementById('utilityType').value;

    // --- NUOVA LOGICA OGT AGGIORNATA ---
    let ogtL, ogtG;
    if (userType === 'consumer') {
        // Consumer: 12€ se FIX, altrimenti 8.95€
        const quota = (offer === 'ultraGreenFix') ? 12.00 : 8.95;
        ogtL = quota; ogtG = quota;
    } else {
        // Business: Revolution/FIX 14.95€, PMI/GrandiAziende 19.95€
        const quota = (offer === 'ultraGreenPMI' || offer === 'ultraGreenGrandiAziende') ? 19.95 : 14.95;
        ogtL = quota; ogtG = quota;
    }

    let reportHtml = `<div id="report-box" style="padding:30px; border:3px solid #2e7d32; background:#fff; font-family:Arial; line-height:1.6; color:#333;">
        <h2 style="text-align:center; color:#2e7d32; border-bottom:2px solid #2e7d32; padding-bottom:10px; margin-bottom:20px;">ANALISI COMPARATIVA RISPARMIO</h2>
        <p><strong>Cliente:</strong> ${utente} <span style="float:right">Data: ${new Date().toLocaleDateString()}</span></p>
        <p><strong>Profilo:</strong> ${userType.toUpperCase()} | <strong>Offerta Proposta:</strong> ${offer}</p>`;

    let totalSaveAnnuo = 0;

    // Calcolo LUCE
    if (utility.includes('light')) {
        const freq = parseInt(document.getElementById('freqLuce').value);
        const annuo = parseFloat(document.getElementById('annuoLuce').value) || 0;
        const spesaP = parseFloat(document.getElementById('costMateriaLuce').value) || 0;
        const consP = parseFloat(document.getElementById('kWhTot').value) || 0;
        const mKey = document.getElementById('monthLuce').value;

        let spread = 0.055; // Placeholder
        let nuovaSpesa = (consP * (DB_PRICES.pun[mKey] + spread)) + (ogtL * freq);
        let saveP = spesaP - nuovaSpesa;
        let saveA = (saveP / (consP || 1)) * annuo;
        totalSaveAnnuo += saveA;

        reportHtml += `<div style="margin-top:20px; border:1px solid #c8e6c9; padding:15px; border-radius:8px; background:#f1f8e9;">
            <h3 style="margin:0 0 10px 0; color:#2e7d32; border-bottom:1px solid #2e7d32;">DETTAGLIO FORNITURA LUCE</h3>
            <p>Quota Fissa OGT: <strong>€ ${ogtL.toFixed(2)}/mese</strong> | Periodo: ${freq} mese/i</p>
            <p>Consumo analizzato: ${consP} kWh | Risparmio nel periodo: <strong style="color:#2e7d32;">€ ${saveP.toFixed(2)}</strong></p>
        </div>`;
    }

    // Calcolo GAS
    if (utility.includes('gas')) {
        const freq = parseInt(document.getElementById('freqGas').value);
        const annuo = parseFloat(document.getElementById('annuoGas').value) || 0;
        const spesaP = parseFloat(document.getElementById('costMateriaGas').value) || 0;
        const consP = parseFloat(document.getElementById('smcTot').value) || 0;
        const mKey = document.getElementById('monthGas').value;

        let spread = 0.20; // Placeholder
        let nuovaSpesa = (consP * (DB_PRICES.psv[mKey] + spread)) + (ogtG * freq);
        let saveP = spesaP - nuovaSpesa;
        let saveA = (saveP / (consP || 1)) * annuo;
        totalSaveAnnuo += saveA;

        reportHtml += `<div style="margin-top:20px; border:1px solid #ffe0b2; padding:15px; border-radius:8px; background:#fff3e0;">
            <h3 style="margin:0 0 10px 0; color:#e65100; border-bottom:1px solid #e65100;">DETTAGLIO FORNITURA GAS</h3>
            <p>Quota Fissa OGT: <strong>€ ${ogtG.toFixed(2)}/mese</strong> | Periodo: ${freq} mese/i</p>
            <p>Consumo analizzato: ${consP} smc | Risparmio nel periodo: <strong style="color:#e65100;">€ ${saveP.toFixed(2)}</strong></p>
        </div>`;
    }

    reportHtml += `<div style="margin-top:30px; padding:20px; background:#2e7d32; color:#fff; border-radius:10px; text-align:center; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
        <span style="font-size:1.2em; text-transform:uppercase;">Risparmio Totale Annuo Stimato</span><br>
        <span style="font-size:2.5em; font-weight:bold;">€ ${totalSaveAnnuo.toFixed(2)}</span>
    </div></div>`;

    document.getElementById('result').innerHTML = reportHtml;
    document.getElementById('result').style.display = 'block';
    document.getElementById('export-actions').style.display = 'block';
};

// --- 4. ESPORTAZIONE ---
window.exportDoc = function(type) {
    const el = document.getElementById('report-box');
    html2canvas(el, { scale: 2 }).then(canvas => {
        const img = canvas.toDataURL('image/png');
        const pdf = new jspdf.jsPDF();
        const width = pdf.internal.pageSize.getWidth();
        pdf.addImage(img, 'PNG', 10, 10, width - 20, 0);
        pdf.save('Analisi_Risparmio_Energetico.pdf');
    });
};
