
const base = "https://raw.githubusercontent.com/ryanlq/lyrics/main/"
export async function LyricParser(name){
    const fullurl = base + name +".lrc"
    const response = await fetch(fullurl);
    const text = await response.text()

    if(text.slice(0,3) !== "404"){
        return text.replaceAll("\n","")
    } else {
        return false
    }
}

