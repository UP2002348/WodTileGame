import { add, remove } from "./submit_play.mjs";

//reference
function dragStartHandler(e){
    const tileID = e.target.id;
    e.dataTransfer.setData('text/plain', tileID);
}

function dragOverHandler(e) {e.preventDefault();}

function dropHandler(e){
    const tileID = e.dataTransfer.getData('text');
    const dragged = document.getElementById(tileID);
    const targetJSArray = [...e.currentTarget.classList];
    const specialTiles = ['bonusWordThree', 'bonusLetterThree', 'bonusWordTwo', 'bonusLetterTwo', 'star'];
    if (targetJSArray.includes('board-drop') && dragged !== null){
        if (targetJSArray.some(classname => specialTiles.includes(classname)) && e.currentTarget.childNodes.length < 2){
            add(e.currentTarget, dragged);        
        } else if (e.currentTarget.childNodes.length < 1){
            add(e.currentTarget, dragged);
        }
    } else if (e.currentTarget.classList.contains('rack') && dragged !== null){
        remove(e.currentTarget, dragged);
    }
    
}

export function createDragEvents(){
    const wordTiles = document.querySelectorAll('main .rack div');
    for (const tile of wordTiles){
        tile.addEventListener('dragstart', dragStartHandler);
    }
}

export function createDropZones(){
    const boardDropZone = document.querySelectorAll('.board-drop');
    
    const rackDropZone = document.querySelectorAll('main .rack');

    const allDropZones = [];
    
    for (const dropZone of boardDropZone){
        dropZone.addEventListener('dragenter', (e) => {e.preventDefault();
            e.currentTarget.classList.add('tile-hover');
        })
        dropZone.addEventListener('dragleave', (e) => {e.preventDefault();
            e.currentTarget.classList.remove('tile-hover');
        })
        allDropZones.push(dropZone);
    }
    for (const dropZone of rackDropZone){
        allDropZones.push(dropZone);
    }

    for (const dropZone of allDropZones){
        dropZone.addEventListener('dragover', dragOverHandler);
        dropZone.addEventListener('drop', dropHandler);
    }
}