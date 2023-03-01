
const base = "https://raw.githubusercontent.com/ryanlq/lyrics/main/"
export async function LyricParser(name){
    var header = new Headers();
    header.append('Content-Type','text/plain; charset=UTF-8');
    const fullurl = base + name +".lrc"
    const response = await fetch(fullurl,header);
    const text = await response.text()

    if(text.slice(0,3) !== "404"){
        return text.replaceAll("\n","")
    } else {
        return false
    }
}

