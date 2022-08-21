var db = storeDB()
let speak = Speaker()
var options ;

document.body.addEventListener("click",(e)=>{
    if(!["chapters","chapters_btn"].includes(e.target.id) ){
        const chapter_lists = document.querySelector("#chapter_lists")
        chapter_lists.classList.add("hide")
    }
    if(!["speaker_select","speaker_select_btn"].includes(e.target.id) ){
        const speaker_select_lists = document.querySelector("#speaker_select_lists")
        speaker_select_lists.classList.add("hide")
    }
},{passive:true})