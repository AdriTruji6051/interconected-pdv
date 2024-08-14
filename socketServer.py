import socket
import requests

# Crear un socket
server_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)

# Enlazar el socket a la dirección IP y puerto
server_socket.bind(('0.0.0.0', 12345))  # Puedes cambiar la IP y el puerto

# Escuchar conexiones entrantes
server_socket.listen(5)  # El parámetro 5 define el número máximo de conexiones en cola

print("Servidor esperando conexiones...")

# Bucle infinito para mantener el servidor activo
while True:
    # Aceptar una conexión
    conn, addr = server_socket.accept()
    print(f"Conexión establecida con {addr}")
    
    # Recibir datos del cliente
    data = conn.recv(1024)
    if not data:
        break

    print(f"Datos recibidos: {data.decode()}")

    apiData = str(data.decode())

    params = {
        'value': apiData
    }

    url = 'http://localhost:5000/product'

    response = requests.get(url, params=params)

    print(response)

    conn.sendall(response.content)
    

    # Cerrar la conexión (puedes mantenerla abierta si necesitas comunicación continua)
    conn.close()

# Cerrar el socket del servidor (este punto solo se alcanzará si sales del bucle)
server_socket.close()