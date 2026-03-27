// script.js - VERSIONE RECOVERY TOTALE (Febbraio 2026)
// Logica Bimestrale/Mensile + Luce/Gas + Grafica Originale

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

// --- FUNZIONI DI VISIBILITÀ E INTERFACCIA ---
function updateVisibility() {
    const utility = document.getElementById('utilityType').value;
    const freq = document.getElementById('billingFrequency').value;
    const isBim = (freq === 'bimonthly');

    const showLight = (utility === 'light' || utility === 'lightAndGas');
    const showGas = (utility === 'gas' || utility === 'lightAndGas');

    // Mese 1
    document.getElementById('light-fields-m1').style.display = showLight ? 'block' : 'none';
    document.getElementById('gas-fields-m1').style.display = showGas ? 'block' : 'none';

    // Mese 2
    const m2Container = document.getElementById('data-m2-fields');
    if (m2Container) {
        m2Container.style.display = isBim ? 'block' : 'none';
        document.getElementById('light-fields-m2').style.display = (isBim && showLight) ? 'block' : 'none';
        document.getElementById('gas-fields-m2').style.display = (isBim && showGas) ? 'block' : 'none';
    }

    // PCV (Sempre visibili se la utility è attiva)
    document.getElementById('pcv-light-m1-container').style.display = showLight ? 'block' : 'none';
    document.getElementById('pcv-gas-m1-container').style.display = showGas ? 'block' : 'none';
}

function getOGT(u, o, type) {
    if (u === 'consumer') return 8.95;
    const rates = { revolutionTax: 14.94, ultraGreenFix: 14.95, ultraGreenPMI: 19.95, ultraGreenGrandiAziende: 19.95 };
    return rates[o] || (type === 'light' ? 0 : 8.95);
}

// --- LOGICA DI CALCOLO ---
document.getElementById('calculator-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const clientName = document.getElementById('clientName').value.trim();
    const utility = document.getElementById('utilityType').value;
    const offerId = document.getElementById('selectedOffer').value;
    const freq = document.getElementById('billingFrequency').value;
    const isBim = (freq === 'bimonthly');
    const userType = document.getElementById('userType').value;

    let totalCurrent = 0, totalNew = 0, detailHTML = "";

    // Funzione interna per calcolare il singolo mese
    function calcMese(suffix, monthKey) {
        let currentMese = 0, newMese = 0, htmlMese = "";

        if (utility.includes('light')) {
            const cons = parseFloat(document.getElementById('currentConsumptionLight' + suffix).value) || 0;
            const spesa = parseFloat(document.getElementById('currentPriceLight' + suffix).value) || 0;
            const pcv = (suffix === '1') ? (parseFloat(document.getElementById('currentPCVLight1').value) || 0) : 0;
            const ogt = getOGT(userType, offerId, 'light');
            
            const pun = monthlyPrices.pun[monthKey];
            let nL = (cons * (pun + 0.0551)) + ogt;
            if(offerId === 'ultraGreenFix') nL = (cons * 0.16) + ogt;

            currentMese += (spesa + pcv);
            newMese += nL;
            htmlMese += `<p>Luce: Consumo <strong>${cons} kWh</strong> | Attuale: ${spesa+pcv}€ | Nuova: ${nL.toFixed(2)}€</p>`;
        }

        if (utility.includes('gas')) {
            const consG = parseFloat(document.getElementById('currentConsumptionGas' + suffix).value) || 0;
            const spesaG = parseFloat(document.getElementById('currentPriceGas' + suffix).value) || 0;
            const pcvG = (suffix === '1') ? (parseFloat(document.getElementById('currentPCVGas1').value) || 0) : 0;
            const ogtG = getOGT(userType, offerId, 'gas');

            const psv = monthlyPrices.psv[monthKey];
            let nG = (consG * (psv + 0.305)) + ogtG;
            if(offerId === 'ultraGreenFix') nG = (consG * 0.607) + ogtG;

            currentMese += (spesaG + pcvG);
            newMese += nG;
            htmlMese += `<p>Gas: Consumo <strong>${consG} smc</strong> | Attuale: ${spesaG+pcvG}€ | Nuova: ${nG.toFixed(2)}€</p>`;
        }
        return { currentMese, newMese, htmlMese };
    }

    // Calcolo Mese 1
    const res1 = calcMese('1', document.getElementById('monthSelection1').value);
    totalCurrent += res1.currentMese;
    totalNew += res1.newMese;
    detailHTML += `<h4>Dettagli Mese 1:</h4>${res1.htmlMese}`;

    // Calcolo Mese 2 (se bimestrale)
    if (isBim) {
        const res2 = calcMese('2', document.getElementById('monthSelection2').value);
        totalCurrent += res2.currentMese;
        totalNew += res2.newMese;
        detailHTML += `<hr><h4>Dettagli Mese 2:</h4>${res2.htmlMese}`;
    }

    const diff = totalCurrent - totalNew;
    const savingMonthly = isBim ? diff / 2 : diff;

    document.getElementById('result').innerHTML = `
        <div style="padding:20px; background:white; border:1px solid #ddd; border-radius:8px; font-family:Arial;">
            <p style="text-align:right;"><strong>Scadenza: 31/03/2026</strong></p>
            <h2 style="color:#2e7d32; border-bottom:2px solid #4caf50;">Cliente: ${clientName}</h2>
            ${detailHTML}
            <div style="margin-top:20px; background:#f9f9f9; padding:15px; border-radius:5px;">
                <h3>Riepilogo ${isBim ? 'Bimestrale' : 'Mensile'}</h3>
                <p>Costo Attuale: ${totalCurrent.toFixed(2)}€</p>
                <p>Nuova Offerta: ${totalNew.toFixed(2)}€</p>
                <p style="color:green; font-size:1.2em;"><strong>Risparmio Mensile: ${savingMonthly.toFixed(2)}€</strong></p>
                <p style="color:green; font-size:1.2em;"><strong>Risparmio Annuo: ${(savingMonthly * 12).toFixed(2)}€</strong></p>
            </div>
        </div>`;
    document.getElementById('result').style.display = 'block';
});

// Init
document.getElementById('utilityType').addEventListener('change', updateVisibility);
document.getElementById('billingFrequency').addEventListener('change', updateVisibility);
document.addEventListener('DOMContentLoaded', updateVisibility);
