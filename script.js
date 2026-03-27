// script.js - VERSIONE DEFINITIVA FEBBRAIO 2026
// Include: Grafica originale, Prezzi aggiornati e Fix visibilità Luce+Gas

const monthlyPrices = {
    pun: {
        '2025-07': 0.165, '2025-08': 0.17, '2025-09': 0.109080, '2025-10': 0.111040,
        '2025-11': 0.117090, '2025-12': 0.115490, '2026-01': 0.132660, '2026-02': 0.142500
    },
    punFasce: {
        '2025-07': { F1: 0.108960, F2: 0.127100, F3: 0.108490 },
        '2025-08': { F1: 0.105580, F2: 0.117970, F3: 0.106040 },
        '2025-09': { F1: 0.109590, F2: 0.120930, F3: 0.101880 },
        '2025-10': { F1: 0.117830, F2: 0.121660, F3: 0.099480 },
        '2025-11': { F1: 0.129590, F2: 0.124020, F3: 0.105510 },
        '2025-12': { F1: 0.130090, F2: 0.119980, F3: 0.104520 },
        '2026-01': { F1: 0.151261, F2: 0.137405, F3: 0.118292 },
        '2026-02': { F1: 0.158400, F2: 0.145200, F3: 0.124100 }
    },
    psv: {
        '2025-07': 0.388520, '2025-08': 0.377180, '2025-09': 0.369520, '2025-10': 0.353959,
        '2025-11': 0.345300, '2025-12': 0.324670, '2026-01': 0.404227, '2026-02': 0.395000
    }
};

// --- FUNZIONI DI VISIBILITÀ ---
function updateFieldVisibility() {
    const utility = document.getElementById('utilityType').value;
    const showLight = (utility === 'light' || utility === 'lightAndGas');
    const showGas = (utility === 'gas' || utility === 'lightAndGas');

    document.getElementById('light-fields-m1').style.display = showLight ? 'block' : 'none';
    document.getElementById('gas-fields-m1').style.display = showGas ? 'block' : 'none';
    
    // Mostra/Nascondi PCV
    if(document.getElementById('pcv-light-m1-container')) 
        document.getElementById('pcv-light-m1-container').style.display = showLight ? 'block' : 'none';
    if(document.getElementById('pcv-gas-m1-container')) 
        document.getElementById('pcv-gas-m1-container').style.display = showGas ? 'block' : 'none';
}

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

// --- LOGICA DI CALCOLO ---
document.getElementById('calculator-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const clientName = document.getElementById('clientName').value.trim();
    const utility = document.getElementById('utilityType').value;
    const offerId = document.getElementById('selectedOffer').value;
    const userType = document.getElementById('userType').value;
    const m1Value = document.getElementById('monthSelection1').value;
    const m1Name = document.getElementById('monthSelection1').options[document.getElementById('monthSelection1').selectedIndex].text;

    let totalCurrent = 0, totalNew = 0, detailHTML = "";

    // LUCE
    if (utility === 'light' || utility === 'lightAndGas') {
        const pcvL = parseFloat(document.getElementById('currentPCVLight1').value) || 0;
        const spesaL = parseFloat(document.getElementById('currentPriceLight1').value) || 0;
        const consL = parseFloat(document.getElementById('currentConsumptionLight1').value) || 0;
        const ogtL = getOGTLuce(userType, offerId);
        
        const currentL = spesaL + pcvL;
        const pun = monthlyPrices.pun[m1Value];
        let newL = (consL * (pun + 0.0551)) + ogtL;
        if(offerId === 'ultraGreenFix') newL = (consL * 0.16) + ogtL;

        detailHTML += `
            <h3 style="margin-top:20px;">Dettagli LUCE</h3>
            <p>Dettagli Luce Mensile (${m1Name})</p>
            <p>Consumo Luce: <strong>${consL} kWh</strong></p>
            <p>Costo Attuale (Materia + PCV): <strong>${currentL.toFixed(2)} Euro</strong></p>
            <p>Nuova Offerta: <strong>${newL.toFixed(2)} Euro</strong></p>
            <p style="color:green;">Risparmio Luce: <strong>${(currentL - newL).toFixed(2)} Euro</strong></p>
            <p style="font-style:italic; font-size:0.9em;">N.B. Inclusi OGT di ${ogtL} Euro/Mese</p><hr>`;
        totalCurrent += currentL; totalNew += newL;
    }

    // GAS
    if (utility === 'gas' || utility === 'lightAndGas') {
        const pcvG = parseFloat(document.getElementById('currentPCVGas1').value) || 0;
        const spesaG = parseFloat(document.getElementById('currentPriceGas1').value) || 0;
        const consG = parseFloat(document.getElementById('currentConsumptionGas1').value) || 0;
        const ogtG = getOGTGas(userType, offerId);

        const currentG = spesaG + pcvG;
        const psv = monthlyPrices.psv[m1Value];
        let newG = (consG * (psv + 0.305)) + ogtG;
        if(offerId === 'ultraGreenFix') newG = (consG * 0.607) + ogtG;

        detailHTML += `
            <h3 style="margin-top:20px;">Dettagli GAS</h3>
            <p>Dettagli Gas Mensile (${m1Name})</p>
            <p>Consumo Gas: <strong>${consG} smc</strong></p>
            <p>Costo Attuale (Materia + PCV): <strong>${currentG.toFixed(2)} Euro</strong></p>
            <p>Nuova Offerta: <strong>${newG.toFixed(2)} Euro</strong></p>
            <p style="color:green;">Risparmio Gas: <strong>${(currentG - newG).toFixed(2)} Euro</strong></p>
            <p style="font-style:italic; font-size:0.9em;">N.B. Inclusi OGT di ${ogtG} Euro/Mese</p><hr>`;
        totalCurrent += currentG; totalNew += newG;
    }

    // OUTPUT FINALE
    const finalSaving = totalCurrent - totalNew;
    document.getElementById('result').innerHTML = `
        <div id="result-content" style="padding:20px; font-family:Arial; background:white; border:1px solid #ddd; border-radius:8px;">
            <p style="text-align:right;"><strong>Scadenza Proposta: 31/03/2026</strong></p>
            <h2 style="color:#2e7d32; border-bottom:2px solid #4caf50; padding-bottom:10px;">Cliente: ${clientName}</h2>
            ${detailHTML}
            <div style="margin-top:20px;">
                <h3>Riepilogo Totale</h3>
                <p>Costo attuale: <strong>${totalCurrent.toFixed(2)} Euro</strong></p>
                <p>Nuova offerta: <strong>${totalNew.toFixed(2)} Euro</strong></p>
                <p style="color:green; font-size:1.2em;"><strong>Risparmio Mensile: ${finalSaving.toFixed(2)} Euro</strong></p>
                <p style="color:green; font-size:1.2em;"><strong>Risparmio Annuo: ${(finalSaving * 12).toFixed(2)} Euro</strong></p>
            </div>
        </div>`;
    document.getElementById('result').style.display = 'block';
    document.getElementById('export-actions').style.display = 'block';
});

// Event Listeners
document.getElementById('utilityType').addEventListener('change', updateFieldVisibility);
document.addEventListener('DOMContentLoaded', updateFieldVisibility);
