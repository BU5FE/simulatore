// ==========================================
// PARTE 1: DATABASE PREZZI E CONTROLLO CAMPI
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
        '02': { mono: 0.114, f1: 0.122, f2: 0.120, f3: 0.105 },
        '03': { mono: 0.143, f1: 0.143, f2: 0.153, f3: 0.138 },
        '04': { mono: 0.119, f1: 0.111, f2: 0.138, f3: 0.116 }
    },
    psv: { 
        '07': 0.38, '08': 0.43, '09': 0.40, '10': 0.42, 
        '11': 0.45, '12': 0.48, '01': 0.45, '02': 0.377, '03': 0.558, '04': 0.493
    }
};

const OFFERTE_SPREAD = {
    'ultraGreenCasa': { luce: 0.061, gas: 0.35 },
    'ultraGreenCasaPun0': { luce: 0.058, gas: 0.287 },
    'ultraGreen': { luce: 0.061, gas: 0.32 },
    'revolutionTax': { luce: 0.061, gas: 0.32 },
    'ultraGreenPMI': { luce: 0.059, gas: 0.30 },
    'ultraGreenGrandiAziende': { luce: 0.043, gas: 0.28 },
    'ultraGreenFixCasa': { isFix: true, luceFix: 0.159, gasFix: 0.69 },
    'ultraGreenFixBusiness': { isFix: true, luceFix: 0.129, gasFix: 0.52 }
};

const months = [
    {v:'07', t:'Luglio 2025'}, {v:'08', t:'Agosto 2025'}, {v:'09', t:'Settembre 2025'}, 
    {v:'10', t:'Ottobre 2025'}, {v:'11', t:'Novembre 2025'}, {v:'12', t:'Dicembre 2025'}, 
    {v:'01', t:'Gennaio 2026'}, {v:'02', t:'Febbraio 2026'}, {v:'03', t:'Marzo 2026'},
    {v:'04', t:'Aprile 2026'}
];

function toggleSections() {
    const utility = document.getElementById('utilityType').value;
    const lettura = document.getElementById('tipoLettura').value;
    const freqLuce = document.getElementById('freqLuce').value;
    const freqGas = document.getElementById('freqGas').value;

    document.getElementById('light-section').style.display = (utility === 'light' || utility === 'lightAndGas') ? 'block' : 'none';
    document.getElementById('gas-section').style.display = (utility === 'gas' || utility === 'lightAndGas') ? 'block' : 'none';
    document.getElementById('offer-light-row').style.display = (utility === 'light' || utility === 'lightAndGas') ? 'flex' : 'none';
    document.getElementById('offer-gas-row').style.display = (utility === 'gas' || utility === 'lightAndGas') ? 'flex' : 'none';

    const lightM2 = document.getElementById('light-mese2');
    if (freqLuce === "2" && (utility === 'light' || utility === 'lightAndGas')) { lightM2.classList.remove('hidden'); } else { lightM2.classList.add('hidden'); }

    const gasM2 = document.getElementById('gas-mese2');
    if (freqGas === "2" && (utility === 'gas' || utility === 'lightAndGas')) { gasM2.classList.remove('hidden'); } else { gasM2.classList.add('hidden'); }

    const divMono1 = document.getElementById('div-mono1');
    const divFasce1 = document.getElementById('div-fasce1');
    if (lettura === 'fasce') { divFasce1.classList.remove('hidden'); divMono1.classList.add('hidden'); } else { divFasce1.classList.add('hidden'); divMono1.classList.remove('hidden'); }

    const divMono2 = document.getElementById('div-mono2');
    const divFasce2 = document.getElementById('div-fasce2');
    if (lettura === 'fasce') { divFasce2.classList.remove('hidden'); divMono2.classList.add('hidden'); } else { divFasce2.classList.add('hidden'); divMono2.classList.remove('hidden'); }
}
// ==========================================
// PARTE 2: FILTRI MENU E AVVIO FORM
// ==========================================
function updateOffersDropdown() {
    const userType = document.getElementById('userType').value;
    const optCasaLuce = document.getElementById('opt-casa-luce');
    const optCasaGas = document.getElementById('opt-casa-gas');
    const optCasaPun0Luce = document.getElementById('opt-casa-pun0-luce');
    const optCasaPun0Gas = document.getElementById('opt-casa-pun0-gas');
    const optFixCasaLuce = document.getElementById('opt-fix-casa-luce');
    const optFixCasaGas = document.getElementById('opt-fix-casa-gas');
    const optFixBizLuce = document.getElementById('opt-fix-biz-luce');
    const optFixBizGas = document.getElementById('opt-fix-biz-gas');
    const selLuce = document.getElementById('selectedOfferLuce');
    const selGas = document.getElementById('selectedOfferGas');

    if (userType === 'business') {
        if (optCasaLuce) optCasaLuce.style.display = 'none';
        if (optCasaGas) optCasaGas.style.display = 'none';
        if (optCasaPun0Luce) optCasaPun0Luce.style.display = 'none';
        if (optCasaPun0Gas) optCasaPun0Gas.style.display = 'none';
        if (optFixCasaLuce) optFixCasaLuce.style.display = 'none';
        if (optFixCasaGas) optFixCasaGas.style.display = 'none';
        if (optFixBizLuce) optFixBizLuce.style.display = 'block';
        if (optFixBizGas) optFixBizGas.style.display = 'block';
        if (['ultraGreenCasa', 'ultraGreenCasaPun0', 'ultraGreenFixCasa'].includes(selLuce.value)) selLuce.value = '';
        if (['ultraGreenCasa', 'ultraGreenCasaPun0', 'ultraGreenFixCasa'].includes(selGas.value)) selGas.value = '';
    } else {
        if (optCasaLuce) optCasaLuce.style.display = 'block';
        if (optCasaGas) optCasaGas.style.display = 'block';
        if (optCasaPun0Luce) optCasaPun0Luce.style.display = 'block';
        if (optCasaPun0Gas) optCasaPun0Gas.style.display = 'block';
        if (optFixCasaLuce) optFixCasaLuce.style.display = 'block';
        if (optFixCasaGas) optFixCasaGas.style.display = 'block';
        if (optFixBizLuce) optFixBizLuce.style.display = 'none';
        if (optFixBizGas) optFixBizGas.style.display = 'none';
        if (selLuce.value === 'ultraGreenFixBusiness') selLuce.value = '';
        if (selGas.value === 'ultraGreenFixBusiness') selGas.value = '';
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
// ==========================================
// PARTE 3: PREPARAZIONE E CALCOLO LUCE
// ==========================================
document.getElementById('calculator-form').onsubmit = function(e) {
    e.preventDefault();
    const userType = document.getElementById('userType').value;
    const utente = document.getElementById('clientName').value;
    const utility = document.getElementById('utilityType').value;
    const selectLuce = document.getElementById('selectedOfferLuce');
    const offerLuce = selectLuce.value;
    const nomeOffertaLuce = selectLuce.options[selectLuce.selectedIndex].text;
    const hasCapLuce = document.getElementById('hasCapLuce').value === 'si';
    const selectGas = document.getElementById('selectedOfferGas');
    const offerGas = selectGas.value;
    const nomeOffertaGas = selectGas.options[selectGas.selectedIndex].text;
    const hasCapGas = document.getElementById('hasCapGas').value === 'si';

    const LIMITE_CAP_LUCE = 0.170;
    const LIMITE_CAP_GAS = 0.630;
    const oggi = new Date();
    const ultimoGiorno = new Date(oggi.getFullYear(), oggi.getMonth() + 1, 0);
    const dataScadenza = `${String(ultimoGiorno.getDate()).padStart(2, '0')}/${String(ultimoGiorno.getMonth() + 1).padStart(2, '0')}/${ultimoGiorno.getFullYear()}`;

    let totalSaveAnnuo = 0;
    let dicituraCap = '';
    if ((utility === 'light' || utility === 'lightAndGas') && hasCapLuce) { dicituraCap += `<p style="font-size:0.9em; color:#1b5e20; margin:3px 0;">🛡️ <strong>CAP Luce Attivo</strong> (Tetto: € ${LIMITE_CAP_LUCE.toFixed(3)})</p>`; }
    if ((utility === 'gas' || utility === 'lightAndGas') && hasCapGas) { dicituraCap += `<p style="font-size:0.9em; color:#1b5e20; margin:3px 0;">🛡️ <strong>CAP Gas Attivo</strong> (Tetto: € ${LIMITE_CAP_GAS.toFixed(3)})</p>`; }

    let reportHtml = `<div id="report-box" style="padding:30px; border:3px solid #2e7d32; background:white; border-radius:10px; font-family:'Roboto', sans-serif;"><div style="text-align:center; border-bottom:2px solid #eee; padding-bottom:15px; margin-bottom:20px;"><h2 style="color:#2e7d32; margin-bottom:5px;">Simulazione di Risparmio Luce&Gas</h2><p style="font-size:1.2em; margin:5px 0;">Cliente: <strong>${utente}</strong></p>${dicituraCap}<p style="font-size:0.95em; color:#d32f2f;"><strong>Offerta valida fino al: ${dataScadenza}</strong></p></div>`;

    function formatRisparmio(valoreAnnuo, etichetta, spesaAttualePeriodo, spesaNuovaPeriodo, nomeOfferta, freq) {
        const valoreMensile = valoreAnnuo / 12;
        const isRisparmio = valoreAnnuo >= 0;
        const color = isRisparmio ? "#1b5e20" : "#d32f2f";
        const bgColor = isRisparmio ? "#f1f8e9" : "#ffebee";
        const borderColor = isRisparmio ? "green" : "red";
        const segno = isRisparmio ? "-" : "+";
        const labelRisparmio = isRisparmio ? "Risparmio" : "Differenza";
        const tipoPeriodo = (freq === 1) ? "Mensile" : "Bimestrale";
        return `<div style="margin-bottom: 20px; padding: 15px; border-left: 4px solid ${borderColor}; background: ${bgColor}; border-radius: 0 5px 5px 0;"><p style="font-size:1.15em; margin: 5px 0; color: ${color}; text-transform: uppercase;"><strong>${etichetta}</strong></p><div style="font-size:0.95em; color: #444; margin-bottom: 10px;"><p style="margin: 2px 0;">Attuale Spesa Materia (${tipoPeriodo}): <strong>€ ${spesaAttualePeriodo.toFixed(2)}</strong></p><p style="margin: 2px 0;">Spesa con <em>${nomeOfferta}</em> (${tipoPeriodo}): <strong>€ ${spesaNuovaPeriodo.toFixed(2)}</strong></p></div><div style="border-top: 1px dotted #ccc; padding-top: 10px;"><p style="font-size:1.05em; margin: 3px 0;">${labelRisparmio} Mensile Stimato: <strong style="color:${borderColor};">€ ${segno}${Math.abs(valoreMensile).toFixed(2)}</strong></p><p style="font-size:1.05em; margin: 3px 0;">${labelRisparmio} Annuo Stimato: <strong style="color:${borderColor};">€ ${segno}${Math.abs(valoreAnnuo).toFixed(2)}</strong></p></div></div>`;
    }

    if (utility === 'light' || utility === 'lightAndGas') {
        const freq = parseInt(document.getElementById('freqLuce').value);
        const annuo = parseFloat(document.getElementById('annuoLuce').value) || 0;
        const spesaPuraP = parseFloat(document.getElementById('costMateriaLuce').value) || 0;
        const pcvAttualeP = parseFloat(document.getElementById('pcvAttualeLuce').value) || 0;
        const tipoLettura = document.getElementById('tipoLettura').value;

        let ogtUltraGreenLuce = 14.95;
        if (offerLuce === 'ultraGreenCasa') ogtUltraGreenLuce = 8.95;
        else if (offerLuce === 'ultraGreenCasaPun0') ogtUltraGreenLuce = 19.95;
        else if (offerLuce === 'ultraGreenFixCasa') ogtUltraGreenLuce = 8.95;
        else if (offerLuce === 'ultraGreenFixBusiness') ogtUltraGreenLuce = 14.95;
        else if (userType === 'consumer') ogtUltraGreenLuce = 8.95;
        else if (offerLuce === 'ultraGreenPMI' || offerLuce === 'ultraGreenGrandiAziende') ogtUltraGreenLuce = 19.95;

        let consTotale = 0;
        let costoEnergiaPura = 0;
        const confLuce = OFFERTE_SPREAD[offerLuce];

        if (confLuce && confLuce.isFix) {
            if (tipoLettura === 'fasce') {
                consTotale += (parseFloat(document.getElementById('kWhF1_M1').value) || 0) + (parseFloat(document.getElementById('kWhF2_M1').value) || 0) + (parseFloat(document.getElementById('kWhF3_M1').value) || 0);
            } else { consTotale += parseFloat(document.getElementById('kWhTot1').value) || 0; }
            if (freq === 2) {
                if (tipoLettura === 'fasce') {
                    consTotale += (parseFloat(document.getElementById('kWhF1_M2').value) || 0) + (parseFloat(document.getElementById('kWhF2_M2').value) || 0) + (parseFloat(document.getElementById('kWhF3_M2').value) || 0);
                } else { consTotale += parseFloat(document.getElementById('kWhTot2').value) || 0; }
            }
            costoEnergiaPura = consTotale * confLuce.luceFix;
        } else {
            const spreadLuceBase = confLuce?.luce || 0.055;
            const spreadLuceEffettivo = hasCapLuce ? (spreadLuceBase + 0.009) : spreadLuceBase;
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
            costoEnergiaPura += (consTotale * spreadLuceEffettivo);
        }

        let spesaAttualePeriodo = spesaPuraP + (pcvAttualeP * freq);
        let spesaUltraGreenPeriodo = costoEnergiaPura + (ogtUltraGreenLuce * freq);
        let saveA = ((spesaAttualePeriodo - spesaUltraGreenPeriodo) / (consTotale || 1)) * annuo;
        totalSaveAnnuo += saveA;
        reportHtml += formatRisparmio(saveA, "⚡ Fornitura Luce", spesaAttualePeriodo, spesaUltraGreenPeriodo, nomeOffertaLuce, freq);
    }
// ==========================================
// PARTE 4: CALCOLO GAS ED ESPORTAZIONE PDF/PNG
// ==========================================
    if (utility === 'gas' || utility === 'lightAndGas') {
        const freq = parseInt(document.getElementById('freqGas').value);
        const annuo = parseFloat(document.getElementById('annuoGas').value) || 0;
        const spesaPuraP = parseFloat(document.getElementById('costMateriaGas').value) || 0;
        const pcvAttualeP = parseFloat(document.getElementById('pcvAttualeGas').value) || 0;

        let ogtUltraGreenGas = 14.95;
        if (offerGas === 'ultraGreenCasa') ogtUltraGreenGas = 8.95;
        else if (offerGas === 'ultraGreenCasaPun0') ogtUltraGreenGas = 19.95;
        else if (offerGas === 'ultraGreenFixCasa') ogtUltraGreenGas = 8.95;
        else if (offerGas === 'ultraGreenFixBusiness') ogtUltraGreenGas = 14.95;
        else if (userType === 'consumer') ogtUltraGreenGas = 8.95;
        else if (offerGas === 'ultraGreenPMI' || offerGas === 'ultraGreenGrandiAziende') ogtUltraGreenGas = 19.95;

        let consTotale = 0;
        let costoGasPuro = 0;
        const confGas = OFFERTE_SPREAD[offerGas];

        if (confGas && confGas.isFix) {
            consTotale += parseFloat(document.getElementById('smcTot1').value) || 0;
            if (freq === 2) { consTotale += parseFloat(document.getElementById('smcTot2').value) || 0; }
            costoGasPuro = consTotale * confGas.gasFix;
        } else {
            const spreadGasBase = confGas?.gas || 0.20;
            const spreadGasEffettivo = hasCapGas ? (spreadGasBase + 0.09) : spreadGasBase;
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
            costoGasPuro += (consTotale * spreadGasEffettivo);
        }

        let spesaAttualePeriodo = spesaPuraP + (pcvAttualeP * freq);
        let spesaUltraGreenPeriodo = costoGasPuro + (ogtUltraGreenGas * freq);
        let saveA = ((spesaAttualePeriodo - spesaUltraGreenPeriodo) / (consTotale || 1)) * annuo;
        totalSaveAnnuo += saveA;
        reportHtml += formatRisparmio(saveA, "🔥 Fornitura Gas", spesaAttualePeriodo, spesaUltraGreenPeriodo, nomeOffertaGas, freq);
    }

    let totaleStile = "", totaleTesto = "";
    if (totalSaveAnnuo > 0) {
        totaleStile = "background:#2e7d32; color:white;";
        totaleTesto = `RISPARMIO TOTALE ANNUO STIMATO<br><span style="font-size:2.5em; font-weight:bold;">€ -${Math.abs(totalSaveAnnuo).toFixed(2)}</span>`;
    } else if (totalSaveAnnuo < 0) {
        totaleStile = "background:#d32f2f; color:white;";
        totaleTesto = `DIFFERENZA TOTALE ANNUALE<br><span style="font-size:2.5em; font-weight:bold;">+€ ${Math.abs(totalSaveAnnuo).toFixed(2)}</span>`;
    } else {
        totaleStile = "background:#757575; color:white;";
        totaleTesto = `RISPARMIO TOTALE ANNUO<br><span style="font-size:2.5em; font-weight:bold;">€ 0.00</span>`;
    }

    reportHtml += `<div style="${totaleStile} padding:20px; text-align:center; border-radius:8px; margin-top:20px;"><span style="text-transform:uppercase; font-size:0.9em;">${totaleTesto}</span></div></div>`;
    document.getElementById('result').innerHTML = reportHtml;
    document.getElementById('result').style.display = 'block';
    
    const exportSec = document.getElementById('export-actions');
    exportSec.classList.remove('hidden');
    exportSec.style.display = 'block';
};

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
