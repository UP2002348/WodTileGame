import {setUpBoard, showScore} from './board.mjs';
import { createBag, player } from "./bag_player.mjs";
import {createDragEvents, createDropZones} from './drag_drop.mjs'
import { submit, pass, clear, finish } from "./submit_play.mjs";
import {popUp} from './popup.mjs';
import {options, createOptions} from './options.mjs';

export let boardDesigns;
export const BAG = new createBag();
export let players = [];

async function loadBoards(){
    const response = await fetch('getboards');
    let boards;
    if (response.ok){
        boards = await response.json();
        return boards;
    } else{
        console.error('failed to load boards');
    }

}

function createPlayers(num){
    for (let n = 1; n <= num; n++){
        const newPlayer = new player(`player${n}`);
        newPlayer.giveRack();
        newPlayer.userHand();
        showScore(newPlayer);
        if (n > 1){
            newPlayer.hideUserHand();
        }
        players.push(newPlayer);
    }
   
    document.querySelectorAll(`.score-board`)[0].classList.add('user-turn');
    return players;
}

function assignButtons(){
    const homeBtn = document.querySelector('main .home-button')
    homeBtn.addEventListener('click', () => {
        window.location.href = window.location;
    });

    const submitBtn = document.querySelector('[data-button~="submit"]')
    submitBtn.addEventListener('click', submit);

    const passBtn = document.querySelector('[data-button~="pass"]');
    passBtn.addEventListener('click', () => {clear(); pass()});

    if (players.length === 1){
        passBtn.remove()
    }

    const clearBtn = document.querySelector('[data-button~="clear"]');
    clearBtn.addEventListener('click', clear);

    const finishBtn = document.querySelector('[data-button~="finish"]');
    finishBtn.addEventListener('click', () => {clear(); finish();});
}

function setUp(){
    document.querySelector('#menu').style.display = 'none';
    document.querySelector('.game-layout').style.display = 'flex';
    
    let boardSelected = document.querySelectorAll('[name="board-selector"]');
    for (const selected of boardSelected){
        console.log(selected)
        if (selected.checked) boardSelected = selected.id;
    }

    const board = document.querySelector('.game-layout .board');
    const selectedBoard = document.querySelector('[data-choice=selected]').id;
    setUpBoard(board, boardDesigns[selectedBoard]);
    createDragEvents()
    createDropZones()
    assignButtons()
}

function multiPlayer(){
    popUp('How many players should there be (2-4):', [{element:'input', attrib: {type:'number', className:'number-input', id:'num-players'}}, {element:'button', attrib: {type:'submit', textContent:'play', className: 'game-button', id:'n-players'}}])
    document.querySelector('#n-players').addEventListener('click', () => {
        const maxPlayers = Number(document.querySelector('#num-players').value);
        if (maxPlayers < 2 || maxPlayers > 4){
            document.querySelector('#menu').style.display = 'flex';
            alert('Enter a number between 2 and 4');
            return null;
        }
        document.querySelector('.popup').style.display = 'none';
        setUp(createPlayers(maxPlayers))
    })
    
}




async function init(){
    boardDesigns = await loadBoards();
    document.querySelector('.game-layout').style.display = 'none';
    document.querySelector('#options').style.display = 'none';
    createOptions()

    document.querySelector('#options-button').addEventListener('click', options);

    document.querySelector('#single-player').addEventListener('click', () => {
        setUp(createPlayers(1))
    });
    document.querySelector('#multi-player').addEventListener('click', () => {
        multiPlayer()
    });
}

window.addEventListener('load', init);
