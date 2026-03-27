// script.js - Simulatore di Risparmio

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
        '2026-02': 0.142500 // VALORE AGGIORNATO FEBBRAIO 2026
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
        '2026-02': { F1: 0.158400, F2: 0.145200, F3: 0.124100 } // VALORE AGGIORNATO FEBBRAIO 2026
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
        '2026-02': 0.395000 // VALORE AGGIORNATO FEBBRAIO 2026
    }
};

// Mappa dei nomi dei mesi per le etichette dinamiche
const monthNames = {
    '2025-07': 'Luglio 2025',
    '2025-08': 'Agosto 2025',
    '2025-09': 'Settembre 2025',
    '2025-10': 'Ottobre 2025',
    '2025-11': 'Novembre 2025',
    '2025-12': 'Dicembre 2025',
    '2026-01': 'Gennaio 2026',
    '2026-02': 'Febbraio 2026'
};

// Funzione per popolare automaticamente il secondo mese in caso di fatturazione bimestrale
function populateMonthSelection2() {
    const month1 = document.getElementById('monthSelection1').value;
    const select2 = document.getElementById('monthSelection2');
    if (!select2) return;
    
    select2.innerHTML = '';
    const keys = Object.keys(monthlyPrices.pun);
    const index1 = keys.indexOf(month1);

    if (index1 !== -1 && index1 < keys.length - 1) {
        const nextMonthKey = keys[index1 + 1];
        const option = document.createElement('option');
        option.value = nextMonthKey;
        option.textContent = monthNames[nextMonthKey];
        select2.appendChild(option);
    }
}

// Gestione visibilità campi in base alla frequenza e al tipo di utenza
function updateBimonthlyFieldsVisibility() {
    const frequency = document.getElementById('billingFrequency').value;
    const utility = document.getElementById('utilityType').value;
    const m2Container = document.getElementById('data-m2-fields');
    const note = document.getElementById('billingNote');

    if (frequency === 'bimonthly') {
        if (m2Container) m2Container.style.display = 'block';
        if (note) note.style.display = 'block';
        populateMonthSelection2();
        
        const lightM2 = document.getElementById('light-fields-m2');
        const gasM2 = document.getElementById('gas-fields-m2');
        if (lightM2) lightM2.style.display = (utility === 'light' || utility === 'lightAndGas') ? 'block' : 'none';
        if (gasM2) gasM2.style.display = (utility === 'gas' || utility === 'lightAndGas') ? 'block' : 'none';
    } else {
        if (m2Container) m2Container.style.display = 'none';
        if (note) note.style.display = 'none';
    }

    const lightM1 = document.getElementById('light-fields-m1');
    const gasM1 = document.getElementById('gas-fields-m1');
    if (lightM1) lightM1.style.display = (utility === 'light' || utility === 'lightAndGas') ? 'block' : 'none';
    if (gasM1) gasM1.style.display = (utility === 'gas' || utility === 'lightAndGas') ? 'block' : 'none';

    updateMonthLabels();
}

// Aggiorna dinamicamente i nomi dei mesi nelle label del form
function updateMonthLabels() {
    const m1Val = document.getElementById('monthSelection1').value;
    const m2Val = document.getElementById('monthSelection2') ? document.getElementById('monthSelection2').value : '';
    
    const m1Text = monthNames[m1Val] || 'Mese di Riferimento';
    const m2Text = monthNames[m2Val] || 'Mese di Riferimento 2';

    const idsM1 = ['monthNameConsumptionType1', 'monthNameLightCons1', 'monthNameLightConsF1_1', 'monthNameLightConsF2_1', 'monthNameLightConsF3_1', 'monthNameLightPrice1', 'monthNameGasCons1', 'monthNameGasPrice1'];
    idsM1.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.textContent = m1Text;
    });

    const idsM2 = ['monthNameConsumptionType2', 'monthNameLightCons2', 'monthNameLightConsF1_2', 'monthNameLightConsF2_2', 'monthNameLightConsF3_2', 'monthNameLightPrice2', 'monthNameGasCons2', 'monthNameGasPrice2'];
    idsM2.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.textContent = m2Text;
    });
}

// Gestione visibilità campi tra Monorario e Fasce
function updateLightConsumptionFieldsVisibility(suffix) {
    const typeEl = document.getElementById(`consumptionType${suffix}`);
    if (!typeEl) return;
    const type = typeEl.value;
    const mono = document.getElementById(`light-monorario-fields-m${suffix}`);
    const fasce = document.getElementById(`light-fasce-fields-m${suffix}`);
    if (mono) mono.style.display = (type === 'monorario') ? 'block' : 'none';
    if (fasce) fasce.style.display = (type === 'fasce') ? 'block' : 'none';
}

// Logica di calcolo del risparmio per singolo mese
function calculateMonthlySaving(monthKey, isLight, isGas, suffix) {
    let currentCost = 0;
    let newCost = 0;
    const offer = document.getElementById('selectedOffer').value;

    if (isLight) {
        const type = document.getElementById(`consumptionType${suffix}`).value;
        const priceMateria = parseFloat(document.getElementById(`currentPriceLight${suffix}`).value) || 0;
        const pcv = (suffix === '1') ? (parseFloat(document.getElementById('currentPCVLight1').value) || 0) : 0;
        
        currentCost = priceMateria + pcv;

        let punValue = 0;
        let consumption = 0;

        if (type === 'monorario') {
            consumption = parseFloat(document.getElementById(`currentConsumptionLight${suffix}`).value) || 0;
            punValue = monthlyPrices.pun[monthKey];
        } else {
            const f1 = parseFloat(document.getElementById(`currentConsumptionF1_${suffix}`).value) || 0;
            const f2 = parseFloat(document.getElementById(`currentConsumptionF2_${suffix}`).value) || 0;
            const f3 = parseFloat(document.getElementById(`currentConsumptionF3_${suffix}`).value) || 0;
            consumption = f1 + f2 + f3;
            const punF = monthlyPrices.punFasce[monthKey];
            punValue = (consumption > 0) ? ((f1 * punF.F1) + (f2 * punF.F2) + (f3 * punF.F3)) / consumption : 0;
        }

        let spread = 0.0551; 
        let fixLuce = 12.0;

        if (offer === 'ultraGreenFix') { spread = 0.035; fixLuce = 13.0; }
        else if (offer === 'ultraGreenPMI') { spread = 0.0215; fixLuce = 15.0; }
        else if (offer === 'ultraGreenGrandiAziende') { spread = 0.015; fixLuce = 30.0; }
        else if (offer === 'revolutionTax') { spread = 0.025; fixLuce = 10.0; }

        newCost = (consumption * (punValue + spread)) + fixLuce;
    }

    if (isGas) {
        const priceMateriaGas = parseFloat(document.getElementById(`currentPriceGas${suffix}`).value) || 0;
        const pcvGas = (suffix === '1') ? (parseFloat(document.getElementById('currentPCVGas1').value) || 0) : 0;
        
        currentCost += (priceMateriaGas + pcvGas);

        const consumptionGas = parseFloat(document.getElementById(`currentConsumptionGas${suffix}`).value) || 0;
        const psvValue = monthlyPrices.psv[monthKey];

        let spreadGas = 0.15;
        let fixGas = 12.0;

        if (offer === 'ultraGreenFix') { spreadGas = 0.12; fixGas = 13.0; }
        else if (offer === 'ultraGreenPMI') { spreadGas = 0.10; fixGas = 15.0; }
        
        newCost += (consumptionGas * (psvValue + spreadGas)) + fixGas;
    }

    return { current: currentCost, new: newCost };
}

// Gestore invio form
document.getElementById('calculator-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const clientName = document.getElementById('clientName').value;
    const utility = document.getElementById('utilityType').value;
    const isLight = (utility === 'light' || utility === 'lightAndGas');
    const isGas = (utility === 'gas' || utility === 'lightAndGas');
    const frequency = document.getElementById('billingFrequency').value;

    const m1Key = document.getElementById('monthSelection1').value;
    let res = calculateMonthlySaving(m1Key, isLight, isGas, '1');

    if (frequency === 'bimonthly') {
        const m2Key = document.getElementById('monthSelection2').value;
        if (m2Key) {
            let res2 = calculateMonthlySaving(m2Key, isLight, isGas, '2');
            res.current += res2.current;
            res.new += res2.new;
        }
    }

    const saving = res.current - res.new;
    const savingPercent = (res.current > 0) ? (saving / res.current) * 100 : 0;

    const resultDiv = document.getElementById('result');
    resultDiv.innerHTML = `
        <h3>Risultato per ${clientName}</h3>
        <p>Spesa Attuale: <strong>€${res.current.toFixed(2)}</strong></p>
        <p>Spesa con Nuova Offerta: <strong>€${res.new.toFixed(2)}</strong></p>
        <h2 style="color: #2e7d32;">Risparmio: €${saving.toFixed(2)} (${savingPercent.toFixed(1)}%)</h2>
    `;
    
    document.getElementById('export-actions').style.display = 'block';
});

// Funzione per l'esportazione (PDF o Immagine)
async function exportResult(type) {
    const element = document.querySelector('.container');
    const actions = document.getElementById('export-actions');
    actions.style.display = 'none';

    try {
        const canvas = await html2canvas(element);
        const clientName = document.getElementById('clientName').value || 'Cliente';
        
        if (type === 'pdf') {
            const { jsPDF } = window.jspdf;
            const pdf = new jsPDF('p', 'mm', 'a4');
            const imgData = canvas.toDataURL('image/png');
            const imgProps = pdf.getImageProperties(imgData);
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
            pdf.save(`Risparmio_${clientName}.pdf`);
        } else {
            const link = document.createElement('a');
            link.download = `Risparmio_${clientName}.png`;
            link.href = canvas.toDataURL();
            link.click();
        }
    } catch (err) {
        console.error("Errore esportazione:", err);
    }
    actions.style.display = 'block';
}

// Inizializzazione Listeners al caricamento della pagina
document.addEventListener('DOMContentLoaded', () => {
    updateBimonthlyFieldsVisibility();

    document.getElementById('billingFrequency').addEventListener('change', updateBimonthlyFieldsVisibility);
    document.getElementById('utilityType').addEventListener('change', updateBimonthlyFieldsVisibility);
    document.getElementById('consumptionType1').addEventListener('change', () => updateLightConsumptionFieldsVisibility('1'));
    document.getElementById('consumptionType2').addEventListener('change', () => updateLightConsumptionFieldsVisibility('2'));
    
    document.getElementById('monthSelection1').addEventListener('change', () => {
        populateMonthSelection2();
        updateMonthLabels();
    });

    const exportPdfBtn = document.getElementById('exportPdfBtn');
    const exportImgBtn = document.getElementById('exportImgBtn');
    if (exportPdfBtn) exportPdfBtn.addEventListener('click', () => exportResult('pdf'));
    if (exportImgBtn) exportImgBtn.addEventListener('click', () => exportResult('img'));
});
