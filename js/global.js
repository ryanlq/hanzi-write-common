let db = storeDB()
let speak = Speaker()
let options ;
let speak_word;

document.body.addEventListener("click",(e)=>{
    if(!["chapters","chapters_btn"].includes(e.target.id) ){
        const chapter_lists = document.querySelector("#chapter_lists")
        chapter_lists.classList.add("hide")
    }
    if(!["speaker_select","speaker_select_btn"].includes(e.target.id) ){
        const speaker_select_lists = document.querySelector("#speaker_select_lists")
        speaker_select_lists.classList.add("hide")
    }
    if(!["tie","tie_btn"].includes(e.target.id) ){
        const tie_sizes = document.querySelector("#tie_sizes")
        tie_sizes.classList.add("hide")
    }
},{passive:true})

const tooltipEvent = new CustomEvent("tip-event",{detail:()=>speak_word})
let tooltipTimeoutHandle ;