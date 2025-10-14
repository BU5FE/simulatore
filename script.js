// script.js - Simulatore di Risparmio

// Database statico dei prezzi (aggiornato con i valori PSV e PUN)
const monthlyPrices = {
    // PUN Monorario (Utilizzato se Tipologia Consumo è "Monorario" o come fallback)
    pun: {
        '2025-01': 0.135,
        '2025-02': 0.14,
        '2025-03': 0.145,
        '2025-04': 0.15,
        '2025-05': 0.155,
        '2025-06': 0.16,
        '2025-07': 0.165,
        '2025-08': 0.17,
        '2025-09': 0.109080 // RIPRISTINATO
    },
    // NUOVO: PUN a Fasce (RIPRISTINATO)
    punFasce: {
        '2025-01': { F1: 0.158320, F2: 0.151610, F3: 0.128540 },
        '2025-02': { F1: 0.157640, F2: 0.158950, F3: 0.139910 },
        '2025-03': { F1: 0.121680, F2: 0.134860, F3: 0.111650 },
        '2025-04': { F1: 0.095840, F2: 0.115080, F3: 0.095050 },
        '2025-05': { F1: 0.089090, F2: 0.110640, F3: 0.087110 },
        '2025-06': { F1: 0.113060, F2: 0.126760, F3: 0.103630 },
        '2025-07': { F1: 0.108960, F2: 0.127100, F3: 0.108490 },
        '2025-08': { F1: 0.105580, F2: 0.117970, F3: 0.106040 },
        '2025-09': { F1: 0.109590, F2: 0.120930, F3: 0.101880 } // RIPRISTINATO
    },
    psv: {
        '2025-01': 0.528080, 
        '2025-02': 0.560590, 
        '2025-03': 0.450460, 
        '2025-04': 0.398350, 
        '2025-05': 0.398880, 
        '2025-06': 0.399710, 
        '2025-07': 0.388520, 
        '2025-08': 0.377180,  
        '2025-09': 0.369520 // RIPRISTINATO
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

// Restituisce il testo (nome) del mese selezionato
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
    const consumptionType1 = document.getElementById('consumptionType1');
    const consumptionType2 = document.getElementById('consumptionType2');

    if (monthSelection1 && monthSelection2) {
        monthSelection2.innerHTML = monthSelection1.innerHTML;
    }
    // Assicura che anche il selettore Tipologia Consumo M2 abbia le stesse opzioni di M1
    if (consumptionType1 && consumptionType2) {
         consumptionType2.innerHTML = consumptionType1.innerHTML;
    }
}

// Aggiorna le etichette dei campi Luce/Gas con il nome del mese
function updateMonthLabels() {
    const monthName1 = getSelectedMonthName('monthSelection1');
    const monthName2 = getSelectedMonthName('monthSelection2');
    const billingFrequency = document.getElementById('billingFrequency').value;
    const isBimonthly = billingFrequency === 'bimonthly';
    const utilityType = document.getElementById('utilityType').value;
    const isLightSelected = utilityType === 'light' || utilityType === 'lightAndGas';
    const isGasSelected = utilityType === 'gas' || utilityType === 'lightAndGas';

    // Mese 1 Price Label Luce - MODIFICATO PER GESTIRE LA LABEL BIMESTRALE
    const lightPriceLabelM1 = document.querySelector('label[for="currentPriceLight1"] span');
    if (lightPriceLabelM1) {
        if (isBimonthly && isLightSelected) {
            // Unisce i nomi dei mesi per il costo bimestrale Luce
            lightPriceLabelM1.textContent = `${monthName1} e ${monthName2} (Totale Bimestre)`;
        } else {
            lightPriceLabelM1.textContent = monthName1;
        }
    }
    
    // Mese 1 Price Label Gas - AGGIUNTO PER GESTIRE LA LABEL BIMESTRALE GAS
    const gasPriceLabelM1 = document.querySelector('label[for="currentPriceGas1"] span');
     if (gasPriceLabelM1) {
        if (isBimonthly && isGasSelected) {
            // Unisce i nomi dei mesi per il costo bimestrale Gas
            gasPriceLabelM1.textContent = `${monthName1} e ${monthName2} (Totale Bimestre)`;
        } else {
            gasPriceLabelM1.textContent = monthName1;
        }
    }
    
    // Mese 1 (altre etichette)
    document.getElementById('monthNameConsumptionType1').textContent = monthName1;
    document.getElementById('monthNameLightCons1').textContent = monthName1;
    document.getElementById('monthNameLightConsF1_1').textContent = monthName1;
    document.getElementById('monthNameLightConsF2_1').textContent = monthName1;
    document.getElementById('monthNameLightConsF3_1').textContent = monthName1;
    document.getElementById('monthNameGasCons1').textContent = monthName1;
    
    // Mese 2
    document.getElementById('monthNameConsumptionType2').textContent = monthName2;
    document.getElementById('monthNameLightCons2').textContent = monthName2;
    document.getElementById('monthNameLightConsF1_2').textContent = monthName2;
    document.getElementById('monthNameLightConsF2_2').textContent = monthName2;
    document.getElementById('monthNameLightConsF3_2').textContent = monthName2;
    document.getElementById('monthNameLightPrice2').textContent = monthName2;
    document.getElementById('monthNameGasCons2').textContent = monthName2;
    document.getElementById('monthNameGasPrice2').textContent = monthName2;
}

// --- Gestione visibilità campi consumo LUCE (Monorario vs Fasce) - RIPRISTINATA ---
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
    
    // Mostra/Nascondi Div
    monorarioDiv.style.display = isMonorario ? 'block' : 'none';
    fasceDiv.style.display = isMonorario ? 'none' : 'block';
    
    // Pulisce i campi nascosti per evitare che i loro valori interferiscano con la validazione JavaScript
    if (isMonorario) {
        fasceInputs.forEach(input => {
            if (input) input.value = '';
        }); 
    } else {
        if (monorarioInput) monorarioInput.value = '';
    }
}
// --------------------------------------------------------------------------------------


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
    
    // Aggiorna la visibilità Luce/Gas e i campi Monorario/Fasce
    updateFieldVisibility(); 
    updateLightConsumptionFieldsVisibility('1');
    updateLightConsumptionFieldsVisibility('2');
    
    // Aggiorna le etichette dei mesi (importante che sia chiamato dopo l'aggiornamento del contenuto di monthSelection2)
    updateMonthLabels();
}
// ---------------------------------------------------


// --- FUNZIONE DI GESTIONE VISIBILITÀ CAMPI LUCE/GAS ---
function updateFieldVisibility() {
    const utilityType = document.getElementById('utilityType').value;
    const billingFrequency = document.getElementById('billingFrequency').value;

    const isLightSelected = utilityType === 'light' || utilityType === 'lightAndGas';
    const isGasSelected = utilityType === 'gas' || utilityType === 'lightAndGas';
    const isBimonthly = billingFrequency === 'bimonthly';
    
    // Funzione helper per pulire e nascondere un input e la sua label
    const hideAndClearElement = (element) => {
        if (element) {
             // Se è un input, pulisci il valore
            if (element.tagName === 'INPUT') element.value = '';
            // Se è un div, nascondilo
            element.style.display = 'none';
        }
    };
    
    // Funzione helper per mostrare un elemento
    const showElement = (element) => {
        if (element) element.style.display = 'block';
    };

    // Ciclo sui mesi (1 e 2)
    for (let i = 1; i <= 2; i++) {
        const monthIndex = i.toString();
        
        // Elementi Comuni
        const lightFields = document.getElementById(`light-fields-m${monthIndex}`);
        const gasFields = document.getElementById(`gas-fields-m${monthIndex}`);

        const currentConsumptionLightInput = document.getElementById(`currentConsumptionLight${monthIndex}`);
        const currentConsumptionGasInput = document.getElementById(`currentConsumptionGas${monthIndex}`);
        
        // Contenitori di prezzo (per Mese 2) e Input Prezzo (per tutti i mesi)
        const priceLightContainer = document.getElementById(`price-light-m${monthIndex}-container`);
        const priceGasContainer = document.getElementById(`price-gas-m${monthIndex}-container`);
        const currentPriceLightInput = document.getElementById(`currentPriceLight${monthIndex}`);
        const currentPriceGasInput = document.getElementById(`currentPriceGas${monthIndex}`);
        
        const isM2 = monthIndex === '2';

        // 1. Gestione campi LUCE
        if (!isLightSelected || (isM2 && !isBimonthly)) {
            // Nascondi se Luce non è selezionato O è M2 e la fatturazione non è bimestrale
            hideAndClearElement(lightFields);
            
            // Pulisce i campi nascosti
            if(currentConsumptionLightInput) currentConsumptionLightInput.value = '';
            if(currentPriceLightInput) currentPriceLightInput.value = '';
            
            // Pulisci e nascondi tutti i campi Fasce (gestiti dal listener, ma per sicurezza)
            updateLightConsumptionFieldsVisibility(monthIndex); 
        } else {
            showElement(lightFields);

            // Logica specifica per M2: in Bimestrale, il prezzo M2 è NASCOSTO e INCLUSO in M1
            if (isM2 && isBimonthly) {
                hideAndClearElement(priceLightContainer);
                if (currentPriceLightInput) currentPriceLightInput.value = ''; // Pulisci il campo nascosto
            } else if (priceLightContainer) {
                // M1 (sempre visibile) o M2 in Mensile
                showElement(priceLightContainer);
            }
        }
        
        // 2. Gestione campi GAS
        if (!isGasSelected || (isM2 && !isBimonthly)) {
             // Nascondi se Gas non è selezionato O è M2 e la fatturazione non è bimestrale
            hideAndClearElement(gasFields);
            
            // Pulisce i campi nascosti
            if(currentConsumptionGasInput) currentConsumptionGasInput.value = '';
            if(currentPriceGasInput) currentPriceGasInput.value = '';
        } else {
            showElement(gasFields);
            
            // Logica specifica per M2: in Bimestrale, il prezzo M2 è NASCOSTO e INCLUSO in M1
             if (isM2 && isBimonthly) {
                hideAndClearElement(priceGasContainer);
                if (currentPriceGasInput) currentPriceGasInput.value = ''; // Pulisci il campo nascosto
            } else if (priceGasContainer) {
                // M1 (sempre visibile) o M2 in Mensile
                showElement(priceGasContainer);
            }
        }
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
document.getElementById('utilityType').addEventListener('change', updateMonthLabels);

// Listener per mostrare/nascondere i campi del secondo mese e la nota
document.getElementById('billingFrequency').addEventListener('change', () => {
    updateBimonthlyFieldsVisibility();
});

// Listener per il cambio Monorario/Fasce (Mese 1) - RIPRISTINATO
document.getElementById('consumptionType1').addEventListener('change', () => {
    updateLightConsumptionFieldsVisibility('1');
});

// Listener per il cambio Monorario/Fasce (Mese 2) - RIPRISTINATO
document.getElementById('consumptionType2').addEventListener('change', () => {
    updateLightConsumptionFieldsVisibility('2');
});

// Listener: Aggiorna le etichette quando il mese cambia
document.getElementById('monthSelection1').addEventListener('change', updateMonthLabels);
document.getElementById('monthSelection2').addEventListener('change', updateMonthLabels);


// FUNZIONE CORE DI CALCOLO PER UN SINGOLO MESE
function calculateMonthlySaving(month, consumptionLight, priceLight, consumptionGas, priceGas, annualConsumptionLight, annualConsumptionGas, userType, selectedOfferId, utilityType, isFasce) {
    let savingMonthlyLuce = 0;
    let newOfferCostLuce = 0;
    let savingMonthlyGas = 0;
    let newOfferCostGas = 0;
    let monthlyConsumptionGas = consumptionGas;
    
    // Calcolo del consumo totale luce per il display (somma se a fasce, altrimenti usa il valore monorario)
    const totalConsumptionLight = isFasce 
        ? consumptionLight.F1 + consumptionLight.F2 + consumptionLight.F3 
        : consumptionLight;
    
    let monthlyConsumptionLight = totalConsumptionLight;
    
    // OGT Costo fisso mensile (non cambia da Mese 1 a Mese 2 per la stessa offerta e utente)
    const ogtCostLuce = getOGTLuce(userType, selectedOfferId);
    const ogtCostGas = getOGTGas(userType, selectedOfferId);


    // ------------------------------------ CALCOLO LUCE ------------------------------------
    if (utilityType === 'light' || utilityType === 'lightAndGas') {
        
        // Se il consumo totale è 0, proviamo a usare la media annuale
        const hasConsumptionLight = monthlyConsumptionLight > 0;
        const hasAnnualLight = !isNaN(annualConsumptionLight) && annualConsumptionLight > 0;
        
        if (!hasConsumptionLight) {
             monthlyConsumptionLight = hasAnnualLight ? annualConsumptionLight / 12 : 0;
        }

        if (monthlyConsumptionLight > 0) {
            
            let energyCostLight = 0;
            let spreadLuce = 0;
            let fixPriceLuce = 0;
            
            switch(selectedOfferId) {
                case 'ultraGreenCasa':
                    spreadLuce = 0.0651;
                    break;
                case 'ultraGreenGrandiAziende':
                    spreadLuce = 0.0662;
                    break;
                case 'revolutionTax':
                    spreadLuce = userType === 'consumer' ? 0.05625 : 0.061;
                    break;
                case 'ultraGreenFix':
                    fixPriceLuce = 0.19;
                    break;
                case 'ultraGreenPMI':
                    spreadLuce = 0.0695;
                    break;
                default:
                    spreadLuce = 0;
                    fixPriceLuce = 0;
                    break;
            }
            
            // Calcolo del costo dell'energia (RIPRISTINATO LOGICA FASCE)
            if (fixPriceLuce > 0) {
                energyCostLight = monthlyConsumptionLight * fixPriceLuce;
                
            } else if (isFasce && spreadLuce > 0) {
                 const punFasce = monthlyPrices.punFasce[month];
                 
                 // Fallback a monorario se non sono stati inseriti consumi per fascia MA c'è consumo totale
                 if (consumptionLight.F1 === 0 && consumptionLight.F2 === 0 && consumptionLight.F3 === 0 && monthlyConsumptionLight > 0) {
                      const punPriceMonorario = monthlyPrices.pun[month];
                      energyCostLight = monthlyConsumptionLight * (punPriceMonorario + spreadLuce);
                 } else if (punFasce) {
                    // Calcolo effettivo a fasce
                    energyCostLight = 
                         (consumptionLight.F1 * (punFasce.F1 + spreadLuce)) + 
                         (consumptionLight.F2 * (punFasce.F2 + spreadLuce)) +
                         (consumptionLight.F3 * (punFasce.F3 + spreadLuce));
                 } else {
                     energyCostLight = 0; // Se mancano i dati PUN Fasce
                 }
                
            } else if (spreadLuce > 0) {
                const punPriceMonorario = monthlyPrices.pun[month];
                energyCostLight = monthlyConsumptionLight * (punPriceMonorario + spreadLuce);
            }
            
            // Costo Totale Nuova Offerta (Energia + Costo Fisso OGT)
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
                    break;
                case 'ultraGreenGrandiAziende':
                    gasPricePerSmc = psvPrice + 0.167;
                    break;
                case 'revolutionTax':
                    gasPricePerSmc = psvPrice + 0.220;
                    break;
                case 'ultraGreenFix':
                    gasPricePerSmc = 0.617;
                    break;
                case 'ultraGreenPMI':
                    gasPricePerSmc = psvPrice + 0.191;
                    break;
                default:
                    gasPricePerSmc = 0;
                    break;
            }
            
            energyCostGas = monthlyConsumptionGas * gasPricePerSmc;

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
    let monthlyResults = [];
    let totalCurrentPriceLuceBimonthly = 0; 
    let totalCurrentPriceGasBimonthly = 0; 

    // Dati Annuali (usati come fallback)
    const annualConsumptionLight = parseFloat(document.getElementById('annualConsumptionLight').value) || 0;
    const annualConsumptionGas = parseFloat(document.getElementById('annualConsumptionGas').value) || 0;


    for (let i = 1; i <= numMonths; i++) {
        const monthIndex = i === 1 ? '1' : '2'; 
        
        const monthSelector = document.getElementById(`monthSelection${monthIndex}`);
        if (!monthSelector) {
             showErrorMessage(`Errore: Selettore Mese di Riferimento ${i} non trovato.`);
             return;
        }
        const month = monthSelector.value;
        const monthName = getSelectedMonthName(`monthSelection${monthIndex}`);
        
        let currentPriceLight = 0; 
        let currentConsumptionLight; // Deve essere in grado di contenere un oggetto
        let isFasce = false;
        
        let currentPriceGas = 0;
        let currentConsumptionGas = 0;


        // 1. Acquisizione Dati LUCE
        if (utilityType === 'light' || utilityType === 'lightAndGas') {
            
            // Consumo Luce (RIPRISTINATO LOGICA FASCE)
            const consumptionType = document.getElementById(`consumptionType${monthIndex}`).value;
            isFasce = consumptionType === 'fasce';
            
            if (isFasce) {
                const f1 = parseFloat(document.getElementById(`currentConsumptionF1_${monthIndex}`).value) || 0;
                const f2 = parseFloat(document.getElementById(`currentConsumptionF2_${monthIndex}`).value) || 0;
                const f3 = parseFloat(document.getElementById(`currentConsumptionF3_${monthIndex}`).value) || 0;
                currentConsumptionLight = { F1: f1, F2: f2, F3: f3 };
                
                if (f1 === 0 && f2 === 0 && f3 === 0 && annualConsumptionLight === 0) {
                     showErrorMessage(`Per favore, inserisci i consumi (F1, F2, F3) oppure il Consumo Luce annuale per ${monthName}.`);
                     return;
                }
                
            } else {
                currentConsumptionLight = parseFloat(document.getElementById(`currentConsumptionLight${monthIndex}`).value) || 0;
                 if (currentConsumptionLight === 0 && annualConsumptionLight === 0) {
                     showErrorMessage(`Per favore, inserisci il Consumo Luce Totale oppure il Consumo Luce annuale per ${monthName}.`);
                     return;
                }
            }

            
            // Validazione Prezzo: M1 è il campo attivo (Mensile: prezzo del mese / Bimestrale: prezzo totale bimestre)
            if (monthIndex === '1') {
                const inputPrice = parseFloat(document.getElementById(`currentPriceLight${monthIndex}`).value) || 0;
                if (inputPrice === 0) {
                     showErrorMessage(`Per favore, inserisci la Spesa per la materia luce ${isBimonthly ? 'totale del bimestre' : `di ${monthName}`}.`);
                     return;
                }
                if (isBimonthly) {
                    totalCurrentPriceLuceBimonthly = inputPrice;
                } else {
                    currentPriceLight = inputPrice;
                }
            } else if (monthIndex === '2' && !isBimonthly) {
                 // Prezzo per Mese 2 in fatturazione Mensile
                 currentPriceLight = parseFloat(document.getElementById(`currentPriceLight${monthIndex}`).value) || 0;
                 if (currentPriceLight === 0) {
                     showErrorMessage(`Per favore, inserisci la Spesa per la materia luce di ${monthName}.`);
                     return;
                }
            }
        }
        
        // 2. Acquisizione Dati GAS
        if (utilityType === 'gas' || utilityType === 'lightAndGas') {
            currentConsumptionGas = parseFloat(document.getElementById(`currentConsumptionGas${monthIndex}`).value) || 0;

            // Validazione Consumo/Annuale
             if (currentConsumptionGas === 0 && annualConsumptionGas === 0) {
                 showErrorMessage(`Per favore, inserisci il Consumo Gas oppure il Consumo Gas annuale per ${monthName}.`);
                 return;
            }
            
            // Validazione Prezzo: M1 è il campo attivo (Mensile: prezzo del mese / Bimestrale: prezzo totale bimestre)
            if (monthIndex === '1') {
                const inputPrice = parseFloat(document.getElementById(`currentPriceGas${monthIndex}`).value) || 0;
                if (inputPrice === 0) {
                     showErrorMessage(`Per favore, inserisci la Spesa per la materia gas ${isBimonthly ? 'totale del bimestre' : `di ${monthName}`}.`);
                     return;
                }
                if (isBimonthly) {
                    totalCurrentPriceGasBimonthly = inputPrice;
                } else {
                    currentPriceGas = inputPrice;
                }
            } else if (monthIndex === '2' && !isBimonthly) {
                 // Prezzo per Mese 2 in fatturazione Mensile
                 currentPriceGas = parseFloat(document.getElementById(`currentPriceGas${monthIndex}`).value) || 0;
                 if (currentPriceGas === 0) {
                     showErrorMessage(`Per favore, inserisci la Spesa per la materia gas di ${monthName}.`);
                     return;
                }
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
            utilityType,
            isFasce // Passa lo stato Fasce al calcolatore
        );
        
        monthlyResults.push(result);
    } // FINE LOOP
    
    // --- AGGREGAZIONE DATI (DOPO IL LOOP) ---
    
    let totalNewOfferCostLuce = 0;
    let totalNewOfferCostGas = 0;
    let totalLuceConsumption = 0;
    let totalGasConsumption = 0;
    
    // Aggregazione risultati offerta e consumi
    monthlyResults.forEach(result => {
        totalNewOfferCostLuce += result.costLuce;
        totalNewOfferCostGas += result.costGas;
        totalLuceConsumption += result.consumptionLuce;
        totalGasConsumption += result.consumptionGas;
    });

    // Gestione Prezzo Attuale Luce e Gas
    let totalCurrentCostLuce = 0;
    let totalCurrentCostGas = 0;
    let allCalculationDetailsLuce = '';
    let allCalculationDetailsGas = '';
    
    // Popola i dettagli per l'output finale
    monthlyResults.forEach((result, index) => {
        const monthIndex = index + 1;
        const monthName = getSelectedMonthName(`monthSelection${monthIndex}`);
        const savingMonthlyColorLight = result.savingLuce > 0 ? 'green' : 'red';
        const savingMonthlyColorGas = result.savingGas > 0 ? 'green' : 'red';

        // Luce Details
        if (utilityType === 'light' || utilityType === 'lightAndGas') {
            // Accumula solo i prezzi correnti del mese (se mensile)
            if (!isBimonthly) totalCurrentCostLuce += result.currentPriceLuce;
            
            const savingMonthlyTextLight = result.savingLuce > 0 
                ? `Risparmio Luce: <strong>${result.savingLuce.toFixed(2)} Euro</strong>.`
                : `Non c'e' Risparmio Luce: <strong>${result.savingLuce.toFixed(2)} Euro</strong>.`;
                
            if (!isBimonthly) { // Solo Mensile ha dettagli per M2 separati
                allCalculationDetailsLuce += `
                    <h4>${monthName}</h4>
                    <p>Consumo Luce Totale ${monthName}: <strong>${Math.round(result.consumptionLuce)} kWh</strong></p>
                    <p>Spesa Materia Energia attuale: <strong>${result.currentPriceLuce.toFixed(2)} Euro</strong>.</p>
                    <p>Spesa Materia Energia con la nuova offerta: <strong>${result.costLuce.toFixed(2)} Euro</strong>.</p>
                    <p><span style="color: ${savingMonthlyColorLight};">${savingMonthlyTextLight}</span></p>
                    <p style="font-style: italic;">N.B. Nella simulazione e' gia' incluso il Costo fisso (OGT) mensile a POD di ${result.ogtLuce.toFixed(2)} Euro.</p>
                    ${!isBimonthly && index === 0 && monthlyResults.length === 2 ? '<hr style="border-top: 1px solid #eee;">' : ''}
                `;
            }
        }

        // Gas Details
        if (utilityType === 'gas' || utilityType === 'lightAndGas') {
            // Accumula solo i prezzi correnti del mese (se mensile)
            if (!isBimonthly) totalCurrentCostGas += result.currentPriceGas;
            
            const savingMonthlyTextGas = result.savingGas > 0 
                ? `Risparmio Gas: <strong>${result.savingGas.toFixed(2)} Euro</strong>.`
                : `Non c'e' Risparmio Gas: <strong>${result.savingGas.toFixed(2)} Euro</strong>.`;
            
            if (!isBimonthly) { // Solo Mensile ha dettagli per M2 separati
                allCalculationDetailsGas += `
                    <h4>${monthName}</h4>
                    <p>Consumo Gas ${monthName}: <strong>${Math.round(result.consumptionGas)} smc</strong></p>
                    <p>Spesa Materia Gas attuale: <strong>${result.currentPriceGas.toFixed(2)} Euro</strong>.</p>
                    <p>Spesa Materia Gas con la nuova offerta: <strong>${result.costGas.toFixed(2)} Euro</strong>.</p>
                    <p><span style="color: ${savingMonthlyColorGas};">${savingMonthlyTextGas}</span></p>
                    <p style="font-style: italic;">N.B. Nella simulazione e' gia' incluso il Costo fisso (OGT) mensile a PDR di ${result.ogtGas.toFixed(2)} Euro.</p>
                    ${!isBimonthly && index === 0 && monthlyResults.length === 2 ? '<hr style="border-top: 1px solid #eee;">' : ''}
                `;
            }
        }
    });

    // Se bimestrale, i totali attuali vengono dai campi totalCurrentPrice...Bimonthly
    if (isBimonthly) {
        totalCurrentCostLuce = totalCurrentPriceLuceBimonthly;
        totalCurrentCostGas = totalCurrentPriceGasBimonthly;
    }

    // Calcolo Risparmio Totale (Luce + Gas)
    const totalCurrentCostCombined = totalCurrentCostLuce + totalCurrentCostGas;
    const totalNewOfferCostCombined = totalNewOfferCostLuce + totalNewOfferCostGas;
    const totalSavingCombined = totalCurrentCostCombined - totalNewOfferCostCombined;

    // Calcolo della media mensile finale (basato sul risparmio totale)
    const finalMonthlySaving = totalSavingCombined / numMonths;
    const totalSavingAnnual = finalMonthlySaving * 12;

    // --- GENERAZIONE DETTAGLI OUTPUT ---
    
    const offers = {
        ultraGreenCasa: { name: 'UltraGreen Casa' },
        ultraGreenFix: { name: 'UltraGreen Fix' },
        ultraGreenPMI: { name: 'UltraGreen PMI' },
        ultraGreenGrandiAziende: { name: 'UltraGreen Grandi Aziende' },
        revolutionTax: { name: 'Revolution Tax' }
    };
    
    const offerName = offers[selectedOfferId].name;
    
    const savingMonthlyColor = finalMonthlySaving > 0 ? 'green' : 'red';
    const savingAnnualColor = totalSavingAnnual > 0 ? 'green' : 'red';
        
    let finalOutput = `<h3>Simulazione con ${offerName}</h3>`;

    // ------------------------------------ BIMESTRALE - DETTAGLI AGGREGATI ------------------------------------
    if (isBimonthly) {
        const monthName1 = getSelectedMonthName('monthSelection1');
        const monthName2 = getSelectedMonthName('monthSelection2');
        const bimestralName = `${monthName1} e ${monthName2}`;
        
        // Dettagli Luce Bimestrale
        if (utilityType === 'light' || utilityType === 'lightAndGas') {
            const savingBimonthlyLuce = totalCurrentCostLuce - totalNewOfferCostLuce;
            const savingLuceText = savingBimonthlyLuce > 0 
                ? `Risparmio Luce: <strong>${savingBimonthlyLuce.toFixed(2)} Euro</strong>.`
                : `Non c'e' Risparmio Luce: <strong>${savingBimonthlyLuce.toFixed(2)} Euro</strong>.`;
            
            const ogtLuceMonthly = monthlyResults[0].ogtLuce; // OGT Mese 1
            
            finalOutput += `
                <h3 style="margin-top: 30px;">Dettagli LUCE</h3>
                <h4>Dettagli Luce Bimestrale (${bimestralName})</h4>
                <p>Consumo Luce Totale Bimestre: <strong>${Math.round(totalLuceConsumption)} kWh</strong></p>
                <p>Spesa Materia Energia attuale: <strong>${totalCurrentCostLuce.toFixed(2)} Euro</strong>.</p>
                <p>Spesa Materia Energia con la nuova offerta: <strong>${totalNewOfferCostLuce.toFixed(2)} Euro</strong>.</p>
                <p><span style="color: ${savingMonthlyColor};">${savingLuceText}</span></p>
                <p style="font-style: italic;">N.B. Nella simulazione sono inclusi i Costi fissi (OGT) mensili a POD (${ogtLuceMonthly.toFixed(2)} Euro/Mese).</p>
                ${revolutionTaxNote}
            `;
        }
        
        // Dettagli Gas Bimestrale
        if (utilityType === 'gas' || utilityType === 'lightAndGas') {
            const savingBimonthlyGas = totalCurrentCostGas - totalNewOfferCostGas;
            const savingGasText = savingBimonthlyGas > 0 
                ? `Risparmio Gas: <strong>${savingBimonthlyGas.toFixed(2)} Euro</strong>.`
                : `Non c'e' Risparmio Gas: <strong>${savingBimonthlyGas.toFixed(2)} Euro</strong>.`;
                
            const ogtGasMonthly = monthlyResults[0].ogtGas; // OGT Mese 1

            finalOutput += `
                <h3 style="margin-top: 30px;">Dettagli GAS</h3>
                <h4>Dettagli Gas Bimestrale (${bimestralName})</h4>
                <p>Consumo Gas Totale Bimestre: <strong>${Math.round(totalGasConsumption)} smc</strong></p>
                <p>Spesa Materia Gas attuale: <strong>${totalCurrentCostGas.toFixed(2)} Euro</strong>.</p>
                <p>Spesa Materia Gas con la nuova offerta: <strong>${totalNewOfferCostGas.toFixed(2)} Euro</strong>.</p>
                <p><span style="color: ${savingMonthlyColor};">${savingGasText}</span></p>
                <p style="font-style: italic;">N.B. Nella simulazione sono inclusi i Costi fissi (OGT) mensili a PDR (${ogtGasMonthly.toFixed(2)} Euro/Mese).</p>
            `;
        }

    // ------------------------------------ MENSILE - DETTAGLI SEPARATI (o UNICO MESE) ------------------------------------
    } else {
        if (utilityType === 'light' || utilityType === 'lightAndGas') {
            finalOutput += `<h3 style="margin-top: 30px;">Dettagli LUCE</h3>${allCalculationDetailsLuce}${revolutionTaxNote}`;
        }
        if (utilityType === 'gas' || utilityType === 'lightAndGas') {
            if (utilityType === 'lightAndGas') finalOutput += `<hr style="border-top: 1px solid #ccc; margin: 15px 0;">`;
            finalOutput += `<h3 style="margin-top: 30px;">Dettagli GAS</h3>${allCalculationDetailsGas}`;
        }
    }


    // ------------------------------------ RIEPILOGO ------------------------------------
    const periodText = isBimonthly ? 'bimestrale' : 'mensile';
    const savingMonthlyTextCombined = finalMonthlySaving > 0 
        ? `Risparmio Mensile Medio: <strong>${finalMonthlySaving.toFixed(2)} Euro</strong>.`
        : `Non c'e' Risparmio Mensile Medio: <strong>${finalMonthlySaving.toFixed(2)} Euro</strong>.`;

    const savingAnnualTextCombined = totalSavingAnnual > 0 
        ? `Prospetto Risparmio Annuo: <strong>${totalSavingAnnual.toFixed(2)} Euro</strong>.`
        : `Non c'e' Risparmio Annuo: <strong>${totalSavingAnnual.toFixed(2)} Euro</strong>.`;

    let riepilogo = `
        <hr style="border-top: 2px solid #333; margin: 20px 0;"> 
        <h3>Riepilogo Totale (${isBimonthly ? 'Luce + Gas' : 'Media Mensile'}${isBimonthly ? '' : (utilityType === 'lightAndGas' ? ' Luce + Gas' : '')})</h3>
    `;

    if (utilityType === 'lightAndGas' || isBimonthly) {
        riepilogo += `<p>Il tuo costo ${periodText} totale attuale (Luce + Gas) e' di <strong>${totalCurrentCostCombined.toFixed(2)} Euro</strong>.</p>
                      <p>Con l'offerta <strong>${offerName}</strong>, il tuo costo ${periodText} totale (Luce + Gas) e' di <strong>${totalNewOfferCostCombined.toFixed(2)} Euro</strong>.</p>`;
    }
    
    // Per Luce o Gas Singolo in Mensile, mostra i dettagli mensili medi
    if (!isBimonthly && (utilityType === 'light' || utilityType === 'gas')) {
        const currentCost = utilityType === 'light' ? totalCurrentCostLuce : totalCurrentCostGas;
        const newCost = utilityType === 'light' ? totalNewOfferCostLuce : totalNewOfferCostGas;
        riepilogo += `<p>Il tuo costo ${periodText} medio attuale e' di <strong>${(currentCost / numMonths).toFixed(2)} Euro</strong>.</p>
                      <p>Con l'offerta <strong>${offerName}</strong>, il tuo costo ${periodText} medio e' di <strong>${(newCost / numMonths).toFixed(2)} Euro</strong>.</p>`;
    }


    riepilogo += `<p><span style="color: ${savingMonthlyColor}; font-size: 1.1em; font-weight: bold;">${savingMonthlyTextCombined}</span></p>
                  <p><span style="color: ${savingAnnualColor}; font-size: 1.1em; font-weight: bold;">${savingAnnualTextCombined}</span></p>`;
    
    finalOutput += riepilogo;

    const resultDiv = document.getElementById('result');
    resultDiv.innerHTML = finalOutput;
    resultDiv.style.display = 'block';

    window.scrollTo(0, 0);
});

// Chiamata all'avvio per assicurare che la visibilità sia corretta
document.addEventListener('DOMContentLoaded', () => {
    populateMonthSelection2();
    updateBimonthlyFieldsVisibility();
});