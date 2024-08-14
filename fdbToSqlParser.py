import fdb
import ctypes
import sqlite3

res = {}
print('CHAMBEANDO ANDAMOS')
try:
    
    #CONECCION A SQL ELEIMINAMOS LA TABLA ANTERIOR PARA GUARDAR LOS DATOS ACTUALIZADOS...
    conSQL = sqlite3.connect("./pchdata.sqlite3")
    cursorSQL = conSQL.cursor()
    cursorSQL.execute("DROP TABLE IF EXISTS productos;")
    cursorSQL.execute("CREATE TABLE IF NOT EXISTS productos( codigo VARCHAR(50) PRIMARY KEY, descripcion VARCHAR(50), precioCosto REAL,precioVenta REAL, precioMayoreo REAL)")
    sqlQuery = '''INSERT INTO productos (codigo, descripcion, precioCosto, precioVenta, precioMayoreo) VALUES (?, ?, ?, ?, ?)'''

    #CONECCION A FDB PARA OBTENER LOS DATOS E INSERTARLOS 
    ctypes.cdll.LoadLibrary('./fbclient.dll')
    con =  fdb.connect(
        dsn='PDVDATA.fdb', 
        user='SYSDBA', 
        password='masterkey',
        charset='NONE'
    )

    cur = con.cursor()
    cur.execute('SELECT CODIGO, DESCRIPCION, PCOSTO, PVENTA, MAYOREO  FROM PRODUCTOS;')

    #Obtenidos los datos de FDB los parseamos a SQLIte
    for row in cur.fetchall():
        codigo = row[0]
        descripcion = row[1]
        pCosto = float(row[2])
        pVenta = float(row[3])
        mayoreo = float(row[4])
        print(codigo, descripcion, pCosto, pVenta, mayoreo)
        cursorSQL.execute(sqlQuery, (codigo, descripcion, pCosto, pVenta, mayoreo))
        
    cur.close()
    con.close()
    conSQL.commit()
    conSQL.close()

except Exception as e:
    print(e)
finally:
    print('Finalizado...')



