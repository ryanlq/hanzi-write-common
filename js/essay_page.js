function generate_pinyin(text){

    if (!Pinyin.isSupported() || !text) {
        return false
    }

    return "<rt>"+Pinyin.convertToPinyin(text," ",true)+"</rt>"
}