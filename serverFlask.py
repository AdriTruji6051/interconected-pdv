from subprocess import run, CREATE_NEW_CONSOLE
from flask import Flask, jsonify, request
from flask_cors import CORS
import threading
import sqlite3
import json
from printer_mediator import list_printers, print_ticket, create_ticket_struct

app = Flask(__name__)
CORS(app, supports_credentials=True)

#   Herramientas para las rutas del servidor
def calculate_total_bill(products):
    total_local = 0
    for key in products:
        IMPORTE = products[key]['IMPORTE']
        total_local += IMPORTE
    return total_local



#   GET SENTENCES
@app.route('/get/product', methods=['GET'])
def getProduct():
    res = None
    value = request.args.get('value')
    conSQL = sqlite3.connect("./pchdata.sqlite3")
    cursorSQL = conSQL.cursor()
    rows = cursorSQL.execute(f"SELECT CODIGO, DESCRIPCION, TVENTA, PCOSTO, PVENTA, DEPT, MAYOREO, IPRIORIDAD, DINVENTARIO, DINVMINIMO, DINVMAXIMO, CHECADO_EN, PORCENTAJE_GANANCIA FROM PRODUCTOS WHERE CODIGO = '{value}'")
    
    for row in rows:
        res = row
        break
    
    if res:
        res = {
            'CODIGO': res[0],
            'DESCRIPCION': res[1],
            'TVENTA': res[2],
            'PCOSTO': res[3],
            'PVENTA': res[4],
            'DEPT': res[5],
            'MAYOREO': res[6],
            'IPRIORIDAD': res[7],
            'DINVENTARIO': res[8],
            'DINVMINIMO': res[9],
            'DINVMAXIMO': res[10],
            'CHECADO_EN': res[11],
            'PORCENTAJE_GANANCIA': res[12],
        }

        res = json.dumps(res)

    if not res:
        alreadyAdd = set()
        searchResults = []

        rowsPriority = cursorSQL.execute(f"SELECT CODIGO, DESCRIPCION, TVENTA, PCOSTO, PVENTA, DEPT, MAYOREO, IPRIORIDAD, DINVENTARIO, DINVMINIMO, DINVMAXIMO, CHECADO_EN, PORCENTAJE_GANANCIA FROM PRODUCTOS WHERE DESCRIPCION LIKE '{value}%'")
        
        for row in rowsPriority:
            alreadyAdd.add(row[0])
            jsonRow = {
                'CODIGO': row[0],
                'DESCRIPCION': row[1],
                'TVENTA': row[2],
                'PCOSTO': row[3],
                'PVENTA': row[4],
                'DEPT': row[5],
                'MAYOREO': row[6],
                'IPRIORIDAD': row[7],
                'DINVENTARIO': row[8],
                'DINVMINIMO': row[9],
                'DINVMAXIMO': row[10],
                'CHECADO_EN': row[11],
                'PORCENTAJE_GANANCIA': row[12],
            }
            searchResults.append(jsonRow)

        rowsComplementary = cursorSQL.execute(f"SELECT CODIGO, DESCRIPCION, TVENTA, PCOSTO, PVENTA, DEPT, MAYOREO, IPRIORIDAD, DINVENTARIO, DINVMINIMO, DINVMAXIMO, CHECADO_EN, PORCENTAJE_GANANCIA FROM PRODUCTOS WHERE DESCRIPCION LIKE '%{value}%'")
        for row in rowsComplementary:
            if row[0] not in alreadyAdd:
                jsonRow = {
                    'CODIGO': row[0],
                    'DESCRIPCION': row[1],
                    'TVENTA': row[2],
                    'PCOSTO': row[3],
                    'PVENTA': row[4],
                    'DEPT': row[5],
                    'MAYOREO': row[6],
                    'IPRIORIDAD': row[7],
                    'DINVENTARIO': row[8],
                    'DINVMINIMO': row[9],
                    'DINVMAXIMO': row[10],
                    'CHECADO_EN': row[11],
                    'PORCENTAJE_GANANCIA': row[12],
                }
                searchResults.append(jsonRow)

        res = searchResults
            

    conSQL.close()
    return jsonify({'product': res})

@app.route('/get/productById', methods=['GET'])
def getProductById():
    res = None
    value = request.args.get('value')
    conSQL = sqlite3.connect("./pchdata.sqlite3")
    cursorSQL = conSQL.cursor()
    rows = cursorSQL.execute(f"SELECT CODIGO, DESCRIPCION, TVENTA, PCOSTO, PVENTA, DEPT, MAYOREO, IPRIORIDAD, DINVENTARIO, DINVMINIMO, DINVMAXIMO, CHECADO_EN, PORCENTAJE_GANANCIA FROM PRODUCTOS WHERE CODIGO = '{value}'")

    for row in rows:
        res = row
        break

    conSQL.close()

    if res:
        res = {
            'CODIGO': res[0],
            'DESCRIPCION': res[1],
            'TVENTA': res[2],
            'PCOSTO': res[3],
            'PVENTA': res[4],
            'DEPT': res[5],
            'MAYOREO': res[6],
            'IPRIORIDAD': res[7],
            'DINVENTARIO': res[8],
            'DINVMINIMO': res[9],
            'DINVMAXIMO': res[10],
            'CHECADO_EN': res[11],
            'PORCENTAJE_GANANCIA': res[12],
        }

        res = json.dumps(res)
        
    return jsonify({'product': res})


#   PRODUCT CRUD LOGIC
@app.route('/insert/product', methods=['POST'])
def insertProduct():
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
        sql = 'INSERT INTO PRODUCTOS (CODIGO, DESCRIPCION, TVENTA, PCOSTO, PVENTA, DEPT, MAYOREO, IPRIORIDAD, DINVENTARIO, DINVMINIMO, DINVMAXIMO, CHECADO_EN, PORCENTAJE_GANANCIA) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)'
        cursorSQL.execute(sql, params)
        conSQL.commit()
        conSQL.close()

        return jsonify({'status': 201})
    
    except Exception as e:
        print(e)
        return jsonify({'status': 409})

@app.route('/update/product', methods=['POST'])
def updateProduct():
    try:
        data = request.get_json()
        if data is None:
            return jsonify({'error': 'No se recibió ningún JSON'}), 400

        params = [
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
            data.get('codigo'),
        ]
        
        conSQL = sqlite3.connect("./pchdata.sqlite3")
        cursorSQL = conSQL.cursor()
        sql = 'UPDATE PRODUCTOS SET DESCRIPCION = ?, TVENTA = ?, PCOSTO = ?, PVENTA = ?, DEPT = ?, MAYOREO = ?, IPRIORIDAD = ?, DINVENTARIO = ?, DINVMINIMO = ?, DINVMAXIMO = ?, CHECADO_EN = ?, PORCENTAJE_GANANCIA = ? WHERE CODIGO = ?;'
        cursorSQL.execute(sql, params)
        conSQL.commit()
        conSQL.close()

        return jsonify({'status': 201})
    
    except Exception as e:
        print(e)
        return jsonify({'status': 409})

@app.route('/delete/product', methods=['POST'])
def deleteProduct():
    try:
        data = request.get_json()
        if data is None:
            return jsonify({'error': 'No se recibió ningún JSON'}), 400

        params = [
            data.get('codigo')
        ]
        
        conSQL = sqlite3.connect("./pchdata.sqlite3")
        cursorSQL = conSQL.cursor()
        sql = 'DELETE FROM PRODUCTOS WHERE CODIGO = ?;'
        cursorSQL.execute(sql, params)
        conSQL.commit()
        conSQL.close()

        return jsonify({'status': 202})
    
    except Exception as e:
        print(e)
        return jsonify({'status': 409})

#   TICKET PRINTER LOGIC
@app.route('/get/printers', methods=['GET'])
def getPrinters():
    return jsonify({'printers': list_printers()})

@app.route('/print/new/ticket', methods=['POST'])
def createTicket():
    print('Holis')
    try:
        data = request.get_json()
        if data is None:
            print('No data')
            return jsonify({'error': 'No se recibió ningún JSON'}), 400
        
        willPrint = bool(data.get('print'))
        products = data.get('products')
        printerName = data.get('printerName')
        total = calculate_total_bill(products)

        if willPrint : print_ticket(create_ticket_struct(products),printerName)

        #AQUI DEBEMOS CREAR LA ESTRUCTURA DEL TICKET Y GUARDARLO EN LA BD

        return jsonify({'impresion': 'EXITOSA'})
    except Exception as e:
        print(e)
        return jsonify({'impresion': 'DENEGADA'})

@app.route('/print/ticket', methods=['GET'])
def rePrintTicket():
    return

#Fin de rutas de la API
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
    