import { setUpBoard } from './board.mjs';
import { boardDesigns} from './app.js';

let currentDesignIndex = 0;

function prevBtn(){
    currentDesignIndex--;
    if (currentDesignIndex === -1){
        console.log(currentDesignIndex)

        currentDesignIndex = Object.values(boardDesigns).length-1;
    }
    changeBoard();
}

function nextBtn(){
    currentDesignIndex++;
    console.log(currentDesignIndex)
    if (currentDesignIndex === Object.values(boardDesigns).length){
        currentDesignIndex = 0;
    }
    changeBoard();
}

function changeBoard(){
    const boards = document.querySelectorAll(`#options .board`);
    console.log(currentDesignIndex)
    for (const board of boards){
        console.log(board.id, `board${currentDesignIndex}`, board)
        if (board.id === Object.keys(boardDesigns)[currentDesignIndex]){
            board.style.display = 'grid';
            board.dataset.choice = 'selected'
        } else {
            board.dataset.choice = 'unselected'
            board.style.display = 'none';
        }
    }
    
}


export function createOptions(){

    const option = document.querySelector('#options>div');
    for (const [name, boards] of Object.entries(boardDesigns)){
        const el = document.createElement('div');
        el.id = name;
        el.className = 'board'
        el.dataset.choice = 'selected'
        setUpBoard(el, boards);
        option.append(el);
        if (el.id !== Object.keys(boardDesigns)[currentDesignIndex]){
            el.style.display = 'none';
            el.dataset.choice = 'unselected';
        }
    }
    document.querySelector('#options .home-button').addEventListener('click', () => {
        document.querySelector('#options').style.display = 'none';
        menu.style.display = 'flex';
    })

}

export function options(){
    const menu = document.querySelector('#menu');
    menu.style.display = 'none';
    const option = document.querySelector('#options');
    option.style.display = 'flex';

    document.querySelector('#previous-button').addEventListener('click', prevBtn);
    document.querySelector('#next-button').addEventListener('click', nextBtn);
}