from subprocess import run, CREATE_NEW_CONSOLE
from flask import Flask, jsonify, request
from flask_cors import CORS
from conn import getProducts
import threading
import asyncio

app = Flask(__name__)
CORS(app)
products = asyncio.run(getProducts())

@app.route('/product', methods=['GET'])
def sqlQuery():
    value = request.args.get('value')
    if value in products:
        res = str(products[value])
        print(res)
        return jsonify({'info': res})
    else:
        return jsonify({'info': 'Not Found'})

def openHTML():
    run(['index.html'], shell=False, creationflags=CREATE_NEW_CONSOLE)

def startFlaskServer():
    app.run(debug=False)

if __name__ == '__main__':
    #Debuggeando ando, zona de control
    cont = 0
    for pr in products:
        cont += 1
        print(pr)
    print(cont)

    #Iniciamos el servicio y abrimos la pagina web :)
    flaskServer = threading.Thread(target=startFlaskServer)
    html = threading.Thread(target=openHTML)
    
    flaskServer.start()
    html.start()
    
    
    