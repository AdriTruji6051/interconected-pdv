from subprocess import run, CREATE_NEW_CONSOLE
from flask import Flask, jsonify, request
from flask_cors import CORS
import threading
import sqlite3

app = Flask(__name__)
CORS(app)


@app.route('/product', methods=['GET'])
def sqlQuery():
    res = ''
    value = request.args.get('value')
    conSQL = sqlite3.connect("./pchdata.sqlite3")
    cursorSQL = conSQL.cursor()
    rows = cursorSQL.execute(f"SELECT * FROM productos WHERE codigo = '{value}'")
    
    for row in rows:
        res = str(row)
        break

    if not res:
        print('Not res...')
        alreadyAdd = set()
        searchResults = []

        rowsPriority = cursorSQL.execute(f"SELECT * FROM productos WHERE descripcion LIKE '{value}%'")
        
        for row in rowsPriority:
            alreadyAdd.add(row[0])
            searchResults.append(row)

        rowsComplementary = cursorSQL.execute(f"SELECT * FROM productos WHERE descripcion LIKE '%{value}%'")
        for row in rowsComplementary:
            if row[0] not in alreadyAdd:
                searchResults.append(row)

        res = searchResults
            

    conSQL.close()
    return jsonify({'info': res})

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
    