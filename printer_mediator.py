import win32print
import win32ui
from PIL import Image, ImageWin

def list_printers() -> list:
    printers = win32print.EnumPrinters(win32print.PRINTER_ENUM_LOCAL | win32print.PRINTER_ENUM_CONNECTIONS)
    avaliable_printers = []
    for printer in printers:
        avaliable_printers.append(printer[2])
    
    return avaliable_printers

def create_ticket_struct(products, change, notes):
    total_local = 0
    if type(notes) != bool: TICKET_TXT = notes + '#-##-# -------------------------------'
    else: TICKET_TXT = '#-##-# -------------------------------'

    for key in products:
        DESCRIPCION = products[key]['DESCRIPCION']
        PVENTA = products[key]['PVENTA']
        CANTIDAD = products[key]['CANTIDAD']
        IMPORTE = products[key]['IMPORTE']
        total_local += IMPORTE

        TICKET_TXT += str(CANTIDAD) + ' ' + str(DESCRIPCION) + '    ' + str(IMPORTE) + '#-# '
    
    TICKET_TXT += str(f'-------------------------------#-##-#Total: {total_local} {'#-#Cambio:' + str(float(change) - float(total_local)) if change else ''}')

    return TICKET_TXT


def print_ticket(text, printer_name) -> bool:
    hPrinter = win32print.OpenPrinter(printer_name)
    try:
        hDC = win32ui.CreateDC()
        hDC.CreatePrinterDC(printer_name)
        hDC.StartDoc("Ticket")
        hDC.StartPage()

        # Imprimir una imagen
        bmp = Image.open('./logo.jpg')
        bmp = bmp.resize((250, 250))  # Resize as needed


        y = 50  # Initial Y position

        # Convertir la imagen en un formato adecuado para imprimir
        dib = ImageWin.Dib(bmp)
        dib.draw(hDC.GetHandleOutput(), (10, y, 250, y + 250))

        y += 250

        font = win32ui.CreateFont({
            "name": "Arial",
            "height": 35,  # Ajuste la altura de la fuente para adaptarse a 80mm
        })
        hDC.SelectObject(font)

        lines = text.split('#-#')
        
        for line in lines:
            hDC.TextOut(10, y, line)  # Coordenada X ajustada
            y += 40  # Increment Y position for the next line

        hDC.EndPage()
        hDC.EndDoc()

        return True
    except Exception as e:
        print(e)

        return False
    finally:
        print('Finally')
        win32print.ClosePrinter(hPrinter)

# text = "Este es un ticket de ejemplo\nLínea 2\nLínea 3"
# printer_name = "impresion"  # Cambia esto por el nombre de tu impresora
# print_ticket(text, printer_name)