// script.js - PARTE 1
const monthlyPrices = {
    pun: {
        '2025-07': 0.165000, '2025-08': 0.170000, '2025-09': 0.109080,
        '2025-10': 0.111040, '2025-11': 0.117090, '2025-12': 0.115490,
        '2026-01': 0.132660, '2026-02': 0.114410
    },
    punFasce: {
        '2025-07': { F1: 0.108960, F2: 0.127100, F3: 0.108490 },
        '2025-08': { F1: 0.105580, F2: 0.117970, F3: 0.106040 },
        '2025-09': { F1: 0.109590, F2: 0.120930, F3: 0.101880 },
        '2025-10': { F1: 0.116510, F2: 0.122820, F3: 0.101150 },
        '2025-11': { F1: 0.128710, F2: 0.126080, F3: 0.105740 },
        '2025-12': { F1: 0.129330, F2: 0.124650, F3: 0.102660 },
        '2026-01': { F1: 0.150420, F2: 0.141200, F3: 0.118230 },
        '2026-02': { F1: 0.122280, F2: 0.119840, F3: 0.105300 }
    },
    psv: {
        '2025-07': 0.385000, '2025-08': 0.420000, '2025-09': 0.402633,
        '2025-10': 0.435521, '2025-11': 0.456600, '2025-12': 0.441100,
        '2026-01': 0.428800, '2026-02': 0.377233
    }
};

function getOGTLuce(userType, selectedOfferId) {
    if (userType === 'consumer') return 8.95; 
    if (userType === 'business') {
        switch (selectedOfferId) {
            case 'revolutionTax': return 14.94;
            case 'ultraGreenFix': return 14.95;
            case 'ultraGreenPMI':
            case 'ultraGreenGrandiAziende': return 19.95;
            default: return 0;
        }
    }
    return 0;
}

function getOGTGas(userType, selectedOfferId) {
    if (userType === 'consumer' || selectedOfferId === 'ultraGreenCasa') return 8.95; 
    if (userType === 'business') {
        switch (selectedOfferId) {
            case 'ultraGreenFix':
            case 'revolutionTax': return 14.95;
            case 'ultraGreenPMI':
            case 'ultraGreenGrandiAziende': return 19.95;
            default: return 8.95;
        }
    }
    return 8.95;
}

function showErrorMessage(message) {
    const resultDiv = document.getElementById('result');
    if (resultDiv) {
        resultDiv.innerHTML = `<h3 style="color: red;">Errore di Input</h3><p>${message}</p>`;
        resultDiv.style.display = 'block';
    }
    const exportActions = document.getElementById('export-actions');
    if (exportActions) exportActions.style.display = 'none';
    window.scrollTo(0, 0); 
}

function getSelectedMonthName(selectElementId) {
    const select = document.getElementById(selectElementId);
    if (select && select.options[select.selectedIndex]) return select.options[select.selectedIndex].text;
    return 'Mese non trovato';
}

function populateMonthSelection2() {
    const m1 = document.getElementById('monthSelection1');
    const m2 = document.getElementById('monthSelection2');
    if (m1 && m2) m2.innerHTML = m1.innerHTML;
}

function updateMonthLabels() {
    const monthName1 = getSelectedMonthName('monthSelection1');
    const monthName2 = getSelectedMonthName('monthSelection2'); 
    const billingFrequency = document.getElementById('billingFrequency').value;
    const isBimonthly = billingFrequency === 'bimonthly';

    const lightLabelElement = document.querySelector('label[for="currentPriceLight1"]');
    const gasLabelElement = document.querySelector('label[for="currentPriceGas1"]');
    const pcvLightLabelElement = document.querySelector('#pcv-light-m1-container label');
    const pcvGasLabelElement = document.querySelector('#pcv-gas-m1-container label');

    if (lightLabelElement) {
        lightLabelElement.innerHTML = isBimonthly ? `Spesa materia luce bimestrale (Euro)` : `Spesa materia luce <span id="monthNameLightPrice1">${monthName1}</span> (Euro)`;
    }
    if (gasLabelElement) {
        gasLabelElement.innerHTML = isBimonthly ? `Spesa materia gas bimestrale (Euro)` : `Spesa materia gas <span id="monthNameGasPrice1">${monthName1}</span> (Euro)`;
    }
    if (pcvLightLabelElement) pcvLightLabelElement.textContent = isBimonthly ? `Attuale PCV Bimestrale Luce (Euro)` : `Attuale PCV Mensile Luce (Euro)`;
    if (pcvGasLabelElement) pcvGasLabelElement.textContent = isBimonthly ? `Attuale PCV Bimestrale Gas (Euro)` : `Attuale PCV Mensile Gas (Euro)`;
    
    const ids = ['monthNameConsumptionType1', 'monthNameLightCons1', 'monthNameLightConsF1_1', 'monthNameLightConsF2_1', 'monthNameLightConsF3_1', 'monthNameGasCons1'];
    ids.forEach(id => { if(document.getElementById(id)) document.getElementById(id).textContent = monthName1; });
    const ids2 = ['monthNameConsumptionType2', 'monthNameLightCons2', 'monthNameLightConsF1_2', 'monthNameLightConsF2_2', 'monthNameLightConsF3_2', 'monthNameLightPrice2', 'monthNameGasCons2', 'monthNameGasPrice2'];
    ids2.forEach(id => { if(document.getElementById(id)) document.getElementById(id).textContent = monthName2; });
}
// script.js - PARTE 2

function updateLightConsumptionFieldsVisibility(monthIndex) {
    const consumptionType = document.getElementById(`consumptionType${monthIndex}`).value;
    const isMonorario = consumptionType === 'monorario';

    const monorarioDiv = document.getElementById(`light-monorario-fields-m${monthIndex}`);
    const fasceDiv = document.getElementById(`light-fasce-fields-m${monthIndex}`);

    const monorarioInput = document.getElementById(`currentConsumptionLight${monthIndex}`);
    const fasceInputs = [
        document.getElementById(`currentConsumptionF1_${monthIndex}`),
        document.getElementById(`currentConsumptionF2_${monthIndex}`),
        document.getElementById(`currentConsumptionF3_${monthIndex}`)
    ];
    
    if (monorarioDiv) monorarioDiv.style.display = isMonorario ? 'block' : 'none';
    if (fasceDiv) fasceDiv.style.display = isMonorario ? 'none' : 'block';
    
    if (isMonorario) {
        fasceInputs.forEach(input => { if (input) input.value = ''; }); 
    } else {
        if (monorarioInput) monorarioInput.value = '';
    }
}

function updateBimonthlyFieldsVisibility() {
    const billingFrequency = document.getElementById('billingFrequency').value;
    const dataM2Fields = document.getElementById('data-m2-fields');
    const billingNote = document.getElementById('billingNote');

    if (billingFrequency === 'bimonthly') {
        if (dataM2Fields) dataM2Fields.style.display = 'block';
        if (billingNote) billingNote.style.display = 'block';
    } else {
        if (dataM2Fields) dataM2Fields.style.display = 'none';
        if (billingNote) billingNote.style.display = 'none';
    }
    
    updateFieldVisibility(); 
    updateLightConsumptionFieldsVisibility('1');
    updateLightConsumptionFieldsVisibility('2');
    updateMonthLabels();
}

function updateFieldVisibility() {
    const utilityType = document.getElementById('utilityType').value;
    const billingFrequency = document.getElementById('billingFrequency').value;

    const isLightSelected = utilityType === 'light' || utilityType === 'lightAndGas';
    const isGasSelected = utilityType === 'gas' || utilityType === 'lightAndGas';
    const isBimonthly = billingFrequency === 'bimonthly';
    
    const pcvLightContainerM1 = document.getElementById('pcv-light-m1-container');
    const pcvGasContainerM1 = document.getElementById('pcv-gas-m1-container');
    
    const hideAndClearElement = (element) => {
        if (element) {
            if (element.tagName === 'INPUT') element.value = '';
            element.style.display = 'none';
        }
    };
    
    const showElement = (element) => { if (element) element.style.display = 'block'; };

    for (let i = 1; i <= 2; i++) {
        const monthIndex = i.toString();
        const lightFields = document.getElementById(`light-fields-m${monthIndex}`);
        const gasFields = document.getElementById(`gas-fields-m${monthIndex}`);
        const currentConsumptionLightInput = document.getElementById(`currentConsumptionLight${monthIndex}`);
        const currentConsumptionGasInput = document.getElementById(`currentConsumptionGas${monthIndex}`);
        const currentPriceLightInput = document.getElementById(`currentPriceLight${monthIndex}`);
        const currentPriceGasInput = document.getElementById(`currentPriceGas${monthIndex}`);
        const isM2 = monthIndex === '2';

        if (!isLightSelected || (isM2 && !isBimonthly)) {
            hideAndClearElement(lightFields);
            if(currentConsumptionLightInput) currentConsumptionLightInput.value = '';
            if(currentPriceLightInput) currentPriceLightInput.value = '';
            updateLightConsumptionFieldsVisibility(monthIndex); 
            if (monthIndex === '1') hideAndClearElement(pcvLightContainerM1);
        } else {
            showElement(lightFields);
            if (monthIndex === '1') showElement(pcvLightContainerM1);
        }

        if (!isGasSelected || (isM2 && !isBimonthly)) {
            hideAndClearElement(gasFields);
            if(currentConsumptionGasInput) currentConsumptionGasInput.value = '';
            if(currentPriceGasInput) currentPriceGasInput.value = '';
            if (monthIndex === '1') hideAndClearElement(pcvGasContainerM1);
        } else {
            showElement(gasFields);
            if (monthIndex === '1') showElement(pcvGasContainerM1);
        }
    }
}

function getProposalExpirationDate() {
    const today = new Date();
    const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    const day = String(lastDayOfMonth.getDate()).padStart(2, '0');
    const monthStr = String(lastDayOfMonth.getMonth() + 1).padStart(2, '0');
    return `${day}/${monthStr}/${lastDayOfMonth.getFullYear()}`;
}
// script.js - PARTE 3

async function exportResult(type) {
    const resultDiv = document.getElementById('result-content');
    if (!resultDiv) return showErrorMessage('Contenuto della simulazione non trovato.');

    const clone = resultDiv.cloneNode(true);
    clone.style.padding = '20px'; 
    clone.style.backgroundColor = '#fff';
    
    const tempContainer = document.createElement('div');
    tempContainer.style.width = '500px'; 
    tempContainer.style.position = 'absolute';
    tempContainer.style.left = '-9999px'; 
    tempContainer.appendChild(clone);
    document.body.appendChild(tempContainer);

    try {
        const canvas = await html2canvas(clone, { scale: 2, useCORS: true, windowWidth: 500 });
        document.body.removeChild(tempContainer);

        if (type === 'image') {
            const image = canvas.toDataURL('image/png');
            const a = document.createElement('a');
            a.href = image; a.download = 'Simulazione_Risparmio.png';
            a.click();
        } else if (type === 'pdf') {
            const { jsPDF } = window.jspdf;
            const pdf = new jsPDF('p', 'mm', 'a4');
            const imgData = canvas.toDataURL('image/jpeg', 1.0);
            pdf.addImage(imgData, 'JPEG', 10, 10, 190, (canvas.height * 190 / canvas.width));
            pdf.save('Simulazione_Risparmio.pdf');
        }
    } catch (error) {
        if (tempContainer.parentNode) document.body.removeChild(tempContainer);
        showErrorMessage('Errore durante l\'esportazione.');
    } 
}

function calculateMonthlySaving(month, consumptionLight, priceLight, consumptionGas, priceGas, annualConsumptionLight, annualConsumptionGas, userType, selectedOfferId, utilityType, isFasce) {
    let savingMonthlyLuce = 0, newOfferCostLuce = 0, savingMonthlyGas = 0, newOfferCostGas = 0;
    const totalConsumptionLight = isFasce ? (consumptionLight.F1 + consumptionLight.F2 + consumptionLight.F3) : consumptionLight;
    let monthlyConsumptionLight = totalConsumptionLight || (annualConsumptionLight / 12);
    let monthlyConsumptionGas = consumptionGas || (annualConsumptionGas / 12);
    const ogtCostLuce = getOGTLuce(userType, selectedOfferId);
    const ogtCostGas = getOGTGas(userType, selectedOfferId);

    if (utilityType.includes('light') && monthlyConsumptionLight > 0) {
        let spreadLuce = 0, fixPriceLuce = 0;
        // Mappatura Spread Offerte
        switch(selectedOfferId) {
            case 'ultraGreenCasa': spreadLuce = 0.0551; break;
            case 'ultraGreenGrandiAziende': spreadLuce = 0.0562; break;
            case 'revolutionTax': spreadLuce = userType === 'consumer' ? 0.04625 : 0.061; break;
            case 'ultraGreenPMI': spreadLuce = 0.0595; break;
            case 'ultraGreenFix': fixPriceLuce = 0.16; break;
        }

        let energyCostLight = 0;
        if (fixPriceLuce > 0) {
            energyCostLight = monthlyConsumptionLight * fixPriceLuce;
        } else {
            const pF = monthlyPrices.punFasce[month];
            const pM = monthlyPrices.pun[month];
            if (isFasce && pF) {
                energyCostLight = (consumptionLight.F1 * (pF.F1 + spreadLuce)) + (consumptionLight.F2 * (pF.F2 + spreadLuce)) + (consumptionLight.F3 * (pF.F3 + spreadLuce));
            } else {
                energyCostLight = monthlyConsumptionLight * (pM + spreadLuce);
            }
        }
        newOfferCostLuce = energyCostLight + ogtCostLuce;
        savingMonthlyLuce = priceLight - newOfferCostLuce;
    }

    if (utilityType.includes('gas') && monthlyConsumptionGas > 0) {
        const psv = monthlyPrices.psv[month];
        let gasPricePerSmc = 0;
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

    return { 
        savingLuce: savingMonthlyLuce, costLuce: newOfferCostLuce, ogtLuce: ogtCostLuce,
        savingGas: savingMonthlyGas, costGas: newOfferCostGas, ogtGas: ogtCostGas,
        consumptionLuce: monthlyConsumptionLight, consumptionGas: monthlyConsumptionGas,
        currentPriceLuce: priceLight, currentPriceGas: priceGas
    };
}
// script.js - PARTE 4 (Conclusione)

document.getElementById('calculator-form').addEventListener('submit', async function(e) {
    e.preventDefault();

    const billingFrequency = document.getElementById('billingFrequency').value;
    const userType = document.getElementById('userType').value;
    const utilityType = document.getElementById('utilityType').value;
    const selectedOfferId = document.getElementById('selectedOffer').value;
    const isBimonthly = billingFrequency === 'bimonthly';
    const numMonths = isBimonthly ? 2 : 1;
    const clientName = document.getElementById('clientName').value.trim();

    if (!clientName) return showErrorMessage('Per favore, inserisci il Nome Cliente.');

    let monthlyResults = [];
    let totalCurrentCostLuce = 0; 
    let totalCurrentCostGas = 0;
    let totalNewOfferCostLuce = 0;
    let totalNewOfferCostGas = 0;

    for (let i = 1; i <= numMonths; i++) {
        const mIdx = i.toString();
        const monthKey = document.getElementById(`monthSelection${mIdx}`).value;
        const isFasce = document.getElementById(`consumptionType${mIdx}`).value === 'fasce';
        
        let cL = 0;
        if (isFasce) {
            cL = {
                F1: parseFloat(document.getElementById(`currentConsumptionF1_${mIdx}`).value) || 0,
                F2: parseFloat(document.getElementById(`currentConsumptionF2_${mIdx}`).value) || 0,
                F3: parseFloat(document.getElementById(`currentConsumptionF3_${mIdx}`).value) || 0
            };
        } else {
            cL = parseFloat(document.getElementById(`currentConsumptionLight${mIdx}`).value) || 0;
        }

        const cG = parseFloat(document.getElementById(`currentConsumptionGas${mIdx}`).value) || 0;
        const pL = parseFloat(document.getElementById(`currentPriceLight${mIdx}`)?.value || 0) + (parseFloat(document.getElementById('currentPCVLight1')?.value) || 0);
        const pG = parseFloat(document.getElementById(`currentPriceGas${mIdx}`)?.value || 0) + (parseFloat(document.getElementById('currentPCVGas1')?.value) || 0);

        const res = calculateMonthlySaving(monthKey, cL, pL, cG, pG, 0, 0, userType, selectedOfferId, utilityType, isFasce);
        monthlyResults.push(res);
        
        totalNewOfferCostLuce += res.costLuce;
        totalNewOfferCostGas += res.costGas;
        totalCurrentCostLuce += pL;
        totalCurrentCostGas += pG;
    }

    const totalSaving = (totalCurrentCostLuce + totalCurrentCostGas) - (totalNewOfferCostLuce + totalNewOfferCostGas);
    const monthlySaving = totalSaving / numMonths;

    const offerNames = { ultraGreenCasa: 'UltraGreen Casa', ultraGreenFix: 'UltraGreen Fix', ultraGreenPMI: 'UltraGreen PMI', ultraGreenGrandiAziende: 'UltraGreen Grandi Aziende', revolutionTax: 'Revolution Tax' };
    
    let outputHTML = `
        <div id="result-content" style="padding: 20px; border: 1px solid #4caf50; background: #fff;">
            <p style="text-align: right;">Scadenza Proposta: ${getProposalExpirationDate()}</p>
            <h2 style="color: #2e7d32;">Analisi per ${clientName}</h2>
            <h3>Offerta: ${offerNames[selectedOfferId] || 'Personalizzata'}</h3>
            <hr>
            <p>Risparmio Mensile: <strong style="color: ${monthlySaving > 0 ? 'green' : 'red'};">${monthlySaving.toFixed(2)} €</strong></p>
            <p>Risparmio Annuo: <strong style="color: ${monthlySaving > 0 ? 'green' : 'red'};">${(monthlySaving * 12).toFixed(2)} €</strong></p>
        </div>`;

    const resultDiv = document.getElementById('result');
    if (resultDiv) {
        resultDiv.innerHTML = outputHTML;
        resultDiv.style.display = 'block';
        document.getElementById('export-actions').style.display = 'block';
    }
});

// --- LISTENER DI INIZIALIZZAZIONE ---
document.addEventListener('DOMContentLoaded', () => {
    populateMonthSelection2();
    updateMonthLabels();
    updateBimonthlyFieldsVisibility();

    document.getElementById('monthSelection1').addEventListener('change', updateMonthLabels);
    document.getElementById('billingFrequency').addEventListener('change', updateBimonthlyFieldsVisibility);
    document.getElementById('utilityType').addEventListener('change', () => { updateFieldVisibility(); updateMonthLabels(); });
    
    const btnPdf = document.getElementById('exportPdfBtn');
    if (btnPdf) btnPdf.addEventListener('click', () => exportResult('pdf'));
});
