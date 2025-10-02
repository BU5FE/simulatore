// script.js - Simulatore di Risparmio

// Database statico dei prezzi (da sostituire con un'API in futuro)
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
    }
};

// Funzione per calcolare la componente OGT in base al tipo di utente e offerta
function getOGT(userType, selectedOfferId) {
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

// Logica per nascondere/mostrare l'offerta UltraGreen Casa
document.getElementById('userType').addEventListener('change', function() {
    const userType = this.value;
    const offerSelect = document.getElementById('selectedOffer');
    const ultraGreenCasaOption = offerSelect.querySelector('option[value="ultraGreenCasa"]');

    if (userType === 'business') {
        ultraGreenCasaOption.style.display = 'none';
        // Se UltraGreen Casa è l'offerta selezionata, la cambia in un'altra
        if (offerSelect.value === 'ultraGreenCasa') {
            offerSelect.value = ''; // Svuota la selezione o imposta un'opzione di default
        }
    } else {
        ultraGreenCasaOption.style.display = 'block';
    }
});

document.getElementById('calculator-form').addEventListener('submit', async function(e) {
    e.preventDefault();

    // Prendi i valori dal modulo
    const annualConsumption = parseFloat(document.getElementById('annualConsumption').value);
    const monthlyConsumptionInput = parseFloat(document.getElementById('currentConsumption').value);
    const currentPrice = parseFloat(document.getElementById('currentPrice').value);
    const userType = document.getElementById('userType').value;
    const selectedOfferId = document.getElementById('selectedOffer').value;
    const selectedMonth = document.getElementById('monthSelection').value;

    let monthlyConsumption;
    
    // Logica per determinare il consumo mensile: priorità al campo 'currentConsumption'
    if (!isNaN(monthlyConsumptionInput)) {
        monthlyConsumption = monthlyConsumptionInput;
    } else if (!isNaN(annualConsumption)) {
        monthlyConsumption = annualConsumption / 12;
    } else {
        alert("Per favore, inserisci o il consumo annuo o il consumo mensile per continuare.");
        return;
    }
    
    // Controlla che i dati rimanenti siano validi
    if (isNaN(currentPrice)) {
        alert("Per favore, inserisci valori numerici validi.");
        return;
    }
    
    // Calcolo della spesa per l'offerta selezionata
    let energyCost = 0;
    const punPrice = monthlyPrices.pun[selectedMonth];
    
    switch(selectedOfferId) {
        case 'ultraGreenCasa':
            energyCost = monthlyConsumption * (punPrice + 0.0651);
            break;
        case 'ultraGreenGrandiAziende':
            energyCost = monthlyConsumption * (punPrice + 0.0662);
            break;
        case 'revolutionTax':
            const revolutionTaxSpread = userType === 'consumer' ? 0.05625 : 0.061;
            energyCost = monthlyConsumption * (punPrice + revolutionTaxSpread);
            break;
        case 'ultraGreenFix':
            energyCost = monthlyConsumption * 0.19;
            break;
        case 'ultraGreenPMI':
            energyCost = monthlyConsumption * (punPrice + 0.0695);
            break;
        default:
            energyCost = 0;
            break;
    }
    
    // 2. Costo degli OGT (Oneri Generali e Trasporto)
    const ogtCost = getOGT(userType, selectedOfferId);

    // 3. Spesa totale mensile per l'offerta
    const totalNewOfferCost = energyCost + ogtCost;

    // Calcolo del risparmio mensile
    const savingMonthly = currentPrice - totalNewOfferCost;

    // Calcolo del risparmio annuo
    let savingAnnual = 0;
    if (monthlyConsumption > 0) {
        savingAnnual = (savingMonthly / monthlyConsumption) * annualConsumption;
    }
    
    // Dati per i nomi delle offerte
    const offers = {
        ultraGreenCasa: { name: 'UltraGreen Casa' },
        ultraGreenFix: { name: 'UltraGreen Fix' },
        ultraGreenPMI: { name: 'UltraGreen PMI' },
        ultraGreenGrandiAziende: { name: 'UltraGreen Grandi Aziende' },
        revolutionTax: { name: 'Revolution Tax' }
    };

    // Definisci i colori in base al risparmio
    const savingMonthlyColor = savingMonthly > 0 ? 'green' : 'red';
    const savingAnnualColor = savingAnnual > 0 ? 'green' : 'red';

    const resultDiv = document.getElementById('result');
    resultDiv.innerHTML = `
        <h3>Risultato della simulazione per ${offers[selectedOfferId].name}</h3>
        <p>Il tuo costo mensile attuale è di <strong>${currentPrice.toFixed(2)} €</strong>.</p>
        <p>Con l'offerta <strong>${offers[selectedOfferId].name}</strong>, il tuo costo stimato è di <strong>${totalNewOfferCost.toFixed(2)} €</strong>.</p>
        <p><span style="color: ${savingMonthlyColor};">Il tuo risparmio nel mese di riferimento ammonta a <strong>${savingMonthly.toFixed(2)} €</strong>.</span></p>
        <p><span style="color: ${savingAnnualColor};">Prospetto di risparmio annuo: <strong>${savingAnnual.toFixed(2)} €</strong></span></p>
        <p>Costo fisso (OGT) mensile a POD: ${ogtCost.toFixed(2)} €</p>
    `;
    resultDiv.style.display = 'block';
});