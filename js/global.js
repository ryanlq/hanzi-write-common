var db = storeDB()
let speak = Speaker()
var options ;

document.body.addEventListener("click",(e)=>{
    if(!["chapters","chapters_btn"].includes(e.target.id) ){
        const chapter_lists = document.querySelector("#chapter_lists")
        chapter_lists.classList.add("hide")
    }
},{passive:true})