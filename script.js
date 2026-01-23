// script.js - Simulatore di Risparmio

// Database statico dei prezzi (Aggiornato con Ottobre 2025)
const monthlyPrices = {
    // PUN Monorario
    pun: {
        '2025-01': 0.135,
        '2025-02': 0.14,
        '2025-03': 0.145,
        '2025-04': 0.15,
        '2025-05': 0.155,
        '2025-06': 0.16,
        '2025-07': 0.165,
        '2025-08': 0.17,
        '2025-09': 0.109080,
    	'2025-10': 0.111040,
        '2025-11': 0.117090,
        '2025-12': 0.115490
    },
    // PUN a Fasce
    punFasce: {
        '2025-01': { F1: 0.158320, F2: 0.151610, F3: 0.128540 },
        '2025-02': { F1: 0.157640, F2: 0.158950, F3: 0.139910 },
        '2025-03': { F1: 0.121680, F2: 0.134860, F3: 0.111650 },
        '2025-04': { F1: 0.095840, F2: 0.115080, F3: 0.095050 },
        '2025-05': { F1: 0.089090, F2: 0.110640, F3: 0.087110 },
        '2025-06': { F1: 0.113060, F2: 0.126760, F3: 0.103630 },
        '2025-07': { F1: 0.108960, F2: 0.127100, F3: 0.108490 },
        '2025-08': { F1: 0.105580, F2: 0.117970, F3: 0.106040 },
        '2025-09': { F1: 0.109590, F2: 0.120930, F3: 0.101880 },
    	'2025-10': { F1: 0.117830, F2: 0.121660, F3: 0.099480 },
'2025-11': { F1: 0.129590, F2: 0.124020, F3: 0.105510 },
'2025-12': { F1: 0.130090, F2: 0.119980, F3: 0.104520 }
    },
    // PSV
    psv: {
        '2025-01': 0.528080,
        '2025-02': 0.560590,
        '2025-03': 0.450460,
        '2025-04': 0.398350,
        '2025-05': 0.398880,
        '2025-06': 0.399710,
        '2025-07': 0.388520,
        '2025-08': 0.377180,
        '2025-09': 0.369520,
    	'2025-10': 0.353959,
'2025-11': 0.345300,
        '2025-12': 0.324670
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
    // Nasconde i pulsanti di export in caso di errore
    document.getElementById('export-actions').style.display = 'none';
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

    // Seleziona l'intera label per la modifica completa del testo
    const lightLabelElement = document.querySelector('label[for="currentPriceLight1"]');
    const gasLabelElement = document.querySelector('label[for="currentPriceGas1"]');

    // Elementi delle nuove PCV/Costo Fisso (Mese 1)
    const pcvLightLabelElement = document.querySelector('#pcv-light-m1-container label');
    const pcvGasLabelElement = document.querySelector('#pcv-gas-m1-container label');


    // Mese 1 Price Label Luce - (Spesa per la materia)
    if (lightLabelElement) {
        // *** MODIFICA PER BIMESTRALE ***
        lightLabelElement.innerHTML = isBimonthly
            ? `Spesa per la materia luce bimestrale (Euro)`
            : `Spesa per la materia luce <span id="monthNameLightPrice1">${monthName1}</span> (Euro)`;
    }
    
    // Mese 1 Price Label Gas - (Spesa per la materia)
     if (gasLabelElement) {
        // *** MODIFICA PER BIMESTRALE ***
        gasLabelElement.innerHTML = isBimonthly
            ? `Spesa per la materia gas bimestrale (Euro)`
            : `Spesa per la materia gas <span id="monthNameGasPrice1">${monthName1}</span> (Euro)`;
    }

    // AGGIORNAMENTO: Aggiorna la label del campo PCV/Costo Fisso M1 (Mensile vs Bimestrale)
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
    
    // Container PCV/Costo Fisso M1
    const pcvLightContainerM1 = document.getElementById('pcv-light-m1-container');
    const pcvGasContainerM1 = document.getElementById('pcv-gas-m1-container');
    
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

             // Nascondi anche il PCV M1 se Luce non è selezionato
            if (monthIndex === '1' && pcvLightContainerM1) {
                hideAndClearElement(pcvLightContainerM1);
            }
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
            // Mostra il PCV M1
            if (monthIndex === '1' && pcvLightContainerM1) {
                showElement(pcvLightContainerM1);
            }
        }
        
        // 2. Gestione campi GAS
        if (!isGasSelected || (isM2 && !isBimonthly)) {
             // Nascondi se Gas non è selezionato O è M2 e la fatturazione non è bimestrale
            hideAndClearElement(gasFields);
            
            // Pulisce i campi nascosti
            if(currentConsumptionGasInput) currentConsumptionGasInput.value = '';
            if(currentPriceGasInput) currentPriceGasInput.value = '';

            // Nascondi anche il PCV M1 se Gas non è selezionato
            if (monthIndex === '1' && pcvGasContainerM1) {
                hideAndClearElement(pcvGasContainerM1);
            }
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

            // Mostra il PCV M1
            if (monthIndex === '1' && pcvGasContainerM1) {
                showElement(pcvGasContainerM1);
            }
        }
    }
}
// ---------------------------------------------------

// NUOVA FUNZIONE: Calcola l'ultimo giorno del mese corrente (Scadenza Proposta)
function getProposalExpirationDate() {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth() + 1; // getMonth() è 0-based
    // L'ultimo giorno del mese è il giorno 0 del mese successivo
    const lastDayOfMonth = new Date(year, month, 0);
    
    const day = String(lastDayOfMonth.getDate()).padStart(2, '0');
    const monthStr = String(lastDayOfMonth.getMonth() + 1).padStart(2, '0');
    const yearStr = lastDayOfMonth.getFullYear();
    
    return `${day}/${monthStr}/${yearStr}`;
}


// NUOVE FUNZIONI: Gestione dell'esportazione
async function exportResult(type) {
    const resultDiv = document.getElementById('result-content');
    if (!resultDiv) return showErrorMessage('Contenuto della simulazione non trovato per l\'esportazione.');

    // Clona il contenuto per manipolazione temporanea
    const clone = resultDiv.cloneNode(true);
    // Imposta lo stile per una migliore resa nel PDF/Immagine
    clone.style.padding = '20px'; 
    clone.style.backgroundColor = '#fff';
    clone.style.border = 'none'; // Rimuove il bordo del div #result per la cattura
    
    // Usa un container temporaneo per isolare la cattura
    const tempContainer = document.createElement('div');
    tempContainer.style.width = '500px'; 
    tempContainer.style.margin = '0 auto';
    tempContainer.style.position = 'absolute';
    tempContainer.style.left = '-9999px'; // Lo nasconde fuori dallo schermo
    tempContainer.appendChild(clone);
    document.body.appendChild(tempContainer);

    try {
        const canvas = await html2canvas(clone, {
            scale: 2,
            useCORS: true,
            windowWidth: 500
        });
        
        // Rimuovi il container temporaneo
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
             // Utilizza la versione UMD di jspdf
             const { jsPDF } = window.jspdf;
             const pdf = new jsPDF('p', 'mm', 'a4');
             const imgData = canvas.toDataURL('image/jpeg', 1.0);
             const pdfWidth = pdf.internal.pageSize.getWidth();
             const pdfHeight = pdf.internal.pageSize.getHeight();
             
             // Larghezza desiderata per l'immagine nel PDF (lasciando margini)
             const imgWidth = 180; 
             // Calcola l'altezza in base al rapporto d'aspetto
             const imgHeight = canvas.height * imgWidth / canvas.width;
             
             let heightLeft = imgHeight;
             let position = 10; // Margine superiore
             
             // Aggiungi l'immagine al PDF
             pdf.addImage(imgData, 'JPEG', (pdfWidth - imgWidth) / 2, position, imgWidth, imgHeight);
             heightLeft -= (pdfHeight - position);

             // Gestione pagine multiple (se l'altezza è maggiore della pagina)
             while (heightLeft >= -50) { // Aggiunto un piccolo margine di tolleranza
                 position = heightLeft - imgHeight + 10; // Ricalcola posizione per la nuova pagina
                 pdf.addPage();
                 pdf.addImage(imgData, 'JPEG', (pdfWidth - imgWidth) / 2, position, imgWidth, imgHeight);
                 heightLeft -= (pdfHeight - 10);
             }
             
             pdf.save('Simulazione_Risparmio.pdf');
        }
        
    } catch (error) {
        // Rimuovi il container temporaneo in caso di errore
        if (tempContainer.parentNode) {
            document.body.removeChild(tempContainer);
        }
        console.error('Errore durante l\'esportazione:', error);
        showErrorMessage('Errore durante la creazione del file di esportazione. Controlla la console per i dettagli.');
    } 
}
// --------------------------------------------------------------------------------------


// Funzione CORE DI CALCOLO PER UN SINGOLO MESE
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
                    spreadLuce = 0.0551;
                    break;
                case 'ultraGreenGrandiAziende':
                    spreadLuce = 0.0562;
                    break;
                case 'revolutionTax':
                    spreadLuce = userType === 'consumer' ? 0.04625 : 0.061;
                    break;
                case 'ultraGreenFix':
                    fixPriceLuce = 0.16;
                    break;
                case 'ultraGreenPMI':
                    spreadLuce = 0.0595;
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
            // priceLight qui è il costo totale attuale (Spesa Materia + PCV/Costo Fisso)
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
                    gasPricePerSmc = psvPrice + 0.305;
                    break;
                case 'ultraGreenGrandiAziende':
                    gasPricePerSmc = psvPrice + 0.157;
                    break;
                case 'revolutionTax':
                    gasPricePerSmc = psvPrice + 0.210;
                    break;
                case 'ultraGreenFix':
                    gasPricePerSmc = 0.607;
                    break;
                case 'ultraGreenPMI':
                    gasPricePerSmc = psvPrice + 0.181;
                    break;
                default:
                    gasPricePerSmc = 0;
                    break;
            }
            
            energyCostGas = monthlyConsumptionGas * gasPricePerSmc;

            newOfferCostGas = energyCostGas + ogtCostGas;
            // priceGas qui è il costo totale attuale (Spesa Materia + PCV/Costo Fisso)
            savingMonthlyGas = priceGas - newOfferCostGas;
        }
    }

    return { 
        savingLuce: savingMonthlyLuce, 
        costLuce: newOfferCostLuce,
        consumptionLuce: monthlyConsumptionLight, 
        currentPriceLuce: priceLight, // Costo totale attuale
        ogtLuce: ogtCostLuce,

        savingGas: savingMonthlyGas, 
        costGas: newOfferCostGas,
        consumptionGas: monthlyConsumptionGas,
        currentPriceGas: priceGas, // Costo totale attuale
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
    
    // NUOVO: Recupero Nome Cliente e Calcolo Scadenza Proposta
    const clientName = document.getElementById('clientName').value.trim();
    if (!clientName) {
         showErrorMessage('Per favore, inserisci il Nome Cliente.');
         return;
    }
    const proposalExpirationDate = getProposalExpirationDate();
    
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


    // Recupero i nuovi campi PCV/Costo Fisso M1 (che sono gli unici attivi per questo input)
    const currentPCVLight1 = parseFloat(document.getElementById(`currentPCVLight1`)?.value) || 0;
    const currentPCVGas1 = parseFloat(document.getElementById(`currentPCVGas1`)?.value) || 0;

    for (let i = 1; i <= numMonths; i++) {
        const monthIndex = i === 1 ? '1' : '2'; 
        
        const monthSelector = document.getElementById(`monthSelection${monthIndex}`);
        if (!monthSelector) {
             showErrorMessage(`Errore: Selettore Mese di Riferimento ${i} non trovato.`);
             return;
        }
        const month = monthSelector.value;
        const monthName = getSelectedMonthName(`monthSelection${monthIndex}`);
        
        let currentPriceLightRaw = 0; // Spesa Materia grezza
        let currentPriceLight = 0; // Spesa Totale Attuale (Spesa Materia + PCV/Costo Fisso)
        let currentConsumptionLight; // Deve essere in grado di contenere un oggetto
        let isFasce = false;
        
        let currentPriceGasRaw = 0; // Spesa Materia grezza
        let currentPriceGas = 0; // Spesa Totale Attuale (Spesa Materia + PCV/Costo Fisso)
        let currentConsumptionGas = 0;


        // 1. Acquisizione Dati LUCE
        if (utilityType === 'light' || utilityType === 'lightAndGas') {
            
            // Consumo Luce
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

            
            // Acquisizione Prezzo: M1 è il campo attivo (Mensile: prezzo del mese / Bimestrale: prezzo totale bimestre)
            if (monthIndex === '1') {
                currentPriceLightRaw = parseFloat(document.getElementById(`currentPriceLight${monthIndex}`).value) || 0;
                if (currentPriceLightRaw === 0) {
                     showErrorMessage(`Per favore, inserisci la Spesa per la materia luce ${isBimonthly ? 'totale del bimestre' : `di ${monthName}`}.`);
                     return;
                }
                
                // CALCOLO PREZZO TOTALE (Spesa Materia + PCV/Costo Fisso)
                currentPriceLight = currentPriceLightRaw + currentPCVLight1;

                if (isBimonthly) {
                    totalCurrentPriceLuceBimonthly = currentPriceLight; // Usa il prezzo TOTALE
                } 
                
            } else if (monthIndex === '2' && !isBimonthly) {
                 // Prezzo per Mese 2 in fatturazione Mensile
                 currentPriceLightRaw = parseFloat(document.getElementById(`currentPriceLight${monthIndex}`).value) || 0;
                 if (currentPriceLightRaw === 0) {
                     showErrorMessage(`Per favore, inserisci la Spesa per la materia luce di ${monthName}.`);
                     return;
                }
                 // Per Mese 2 Mensile, il costo fisso (PCV) è dato dal PCV M1 diviso 2
                 currentPriceLight = currentPriceLightRaw + (currentPCVLight1 / 2);
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
            
            // Acquisizione Prezzo: M1 è il campo attivo
            if (monthIndex === '1') {
                currentPriceGasRaw = parseFloat(document.getElementById(`currentPriceGas${monthIndex}`).value) || 0;
                if (currentPriceGasRaw === 0) {
                     showErrorMessage(`Per favore, inserisci la Spesa per la materia gas ${isBimonthly ? 'totale del bimestre' : `di ${monthName}`}.`);
                     return;
                }
                
                // CALCOLO PREZZO TOTALE (Spesa Materia + PCV/Costo Fisso)
                currentPriceGas = currentPriceGasRaw + currentPCVGas1;

                if (isBimonthly) {
                    totalCurrentPriceGasBimonthly = currentPriceGas; // Usa il prezzo TOTALE
                }
            } else if (monthIndex === '2' && !isBimonthly) {
                 // Prezzo per Mese 2 in fatturazione Mensile
                 currentPriceGasRaw = parseFloat(document.getElementById(`currentPriceGas${monthIndex}`).value) || 0;
                 if (currentPriceGasRaw === 0) {
                     showErrorMessage(`Per favore, inserisci la Spesa per la materia gas di ${monthName}.`);
                     return;
                }
                // Per Mese 2 Mensile, il costo fisso (PCV) è dato dal PCV M1 diviso 2
                 currentPriceGas = currentPriceGasRaw + (currentPCVGas1 / 2);
            }
        }
        
        // Esegui la simulazione per il mese i
        const result = calculateMonthlySaving(
            month, 
            currentConsumptionLight, 
            currentPriceLight, // Passa il costo totale attuale (Spesa Materia + PCV/Costo Fisso)
            currentConsumptionGas, 
            currentPriceGas, // Passa il costo totale attuale (Spesa Materia + PCV/Costo Fisso)
            annualConsumptionLight, 
            annualConsumptionGas, 
            userType, 
            selectedOfferId, 
            utilityType,
            isFasce
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
            // Accumula solo i prezzi correnti totali del mese (se mensile)
            if (!isBimonthly) totalCurrentCostLuce += result.currentPriceLuce;
            
            const savingMonthlyTextLight = result.savingLuce > 0 
                ? `Risparmio Luce: <strong>${result.savingLuce.toFixed(2)} Euro</strong>.`
                : `Non c'e' Risparmio Luce: <strong>${result.savingLuce.toFixed(2)} Euro</strong>.`;
                
            if (!isBimonthly) { // Solo Mensile ha dettagli per M2 separati
                allCalculationDetailsLuce += `
                    <h4>${monthName}</h4>
                    <p>Consumo Luce Totale ${monthName}: <strong>${Math.round(result.consumptionLuce)} kWh</strong></p>
                    <p>Costo Totale Attuale (Spesa Materia + PCV/CF): <strong>${result.currentPriceLuce.toFixed(2)} Euro</strong>.</p>
                    <p>Spesa Materia Energia con la nuova offerta: <strong>${result.costLuce.toFixed(2)} Euro</strong>.</p>
                    <p><span style="color: ${savingMonthlyColorLight};">${savingMonthlyTextLight}</span></p>
                    <p style="font-style: italic;">N.B. Nella simulazione e' gia' incluso il Costo fisso (OGT) mensile a POD di ${result.ogtLuce.toFixed(2)} Euro.</p>
                    ${!isBimonthly && index === 0 && monthlyResults.length === 2 ? '<hr style="border-top: 1px solid #eee;">' : ''}
                `;
            }
        }

        // Gas Details
        if (utilityType === 'gas' || utilityType === 'lightAndGas') {
            // Accumula solo i prezzi correnti totali del mese (se mensile)
            if (!isBimonthly) totalCurrentCostGas += result.currentPriceGas;
            
            const savingMonthlyTextGas = result.savingGas > 0 
                ? `Risparmio Gas: <strong>${result.savingGas.toFixed(2)} Euro</strong>.`
                : `Non c'e' Risparmio Gas: <strong>${result.savingGas.toFixed(2)} Euro</strong>.`;
            
            if (!isBimonthly) { // Solo Mensile ha dettagli per M2 separati
                allCalculationDetailsGas += `
                    <h4>${monthName}</h4>
                    <p>Consumo Gas ${monthName}: <strong>${Math.round(result.consumptionGas)} smc</strong></p>
                    <p>Costo Totale Attuale (Spesa Materia + PCV/CF): <strong>${result.currentPriceGas.toFixed(2)} Euro</strong>.</p>
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
        
    // Inizio output: Nome Cliente e Scadenza Proposta, avvolto in result-content per l'export
    let finalOutput = `
        <div id="result-content" style="padding: 10px;">
            <p style="text-align: right; font-size: 0.9em; margin-bottom: 20px;">
                <strong>Scadenza Proposta: ${proposalExpirationDate}</strong>
            </p>
            <h2 style="color: #2e7d32; text-align: left; border-bottom: 2px solid #4caf50; padding-bottom: 5px; margin-bottom: 20px;">
                Cliente: ${clientName}
            </h2>
            <h3>Simulazione con ${offerName}</h3>`;


    // ------------------------------------ BIMESTRALE - DETTAGLI AGGREGATI ------------------------------------
    if (isBimonthly) {
        const monthName1 = getSelectedMonthName('monthSelection1');
        const monthName2 = getSelectedMonthName('monthSelection2');
        const bimestralName = `${monthName1} e ${monthName2}`;
        
        // Dettagli Luce Bimestrale
        if (utilityType === 'light' || utilityType === 'lightAndGas') {
            const savingBimonthlyLuce = totalCurrentCostLuce - totalNewOfferCostLuce;
            // Colore specifico per il risparmio Luce Bimestrale
            const savingColorLuce = savingBimonthlyLuce > 0 ? 'green' : 'red';
            const savingLuceText = savingBimonthlyLuce > 0 
                ? `Risparmio Luce: <strong>${savingBimonthlyLuce.toFixed(2)} Euro</strong>.`
                : `Non c'e' Risparmio Luce: <strong>${savingBimonthlyLuce.toFixed(2)} Euro</strong>.`;
            
            const ogtLuceMonthly = monthlyResults[0].ogtLuce; // OGT Mese 1
            
            finalOutput += `
                <h3 style="margin-top: 30px;">Dettagli LUCE</h3>
                <h4>Dettagli Luce Bimestrale (${bimestralName})</h4>
                <p>Consumo Luce Totale Bimestre: <strong>${Math.round(totalLuceConsumption)} kWh</strong></p>
                <p>Costo Totale Attuale Bimestre (Spesa Materia + PCV/CF): <strong>${totalCurrentCostLuce.toFixed(2)} Euro</strong>.</p>
                <p>Spesa Materia Energia con la nuova offerta: <strong>${totalNewOfferCostLuce.toFixed(2)} Euro</strong>.</p>
                <p><span style="color: ${savingColorLuce};">${savingLuceText}</span></p>
                <p style="font-style: italic;">N.B. Nella simulazione sono inclusi i Costi fissi (OGT) mensili a POD (${ogtLuceMonthly.toFixed(2)} Euro/Mese).</p>
                ${revolutionTaxNote}
            `;
        }
        
        // Dettagli Gas Bimestrale
        if (utilityType === 'gas' || utilityType === 'lightAndGas') {
            const savingBimonthlyGas = totalCurrentCostGas - totalNewOfferCostGas;
            // Colore specifico per il risparmio Gas Bimestrale
            const savingColorGas = savingBimonthlyGas > 0 ? 'green' : 'red';
            const savingGasText = savingBimonthlyGas > 0 
                ? `Risparmio Gas: <strong>${savingBimonthlyGas.toFixed(2)} Euro</strong>.`
                : `Non c'e' Risparmio Gas: <strong>${savingBimonthlyGas.toFixed(2)} Euro</strong>.`;
                
            const ogtGasMonthly = monthlyResults[0].ogtGas; // OGT Mese 1

            finalOutput += `
                <h3 style="margin-top: 30px;">Dettagli GAS</h3>
                <h4>Dettagli Gas Bimestrale (${bimestralName})</h4>
                <p>Consumo Gas Totale Bimestre: <strong>${Math.round(totalGasConsumption)} smc</strong></p>
                <p>Costo Totale Attuale Bimestre (Spesa Materia + PCV/CF): <strong>${totalCurrentCostGas.toFixed(2)} Euro</strong>.</p>
                <p>Spesa Materia Gas con la nuova offerta: <strong>${totalNewOfferCostGas.toFixed(2)} Euro</strong>.</p>
                <p><span style="color: ${savingColorGas};">${savingGasText}</span></p>
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
    
    // Testo per l'intestazione del riepilogo
    let riepilogoTitleText = 'Riepilogo Totale';
    if (isBimonthly) {
        if (utilityType === 'lightAndGas') {
            riepilogoTitleText += ' (Luce + Gas)';
        }
    } else {
        // Mensile: solo Luce o solo Gas
        if (utilityType === 'light') riepilogoTitleText += ' Luce';
        if (utilityType === 'gas') riepilogoTitleText += ' Gas';
        if (utilityType === 'lightAndGas') riepilogoTitleText += ' (Luce + Gas)';
    }

    const savingMonthlyTextCombined = finalMonthlySaving > 0 
        ? `Risparmio Mensile: <strong>${finalMonthlySaving.toFixed(2)} Euro</strong>.`
        : `Non c'e' Risparmio Mensile: <strong>${finalMonthlySaving.toFixed(2)} Euro</strong>.`;

    const savingAnnualTextCombined = totalSavingAnnual > 0 
        ? `Prospetto Risparmio Annuo: <strong>${totalSavingAnnual.toFixed(2)} Euro</strong>.`
        : `Non c'e' Risparmio Annuo: <strong>${totalSavingAnnual.toFixed(2)} Euro</strong>.`;

    let riepilogo = `
        <hr style="border-top: 2px solid #333; margin: 20px 0;"> 
        <h3>${riepilogoTitleText}</h3> `;

    
    const isCombinedSimulation = utilityType === 'lightAndGas';
    let currentCostText = '';
    let newOfferCostText = '';

    if (isCombinedSimulation) {
         // Luce + Gas
        currentCostText = `<p>Il tuo costo ${periodText} totale attuale (Luce + Gas) e' di <strong>${totalCurrentCostCombined.toFixed(2)} Euro</strong>.</p>`;
        newOfferCostText = `<p>Con l'offerta <strong>${offerName}</strong>, il tuo costo ${periodText} totale (Luce + Gas) e' di <strong>${totalNewOfferCostCombined.toFixed(2)} Euro</strong>.</p>`;
    } else if (isBimonthly) {
        // Solo Luce o Solo Gas in Bimestrale (il costo combinato corrisponde al costo della singola utenza)
        currentCostText = `<p>Il tuo costo ${periodText} attuale e' di <strong>${totalCurrentCostCombined.toFixed(2)} Euro</strong>.</p>`;
        newOfferCostText = `<p>Con l'offerta <strong>${offerName}</strong>, il tuo costo ${periodText} e' di <strong>${totalNewOfferCostCombined.toFixed(2)} Euro</strong>.</p>`;
    } else {
        // Solo Luce o Solo Gas in Mensile (logica precedente per mensile)
        const currentCost = utilityType === 'light' ? totalCurrentCostLuce : totalCurrentCostGas;
        const newCost = utilityType === 'light' ? totalNewOfferCostLuce : totalNewOfferCostGas;
        currentCostText = `<p>Il tuo costo ${periodText} attuale e' di <strong>${(currentCost / numMonths).toFixed(2)} Euro</strong>.</p>`;
        newOfferCostText = `<p>Con l'offerta <strong>${offerName}</strong>, il tuo costo ${periodText} e' di <strong>${(newCost / numMonths).toFixed(2)} Euro</strong>.</p>`;
    }

    riepilogo += currentCostText;
    riepilogo += newOfferCostText;

    riepilogo += `<p><span style="color: ${savingMonthlyColor}; font-size: 1.1em; font-weight: bold;">${savingMonthlyTextCombined}</span></p>
                  <p><span style="color: ${savingAnnualColor}; font-size: 1.1em; font-weight: bold;">${savingAnnualTextCombined}</span></p>`;
    
    finalOutput += riepilogo;

    finalOutput += `</div>`; // Chiusura di result-content

    const resultDiv = document.getElementById('result');
    resultDiv.innerHTML = finalOutput;
    resultDiv.style.display = 'block';

    // NUOVO: Mostra i pulsanti di esportazione
    document.getElementById('export-actions').style.display = 'block';

    window.scrollTo(0, 0);
});

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


// Chiamata all'avvio per assicurare che la visibilità sia corretta
document.addEventListener('DOMContentLoaded', () => {
    populateMonthSelection2();
    updateBimonthlyFieldsVisibility();
    
    // NUOVO: Listener per i pulsanti di esportazione
    const exportPdfBtn = document.getElementById('exportPdfBtn');
    const exportImgBtn = document.getElementById('exportImgBtn');
    
    if (exportPdfBtn) {
        exportPdfBtn.addEventListener('click', () => exportResult('pdf'));
    }
    if (exportImgBtn) {
        exportImgBtn.addEventListener('click', () => exportResult('image'));
    }

});




