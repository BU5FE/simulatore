// --- 1. DATABASE PREZZI (PUN e PSV) ---
const monthlyPrices = {
    pun: { '2025-07': 0.112, '2025-08': 0.121, '2025-09': 0.115, '2025-10': 0.108, '2025-11': 0.119, '2025-12': 0.132, '2026-01': 0.124, '2026-02': 0.115 },
    psv: { '2025-07': 0.36, '2025-08': 0.38, '2025-09': 0.40, '2025-10': 0.42, '2025-11': 0.45, '2025-12': 0.48, '2026-01': 0.45, '2026-02': 0.42 },
    punFasce: {
        '2025-07': { F1: 0.125, F2: 0.115, F3: 0.098 }, '2025-08': { F1: 0.135, F2: 0.125, F3: 0.108 },
        '2025-09': { F1: 0.125, F2: 0.115, F3: 0.098 }, '2025-10': { F1: 0.118, F2: 0.108, F3: 0.085 },
        '2025-11': { F1: 0.135, F2: 0.125, F3: 0.108 }, '2025-12': { F1: 0.145, F2: 0.135, F3: 0.115 },
        '2026-01': { F1: 0.135, F2: 0.122, F3: 0.105 }, '2026-02': { F1: 0.128, F2: 0.118, F3: 0.095 }
    }
};

// --- 2. FUNZIONI DI INTERFACCIA (MOSTRA/NASCONDI) ---
function updateFieldVisibility() {
    const utilityType = document.getElementById('utilityType').value;
    const isLight = (utilityType === 'light' || utilityType === 'lightAndGas');
    const isGas = (utilityType === 'gas' || utilityType === 'lightAndGas');

    document.getElementById('light-fields-m1').style.display = isLight ? 'block' : 'none';
    document.getElementById('gas-fields-m1').style.display = isGas ? 'block' : 'none';
    document.getElementById('light-fields-m2').style.display = isLight ? 'block' : 'none';
    document.getElementById('gas-fields-m2').style.display = isGas ? 'block' : 'none';
}

function updateBimonthlyFieldsVisibility() {
    const isBimonthly = document.getElementById('billingFrequency').value === 'bimonthly';
    document.getElementById('data-m2-fields').style.display = isBimonthly ? 'block' : 'none';
    document.getElementById('billingNote').style.display = isBimonthly ? 'block' : 'none';
    if (isBimonthly) populateMonthSelection2();
    updateMonthLabels();
}

function populateMonthSelection2() {
    const m1 = document.getElementById('monthSelection1');
    const m2 = document.getElementById('monthSelection2');
    let nextIdx = m1.selectedIndex + 1;
    if (nextIdx >= m1.options.length) nextIdx = 0;
    
    m2.innerHTML = "";
    Array.from(m1.options).forEach(opt => {
        let newOpt = new Option(opt.text, opt.value);
        m2.add(newOpt);
    });
    m2.selectedIndex = nextIdx;
}

function updateMonthLabels() {
    const m1Text = document.getElementById('monthSelection1').options[document.getElementById('monthSelection1').selectedIndex].text;
    const m2Text = document.getElementById('monthSelection2').options.length > 0 ? 
                   document.getElementById('monthSelection2').options[document.getElementById('monthSelection2').selectedIndex].text : "";

    const labels = {
        'monthNameConsumptionType1': m1Text, 'monthNameLightCons1': m1Text, 'monthNameLightPrice1': m1Text, 'monthNameGasCons1': m1Text, 'monthNameGasPrice1': m1Text,
        'monthNameConsumptionType2': m2Text, 'monthNameLightCons2': m2Text, 'monthNameLightPrice2': m2Text, 'monthNameGasCons2': m2Text, 'monthNameGasPrice2': m2Text
    };
    for (let id in labels) { if(document.getElementById(id)) document.getElementById(id).textContent = `(${labels[id]})`; }
}

function updateLightConsumptionFieldsVisibility(idx) {
    const isFasce = document.getElementById(`consumptionType${idx}`).value === 'fasce';
    document.getElementById(`light-monorario-fields-m${idx}`).style.display = isFasce ? 'none' : 'block';
    document.getElementById(`light-fasce-fields-m${idx}`).style.display = isFasce ? 'block' : 'none';
}

// --- 3. LOGICA DI CALCOLO ---
function calculateSaving(month, consL, priceL, consG, priceG, userType, offerId, utilityType, isFasce) {
    let res = { costL: 0, costG: 0, saveL: 0, saveG: 0 };
    const ogtL = (offerId === 'revolutionTax') ? 12.0 : (userType === 'consumer' ? 9.0 : 12.5);
    const ogtG = (userType === 'consumer' ? 9.0 : 13.0);

    if (utilityType.includes('light')) {
        let spread = 0, fixP = 0;
        switch(offerId) {
            case 'ultraGreenCasa': spread = 0.0551; break;
            case 'ultraGreenGrandiAziende': spread = 0.0562; break;
            case 'revolutionTax': spread = (userType === 'consumer' ? 0.04625 : 0.061); break;
            case 'ultraGreenFix': fixP = 0.16; break;
            case 'ultraGreenPMI': spread = 0.0595; break;
        }
        let eCost = 0;
        let totKwh = isFasce ? (consL.F1 + consL.F2 + consL.F3) : consL;
        if (fixP > 0) eCost = totKwh * fixP;
        else if (isFasce) {
            const pF = monthlyPrices.punFasce[month];
            eCost = (consL.F1*(pF.F1+spread)) + (consL.F2*(pF.F2+spread)) + (consL.F3*(pF.F3+spread));
        } else eCost = totKwh * (monthlyPrices.pun[month] + spread);
        
        res.costL = eCost + ogtL;
        res.saveL = priceL - res.costL;
    }

    if (utilityType.includes('gas')) {
        let gPrice = 0, psv = monthlyPrices.psv[month];
        switch(offerId) {
            case 'ultraGreenCasa': gPrice = psv + 0.305; break;
            case 'ultraGreenGrandiAziende': gPrice = psv + 0.157; break;
            case 'revolutionTax': gPrice = psv + 0.210; break;
            case 'ultraGreenFix': gPrice = 0.607; break;
            case 'ultraGreenPMI': gPrice = psv + 0.181; break;
        }
        res.costG = (consG * gPrice) + ogtG;
        res.saveG = priceG - res.costG;
    }
    return res;
}

// --- 4. GESTORE FORM ---
document.getElementById('calculator-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const utilityType = document.getElementById('utilityType').value;
    const offerId = document.getElementById('selectedOffer').value;
    const isBim = document.getElementById('billingFrequency').value === 'bimonthly';
    const numM = isBim ? 2 : 1;

    let totalSave = 0, totalCurrent = 0, totalNew = 0;

    for (let i = 1; i <= numM; i++) {
        const month = document.getElementById(`monthSelection${i}`).value;
        const isF = document.getElementById(`consumptionType${i}`).value === 'fasce';
        let cL = isF ? {
            F1: parseFloat(document.getElementById(`currentConsumptionF1_${i}`).value)||0,
            F2: parseFloat(document.getElementById(`currentConsumptionF2_${i}`).value)||0,
            F3: parseFloat(document.getElementById(`currentConsumptionF3_${i}`).value)||0
        } : parseFloat(document.getElementById(`currentConsumptionLight${i}`).value)||0;
        
        let pL = (parseFloat(document.getElementById(`currentPriceLight${i}`).value)||0) + (parseFloat(document.getElementById(`currentPCVLight1`).value)||0);
        let cG = parseFloat(document.getElementById(`currentConsumptionGas${i}`).value)||0;
        let pG = (parseFloat(document.getElementById(`currentPriceGas${i}`).value)||0) + (parseFloat(document.getElementById(`currentPCVGas1`).value)||0);

        let r = calculateSaving(month, cL, pL, cG, pG, document.getElementById('userType').value, offerId, utilityType, isF);
        totalSave += (r.saveL + r.saveG);
        totalCurrent += (pL + pG);
        totalNew += (r.costL + r.costG);
    }

    const resDiv = document.getElementById('result');
    resDiv.innerHTML = `
        <div id="result-content" style="padding:20px; border:2px solid #2e7d32; background:#fff; border-radius:10px;">
            <h2 style="color:#2e7d32;">Risultato per ${document.getElementById('clientName').value}</h2>
            <p>Risparmio nel periodo: <strong style="color:green;">${totalSave.toFixed(2)}€</strong></p>
            <p>Risparmio Annuo Stimato: <strong>${((totalSave/numM)*12).toFixed(2)}€</strong></p>
        </div>`;
    resDiv.style.display = 'block';
    document.getElementById('export-actions').style.display = 'block';
});

// --- 5. INITIALIZE ---
document.getElementById('utilityType').addEventListener('change', updateFieldVisibility);
document.getElementById('billingFrequency').addEventListener('change', updateBimonthlyFieldsVisibility);
document.getElementById('monthSelection1').addEventListener('change', updateBimonthlyFieldsVisibility);
document.getElementById('monthSelection2').addEventListener('change', updateMonthLabels);

document.addEventListener('DOMContentLoaded', () => {
    updateFieldVisibility();
    updateBimonthlyFieldsVisibility();
    // Aggancio manuale per il cambio fasce
    document.getElementById('consumptionType1').onchange = () => updateLightConsumptionFieldsVisibility('1');
    document.getElementById('consumptionType2').onchange = () => updateLightConsumptionFieldsVisibility('2');
});

function exportResult(type) {
    const el = document.getElementById('result-content');
    html2canvas(el).then(canvas => {
        if (type === 'pdf') {
            const pdf = new jspdf.jsPDF();
            pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 10, 10, 180, 100);
            pdf.save("risparmio.pdf");
        } else {
            const a = document.createElement('a'); a.href = canvas.toDataURL(); a.download = "risparmio.png"; a.click();
        }
    });
}
document.getElementById('exportPdfBtn').onclick = () => exportResult('pdf');
document.getElementById('exportImgBtn').onclick = () => exportResult('image');
