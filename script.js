const DB_PRICES = {
    pun: { 
        '07': { f1: 0.125, f2: 0.118, f3: 0.098 }, 
        '08': { f1: 0.135, f2: 0.128, f3: 0.105 }, 
        '09': { f1: 0.128, f2: 0.122, f3: 0.100 }, 
        '10': { f1: 0.118, f2: 0.112, f3: 0.095 }, 
        '11': { f1: 0.130, f2: 0.124, f3: 0.108 }, 
        '12': { f1: 0.145, f2: 0.138, f3: 0.115 }, 
        '01': { f1: 0.138, f2: 0.130, f3: 0.110 }, 
        '02': { f1: 0.128, f2: 0.122, f3: 0.100 }
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

function toggleSections() {
    const utility = document.getElementById('utilityType').value;
    const lettura = document.getElementById('tipoLettura').value;

    const lightSec = document.getElementById('light-section');
    const gasSec = document.getElementById('gas-section');
    const divMono = document.getElementById('div-mono');
    const divFasce = document.getElementById('div-fasce');

    // Visibilità Luce/Gas
    if (utility === 'light' || utility === 'lightAndGas') {
        lightSec.style.display = 'block';
    } else {
        lightSec.style.display = 'none';
    }

    if (utility === 'gas' || utility === 'lightAndGas') {
        gasSec.style.display = 'block';
    } else {
        gasSec.style.display = 'none';
    }

    // Visibilità Fasce
    if (lettura === 'fasce') {
        divFasce.classList.remove('hidden');
        divFasce.style.display = 'block';
        divMono.style.display = 'none';
    } else {
        divFasce.classList.add('hidden');
        divFasce.style.display = 'none';
        divMono.style.display = 'block';
    }
}

// Funzione infallibile per nascondere l'offerta Casa se è selezionato Business
function updateOffersDropdown() {
    const userType = document.getElementById('userType').value;
    const optionCasa = document.getElementById('opt-casa');
    const selectedOffer = document.getElementById('selectedOffer');

    if (!optionCasa) return;

    if (userType === 'business') {
        optionCasa.classList.add('hidden');
        optionCasa.style.display = 'none'; // Doppia sicurezza
        
        // Se per sbaglio era selezionata l'offerta casa, resetta la scelta
        if (selectedOffer.value === 'ultraGreenCasa') {
            selectedOffer.value = '';
        }
    } else {
        optionCasa.classList.remove('hidden');
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
    document.getElementById('tipoLettura').addEventListener('change', toggleSections);
    document.getElementById('userType').addEventListener('change', updateOffersDropdown);
    
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
    
    // Mostra il pulsante PDF (Sbloccato anche questo da hidden)
    const exportSec = document.getElementById('export-actions');
    exportSec.classList.remove('hidden');
    exportSec.style.display = 'block';
};

window.exportDoc = function() {
    const el = document.getElementById('report-box');
    html2canvas(el, { scale: 2 }).then(canvas => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jspdf.jsPDF();
        pdf.addImage(imgData, 'PNG', 10, 10, 190, 0);
        pdf.save('Report_Risparmio_UltraGreen.pdf');
    });
};
