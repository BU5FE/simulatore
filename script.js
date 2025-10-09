// script.js - Simulatore di Risparmio

// Database statico dei prezzi (aggiornato con i valori PSV e PUN)
const monthlyPrices = {
    pun: {
        '2025-01': 0.135,
        '2025-02': 0.14,
        '2025-03': 0.145,
        '2025-04': 0.15,
        '2025-05': 0.155,
        '2025-06': 0.16,
        '2025-07': 0.165,
        '2025-08': 0.17
    },
    psv: {
        '2025-01': 0.528080, // Gennaio 2025
        '2025-02': 0.560590, // Febbraio 2025
        '2025-03': 0.450460, // Marzo 2025
        '2025-04': 0.398350, // Aprile 2025
        '2025-05': 0.398880, // Maggio 2025
        '2025-06': 0.399710, // Giugno 2025
        '2025-07': 0.388520, // Luglio 2025
        '2025-08': 0.377180  // Agosto 2025
    }
};

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


// Funzione di utilità per mostrare messaggi di errore nell'output
function showErrorMessage(message) {
    const resultDiv = document.getElementById('result');
    resultDiv.innerHTML = `<h3 style="color: red;">Errore di Input</h3><p>${message}</p>`;
    resultDiv.style.display = 'block';
    window.scrollTo(0, 0); 
}

// NUOVA FUNZIONE: Restituisce il testo (nome) del mese selezionato
function getSelectedMonthName(selectElementId) {
    const select = document.getElementById(selectElementId);
    if (select && select.options[select.selectedIndex]) {
        return select.options[select.selectedIndex].text;
    }
    return 'Mese non trovato'; // Fallback
}


// Popola le opzioni del Mese 2 (uguali al Mese 1)
function populateMonthSelection2() {
    const monthSelection1 = document.getElementById('monthSelection1');
    const monthSelection2 = document.getElementById('monthSelection2');
    if (monthSelection1 && monthSelection2) {
        monthSelection2.innerHTML = monthSelection1.innerHTML;
    }
}

// NUOVA FUNZIONE: Aggiorna le etichette dei campi Luce/Gas con il nome del mese
function updateMonthLabels() {
    const monthName1 = getSelectedMonthName('monthSelection1');
    const monthName2 = getSelectedMonthName('monthSelection2');

    // Mese 1
    document.getElementById('monthNameLightCons1').textContent = monthName1;
    document.getElementById('monthNameLightPrice1').textContent = monthName1;
    document.getElementById('monthNameGasCons1').textContent = monthName1;
    document.getElementById('monthNameGasPrice1').textContent = monthName1;

    // Mese 2
    document.getElementById('monthNameLightCons2').textContent = monthName2;
    document.getElementById('monthNameLightPrice2').textContent = monthName2;
    document.getElementById('monthNameGasCons2').textContent = monthName2;
    document.getElementById('monthNameGasPrice2').textContent = monthName2;
}

// --- FUNZIONE DI GESTIONE VISIBILITÀ CAMPI BIMESTRALI ---
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
    
    // Assicurati che la visibilità Luce/Gas sia corretta anche per i campi Mese 2
    updateFieldVisibility(); 
    
    // Aggiorna le etichette dei mesi (importante che sia chiamato dopo l'aggiornamento del contenuto di monthSelection2)
    updateMonthLabels();
}
// ---------------------------------------------------


// --- FUNZIONE DI GESTIONE VISIBILITÀ CAMPI LUCE/GAS (Aggiornata per M1 e M2) ---
function updateFieldVisibility() {
    const utilityType = document.getElementById('utilityType').value;
    const billingFrequency = document.getElementById('billingFrequency').value;

    // Elementi Mese 1
    const lightFieldsM1 = document.getElementById('light-fields-m1');
    const gasFieldsM1 = document.getElementById('gas-fields-m1');
    const currentConsumptionLight1Input = document.getElementById('currentConsumptionLight1');
    const currentPriceLight1Input = document.getElementById('currentPriceLight1');
    const currentConsumptionGas1Input = document.getElementById('currentConsumptionGas1');
    const currentPriceGas1Input = document.getElementById('currentPriceGas1');


    // Elementi Mese 2
    const lightFieldsM2 = document.getElementById('light-fields-m2');
    const gasFieldsM2 = document.getElementById('gas-fields-m2');
    const currentConsumptionLight2Input = document.getElementById('currentConsumptionLight2');
    const currentPriceLight2Input = document.getElementById('currentPriceLight2');
    const currentConsumptionGas2Input = document.getElementById('currentConsumptionGas2');
    const currentPriceGas2Input = document.getElementById('currentPriceGas2');
    
    
    // Funzione di utilità per gestire gli attributi 'required'
    const setRequired = (element, isRequired) => {
        if (!element) return;
        if (isRequired) {
            element.setAttribute('required', 'required');
        } else {
            element.removeAttribute('required');
            element.value = ''; // Pulisce il campo quando non è richiesto
        }
    };


    // Gestione campi LUCE (M1 e M2)
    const isLightSelected = utilityType === 'light' || utilityType === 'lightAndGas';
    const isBimonthly = billingFrequency === 'bimonthly';
    
    if (!isLightSelected) {
        lightFieldsM1.style.display = 'none';
        setRequired(currentConsumptionLight1Input, false);
        setRequired(currentPriceLight1Input, false);
        lightFieldsM2.style.display = 'none';
        setRequired(currentConsumptionLight2Input, false);
        setRequired(currentPriceLight2Input, false);
    } else {
        lightFieldsM1.style.display = 'block';
        setRequired(currentConsumptionLight1Input, true);
        setRequired(currentPriceLight1Input, true);

        // I campi M2 Luce devono essere visibili solo se è bimestrale E la fornitura è Luce
        lightFieldsM2.style.display = isBimonthly ? 'block' : 'none';
        setRequired(currentConsumptionLight2Input, isBimonthly);
        setRequired(currentPriceLight2Input, isBimonthly);
    }

    // Gestione campi GAS (M1 e M2)
    const isGasSelected = utilityType === 'gas' || utilityType === 'lightAndGas';
    
    if (!isGasSelected) {
        gasFieldsM1.style.display = 'none';
        setRequired(currentConsumptionGas1Input, false);
        setRequired(currentPriceGas1Input, false);
        gasFieldsM2.style.display = 'none';
        setRequired(currentConsumptionGas2Input, false);
        setRequired(currentPriceGas2Input, false);
    } else {
        gasFieldsM1.style.display = 'block';
        setRequired(currentConsumptionGas1Input, true);
        setRequired(currentPriceGas1Input, true);
        
        // I campi M2 Gas devono essere visibili solo se è bimestrale E la fornitura è Gas/Luce&Gas
        gasFieldsM2.style.display = isBimonthly ? 'block' : 'none';
        setRequired(currentConsumptionGas2Input, isBimonthly);
        setRequired(currentPriceGas2Input, isBimonthly);
    }
}
// ---------------------------------------------------


// Logica per nascondere/mostrare l'offerta UltraGreen Casa in base al tipo di utente
document.getElementById('userType').addEventListener('change', function() {
    const userType = this.value;
    const offerSelect = document.getElementById('selectedOffer');
    const ultraGreenCasaOption = offerSelect.querySelector('option[value="ultraGreenCasa"]');

    if (userType === 'business') {
        ultraGreenCasaOption.style.display = 'none';
        if (offerSelect.value === 'ultraGreenCasa') {
            offerSelect.value = '';
        }
    } else {
        ultraGreenCasaOption.style.display = 'block';
    }
});

// Listener per mostrare/nascondere i campi Gas e Luce in base al tipo di fornitura
document.getElementById('utilityType').addEventListener('change', updateFieldVisibility);

// Listener per mostrare/nascondere i campi del secondo mese e la nota
document.getElementById('billingFrequency').addEventListener('change', () => {
    updateBimonthlyFieldsVisibility();
});

// NUOVI LISTENER: Aggiorna le etichette quando il mese cambia
document.getElementById('monthSelection1').addEventListener('change', updateMonthLabels);
document.getElementById('monthSelection2').addEventListener('change', updateMonthLabels);


// FUNZIONE CORE DI CALCOLO PER UN SINGOLO MESE
function calculateMonthlySaving(month, consumptionLight, priceLight, consumptionGas, priceGas, annualConsumptionLight, annualConsumptionGas, userType, selectedOfferId, utilityType) {
    let savingMonthlyLuce = 0;
    let newOfferCostLuce = 0;
    let savingMonthlyGas = 0;
    let newOfferCostGas = 0;
    let monthlyConsumptionLight = consumptionLight;
    let monthlyConsumptionGas = consumptionGas;
    
    const ogtCostLuce = getOGTLuce(userType, selectedOfferId);
    const ogtCostGas = getOGTGas(userType, selectedOfferId);


    // ------------------------------------ CALCOLO LUCE ------------------------------------
    if (utilityType === 'light' || utilityType === 'lightAndGas') {
        const hasConsumptionLight = !isNaN(consumptionLight) && consumptionLight > 0;
        const hasAnnualLight = !isNaN(annualConsumptionLight) && annualConsumptionLight > 0;
        
        if (!hasConsumptionLight) {
             monthlyConsumptionLight = hasAnnualLight ? annualConsumptionLight / 12 : 0;
        }

        if (monthlyConsumptionLight > 0) {
            const punPrice = monthlyPrices.pun[month];
            let energyCostLight = 0;
            
            switch(selectedOfferId) {
                case 'ultraGreenCasa':
                    energyCostLight = monthlyConsumptionLight * (punPrice + 0.0651);
                    break;
                case 'ultraGreenGrandiAziende':
                    energyCostLight = monthlyConsumptionLight * (punPrice + 0.0662);
                    break;
                case 'revolutionTax':
                    const revolutionTaxSpread = userType === 'consumer' ? 0.05625 : 0.061;
                    energyCostLight = monthlyConsumptionLight * (punPrice + revolutionTaxSpread);
                    break;
                case 'ultraGreenFix':
                    energyCostLight = monthlyConsumptionLight * 0.19;
                    break;
                case 'ultraGreenPMI':
                    energyCostLight = monthlyConsumptionLight * (punPrice + 0.0695);
                    break;
                default:
                    energyCostLight = 0;
                    break;
            }
            
            newOfferCostLuce = energyCostLight + ogtCostLuce;
            savingMonthlyLuce = priceLight - newOfferCostLuce;
        }
    }
    
    // ------------------------------------ CALCOLO GAS ------------------------------------
    if (utilityType === 'gas' || utilityType === 'lightAndGas') {
        const hasConsumptionGas = !isNaN(consumptionGas) && consumptionGas > 0;
        const hasAnnualGas = !isNaN(annualConsumptionGas) && annualConsumptionGas > 0;

        if (!hasConsumptionGas) {
            monthlyConsumptionGas = hasAnnualGas ? annualConsumptionGas / 12 : 0;
        }
        
        if (monthlyConsumptionGas > 0) {
            const psvPrice = monthlyPrices.psv[month];
            let energyCostGas = 0;
            let gasPricePerSmc = 0; 

            switch(selectedOfferId) {
                case 'ultraGreenCasa':
                    gasPricePerSmc = psvPrice + 0.315;
                    energyCostGas = monthlyConsumptionGas * gasPricePerSmc;
                    break;
                case 'ultraGreenGrandiAziende':
                    gasPricePerSmc = psvPrice + 0.167;
                    energyCostGas = monthlyConsumptionGas * gasPricePerSmc;
                    break;
                case 'revolutionTax':
                    gasPricePerSmc = psvPrice + 0.220;
                    energyCostGas = monthlyConsumptionGas * gasPricePerSmc;
                    break;
                case 'ultraGreenFix':
                    gasPricePerSmc = 0.617;
                    energyCostGas = monthlyConsumptionGas * gasPricePerSmc;
                    break;
                case 'ultraGreenPMI':
                    gasPricePerSmc = psvPrice + 0.191;
                    energyCostGas = monthlyConsumptionGas * gasPricePerSmc;
                    break;
                default:
                    energyCostGas = 0;
                    break;
            }

            newOfferCostGas = energyCostGas + ogtCostGas;
            savingMonthlyGas = priceGas - newOfferCostGas;
        }
    }

    return { 
        savingLuce: savingMonthlyLuce, 
        costLuce: newOfferCostLuce,
        consumptionLuce: monthlyConsumptionLight,
        currentPriceLuce: priceLight,
        ogtLuce: ogtCostLuce,

        savingGas: savingMonthlyGas, 
        costGas: newOfferCostGas,
        consumptionGas: monthlyConsumptionGas,
        currentPriceGas: priceGas,
        ogtGas: ogtCostGas
    };
}
// --------------------------------------------------------------------------------------


document.getElementById('calculator-form').addEventListener('submit', async function(e) {
    e.preventDefault();

    const billingFrequency = document.getElementById('billingFrequency').value;
    const userType = document.getElementById('userType').value;
    const utilityType = document.getElementById('utilityType').value;
    const selectedOfferId = document.getElementById('selectedOffer').value;

    const isBimonthly = billingFrequency === 'bimonthly';
    const numMonths = isBimonthly ? 2 : 1;
    
    // Variabile per la nota Revolution Tax
    let revolutionTaxNote = '';
    if ((utilityType === 'light' || utilityType === 'lightAndGas') && selectedOfferId === 'revolutionTax') {
        revolutionTaxNote = '<p style="font-style: italic; color: #388e3c;">**L\'offerta Revolution Tax garantisce lo sconto in fattura del 50% dell\'Accisa Luce.**</p>';
    }


    // Collettori per i risultati
    let totalSavingMonthly = 0;
    let totalNewOfferCost = 0;
    let totalCurrentCost = 0;
    
    let allCalculationDetailsLuce = '';
    let allCalculationDetailsGas = '';

    // Dati Annuali (usati come fallback)
    const annualConsumptionLight = parseFloat(document.getElementById('annualConsumptionLight').value) || 0;
    const annualConsumptionGas = parseFloat(document.getElementById('annualConsumptionGas').value) || 0;


    for (let i = 1; i <= numMonths; i++) {
        const monthIndex = i === 1 ? '1' : '2'; 
        
        // Verifica che il selettore del mese esista prima di leggerne il valore
        const monthSelector = document.getElementById(`monthSelection${monthIndex}`);
        if (!monthSelector) {
             showErrorMessage(`Errore: Selettore Mese di Riferimento ${i} non trovato.`);
             return;
        }
        const month = monthSelector.value;
        const monthName = getSelectedMonthName(`monthSelection${monthIndex}`);
        
        let currentPriceLight = 0;
        let currentConsumptionLight = 0;
        if (utilityType === 'light' || utilityType === 'lightAndGas') {
            currentPriceLight = parseFloat(document.getElementById(`currentPriceLight${monthIndex}`).value) || 0;
            currentConsumptionLight = parseFloat(document.getElementById(`currentConsumptionLight${monthIndex}`).value) || 0;
            if (currentPriceLight === 0) {
                 showErrorMessage(`Per favore, inserisci la Spesa per la materia luce di ${monthName}.`);
                 return;
            }
        }
        
        let currentPriceGas = 0;
        let currentConsumptionGas = 0;
        if (utilityType === 'gas' || utilityType === 'lightAndGas') {
            currentPriceGas = parseFloat(document.getElementById(`currentPriceGas${monthIndex}`).value) || 0;
            currentConsumptionGas = parseFloat(document.getElementById(`currentConsumptionGas${monthIndex}`).value) || 0;
             if (currentPriceGas === 0) {
                 showErrorMessage(`Per favore, inserisci la Spesa per la materia gas di ${monthName}.`);
                 return;
            }
        }
        
        // Esegui la simulazione per il mese i
        const result = calculateMonthlySaving(
            month, 
            currentConsumptionLight, 
            currentPriceLight, 
            currentConsumptionGas, 
            currentPriceGas, 
            annualConsumptionLight, 
            annualConsumptionGas, 
            userType, 
            selectedOfferId, 
            utilityType
        );
        
        // Aggrega i risultati
        totalSavingMonthly += result.savingLuce + result.savingGas;
        totalNewOfferCost += result.costLuce + result.costGas;
        totalCurrentCost += result.currentPriceLuce + result.currentPriceGas;
        
        // Dettagli Luce
        if (utilityType === 'light' || utilityType === 'lightAndGas') {
            const savingMonthlyColorLight = result.savingLuce > 0 ? 'green' : 'red';
            const savingMonthlyTextLight = result.savingLuce > 0 
                ? `Risparmio Luce: <strong>${result.savingLuce.toFixed(2)} Euro</strong>.`
                : `Non c'e' Risparmio Luce: <strong>${result.savingLuce.toFixed(2)} Euro</strong>.`;
                
            // Uso Math.round() per rimuovere i decimali
            const displayConsumptionLuce = Math.round(result.consumptionLuce);

            allCalculationDetailsLuce += `
                <h4>${monthName}</h4>
                <p>Consumo Luce ${monthName}: <strong>${displayConsumptionLuce} kWh</strong></p>
                <p>Spesa Materia Energia attuale: <strong>${result.currentPriceLuce.toFixed(2)} Euro</strong>.</p>
                <p>Spesa Materia Energia con la nuova offerta: <strong>${result.costLuce.toFixed(2)} Euro</strong>.</p>
                <p><span style="color: ${savingMonthlyColorLight};">${savingMonthlyTextLight}</span></p>
                <p style="font-style: italic;">N.B. Nella simulazione e' gia' incluso il Costo fisso (OGT) mensile a POD di ${result.ogtLuce.toFixed(2)} Euro.</p>
                ${isBimonthly && i === 1 ? '<hr style="border-top: 1px solid #eee;">' : ''}
            `;
        }
        
        // Dettagli Gas
        if (utilityType === 'gas' || utilityType === 'lightAndGas') {
            const savingMonthlyColorGas = result.savingGas > 0 ? 'green' : 'red';
            const savingMonthlyTextGas = result.savingGas > 0 
                ? `Risparmio Gas: <strong>${result.savingGas.toFixed(2)} Euro</strong>.`
                : `Non c'e' Risparmio Gas: <strong>${result.savingGas.toFixed(2)} Euro</strong>.`;
            
            // Uso Math.round() per rimuovere i decimali
            const displayConsumptionGas = Math.round(result.consumptionGas);

            allCalculationDetailsGas += `
                <h4>${monthName}</h4>
                <p>Consumo Gas ${monthName}: <strong>${displayConsumptionGas} smc</strong></p>
                <p>Spesa Materia Gas attuale: <strong>${result.currentPriceGas.toFixed(2)} Euro</strong>.</p>
                <p>Spesa Materia Gas con la nuova offerta: <strong>${result.costGas.toFixed(2)} Euro</strong>.</p>
                <p><span style="color: ${savingMonthlyColorGas};">${savingMonthlyTextGas}</span></p>
                <p style="font-style: italic;">N.B. Nella simulazione e' gia' incluso il Costo fisso (OGT) mensile a PDR di ${result.ogtGas.toFixed(2)} Euro.</p>
                ${isBimonthly && i === 1 ? '<hr style="border-top: 1px solid #eee;">' : ''}
            `;
        }
    }
    
    // Calcolo della media mensile finale
    const finalMonthlySaving = totalSavingMonthly / numMonths;
    const finalMonthlyNewCost = totalNewOfferCost / numMonths;
    const finalMonthlyCurrentCost = totalCurrentCost / numMonths;
    const totalSavingAnnual = finalMonthlySaving * 12;

    const offers = {
        ultraGreenCasa: { name: 'UltraGreen Casa' },
        ultraGreenFix: { name: 'UltraGreen Fix' },
        ultraGreenPMI: { name: 'UltraGreen PMI' },
        ultraGreenGrandiAziende: { name: 'UltraGreen Grandi Aziende' },
        revolutionTax: { name: 'Revolution Tax' }
    };
    
    const offerName = offers[selectedOfferId].name;
    
    let finalOutput = '';

    const savingMonthlyColor = finalMonthlySaving > 0 ? 'green' : 'red';
    const savingAnnualColor = totalSavingAnnual > 0 ? 'green' : 'red';
        
    // Output per Luce/Gas Singolo: rimosso "Totale" e dettagli costo
    const savingMonthlyTextSingle = finalMonthlySaving > 0 
        ? `Risparmio Mensile: <strong>${finalMonthlySaving.toFixed(2)} Euro</strong>.`
        : `Non c'e' Risparmio Mensile: <strong>${finalMonthlySaving.toFixed(2)} Euro</strong>.`;
    
    const savingAnnualTextSingle = totalSavingAnnual > 0 
        ? `Prospetto Risparmio Annuo: <strong>${totalSavingAnnual.toFixed(2)} Euro</strong>.`
        : `Non c'e' Risparmio Annuo: <strong>${totalSavingAnnual.toFixed(2)} Euro</strong>.`;


    if (utilityType === 'light' || utilityType === 'gas') {
        // Output per Luce o Gas Singolo (AGGIORNATO: "Riepilogo")
         finalOutput = `
            <h3>Simulazione con ${offerName}</h3>
            ${utilityType === 'light' ? '<h3>Dettagli LUCE</h3>' + allCalculationDetailsLuce + revolutionTaxNote : '<h3>Dettagli GAS</h3>' + allCalculationDetailsGas}
            
            <hr style="border-top: 2px solid #333; margin: 20px 0;"> 
            <h3>Riepilogo</h3>
            <p><span style="color: ${savingMonthlyColor}; font-size: 1.1em; font-weight: bold;">${savingMonthlyTextSingle}</span></p>
            <p><span style="color: ${savingAnnualColor}; font-size: 1.1em; font-weight: bold;">${savingAnnualTextSingle}</span></p>
        `;
    } else if (utilityType === 'lightAndGas') {
        // Output combinato (Luce e Gas) - Mantiene tutti i dettagli e il termine "Totale"
        const totalSavingMonthlyTextCombined = finalMonthlySaving > 0 
            ? `Risparmio Mensile Totale: <strong>${finalMonthlySaving.toFixed(2)} Euro</strong>.`
            : `Non c'e' Risparmio Mensile Totale: <strong>${finalMonthlySaving.toFixed(2)} Euro</strong>.`;
        
        const totalSavingAnnualTextCombined = totalSavingAnnual > 0 
            ? `Prospetto Risparmio Annuo Totale: <strong>${totalSavingAnnual.toFixed(2)} Euro</strong>.`
            : `Non c'e' Risparmio Annuo Totale: <strong>${totalSavingAnnual.toFixed(2)} Euro</strong>.`;
            
        finalOutput = `
            <h3>Simulazione con ${offerName}</h3>
            
            <h3 style="margin-top: 30px;">Dettagli LUCE</h3>
            ${allCalculationDetailsLuce}
            ${revolutionTaxNote}
            
            <hr style="border-top: 1px solid #ccc; margin: 15px 0;"> 
            <h3 style="margin-top: 30px;">Dettagli GAS</h3>
            ${allCalculationDetailsGas}

            <hr style="border-top: 2px solid #333; margin: 20px 0;"> 
            <h3>Riepilogo Totale (Luce + Gas)</h3>
            <p>Il tuo costo mensile totale attuale (Luce + Gas) e' di <strong>${finalMonthlyCurrentCost.toFixed(2)} Euro</strong>.</p>
            <p>Con l'offerta <strong>${offerName}</strong>, il tuo costo totale (Luce + Gas) e' di <strong>${finalMonthlyNewCost.toFixed(2)} Euro</strong>.</p>

            <p><span style="color: ${savingMonthlyColor}; font-size: 1.1em; font-weight: bold;">${totalSavingMonthlyTextCombined}</span></p>
            <p><span style="color: ${savingAnnualColor}; font-size: 1.1em; font-weight: bold;">${totalSavingAnnualTextCombined}</span></p>
        `;
    }


    const resultDiv = document.getElementById('result');
    resultDiv.innerHTML = finalOutput;
    resultDiv.style.display = 'block';

    window.scrollTo(0, 0);
});

// Chiamata all'avvio per assicurare che la visibilità sia corretta
document.addEventListener('DOMContentLoaded', () => {
    populateMonthSelection2();
    updateBimonthlyFieldsVisibility();
    // updateFieldVisibility() è già chiamata all'interno di updateBimonthlyFieldsVisibility
});