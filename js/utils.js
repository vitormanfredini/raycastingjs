const getFontSizeToFitScreen = (numChars) => {

    const div = document.createElement('div');
    div.className = 'howManyChars';
    div.innerText += 'A';
    document.body.appendChild(div);

    const oneLineHeight = div.clientHeight;

    for(let c=0;c<numChars-1;c++){
        div.innerText += 'A';
    }

    let fontSize = 1;
    for(let c=0;c<500;c++){
        div.style.fontSize = fontSize+'px';
        if(div.clientHeight > oneLineHeight){
            break
        }
        fontSize += 0.25
    }

    const divRemove = document.querySelector('.howManyChars');
    if (divRemove) divRemove.remove();
    
    return fontSize
}