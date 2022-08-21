
function hanzi(){
    const main =  document.getElementById('main')
    const wordTemplate = document.getElementById('word_template')
    function _init(){
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
            width: 100,
            height: 100,
            padding: 5,
            strokeAnimationSpeed: 4,
            drawingWidth :22,
            radicalColor: '#168F16', // green
    
        })
        template.writer = writer
        _attachEvent(template)
    }
    
    
    function _attachEvent(el){
        const word = el.querySelector('svg')
        const writer = el.writer;
        const cover =  el.querySelector('.cover')
        cover.addEventListener('click',e=>{
            speak(word.id)
            if(options.is_auto_write == "on"){
                writer.animateCharacter()
            } else {
                writer.pauseAnimation()
            }
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
            
            if(options.is_quizing== "on"){
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
