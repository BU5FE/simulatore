// --- DATI DI RIFERIMENTO PREZZI ---
const monthlyPrices = {
    pun: { '01': 0.124, '02': 0.115, '03': 0.105, '04': 0.098, '05': 0.092, '06': 0.101, '07': 0.112, '08': 0.121, '09': 0.115, '10': 0.108, '11': 0.119, '12': 0.132 },
    psv: { '01': 0.45, '02': 0.42, '03': 0.38, '04': 0.35, '05': 0.32, '06': 0.34, '07': 0.36, '08': 0.38, '09': 0.40, '10': 0.42, '11': 0.45, '12': 0.48 },
    punFasce: {
        '01': { F1: 0.135, F2: 0.122, F3: 0.105 }, '02': { F1: 0.128, F2: 0.118, F3: 0.095 },
        '03': { F1: 0.115, F2: 0.105, F3: 0.088 }, '04': { F1: 0.108, F2: 0.098, F3: 0.075 },
        '05': { F1: 0.098, F2: 0.088, F3: 0.065 }, '06': { F1: 0.108, F2: 0.098, F3: 0.075 },
        '07': { F1: 0.125, F2: 0.115, F3: 0.098 }, '08': { F1: 0.135, F2: 0.125, F3: 0.108 },
        '09': { F1: 0.125, F2: 0.115, F3: 0.098 }, '10': { F1: 0.118, F2: 0.108, F3: 0.085 },
        '11': { F1: 0.135, F2: 0.125, F3: 0.108 }, '12': { F1: 0.145, F2: 0.135, F3: 0.115 }
    }
};

// --- GESTIONE INTERFACCIA (UI) ---
function updateFieldVisibility() {
    const utilityType = document.getElementById('utilityType').value;
    const lightSections = document.querySelectorAll('.light-only');
    const gasSections = document.querySelectorAll('.gas-only');
    
    lightSections.forEach(s => s.style.display = (utilityType === 'light' || utilityType === 'lightAndGas') ? 'block' : 'none');
    gasSections.forEach(s => s.style.display = (utilityType === 'gas' || utilityType === 'lightAndGas') ? 'block' : 'none');
}

function updateBimonthlyFieldsVisibility() {
    const billingFrequency = document.getElementById('billingFrequency').value;
    const secondMonthSection = document.getElementById('secondMonthSection');
    const isBimonthly = (billingFrequency === 'bimonthly');

    if (secondMonthSection) {
        secondMonthSection.style.display = isBimonthly ? 'block' : 'none';
        if (isBimonthly) populateMonthSelection2();
    }
    updateMonthLabels();
}

function populateMonthSelection2() {
    const m1 = document.getElementById('monthSelection1').value;
    const m2Select = document.getElementById('monthSelection2');
    if (!m1 || !m2Select) return;
    let nextMonth = parseInt(m1) + 1;
    if (nextMonth > 12) nextMonth = 1;
    m2Select.value = nextMonth.toString().padStart(2, '0');
}

function updateMonthLabels() {
    const m1Name = document.getElementById('monthSelection1').options[document.getElementById('monthSelection1').selectedIndex].text;
    const m2Name = document.getElementById('monthSelection2').options[document.getElementById('monthSelection2').selectedIndex].text;
    const isBimonthly = document.getElementById('billingFrequency').value === 'bimonthly';

    document.querySelectorAll('.month1-label').forEach(el => el.textContent = isBimonthly ? `Totale Bimestre (${m1Name}-${m2Name})` : m1Name);
    document.querySelectorAll('.month2-label').forEach(el => el.textContent = m2Name);
}

function updateLightConsumptionFieldsVisibility(idx) {
    const type = document.getElementById(`consumptionType${idx}`).value;
    document.getElementById(`monoLight${idx}`).style.display = (type === 'monorario') ? 'block' : 'none';
    document.getElementById(`fasceLight${idx}`).style.display = (type === 'fasce') ? 'block' : 'none';
}
// --- FUNZIONE CORE DI CALCOLO MATEMATICO ---
function calculateMonthlySaving(month, consumptionLight, priceLight, consumptionGas, priceGas, annualConsumptionLight, annualConsumptionGas, userType, selectedOfferId, utilityType, isFasce) {
    let savingMonthlyLuce = 0, newOfferCostLuce = 0, savingMonthlyGas = 0, newOfferCostGas = 0;
    
    // Gestione Consumi Luce (Stima se il dato mensile è 0)
    let monthlyConsumptionLight = isFasce ? (consumptionLight.F1 + consumptionLight.F2 + consumptionLight.F3) : consumptionLight;
    if (monthlyConsumptionLight === 0 && annualConsumptionLight > 0) monthlyConsumptionLight = annualConsumptionLight / 12;

    // Gestione Consumi Gas (Stima se il dato mensile è 0)
    let monthlyConsumptionGas = consumptionGas;
    if (monthlyConsumptionGas === 0 && annualConsumptionGas > 0) monthlyConsumptionGas = annualConsumptionGas / 12;
    
    const ogtCostLuce = (selectedOfferId === 'revolutionTax') ? 12.00 : (userType === 'consumer' ? 9.00 : 12.50);
    const ogtCostGas = (userType === 'consumer' ? 9.00 : 13.00);

    // CALCOLO LUCE
    if (utilityType === 'light' || utilityType === 'lightAndGas') {
        if (monthlyConsumptionLight > 0) {
            let energyCostLight = 0, spreadLuce = 0, fixPriceLuce = 0;
            switch(selectedOfferId) {
                case 'ultraGreenCasa': spreadLuce = 0.0551; break;
                case 'ultraGreenGrandiAziende': spreadLuce = 0.0562; break;
                case 'revolutionTax': spreadLuce = (userType === 'consumer' ? 0.04625 : 0.061); break;
                case 'ultraGreenFix': fixPriceLuce = 0.16; break;
                case 'ultraGreenPMI': spreadLuce = 0.0595; break;
            }

            if (fixPriceLuce > 0) {
                energyCostLight = monthlyConsumptionLight * fixPriceLuce;
            } else if (isFasce) {
                const pF = monthlyPrices.punFasce[month];
                energyCostLight = (consumptionLight.F1 * (pF.F1 + spreadLuce)) + 
                                  (consumptionLight.F2 * (pF.F2 + spreadLuce)) + 
                                  (consumptionLight.F3 * (pF.F3 + spreadLuce));
            } else {
                energyCostLight = monthlyConsumptionLight * (monthlyPrices.pun[month] + spreadLuce);
            }
            newOfferCostLuce = energyCostLight + ogtCostLuce;
            savingMonthlyLuce = priceLight - newOfferCostLuce;
        }
    }

    // CALCOLO GAS
    if (utilityType === 'gas' || utilityType === 'lightAndGas') {
        if (monthlyConsumptionGas > 0) {
            let gasPricePerSmc = 0;
            const psv = monthlyPrices.psv[month];
            switch(selectedOfferId) {
                case 'ultraGreenCasa': gasPricePerSmc = psv + 0.305; break;
                case 'ultraGreenGrandiAziende': gasPricePerSmc = psv + 0.157; break;
                case 'revolutionTax': gasPricePerSmc = psv + 0.210; break;
                case 'ultraGreenFix': gasPricePerSmc = 0.607; break;
                case 'ultraGreenPMI': gasPricePerSmc = psv + 0.181; break;
            }
            newOfferCostGas = (monthlyConsumptionGas * gasPricePerSmc) + ogtCostGas;
            savingMonthlyGas = priceGas - newOfferCostGas;
        }
    }

    return { 
        savingLuce: savingMonthlyLuce, costLuce: newOfferCostLuce, consumptionLuce: monthlyConsumptionLight, currentPriceLuce: priceLight, ogtLuce: ogtCostLuce,
        savingGas: savingMonthlyGas, costGas: newOfferCostGas, consumptionGas: monthlyConsumptionGas, currentPriceGas: priceGas, ogtGas: ogtCostGas 
    };
}

// --- GESTORE INVIO FORM (CALCOLO RISULTATI) ---
document.getElementById('calculator-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Recupero dati generali
    const clientName = document.getElementById('clientName').value.trim();
    const billingFrequency = document.getElementById('billingFrequency').value;
    const userType = document.getElementById('userType').value;
    const utilityType = document.getElementById('utilityType').value;
    const selectedOfferId = document.getElementById('selectedOffer').value;
    const isBimonthly = (billingFrequency === 'bimonthly');
    const numMonths = isBimonthly ? 2 : 1;
    
    if (!clientName) { alert('Inserisci il Nome Cliente.'); return; }

    let monthlyResults = [];
    const annConsLuce = parseFloat(document.getElementById('annualConsumptionLight').value) || 0;
    const annConsGas = parseFloat(document.getElementById('annualConsumptionGas').value) || 0;
    const pcvL1 = parseFloat(document.getElementById('currentPCVLight1')?.value) || 0;
    const pcvG1 = parseFloat(document.getElementById('currentPCVGas1')?.value) || 0;

    // Ciclo di calcolo per Mese 1 e (eventualmente) Mese 2
    for (let i = 1; i <= numMonths; i++) {
        const mIdx = i.toString();
        const month = document.getElementById(`monthSelection${mIdx}`).value;
        let cLuce = 0, pLuce = 0, cGas = 0, pGas = 0, isF = false;

        if (utilityType.includes('light')) {
            isF = (document.getElementById(`consumptionType${mIdx}`).value === 'fasce');
            if (isF) {
                cLuce = {
                    F1: parseFloat(document.getElementById(`currentConsumptionF1_${mIdx}`).value) || 0,
                    F2: parseFloat(document.getElementById(`currentConsumptionF2_${mIdx}`).value) || 0,
                    F3: parseFloat(document.getElementById(`currentConsumptionF3_${mIdx}`).value) || 0
                };
            } else {
                cLuce = parseFloat(document.getElementById(`currentConsumptionLight${mIdx}`).value) || 0;
            }
            pLuce = (parseFloat(document.getElementById(`currentPriceLight${mIdx}`).value) || 0) + (pcvL1 / (isBimonthly ? 1 : numMonths));
        }

        if (utilityType.includes('gas')) {
            cGas = parseFloat(document.getElementById(`currentConsumptionGas${mIdx}`).value) || 0;
            pGas = (parseFloat(document.getElementById(`currentPriceGas${mIdx}`).value) || 0) + (pcvG1 / (isBimonthly ? 1 : numMonths));
        }

        monthlyResults.push(calculateMonthlySaving(month, cLuce, pLuce, cGas, pGas, annConsLuce, annConsGas, userType, selectedOfferId, utilityType, isF));
    }
    // --- GENERAZIONE OUTPUT RISULTATI ---
    let totalLuceCons = 0, totalGasCons = 0, totalNewLuce = 0, totalNewGas = 0, totalCurLuce = 0, totalCurGas = 0;
    let allDetailsLuce = "", allDetailsGas = "";

    monthlyResults.forEach((r, index) => {
        totalLuceCons += r.consumptionLuce; totalGasCons += r.consumptionGas;
        totalNewLuce += r.costLuce; totalNewGas += r.costGas;
        totalCurLuce += r.currentPriceLuce; totalCurGas += r.currentPriceGas;
        
        const mName = document.getElementById(`monthSelection${index + 1}`).options[document.getElementById(`monthSelection${index + 1}`).selectedIndex].text;
        
        if (utilityType.includes('light')) {
            allDetailsLuce += `<h4>${mName}</h4>
                <p>Consumo: <strong>${Math.round(r.consumptionLuce)} kWh</strong> | Costo Attuale: <strong>${r.currentPriceLuce.toFixed(2)}€</strong> | Nuova Offerta: <strong>${r.costLuce.toFixed(2)}€</strong></p>`;
        }
        if (utilityType.includes('gas')) {
            allDetailsGas += `<h4>${mName}</h4>
                <p>Consumo: <strong>${Math.round(r.consumptionGas)} smc</strong> | Costo Attuale: <strong>${r.currentPriceGas.toFixed(2)}€</strong> | Nuova Offerta: <strong>${r.costGas.toFixed(2)}€</strong></p>`;
        }
    });

    const totalSaving = (totalCurLuce + totalCurGas) - (totalNewLuce + totalNewGas);
    const avgMonthlySaving = totalSaving / numMonths;
    const annualSaving = avgMonthlySaving * 12;
    const offerNames = { ultraGreenCasa: 'UltraGreen Casa', ultraGreenFix: 'UltraGreen Fix', ultraGreenPMI: 'UltraGreen PMI', ultraGreenGrandiAziende: 'UltraGreen Grandi Aziende', revolutionTax: 'Revolution Tax' };

    let finalOutput = `
        <div id="result-content" style="padding: 20px; border: 2px solid #4caf50; border-radius: 10px; background: #fff; font-family: sans-serif;">
            <p style="text-align: right; color: #666;">Scadenza Proposta: ${new Date(Date.now() + 1296000000).toLocaleDateString('it-IT')}</p>
            <h2 style="color: #2e7d32; border-bottom: 2px solid #4caf50;">Cliente: ${clientName}</h2>
            <h3>Simulazione Offerta: ${offerNames[selectedOfferId]}</h3>
            
            ${utilityType.includes('light') ? `<div style="margin-top:20px;"><h3>Dettagli LUCE</h3>${allDetailsLuce}</div>` : ''}
            ${utilityType.includes('gas') ? `<div style="margin-top:20px;"><h3>Dettagli GAS</h3>${allDetailsGas}</div>` : ''}
            
            <div style="margin-top: 30px; padding: 15px; background: #f1f8e9; border-radius: 8px;">
                <h3 style="margin-top:0;">Riepilogo Totale (${isBimonthly ? 'Bimestrale' : 'Mensile'})</h3>
                <p>Costo Totale Attuale: <strong>${(totalCurLuce + totalCurGas).toFixed(2)}€</strong></p>
                <p>Costo con Nuova Offerta: <strong>${(totalNewLuce + totalNewGas).toFixed(2)}€</strong></p>
                <p style="font-size: 1.2em; color: ${totalSaving > 0 ? 'green' : 'red'};">
                    Risparmio nel periodo: <strong>${totalSaving.toFixed(2)}€</strong>
                </p>
                <p style="font-size: 1.3em; font-weight: bold; color: ${annualSaving > 0 ? 'green' : 'red'}; border-top: 1px solid #ccc; pt:10px;">
                    Prospetto Risparmio Annuo: ${annualSaving.toFixed(2)}€
                </p>
            </div>
        </div>`;

    const resDiv = document.getElementById('result');
    resDiv.innerHTML = finalOutput;
    resDiv.style.display = 'block';
    document.getElementById('export-actions').style.display = 'block';
    window.scrollTo(0, 0);
});

// --- FUNZIONI DI ESPORTAZIONE ---
function exportResult(type) {
    const element = document.getElementById('result-content');
    if (!element) return;
    
    if (type === 'image') {
        html2canvas(element).then(canvas => {
            const link = document.createElement('a');
            link.download = 'Simulazione_Energia.png';
            link.href = canvas.toDataURL();
            link.click();
        });
    } else if (type === 'pdf') {
        const { jsPDF } = window.jspdf;
        const pdf = new jsPDF('p', 'mm', 'a4');
        html2canvas(element).then(canvas => {
            const imgData = canvas.toDataURL('image/png');
            const imgProps = pdf.getImageProperties(imgData);
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
            pdf.save('Simulazione_Energia.pdf');
        });
    }
}

// --- ATTIVAZIONE DEI LISTENER (SENSORI) ---
document.getElementById('utilityType').addEventListener('change', () => { updateFieldVisibility(); updateMonthLabels(); });
document.getElementById('billingFrequency').addEventListener('change', updateBimonthlyFieldsVisibility);
document.getElementById('monthSelection1').addEventListener('change', updateMonthLabels);
document.getElementById('monthSelection2').addEventListener('change', updateMonthLabels);
document.getElementById('consumptionType1').addEventListener('change', () => updateLightConsumptionFieldsVisibility('1'));
document.getElementById('consumptionType2').addEventListener('change', () => updateLightConsumptionFieldsVisibility('2'));

document.getElementById('userType').addEventListener('change', function() {
    const opt = document.querySelector('#selectedOffer option[value="ultraGreenCasa"]');
    if (this.value === 'business') {
        opt.style.display = 'none';
        if (document.getElementById('selectedOffer').value === 'ultraGreenCasa') document.getElementById('selectedOffer').value = '';
    } else {
        opt.style.display = 'block';
    }
});

// Inizializzazione al caricamento
document.addEventListener('DOMContentLoaded', () => {
    updateFieldVisibility();
    updateBimonthlyFieldsVisibility();
    updateLightConsumptionFieldsVisibility('1');
    updateLightConsumptionFieldsVisibility('2');
    
    const pdfBtn = document.getElementById('exportPdfBtn');
    const imgBtn = document.getElementById('exportImgBtn');
    if (pdfBtn) pdfBtn.addEventListener('click', () => exportResult('pdf'));
    if (imgBtn) imgBtn.addEventListener('click', () => exportResult('image'));
});
