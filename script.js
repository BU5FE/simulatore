// Database "statico" dei valori del PUN per mese
// AGGIORNA QUESTI VALORI OGNI MESE CON I DATI REALI DEL GME
const datiPUN = {
    '2025-01': 0.143030,
    '2025-02': 0.150360,
    '2025-03': 0.120550,
    '2025-04': 0.099850,
    '2025-05': 0.093580,
    '2025-06': 0.111780,
    '2025-07': 0.113130,
    '2025-08': 0.108790
};

// Nuovi costi delle offerte
const costiOfferte = {
    'UltraGreenCasa': 0.05,
    'UltraGreenPMI': 0.04,
    'UltraGreenFIX': 0.18,
    'UltraGreenGrandiAziende': 0.02
};

// Funzione per calcolare il valore OGT
function getOGT(tipoCliente, offerta) {
    if (tipoCliente === 'consumer') {
        return 8.95;
    } else if (tipoCliente === 'business') {
        if (offerta === 'UltraGreenFIX') {
            return 14.95;
        } else if (offerta === 'UltraGreenPMI' || offerta === 'UltraGreenGrandiAziende') {
            return 19.95;
        }
    }
    return 0; // Valore di default se non ci sono corrispondenze
}

// Event listener per aggiornare il valore OGT dinamicamente
document.getElementById('simulazioneForm').addEventListener('change', function() {
    const tipoCliente = document.getElementById('tipoCliente').value;
    const selettoreOfferta = document.getElementById('selettoreOfferta').value;
    const ogtContainer = document.getElementById('OGT-container');
    const ogtValueSpan = document.getElementById('OGT-value');

    if (tipoCliente && selettoreOfferta) {
        const ogt = getOGT(tipoCliente, selettoreOfferta);
        ogtValueSpan.textContent = ogt.toFixed(2);
        ogtContainer.style.display = 'block';
    } else {
        ogtContainer.style.display = 'none';
    }
});


document.getElementById('simulazioneForm').addEventListener('submit', function(event) {
    event.preventDefault();

    // Dati attuali
    const tipoCliente = document.getElementById('tipoCliente').value;
    const mese = document.getElementById('meseRiferimento').value;
    const spesaMateriaEnergiaMensile = parseFloat(document.getElementById('spesaMateriaEnergia').value);
    const consumoLuceMensile = parseFloat(document.getElementById('consumoLuceAttuale').value);
    const consumoAnnuale = parseFloat(document.getElementById('consumoAnnuale').value);
    const offertaScelta = document.getElementById('selettoreOfferta').value;
    
    // Validazione dei campi
    if (isNaN(consumoAnnuale) || consumoAnnuale <= 0) {
        alert("Inserisci un consumo annuale valido per calcolare il risparmio stimato.");
        return;
    }
    
    if (isNaN(consumoLuceMensile) || consumoLuceMensile <= 0) {
        alert("Inserisci il consumo del mese di riferimento per calcolare la spesa mensile.");
        return;
    }

    let prezzoEnergia;
    
    // Calcolo del costo della materia energia per kWh in base all'offerta
    if (offertaScelta === "UltraGreenFIX") {
        prezzoEnergia = costiOfferte['UltraGreenFIX'];
    } else {
        const punDelMese = datiPUN[mese];
        
        if (punDelMese === undefined) {
            alert("Dati PUN non disponibili per il mese selezionato. Si prega di aggiornare il codice.");
            return;
        }
        
        const spreadOfferta = costiOfferte[offertaScelta];
        prezzoEnergia = punDelMese + spreadOfferta;
    }
    
    // Calcolo del costo OGT
    const costoOGT = getOGT(tipoCliente, offertaScelta);
    
    // --- Calcolo dei risparmi ---
    
    // Calcolo della spesa del mese simulata
    const spesaSimulataMensile = (consumoLuceMensile * prezzoEnergia) + costoOGT;
    
    // Calcolo del risparmio del mese
    const risparmioMensile = spesaMateriaEnergiaMensile - spesaSimulataMensile;
    
    // Calcolo della spesa annuale simulata (materia energia + OGT)
    const spesaSimulataAnnuale = (consumoAnnuale * prezzoEnergia) + (costoOGT * 12);

    // Calcolo della spesa annuale attuale (estrapolazione dal dato mensile)
    const spesaAttualeAnnuale = spesaMateriaEnergiaMensile * 12;

    // Calcolo del risparmio annuale
    const risparmioAnnuale = spesaAttualeAnnuale - spesaSimulataAnnuale;

    // Mostra i risultati
    document.getElementById('spesaSimulata').textContent = `Spesa del mese simulata: ${spesaSimulataMensile.toFixed(2)} €`;
    document.getElementById('risparmioStimato').innerHTML = `
        <p>Risparmio mensile stimato: <strong>${risparmioMensile.toFixed(2)} €</strong></p>
        <p>Risparmio annuale stimato: <strong>${risparmioAnnuale.toFixed(2)} €</strong></p>
    `;
});