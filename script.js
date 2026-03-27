// script.js - Simulatore di Risparmio - VERSIONE RIPRISTINATA ORIGINALE
// Aggiornamento Prezzi: Febbraio 2026 (Nessuna modifica alla logica o ai nomi dei campi)

// Database statico dei prezzi (Aggiornato con Febbraio 2026)
const monthlyPrices = {
    // PUN Monorario
    pun: {
        '2025-07': 0.165,
        '2025-08': 0.17,
        '2025-09': 0.109080,
    	'2025-10': 0.111040,
        '2025-11': 0.117090,
        '2025-12': 0.115490,
        '2026-01': 0.132660,
        '2026-02': 0.142500 // <--- AGGIORNATO
    },
    // PUN a Fasce
    punFasce: {
        '2025-07': { F1: 0.108960, F2: 0.127100, F3: 0.108490 },
        '2025-08': { F1: 0.105580, F2: 0.117970, F3: 0.106040 },
        '2025-09': { F1: 0.109590, F2: 0.120930, F3: 0.101880 },
    	'2025-10': { F1: 0.117830, F2: 0.121660, F3: 0.099480 },
        '2025-11': { F1: 0.129590, F2: 0.124020, F3: 0.105510 },
        '2025-12': { F1: 0.130090, F2: 0.119980, F3: 0.104520 },
        '2026-01': { F1: 0.151261, F2: 0.137405, F3: 0.118292 },
        '2026-02': { F1: 0.158400, F2: 0.145200, F3: 0.124100 } // <--- AGGIORNATO
    },
    // PSV
    psv: {
        '2025-07': 0.388520,
        '2025-08': 0.377180,
        '2025-09': 0.369520,
    	'2025-10': 0.353959,
        '2025-11': 0.345300,
        '2025-12': 0.324670,
        '2026-01': 0.404227,
        '2026-02': 0.395000 // <--- AGGIORNATO
    }
};

// ... DA QUI IN POI IL CODICE SEGUE ESATTAMENTE IL TUO ORIGINALE ...

// Funzione per calcolare la componente OGT LUCE (a POD)
function getOGTLuce(userType, selectedOfferId) {
    if (userType === 'consumer') {
        return 8.95; 
    } else if (userType === 'business') {
        switch (selectedOfferId) {
            case 'revolutionTax':
                return 14.94;
            case 'ultraGreenFix':
                return 14.95;
            case 'ultraGreenPMI':
            case 'ultraGreenGrandiAziende':
                return 19.95;
            default:
                return 0;
        }
    }
    return 0;
}

// Funzione per calcolare la componente OGT GAS (a PDR)
function getOGTGas(userType, selectedOfferId) {
    if (userType === 'consumer') {
        return 8.95; 
    } else if (userType === 'business') {
        switch (selectedOfferId) {
            case 'ultraGreenFix':
            case 'revolutionTax':
                return 14.95;
            case 'ultraGreenPMI':
            case 'ultraGreenGrandiAziende':
                return 19.95;
            case 'ultraGreenCasa':
                return 8.95;
            default:
                return 0;
        }
    }
    return 8.95;
}

function showErrorMessage(message) {
    const resultDiv = document.getElementById('result');
    resultDiv.innerHTML = `<h3 style="color: red;">Errore di Input</h3><p>${message}</p>`;
    resultDiv.style.display = 'block';
    document.getElementById('export-actions').style.display = 'none';
    window.scrollTo(0, 0); 
}

function getSelectedMonthName(selectElementId) {
    const select = document.getElementById(selectElementId);
    if (select && select.options[select.selectedIndex]) {
        return select.options[select.selectedIndex].text;
    }
    return 'Mese non trovato';
}

function populateMonthSelection2() {
    const monthSelection1 = document.getElementById('monthSelection1');
    const monthSelection2 = document.getElementById('monthSelection2');
    const consumptionType1 = document.getElementById('consumptionType1');
    const consumptionType2 = document.getElementById('consumptionType2');
    if (monthSelection1 && monthSelection2) {
        monthSelection2.innerHTML = monthSelection1.innerHTML;
    }
    if (consumptionType1 && consumptionType2) {
         consumptionType2.innerHTML = consumptionType1.innerHTML;
    }
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
        lightLabelElement.innerHTML = isBimonthly
            ? `Spesa per la materia luce bimestrale (Euro)`
            : `Spesa per la materia luce <span id="monthNameLightPrice1">${monthName1}</span> (Euro)`;
    }
     if (gasLabelElement) {
        gasLabelElement.innerHTML = isBimonthly
            ? `Spesa per la materia gas bimestrale (Euro)`
            : `Spesa per la materia gas <span id="monthNameGasPrice1">${monthName1}</span> (Euro)`;
    }
    if (pcvLightLabelElement) {
        pcvLightLabelElement.textContent = isBimonthly 
            ? `Attuale PCV / Costo Fisso Bimestrale Luce (Euro)` 
            : `Attuale PCV / Costo Fisso Mensile Luce (Euro)`;
    }
    if (pcvGasLabelElement) {
        pcvGasLabelElement.textContent = isBimonthly 
            ? `Attuale PCV / Costo Fisso Bimestrale Gas (Euro)` 
            : `Attuale PCV / Costo Fisso Mensile Gas (Euro)`;
    }
    document.getElementById('monthNameConsumptionType1').textContent = monthName1;
    document.getElementById('monthNameLightCons1').textContent = monthName1;
    document.getElementById('monthNameLightConsF1_1').textContent = monthName1;
    document.getElementById('monthNameLightConsF2_1').textContent = monthName1;
    document.getElementById('monthNameLightConsF3_1').textContent = monthName1;
    document.getElementById('monthNameGasCons1').textContent = monthName1;
    document.getElementById('monthNameConsumptionType2').textContent = monthName2;
    document.getElementById('monthNameLightCons2').textContent = monthName2;
    document.getElementById('monthNameLightConsF1_2').textContent = monthName2;
    document.getElementById('monthNameLightConsF2_2').textContent = monthName2;
    document.getElementById('monthNameLightConsF3_2').textContent = monthName2;
    document.getElementById('monthNameLightPrice2').textContent = monthName2;
    document.getElementById('monthNameGasCons2').textContent = monthName2;
    document.getElementById('monthNameGasPrice2').textContent = monthName2;
}

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
    monorarioDiv.style.display = isMonorario ? 'block' : 'none';
    fasceDiv.style.display = isMonorario ? 'none' : 'block';
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
        dataM2Fields.style.display = 'block';
        billingNote.style.display = 'block';
    } else {
        dataM2Fields.style.display = 'none';
        billingNote.style.display = 'none';
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
        const priceLightContainer = document.getElementById(`price-light-m${monthIndex}-container`);
        const priceGasContainer = document.getElementById(`price-gas-m${monthIndex}-container`);
        const currentPriceLightInput = document.getElementById(`currentPriceLight${monthIndex}`);
        const currentPriceGasInput = document.getElementById(`currentPriceGas${monthIndex}`);
        const isM2 = monthIndex === '2';

        if (!isLightSelected || (isM2 && !isBimonthly)) {
            hideAndClearElement(lightFields);
            if(currentConsumptionLightInput) currentConsumptionLightInput.value = '';
            if(currentPriceLightInput) currentPriceLightInput.value = '';
            updateLightConsumptionFieldsVisibility(monthIndex); 
            if (monthIndex === '1' && pcvLightContainerM1) hideAndClearElement(pcvLightContainerM1);
        } else {
            showElement(lightFields);
            if (isM2 && isBimonthly) {
                hideAndClearElement(priceLightContainer);
                if (currentPriceLightInput) currentPriceLightInput.value = '';
            } else if (priceLightContainer) showElement(priceLightContainer);
            if (monthIndex === '1' && pcvLightContainerM1) showElement(pcvLightContainerM1);
        }
        
        if (!isGasSelected || (isM2 && !isBimonthly)) {
            hideAndClearElement(gasFields);
            if(currentConsumptionGasInput) currentConsumptionGasInput.value = '';
            if(currentPriceGasInput) currentPriceGasInput.value = '';
            if (monthIndex === '1' && pcvGasContainerM1) hideAndClearElement(pcvGasContainerM1);
        } else {
            showElement(gasFields);
             if (isM2 && isBimonthly) {
                hideAndClearElement(priceGasContainer);
                if (currentPriceGasInput) currentPriceGasInput.value = '';
            } else if (priceGasContainer) showElement(priceGasContainer);
            if (monthIndex === '1' && pcvGasContainerM1) showElement(pcvGasContainerM1);
        }
    }
}

function getProposalExpirationDate() {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth() + 1;
    const lastDayOfMonth = new Date(year, month, 0);
    const day = String(lastDayOfMonth.getDate()).padStart(2, '0');
    const monthStr = String(lastDayOfMonth.getMonth() + 1).padStart(2, '0');
    const yearStr = lastDayOfMonth.getFullYear();
    return `${day}/${monthStr}/${yearStr}`;
}

async function exportResult(type) {
    const resultDiv = document.getElementById('result-content');
    if (!resultDiv) return showErrorMessage('Contenuto della simulazione non trovato per l\'esportazione.');
    const clone = resultDiv.cloneNode(true);
    clone.style.padding = '20px'; 
    clone.style.backgroundColor = '#fff';
    clone.style.border = 'none';
    const tempContainer = document.createElement('div');
    tempContainer.style.width = '500px'; 
    tempContainer.style.margin = '0 auto';
    tempContainer.style.position = 'absolute';
    tempContainer.style.left = '-9999px';
    tempContainer.appendChild(clone);
    document.body.appendChild(tempContainer);

    try {
        const canvas = await html2canvas(clone, { scale: 2, useCORS: true, windowWidth: 500 });
        document.body.removeChild(tempContainer);
        if (type === 'image') {
            const image = canvas.toDataURL('image/png').replace('image/png', 'image/octet-stream');
            const a = document.createElement('a');
            a.href = image;
            a.download = 'Simulazione_Risparmio.png';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        } else if (type === 'pdf') {
             const { jsPDF } = window.jspdf;
             const pdf = new jsPDF('p', 'mm', 'a4');
             const imgData = canvas.toDataURL('image/jpeg', 1.0);
             const pdfWidth = pdf.internal.pageSize.getWidth();
             const pdfHeight = pdf.internal.pageSize.getHeight();
             const imgWidth = 180; 
             const imgHeight = canvas.height * imgWidth / canvas.width;
             let heightLeft = imgHeight;
             let position = 10;
             pdf.addImage(imgData, 'JPEG', (pdfWidth - imgWidth) / 2, position, imgWidth, imgHeight);
             heightLeft -= (pdfHeight - position);
             while (heightLeft >= -50) {
                 position = heightLeft - imgHeight + 10;
                 pdf.addPage();
                 pdf.addImage(imgData, 'JPEG', (pdfWidth - imgWidth) / 2, position, imgWidth, imgHeight);
                 heightLeft -= (pdfHeight - 10);
             }
             pdf.save('Simulazione_Risparmio.pdf');
        }
    } catch (error) {
        if (tempContainer.parentNode) document.body.removeChild(tempContainer);
        showErrorMessage('Errore durante la creazione del file di esportazione.');
    } 
}

function calculateMonthlySaving(month, consumptionLight, priceLight, consumptionGas, priceGas, annualConsumptionLight, annualConsumptionGas, userType, selectedOfferId, utilityType, isFasce) {
    let savingMonthlyLuce = 0;
    let newOfferCostLuce = 0;
    let savingMonthlyGas = 0;
    let newOfferCostGas = 0;
    let monthlyConsumptionGas = consumptionGas;
    const totalConsumptionLight = isFasce ? consumptionLight.F1 + consumptionLight.F2 + consumptionLight.F3 : consumptionLight;
    let monthlyConsumptionLight = totalConsumptionLight;
    const ogtCostLuce = getOGTLuce(userType, selectedOfferId);
    const ogtCostGas = getOGTGas(userType, selectedOfferId);

    if (utilityType === 'light' || utilityType === 'lightAndGas') {
        const hasConsumptionLight = monthlyConsumptionLight > 0;
        const hasAnnualLight = !isNaN(annualConsumptionLight) && annualConsumptionLight > 0;
        if (!hasConsumptionLight) monthlyConsumptionLight = hasAnnualLight ? annualConsumptionLight / 12 : 0;
        if (monthlyConsumptionLight > 0) {
            let energyCostLight = 0, spreadLuce = 0, fixPriceLuce = 0;
            switch(selectedOfferId) {
                case 'ultraGreenCasa': spreadLuce = 0.0551; break;
                case 'ultraGreenGrandiAziende': spreadLuce = 0.0562; break;
                case 'revolutionTax': spreadLuce = userType === 'consumer' ? 0.04625 : 0.061; break;
                case 'ultraGreenFix': fixPriceLuce = 0.16; break;
                case 'ultraGreenPMI': spreadLuce = 0.0595; break;
                default: spreadLuce = 0; fixPriceLuce = 0; break;
            }
            if (fixPriceLuce > 0) {
                energyCostLight = monthlyConsumptionLight * fixPriceLuce;
            } else if (isFasce && spreadLuce > 0) {
                 const punFasce = monthlyPrices.punFasce[month];
                 if (consumptionLight.F1 === 0 && consumptionLight.F2 === 0 && consumptionLight.F3 === 0 && monthlyConsumptionLight > 0) {
                      const punPriceMonorario = monthlyPrices.pun[month];
                      energyCostLight = monthlyConsumptionLight * (punPriceMonorario + spreadLuce);
                 } else if (punFasce) {
                    energyCostLight = (consumptionLight.F1 * (punFasce.F1 + spreadLuce)) + (consumptionLight.F2 * (punFasce.F2 + spreadLuce)) + (consumptionLight.F3 * (punFasce.F3 + spreadLuce));
                 }
            } else if (spreadLuce > 0) {
                const punPriceMonorario = monthlyPrices.pun[month];
                energyCostLight = monthlyConsumptionLight * (punPriceMonorario + spreadLuce);
            }
            newOfferCostLuce = energyCostLight + ogtCostLuce;
            savingMonthlyLuce = priceLight - newOfferCostLuce; 
        }
    }
    
    if (utilityType === 'gas' || utilityType === 'lightAndGas') {
        const hasConsumptionGas = !isNaN(consumptionGas) && consumptionGas > 0;
        const hasAnnualGas = !isNaN(annualConsumptionGas) && annualConsumptionGas > 0;
        if (!hasConsumptionGas) monthlyConsumptionGas = hasAnnualGas ? annualConsumptionGas / 12 : 0;
        if (monthlyConsumptionGas > 0) {
            const psvPrice = monthlyPrices.psv[month];
            let gasPricePerSmc = 0; 
            switch(selectedOfferId) {
                case 'ultraGreenCasa': gasPricePerSmc = psvPrice + 0.305; break;
                case 'ultraGreenGrandiAziende': gasPricePerSmc = psvPrice + 0.157; break;
                case 'revolutionTax': gasPricePerSmc = psvPrice + 0.210; break;
                case 'ultraGreenFix': gasPricePerSmc = 0.607; break;
                case 'ultraGreenPMI': gasPricePerSmc = psvPrice + 0.181; break;
                default: gasPricePerSmc = 0; break;
            }
            newOfferCostGas = (monthlyConsumptionGas * gasPricePerSmc) + ogtCostGas;
            savingMonthlyGas = priceGas - newOfferCostGas;
        }
    }
    return { savingLuce: savingMonthlyLuce, costLuce: newOfferCostLuce, consumptionLuce: monthlyConsumptionLight, currentPriceLuce: priceLight, ogtLuce: ogtCostLuce, savingGas: savingMonthlyGas, costGas: newOfferCostGas, consumptionGas: monthlyConsumptionGas, currentPriceGas: priceGas, ogtGas: ogtCostGas };
}

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
    const proposalExpirationDate = getProposalExpirationDate();
    let revolutionTaxNote = '';
    if ((utilityType === 'light' || utilityType === 'lightAndGas') && selectedOfferId === 'revolutionTax') {
        revolutionTaxNote = '<p style="font-style: italic; color: #388e3c;">**L\'offerta Revolution Tax garantisce lo sconto in fattura del 50% dell\'Accisa Luce.**</p>';
    }
    let monthlyResults = [], totalCurrentPriceLuceBimonthly = 0, totalCurrentPriceGasBimonthly = 0; 
    const annualConsumptionLight = parseFloat(document.getElementById('annualConsumptionLight').value) || 0;
    const annualConsumptionGas = parseFloat(document.getElementById('annualConsumptionGas').value) || 0;
    const currentPCVLight1 = parseFloat(document.getElementById(`currentPCVLight1`)?.value) || 0;
    const currentPCVGas1 = parseFloat(document.getElementById(`currentPCVGas1`)?.value) || 0;

    for (let i = 1; i <= numMonths; i++) {
        const monthIndex = i === 1 ? '1' : '2'; 
        const monthSelector = document.getElementById(`monthSelection${monthIndex}`);
        const month = monthSelector.value;
        const monthName = getSelectedMonthName(`monthSelection${monthIndex}`);
        let currentPriceLightRaw = 0, currentPriceLight = 0, currentConsumptionLight, isFasce = false;
        let currentPriceGasRaw = 0, currentPriceGas = 0, currentConsumptionGas = 0;

        if (utilityType === 'light' || utilityType === 'lightAndGas') {
            const consumptionType = document.getElementById(`consumptionType${monthIndex}`).value;
            isFasce = consumptionType === 'fasce';
            if (isFasce) {
                const f1 = parseFloat(document.getElementById(`currentConsumptionF1_${monthIndex}`).value) || 0;
                const f2 = parseFloat(document.getElementById(`currentConsumptionF2_${monthIndex}`).value) || 0;
                const f3 = parseFloat(document.getElementById(`currentConsumptionF3_${monthIndex}`).value) || 0;
                currentConsumptionLight = { F1: f1, F2: f2, F3: f3 };
                if (f1 === 0 && f2 === 0 && f3 === 0 && annualConsumptionLight === 0) return showErrorMessage(`Per favore, inserisci i consumi (F1, F2, F3) oppure il Consumo Luce annuale per ${monthName}.`);
            } else {
                currentConsumptionLight = parseFloat(document.getElementById(`currentConsumptionLight${monthIndex}`).value) || 0;
                 if (currentConsumptionLight === 0 && annualConsumptionLight === 0) return showErrorMessage(`Per favore, inserisci il Consumo Luce Totale oppure il Consumo Luce annuale per ${monthName}.`);
            }
            if (monthIndex === '1') {
                currentPriceLightRaw = parseFloat(document.getElementById(`currentPriceLight${monthIndex}`).value) || 0;
                if (currentPriceLightRaw === 0) return showErrorMessage(`Per favore, inserisci la Spesa per la materia luce ${isBimonthly ? 'totale del bimestre' : `di ${monthName}`}.`);
                currentPriceLight = currentPriceLightRaw + currentPCVLight1;
                if (isBimonthly) totalCurrentPriceLuceBimonthly = currentPriceLight; 
            } else if (monthIndex === '2' && !isBimonthly) {
                 currentPriceLightRaw = parseFloat(document.getElementById(`currentPriceLight${monthIndex}`).value) || 0;
                 currentPriceLight = currentPriceLightRaw + (currentPCVLight1 / 2);
            }
        }
        if (utilityType === 'gas' || utilityType === 'lightAndGas') {
            currentConsumptionGas = parseFloat(document.getElementById(`currentConsumptionGas${monthIndex}`).value) || 0;
             if (currentConsumptionGas === 0 && annualConsumptionGas === 0) return showErrorMessage(`Per favore, inserisci il Consumo Gas oppure il Consumo Gas annuale per ${monthName}.`);
            if (monthIndex === '1') {
                currentPriceGasRaw = parseFloat(document.getElementById(`currentPriceGas${monthIndex}`).value) || 0;
                if (currentPriceGasRaw === 0) return showErrorMessage(`Per favore, inserisci la Spesa per la materia gas ${isBimonthly ? 'totale del bimestre' : `di ${monthName}`}.`);
                currentPriceGas = currentPriceGasRaw + currentPCVGas1;
                if (isBimonthly) totalCurrentPriceGasBimonthly = currentPriceGas;
            } else if (monthIndex === '2' && !isBimonthly) {
                 currentPriceGasRaw = parseFloat(document.getElementById(`currentPriceGas${monthIndex}`).value) || 0;
                 currentPriceGas = currentPriceGasRaw + (currentPCVGas1 / 2);
            }
        }
        monthlyResults.push(calculateMonthlySaving(month, currentConsumptionLight, currentPriceLight, currentConsumptionGas, currentPriceGas, annualConsumptionLight, annualConsumptionGas, userType, selectedOfferId, utilityType, isFasce));
    }
    
    let totalNewOfferCostLuce = 0, totalNewOfferCostGas = 0, totalLuceConsumption = 0, totalGasConsumption = 0;
    monthlyResults.forEach(result => { totalNewOfferCostLuce += result.costLuce; totalNewOfferCostGas += result.costGas; totalLuceConsumption += result.consumptionLuce; totalGasConsumption += result.consumptionGas; });
    let totalCurrentCostLuce = 0, totalCurrentCostGas = 0, allCalculationDetailsLuce = '', allCalculationDetailsGas = '';
    
    monthlyResults.forEach((result, index) => {
        const monthIndex = index + 1, monthName = getSelectedMonthName(`monthSelection${monthIndex}`);
        const savingMonthlyColorLight = result.savingLuce > 0 ? 'green' : 'red', savingMonthlyColorGas = result.savingGas > 0 ? 'green' : 'red';
        if (utilityType === 'light' || utilityType === 'lightAndGas') {
            if (!isBimonthly) totalCurrentCostLuce += result.currentPriceLuce;
            if (!isBimonthly) {
                allCalculationDetailsLuce += `<h4>${monthName}</h4><p>Consumo Luce Totale ${monthName}: <strong>${Math.round(result.consumptionLuce)} kWh</strong></p><p>Costo Totale Attuale (Spesa Materia + PCV/CF): <strong>${result.currentPriceLuce.toFixed(2)} Euro</strong>.</p><p>Spesa Materia Energia con la nuova offerta: <strong>${result.costLuce.toFixed(2)} Euro</strong>.</p><p><span style="color: ${savingMonthlyColorLight};">${result.savingLuce > 0 ? `Risparmio Luce: <strong>${result.savingLuce.toFixed(2)} Euro</strong>.` : `Non c'e' Risparmio Luce: <strong>${result.savingLuce.toFixed(2)} Euro</strong>.`}</span></p><p style="font-style: italic;">N.B. Nella simulazione e' gia' incluso il Costo fisso (OGT) mensile a POD di ${result.ogtLuce.toFixed(2)} Euro.</p>${!isBimonthly && index === 0 && monthlyResults.length === 2 ? '<hr style="border-top: 1px solid #eee;">' : ''}`;
            }
        }
        if (utilityType === 'gas' || utilityType === 'lightAndGas') {
            if (!isBimonthly) totalCurrentCostGas += result.currentPriceGas;
            if (!isBimonthly) {
                allCalculationDetailsGas += `<h4>${monthName}</h4><p>Consumo Gas ${monthName}: <strong>${Math.round(result.consumptionGas)} smc</strong></p><p>Costo Totale Attuale (Spesa Materia + PCV/CF): <strong>${result.currentPriceGas.toFixed(2)} Euro</strong>.</p><p>Spesa Materia Gas con la nuova offerta: <strong>${result.costGas.toFixed(2)} Euro</strong>.</p><p><span style="color: ${savingMonthlyColorGas};">${result.savingGas > 0 ? `Risparmio Gas: <strong>${result.savingGas.toFixed(2)} Euro</strong>.` : `Non c'e' Risparmio Gas: <strong>${result.savingGas.toFixed(2)} Euro</strong>.`}</span></p><p style="font-style: italic;">N.B. Nella simulazione e' gia' incluso il Costo fisso (OGT) mensile a PDR di ${result.ogtGas.toFixed(2)} Euro.</p>${!isBimonthly && index === 0 && monthlyResults.length === 2 ? '<hr style="border-top: 1px solid #eee;">' : ''}`;
            }
        }
    });

    if (isBimonthly) { totalCurrentCostLuce = totalCurrentPriceLuceBimonthly; totalCurrentCostGas = totalCurrentPriceGasBimonthly; }
    const totalCurrentCostCombined = totalCurrentCostLuce + totalCurrentCostGas, totalNewOfferCostCombined = totalNewOfferCostLuce + totalNewOfferCostGas;
    const totalSavingCombined = totalCurrentCostCombined - totalNewOfferCostCombined;
    const finalMonthlySaving = totalSavingCombined / numMonths, totalSavingAnnual = finalMonthlySaving * 12;
    const offers = { ultraGreenCasa: { name: 'UltraGreen Casa' }, ultraGreenFix: { name: 'UltraGreen Fix' }, ultraGreenPMI: { name: 'UltraGreen PMI' }, ultraGreenGrandiAziende: { name: 'UltraGreen Grandi Aziende' }, revolutionTax: { name: 'Revolution Tax' } };
    const offerName = offers[selectedOfferId].name;
    
    let finalOutput = `<div id="result-content" style="padding: 10px;"><p style="text-align: right; font-size: 0.9em; margin-bottom: 20px;"><strong>Scadenza Proposta: ${proposalExpirationDate}</strong></p><h2 style="color: #2e7d32; text-align: left; border-bottom: 2px solid #4caf50; padding-bottom: 5px; margin-bottom: 20px;">Cliente: ${clientName}</h2><h3>Simulazione con ${offerName}</h3>`;

    if (isBimonthly) {
        const monthName1 = getSelectedMonthName('monthSelection1'), monthName2 = getSelectedMonthName('monthSelection2');
        if (utilityType.includes('light')) {
            const savingB = totalCurrentCostLuce - totalNewOfferCostLuce;
            finalOutput += `<h3 style="margin-top: 30px;">Dettagli LUCE</h3><h4>Dettagli Luce Bimestrale (${monthName1} e ${monthName2})</h4><p>Consumo Luce Totale Bimestre: <strong>${Math.round(totalLuceConsumption)} kWh</strong></p><p>Costo Totale Attuale Bimestre (Spesa Materia + PCV/CF): <strong>${totalCurrentCostLuce.toFixed(2)} Euro</strong>.</p><p>Spesa Materia Energia con la nuova offerta: <strong>${totalNewOfferCostLuce.toFixed(2)} Euro</strong>.</p><p><span style="color: ${savingB > 0 ? 'green' : 'red'};">${savingB > 0 ? `Risparmio Luce: <strong>${savingB.toFixed(2)} Euro</strong>.` : `Non c'e' Risparmio Luce: <strong>${savingB.toFixed(2)} Euro</strong>.`}</span></p><p style="font-style: italic;">N.B. Nella simulazione sono inclusi i Costi fissi (OGT) mensili a POD (${monthlyResults[0].ogtLuce.toFixed(2)} Euro/Mese).</p>${revolutionTaxNote}`;
        }
        if (utilityType.includes('gas')) {
            const savingB = totalCurrentCostGas - totalNewOfferCostGas;
            finalOutput += `<h3 style="margin-top: 30px;">Dettagli GAS</h3><h4>Dettagli Gas Bimestrale (${monthName1} e ${monthName2})</h4><p>Consumo Gas Totale Bimestre: <strong>${Math.round(totalGasConsumption)} smc</strong></p><p>Costo Totale Attuale Bimestre (Spesa Materia + PCV/CF): <strong>${totalCurrentCostGas.toFixed(2)} Euro</strong>.</p><p>Spesa Materia Gas con la nuova offerta: <strong>${totalNewOfferCostGas.toFixed(2)} Euro</strong>.</p><p><span style="color: ${savingB > 0 ? 'green' : 'red'};">${savingB > 0 ? `Risparmio Gas: <strong>${savingB.toFixed(2)} Euro</strong>.` : `Non c'e' Risparmio Gas: <strong>${savingB.toFixed(2)} Euro</strong>.`}</span></p><p style="font-style: italic;">N.B. Nella simulazione sono inclusi i Costi fissi (OGT) mensili a PDR (${monthlyResults[0].ogtGas.toFixed(2)} Euro/Mese).</p>`;
        }
    } else {
        if (utilityType.includes('light')) finalOutput += `<h3 style="margin-top: 30px;">Dettagli LUCE</h3>${allCalculationDetailsLuce}${revolutionTaxNote}`;
        if (utilityType.includes('gas')) finalOutput += `<h3 style="margin-top: 30px;">Dettagli GAS</h3>${allCalculationDetailsGas}`;
    }

    let riepilogo = `<hr style="border-top: 2px solid #333; margin: 20px 0;"><h3>Riepilogo Totale</h3>`;
    riepilogo += `<p>Il tuo costo attuale e' di <strong>${totalCurrentCostCombined.toFixed(2)} Euro</strong>.</p><p>Con l'offerta <strong>${offerName}</strong>, il tuo costo e' di <strong>${totalNewOfferCostCombined.toFixed(2)} Euro</strong>.</p><p><span style="color: ${finalMonthlySaving > 0 ? 'green' : 'red'}; font-size: 1.1em; font-weight: bold;">${finalMonthlySaving > 0 ? `Risparmio Mensile: <strong>${finalMonthlySaving.toFixed(2)} Euro</strong>.` : `Non c'e' Risparmio Mensile: <strong>${finalMonthlySaving.toFixed(2)} Euro</strong>.`}</span></p><p><span style="color: ${totalSavingAnnual > 0 ? 'green' : 'red'}; font-size: 1.1em; font-weight: bold;">${totalSavingAnnual > 0 ? `Prospetto Risparmio Annuo: <strong>${totalSavingAnnual.toFixed(2)} Euro</strong>.` : `Non c'e' Risparmio Annuo: <strong>${totalSavingAnnual.toFixed(2)} Euro</strong>.`}</span></p>`;
    finalOutput += riepilogo + `</div>`;
    document.getElementById('result').innerHTML = finalOutput;
    document.getElementById('result').style.display = 'block';
    document.getElementById('export-actions').style.display = 'block';
    window.scrollTo(0, 0);
});

document.getElementById('userType').addEventListener('change', function() {
    const offerSelect = document.getElementById('selectedOffer'), uGCasa = offerSelect.querySelector('option[value="ultraGreenCasa"]');
    if (this.value === 'business') { uGCasa.style.display = 'none'; if (offerSelect.value === 'ultraGreenCasa') offerSelect.value = ''; } else uGCasa.style.display = 'block';
});
document.getElementById('utilityType').addEventListener('change', updateFieldVisibility);
document.getElementById('utilityType').addEventListener('change', updateMonthLabels);
document.getElementById('billingFrequency').addEventListener('change', updateBimonthlyFieldsVisibility);
document.getElementById('consumptionType1').addEventListener('change', () => updateLightConsumptionFieldsVisibility('1'));
document.getElementById('consumptionType2').addEventListener('change', () => updateLightConsumptionFieldsVisibility('2'));
document.getElementById('monthSelection1').addEventListener('change', updateMonthLabels);
document.getElementById('monthSelection2').addEventListener('change', updateMonthLabels);

document.addEventListener('DOMContentLoaded', () => {
    populateMonthSelection2();
    updateBimonthlyFieldsVisibility();
    const exPdf = document.getElementById('exportPdfBtn'), exImg = document.getElementById('exportImgBtn');
    if (exPdf) exPdf.addEventListener('click', () => exportResult('pdf'));
    if (exImg) exImg.addEventListener('click', () => exportResult('image'));
});
