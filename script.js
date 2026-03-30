const DB_PRICES = {
    pun: { 
        '07': { f1: 0.112, f2: 0.110, f3: 0.095 }, 
        '08': { f1: 0.121, f2: 0.118, f3: 0.102 }, 
        '09': { f1: 0.115, f2: 0.112, f3: 0.098 }, 
        '10': { f1: 0.108, f2: 0.105, f3: 0.092 }, 
        '11': { f1: 0.119, f2: 0.115, f3: 0.100 }, 
        '12': { f1: 0.132, f2: 0.128, f3: 0.110 }, 
        '01': { f1: 0.124, f2: 0.120, f3: 0.105 }, 
        '02': { f1: 0.115, f2: 0.112, f3: 0.098 }
    },
    psv: { '07': 0.36, '08': 0.38, '09': 0.40, '10': 0.42, '11': 0.45, '12': 0.48, '01': 0.45, '02': 0.42 }
};

const OFFERTE_SPREAD = {
    'ultraGreenCasa': { luce: 0.061, gas: 0.11 },
    'ultraGreen': { luce: 0.061, gas: 0.08 },
    'revolutionTax': { luce: 0.061, gas: 0.08 },
    'ultraGreenPMI': { luce: 0.059, gas: 0.06 },
    'ultraGreenGrandiAziende': { luce: 0.043, gas: 0.04 }
};

const months = [
    {v:'07', t:'Luglio 2025'}, {v:'08', t:'Agosto 2025'}, {v:'09', t:'Settembre 2025'},
    {v:'10', t:'Ottobre 2025'}, {v:'11', t:'Novembre 2025'}, {v:'12', t:'Dicembre 2025'},
    {v:'01', t:'Gennaio 2026'}, {v:'02', t:'Febbraio 2026'}
];

// Mostra/Nasconde sezioni Luce/Gas e i campi Fasce/Monoraria
function toggleSections() {
    const val = document.getElementById('utilityType').value;
    document.getElementById('light-section').style.display = (val === 'light' || val === 'lightAndGas') ? 'block' : 'none';
    document.getElementById('gas-section').style.display = (val === 'gas' || val === 'lightAndGas') ? 'block' : 'none';
    
    // Gestione campi Fasce vs Monoraria
    const tipoLettura = document.getElementById('tipoLettura').value;
    const divFasce = document.getElementById('div-fasce'); // Assicurati di avere questo ID nell'HTML
    const divMono = document.getElementById('div-mono');   // Assicurati di avere questo ID nell'HTML
    
    if(divFasce && divMono) {
        divFasce.style.display = (tipoLettura === 'fasce') ? 'block' : 'none';
        divMono.style.display = (tipoLettura === 'monoraria') ? 'block' : 'none';
    }
}

function updateOffersDropdown() {
    const userType = document.getElementById('userType').value;
    const optionCasa = document.getElementById('opt-casa');
    const selectedOffer = document.getElementById('selectedOffer');
    if (!optionCasa) return;
    if (userType === 'business') {
        optionCasa.style.display = 'none';
        if (selectedOffer.value === 'ultraGreenCasa') selectedOffer.value = '';
    } else {
        optionCasa.style.display = 'block';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const mSelL = document.getElementById('monthLuce');
    const mSelG = document.getElementById('monthGas');
    months.forEach(m => {
        if(mSelL) mSelL.add(new Option(m.t, m.v));
        if(mSelG) mSelG.add(new Option(m.t, m.v));
    });
    
    document.getElementById('utilityType').addEventListener('change', toggleSections);
    document.getElementById('userType').addEventListener('change', updateOffersDropdown);
    document.getElementById('tipoLettura').addEventListener('change', toggleSections);
    
    toggleSections();
    updateOffersDropdown();
});

document.getElementById('calculator-form').onsubmit = function(e) {
    e.preventDefault();
    const offer = document.getElementById('selectedOffer').value;
    const userType = document.getElementById('userType').value;
    const utente = document.getElementById('clientName').value;
    const utility = document.getElementById('utilityType').value;

    let ogt = (userType === 'consumer') ? (offer === 'ultraGreenCasa' ? 12.00 : 8.95) : (offer === 'ultraGreenPMI' || offer === 'ultraGreenGrandiAziende' ? 19.95 : 14.95);
    let spreadAttuale = OFFERTE_SPREAD[offer] || { luce: 0.055, gas: 0.20 };

    let totalSaveAnnuo = 0;
    let reportHtml = `<div id="report-box" style="padding:30px; border:3px solid #2e7d32; background:white; border-radius:10px;">
        <h2 style="color:#2e7d32; text-align:center; border-bottom:2px solid #eee; padding-bottom:10px;">Analisi per ${utente}</h2>`;

    if (utility === 'light' || utility === 'lightAndGas') {
        const freq = parseInt(document.getElementById('freqLuce').value);
        const annuo = parseFloat(document.getElementById('annuoLuce').value) || 0;
        const spesaP = parseFloat(document.getElementById('costMateriaLuce').value) || 0;
        const mKey = document.getElementById('monthLuce').value;
        const tipoLettura = document.getElementById('tipoLettura').value;

        let costoEnergiaPura = 0;
        let consP = 0;
        let punMese = DB_PRICES.pun[mKey];

        if (tipoLettura === 'fasce') {
            const f1 = parseFloat(document.getElementById('kWhF1').value) || 0;
            const f2 = parseFloat(document.getElementById('kWhF2').value) || 0;
            const f3 = parseFloat(document.getElementById('kWhF3').value) || 0;
            consP = f1 + f2 + f3;
            costoEnergiaPura = (f1 * punMese.f1) + (f2 * punMese.f2) + (f3 * punMese.f3);
        } else {
            consP = parseFloat(document.getElementById('kWhTot').value) || 0;
            // Media semplice delle 3 fasce per simulare la monoraria
            let punMedio = (punMese.f1 + punMese.f2 + punMese.f3) / 3;
            costoEnergiaPura = consP * punMedio;
        }

        let nuovaSpesa = costoEnergiaPura + (consP * spreadAttuale.luce) + (ogt * freq);
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
        
        let nuovaSpesa = (consP * (DB_PRICES.psv[mKey] + spreadAttuale.gas)) + (ogt * freq);
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
