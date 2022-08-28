
function hanzi(){
    const main =  document.getElementById('main')
    const wordTemplate = document.getElementById('word_template')
    const respeak = document.getElementById('respeak')
    let SIZE = options['hanzi_origin_size'] || 100

    /*
            <line x1="0" y1="0" x2="100" y2="100" stroke="#DDD" />
            <line x1="100" y1="0" x2="0" y2="100" stroke="#DDD" />
            <line x1="50" y1="0" x2="50" y2="100" stroke="#DDD" />
            <line x1="0" y1="50" x2="100" y2="50" stroke="#DDD" />
    */

    function build_underline_html(size){
        const halfsize = size/2
        let html = `
        <line x1="0" y1="0" x2="${size}" y2="${size}" stroke="#DDD" />
        <line x1="${size}" y1="0" x2="0" y2="${size}" stroke="#DDD" />
        <line x1="${halfsize}" y1="0" x2="${halfsize}" y2="${size}" stroke="#DDD" />
        <line x1="0" y1="${halfsize}" x2="${size}" y2="${halfsize}" stroke="#DDD" />
        `
        return html;
    }
    function _init(){
        let svgNode = wordTemplate.querySelector('svg')
        svgNode.innerHTML = build_underline_html(SIZE)
        svgNode.setAttribute("width",SIZE) 
        svgNode.setAttribute("height",SIZE) 
        const words = commonwords[options['current_chapter']||0]
        const len = words.length;
        for( let i=0; i<len;i++){
            words[i]!=='\n'&& create(words[i])
        }
    }
    function create(word){
        let template = wordTemplate.cloneNode(true);
        template.id = ''
        let svg = template.querySelector('svg')
        svg.id = word
        main.appendChild(template)
        let writer = HanziWriter.create(word, word, {
            width: SIZE,
            height: SIZE,
            padding: 5,
            strokeAnimationSpeed: 4,
            drawingWidth :22,
            radicalColor: '#168F16', // green
            showOutline:options['show_outline']=="on"?true:false,
            showCharacter:options['show_character']=="on"?true:false,
    
        })
        template.writer = writer
        _attachEvent(template)
    }
    
    
    function _attachEvent(el){
        const word = el.querySelector('svg')
        const writer = el.writer;
        const cover =  el.querySelector('.cover')
        cover.style.height = SIZE + "px"
        cover.style.width = SIZE + "px"
        cover.addEventListener('click',e=>{
            respeak.word = word.id
            speak(word.id,true)
            // if(options.is_auto_write == "on"){
            //     writer.animateCharacter()
            // } else {
            //     writer.pauseAnimation()
            // }
            // if(options.is_show== "on"){
            //     writer.showCharacter()
            // } else {
            //     writer.hideCharacter()
            // }
            // if(options.has_outline== "on"){
            //     writer.showOutline()
            // } else {
            //     writer.hideOutline()
            // }
            
            if(options.is_quizing== "on" || (options.show_character == "off" && options.show_outline )){
                const hidenCovers = document.querySelectorAll('.cover.hide')
                hidenCovers.forEach(node=>{
                    node.parentNode.writer.showCharacter()
                    node.parentNode.writer.cancelQuiz()
                    node.classList.remove('hide')
                })
                cover.classList.add("hide")
                writer.pauseAnimation()
                writer.hideOutline()
                writer.quiz()
                
            } else {
                writer.cancelQuiz()
            }
        })
    }
    _init()
}
