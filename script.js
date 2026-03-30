Questo è un bug fastidioso, ma so esattamente cosa sta succedendo. Succede spesso quando ci sono degli "ascoltatori di eventi" (Event Listeners) che si sovrappongono o quando il browser interpreta un cambio di selezione come un segnale per "pulire" il form.

Il problema principale è probabilmente legato a come viene gestito l'evento change. Se il codice ri-esegue una funzione che tocca gli innerHTML o se ci sono conflitti tra gli ID, i valori digitati spariscono.

Ecco il codice JavaScript definitivo e "blindato". Ho aggiunto una protezione: i valori vengono toccati solo se sei tu a scriverli, e il cambio di sezione (Luce/Gas/Fasce) cambierà solo la visibilità senza mai svuotare i campi.

JavaScript Corretto (Sostituisci tutto il tuo script.js)
JavaScript
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

// Funzione chirurgica per la visibilità: NON tocca i valori (value)
function toggleSections() {
    const utility = document.getElementById('utilityType').value;
    const lettura = document.getElementById('tipoLettura').value;

    // Sezioni Luce e Gas
    document.getElementById('light-section').style.display = (utility === 'light' || utility === 'lightAndGas') ? 'block' : 'none';
    document.getElementById('gas-section').style.display = (utility === 'gas' || utility === 'lightAndGas') ? 'block' : 'none';

    // Sotto-sezioni Monoraria e Fasce (F1, F2, F3 separate)
    const divMono = document.getElementById('div-mono');
    const divFasce = document.getElementById('div-fasce');

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

// Gestione dinamica menu offerte (Azienda vs Privato)
function updateOffersDropdown() {
    const userType = document.getElementById('userType').value;
    const optCasa = document.getElementById('opt-casa');
    const selOffer = document.getElementById('selectedOffer');

    if (optCasa) {
        if (userType === 'business') {
            optCasa.style.display = 'none';
            if (selOffer.value === 'ultraGreenCasa') selOffer.value = '';
        } else {
            optCasa.style.display = 'block';
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    // Popolamento mesi
    const mSelL = document.getElementById('monthLuce');
    const mSelG = document.getElementById('monthGas');
    months.forEach(m => {
        if(mSelL) mSelL.add(new Option(m.t, m.v));
        if(mSelG) mSelG.add(new Option(m.t, m.v));
    });

    // Event Listeners - Usiamo 'change' ma senza resettare i campi
    document.getElementById('utilityType').addEventListener('change', toggleSections);
    document.getElementById('tipoLettura').addEventListener('change', toggleSections);
    document.getElementById('userType').addEventListener('change', updateOffersDropdown);

    // Stato iniziale
    toggleSections();
    updateOffersDropdown();
});

document.getElementById('calculator-form').onsubmit = function(e) {
    e.preventDefault();
    
    const offer = document.getElementById('selectedOffer').value;
    const userType = document.getElementById('userType').value;
    const utente = document.getElementById('clientName').value;
    const utility = document.getElementById('utilityType').value;

    // Calcolo OGT
    let ogt = (userType === 'consumer') ? (offer === 'ultraGreenCasa' ? 12.00 : 8.95) : (offer === 'ultraGreenPMI' || offer === 'ultraGreenGrandiAziende' ? 19.95 : 14.95);
    let spread = OFFERTE_SPREAD[offer] || { luce: 0.055, gas: 0.20 };

    let totalSave = 0;
    let reportHtml = `<div id="report-box" style="padding:30px; border:3px solid #2e7d32; background:white; border-radius:10px;">
        <h2 style="color:#2e7d32; text-align:center; border-bottom:2px solid #eee; padding-bottom:10px;">Analisi per ${utente}</h2>`;

    // LOGICA LUCE
    if (utility === 'light' || utility === 'lightAndGas') {
        const mKey = document.getElementById('monthLuce').value;
        const tipoL = document.getElementById('tipoLettura').value;
        const freq = parseInt(document.getElementById('freqLuce').value);
        const annuo = parseFloat(document.getElementById('annuoLuce').value) || 0;
        const spesaP = parseFloat(document.getElementById('costMateriaLuce').value) || 0;
        
        let consP = 0;
        let costoEnergia = 0;
        const pun = DB_PRICES.pun[mKey];

        if (tipoL === 'fasce') {
            const f1 = parseFloat(document.getElementById('kWhF1').value) || 0;
            const f2 = parseFloat(document.getElementById('kWhF2').value) || 0;
            const f3 = parseFloat(document.getElementById('kWhF3').value) || 0;
            consP = f1 + f2 + f3;
            costoEnergia = (f1 * pun.f1) + (f2 * pun.f2) + (f3 * pun.f3);
        } else {
            consP = parseFloat(document.getElementById('kWhTot').value) || 0;
            costoEnergia = consP * ((pun.f1 + pun.f2 + pun.f3) / 3);
        }

        let nuovaSpesa = costoEnergia + (consP * spread.luce) + (ogt * freq);
        let saveLuce = ((spesaP - nuovaSpesa) / (consP || 1)) * annuo;
        totalSave += saveLuce;
        reportHtml += `<p>Risparmio Annuo Luce: <strong style="color:green;">€ ${saveLuce.toFixed(2)}</strong></p>`;
    }

    // LOGICA GAS
    if (utility === 'gas' || utility === 'lightAndGas') {
        const mKey = document.getElementById('monthGas').value;
        const freq = parseInt(document.getElementById('freqGas').value);
        const annuo = parseFloat(document.getElementById('annuoGas').value) || 0;
        const spesaP = parseFloat(document.getElementById('costMateriaGas').value) || 0;
        const consP = parseFloat(document.getElementById('smcTot').value) || 0;
        
        let nuovaSpesa = (consP * (DB_PRICES.psv[mKey] + spread.gas)) + (ogt * freq);
        let saveGas = ((spesaP - nuovaSpesa) / (consP || 1)) * annuo;
        totalSave += saveGas;
        reportHtml += `<p>Risparmio Annuo Gas: <strong style="color:green;">€ ${saveGas.toFixed(2)}</strong></p>`;
    }

    reportHtml += `<div style="background:#2e7d32; color:white; padding:20px; text-align:center; border-radius:8px; margin-top:20px;">
        <span style="font-size:2.5em; font-weight:bold;">€ ${totalSave.toFixed(2)}</span><br>RISPARMIO TOTALE ANNUO</div></div>`;

    document.getElementById('result').innerHTML = reportHtml;
    document.getElementById('result').style.display = 'block';
    document.getElementById('export-actions').style.display = 'block';
};

window.exportDoc = function() {
    const el = document.getElementById('report-box');
    html2canvas(el, { scale: 2 }).then(canvas => {
        const pdf = new jspdf.jsPDF();
        pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 10, 10, 190, 0);
        pdf.save('Analisi_UltraGreen.pdf');
    });
};
