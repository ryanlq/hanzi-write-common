import os
import xmnlp
import json



xmnlp.set_model('E:/projects/nlp模型/xmnlp-onnx-models')

essays = ["曹冲称象","初冬","苦柚","挑山工","小小竹排画中游","叙利亚的卖水人"]


def get_segs(essay):
    content = []
    with open(essay+'.txt', encoding='utf-8') as file_obj:
        for line in file_obj:
            if(line!=""):
                _line = line.replace(" ", "")
                segs = xmnlp.seg(_line)
                if len(segs) >0:
                    content.append(xmnlp.seg(_line))
    return content


def main():
    all_eassy = {}
    for essay in essays:
        all_eassy[essay] = get_segs(essay)
    with open('all_eassy.json','w') as file:
        file.write(json.dumps(all_eassy))

main()
