onst DB_PRICES = {
    pun: { '07': 0.112, '08': 0.121, '09': 0.115, '10': 0.108, '11': 0.119, '12': 0.132, '01': 0.124, '02': 0.115 },
    psv: { '07': 0.36, '08': 0.38, '09': 0.40, '10': 0.42, '11': 0.45, '12': 0.48, '01': 0.45, '02': 0.42 }
};

const months = [
    {v:'07', t:'Luglio 2025'}, {v:'08', t:'Agosto 2025'}, {v:'09', t:'Settembre 2025'},
    {v:'10', t:'Ottobre 2025'}, {v:'11', t:'Novembre 2025'}, {v:'12', t:'Dicembre 2025'},
    {v:'01', t:'Gennaio 2026'}, {v:'02', t:'Febbraio 2026'}
];

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

document.getElementById('calculator-form').onsubmit = function(e) {
    e.preventDefault();
    const offer = document.getElementById('selectedOffer').value;
    const userType = document.getElementById('userType').value;
    const utente = document.getElementById('clientName').value;
    const utility = document.getElementById('utilityType').value;

    let ogtL = (userType === 'consumer') ? (offer === 'ultraGreenFix' ? 12.00 : 8.95) : (offer === 'ultraGreenPMI' || offer === 'ultraGreenGrandiAziende' ? 19.95 : 14.95);
    let ogtG = ogtL; 

    let reportHtml = `
    <div id="report-box" style="padding:40px; border:1px solid #ddd; background:#fff; font-family: 'Segoe UI', Arial, sans-serif; color:#333; max-width:800px; margin:auto; box-shadow: 0 10px 30px rgba(0,0,0,0.1); border-radius:15px;">
        <div style="text-align:center; border-bottom:2px solid #2e7d32; padding-bottom:20px; margin-bottom:30px;">
            <h1 style="color:#2e7d32; margin:0; text-transform:uppercase; letter-spacing:1px;">Analisi Risparmio Energetico</h1>
            <p style="margin:5px 0 0 0; color:#666;">Preparato per: <strong>${utente}</strong> | Data: ${new Date().toLocaleDateString()}</p>
        </div>
        
        <div style="display:flex; justify-content:space-between; margin-bottom:30px; background:#f9f9f9; padding:15px; border-radius:10px;">
            <span>Profilo: <strong>${userType.toUpperCase()}</strong></span>
            <span>Offerta: <strong>${offer}</strong></span>
        </div>`;

    let totalSaveAnnuo = 0;

    if (utility.includes('light')) {
        const freq = parseInt(document.getElementById('freqLuce').value);
        const annuo = parseFloat(document.getElementById('annuoLuce').value) || 0;
        const spesaP = parseFloat(document.getElementById('costMateriaLuce').value) || 0;
        const consP = parseFloat(document.getElementById('kWhTot').value) || 0;
        const mKey = document.getElementById('monthLuce').value;

        let spread = 0.055; 
        let nuovaSpesa = (consP * (DB_PRICES.pun[mKey] + spread)) + (ogtL * freq);
        let saveP = spesaP - nuovaSpesa;
        let saveA = (saveP / (consP || 1)) * annuo;
        totalSaveAnnuo += saveA;

        reportHtml += `
        <div style="margin-bottom:25px; border:1px solid #e0e0e0; border-radius:10px; overflow:hidden;">
            <div style="background:#2e7d32; color:#fff; padding:10px 15px; font-weight:bold;">DETTAGLIO FORNITURA LUCE</div>
            <div style="padding:15px;">
                <table style="width:100%; border-collapse:collapse;">
                    <tr><td style="padding:8px 0; border-bottom:1px solid #eee;">Consumo Periodo (${freq} m.)</td><td style="text-align:right; font-weight:bold;">${consP} kWh</td></tr>
                    <tr><td style="padding:8px 0; border-bottom:1px solid #eee;">Quota OGT applicata</td><td style="text-align:right; font-weight:bold;">€ ${ogtL.toFixed(2)} /mese</td></tr>
                    <tr><td style="padding:8px 0; color:#d32f2f;">Spesa Attuale Materia</td><td style="text-align:right; color:#d32f2f; font-weight:bold;">€ ${spesaP.toFixed(2)}</td></tr>
                    <tr style="background:#f1f8e9;"><td style="padding:8px 0; color:#2e7d32; font-weight:bold;">Risparmio nel Periodo</td><td style="text-align:right; color:#2e7d32; font-weight:bold;">€ ${saveP.toFixed(2)}</td></tr>
                </table>
            </div>
        </div>`;
    }

    if (utility.includes('gas')) {
        const freq = parseInt(document.getElementById('freqGas').value);
        const annuo = parseFloat(document.getElementById('annuoGas').value) || 0;
        const spesaP = parseFloat(document.getElementById('costMateriaGas').value) || 0;
        const consP = parseFloat(document.getElementById('smcTot').value) || 0;
        const mKey = document.getElementById('monthGas').value;

        let spread = 0.20; 
        let nuovaSpesa = (consP * (DB_PRICES.psv[mKey] + spread)) + (ogtG * freq);
        let saveP = spesaP - nuovaSpesa;
        let saveA = (saveP / (consP || 1)) * annuo;
        totalSaveAnnuo += saveA;

        reportHtml += `
        <div style="margin-bottom:25px; border:1px solid #e0e0e0; border-radius:10px; overflow:hidden;">
            <div style="background:#e65100; color:#fff; padding:10px 15px; font-weight:bold;">DETTAGLIO FORNITURA GAS</div>
            <div style="padding:15px;">
                <table style="width:100%; border-collapse:collapse;">
                    <tr><td style="padding:8px 0; border-bottom:1px solid #eee;">Consumo Periodo (${freq} m.)</td><td style="text-align:right; font-weight:bold;">${consP} smc</td></tr>
                    <tr><td style="padding:8px 0; border-bottom:1px solid #eee;">Quota OGT applicata</td><td style="text-align:right; font-weight:bold;">€ ${ogtG.toFixed(2)} /mese</td></tr>
                    <tr><td style="padding:8px 0; color:#d32f2f;">Spesa Attuale Materia</td><td style="text-align:right; color:#d32f2f; font-weight:bold;">€ ${spesaP.toFixed(2)}</td></tr>
                    <tr style="background:#fff3e0;"><td style="padding:8px 0; color:#e65100; font-weight:bold;">Risparmio nel Periodo</td><td style="text-align:right; color:#e65100; font-weight:bold;">€ ${saveP.toFixed(2)}</td></tr>
                </table>
            </div>
        </div>`;
    }

    reportHtml += `
        <div style="margin-top:40px; padding:30px; background:#2e7d32; color:#fff; border-radius:15px; text-align:center;">
            <p style="margin:0; font-size:1.2em; text-transform:uppercase; letter-spacing:1px;">Risparmio Totale Annuo Stimato</p>
            <h2 style="margin:10px 0 0 0; font-size:3.5em; font-weight:bold;">€ ${totalSaveAnnuo.toFixed(2)}</h2>
        </div>
        <p style="text-align:center; font-size:0.8em; color:#999; margin-top:20px;">* L'analisi si basa sui dati forniti e sulle quotazioni di mercato attuali.</p>
    </div>`;

    const resDiv = document.getElementById('result');
    resDiv.innerHTML = reportHtml;
    resDiv.style.display = 'block';
    document.getElementById('export-actions').style.display = 'block';
    window.scrollTo({ top: resDiv.offsetTop - 20, behavior: 'smooth' });
};

window.exportDoc = function(type) {
    const el = document.getElementById('report-box');
    html2canvas(el, { scale: 3, useCORS: true }).then(canvas => {
        const img = canvas.toDataURL('image/png');
        const pdf = new jspdf.jsPDF('p', 'mm', 'a4');
        const width = pdf.internal.pageSize.getWidth();
        const imgProps = pdf.getImageProperties(img);
        const pdfHeight = (imgProps.height * (width - 20)) / imgProps.width;
        pdf.addImage(img, 'PNG', 10, 10, width - 20, pdfHeight);
        pdf.save('Analisi_Risparmio_Energetico.pdf');
    });
};
