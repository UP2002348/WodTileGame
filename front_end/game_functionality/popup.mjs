export function popUp(text, elements){
    const div = document.createElement('div');
    div.className = 'popup'
    const popup = document.createElement('div');
    popup.className = 'popup-contents';
    const p = document.createElement('p');
    p.textContent = text;
    popup.append(p);
    if (elements){

        for (const elem of Object.values(elements)){
            let el = document.createElement(elem.element);
            for (const attr of Object.keys(elem.attrib)){
                el[attr] = elem.attrib[attr];
            }
            popup.append(el);
        }
    }
    div.append(popup);
    document.querySelector('body').append(div);
}