information = open('C:/Users/Daniil/Desktop/Plapp_info_IP.txt', 'r')

information = information.read()

split_information = information.split('\n')

for i in range(len(split_information)):
    split_information[i] = split_information[i].split(';')
    address, year, sere = split_information[i]
    print('{\"address\": \"' + address + '\", \n' + '\"year\": \"'
          + year + '\", \n' + '\"serie\": \"' + sere + '\"\n },')
