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

// Gestione dinamica visibilità campi
function toggleSections() {
    const utility = document.getElementById('utilityType').value;
    const lettura = document.getElementById('tipoLettura').value;
    const freqLuce = document.getElementById('freqLuce').value;
    const freqGas = document.getElementById('freqGas').value;

    // Sezioni Principali
    document.getElementById('light-section').style.display = (utility === 'light' || utility === 'lightAndGas') ? 'block' : 'none';
    document.getElementById('gas-section').style.display = (utility === 'gas' || utility === 'lightAndGas') ? 'block' : 'none';

    // Gestione Bimestrale Luce
    const lightM2 = document.getElementById('light-mese2');
    if (freqLuce === "2" && (utility === 'light' || utility === 'lightAndGas')) {
        lightM2.classList.remove('hidden');
    } else {
        lightM2.classList.add('hidden');
    }

    // Gestione Bimestrale Gas
    const gasM2 = document.getElementById('gas-mese2');
    if (freqGas === "2" && (utility === 'gas' || utility === 'lightAndGas')) {
        gasM2.classList.remove('hidden');
    } else {
        gasM2.classList.add('hidden');
    }

    // Gestione Monoraria vs Fasce (Mese 1)
    const divMono1 = document.getElementById('div-mono1');
    const divFasce1 = document.getElementById('div-fasce1');
    if (lettura === 'fasce') {
        divFasce1.classList.remove('hidden');
        divMono1.classList.add('hidden');
    } else {
        divFasce1.classList.add('hidden');
        divMono1.classList.remove('hidden');
    }

    // Gestione Monoraria vs Fasce (Mese 2)
    const divMono2 = document.getElementById('div-mono2');
    const divFasce2 = document.getElementById('div-fasce2');
    if (lettura === 'fasce') {
        divFasce2.classList.remove('hidden');
        divMono2.classList.add('hidden');
    } else {
        divFasce2.classList.add('hidden');
        divMono2.classList.remove('hidden');
    }
}

// Nasconde offerta Casa per i Business
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
    // Popolamento select mesi
    const dropIds = ['monthLuce1', 'monthLuce2', 'monthGas1', 'monthGas2'];
    dropIds.forEach(id => {
        const el = document.getElementById(id);
        if (el) months.forEach(m => el.add(new Option(m.t, m.v)));
    });

    document.getElementById('utilityType').addEventListener('change', toggleSections);
    document.getElementById('tipoLettura').addEventListener('change', toggleSections);
    document.getElementById('freqLuce').addEventListener('change', toggleSections);
    document.getElementById('freqGas').addEventListener('change', toggleSections);
    document.getElementById('userType').addEventListener('change', updateOffersDropdown);
    
    toggleSections();
    updateOffersDropdown();
});

// LOGICA DI CALCOLO
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

    // CALCOLO LUCE
    if (utility === 'light' || utility === 'lightAndGas') {
        const freq = parseInt(document.getElementById('freqLuce').value);
        const annuo = parseFloat(document.getElementById('annuoLuce').value) || 0;
        const spesaP = parseFloat(document.getElementById('costMateriaLuce').value) || 0;
        const tipoLettura = document.getElementById('tipoLettura').value;

        let consTotale = 0;
        let costoEnergiaPura = 0;

        // Mese 1
        const m1 = document.getElementById('monthLuce1').value;
        const pun1 = DB_PRICES.pun[m1];
        if (tipoLettura === 'fasce') {
            const f1 = parseFloat(document.getElementById('kWhF1_M1').value) || 0;
            const f2 = parseFloat(document.getElementById('kWhF2_M1').value) || 0;
            const f3 = parseFloat(document.getElementById('kWhF3_M1').value) || 0;
            consTotale += (f1 + f2 + f3);
            costoEnergiaPura += (f1 * pun1.f1) + (f2 * pun1.f2) + (f3 * pun1.f3);
        } else {
            const mono = parseFloat(document.getElementById('kWhTot1').value) || 0;
            consTotale += mono;
            costoEnergiaPura += mono * ((pun1.f1 + pun1.f2 + pun1.f3) / 3);
        }

        // Mese 2 (se bimestrale)
        if (freq === 2) {
            const m2 = document.getElementById('monthLuce2').value;
            const pun2 = DB_PRICES.pun[m2];
            if (tipoLettura === 'fasce') {
                const f1 = parseFloat(document.getElementById('kWhF1_M2').value) || 0;
                const f2 = parseFloat(document.getElementById('kWhF2_M2').value) || 0;
                const f3 = parseFloat(document.getElementById('kWhF3_M2').value) || 0;
                consTotale += (f1 + f2 + f3);
                costoEnergiaPura += (f1 * pun2.f1) + (f2 * pun2.f2) + (f3 * pun2.f3);
            } else {
                const mono = parseFloat(document.getElementById('kWhTot2').value) || 0;
                consTotale += mono;
                costoEnergiaPura += mono * ((pun2.f1 + pun2.f2 + pun2.f3) / 3);
            }
        }

        let nuovaSpesa = costoEnergiaPura + (consTotale * spreadAttuale.luce) + (ogt * freq);
        let saveA = ((spesaP - nuovaSpesa) / (consTotale || 1)) * annuo;
        totalSaveAnnuo += saveA;
        
        reportHtml += `<p style="font-size:1.1em;">Risparmio Annuo Luce: <strong style="color:green;">€ ${saveA.toFixed(2)}</strong></p>`;
    }

    // CALCOLO GAS
    if (utility === 'gas' || utility === 'lightAndGas') {
        const freq = parseInt(document.getElementById('freqGas').value);
        const annuo = parseFloat(document.getElementById('annuoGas').value) || 0;
        const spesaP = parseFloat(document.getElementById('costMateriaGas').value) || 0;

        let consTotale = 0;
        let costoGasPuro = 0;

        // Mese 1
        const m1 = document.getElementById('monthGas1').value;
        const cons1 = parseFloat(document.getElementById('smcTot1').value) || 0;
        consTotale += cons1;
        costoGasPuro += cons1 * DB_PRICES.psv[m1];

        // Mese 2
        if (freq === 2) {
            const m2 = document.getElementById('monthGas2').value;
            const cons2 = parseFloat(document.getElementById('smcTot2').value) || 0;
            consTotale += cons2;
            costoGasPuro += cons2 * DB_PRICES.psv[m2];
        }

        let nuovaSpesa = costoGasPuro + (consTotale * spreadAttuale.gas) + (ogt * freq);
        let saveA = ((spesaP - nuovaSpesa) / (consTotale || 1)) * annuo;
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
