import socket
import json

def send_ticket():
    client_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)

    client_socket.connect(('192.168.100.45', 12345))

    products = json.dumps({
        'hi': 'bie'
    })

    client_socket.sendall(products.encode('utf-8'))

    data = client_socket.recv(1024)
    print(f"Respuesta del servidor: {data.decode()}")
    print(data.decode())

    client_socket.close()

if __name__ == '__main__':
    send_ticket()