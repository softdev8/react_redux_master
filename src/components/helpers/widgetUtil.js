export function parseSvgWidth(svgString){
    if(!svgString){
        return null;
    }

    const myRegexp = /width="(.*?)pt"/;
    const match = myRegexp.exec(svgString);

    if(!match || !match[1]){
        return null;
    }

    const width = match[1];
    return convertWidthfromPtToPixels(width);
}

function convertWidthfromPtToPixels(width){
    return Math.ceil(width*96/72);
}

export function getMargin(align){
    if(align == 'center'){
        return '0 auto';
    } else if( align == 'left'){
        return '0 auto auto 0';
    } else if( align == 'right'){
        return '0 0 0 auto';
    }
    return '0 auto';
}

export function generateSvgFromGraphviz(src) {
    try {
        return Viz(src,
                   { format: "svg", engine: "dot" }
               );
    } catch (err) {
        console.log(err);
        return "";
    }
}

export function generateSvgFromSequenceDiagram(src, diagram_type, editor_div, callback) {
    let diagramDom = document.getElementById(editor_div);
    if (diagramDom)
        diagramDom.innerHTML = '';
    try {
        let diagram = Diagram.parse(src);
        diagram.drawSVG(editor_div, {theme: diagram_type});
        getSvgString(src, editor_div, (svg_string) => {
            const result = {
                err: false,
                svg_string: svg_string
            } 
            callback(result)
        } ); 
    } catch (err) {
        const result = {
            err: true,
            errMessae: err.message
        }
        callback(result);
    }
}

function getSvgString(data, editor_div, callback) {
    let diagramDom = document.getElementById(editor_div);
    let interval = setInterval(function(){ 
	    let content = diagramDom.innerHTML;
	    if (content) {
            clearInterval(interval);
            const svg = diagramDom.getElementsByTagName("svg")[0];
            const width = parseInt(svg.width.baseVal.value);
            const height = parseInt(svg.height.baseVal.value);     
            const svg_string = '<?xml version="1.0" encoding="utf-8" standalone="no"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 20010904//EN" "http://www.w3.org/TR/2001/REC-SVG-20010904/DTD/svg10.dtd"><svg xmlns="http://www.w3.org/2000/svg" width="' + width + '" height="' + height + '" xmlns:xlink="http://www.w3.org/1999/xlink"><source><![CDATA[' + data + ']]></source>' + svg.innerHTML + '</svg>';
            callback(svg_string);
        }
	}, 50);
}
