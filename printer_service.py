import socket
from printer_mediator import open_drawer, print_ticket, list_printers
import json

def get_local_ip():
    # Crear una conexión a una dirección IP externa (no se enviará ningún dato)
    s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    try:
        # Intentar conectarse a una IP pública (Google DNS en este caso)
        s.connect(('8.8.8.8', 80))
        local_ip = s.getsockname()[0]
    except Exception as e:
        local_ip = 'No se pudo obtener la IP'
    finally:
        s.close()
    return local_ip

def run_printer_service():
    print(f'Servicion de impresion en {get_local_ip()}')
    server_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    server_socket.bind(('0.0.0.0', 12345)) 
    server_socket.listen(10) 

    print("Servidor de impresion esperando conexiones...")

    while True:
        conn, addr = server_socket.accept()
        try:
            print(f"Conección de servidor {addr}")
            data = conn.recv(1024)
            if not data:
                break
            
            data = data.decode('utf-8')
            if(data == 'GET PRINTERS'):
                print('Printers GET')
                ipv4 = get_local_ip()
                printers = list_printers(ipv4=ipv4)
                conn.sendall(json.dumps(printers).encode('utf-8'))
            else:
                print('Ticket impresion')
                ticket = json.loads(data)
                print_ticket(ticket['text'], ticket['printerName'])
                if ticket['openDrawer']: open_drawer(ticket['printerName'])
                conn.sendall(b'Exitosa!...')
  
        except Exception as e:
            print(e)
            conn.sendall(b'Esta mal en algo!...')
        finally:
            conn.close()

    server_socket.close()

if __name__ == "__main__":
    run_printer_service()