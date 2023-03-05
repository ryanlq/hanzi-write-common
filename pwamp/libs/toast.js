//destory last toast
if(document.querySelector("#toast")){
    document.querySelector("#toast").remove()
}

let container =document.createElement("div") 
container.id = "toast"

container.style=`
    background-color:#000;
    width:100%;
    height:auto;
    color:#eee;
    box-shadow: 0 2px 5px 0 rgb(0 0 0 / 26%);
    overflow: hidden;
    padding: 16px;
    position:fixed;
    z-index:999;
    left: 0;
    text-align: center;
    
`

export function toast(msg){
    const toastNode = container.cloneNode(true)
    toastNode.innerText = msg
    document.body.appendChild(toastNode)
    setTimeout(() => {
        toastNode.remove()
    }, 1000);
}