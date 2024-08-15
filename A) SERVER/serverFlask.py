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

        rowsPriority = cursorSQL.execute(f"SELECT CODIGO, DESCRIPCION, PVENTA, MAYOREO, TVENTA FROM PRODUCTOS WHERE DESCRIPCION LIKE '{value}%'")
        
        for row in rowsPriority:
            alreadyAdd.add(row[0])
            searchResults.append(row)

        rowsComplementary = cursorSQL.execute(f"SELECT CODIGO, DESCRIPCION, PVENTA, MAYOREO, TVENTA FROM PRODUCTOS WHERE DESCRIPCION LIKE '%{value}%'")
        for row in rowsComplementary:
            if row[0] not in alreadyAdd:
                searchResults.append(row)

        res = searchResults
            

    conSQL.close()
    return jsonify({'info': res})

@app.route('/submit/ticket', methods=['POST'])
def process_data():
    try:
        data = request.get_json()
        if data is None:
            return jsonify({'error': 'No se recibió ningún JSON'}), 400

        params = [
            data.get('codigo'),
            data.get('descripcion'),
            data.get('tipoVenta'),
            data.get('pcosto'),
            data.get('pventa'),
            data.get('mayoreo'),
            data.get('dept'),
            data.get('prioridad'),
            data.get('inventarioActual'),
            data.get('inventarioMinimo'),
            data.get('inventarioMaximo'),
            data.get('checadoEn'),
            data.get('porcentaje_ganancia'),
        ]
        
        conSQL = sqlite3.connect("./pchdata.sqlite3")
        cursorSQL = conSQL.cursor()
        sqlQuery = 'INSERT INTO PRODUCTOS (CODIGO, DESCRIPCION, TVENTA, PCOSTO, PVENTA, DEPT, MAYOREO, IPRIORIDAD, DINVENTARIO, DINVMINIMO, DINVMAXIMO, CHECADO_EN, PORCENTAJE_GANANCIA) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)'
        cursorSQL.execute(sqlQuery, params)
        conSQL.commit()
        conSQL.close()

        return jsonify({'received_data': data})
    
    except Exception as e:
        return jsonify({'error': 'error at insert new product'})
    

def openHTML():
    run(['index.html'], shell=False, creationflags=CREATE_NEW_CONSOLE)

def startFlaskServer():
    app.run(debug=False,host='192.168.1.180', port=5000)

if __name__ == '__main__':
    #Iniciamos el servicio y abrimos la pagina web :)
    flaskServer = threading.Thread(target=startFlaskServer)
    html = threading.Thread(target=openHTML)
    
    flaskServer.start()
    #html.start()
    