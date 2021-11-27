import { players } from './app.js';
import { createDragEvents } from './drag_drop.mjs';
import {popUp} from './popup.mjs';


let draggedTiles = [];
let currentPlayer = 0;

//
export function add(currentTarget, elem){
    // adds a tile ONLY once to the array when a tile is placed on the board
    let tileFlag = false;
    for (const tile of draggedTiles){
        if (tile === elem){
            tileFlag = true;
            break;
        }
    }
    if (!tileFlag){
        draggedTiles.push(elem);
    }

    elem.classList.add('tile-placed')
    currentTarget.append(elem);
}

export function remove(currentTarget, elem){
    //if a tile is removed off the board then it should be removed from the draggedTiles array too
    for (const [index, tile] of draggedTiles.entries()){
        if (tile === elem){
            draggedTiles.splice(index, 1);
        }
    }

    elem.classList.remove('tile-placed');
    currentTarget.append(elem);
}

function emptyDraggedTilesList(){
    draggedTiles = [];
}

//


function convertTo2DArray(direction1, direction2){
    // converts the divs(board) in html to an array so that the computer could recognise all the words placed
    const arr = [];
    let row_or_column = [];
    
    for (let x_or_y=0; x_or_y < 15; x_or_y++){
        for (let y_or_x=0; y_or_x < 15; y_or_x++){
            const tile = document.querySelector(`[data-${direction1}~="${x_or_y}"][data-${direction2}~="${y_or_x}"]`);
            if (tile.lastChild){
                // checks whether a word tile is placed here or not
                // lastChild.classList is used because it could be an empty special tile i.e. '3WS' which they dont have a class attribute
                if (tile.lastChild.classList){
                    row_or_column.push(tile.lastChild);
                }else{
                    row_or_column.push(' ');
                }
            }else{
                row_or_column.push(' ');
            }
        }
        arr.push(row_or_column);
        row_or_column = [];
    }
    console.log(arr, direction1);
    return arr;
}

function findWords(direction){
    const allFoundWords = [];
    for (const row_or_column of direction){
        let tempWord = [];
        for (const tile of row_or_column){
            if (tile !== ' '){
                tempWord.push(tile);
            } else if (tile === ' ' && tempWord.length > 1 ){
                allFoundWords.push(tempWord);
                tempWord = [];
            } else {
                tempWord = [];
            }
        }
        
        if (tempWord.length > 1){
            allFoundWords.push(tempWord);
        }
    }
    return allFoundWords;
}

function checkMovesValid(allFoundWords, allPlacedTiles){
    let error;
    let checker = (arr, target) => target.every(v => arr.includes(v));// found on stackoverflow
    
    const newWords = new Set;
    let correctMoveFlag = false;
    for (const word of allFoundWords){
        for (const tile of draggedTiles){
            if (word.includes(tile)){
                newWords.add(word);
            }
        }
        if (checker(word, draggedTiles)){
            correctMoveFlag = true;
        }
    }

    let tileConnectedFlag = false;
    for (const row of allPlacedTiles){
        for (const tile of row){
            if (draggedTiles.includes(tile) && row[row.indexOf(tile)-1] !== undefined){               
                if (row[row.indexOf(tile)-1].draggable === false) {
                    tileConnectedFlag = true;
                }
            }
            if (draggedTiles.includes(tile) && row[row.indexOf(tile)+1] !== undefined) {
                if (row[row.indexOf(tile)+1].draggable === false){
                    tileConnectedFlag = true;
                }
            }
            
        }
    }
    
    const boardTiles = document.querySelectorAll('.board-drop');

    if (draggedTiles.includes(boardTiles[Math.floor(15*15/2)].childNodes[1])){
        tileConnectedFlag = true;
    } 

    if(tileConnectedFlag === false){ 
        error = 'First word must be in the center of the board. Tiles must be connected to tiles placed on the board previously';
    } else if(correctMoveFlag  === false){
        error = 'Tiles must be placed in either a horizontal or vertical manner and must not contain any spaces';
        console.log(error)
    }

    return [correctMoveFlag, tileConnectedFlag, newWords, error]
}

async function checkWordsValid(newWords){

    // Checks all the found words are valid.
    // As the foundWords is a 2D array with the words being a html element, the program gets the textContent
    // (firstChild - is the letter, secondChild - is the point) and adds it into a string to make a word
    // the program requests to the server the word and if the response is Ok then the word is valid
    // Otherwise return false
    
    const validWords = [];
    const invalidWords = [];
    let invalidWordFlag = false;
    for (const wordArray of newWords){
        let wordText = '';
        for (const tile of wordArray){
            wordText += tile.firstChild.textContent;
        }
        const url = 'https://dictionary-dot-sse-2020.nw.r.appspot.com/' + wordText;
        console.log(url)
        const response = await fetch(url);
        switch(response.status){
            case 200:
                validWords.push(wordText);
                break;
            case 404:
                invalidWords.push(wordText);
                invalidWordFlag = true;
                break;
        }
    }

    if (!invalidWordFlag){
        return [validWords, true];
    } else if (invalidWordFlag){
        return [invalidWords, false]

    }
}

function calculatePoints(words){
    
    let fullPoints = 0;

    for (const word of words){
        let wordPoint = 0;
        let bonusScore = 1;
        for (const letter of word){
            let tilePoint = Number(letter.lastChild.textContent);
            
            const classIncludes = letter.parentNode.classList;
            if (draggedTiles.includes(letter)){
                if (classIncludes.contains('star') || classIncludes.contains('bonusWordTwo')){
                    bonusScore *= 2;
                } else if(classIncludes.contains('bonusWordThree')){
                    bonusScore *= 3;
                } else if(classIncludes.contains('bonusLetterThree')){
                    tilePoint *= 3;
                } else if(classIncludes.contains('bonusLetterTwo')){
                    tilePoint *= 2;
                }
            }
            wordPoint += tilePoint;
        }
        fullPoints += wordPoint * bonusScore;
    }
    return fullPoints;
}

function updateInformationBoard(words, validStatus){
    const infoBoard = document.querySelector('#info-board');
    for (const word of words){
        const p = document.createElement('p');
        p.textContent = word;
        if (validStatus){
            p.className = 'valid-word';
        } else {
            p.className = 'invalid-word';
        }
        infoBoard.append(p);
    }
}

export function pass(point=0){
    
    players[currentPlayer].addPoints(point);
    if (players[currentPlayer].finishState !== true){
        players[currentPlayer].userHand();
    }

    players[currentPlayer].hideUserHand();
    let scoreBoard = document.querySelectorAll('.score-board');
    scoreBoard[currentPlayer].lastChild.textContent = players[currentPlayer].score;
    scoreBoard[currentPlayer].classList.remove('user-turn');

    if (currentPlayer === players.length-1){
        console.log('then came here')
        currentPlayer = 0;
    } else {
        currentPlayer++;
    }

    const playersFinishedFlag = players.every(function (e) {return e.finishState == true;});
    if (players[currentPlayer].finishState !== true){
        scoreBoard[currentPlayer].classList.add('user-turn');
        players[currentPlayer].displayUserHand();
    } else if(playersFinishedFlag){
        console.log('finished')
        finish();
    } else {
        console.log('pas')
        pass();
    }

}


export function clear(){
    const userRack = document.querySelector(`.${players[currentPlayer].username}`);
    console.log(userRack)
    for (const tiles of draggedTiles){
        tiles.classList.remove('tile-placed');
        tiles.parentNode.classList.remove('tile-hover');
        userRack.append(tiles);
    }
    emptyDraggedTilesList()
}


export function finish(){
    console.log('finish')
    players[currentPlayer].finishState = true;
    for (const player of players){
        if (player.finishState !== true){
            console.log('after somethingelse');
            pass();
            return null;
        }
    }
    let foundHighest = false;
    if (players.length === 1){
        console.log('came here')
        popUp(`Your score is ${players[0].score}`, [{element:'button', attrib: {type:'submit', textContent:'Home', className:'game-button home', id: 'home-button' }}]);
        console.log('after here')
    } else {
        let index = 0;
        let nextPlayer = 1;
        let winner = [];
        winner.push(players[index]);
        while (!foundHighest){
            // make this part suitable for single player as well
            if (players[index].score < players[index+nextPlayer].score){
                winner = [];
                winner.push(players[index+nextPlayer]);
                index += nextPlayer;
                nextPlayer = 0;
            } else if(players[index].score === players[index+nextPlayer].score){
                if (!winner.includes(players[index])){
                    winner.push(players[index]);
                }

                winner.push(players[index+nextPlayer]);
                index += nextPlayer;
                nextPlayer = 0;
            }
            nextPlayer+=1;
            if (index+nextPlayer === players.length){
                foundHighest = true;
            }
        }

        let winners = [];
        for (const n of winner){
            let obj = {};
            obj.element = 'p';
            obj.attrib = {textContent: `${n.username} with ${n.score}`}
            console.log(n)
            winners.push(obj);
        }
        console.log(winners)

        popUp('winners are', winners.concat([
            {element:'button', attrib: {type:'submit', textContent:'Home', className:'game-button home'}},
        ]));
    }
    const buttons = document.querySelectorAll('.home')
    for (const button of buttons){
        button.addEventListener('click', () => {
            window.location.href = window.location;
        });
    }
}


export async function submit(){
    const horizontalArray = convertTo2DArray('y', 'x');
    const verticalArray = convertTo2DArray('x', 'y');
    const allFoundWords = findWords(horizontalArray).concat(findWords(verticalArray));
    const [correctMoveFlag, tileConnectedFlag, newWords, error] = checkMovesValid(allFoundWords, verticalArray.concat(horizontalArray));

    if (correctMoveFlag && tileConnectedFlag && draggedTiles.length > 0 ){
        const [words, wordsIsValid] = await checkWordsValid(newWords);
        if (wordsIsValid){
            const wordScores = calculatePoints(newWords);
            updateInformationBoard(words, wordsIsValid);
            for (const elem of draggedTiles){
                elem.draggable = false;
            }

            emptyDraggedTilesList();
            
            pass(wordScores);
            createDragEvents();

            
        }else{
            updateInformationBoard(words, wordsIsValid);
            return alert(words + ' is an invalid word'); 
        }
    } else {
        return alert(error);
    }
}
    
