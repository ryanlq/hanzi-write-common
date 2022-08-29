# -*- coding: utf-8 -*-
"""
爬虫：从百度汉语中爬取词语拼音、解释、近义词、反义词
"""

import random
import time
import requests
from bs4 import BeautifulSoup


# 爬取成功的词语写入excel文件
import os
import time
import xlwt

commonwords=[
"一了人又儿力几十入八个上大子也下小于么之己女已与三工才门口马山万士飞干及久千义习土广丈不为中以天心开从无日手方长分世什见文公月井车气太比夫书水少父友认内风今王化切片元反火五巴队办计双历仅毛专引仍支木艺六区止他们生年出可去对发只用它头正尔本外打加电主由写白乐东记处让母平民边叫立四失目业必布司未且台北乎令术市半石古尼节包另示史卡兰句",
"号皮永礼务议印在有地那她后自会而过多好当成如同行动回老名次此问西向全机并再代许先死安光色字场关至军岁任吃妈师达吗欢约各合论交决传则早产观尽红百亚兴收讲式华似米衣争伤妇纪买共考价刚存众血列设阳导创我这来时你里没把还作但位因间两身进走声每别体却利听克员住花更应报张告何男快远条完求找言即医运近坐连夜形吧识步希极足诉丽系志社究块灵改沉怀",
"苏初际纸李纳助严证饭忘弟否的到国和学事现些所经法知使者其话明定果实信物受表性或命拉直放英往度金变呢始空怎非罗该终林制画房苦视奇朋青爸周取妻转刻建诗单治幸念怕功官易居图细味注备试显底参线京波店是说要看种美总面前很给亲活点孩相将重便界结神候觉带原战音轻思语科指保院品星类送首客南统城故选绝树持独复举钟待穿室突哪费具响食甚某须查除亮虽养",
"香帝春研皇段急庭草背家能都起样爱被高特真部海难教笑通格病钱离流请读留热造谈容根拿称站紧谁准消酒息倒脑般破笔校娘料调座致验班顿展获害着得第情常理做眼望接深清晚球随您领断惊脸维基竟商黄脚据密梦假掉停够排就然道最期斯等象提喜曾量答婚越落强装黑联痛确游程富跑温集普奥谢朝遇街鲁想意感新像路解数满照福跟微错睡跳群睛管演愿精静阿算需歌赛趣察德"
]



success = []
omission = []
count = 0



def queryword(word):
    temp = []
    temp.append(word)
    url = 'https://hanyu.baidu.com/s?wd=' +word + '&ptype=zici'
    try:
        response = requests.get(url)
        content = response.content.decode()
        soup = BeautifulSoup(content, "lxml")
        pinyindiv = soup.find(id="pinyin", class_='pronounce')
        #pinyin_dt = soup.find(name='dt', class_='pinyin')
        pinyin_dt = pinyindiv.span.b
        pinyin = pinyin_dt.get_text().replace(' ', '')
        temp.append(pinyin)

        meaning_div = soup.find(name='div', class_='tab-content')
        meaning = meaning_div.get_text().replace('\n', '').replace(' ', '')
        meaning = meaning.replace(pinyin, '')
        temp.append(meaning)

        zucidiv = soup.find(id="zuci-wrapper")
        zucicontent = zucidiv.find(class_="tab-content")
        zucistr = ""
        for child in zucicontent.children:
            if zucistr != "": 
                zucistr += ","
            zucistr += child.get_text()
        temp.append(zucistr)
        #temp.append(antonym)
        success.append(temp)
        return 0;
    except Exception as e:
        # 访问异常的错误编号和详细信息
        print(e.args)
        print(str(e))
        print(repr(e))
        omission.append(word)
        return -1;



# for i in range(len(commonwords)):
for i in range(len(commonwords)):
    _word = commonwords[i]
    for j in range(len(_word)):

        ret = queryword(_word[j])
        if ret == 0:
            count += 1
            print("第"+str(count)+'个已完成')
            sleep = random.uniform(0.5, 1.5)
            time.sleep(sleep)


path = r'F:\codes\drawboard\tests\BaiduCrawler-master\BaiduCrawler-master\data'
workbook = xlwt.Workbook(encoding = 'utf-8')
excel_sheet_name = time.strftime('%Y%m%d')
worksheet = workbook.add_sheet(excel_sheet_name)

worksheet.write(0, 0, label = '词语')
worksheet.write(0, 1, label = '拼音')
worksheet.write(0, 2, label = '释义')
worksheet.write(0, 3, label = '近义词')
worksheet.write(0, 4, label = '反义词')

for i in range(len(success)):
    for j in range(len(success[i])):
        worksheet.write(i+1, j, label = success[i][j])

outfile_name = excel_sheet_name + '词语爬虫success.xls'
file_path = os.path.join(path, outfile_name)
workbook.save(file_path)

# 未爬取成功的词语写入本地txt
omission_file = excel_sheet_name + '词语爬虫omission.txt'
omission_path = os.path.join(path, omission_file)
with open(omission_path,'w',encoding='utf-8') as f:
    for i in omission:
        f.write(i+'\n')

print('全部词语意思爬取完成，请检查未爬取成功词语omission.txt')


