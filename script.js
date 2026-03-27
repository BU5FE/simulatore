// script.js - Simulatore di Risparmio (Versione Aggiornata Febbraio 2026)

const monthlyPrices = {
    pun: {
        '2025-07': 0.165, '2025-08': 0.17, '2025-09': 0.109080,
        '2025-10': 0.111040, '2025-11': 0.117090, '2025-12': 0.115490,
        '2026-01': 0.132660, '2026-02': 0.142500 // AGGIUNTO FEBBRAIO
    },
    punFasce: {
        '2025-07': { F1: 0.108960, F2: 0.127100, F3: 0.108490 },
        '2025-08': { F1: 0.105580, F2: 0.117970, F3: 0.106040 },
        '2025-09': { F1: 0.109590, F2: 0.120930, F3: 0.101880 },
        '2025-10': { F1: 0.117830, F2: 0.121660, F3: 0.099480 },
        '2025-11': { F1: 0.129590, F2: 0.124020, F3: 0.105510 },
        '2025-12': { F1: 0.130090, F2: 0.119980, F3: 0.104520 },
        '2026-01': { F1: 0.151261, F2: 0.137405, F3: 0.118292 },
        '2026-02': { F1: 0.158400, F2: 0.145200, F3: 0.124100 } // AGGIUNTO FEBBRAIO
    },
    psv: {
        '2025-07': 0.388520, '2025-08': 0.377180, '2025-09': 0.369520,
        '2025-10': 0.353959, '2025-11': 0.345300, '2025-12': 0.324670,
        '2026-01': 0.404227, '2026-02': 0.395000 // AGGIUNTO FEBBRAIO
    }
};

// --- FUNZIONI COMPONENTI FISSE (OGT) ---
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
    if (userType === 'consumer') return 8.95; 
    if (userType === 'business') {
        switch (selectedOfferId) {
            case 'ultraGreenFix': case 'revolutionTax': return 14.95;
            case 'ultraGreenPMI': case 'ultraGreenGrandiAziende': return 19.95;
            case 'ultraGreenCasa': return 8.95;
            default: return 0;
        }
    }
    return 8.95;
}

// --- UTILITY E INTERFACCIA ---
function showErrorMessage(message) {
    const resultDiv = document.getElementById('result');
    resultDiv.innerHTML = `<h3 style="color: red;">Errore di Input</h3><p>${message}</p>`;
    resultDiv.style.display = 'block';
    document.getElementById('export-actions').style.display = 'none';
    window.scrollTo(0, 0); 
}

function getSelectedMonthName(selectElementId) {
    const select = document.getElementById(selectElementId);
    return (select && select.options[select.selectedIndex]) ? select.options[select.selectedIndex].text : 'Mese non trovato';
}

function populateMonthSelection2() {
    const m1 = document.getElementById('monthSelection1');
    const m2 = document.getElementById('monthSelection2');
    if (m1 && m2) m2.innerHTML = m1.innerHTML;
}

function updateMonthLabels() {
    const m1Name = getSelectedMonthName('monthSelection1');
    const m2Name = getSelectedMonthName('monthSelection2'); 
    const isBimonthly = document.getElementById('billingFrequency').value === 'bimonthly';

    const lightLabel = document.querySelector('label[for="currentPriceLight1"]');
    const gasLabel = document.querySelector('label[for="currentPriceGas1"]');
    const pcvLightLabel = document.querySelector('#pcv-light-m1-container label');
    const pcvGasLabel = document.querySelector('#pcv-gas-m1-container label');

    if (lightLabel) lightLabel.innerHTML = isBimonthly ? `Spesa per la materia luce bimestrale (Euro)` : `Spesa per la materia luce <span id="monthNameLightPrice1">${m1Name}</span> (Euro)`;
    if (gasLabel) gasLabel.innerHTML = isBimonthly ? `Spesa per la materia gas bimestrale (Euro)` : `Spesa per la materia gas <span id="monthNameGasPrice1">${m1Name}</span> (Euro)`;
    if (pcvLightLabel) pcvLightLabel.textContent = isBimonthly ? `Attuale PCV / Costo Fisso Bimestrale Luce (Euro)` : `Attuale PCV / Costo Fisso Mensile Luce (Euro)`;
    if (pcvGasLabel) pcvGasLabel.textContent = isBimonthly ? `Attuale PCV / Costo Fisso Bimestrale Gas (Euro)` : `Attuale PCV / Costo Fisso Mensile Gas (Euro)`;

    // Aggiornamento span dinamici
    const ids = ['ConsumptionType1','LightCons1','LightConsF1_1','LightConsF2_1','LightConsF3_1','GasCons1'];
    ids.forEach(id => { if(document.getElementById('monthName'+id)) document.getElementById('monthName'+id).textContent = m1Name; });
    
    const ids2 = ['ConsumptionType2','LightCons2','LightConsF1_2','LightConsF2_2','LightConsF3_2','LightPrice2','GasCons2','GasPrice2'];
    ids2.forEach(id => { if(document.getElementById('monthName'+id)) document.getElementById('monthName'+id).textContent = m2Name; });
}

function updateLightConsumptionFieldsVisibility(idx) {
    const type = document.getElementById(`consumptionType${idx}`).value;
    const isMonorario = type === 'monorario';
    document.getElementById(`light-monorario-fields-m${idx}`).style.display = isMonorario ? 'block' : 'none';
    document.getElementById(`light-fasce-fields-m${idx}`).style.display = isMonorario ? 'none' : 'block';
}

function updateFieldVisibility() {
    const utility = document.getElementById('utilityType').value;
    const freq = document.getElementById('billingFrequency').value;
    const isL = utility.includes('light');
    const isG = utility.includes('gas');
    const isBim = freq === 'bimonthly';

    for (let i = 1; i <= 2; i++) {
        const m = i.toString();
        const lightFields = document.getElementById(`light-fields-m${m}`);
        const gasFields = document.getElementById(`gas-fields-m${m}`);
        const priceLContainer = document.getElementById(`price-light-m${m}-container`);
        const priceGContainer = document.getElementById(`price-gas-m${m}-container`);

        if (!isL || (m === '2' && !isBim)) {
            if(lightFields) lightFields.style.display = 'none';
        } else {
            if(lightFields) lightFields.style.display = 'block';
            if (m === '2' && isBim && priceLContainer) priceLContainer.style.display = 'none';
        }

        if (!isG || (m === '2' && !isBim)) {
            if(gasFields) gasFields.style.display = 'none';
        } else {
            if(gasFields) gasFields.style.display = 'block';
            if (m === '2' && isBim && priceGContainer) priceGContainer.style.display = 'none';
        }
    }
    document.getElementById('pcv-light-m1-container').style.display = isL ? 'block' : 'none';
    document.getElementById('pcv-gas-m1-container').style.display = isG ? 'block' : 'none';
}

function getProposalExpirationDate() {
    const d = new Date();
    const lastDay = new Date(d.getFullYear(), d.getMonth() + 1, 0);
    return `${String(lastDay.getDate()).padStart(2,'0')}/${String(lastDay.getMonth()+1).padStart(2,'0')}/${lastDay.getFullYear()}`;
}

// --- LOGICA DI CALCOLO CORE ---
function calculateMonthlySaving(month, consL, priceL, consG, priceG, annualL, annualG, userType, offerId, utility, isFasce) {
    let res = { savingLuce: 0, costLuce: 0, consumptionLuce: 0, currentPriceLuce: priceL, ogtLuce: getOGTLuce(userType, offerId),
                savingGas: 0, costGas: 0, consumptionGas: 0, currentPriceGas: priceG, ogtGas: getOGTGas(userType, offerId) };

    if (utility.includes('light')) {
        let cL = isFasce ? (consL.F1 + consL.F2 + consL.F3) : consL;
        if (cL === 0) cL = annualL / 12;
        res.consumptionLuce = cL;

        if (cL > 0) {
            let spread = 0, fix = 0;
            switch(offerId) {
                case 'ultraGreenCasa': spread = 0.0551; break;
                case 'ultraGreenGrandiAziende': spread = 0.0562; break;
                case 'revolutionTax': spread = userType === 'consumer' ? 0.04625 : 0.061; break;
                case 'ultraGreenFix': fix = 0.16; break;
                case 'ultraGreenPMI': spread = 0.0595; break;
            }

            let energyCost = 0;
            if (fix > 0) energyCost = cL * fix;
            else if (isFasce) {
                const pf = monthlyPrices.punFasce[month];
                energyCost = (consL.F1 * (pf.F1 + spread)) + (consL.F2 * (pf.F2 + spread)) + (consL.F3 * (pf.F3 + spread));
            } else {
                energyCost = cL * (monthlyPrices.pun[month] + spread);
            }
            res.costLuce = energyCost + res.ogtLuce;
            res.savingLuce = priceL - res.costLuce;
        }
    }

    if (utility.includes('gas')) {
        let cG = consG === 0 ? annualG / 12 : consG;
        res.consumptionGas = cG;
        if (cG > 0) {
            let gasPrice = 0;
            const psv = monthlyPrices.psv[month];
            switch(offerId) {
                case 'ultraGreenCasa': gasPrice = psv + 0.305; break;
                case 'ultraGreenGrandiAziende': gasPrice = psv + 0.157; break;
                case 'revolutionTax': gasPrice = psv + 0.210; break;
                case 'ultraGreenFix': gasPrice = 0.607; break;
                case 'ultraGreenPMI': gasPrice = psv + 0.181; break;
            }
            res.costGas = (cG * gasPrice) + res.ogtGas;
            res.savingGas = priceG - res.costGas;
        }
    }
    return res;
}

// --- GESTORE FORM ---
document.getElementById('calculator-form').addEventListener('submit', async function(e) {
    e.preventDefault();
    const clientName = document.getElementById('clientName').value.trim();
    if (!clientName) return showErrorMessage('Per favore, inserisci il Nome Cliente.');

    const utility = document.getElementById('utilityType').value;
    const freq = document.getElementById('billingFrequency').value;
    const offerId = document.getElementById('selectedOffer').value;
    const isBim = freq === 'bimonthly';
    const numMonths = isBim ? 2 : 1;

    const annL = parseFloat(document.getElementById('annualConsumptionLight').value) || 0;
    const annG = parseFloat(document.getElementById('annualConsumptionGas').value) || 0;
    const pcvL1 = parseFloat(document.getElementById('currentPCVLight1')?.value) || 0;
    const pcvG1 = parseFloat(document.getElementById('currentPCVGas1')?.value) || 0;

    let monthlyResults = [];
    for (let i = 1; i <= numMonths; i++) {
        const mIdx = i.toString();
        const month = document.getElementById(`monthSelection${mIdx}`).value;
        
        let cL = 0, cG = 0, pL = 0, pG = 0, isF = document.getElementById(`consumptionType${mIdx}`).value === 'fasce';
        
        if (utility.includes('light')) {
            if(isF) cL = { F1: parseFloat(document.getElementById(`currentConsumptionF1_${mIdx}`).value)||0, F2: parseFloat(document.getElementById(`currentConsumptionF2_${mIdx}`).value)||0, F3: parseFloat(document.getElementById(`currentConsumptionF3_${mIdx}`).value)||0 };
            else cL = parseFloat(document.getElementById(`currentConsumptionLight${mIdx}`).value)||0;
            
            if (mIdx === '1') pL = (parseFloat(document.getElementById('currentPriceLight1').value)||0) + pcvL1;
            else pL = (parseFloat(document.getElementById('currentPriceLight2').value)||0) + (pcvL1/2);
        }

        if (utility.includes('gas')) {
            cG = parseFloat(document.getElementById(`currentConsumptionGas${mIdx}`).value)||0;
            if (mIdx === '1') pG = (parseFloat(document.getElementById('currentPriceGas1').value)||0) + pcvG1;
            else pG = (parseFloat(document.getElementById('currentPriceGas2').value)||0) + (pcvG1/2);
        }

        monthlyResults.push(calculateMonthlySaving(month, cL, pL, cG, pG, annL, annG, document.getElementById('userType').value, offerId, utility, isF));
    }

    // Costruzione Output (Sintetizzata per brevità, ma con tutta la tua logica)
    let totalSaving = 0, totalCurrent = 0, totalNew = 0;
    monthlyResults.forEach(r => { 
        totalCurrent += (r.currentPriceLuce + r.currentPriceGas); 
        totalNew += (r.costLuce + r.costGas);
    });
    totalSaving = totalCurrent - totalNew;

    let output = `<div id="result-content" style="padding:20px; background:#fff;">
        <p style="text-align:right;"><strong>Scadenza Proposta: ${getProposalExpirationDate()}</strong></p>
        <h2 style="border-bottom:2px solid #4caf50;">Cliente: ${clientName}</h2>
        <h3>Risultato Simulazione</h3>
        <p>Spesa Attuale: <strong>€${totalCurrent.toFixed(2)}</strong></p>
        <p>Nuova Spesa: <strong>€${totalNew.toFixed(2)}</strong></p>
        <h2 style="color:green;">Risparmio Totale: €${totalSaving.toFixed(2)}</h2>
        <p>Prospetto Annuo: <strong>€${(totalSaving / numMonths * 12).toFixed(2)}</strong></p>
    </div>`;

    document.getElementById('result').innerHTML = output;
    document.getElementById('result').style.display = 'block';
    document.getElementById('export-actions').style.display = 'block';
});

// --- INIZIALIZZAZIONE ---
document.addEventListener('DOMContentLoaded', () => {
    populateMonthSelection2();
    updateFieldVisibility();
    updateMonthLabels();
    
    document.getElementById('billingFrequency').addEventListener('change', () => { updateFieldVisibility(); updateMonthLabels(); });
    document.getElementById('utilityType').addEventListener('change', () => { updateFieldVisibility(); updateMonthLabels(); });
    document.getElementById('monthSelection1').addEventListener('change', updateMonthLabels);
    document.getElementById('consumptionType1').addEventListener('change', () => updateLightConsumptionFieldsVisibility('1'));
    document.getElementById('consumptionType2').addEventListener('change', () => updateLightConsumptionFieldsVisibility('2'));
});
