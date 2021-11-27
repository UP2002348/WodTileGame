import { popUp } from './popup.mjs'
import { BAG } from './app.js';

export class createBag{
    constructor(){
        this.tiles = {
            'A': { 'quantity' : 9, 'value': 1},
            'B': { 'quantity' : 2, 'value': 3},
            'C': { 'quantity' : 2, 'value': 3},
            'D': { 'quantity' : 4, 'value': 2},
            'E': { 'quantity' : 12, 'value': 1},
            'F': { 'quantity' : 2, 'value': 4},
            'G': { 'quantity' : 3, 'value': 2},
            'H': { 'quantity' : 2, 'value': 4},
            'I': { 'quantity' : 9, 'value': 1},
            'J': { 'quantity' : 1, 'value': 8},
            'K': { 'quantity' : 2, 'value': 5},
            'L': { 'quantity' : 4, 'value': 1},
            'M': { 'quantity' : 2, 'value': 3},
            'N': { 'quantity' : 6, 'value': 1},
            'O': { 'quantity' : 8, 'value': 1},
            'P': { 'quantity' : 2, 'value': 3},
            'Q': { 'quantity' : 1, 'value': 10},
            'R': { 'quantity' : 6, 'value': 1},
            'S': { 'quantity' : 4, 'value': 1},
            'T': { 'quantity' : 6, 'value': 1},
            'U': { 'quantity' : 4, 'value': 1},
            'V': { 'quantity' : 2, 'value': 4},
            'W': { 'quantity' : 2, 'value': 4},
            'X': { 'quantity' : 1, 'value': 8},
            'Y': { 'quantity' : 2, 'value': 4},
            'Z': { 'quantity' : 2, 'value': 10},
            }  
    }

    pickRandomTile(){
        let tilesLeft = 0;
        Object.values(this.tiles).forEach(letter => tilesLeft += letter['quantity']);
        let randomInt = Math.ceil(Math.random() * tilesLeft);
    
        for (const [index, tile] of Object.values(this.tiles).entries()){
            if (tile['quantity'] === 0){
                continue
            }
            randomInt -= tile['quantity'];
            
            if (randomInt <= 0 ){
                tile['quantity'] -= 1;
                return Object.keys(this.tiles)[index]; // returns the Tile letter 
            }
        }
        
    }
}

export class player{
    constructor(username){
        this.username = username;
        this.score = 0;
        this.finishState = false;
    }

    giveRack(){
        const section = document.querySelector('.user-interaction');
        const rack = document.createElement('section');
        rack.id = this.username;
        rack.classList.add('rack', `${this.username}`);

        section.prepend(rack);
    }

    userHand(){
        const rack = document.querySelector(`.${this.username}`);
    
        while (rack.childNodes.length < 7){
            const tileSquare = document.createElement('div');
            const allTiles = document.querySelectorAll('.tile-letter');
            let newNumber = 0;
            for (const tile of allTiles){
                newNumber++;
            }

            tileSquare.id = `tile${newNumber}`;
            tileSquare.classList.add('tile', 'tile-letter');
            tileSquare.draggable = 'true';


            let randomTile = BAG.pickRandomTile();
    
            if (BAG.tiles[randomTile] === undefined){               
                break;
            } 

            const letter = document.createElement('p');

            letter.textContent = randomTile;
     
            tileSquare.append(letter);
    
            const point = document.createElement('p');
            
            point.textContent = BAG.tiles[randomTile]['value'];
            point.classList.add('point');
            tileSquare.append(point);
    
            rack.append(tileSquare);
        }
        if (rack.childNodes.length === 0){
            this.finishState = true;
        }
     
    }

    addPoints(points){
        this.score += points;
    }

    minusPoints(points){
        this.score -= points;
        console.log(this.score)
    }

    hideUserHand(){
        document.querySelector(`.${this.username}.rack`).style.display = 'none';
    }

    displayUserHand(){
        document.querySelector(`.${this.username}`).style.display = 'flex';
    }
    
}