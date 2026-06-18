const DB_PRICES = {
    pun: { 
        '07': { mono: 0.112, f1: 0.121, f2: 0.118, f3: 0.102 }, '08': { mono: 0.128, f1: 0.138, f2: 0.135, f3: 0.116 },
        '09': { mono: 0.109, f1: 0.128, f2: 0.122, f3: 0.100 }, '10': { mono: 0.107, f1: 0.118, f2: 0.112, f3: 0.095 }, 
        '11': { mono: 0.117, f1: 0.130, f2: 0.124, f3: 0.108 }, '12': { mono: 0.124, f1: 0.145, f2: 0.138, f3: 0.115 }, 
        '01': { mono: 0.133, f1: 0.151, f2: 0.137, f3: 0.118 }, '02': { mono: 0.114, f1: 0.122, f2: 0.120, f3: 0.105 },
        '03': { mono: 0.143, f1: 0.143, f2: 0.153, f3: 0.138 }, '04': { mono: 0.119, f1: 0.111, f2: 0.138, f3: 0.116 },
        '05': { mono: 0.119, f1: 0.107, f2: 0.131, f3: 0.120 }
    }, psv: { 
        '07': 0.38, '08': 0.43, '09': 0.40, '10': 0.42, '11': 0.45, '12': 0.48, '01': 0.45, '02': 0.377, '03': 0.558, '04': 0.493, '05': 0.502
    }
};
const OFFERTE_SPREAD = {
    'ultraGreenCasa': { luce: 0.061, gas: 0.35 }, 'ultraGreenCasaPun0': { luce: 0.058, gas: 0.287 },
    'ultraGreen': { luce: 0.061, gas: 0.32 }, 'revolutionTax': { luce: 0.061, gas: 0.32 },
    'ultraGreenPMI': { luce: 0.059, gas: 0.30 }, 'ultraGreenGrandiAziende': { luce: 0.043, gas: 0.28 },
    'ultraGreenFixCasa': { isFix: true, luceFix: 0.159, gasFix: 0.69 }, 'ultraGreenFixBusiness': { isFix: true, luceFix: 0.129, gasFix: 0.52 }
};
const months = [
    {v:'07', t:'Luglio 2025'}, {v:'08', t:'Agosto 2025'}, {v:'09', t:'Settembre 2025'}, {v:'10', t:'Ottobre 2025'}, {v:'11', t:'Novembre 2025'},
    {v:'12', t:'Dicembre 2025'}, {v:'01', t:'Gennaio 2026'}, {v:'02', t:'Febbraio 2026'}, {v:'03', t:'Marzo 2026'}, {v:'04', t:'Aprile 2026'}, {v:'05', t:'Maggio 2026'}
];
function toggleSections() {
    const u = document.getElementById('utilityType').value, l = document.getElementById('tipoLettura').value;
    const fL = document.getElementById('freqLuce').value, fG = document.getElementById('freqGas').value;
    document.getElementById('light-section').style.display = (u === 'light' || u === 'lightAndGas') ? 'block' : 'none';
    document.getElementById('gas-section').style.display = (u === 'gas' || u === 'lightAndGas') ? 'block' : 'none';
    document.getElementById('offer-light-row').style.display = (u === 'light' || u === 'lightAndGas') ? 'flex' : 'none';
    document.getElementById('offer-gas-row').style.display = (u === 'gas' || u === 'lightAndGas') ? 'flex' : 'none';
    if (fL === "2" && (u === 'light' || u === 'lightAndGas')) { document.getElementById('light-mese2').classList.remove('hidden'); } else { document.getElementById('light-mese2').classList.add('hidden'); }
    if (fG === "2" && (u === 'gas' || u === 'lightAndGas')) { document.getElementById('gas-mese2').classList.remove('hidden'); } else { document.getElementById('gas-mese2').classList.add('hidden'); }
    if (l === 'fasce') { document.getElementById('div-fasce1').classList.remove('hidden'); document.getElementById('div-mono1').classList.add('hidden'); document.getElementById('div-fasce2').classList.remove('hidden'); document.getElementById('div-mono2').classList.add('hidden'); }
    else { document.getElementById('div-fasce1').classList.add('hidden'); document.getElementById('div-mono1').classList.remove('hidden'); document.getElementById('div-fasce2').classList.add('hidden'); document.getElementById('div-mono2').classList.remove('hidden'); }
}
function updateOffersDropdown() {
    const t = document.getElementById('userType').value, sL = document.getElementById('selectedOfferLuce'), sG = document.getElementById('selectedOfferGas');
    const dispB = (t === 'business') ? 'none' : 'block', dispF = (t === 'business') ? 'block' : 'none';
    ['opt-casa-luce', 'opt-casa-gas', 'opt-casa-pun0-luce', 'opt-casa-pun0-gas', 'opt-fix-casa-luce', 'opt-fix-casa-gas'].forEach(id => { if(document.getElementById(id)) document.getElementById(id).style.display = dispB; });
    ['opt-fix-biz-luce', 'opt-fix-biz-gas'].forEach(id => { if(document.getElementById(id)) document.getElementById(id).style.display = dispF; });
    if (t === 'business' && ['ultraGreenCasa', 'ultraGreenCasaPun0', 'ultraGreenFixCasa'].includes(sL.value)) sL.value = '';
    if (t === 'business' && ['ultraGreenCasa', 'ultraGreenCasaPun0', 'ultraGreenFixCasa'].includes(sG.value)) sG.value = '';
    if (t !== 'business' && sL.value === 'ultraGreenFixBusiness') sL.value = '';
    if (t !== 'business' && sG.value === 'ultraGreenFixBusiness') sG.value = '';
}
document.addEventListener('DOMContentLoaded', () => {
    ['monthLuce1', 'monthLuce2', 'monthGas1', 'monthGas2'].forEach(id => { const el = document.getElementById(id); if (el) months.forEach(m => el.add(new Option(m.t, m.v))); });
    ['utilityType', 'tipoLettura', 'freqLuce', 'freqGas'].forEach(id => document.getElementById(id).addEventListener('change', toggleSections));
    document.getElementById('userType').addEventListener('change', updateOffersDropdown); toggleSections(); updateOffersDropdown();
});
document.getElementById('calculator-form').onsubmit = function(e) {
    e.preventDefault();
    const userType = document.getElementById('userType').value, utente = document.getElementById('clientName').value, utility = document.getElementById('utilityType').value;
    const oL = document.getElementById('selectedOfferLuce').value, nL = document.getElementById('selectedOfferLuce').options[document.getElementById('selectedOfferLuce').selectedIndex].text, hL = document.getElementById('hasCapLuce').value === 'si';
    const oG = document.getElementById('selectedOfferGas').value, nG = document.getElementById('selectedOfferGas').options[document.getElementById('selectedOfferGas').selectedIndex].text, hG = document.getElementById('hasCapGas').value === 'si';
    const LIM_L = 0.170, LIM_G = 0.630, oggi = new Date(), uG = new Date(oggi.getFullYear(), oggi.getMonth() + 1, 0), dS = `${String(uG.getDate()).padStart(2,'0')}/${String(uG.getMonth()+1).padStart(2,'0')}/${uG.getFullYear()}`;
    let totSave = 0, dCap = '';
    if ((utility === 'light' || utility === 'lightAndGas') && hL) dCap += `<p style="font-size:0.9em; color:#1b5e20; margin:3px 0;">🛡️ <strong>CAP Luce Attivo</strong> (€ ${LIM_L.toFixed(3)})</p>`;
    if ((utility === 'gas' || utility === 'lightAndGas') && hG) dCap += `<p style="font-size:0.9em; color:#1b5e20; margin:3px 0;">🛡️ <strong>CAP Gas Attivo</strong> (€ ${LIM_G.toFixed(3)})</p>`;
    let rHtml = `<div id="report-box" style="padding:30px; border:3px solid #2e7d32; background:white; border-radius:10px; font-family:'Roboto',sans-serif;"><div style="text-align:center; border-bottom:2px solid #eee; padding-bottom:15px; margin-bottom:20px;"><h2 style="color:#2e7d32; margin-bottom:5px;">Simulazione di Risparmio</h2><p style="font-size:1.2em; margin:5px 0;">Cliente: <strong>${utente}</strong></p>${dCap}<p style="font-size:0.95em; color:#d32f2f;"><strong>Scadenza: ${dS}</strong></p></div>`;
    function fRes(vA, et, sA, sN, nO, fr) {
        const vM = vA / 12, isR = vA >= 0, col = isR ? "#1b5e20" : "#d32f2f", bg = isR ? "#f1f8e9" : "#ffebee", bCol = isR ? "green" : "red", seg = isR ? "-" : "+", lbl = isR ? "Risparmio Medio" : "Differenza Media", tP = (fr === 1) ? "Mensile" : "Bimestrale";
        return `<div style="margin-bottom: 20px; padding: 15px; border-left: 4px solid ${bCol}; background: ${bg}; border-radius: 0 5px 5px 0;"><p style="font-size:1.15em; margin: 5px 0; color: ${col}; text-transform: uppercase;"><strong>${et}</strong></p><div style="font-size:0.95em; color: #444; margin-bottom: 10px;"><p style="margin: 2px 0;">Attuale (${tP}): <strong>€ ${sA.toFixed(2)}</strong></p><p style="margin: 2px 0;">Con ${nO} (${tP}): <strong>€ ${sN.toFixed(2)}</strong></p></div><div style="border-top: 1px dotted #ccc; padding-top: 10px;"><p style="font-size:1.05em; margin: 3px 0;">${lbl} Mensile: <strong style="color:${bCol};">€ ${seg}${Math.abs(vM).toFixed(2)}</strong></p><p style="font-size:1.05em; margin: 3px 0;">${lbl} Annuo: <strong style="color:${bCol};">€ ${seg}${Math.abs(vA).toFixed(2)}</strong></p></div></div>`;
    }
    if (utility === 'light' || utility === 'lightAndGas') {
        const fr = parseInt(document.getElementById('freqLuce').value), ann = parseFloat(document.getElementById('annuoLuce').value) || 0, sP = parseFloat(document.getElementById('costMateriaLuce').value) || 0, pP = parseFloat(document.getElementById('pcvAttualeLuce').value) || 0, tL = document.getElementById('tipoLettura').value;
        let ogt = (oL==='ultraGreenCasaPun0')?19.95:(oL==='ultraGreenCasa'||oL==='ultraGreenFixCasa'||userType==='consumer')?8.95:(oL==='ultraGreenPMI'||oL==='ultraGreenGrandiAziende')?19.95:14.95;
        let cT = 0, cE = 0; const cL = OFFERTE_SPREAD[oL];
        if (tL === 'fasce') { cT += (parseFloat(document.getElementById('kWhF1_M1').value)||0)+(parseFloat(document.getElementById('kWhF2_M1').value)||0)+(parseFloat(document.getElementById('kWhF3_M1').value)||0); } else { cT += parseFloat(document.getElementById('kWhTot1').value)||0; }
        if (fr === 2) { if (tL === 'fasce') { cT += (parseFloat(document.getElementById('kWhF1_M2').value)||0)+(parseFloat(document.getElementById('kWhF2_M2').value)||0)+(parseFloat(document.getElementById('kWhF3_M2').value)||0); } else { cT += parseFloat(document.getElementById('kWhTot2').value)||0; } }
        if (cL && cL.isFix) {
            cE = cT * cL.luceFix;
        } else {
            const sB = cL?.luce || 0.055, sE = hL ? (sB + 0.009) : sB, m1 = document.getElementById('monthLuce1').value, p1 = DB_PRICES.pun[m1];
            let f1=hL?Math.min(p1.f1,LIM_L):p1.f1, f2=hL?Math.min(p1.f2,LIM_L):p1.f2, f3=hL?Math.min(p1.f3,LIM_L):p1.f3, mo=hL?Math.min(p1.mono,LIM_L):p1.mono;
            if (tL === 'fasce') { cE += ((parseFloat(document.getElementById('kWhF1_M1').value)||0)*f1)+((parseFloat(document.getElementById('kWhF2_M1').value)||0)*f2)+((parseFloat(document.getElementById('kWhF3_M1').value)||0)*f3); } else { cE += (parseFloat(document.getElementById('kWhTot1').value)||0)*mo; }
            if (fr === 2) {
                const m2 = document.getElementById('monthLuce2').value, p2 = DB_PRICES.pun[m2];
                let f12=hL?Math.min(p2.f1,LIM_L):p2.f1, f22=hL?Math.min(p2.f2,LIM_L):p2.f2, f32=hL?Math.min(p2.f3,LIM_L):p2.f3, mo2=hL?Math.min(p2.mono,LIM_L):p2.mono;
                if (tL === 'fasce') { cE += ((parseFloat(document.getElementById('kWhF1_M2').value)||0)*f12)+((parseFloat(document.getElementById('kWhF2_M2').value)||0)*f22)+((parseFloat(document.getElementById('kWhF3_M2').value)||0)*f32); } else { cE += (parseFloat(document.getElementById('kWhTot2').value)||0)*mo2; }
            }
            cE += (cT * sE);
        }
        let sAt = sP + (pP * fr), sUG = cE + (ogt * fr), svA = ((sAt - sUG) / (cT || 1)) * ann; totSave += svA; rHtml += fRes(svA, "⚡ Fornitura Luce", sAt, sUG, nL, fr);
    }
    if (utility === 'gas' || utility === 'lightAndGas') {
        const fr = parseInt(document.getElementById('freqGas').value), ann = parseFloat(document.getElementById('annuoGas').value) || 0, sP = parseFloat(document.getElementById('costMateriaGas').value) || 0, pP = parseFloat(document.getElementById('pcvAttualeGas').value) || 0;
        let ogt = (oG==='ultraGreenCasaPun0')?19.95:(oG==='ultraGreenCasa'||oG==='ultraGreenFixCasa'||userType==='consumer')?8.95:(oG==='ultraGreenPMI'||oG==='ultraGreenGrandiAziende')?19.95:14.95;
        let cT = 0, cG = 0; const cGConf = OFFERTE_SPREAD[oG];
        if (cGConf && cGConf.isFix) {
            cT += parseFloat(document.getElementById('smcTot1').value) || 0; if (fr === 2) cT += parseFloat(document.getElementById('smcTot2').value) || 0;
            cG = cT * cGConf.gasFix;
        } else {
            const sB = cGConf?.gas || 0.20, sE = hG ? (sB + 0.09) : sB, m1 = document.getElementById('monthGas1').value, c1 = parseFloat(document.getElementById('smcTot1').value) || 0;
            cT += c1; let psv1 = hG ? Math.min(DB_PRICES.psv[m1], LIM_G) : DB_PRICES.psv[m1]; cG += c1 * psv1;
            if (fr === 2) { const m2 = document.getElementById('monthGas2').value, c2 = parseFloat(document.getElementById('smcTot2').value) || 0; cT += c2; let psv2 = hG ? Math.min(DB_PRICES.psv[m2], LIM_G) : DB_PRICES.psv[m2]; cG += c2 * psv2; }
            cG += (cT * sE);
        }
        let sAt = sP + (pP * fr), sUG = cG + (ogt * fr), svA = ((sAt - sUG) / (cT || 1)) * ann; totSave += svA; rHtml += fRes(svA, "🔥 Fornitura Gas", sAt, sUG, nG, fr);
    }
    let tSt = "", tTx = "";
    if (totSave > 0) { tSt = "background:#2e7d32; color:white;"; tTx = `RISPARMIO ANNUO STIMATO<br><span style='font-size:2.5em; font-weight:bold;'>€ -${Math.abs(totSave).toFixed(2)}</span>`; }
    else if (totSave < 0) { tSt = "background:#d32f2f; color:white;"; tTx = `DIFFERENZA ANNUALE<br><span style='font-size:2.5em; font-weight:bold;'>+€ ${Math.abs(totSave).toFixed(2)}</span>`; }
    else { tSt = "background:#757575; color:white;"; tTx = `RISPARMIO ANNUO<br><span style='font-size:2.5em; font-weight:bold;'>€ 0.00</span>`; }
    rHtml += `<div style="${tSt} padding:20px; text-align:center; border-radius:8px; margin-top:20px;"><span style='text-transform:uppercase; font-size:0.9em;'>${tTx}</span></div></div>`;
    document.getElementById('result').innerHTML = rHtml; document.getElementById('result').style.display = 'block';
    document.getElementById('export-actions').classList.remove('hidden'); document.getElementById('export-actions').style.display = 'block';
};

window.exportDoc = function(t) {
    // CAMBIATO QUI: Seleziona solo il riquadro dell'output e non tutta la pagina
    const el = document.getElementById('report-box');
    if (!el) return;
    
    html2canvas(el, { scale: 2, useCORS: true, logging: false }).then(canvas => {
        if (t === 'png') {
            canvas.toBlob(blob => { 
                const l = document.createElement('a'); 
                l.download = 'Report_Risparmio.png'; 
                l.href = URL.createObjectURL(blob); 
                document.body.appendChild(l); 
                l.click(); 
                document.body.removeChild(l); 
                URL.revokeObjectURL(l.href); 
            }, 'image/png');
        } else if (t === 'pdf') {
            const img = canvas.toDataURL('image/png');
            
            const { jsPDF } = window.jspdf;
            const pdf = new jsPDF('p', 'mm', 'a4');
            
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
            
            pdf.addImage(img, 'PNG', 0, 0, pdfWidth, pdfHeight);
            pdf.save('Report_Risparmio.pdf');
        }
    }).catch(err => console.error("Errore esportazione:", err));
};
