// USTAWIENIA (Można zmieniać wartości zmiennych (i stałych) tylko i wyłącznie w sekcji "USTAWIENIA".)

// Kategorie do gry (ilość pól może ulec zmianie):
const CATEGORIES = ['PAŃSTWO', 'MIASTO', 'ROŚLINA', 'AKTOR', 'PRZEDMIOT', 'ZWIERZĘ', 'IMIĘ', 'AUTO', 'PIOSENKA', 'RASA PSA', 'GRA WIDEO', 'CUKIERNIA', 'KOLOR', 'FILM', 'MEBEL', 'ALFABET GRECKI', 'ZAWÓD', 'KSZTAŁT', 'JĘZYK (PROGRAMOWANIA)'];

// Ilość wyświetlanych kategorii:
const NUMBER_OF_CATEGORIES = 5;

// Czas na uzupełnieine po zgłoszeniu gotowości (w sekundach):
const TIME = 15;

// Litery do gry (Wpisywać w formie: 'ABCDEFGH'. LITERY NIE MOGĄ SIĘ POWTARZAĆ!):
let alphabet = 'BCDFGHJKLOPRSTWZ';

// USTAWIENIA

String.prototype.replaceAll = function (search, replacement) {
    const target = this;
    return target.replace(new RegExp(search, 'g'), replacement);
};

// Categories section

let categories = document.getElementById('categories');
let drawn = [];
let allDrawn = [];

function drawCategories() {
    let rand;
    drawn = [];
    for (let i = 0; i < NUMBER_OF_CATEGORIES; i++) {
        if (allDrawn.length === CATEGORIES.length) {
            break;
        }
        rand = Math.ceil(Math.random() * CATEGORIES.length) - 1;
        //alert(i);
        if (isFound(CATEGORIES[rand], allDrawn)) {
            i--;
        } else {
            drawn.push(CATEGORIES[rand]);
            allDrawn.push(CATEGORIES[rand]);
        }
    }

    if (allDrawn.length === CATEGORIES.length) categories.innerHTML = '';
    else categories.innerHTML = '<table class="tg"><tr><th class="tg-yw41">' + String(drawn).replaceAll(',', '</th><th class="tg-yw41">') + '</tr></table>';
}

function isFound(element, table) {
    for (let j = 0; j < table.length; j++) if (table[j] === element) return true;
    return false;
}

// Letters section

let drawnLetters = '';
let drawnLetterString = '';
let currentRound = 1;
let gameFinished = false;
let input = document.getElementById('input');
let roundStringElement = document.getElementById('rString');
let drawnLetterStringElement = document.getElementById('dLString');
let drawnLetterElement = document.getElementById('letter');
let btn1 = document.getElementById('draw_letter');
let btn2 = document.getElementById('report_readiness');

input.value = alphabet;
input.select();

function drawLots() {
    drawnLetterStringElement.innerHTML = "Wylosowana litera:";
    btn2.disabled = false;
    if (gameFinished === true) document.getElementById('dl').onClick = location.reload();
    if (drawnLetters.length >= alphabet.length) {
        roundStringElement.innerHTML = '***';
        drawnLetterStringElement.innerHTML = 'Koniec gry!';
        drawnLetterElement.innerHTML = 'Literki się skończyły ;)';
        btn1.innerHTML = 'Od nowa <span class="hotkey">[SPACJA]</span>';
        btn2.disabled = true;
        gameFinished = true;
        return;
    }
    let rand = Math.ceil(Math.random() * alphabet.length) - 1;
    if (drawnLetters) {
        for (let i = 0; i < drawnLetters.length; i++) {
            if (alphabet[rand] === drawnLetters[i]) {
                drawLots();
                return;
            }
        }
    }

    let roundString = ': ' + currentRound;
    if (currentRound === alphabet.length) roundString = ' końcowa';
    document.getElementById('round').innerHTML = roundString;
    currentRound++;

    document.getElementById('letter').innerHTML = '<b id="rLetter">' + alphabet[rand] + '</b>';

    drawnLetters += alphabet[rand];
    if (currentRound === 2) drawnLetterString += alphabet[rand];
    else drawnLetterString += ', ' + alphabet[rand];
    document.getElementById('letters').innerHTML = drawnLetterString;

}

function acceptLetters() {
    alphabet = input.value.toUpperCase();
    document.getElementById('lettersBackground').style.display = 'none';
    document.getElementById('lettersWindow').style.display = 'none';
    btn1.disabled = false;
}

function testLetter(event) {
    let letters = document.getElementById('input').value
    let x = event.which || event.keyCode;
    let letter = String.fromCharCode(x);

    switch (x) {
        case 13: {
            acceptLetters();
            return;
        }

        case 32: {
            event.returnValue = false;
            break;
        }
    }

    if (letters) {
        for (let i = 0; i < letters.length; i++) {
            if (letter.toUpperCase() === letters[i].toUpperCase()) {
                event.returnValue = false;
                break;
            }
        }
    }
}

function reportReadiness() {
    let secs = TIME;
    drawnLetterStringElement.innerHTML = 'Odliczanie';
    drawnLetterElement.innerHTML = '<b id="rLetter">' + secs-- + '</b>';
    btn1.disabled = true;
    btn2.disabled = true;

    let itvl = setInterval(() => {
        if (secs === 0) {
            clearInterval(itvl);
            drawnLetterStringElement.innerHTML = 'Odliczanie zakończone';
            drawnLetterElement.innerHTML = '(wciśnij przycisk <b>Losuj</b> w celu rozpoczęcia)';
            btn1.disabled = false;
        } else {
            drawnLetterElement.innerHTML = '<b id="rLetter">' + secs + '</b>';
            secs--;
        }

    }, 1000);
}

function findHotkey(event) {
    let x = event.which || event.keyCode;

    switch (x) {
        // Space
        case 32:
            if (btn1.disabled === false) drawLots();
            break;

        // Enter
        case 13:
            if (btn2.disabled === false) reportReadiness();
            break;

        // Q
        case 81:
            drawCategories();
            break;
    }
}