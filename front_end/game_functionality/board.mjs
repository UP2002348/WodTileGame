export function setUpBoard(where, boardDesign){
    console.log(boardDesign)
    for (let y = 0; y < 15; y++){

        for (let x = 0; x < 15; x++){
            const div = document.createElement('div');
            div.dataset.x = `${x}`;
            div.dataset.y = `${y}`;
            div.classList.add('tile', 'board-drop');
            const tile = boardDesign[y][x];
            switch(tile){
            case 'T':
                div.classList.add('bonusWordThree');
                div.textContent = '3WS';
                break;
            case 't':
                div.classList.add('bonusLetterThree');
                div.textContent = '3LS';
                break;
            case 'D':
                div.classList.add('bonusWordTwo');
                div.textContent = '2WS';
                break;
            case 'd':
                div.classList.add('bonusLetterTwo');
                div.textContent = '2LS';
                break;
            case 'X':
                div.classList.add('star');
                div.textContent = '\u2605';
                break;
            }
            where.append(div);
        }
    }   

}



export function showScore(player){
    const div = document.querySelector('.point-area')
    const username = document.createElement('p');

    username.id = player.username
    username.classList.add('score-board');
    username.textContent = `${player.username}'s score: `;

    const score = document.createElement('span');
    score.textContent = `${player.score}`;
    score.id = 'score';
    
    username.append(score);
    div.append(username);
    
}