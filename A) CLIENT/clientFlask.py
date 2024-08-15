from subprocess import run, CREATE_NEW_CONSOLE
from flask import Flask, jsonify, request
from flask_cors import CORS
import threading
import sqlite3

app = Flask(__name__)
CORS(app)


@app.route('/get/product', methods=['GET'])
def sqlQuery():
    res = ''
    value = request.args.get('value')
    conSQL = sqlite3.connect("./pchdata.sqlite3")
    cursorSQL = conSQL.cursor()
    rows = cursorSQL.execute(f"SELECT DESCRIPCION, PVENTA, MAYOREO, TVENTA FROM PRODUCTOS WHERE codigo = '{value}'")
    
    for row in rows:
        res = str(row)
        break

    if not res:
        print('Not res...')
        alreadyAdd = set()
        searchResults = []

        rowsPriority = cursorSQL.execute(f"SELECT DESCRIPCION, PVENTA, MAYOREO, TVENTA FROM PRODUCTOS WHERE DESCRIPCION LIKE '{value}%'")
        
        for row in rowsPriority:
            alreadyAdd.add(row[0])
            searchResults.append(row)

        rowsComplementary = cursorSQL.execute(f"SELECT DESCRIPCION, PVENTA, MAYOREO, TVENTA FROM PRODUCTOS WHERE DESCRIPCION LIKE '%{value}%'")
        for row in rowsComplementary:
            if row[0] not in alreadyAdd:
                searchResults.append(row)

        res = searchResults
            

    conSQL.close()
    return jsonify({'info': res})


@app.route('/submit/ticket', methods=['POST'])
def process_data():
    data = request.get_json()  # Recibe el JSON enviado en el cuerpo de la solicitud
    if data is None:
        return jsonify({'error': 'No se recibió ningún JSON'}), 400
    
    # Aquí puedes procesar los datos recibidos
    # Por ejemplo, acceder a un valor específico en el JSON:
    if 'key1' in data:
        value = data['key1']
        print(f"Valor recibido para key1: {value}")
    
    # Devolver una respuesta con los datos recibidos
    return jsonify({'received_data': data})

def openHTML():
    run(['index.html'], shell=False, creationflags=CREATE_NEW_CONSOLE)

def startFlaskServer():
    app.run(debug=False)

if __name__ == '__main__':
    #Iniciamos el servicio y abrimos la pagina web :)
    flaskServer = threading.Thread(target=startFlaskServer)
    html = threading.Thread(target=openHTML)
    
    flaskServer.start()
    #html.start()

    # print('Socket v')
    # value = request.args.get('value')

    # #COMUNICACION CON SOCKET
    # client_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    # client_socket.connect(('192.168.1.76', 12345))
    # client_socket.sendall(value.encode('utf-8'))
    # data = client_socket.recv(1024)
    # print(f"Respuesta del servidor: {data.decode()}")
    # print(data.decode())
    # client_socket.close()