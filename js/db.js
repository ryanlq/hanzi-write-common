function storeDB(){
    let database = new Dexie("hanzi-writer");
    database.version(1).stores({
        configs: `
        id,
        options`,
    });
    async function init_options(){
        const options = await get_options_db()
        if(options) return ;
        await database.configs.bulkPut([
            { id: 1, options:{
                is_show: "on",
                is_auto_write: "on", 
                has_outline: "on", 
                is_quizing: "off", 
                current_chapter: 0 ,
                current_speaker: 0,
                hanzi_origin_size: 200,
                show_outline:"on",
                show_character:"on"

            }},
          ]).catch(err => {
      
            alert("Ouch... " + err);
      
          });
    }
    async function update_options_db(options){
        await database.configs.update(1, {options}).then(function (updated) {
            if (updated)
              console.log ("options changed");
            else
              console.log ("Nothing was updated ");
          });
    }
    async function get_options_db(){
        let configs = await database.configs.toArray();
        if(configs && configs.length) {
            return configs[0]["options"]
        } else {
            return false
        }
    }

    return {
        init_options:()=>init_options(),
        update_options:()=>update_options_db(options),
        get_options:()=>get_options_db(),
    }
}