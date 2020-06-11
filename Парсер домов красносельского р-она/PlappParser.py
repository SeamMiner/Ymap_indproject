from bs4 import BeautifulSoup as bs
import requests as req

# Glossary contain addresses, which you use
glossary = ['ул. Маршала Казакова', 'б-р. Балтийский', 'пр-кт. Ленинский', 'пр-кт. Патриотов', 'ул. Маршала Захарова',
            'пр-кт. Героев', 'ул. Доблести', 'ул. Адмирала Черокова', 'ул. Адмирала Трибуца', 'ул. Катерников',
            'ш. Петергофское', 'пр-кт. Кузнецова', 'б-р. Брестский', 'ул. Десантников', 'ул. Котина',
            'пр-кт. Маршала Жукова', 'ул. Партизана Германа', 'ул. Чекистов', 'ул. Авангардная', 'ул. Добровольцев',
            'ул. Здоровцева', 'ул. Отважных', 'пр-кт. Народного Ополчения', 'ул. Тамбасова', 'ул. Новобелицкая',
            'ул. Пограничника Гарькавого', 'ул. 2-я Комсомольская', 'ул. Лётчика Пилютова', 'пр-кт. Ветеранов',
            'ул. Пионерстроя']

# Increasing speed of program running. Here will contain IDs of needed pages (use when build url)
good_id = []

for pag_id in range(1, 188):

    response = req.get("http://dom.mingkh.ru/sankt-peterburg/sankt-peterburg/houses?page=" + str(pag_id))

    soup = bs(response.text, 'lxml')

    table_info = soup.find('table', {'class': 'table table-bordered table-striped table-hover'}).find('tbody')
    for record in table_info.find_all('tr'):
        tmp = str(record.select("td:nth-of-type(3)"))
        for address in glossary:
            if address in tmp:
                tmp = tmp[tmp.find('"') + 1:]
                tmp = tmp[:tmp.find('"')]
                tmp = tmp.replace('sankt-peterburg', '')
                tmp = tmp.replace('/', '')
                good_id.append(int(tmp))

# Here you open file for write parsed information
storage = open('C:/Users/Daniil/Desktop/Python/Python Parsing/Парсер домов красносельского р-она/Plapp_info_IP.txt', 'a')

# for id in (good_id):  # piece of necessary code (it is commented for testing)
for i in range(2):  # for testing (low load), delete when use parser
    id = i + 1  # for testing (low load), delete when use parser
    try:
        # response = req.get("http://dom.mingkh.ru/sankt-peterburg/sankt-peterburg/" + str(id))  #piece of necessary code (it is commented for testing)
        response = req.get("http://dom.mingkh.ru/sankt-peterburg/sankt-peterburg/16416")  # for testing (low load), delete when use parser
        # if response.status_code == 404:  # necessary if you use method brute force for parsing (this and next strings)
        #     continue
    except:
        continue

    soup = bs(response.text, 'lxml')

    try:
        necessary_info = [['Адрес', ''], ['Год постройки', ''], ['Серия, тип постройки', '']]  # necessary for you)
        common_info = soup.find("p", {'class': 'seo-text margin-bottom-20'}).text
        for j in range(len(glossary)):
            if glossary[j] in common_info:
                break
        else:
            continue
        info_table = soup.find("dl", {'class': 'dl-horizontal house'})
        pairs_info = list(zip(info_table.find_all('dt'), info_table.find_all('dd')))
        for pair in pairs_info:
            tmp = pair[0]
            if necessary_info[0][0] in tmp:
                necessary_info[0][1] = pair[1]
            elif necessary_info[1][0] in tmp:
                necessary_info[1][1] = pair[1]
            elif necessary_info[2][0] in tmp:
                necessary_info[2][1] = pair[1]
        for j in range(len(necessary_info)):
            if necessary_info[j][1]:
                tmp = str(necessary_info[j][1])
                tmp = tmp[tmp.find('>') + 1:]
                tmp = tmp[:tmp.find('<')]
                tmp = tmp.replace('\xa0\xa0\xa0', '')
                necessary_info[j][1] = tmp
        storage.write(necessary_info[0][1] + ';' + necessary_info[1][1] + ';' + necessary_info[2][1] + '\n')
    except:
        pass
storage.close()
