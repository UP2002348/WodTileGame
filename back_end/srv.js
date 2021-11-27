import express from 'express';
import * as fs from 'fs';

function readJson(file){
    const data = fs.readFileSync(file, 'utf8');
    const words = JSON.parse(data)
    return words;
}

const app = express();

app.use(express.static('./front_end/pages'));
app.use(express.static('./front_end/styles'));
app.use(express.static('./front_end/game_functionality'));

app.get('/getboards', (req, res) =>{
    const jsonObject = readJson('back_end/board_designs.json');
    res.json(jsonObject);
});


app.listen(8080);