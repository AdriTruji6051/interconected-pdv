import socket

# Crear un socket
client_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)

# Conectar al servidor (reemplaza con la IP del servidor)
client_socket.connect(('192.168.1.76', 12345))

# Enviar datos
client_socket.sendall(b"634130100011")

# Recibir respuesta
data = client_socket.recv(1024)
print(f"Respuesta del servidor: {data.decode()}")
print(data.decode())

# Cerrar el socket
client_socket.close()