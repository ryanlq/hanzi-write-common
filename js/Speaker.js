function Speaker(){
    
    const edge_nature_voices = ["MicrosofSt Xiaoxiao Online (Natural) - Chinese (Mainland)","Microsoft Yunxi Online (Natural) - Chinese (Mainland)"]
    let synth,voicelists,zh_voices,supported_natural,usedVoice;
    synth = window.speechSynthesis;
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
        voicelists = setSpeech();
        voicelists.then((voices) =>{
            zh_voices = voices.filter(function (voice) {
                return voice.lang == "zh-CN"
             });
            supported_natural = zh_voices.filter(voice=>{
                return edge_nature_voices.includes(voice.name)
            }) 
            usedVoice = zh_voices[0] 
            //usedVoice = supported_natural.length ?supported_natural[0] :zh_voices[0]
        }); 
    }
    
    setVoice()
    
    
    function speak(text) {
        synth.cancel()
        if (synth.speaking) {
          //console.error("speechSynthesis.speaking");
          return;
        }
      
        if (text !== "") {
          const utterThis = new SpeechSynthesisUtterance(text);
      
          utterThis.onend = function (event) {
            //console.log("SpeechSynthesisUtterance.onend");
          };
      
          utterThis.onerror = function (event) {
            //console.error("SpeechSynthesisUtterance.onerror");
          };
          utterThis.voice = usedVoice;
          utterThis.pitch = 1;
          utterThis.rate = 1;
          console.log(utterThis)
          synth.speak(utterThis);
        }
      }
      return (text)=>speak(text)
}




