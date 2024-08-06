import fdb
import ctypes

#SQL SENTENCIAS
async def getProducts():
    res = {}

    try:
        ctypes.cdll.LoadLibrary('./fbclient.dll')


        con =  fdb.connect(
            dsn='PDVDATA.fdb', 
            user='SYSDBA', 
            password='masterkey',
            charset='NONE'
        )

        cur = con.cursor()
        cur.execute('SELECT CODIGO, DESCRIPCION, PVENTA, MAYOREO, PCOSTO FROM PRODUCTOS;')

        
        for row in cur.fetchall():
            res[row[0]] = row[1:]
            
        cur.close()
        con.close()
    except Exception as e:
        print(e)
    finally:
        return res