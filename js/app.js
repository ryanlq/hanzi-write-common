function app(){
    async function init(){
        options = await db.get_options()
        if(!options){
            await db.init_options()
            options = await db.get_options()
        } 
        console.log("app/init",options)
        return options
    
    }
    
    function fullscreen(){
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen();
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            }
        }
    }
    
    function initChapters(){
        const chaptersNode = document.querySelector('#chapters')
        const chapterbtn = chaptersNode.querySelector('#chapters_btn')
        const chapter_lists = chaptersNode.querySelector('#chapter_lists')
        const chapters = chaptersNode.querySelectorAll('li')
        chapterbtn.addEventListener("click",(e)=>{
            chapter_lists.classList.toggle("hide")
        })
        chapters.forEach((chapter,i)=>{
            if(options['current_chapter'] == i){
                chapter.classList.add('selected')
            }
            chapter.addEventListener("click",function(e){
                const selectedNodes = chaptersNode.querySelectorAll("selected")
                selectedNodes.forEach(node=>node.classList.remove("selected"))
                options['current_chapter'] = Number(e.target.id.replace("chapter",""))
                e.target.classList.add("selected")
                db.update_options(options).then(()=>{
                    window.location.reload(true);
                })
                // elem.dispatchEvent(chapterChangeEvent);
            },{passive:false})
        })
    }
    function setCheckboxStatus(is_set ,el){
        console.log(is_set,el)
        if(is_set == "on"){
            el.setAttribute('checked','checked')
            el.value = "on"
        } else {
            el.removeAttribute('checked')
            el.value = "off"
        }
    }
    function attachChangeEvent(el){
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
        })
    }
    
    async function main(){
    
        await init()
        initChapters()
        const showbtn = document.querySelector('#showbtn'),
        auto_write_btn = document.querySelector('#auto_write_btn'),
        has_outline_btn = document.querySelector('#has_outline_btn'),
        is_quizing_btn = document.querySelector('#is_quizing_btn');
        //setCheckboxStatus(options.is_show,showbtn)
        setCheckboxStatus(options.is_auto_write,auto_write_btn)
        //setCheckboxStatus(options.has_outline,has_outline_btn)
        setCheckboxStatus(options.is_quizing,is_quizing_btn)
        //attachChangeEvent(showbtn)
        attachChangeEvent(auto_write_btn)
        //attachChangeEvent(has_outline_btn)
        attachChangeEvent(is_quizing_btn)
    }
    return {start : async ()=>await main() }
}


