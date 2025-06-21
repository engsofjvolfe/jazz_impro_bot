/**
 * Copyright 2025 Jeanco Volfe
 * Licensed under the Apache License, Version 2.0
 * See LICENSE file in the project root for full license information.
 */

const TelegramBot = require('node-telegram-bot-api');
const token = 'telegram_token'
const bot = new TelegramBot(token, { polling: true });


// VARIABLES FOR CHORDS
let flat = ["C", "Db", "D", "Eb", "E", "F", "Gb", "G", "Ab", "A", "Bb", "B"]
let sharp = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"]
let sharpFlatChoice

let tonic = ""
let third = ""
let fifth = ""
// let seventh = ""
// let chordNotes = ""
// let positionOfTonic = 0

let notation
let type 
let sharpFlat 

let chatId

bot.once('message', (msg) => {
  chatId = msg.chat.id;
  bot.sendMessage(chatId, 'Welcome to the Best Chord Choice Bot. Type "/start"');
});


// Especifica o comando que o bot irá responder
bot.onText(/\/start/, (msg) => {
  chatId = msg.chat.id;
  bot.sendMessage(chatId, `Por favor, digite o número correspondente à opção de cifra desejada.
  Outras características do acorde serão posteriormente solicitadas.

1. C
2. D 
3. E 
4. F  
5. G 
6. A  
7. B`).then(() => {
    askChordLetter(chatId);
  });
});

function askChordLetter(chatId) {
  bot.once('message', (response) => {
    const chordOptions = ["C", "D", "E", "F", "G", "A", "B"];
    const notationIndex = parseInt(response.text.trim()) - 1;
    if (isNaN(notationIndex) || notationIndex < 0 || notationIndex > 6) {
      bot.sendMessage(chatId, `Por favor, digite um número válido dentro das opções (1 a 7)`);
      askChordLetter(chatId);
    } else {
      notation = chordOptions[notationIndex];
      bot.sendMessage(chatId, `Por favor, digite o número correspondente à opção de tipo de acorde:

1. Maior (M)
2. Menor (m)
3. Dominante (7)
4. Meio diminuto (-7b5)
5. Diminuto (dim)?`).then(() => {
        askChordType(chatId, notation);
      });
    }
  });
}
 
function askChordType(chatId, notation) {
  bot.once('message', (response) => {
    const typeOptions = ["M", "m", "7", "-7b5", "dim"]
    const typeIndex = parseInt(response.text.trim()) - 1
    if (isNaN(typeIndex) || typeIndex < 0 || typeIndex > 4) {
      bot.sendMessage(chatId, `Por favor, digite um número válido dentro das opções (1 a 5)`);
      askChordLetter(chatId);
    } else {
      type = typeOptions[typeIndex]
      bot.sendMessage(chatId, `ACIDENTE NO ACORDE
      Se o acorde que você escolheu é natural, tecle 3
      Se o acorde que você escolheu é bemol, tecle 1
      Se o acorde que você escolheu é sustenido, tecle 2

1 - b
2 - #
3 - sem acidentes`).then(() => {
        askScaleAccident(chatId, notation, type);
      });
    }
  });
}

function askScaleAccident(chatId, notation, type) {
  bot.once('message', (response) => {
    const accidentOptions = ["b", "#", ""]
    const accidentIndex = parseInt(response.text.trim()) - 1
    if (isNaN(accidentIndex) || accidentIndex < 0 || accidentIndex > 2) {
      bot.sendMessage(chatId, `Por favor, digite um número válido entre as opções (1 a 3)`);
      askScaleAccident(chatId, notation, type);
    } else {
      let scaleAccident = accidentOptions[accidentIndex]
      chordAccident(chatId, notation, type, scaleAccident)
  }
});
}

// bot.on('polling_error', (error) => {
//   console.log(error);
// });

function chordAccident(chatId, notation, type, scaleAccident) {
  let scaleAccidentChoice
  let chordAccident

  if (scaleAccident == "" && type == "m") {
    chordAccident = "";
    scaleAccidentChoice = flat
    console.log("FUNCAO QUE VERIFICA SE O ACORDE É MENOR E SCALEACCIDENT VAZIO")
  }

  if(scaleAccident == ""){
    chordAccident = ""
    scaleAccidentChoice = sharp
  }

  if (scaleAccident == "b") {
    chordAccident = "b";
    scaleAccidentChoice = flat
    console.log("FUNÇAO QUE VERIFICA SE O SCALEACCIDENT É BEMOL")
  }  
  if (scaleAccident == "#") {
    chordAccident = "#";
    scaleAccidentChoice = sharp
    console.log("FUNÇAO QUE VERIFICA SE O SCALEACCIDENT É SUSTENIDO")
  }

  notation += chordAccident;

  if (type == "M") {
    majorChord(notation, scaleAccidentChoice, chatId);
  } else if (type == "m") {
    minorChord(notation, scaleAccidentChoice, chatId);
  } else if (type == "7") {
    console.log(`VERIFICOU SE O ACORDE É 7 E CHAMA DOMINANTCHORD
    SCALEACCIDENTCHOICE É = ${scaleAccidentChoice}`)
    dominantChord(notation, scaleAccidentChoice, chatId);
  } else if (type == "-7b5") {
    halfDiminishedChord(notation, scaleAccidentChoice, chatId);
  } else if (type == "dim") {
    diminishedChord(notation, scaleAccidentChoice, chatId);
  }
}

// MAJOR CHORD
function majorChord(note, entryScaleAccident, chatId) {
  type = "Maj7"
  note = enharmonics(note, type)
  entryScaleAccident = accidentEnharmonics(note)
  let finalChordTriad = chord(4, 7, 8, 5, note, entryScaleAccident)
  positionOfTonic = entryScaleAccident.indexOf(note)
  let seventh = seventhNote(note, entryScaleAccident, positionOfTonic, 1 , 11);
  let goodForImprovising = chordForImprovisation(4, 7, 8, 5,
    note, entryScaleAccident, 12, 1, 11, type)

  bot.sendMessage(chatId, formatChordMessage(note, type, finalChordTriad, seventh, goodForImprovising));
}

// END MAJOR CHORD


// MINOR CHORD
function minorChord(note, entryScaleAccident, chatId) {
  type = "min7"
  note = enharmonics(note, type)
  entryScaleAccident = accidentEnharmonics(note)
  //correcting enharmonics for better spelling
  if(note == "C" || note == "F" || note == "G"){
    entryScaleAccident = flat
  }
  let finalChordTriad = chord(3, 7, 9, 5, note, entryScaleAccident)
  positionOfTonic = entryScaleAccident.indexOf(note)
  let seventh = seventhNote(note, entryScaleAccident, positionOfTonic, 2 , 10);
  let goodForImprovising = chordForImprovisation(3, 7, 9, 5,
    note, entryScaleAccident, 12, 2, 12, type)

  bot.sendMessage(chatId, formatChordMessage(note, type, finalChordTriad, seventh, goodForImprovising));
}
// END MINOR CHORD

// DOMINANT CHORD
function dominantChord(note, entryScaleAccident, chatId) {
  type = "7"
  note = enharmonics(note, type)
  entryScaleAccident = accidentEnharmonics(note)
  //correcting enharmonics for better spelling
   if(note == "C" || note == "F"){
     entryScaleAccident = flat
   }
  let finalChordTriad = chord(4, 7, 8, 5, note, entryScaleAccident)
  positionOfTonic = entryScaleAccident.indexOf(note)
  let seventh = seventhNote(note, entryScaleAccident, positionOfTonic, 2 , 10);
  let goodForImprovising = chordForImprovisation(3, 7, 9, 5,
    note, entryScaleAccident, 12, 2, 12, "min7")

  bot.sendMessage(chatId, formatChordMessage(note, type, finalChordTriad, seventh, goodForImprovising));
}  
// END DOMINANT CHORD

// HALF-DIMINISHED CHORD
function halfDiminishedChord(note, entryScaleAccident, chatId) {
  type = "min7b5";
  note = enharmonics(note, type)
  entryScaleAccident = accidentEnharmonics(note)
   //correcting enharmonics for better spelling
   if(note == "C" || note == "D" || 
   note == "E" || note == "F" || 
   note == "G" || note == "A"){
   entryScaleAccident = flat
  }
  let finalChordTriad = chord(3, 6, 9, 6, note, entryScaleAccident);
  positionOfTonic = entryScaleAccident.indexOf(note);
  let seventh = seventhNote(note, entryScaleAccident, positionOfTonic, 2, 10);
  let goodForImprovising = chordForImprovisation(4, 7, 8, 5, note, entryScaleAccident, 12, 1, 11, "Maj7", 6);

  bot.sendMessage(chatId, formatChordMessage(note, type, finalChordTriad, seventh, goodForImprovising));
}
// END HALF-DIMINISHED CHORD

// DIMINISHED CHORD
function diminishedChord(note, entryScaleAccident, chatId) {
  type = "dim";
  note = enharmonics(note, type)
  entryScaleAccident = accidentEnharmonics(note)
  let finalChordTriad = chord(3, 6, 9, 6, note, entryScaleAccident);
  positionOfTonic = entryScaleAccident.indexOf(note);
  let seventh = seventhNote(note, entryScaleAccident, positionOfTonic, 3, 9);
  let goodForImprovising = ""; // Não há um acorde específico recomendado para improvisar em um acorde diminuto

  bot.sendMessage(chatId, formatChordMessage(note, type, finalChordTriad, seventh, goodForImprovising));
}
// END DIMINISHED CHORD

//ENARMONY
// Object that stores the possible substitutions
const enharmonicReplacements = {
  'common': {'Gb': 'F#', 'A#': 'Bb', 'E#': 'F', 'Fb': 'E', 'B#': 'C', 'Cb': 'B'},
  'Maj7': { 'C#': 'Db', 'D#': 'Eb', 'G#': 'Ab' },
  'min7': { 'Db': 'C#', 'D#': 'Eb', 'Ab': 'G#', 'G#': 'Ab' },
  '7': { 'Db': 'C#', 'D#': 'Eb', 'G#': 'Ab'},
  'min7b5': { 'Db': 'C#', 'Ab': 'G#', 'Eb': 'D#', 'Ab': 'G#' },
};
  
  //ENHARMONIC SUBSTITUTION FOR NOTES AND ACCIDENTALS
function enharmonics(entryNote, entryType) {
  // Get common and specific substitutions
  const commonReplacements = enharmonicReplacements.common;
  const specificReplacements = enharmonicReplacements[entryType];
  
  // Combine common and specific substitutions
  const combinedReplacements = { ...commonReplacements, ...specificReplacements };
  
  // Return the substituted note or the original note if there is no substitution
  return combinedReplacements[entryNote] || entryNote;
}
  
function accidentEnharmonics(note){
  let scaleAccident;
  if(note == 'Db' || note == 'Eb' || note == 'E#' || note == 'Ab' ||
  note == 'Bb' || note == "B#"){
  return scaleAccident = flat;
  }else if(note == 'Cb' || note == 'C#' || note == 'D#' || note == 'Fb' ||
  note == 'F#' || note == 'G#'){
  return scaleAccident = sharp;
  }else{
  return scaleAccident = sharp;
  }
}
// END ENHARMONY

// GOOD CHOICE FOR IMPROVISATION
function chordForImprovisation(plusForThird, plusForFifth, lessForThird, lessForFifth,
  note, scaleAccident, lessForFifthForImprovisation, lessForSeventh, plusForSeventh, chordType, interval = 7) {
  let positionOfImprovisingNote = scaleAccident.indexOf(note) + interval
  let improvisingNote
  if (positionOfImprovisingNote > scaleAccident.length - 1) {
      improvisingNote = scaleAccident[positionOfImprovisingNote - lessForFifthForImprovisation]
      positionOfImprovisingNote = positionOfImprovisingNote - 12 //define a posição exata no array
  } else {
      improvisingNote = scaleAccident[positionOfImprovisingNote]
  }
  let finalChordTriadForImprovisation = `${chord(plusForThird, plusForFifth, lessForThird, 
      lessForFifth, improvisingNote, scaleAccident)}, ${seventhNote
          (improvisingNote, scaleAccident, positionOfImprovisingNote, 
              lessForSeventh, plusForSeventh, chordType)}`
  return `${improvisingNote + chordType}: ${finalChordTriadForImprovisation}`
}

// END GOOD CHOICE FOR IMPROVISATION


// MESSAGE WITH FINAL CHORD
function formatChordMessage(note, type, finalChordTriad, seventh, goodForImprovising) {
  return ` 
      🔳 Acorde                        
      🔳 ${note + type}                 
      🔳 
      🔳 Notas do acorde              
      🔳 ${finalChordTriad}, ${seventh}                           
      🔳 
      🔳 Recomendado para improvisação 
      🔳 ${goodForImprovising}          
      🔳🔳🔳🔳🔳🔳🔳🔳🔳🔳🔳🔳🔳
      `;
}
// END MESSAGE WITH FINAL CHORD

// SPELLING THE CHORD (TRIAD)
function chord(plusForThird, plusForFifth, lessForThird, lessForFifth, note, scaleAccident) {
   tonic = note
   console.log("inidice de "+ note + " é " + scaleAccident.indexOf(note))
   let positionOfTonic = scaleAccident.indexOf(tonic)
   let positionOfThird = scaleAccident.indexOf(tonic) + plusForThird
   let positionOfFifth = scaleAccident.indexOf(tonic) + plusForFifth
   console.log(`posicao tonica, terca e quinta sao ${positionOfTonic}, ${positionOfThird}, ${positionOfFifth}`)
   //position of third
   if (scaleAccident.includes(tonic)) {
       if (positionOfThird > scaleAccident.length - 1) {
           third = scaleAccident[positionOfTonic - lessForThird]
       } else {
           third = scaleAccident[positionOfThird]
       }
   //position of fifth
       if (positionOfFifth > scaleAccident.length - 1) {
           fifth = scaleAccident[positionOfTonic - lessForFifth]
       } else {
           fifth = scaleAccident[positionOfFifth]
       }
       if (tonic == "C#" && third == "F" && fifth == "G#") {
           third = "E#"
       }
    //  console.log(`dentro da funcao chord tonica terca e quinta sao: ${tonic}, ${third}, ${fifth}`)
       return `${tonic}, ${third}, ${fifth}`
   }
}
// END SPELLING THE CHORD



// SPELLING SEVENTH OF THE CHORD
function seventhNote(note, scaleAccident, positionOfTonic, lessForSeventh, plusForSeventh) {
  let positionOfSeventh = scaleAccident.indexOf(note) + plusForSeventh
  if (positionOfSeventh > scaleAccident.length - 1) {
      return seventh = scaleAccident[positionOfTonic - lessForSeventh]
  } else {
      return seventh = scaleAccident[positionOfSeventh]
  }
}
//END SPELLING SEVENTH OF THE CHORD


