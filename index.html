// ==========================================
// DATABASE PREZZI UFFICIALI (GME / ARERA)
// I valori del PUN sono espressi in €/kWh
// I valori del PSV sono espressi in €/SMC
// ==========================================
const DB_PRICES = {
    pun: { 
        '07': { mono: 0.113, f1: 0.125, f2: 0.118, f3: 0.098 }, 
        '08': { mono: 0.121, f1: 0.135, f2: 0.128, f3: 0.105 }, 
        '09': { mono: 0.109, f1: 0.128, f2: 0.122, f3: 0.100 }, 
        '10': { mono: 0.107, f1: 0.118, f2: 0.112, f3: 0.095 }, 
        '11': { mono: 0.117, f1: 0.130, f2: 0.124, f3: 0.108 }, 
        '12': { mono: 0.124, f1: 0.145, f2: 0.138, f3: 0.115 }, 
        '01': { mono: 0.133, f1: 0.151, f2: 0.137, f3: 0.118 },
        '02': { mono: 0.114, f1: 0.122, f2: 0.120, f3: 0.105 }
    },
    psv: { 
        '07': 0.36, '08': 0.38, '09': 0.40, '10': 0.42, 
        '11': 0.45, '12': 0.48, '01': 0.45, '02': 0.42 
    }
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

// Mostra/nasconde i campi a seconda delle scelte
function toggleSections() {
    const utility = document.getElementById('utilityType').value;
    const lettura = document.getElementById('tipoLettura').value;
    const freqLuce = document.getElementById('freqLuce').value;
    const freqGas = document.getElementById('freqGas').value;

    document.getElementById('light-section').style.display = (utility === 'light' || utility === 'lightAndGas') ? 'block' : 'none';
    document.getElementById('gas-section').style.display = (utility === 'gas' || utility === 'lightAndGas') ? 'block' : 'none';

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
    
    const offer = document.getElementById('selectedOffer').value;
    const userType = document.getElementById('userType').value;
    const utente = document.getElementById('clientName').value;
    const utility = document.getElementById('utilityType').value;
    const hasCap = document.getElementById('hasCap').value === 'si';

    // ---- CONFIGURAZIONE TETTI CAP (Inseriti dall'utente) ----
    const LIMITE_CAP_LUCE = 0.175; // max 0.175 €/kWh
    const LIMITE_CAP_GAS = 0.650;  // max 0.650 €/SMC
    // --------------------------------------------------------

    // Calcolo data scadenza (ultimo giorno del mese corrente)
    const oggi = new Date();
    const ultimoGiorno = new Date(oggi.getFullYear(), oggi.getMonth() + 1, 0);
    
    const giorno = String(ultimoGiorno.getDate()).padStart(2, '0');
    const mese = String(ultimoGiorno.getMonth() + 1).padStart(2, '0');
    const anno = ultimoGiorno.getFullYear();
    const dataScadenza = `${giorno}/${mese}/${anno}`;

    let ogtUltraGreen = (userType === 'consumer') ? 8.95 : 
                        (offer === 'ultraGreenPMI' || offer === 'ultraGreenGrandiAziende' ? 19.95 : 14.95);
                        
    let spreadAttuale = OFFERTE_SPREAD[offer] || { luce: 0.055, gas: 0.20 };

    // --- LOGICA MAGGIORAZIONE SPREAD PER OPZIONE CAP ---
    let spreadLuceEffettivo = spreadAttuale.luce;
    let spreadGasEffettivo = spreadAttuale.gas;

    if (hasCap) {
        spreadLuceEffettivo += 0.009; // +0.009 €/kWh
        spreadGasEffettivo += 0.09;   // +0.09 €/SMC
    }
    // --------------------------------------------------

    let totalSaveAnnuo = 0;
    
    let dicituraCap = hasCap ? `<p style="font-size:0.9em; color:#1b5e20;">🛡️ <strong>Opzione CAP Attiva</strong> (Tetto Luce: € ${LIMITE_CAP_LUCE.toFixed(3)} | Tetto Gas: € ${LIMITE_CAP_GAS.toFixed(3)})</p>` : '';

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
            const valNegativoAnnuale = -Math.abs(valoreAnnuo);
            const valNegativoMensile = -Math.abs(valoreMensile);
            return `
                <div style="margin-bottom: 15px; padding: 15px; border-left: 4px solid green; background: #f1f8e9; border-radius: 0 5px 5px 0;">
                    <p style="font-size:1.15em; margin: 5px 0; color: #1b5e20;"><strong>${etichetta}</strong></p>
                    <p style="font-size:1.05em; margin: 5px 0;">Risparmio Annuale: <strong style="color:green;">€ ${valNegativoAnnuale.toFixed(2)}</strong></p>
                    <p style="font-size:1.05em; margin: 5px 0;">Risparmio Mensile: <strong style="color:green;">€ ${valNegativoMensile.toFixed(2)}</strong></p>
                </div>`;
        } else if (valoreAnnuo < 0) {
            const valPositivoAnnuale = Math.abs(valoreAnnuo);
            const valPositivoMensile = Math.abs(valoreMensile);
            return `
                <div style="margin-bottom: 15px; padding: 15px; border-left: 4px solid red; background: #ffebee; border-radius: 0 5px 5px 0;">
                    <p style="font-size:1.15em; margin: 5px 0; color: #b71c1c;"><strong>${etichetta}</strong></p>
                    <p style="font-size:1.05em; margin: 5px 0;">Risparmio Annuale: <strong style="color:red;">Non C'è Risparmio +€ ${valPositivoAnnuale.toFixed(2)}</strong></p>
                    <p style="font-size:1.05em; margin: 5px 0;">Differenza Mensile: <strong style="color:red;">+€ ${valPositivoMensile.toFixed(2)}</strong></p>
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

        let consTotale = 0;
        let costoEnergiaPura = 0;

        const m1 = document.getElementById('monthLuce1').value;
        const pun1 = DB_PRICES.pun[m1];
        
        let f1_m1 = hasCap ? Math.min(pun1.f1, LIMITE_CAP_LUCE) : pun1.f1;
        let f2_m1 = hasCap ? Math.min(pun1.f2, LIMITE_CAP_LUCE) : pun1.f2;
        let f3_m1 = hasCap ? Math.min(pun1.f3, LIMITE_CAP_LUCE) : pun1.f3;
        let mono_m1 = hasCap ? Math.min(pun1.mono, LIMITE_CAP_LUCE) : pun1.mono;

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
            
            let f1_m2 = hasCap ? Math.min(pun2.f1, LIMITE_CAP_LUCE) : pun2.f1;
            let f2_m2 = hasCap ? Math.min(pun2.f2, LIMITE_CAP_LUCE) : pun2.f2;
            let f3_m2 = hasCap ? Math.min(pun2.f3, LIMITE_CAP_LUCE) : pun2.f3;
            let mono_m2 = hasCap ? Math.min(pun2.mono, LIMITE_CAP_LUCE) : pun2.mono;

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
        let spesaUltraGreenPeriodo = costoEnergiaPura + (consTotale * spreadLuceEffettivo) + (ogtUltraGreen * freq);
        
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

        let consTotale = 0;
        let costoGasPuro = 0;

        const m1 = document.getElementById('monthGas1').value;
        const cons1 = parseFloat(document.getElementById('smcTot1').value) || 0;
        consTotale += cons1;
        
        let psv_m1 = hasCap ? Math.min(DB_PRICES.psv[m1], LIMITE_CAP_GAS) : DB_PRICES.psv[m1];
        costoGasPuro += cons1 * psv_m1;

        if (freq === 2) {
            const m2 = document.getElementById('monthGas2').value;
            const cons2 = parseFloat(document.getElementById('smcTot2').value) || 0;
            consTotale += cons2;
            
            let psv_m2 = hasCap ? Math.min(DB_PRICES.psv[m2], LIMITE_CAP_GAS) : DB_PRICES.psv[m2];
            costoGasPuro += cons2 * psv_m2;
        }

        let spesaAttualePeriodo = spesaPuraP + (pcvAttualeP * freq);
        let spesaUltraGreenPeriodo = costoGasPuro + (consTotale * spreadGasEffettivo) + (ogtUltraGreen * freq);
        
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

// ESPORTAZIONE IN PDF O PNG
window.exportDoc = function(tipo) {
    const el = document.getElementById('report-box');
    
    html2canvas(el, { scale: 2 }).then(canvas => {
        const imgData = canvas.toDataURL('image/png');
        
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
            const pdf = new jspdf.jsPDF();
            pdf.addImage(imgData, 'PNG', 10, 10, 190, 0);
            pdf.save('Report_Risparmio_UltraGreen.pdf');
        }
    });
};
