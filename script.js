// ==========================================
// DATABASE PREZZI UFFICIALI (GME / ARERA)
// ==========================================
const DB_PRICES = {
    pun: { 
        '07': { mono: 0.112, f1: 0.121, f2: 0.118, f3: 0.102 },
        '08': { mono: 0.128, f1: 0.138, f2: 0.135, f3: 0.116 },
        '09': { mono: 0.109, f1: 0.128, f2: 0.122, f3: 0.100 }, 
        '10': { mono: 0.107, f1: 0.118, f2: 0.112, f3: 0.095 }, 
        '11': { mono: 0.117, f1: 0.130, f2: 0.124, f3: 0.108 }, 
        '12': { mono: 0.124, f1: 0.145, f2: 0.138, f3: 0.115 }, 
        '01': { mono: 0.133, f1: 0.151, f2: 0.137, f3: 0.118 },
        '02': { mono: 0.114, f1: 0.122, f2: 0.120, f3: 0.105 }
    },
    psv: { 
        '07': 0.38, '08': 0.43, '09': 0.40, '10': 0.42, 
        '11': 0.45, '12': 0.48, '01': 0.45, '02': 0.377
    }
};

const OFFERTE_SPREAD = {
    'ultraGreenCasa': { luce: 0.061, gas: 0.23 },
    'ultraGreen': { luce: 0.061, gas: 0.20 },
    'revolutionTax': { luce: 0.061, gas: 0.20 },
    'ultraGreenPMI': { luce: 0.059, gas: 0.18 },
    'ultraGreenGrandiAziende': { luce: 0.043, gas: 0.16 }
};

const months = [
    {v:'07', t:'Luglio 2025'}, {v:'08', t:'Agosto 2025'}, {v:'09', t:'Settembre 2025'}, 
    {v:'10', t:'Ottobre 2025'}, {v:'11', t:'Novembre 2025'}, {v:'12', t:'Dicembre 2025'}, 
    {v:'01', t:'Gennaio 2026'}, {v:'02', t:'Febbraio 2026'}
];

// Mostra/nasconde i campi a seconda delle scelte
function toggleSections() {
    const utility = document.getElementById('utilityType').value;
    const lettura = document.getElementById('tipoLettura').value;
    const freqLuce = document.getElementById('freqLuce').value;
    const freqGas = document.getElementById('freqGas').value;

    document.getElementById('light-section').style.display = (utility === 'light' || utility === 'lightAndGas') ? 'block' : 'none';
    document.getElementById('gas-section').style.display = (utility === 'gas' || utility === 'lightAndGas') ? 'block' : 'none';

    // Gestione visibilità selettori offerte nel Blocco 4
    document.getElementById('offer-light-row').style.display = (utility === 'light' || utility === 'lightAndGas') ? 'flex' : 'none';
    document.getElementById('offer-gas-row').style.display = (utility === 'gas' || utility === 'lightAndGas') ? 'flex' : 'none';

    const lightM2 = document.getElementById('light-mese2');
    if (freqLuce === "2" && (utility === 'light' || utility === 'lightAndGas')) {
        lightM2.classList.remove('hidden');
    } else {
        lightM2.classList.add('hidden');
    }

    const gasM2 = document.getElementById('gas-mese2');
    if (freqGas === "2" && (utility === 'gas' || utility === 'lightAndGas')) {
        gasM2.classList.remove('hidden');
    } else {
        gasM2.classList.add('hidden');
    }

    const divMono1 = document.getElementById('div-mono1');
    const divFasce1 = document.getElementById('div-fasce1');
    if (lettura === 'fasce') {
        divFasce1.classList.remove('hidden');
        divMono1.classList.add('hidden');
    } else {
        divFasce1.classList.add('hidden');
        divMono1.classList.remove('hidden');
    }

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

// Nasconde l'offerta "Casa" se l'utente è Business
function updateOffersDropdown() {
    const userType = document.getElementById('userType').value;
    
    const optCasaLuce = document.getElementById('opt-casa-luce');
    const optCasaGas = document.getElementById('opt-casa-gas');
    const selLuce = document.getElementById('selectedOfferLuce');
    const selGas = document.getElementById('selectedOfferGas');

    if (userType === 'business') {
        if (optCasaLuce) optCasaLuce.style.display = 'none';
        if (optCasaGas) optCasaGas.style.display = 'none';
        
        if (selLuce.value === 'ultraGreenCasa') selLuce.value = '';
        if (selGas.value === 'ultraGreenCasa') selGas.value = '';
    } else {
        if (optCasaLuce) optCasaLuce.style.display = 'block';
        if (optCasaGas) optCasaGas.style.display = 'block';
    }
}

document.addEventListener('DOMContentLoaded', () => {
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

// CALCOLO RISPARMIO E GENERAZIONE REPORT
document.getElementById('calculator-form').onsubmit = function(e) {
    e.preventDefault();
    
    const userType = document.getElementById('userType').value;
    const utente = document.getElementById('clientName').value;
    const utility = document.getElementById('utilityType').value;

    const offerLuce = document.getElementById('selectedOfferLuce').value;
    const hasCapLuce = document.getElementById('hasCapLuce').value === 'si';

    const offerGas = document.getElementById('selectedOfferGas').value;
    const hasCapGas = document.getElementById('hasCapGas').value === 'si';

    // ---- CONFIGURAZIONE TETTI CAP ----
    const LIMITE_CAP_LUCE = 0.199; // max 0.199 €/kWh
    const LIMITE_CAP_GAS = 0.800;  // max 0.800 €/SMC
    // ----------------------------------

    const oggi = new Date();
    const ultimoGiorno = new Date(oggi.getFullYear(), oggi.getMonth() + 1, 0);
    const dataScadenza = `${String(ultimoGiorno.getDate()).padStart(2, '0')}/${String(ultimoGiorno.getMonth() + 1).padStart(2, '0')}/${ultimoGiorno.getFullYear()}`;

    let totalSaveAnnuo = 0;
    
    // Generazione dinamica della dicitura CAP sul report
    let dicituraCap = '';
    if (utility === 'light' || utility === 'lightAndGas') {
        if (hasCapLuce) dicituraCap += `<p style="font-size:0.9em; color:#1b5e20; margin:3px 0;">🛡️ <strong>CAP Luce Attivo</strong> (Tetto: € ${LIMITE_CAP_LUCE.toFixed(3)})</p>`;
    }
    if (utility === 'gas' || utility === 'lightAndGas') {
        if (hasCapGas) dicituraCap += `<p style="font-size:0.9em; color:#1b5e20; margin:3px 0;">🛡️ <strong>CAP Gas Attivo</strong> (Tetto: € ${LIMITE_CAP_GAS.toFixed(3)})</p>`;
    }

    let reportHtml = `
    <div id="report-box" style="padding:30px; border:3px solid #2e7d32; background:white; border-radius:10px; font-family:'Roboto', sans-serif;">
        <div style="text-align:center; border-bottom:2px solid #eee; padding-bottom:15px; margin-bottom:20px;">
            <h2 style="color:#2e7d32; margin-bottom:5px;">Analisi Comparativa UltraGreen</h2>
            <p style="font-size:1.2em; margin:5px 0;">Cliente: <strong>${utente}</strong></p>
            ${dicituraCap}
            <p style="font-size:0.95em; color:#d32f2f;"><strong>Offerta valida fino al: ${dataScadenza}</strong></p>
        </div>`;

    function formatRisparmio(valoreAnnuo, etichetta) {
        const valoreMensile = valoreAnnuo / 12;
        if (valoreAnnuo > 0) {
            return `
                <div style="margin-bottom: 15px; padding: 15px; border-left: 4px solid green; background: #f1f8e9; border-radius: 0 5px 5px 0;">
                    <p style="font-size:1.15em; margin: 5px 0; color: #1b5e20;"><strong>${etichetta}</strong></p>
                    <p style="font-size:1.05em; margin: 5px 0;">Risparmio Annuale: <strong style="color:green;">€ -${Math.abs(valoreAnnuo).toFixed(2)}</strong></p>
                    <p style="font-size:1.05em; margin: 5px 0;">Risparmio Mensile: <strong style="color:green;">€ -${Math.abs(valoreMensile).toFixed(2)}</strong></p>
                </div>`;
        } else if (valoreAnnuo < 0) {
            return `
                <div style="margin-bottom: 15px; padding: 15px; border-left: 4px solid red; background: #ffebee; border-radius: 0 5px 5px 0;">
                    <p style="font-size:1.15em; margin: 5px 0; color: #b71c1c;"><strong>${etichetta}</strong></p>
                    <p style="font-size:1.05em; margin: 5px 0;">Risparmio Annuale: <strong style="color:red;">Non C'è Risparmio +€ ${Math.abs(valoreAnnuo).toFixed(2)}</strong></p>
                    <p style="font-size:1.05em; margin: 5px 0;">Differenza Mensile: <strong style="color:red;">+€ ${Math.abs(valoreMensile).toFixed(2)}</strong></p>
                </div>`;
        } else {
            return `
                <div style="margin-bottom: 15px; padding: 15px; border-left: 4px solid gray; background: #f5f5f5; border-radius: 0 5px 5px 0;">
                    <p style="font-size:1.15em; margin: 5px 0; color: #616161;"><strong>${etichetta}</strong></p>
                    <p style="font-size:1.05em; margin: 5px 0;">Risparmio Annuale: <strong style="color:gray;">€ 0.00</strong></p>
                </div>`;
        }
    }

    // CALCOLO LUCE
    if (utility === 'light' || utility === 'lightAndGas') {
        const freq = parseInt(document.getElementById('freqLuce').value);
        const annuo = parseFloat(document.getElementById('annuoLuce').value) || 0;
        const spesaPuraP = parseFloat(document.getElementById('costMateriaLuce').value) || 0;
        const pcvAttualeP = parseFloat(document.getElementById('pcvAttualeLuce').value) || 0;
        const tipoLettura = document.getElementById('tipoLettura').value;

        const spreadLuceBase = OFFERTE_SPREAD[offerLuce]?.luce || 0.055;
        const spreadLuceEffettivo = hasCapLuce ? (spreadLuceBase + 0.009) : spreadLuceBase;

        const ogtUltraGreenLuce = (userType === 'consumer') ? 8.95 : 
                                  (offerLuce === 'ultraGreenPMI' || offerLuce === 'ultraGreenGrandiAziende' ? 19.95 : 14.95);

        let consTotale = 0;
        let costoEnergiaPura = 0;

        const m1 = document.getElementById('monthLuce1').value;
        const pun1 = DB_PRICES.pun[m1];
        
        let f1_m1 = hasCapLuce ? Math.min(pun1.f1, LIMITE_CAP_LUCE) : pun1.f1;
        let f2_m1 = hasCapLuce ? Math.min(pun1.f2, LIMITE_CAP_LUCE) : pun1.f2;
        let f3_m1 = hasCapLuce ? Math.min(pun1.f3, LIMITE_CAP_LUCE) : pun1.f3;
        let mono_m1 = hasCapLuce ? Math.min(pun1.mono, LIMITE_CAP_LUCE) : pun1.mono;

        if (tipoLettura === 'fasce') {
            const f1 = parseFloat(document.getElementById('kWhF1_M1').value) || 0;
            const f2 = parseFloat(document.getElementById('kWhF2_M1').value) || 0;
            const f3 = parseFloat(document.getElementById('kWhF3_M1').value) || 0;
            consTotale += (f1 + f2 + f3);
            costoEnergiaPura += (f1 * f1_m1) + (f2 * f2_m1) + (f3 * f3_m1);
        } else {
            const mono = parseFloat(document.getElementById('kWhTot1').value) || 0;
            consTotale += mono;
            costoEnergiaPura += mono * mono_m1;
        }

        if (freq === 2) {
            const m2 = document.getElementById('monthLuce2').value;
            const pun2 = DB_PRICES.pun[m2];
            
            let f1_m2 = hasCapLuce ? Math.min(pun2.f1, LIMITE_CAP_LUCE) : pun2.f1;
            let f2_m2 = hasCapLuce ? Math.min(pun2.f2, LIMITE_CAP_LUCE) : pun2.f2;
            let f3_m2 = hasCapLuce ? Math.min(pun2.f3, LIMITE_CAP_LUCE) : pun2.f3;
            let mono_m2 = hasCapLuce ? Math.min(pun2.mono, LIMITE_CAP_LUCE) : pun2.mono;

            if (tipoLettura === 'fasce') {
                const f1 = parseFloat(document.getElementById('kWhF1_M2').value) || 0;
                const f2 = parseFloat(document.getElementById('kWhF2_M2').value) || 0;
                const f3 = parseFloat(document.getElementById('kWhF3_M2').value) || 0;
                consTotale += (f1 + f2 + f3);
                costoEnergiaPura += (f1 * f1_m2) + (f2 * f2_m2) + (f3 * f3_m2);
            } else {
                const mono = parseFloat(document.getElementById('kWhTot2').value) || 0;
                consTotale += mono;
                costoEnergiaPura += mono * mono_m2;
            }
        }

        let spesaAttualePeriodo = spesaPuraP + (pcvAttualeP * freq);
        let spesaUltraGreenPeriodo = costoEnergiaPura + (consTotale * spreadLuceEffettivo) + (ogtUltraGreenLuce * freq);
        
        let saveA = ((spesaAttualePeriodo - spesaUltraGreenPeriodo) / (consTotale || 1)) * annuo;
        totalSaveAnnuo += saveA;
        
        reportHtml += formatRisparmio(saveA, "⚡ Fornitura Luce");
    }

    // CALCOLO GAS
    if (utility === 'gas' || utility === 'lightAndGas') {
        const freq = parseInt(document.getElementById('freqGas').value);
        const annuo = parseFloat(document.getElementById('annuoGas').value) || 0;
        const spesaPuraP = parseFloat(document.getElementById('costMateriaGas').value) || 0;
        const pcvAttualeP = parseFloat(document.getElementById('pcvAttualeGas').value) || 0;

        const spreadGasBase = OFFERTE_SPREAD[offerGas]?.gas || 0.20;
        const spreadGasEffettivo = hasCapGas ? (spreadGasBase + 0.09) : spreadGasBase;

        const ogtUltraGreenGas = (userType === 'consumer') ? 8.95 : 
                                 (offerGas === 'ultraGreenPMI' || offerGas === 'ultraGreenGrandiAziende' ? 19.95 : 14.95);

        let consTotale = 0;
        let costoGasPuro = 0;

        const m1 = document.getElementById('monthGas1').value;
        const cons1 = parseFloat(document.getElementById('smcTot1').value) || 0;
        consTotale += cons1;
        
        let psv_m1 = hasCapGas ? Math.min(DB_PRICES.psv[m1], LIMITE_CAP_GAS) : DB_PRICES.psv[m1];
        costoGasPuro += cons1 * psv_m1;

        if (freq === 2) {
            const m2 = document.getElementById('monthGas2').value;
            const cons2 = parseFloat(document.getElementById('smcTot2').value) || 0;
            consTotale += cons2;
            
            let psv_m2 = hasCapGas ? Math.min(DB_PRICES.psv[m2], LIMITE_CAP_GAS) : DB_PRICES.psv[m2];
            costoGasPuro += cons2 * psv_m2;
        }

        let spesaAttualePeriodo = spesaPuraP + (pcvAttualeP * freq);
        let spesaUltraGreenPeriodo = costoGasPuro + (consTotale * spreadGasEffettivo) + (ogtUltraGreenGas * freq);
        
        let saveA = ((spesaAttualePeriodo - spesaUltraGreenPeriodo) / (consTotale || 1)) * annuo;
        totalSaveAnnuo += saveA;
        
        reportHtml += formatRisparmio(saveA, "🔥 Fornitura Gas");
    }

    // Box Finale Riassuntivo
    let totaleStile = "";
    let totaleTesto = "";
    
    if (totalSaveAnnuo > 0) {
        totaleStile = "background:#2e7d32; color:white;";
        totaleTesto = `RISPARMIO TOTALE ANNUO<br><span style="font-size:2.5em; font-weight:bold;">€ -${Math.abs(totalSaveAnnuo).toFixed(2)}</span>`;
    } else if (totalSaveAnnuo < 0) {
        totaleStile = "background:#d32f2f; color:white;";
        totaleTesto = `NON C'È RISPARMIO<br><span style="font-size:2.5em; font-weight:bold;">+€ ${Math.abs(totalSaveAnnuo).toFixed(2)}</span>`;
    } else {
        totaleStile = "background:#757575; color:white;";
        totaleTesto = `RISPARMIO TOTALE ANNUO<br><span style="font-size:2.5em; font-weight:bold;">€ 0.00</span>`;
    }

    reportHtml += `
        <div style="${totaleStile} padding:20px; text-align:center; border-radius:8px; margin-top:20px;">
            <span style="text-transform:uppercase; font-size:0.9em;">${totaleTesto}</span>
        </div>
    </div>`;

    document.getElementById('result').innerHTML = reportHtml;
    document.getElementById('result').style.display = 'block';
    
    const exportSec = document.getElementById('export-actions');
    exportSec.classList.remove('hidden');
    exportSec.style.display = 'block';
};

// ESPORTAZIONE
window.exportDoc = function(tipo) {
    const el = document.getElementById('report-box');
    html2canvas(el, { scale: 2 }).then(canvas => {
        if (tipo === 'png') {
            canvas.toBlob(function(blob) {
                const link = document.createElement('a');
                link.download = 'Report_Risparmio_UltraGreen.png';
                link.href = URL.createObjectURL(blob);
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                URL.revokeObjectURL(link.href);
            }, 'image/png');
        } else if (tipo === 'pdf') {
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jspdf.jsPDF();
            pdf.addImage(imgData, 'PNG', 10, 10, 190, 0);
            pdf.save('Report_Risparmio_UltraGreen.pdf');
        }
    });
};
