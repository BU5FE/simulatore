const DB_PRICES = {
    pun: { '07': 0.112, '08': 0.121, '09': 0.115, '10': 0.108, '11': 0.119, '12': 0.132, '01': 0.124, '02': 0.115 },
    psv: { '07': 0.36, '08': 0.38, '09': 0.40, '10': 0.42, '11': 0.45, '12': 0.48, '01': 0.45, '02': 0.42 }
};

const months = [
    {v:'07', t:'Luglio 2025'}, {v:'08', t:'Agosto 2025'}, {v:'09', t:'Settembre 2025'},
    {v:'10', t:'Ottobre 2025'}, {v:'11', t:'Novembre 2025'}, {v:'12', t:'Dicembre 2025'},
    {v:'01', t:'Gennaio 2026'}, {v:'02', t:'Febbraio 2026'}
];

// Funzione per mostrare/nascondere sezioni
function toggleSections() {
    const val = document.getElementById('utilityType').value;
    document.getElementById('light-section').style.display = (val === 'light' || val === 'lightAndGas') ? 'block' : 'none';
    document.getElementById('gas-section').style.display = (val === 'gas' || val === 'lightAndGas') ? 'block' : 'none';
}

document.addEventListener('DOMContentLoaded', () => {
    // Popola mesi
    const mSelL = document.getElementById('monthLuce');
    const mSelG = document.getElementById('monthGas');
    months.forEach(m => {
        if(mSelL) mSelL.add(new Option(m.t, m.v));
        if(mSelG) mSelG.add(new Option(m.t, m.v));
    });

    // Attiva i sensori di cambio
    document.getElementById('utilityType').addEventListener('change', toggleSections);
    
    // Esegui subito per impostare lo stato iniziale
    toggleSections();
});

document.getElementById('calculator-form').onsubmit = function(e) {
    e.preventDefault();
    const offer = document.getElementById('selectedOffer').value;
    const userType = document.getElementById('userType').value;
    const utente = document.getElementById('clientName').value;
    const utility = document.getElementById('utilityType').value;

    let ogt = (userType === 'consumer') ? (offer === 'ultraGreenFix' ? 12.00 : 8.95) : (offer === 'ultraGreenPMI' || offer === 'ultraGreenGrandiAziende' ? 19.95 : 14.95);

    let totalSaveAnnuo = 0;
    let reportHtml = `<div id="report-box" style="padding:30px; border:3px solid #2e7d32; background:white; border-radius:10px;">
        <h2 style="color:#2e7d32; text-align:center; border-bottom:2px solid #eee; padding-bottom:10px;">Analisi per ${utente}</h2>`;

    if (utility === 'light' || utility === 'lightAndGas') {
        const freq = parseInt(document.getElementById('freqLuce').value);
        const annuo = parseFloat(document.getElementById('annuoLuce').value) || 0;
        const spesaP = parseFloat(document.getElementById('costMateriaLuce').value) || 0;
        const consP = parseFloat(document.getElementById('kWhTot').value) || 0;
        const mKey = document.getElementById('monthLuce').value;
        let nuovaSpesa = (consP * (DB_PRICES.pun[mKey] + 0.055)) + (ogt * freq);
        let saveA = ((spesaP - nuovaSpesa) / (consP || 1)) * annuo;
        totalSaveAnnuo += saveA;
        reportHtml += `<p style="font-size:1.1em;">Risparmio Annuo Luce: <strong style="color:green;">€ ${saveA.toFixed(2)}</strong></p>`;
    }

    if (utility === 'gas' || utility === 'lightAndGas') {
        const freq = parseInt(document.getElementById('freqGas').value);
        const annuo = parseFloat(document.getElementById('annuoGas').value) || 0;
        const spesaP = parseFloat(document.getElementById('costMateriaGas').value) || 0;
        const consP = parseFloat(document.getElementById('smcTot').value) || 0;
        const mKey = document.getElementById('monthGas').value;
        let nuovaSpesa = (consP * (DB_PRICES.psv[mKey] + 0.20)) + (ogt * freq);
        let saveA = ((spesaP - nuovaSpesa) / (consP || 1)) * annuo;
        totalSaveAnnuo += saveA;
        reportHtml += `<p style="font-size:1.1em;">Risparmio Annuo Gas: <strong style="color:green;">€ ${saveA.toFixed(2)}</strong></p>`;
    }

    reportHtml += `
        <div style="background:#2e7d32; color:white; padding:20px; text-align:center; border-radius:8px; margin-top:20px;">
            <span style="text-transform:uppercase; font-size:0.9em;">Risparmio Totale Annuo</span><br>
            <span style="font-size:2.5em; font-weight:bold;">€ ${totalSaveAnnuo.toFixed(2)}</span>
        </div>
    </div>`;

    document.getElementById('result').innerHTML = reportHtml;
    document.getElementById('result').style.display = 'block';
    document.getElementById('export-actions').style.display = 'block';
};

window.exportDoc = function() {
    const el = document.getElementById('report-box');
    html2canvas(el, { scale: 2 }).then(canvas => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jspdf.jsPDF();
        pdf.addImage(imgData, 'PNG', 10, 10, 190, 0);
        pdf.save('Report_Risparmio.pdf');
    });
};
