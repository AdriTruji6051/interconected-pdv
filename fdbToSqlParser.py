#Este metodo de acceso por abrir coneccion, query, cambios, commit y cerrar lo hace bastante mas lento, 
#pero al ser un proceso de un solo uso me facilita el mudar la base de datos de FDB a sqlite mediante un 
#codigo mas limpio 

import fdb
import ctypes
import sqlite3

def fdbQuery(query)-> list:
    ctypes.cdll.LoadLibrary('./fbclient.dll')
    con =  fdb.connect(
        dsn='PDVDATA.fdb', 
        user='SYSDBA', 
        password='masterkey',
        charset='NONE'
    )

    cur = con.cursor()
    cur.execute(query)

    queryResult = cur.fetchall()

    cur.close()
    con.close()

    return queryResult

def sqlite3Query(query) -> list:
    conSQL = sqlite3.connect("./pchdata.sqlite3")
    cursorSQL = conSQL.cursor()
    queryResult = cursorSQL.execute(query)
    conSQL.commit()
    conSQL.close()

    return queryResult

def sqlite3QueryParams(query, params) -> list:
    conSQL = sqlite3.connect("./pchdata.sqlite3")
    cursorSQL = conSQL.cursor()
    queryResult = cursorSQL.execute(query, params)
    conSQL.commit()
    conSQL.close()

    return queryResult

def sqlite3_Several_Querys(query, paramsArray):
    conSQL = sqlite3.connect("./pchdata.sqlite3")
    cursorSQL = conSQL.cursor()
    queryResult = []

    for params in paramsArray:
        try:
            queryResult.append(cursorSQL.execute(query, params))
        except Exception as e:
            print('-------------------------------------------->')
            print(f'Error al insertar el registro: "{params}"')
            print(e)

    conSQL.commit()
    conSQL.close()

    return queryResult

def productosParser() -> None:
    print('Exportando productos...')
    sqlite3Query('DROP TABLE IF EXISTS PRODUCTOS;')
    sqlite3Query('CREATE TABLE IF NOT EXISTS PRODUCTOS (CODIGO VARCHAR(50) PRIMARY KEY, DESCRIPCION TEXT ,TVENTA TEXT ,PCOSTO REAL,PVENTA REAL ,DEPT INTEGER,MAYOREO REAL,IPRIORIDAD INTEGER,DINVENTARIO REAL,DINVMINIMO REAL,DINVMAXIMO REAL,CHECADO_EN TEXT,PORCENTAJE_GANANCIA INTEGER);')

    sqlQuery = '''INSERT INTO PRODUCTOS (CODIGO,DESCRIPCION,TVENTA,PCOSTO, PVENTA,DEPT,MAYOREO,IPRIORIDAD,DINVENTARIO,DINVMINIMO,DINVMAXIMO,CHECADO_EN,PORCENTAJE_GANANCIA) VALUES (?, ?, ?, ?, ?,?, ?, ?, ?, ?,?, ?, ?);'''
    cur = fdbQuery('SELECT CODIGO, DESCRIPCION, TVENTA, PCOSTO, PVENTA, DEPT, MAYOREO, IPRIORIDAD, DINVENTARIO, DINVMINIMO, DINVMAXIMO, CHECADO_EN, PORCENTAJE_GANANCIA FROM PRODUCTOS;')
    
    sqlite3_Several_Querys(sqlQuery, cur)

def ventaTicketsParser() -> None:
    print('Exportando tickets...')
    sqlite3Query('DROP TABLE IF EXISTS VENTATICKETS;')
    sqlite3Query('CREATE TABLE VENTATICKETS (ID INTEGER, FOLIO INTEGER, CAJA_ID INTEGER, CAJERO_ID INTEGER, NOMBRE TEXT, CREADO_EN TEXT, SUBTOTAL REAL, IMPUESTOS REAL, TOTAL REAL, GANANCIA REAL, ESTA_ABIERTO INTEGER, CLIENTE_ID INTEGER, VENDIDO_EN TEXT, ES_MODIFICABLE TEXT, PAGO_CON REAL, MONEDA TEXT, NUMERO_ARTICULOS INTEGER, PAGADO_EN TEXT, ESTA_CANCELADO TEXT, OPERACION_ID INTEGER, OLD_TICKET_ID INTEGER, NOTAS BLOB, IMPRIMIR_NOTA TEXT, FORMA_PAGO TEXT, REFERENCIA TEXT, FACTURA_ID INTEGER, TOTAL_DEVUELTO REAL, PRIMARY KEY(ID AUTOINCREMENT));')

    sqlQuery = '''INSERT INTO VENTATICKETS (ID,FOLIO,CAJA_ID,CAJERO_ID,NOMBRE,CREADO_EN,SUBTOTAL,IMPUESTOS,TOTAL,GANANCIA,ESTA_ABIERTO,CLIENTE_ID,VENDIDO_EN,ES_MODIFICABLE,PAGO_CON,MONEDA,NUMERO_ARTICULOS,PAGADO_EN,ESTA_CANCELADO,OPERACION_ID,OLD_TICKET_ID,NOTAS,IMPRIMIR_NOTA,FORMA_PAGO,REFERENCIA,FACTURA_ID,TOTAL_DEVUELTO) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?, ?, ?, ?, ?, ?, ?);'''

    cur = fdbQuery('SELECT ID, FOLIO, CAJA_ID, CAJERO_ID, NOMBRE, CREADO_EN, SUBTOTAL, IMPUESTOS, TOTAL, GANANCIA, ESTA_ABIERTO, CLIENTE_ID, VENDIDO_EN, ES_MODIFICABLE, PAGO_CON, MONEDA, NUMERO_ARTICULOS, PAGADO_EN, ESTA_CANCELADO, OPERACION_ID, OLD_TICKET_ID, NOTAS, IMPRIMIR_NOTA, FORMA_PAGO, REFERENCIA, FACTURA_ID, TOTAL_DEVUELTO FROM VENTATICKETS;')

    sqlite3_Several_Querys(sqlQuery, cur)

def ventaTicketsArticulosParser():
    print('Exportando productos vendidos...')
    sqlite3Query('DROP TABLE IF EXISTS VENTATICKETS_ARTICULOS;')
    sqlite3Query('CREATE TABLE VENTATICKETS_ARTICULOS (ID INTEGER, TICKET_ID INTEGER, PRODUCTO_CODIGO VARCHAR(50), PRODUCTO_NOMBRE TEXT, CANTIDAD REAL, GANANCIA REAL, DEPARTAMENTO_ID INTEGER, PAGADO_EN TEXT, USA_MAYOREO TEXT, PORCENTAJE_DESCUENTO REAL, COMPONENTES TEXT, IMPUESTOS_USADOS TEXT, IMPUESTO_UNITARIO REAL, PRECIO_USADO REAL, CANTIDAD_DEVUELTA REAL, FUE_DEVUELTO TEXT, PORCENTAJE_PAGADO REAL, PRIMARY KEY(ID AUTOINCREMENT));')

    sqlQuery = 'INSERT INTO VENTATICKETS_ARTICULOS (ID, TICKET_ID, PRODUCTO_CODIGO, PRODUCTO_NOMBRE, CANTIDAD, GANANCIA, DEPARTAMENTO_ID, PAGADO_EN, USA_MAYOREO, PORCENTAJE_DESCUENTO, COMPONENTES, IMPUESTOS_USADOS, IMPUESTO_UNITARIO, PRECIO_USADO, CANTIDAD_DEVUELTA, FUE_DEVUELTO, PORCENTAJE_PAGADO) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'

    cur = fdbQuery('SELECT ID, TICKET_ID, PRODUCTO_CODIGO, PRODUCTO_NOMBRE, CANTIDAD, GANANCIA, DEPARTAMENTO_ID, PAGADO_EN, USA_MAYOREO, PORCENTAJE_DESCUENTO, COMPONENTES, IMPUESTOS_USADOS, IMPUESTO_UNITARIO, PRECIO_USADO, CANTIDAD_DEVUELTA, FUE_DEVUELTO, PORCENTAJE_PAGADO FROM VENTATICKETS_ARTICULOS;')

    sqlite3_Several_Querys(sqlQuery, cur)
        
try:
    print('CHAMBEANDO ANDAMOS V4.1')
    ventaTicketsArticulosParser()
    productosParser()    
    ventaTicketsParser()
except Exception as e:
    print(e)
finally:
    print('Finalizado...')



