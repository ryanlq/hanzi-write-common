const text = "[00:00.000] 作词 : 球球/代诗琪/来建增[00:00.523] 作曲 : Ewen贰文[00:01.046] 编曲 : 张黎[00:01.569] 制作人 : 高孟昊[00:02.93]【马嘉祺】[00:03.06]树影像只猫 慢慢地爬上屋檐[00:07.50]夕阳染红天色和你的脸[00:11.78]【丁程鑫】[00:11.91]扔只千纸鹤 将心事飞远[00:14.69]晴朗的天气和季节[00:18.75]【刘耀文】[00:18.88]我想你呀 去追赶 你步履 被梦扰进 你的漩涡里[00:23.49]心动呀 犹豫地 探出手 朦胧不清 暧昧的情绪[00:27.50]【宋亚轩】[00:27.61]怦怦地 脉搏跳动着秘密[00:31.54]关于你 小窃喜 心哒哒滴滴[00:35.54]【马嘉祺】+【丁程鑫】[00:35.67]渐 渐 渐 渐 我渐暖躁动粉红的 心软绵绵[00:39.79]【宋亚轩】+【刘耀文】[00:39.92]欢喜的眼 指尖的试探 尤为明显[00:43.73]【张真源】+【严浩翔】+【贺峻霖】[00:43.85]牵 牵 牵 牵你去冒险 手掌心令人眷恋[00:48.27]【ALL】[00:48.38]像融化在 柔软的云间[00:52.64][01:09.45]【严浩翔】[01:09.61]看城市浪漫烟火气 散落成人间万家星[01:14.22]你眸中 盛满了 晚空璀璨风景[01:17.51]【贺峻霖】[01:17.70]我假装 当作 不在意 呆呆地 凝望向你[01:21.56]【张真源】[01:21.70]只一眼 就动心 就嘀滴哒滴[01:25.71][01:25.83]【宋亚轩】[01:25.94]渐 渐 渐 渐 我渐暖的心沉溺于浪漫冒险[01:30.18]烧红的脸 加倍地惦念 生怕露怯[01:33.98]【张真源】[01:34.08]念 念 念 念 踩你影子 碎碎念 将你紧牵[01:38.57]【ALL】[01:38.70]等你陪我 穿梭过时间[01:42.53]【刘耀文】[01:42.63]我想要紧紧追赶你步履 永远存在你的视线里[01:46.80]怎么办你甜甜对我笑 我就沦陷在你酒窝里[01:50.78]【丁程鑫】[01:50.93]忽然间 天空飘起 了小雨[01:54.85]屋檐下 并肩听 雨哒哒嘀嘀[01:59.12]【马嘉祺】[01:59.25]渐 渐 渐 渐 我渐暖的心沉溺于浪漫冒险[02:03.44]烧红的脸 加倍地惦念 生怕露怯[02:07.31]【张真源】[02:07.45]念 念 念 念 踩你影子 碎碎念 将你紧牵[02:11.99]等你陪我 穿梭过时间[02:15.72]【严浩翔】[02:15.86]黏 黏 黏 黏 想黏在你身边 我的心软绵绵[02:20.27]欢喜的眼 指尖的试探 尤为明显[02:24.08]【贺峻霖】[02:24.23]牵 牵 牵 牵你去冒险 手掌心令人眷恋[02:28.74]像融化在 柔软的云间[02:32.22]【ALL】[02:32.37]偏偏 偏偏 我的心偏偏只对你魂绕梦牵[02:36.89]坠入爱河 橘红色夜空 有些危险[02:40.71]偏偏 偏偏 花火上升 一瞬间情愫蔓延[02:45.27]心怀诗意 将故事续写[02:47.142] 配唱制作人 : 高孟昊[02:49.257] 录音 : 邢铜@55TEC Studio[02:51.372] 和声 : 付垚[02:53.487] 吉他 : 牛子健/王大夫[02:55.602] 混音 : Lance Powell[02:57.717] 母带 : 全相彦@OKmastering Studio（北京）[02:59.832] A&R : 高孟昊[03:01.947] 项目统筹 : 高孟昊/来建增[03:04.062] 监制 : Yi Han[03:06.177] 总监制 : 陈国威 Andrew Chan@索尼音乐[03:08.292] 营销 : 大声密谋/喵拳出击[03:10.407] （未经著作权人许可，不得翻唱、翻录或使用）"
export class Lyric{
    constructor(){
        this.lyric = "";
        this.symbols = []
    }
    load(text){
        if(!text) return false;
        let textlist = text.split("[")
        let results = {}
        let items = textlist.forEach(t=>{
            if(!t) return ;
            const pairs = t.split("]") 
            if(pairs.length < 2 || !pairs[1]) return;
            const matchs = pairs[0].match(/\d\d:\d\d/)
            results[matchs[0]] = pairs[1]
        }) 
        this.lyric = results;
        this.symbols = Object.keys(results)
    }
    
    getLyric(){
        return this.lyric
    }
    getSymbols(){
        return this.lyric
    }
}
