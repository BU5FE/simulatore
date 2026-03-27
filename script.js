// script.js - VERSIONE DEFINITIVA (Febbraio 2026)
// Ricostruito su logica originale e screenshot Luce/Gas

const monthlyPrices = {
    pun: {
        '2025-07': 0.165, '2025-08': 0.17, '2025-09': 0.109080, '2025-10': 0.111040,
        '2025-11': 0.117090, '2025-12': 0.115490, '2026-01': 0.132660, 
        '2026-02': 0.142500 // AGGIORNATO FEBBRAIO 2026
    },
    punFasce: {
        '2025-07': { F1: 0.108960, F2: 0.127100, F3: 0.108490 },
        '2025-08': { F1: 0.105580, F2: 0.117970, F3: 0.106040 },
        '2025-09': { F1: 0.109590, F2: 0.120930, F3: 0.101880 },
        '2025-10': { F1: 0.117830, F2: 0.121660, F3: 0.099480 },
        '2025-11': { F1: 0.129590, F2: 0.124020, F3: 0.105510 },
        '2025-12': { F1: 0.130090, F2: 0.119980, F3: 0.104520 },
        '2026-01': { F1: 0.151261, F2: 0.137405, F3: 0.118292 },
        '2026-02': { F1: 0.158400, F2: 0.145200, F3: 0.124100 } // AGGIORNATO FEBBRAIO 2026
    },
    psv: {
        '2025-07': 0.388520, '2025-08': 0.377180, '2025-09': 0.369520, '2025-10': 0.353959,
        '2025-11': 0.345300, '2025-12': 0.324670, '2026-01': 0.404227, 
        '2026-02': 0.395000 // AGGIORNATO FEBBRAIO 2026
    }
};

// --- FUNZIONI DI SUPPORTO ---
function getOGTLuce(u, o) { 
    if (u === 'consumer') return 8.95;
    const r = { revolutionTax: 14.94, ultraGreenFix: 14.95, ultraGreenPMI: 19.95, ultraGreenGrandiAziende: 19.95 };
    return r[o] || 0; 
}

function getOGTGas(u, o) { 
    if (u === 'consumer' || o === 'ultraGreenCasa') return 8.95;
    const r = { ultraGreenFix: 14.95, revolutionTax: 14.95, ultraGreenPMI: 19.95, ultraGreenGrandiAziende: 19.95 };
    return r[o] || 8.95; 
}

function getSelectedMonthName(id) {
    const s = document.getElementById(id);
    return s && s.options[s.selectedIndex] ? s.options[s.selectedIndex].text : '';
}

// --- LOGICA DI CALCOLO E OUTPUT ---
document.getElementById('calculator-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const clientName = document.getElementById('clientName').value.trim();
    const utility = document.getElementById('utilityType').value;
    const offerId = document.getElementById('selectedOffer').value;
    const freq = document.getElementById('billingFrequency').value;
    const isBim = freq === 'bimonthly';
    const userType = document.getElementById('userType').value;

    const m1Value = document.getElementById('monthSelection1').value;
    const m1Name = getSelectedMonthName('monthSelection1');
    const m2Name = isBim ? getSelectedMonthName('monthSelection2') : '';

    let totalCurrent = 0, totalNew = 0, detailHTML = "";

    // SEZIONE LUCE (Basata su Screenshot Luca Cortonicchi)
    if (utility.includes('light')) {
        const pcvL = parseFloat(document.getElementById('currentPCVLight1').value) || 0;
        const spesaMateriaL = parseFloat(document.getElementById('currentPriceLight1').value) || 0;
        const consL = parseFloat(document.getElementById('currentConsumptionLight1').value) || 0;
        const ogtL = getOGTLuce(userType, offerId);
        
        const currentTotalL = spesaMateriaL + pcvL;
        const pun = monthlyPrices.pun[m1Value];
        
        let newEnergyL = 0;
        if (offerId === 'ultraGreenFix') newEnergyL = consL * 0.16;
        else newEnergyL = consL * (pun + 0.0551); // Spread standard

        const newTotalL = newEnergyL + (ogtL * (isBim ? 2 : 1));
        const savingL = currentTotalL - newTotalL;
        
        totalCurrent += currentTotalL;
        totalNew += newTotalL;

        detailHTML += `
            <h3 style="margin-top:20px;">Dettagli LUCE</h3>
            <p>Dettagli Luce ${isBim ? 'Bimestrale ('+m1Name+' e '+m2Name+')' : 'Mensile ('+m1Name+')'}</p>
            <p>Consumo Luce Totale ${isBim ? 'Bimestre' : 'Mese'}: <strong>${consL} kWh</strong></p>
            <p>Costo Totale Attuale ${isBim ? 'Bimestre' : 'Mese'} (Spesa Materia + PCV/CF): <strong>${currentTotalL.toFixed(2)} Euro</strong>.</p>
            <p>Spesa Materia Energia con la nuova offerta: <strong>${newTotalL.toFixed(2)} Euro</strong>.</p>
            <p style="color:green;">Risparmio Luce: <strong>${savingL.toFixed(2)} Euro</strong>.</p>
            <p style="font-style:italic; font-size:0.9em;">N.B. Nella simulazione sono inclusi i Costi fissi (OGT) mensili a POD (${ogtL.toFixed(2)} Euro/Mese).</p>
            <hr style="border-top: 1px solid #ccc;">
        `;
    }

    // SEZIONE GAS (Basata su Screenshot Gas)
    if (utility.includes('gas')) {
        const pcvG = parseFloat(document.getElementById('currentPCVGas1').value) || 0;
        const spesaMateriaG = parseFloat(document.getElementById('currentPriceGas1').value) || 0;
        const consG = parseFloat(document.getElementById('currentConsumptionGas1').value) || 0;
        const ogtG = getOGTGas(userType, offerId);

        const currentTotalG = spesaMateriaG + pcvG;
        const psv = monthlyPrices.psv[m1Value];

        let newEnergyG = 0;
        if (offerId === 'ultraGreenFix') newEnergyG = consG * 0.607;
        else newEnergyG = consG * (psv + 0.305); // Spread standard

        const newTotalG = newEnergyG + (ogtG * (isBim ? 2 : 1));
        const savingG = currentTotalG - newTotalG;

        totalCurrent += currentTotalG;
        totalNew += newTotalG;

        detailHTML += `
            <h3 style="margin-top:20px;">Dettagli GAS</h3>
            <p>Dettagli Gas ${isBim ? 'Bimestrale ('+m1Name+' e '+m2Name+')' : 'Mensile ('+m1Name+')'}</p>
            <p>Consumo Gas Totale ${isBim ? 'Bimestre' : 'Mese'}: <strong>${consG} smc</strong></p>
            <p>Costo Totale Attuale ${isBim ? 'Bimestre' : 'Mese'} (Spesa Materia + PCV/CF): <strong>${currentTotalG.toFixed(2)} Euro</strong>.</p>
            <p>Spesa Materia Gas con la nuova offerta: <strong>${newTotalG.toFixed(2)} Euro</strong>.</p>
            <p style="color:green;">Risparmio Gas: <strong>${savingG.toFixed(2)} Euro</strong>.</p>
            <p style="font-style:italic; font-size:0.9em;">N.B. Nella simulazione sono inclusi i Costi fissi (OGT) mensili a PDR (${ogtG.toFixed(2)} Euro/Mese).</p>
            <hr style="border-top: 1px solid #ccc;">
        `;
    }

    const finalSaving = totalCurrent - totalNew;
    const monthlySaving = finalSaving / (isBim ? 2 : 1);

    const output = `
        <div id="result-content" style="padding:20px; font-family:Arial, sans-serif; color:#333; background: white; border: 1px solid #ddd; border-radius: 8px;">
            <p style="text-align:right;"><strong>Scadenza Proposta: 31/03/2026</strong></p>
            <h2 style="color:#2e7d32; border-bottom:2px solid #4caf50; padding-bottom:10px;">Cliente: ${clientName}</h2>
            <h3>Simulazione con ${offerId.replace('ultraGreen', 'UltraGreen ')}</h3>
            ${detailHTML}
            <div style="margin-top:20px;">
                <h3>Riepilogo Totale</h3>
                <p>Il tuo costo ${isBim ? 'bimestrale' : 'mensile'} attuale e' di <strong>${totalCurrent.toFixed(2)} Euro</strong>.</p>
                <p>Con l'offerta <strong>${offerId}</strong>, il tuo costo ${isBim ? 'bimestrale' : 'mensile'} e' di <strong>${totalNew.toFixed(2)} Euro</strong>.</p>
                <p style="color:green; font-size:1.2em;"><strong>Risparmio Mensile: ${monthlySaving.toFixed(2)} Euro</strong>.</p>
                <p style="color:green; font-size:1.2em;"><strong>Prospetto Risparmio Annuo: ${(monthlySaving * 12).toFixed(2)} Euro</strong>.</p>
            </div>
        </div>
    `;

    document.getElementById('result').innerHTML = output;
    document.getElementById('result').style.display = 'block';
    document.getElementById('export-actions').style.display = 'block';
    window.scrollTo(0,0);
});

// Listener per i menu a tendina
function updateMonthLabels() {
    // Funzione vuota o per aggiornare etichette se necessario
}

document.getElementById('billingFrequency').addEventListener('change', updateMonthLabels);
document.getElementById('utilityType').addEventListener('change', updateMonthLabels);
