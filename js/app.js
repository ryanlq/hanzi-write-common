function app(){
    async function init(){ //从indexdb中取得初始配置
        options = await db.get_options()
        if(!options){
            await db.init_options()
            options = await db.get_options()
        } 
        return options
    
    }
    
    function initChapters(){ //初始化章节列表
        const chaptersNode = document.querySelector('#chapters')
        const chapterbtn = chaptersNode.querySelector('#chapters_btn')
        const chapter_lists = chaptersNode.querySelector('#chapter_lists')
        const chapters = chaptersNode.querySelectorAll('li')
        chapterbtn.addEventListener("click",(e)=>{
            chapter_lists.classList.toggle("hide")
            e.preventDefault()
        },{passive:false})
        chapters.forEach((chapter,i)=>{
            if(options['current_chapter'] == i){
                chapter.classList.add('selected')
            }
            chapter.addEventListener("click",function(e){
                const selectedNum = Number(e.target.id.replace("chapter",""))
                if(options['current_chapter'] == selectedNum){
                    return false;
                }
                const selectedNodes = chaptersNode.querySelectorAll("selected")
                selectedNodes.forEach(node=>node.classList.remove("selected"))
                options['current_chapter'] = selectedNum
                e.target.classList.add("selected")
                chapter_lists.classList.remove("hide")
                db.update_options(options).then(()=>{
                    window.location.reload(true);
                })
                // elem.dispatchEvent(chapterChangeEvent);
            },{passive:false})
        })
    }

    function initSpeakerLists(){ //设置speaker列表
        const speaker_select = document.querySelector('#speaker_select')
        const ul = speaker_select.querySelector('.lists')
        const lists = ul.querySelectorAll('li')
        speaker_select.addEventListener("click",(e)=>{
            ul.classList.toggle("hide")
            e.preventDefault()
        },{passive:false})
        lists.forEach((chapter,i)=>{
            if(options['current_speaker'] == i){
                chapter.classList.add('selected')
            }
            chapter.addEventListener("click",function(e){
                const selectedNum = Number(e.target.id.replace("speaker",""))
                if(options['current_speaker'] == selectedNum){
                    return false;
                }
                const selectedNodes = ul.querySelectorAll("selected")
                selectedNodes.forEach(node=>node.classList.remove("selected"))
                options['current_speaker'] = selectedNum
                e.target.classList.add("selected")
                ul.classList.remove("hide")
                db.update_options(options).then(()=>{
                    console.log("speaker 设置成功！")
                })
                // elem.dispatchEvent(chapterChangeEvent);
            },{passive:false})
        })
    }
    function setCheckboxStatus(is_set ,el){ //滑动按钮状态更改
        if(is_set == "on"){
            el.setAttribute('checked','checked')
            el.value = "on"
        } else {
            el.removeAttribute('checked')
            el.value = "off"
        }
    }
    function attachChangeEvent(el){ //滑动按钮事件绑定
        el.addEventListener('change',e=>{
            const id = el.id
            const key = id.replace("_btn","")
            if(el.value == "on"){
                el.value ="off"
                options[key] = "off"
            } else {
                el.value ="on"
                options[key] = "on"
            }
            db.update_options(options).then(()=>{
                console.log("设置成功！")
                if(["show_outline","show_character"].includes(key)){
                    window.location.reload(true);

                }
            })
        },{passive:false})
    }
    
    function hanzi_size_set_event(){
        const size = options['hanzi_origin_size']
        const hanzi_tie = document.querySelector("#tie")
        const tie_btn = document.querySelector("#tie_btn")
        const hanzi_tie_lists = document.querySelector("#tie_sizes")
        const lists = hanzi_tie_lists.querySelectorAll('li')
        tie_btn.addEventListener("click",(e)=>{
            hanzi_tie_lists.classList.toggle("hide")
            e.preventDefault()
        },{passive:false})
        lists.forEach(li=>{
            const size = Number(li.id.replace("tie",""))
            if(size == options["hanzi_origin_size"]){
                li.classList.add("selected")
                tie_btn.innerText = "字帖尺寸[" + li.innerText +"]"
            }
            li.addEventListener("click",e=>{
                const target = e.target
                options["hanzi_origin_size"] = size
                tie_btn.innerText = "字帖尺寸[" + target.innerText +"]"
                const selectedNodes = hanzi_tie_lists.querySelectorAll("selected")
                selectedNodes.forEach(node=>node.classList.remove("selected"))
                target.classList.add("selected")
                db.update_options(options).then(()=>{
                    window.location.reload(true);
                })
            },{passive:false})
        })
    }

    function set_respeak_event(){
        const respeak = document.getElementById("respeak")
        respeak.addEventListener("click",e=>{
            if(respeak.word){
                speak(respeak.word,true)

            }
        },{passive:false})
        
    }
    function set_tooltip_event(){
        let tooltip = document.getElementById("tooltip")
        tooltip.addEventListener("tip-event",event=>{
            const text = typeof(event.detail)=='function' ? event.detail() :false;
            if(!text) return
            clearTimeout(tooltipTimeoutHandle)
            tooltip.innerText = text
            tooltip.style.display="flex"
            tooltipTimeoutHandle = setTimeout(()=>tooltip.style.display="none",4000)
        },{passive:false})
    }
    async function main(){ 
    
        await init()
        initChapters()
        initSpeakerLists()
        hanzi_size_set_event()
        set_respeak_event()
        if(options["show_character"] == "on" || options["show_outline"] =="on" ){
            set_tooltip_event()
        }
        let show_outline_btn = document.querySelector('#show_outline_btn'),
        // auto_write_btn = document.querySelector('#auto_write_btn'),
        show_character_btn = document.querySelector('#show_character_btn'),
        is_quizing_btn = document.querySelector('#is_quizing_btn');
        // speaker_select_btn = document.querySelector('#speaker_select');
        setCheckboxStatus(options.show_character,show_character_btn)
        // setCheckboxStatus(options.is_auto_write,auto_write_btn)
        setCheckboxStatus(options.show_outline,show_outline_btn)
        setCheckboxStatus(options.is_quizing,is_quizing_btn)
        //attachChangeEvent(showbtn)
        //attachChangeEvent(auto_write_btn)
        //attachChangeEvent(has_outline_btn)
        attachChangeEvent(is_quizing_btn)
        attachChangeEvent(show_outline_btn)
        attachChangeEvent(show_character_btn)
    }
    return {start : async ()=>await main() }
}


