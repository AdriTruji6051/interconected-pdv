import sqlite3

conSQL = sqlite3.connect("./pchdata.sqlite3")
cursorSQL = conSQL.cursor()
rows = cursorSQL.execute("SELECT * FROM productos WHERE descripcion LIKE 'TAM%'")
for row in rows:
    print(row)

conSQL.close()