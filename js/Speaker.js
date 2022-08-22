function Speaker(){
    
    const edge_nature_voices = ["MicrosofSt Xiaoxiao Online (Natural) - Chinese (Mainland)","Microsoft Yunxi Online (Natural) - Chinese (Mainland)"]
    let synth,voicelists,zh_voices,supported_natural,usedVoice;
    synth = window.speechSynthesis;
    let utterThis = new SpeechSynthesisUtterance()
    function setSpeech() {
        return new Promise(
            function (resolve, reject) {
                let synth = window.speechSynthesis;
                let id;
    
                id = setInterval(() => {
                    if (synth.getVoices().length !== 0) {
                        resolve(synth.getVoices());
                        clearInterval(id);
                    }
                }, 10);
            }
        )
    }
    
    function setVoice(){
        const speakerlistNode = document.querySelector("#speaker_select .lists")
        const li = document.createElement("li")
        voicelists = setSpeech();
        voicelists.then((voices) =>{
            
            zh_voices = voices.filter(function (voice) {
                return voice.lang == "zh-CN"
             });
            supported_natural = zh_voices.filter(voice=>{
                return edge_nature_voices.includes(voice.name)
            }) 
            usedVoice = zh_voices[0] 
            zh_voices.forEach( (voice,i) => {
                let newli = li.cloneNode(true)
                newli.innerText = voice.name;
                newli.voice = voice
                newli.id = "speaker"+i
                newli.addEventListener("click",(e)=>{
                    usedVoice = newli.voice;
                })
                speakerlistNode.appendChild(newli)
            });
            //usedVoice = supported_natural.length ?supported_natural[0] :zh_voices[0]
        }); 
    }
    
    setVoice()
    
    function get_extra(word){
        if(EXTRADATAS.hasOwnProperty(word)){
            let extrastr = EXTRADATAS[word]["relative"]
            let extrarr = extrastr.split(',')
            const len = extrarr.length-1;
            const decoration = "的"+word
            if(len > 3){
                let r1 = Math.round(Math.random()*len);
                let r2=Math.round(Math.random()*len);
                if(r1>len || r2>len || r1 == r2) {
                    r1 = 0;
                    r2=1;
                }
                return word +"," + extrarr[r1] +decoration +","+extrarr[r2] +decoration
            } else if(len == 1){
                return word +"," + extrarr[0] +decoration 
            } else {
                return word +"," + extrarr[0] +decoration +","+extrarr[1] +decoration
            }

        }
        return word
    }
    function speak(text) {
        synth.cancel()
        if (synth.speaking) {
          //console.error("speechSynthesis.speaking");
          return;
        }
      
        if (text !== "") {
          //const utterThis = new SpeechSynthesisUtterance(get_extra(text));
          utterThis.text = get_extra(text)
      
          utterThis.onend = function (event) {
            //console.log("SpeechSynthesisUtterance.onend");
          };
      
          utterThis.onerror = function (event) {
            //console.error("SpeechSynthesisUtterance.onerror");
          };
          utterThis.voice = usedVoice;
          utterThis.pitch = 1;
          utterThis.rate = 1;
          synth.speak(utterThis);
        }
      }
      return (text)=>speak(text)
}




