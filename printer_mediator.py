import win32print
import win32ui
from PIL import Image, ImageWin

def list_printers() -> list:
    printers = win32print.EnumPrinters(win32print.PRINTER_ENUM_LOCAL | win32print.PRINTER_ENUM_CONNECTIONS)
    avaliable_printers = []
    for printer in printers:
        avaliable_printers.append(printer[2])
    
    return avaliable_printers

def create_ticket_struct(products, change, notes, date):
    try:
        total_local = 0
        TICKET_TXT = str(f' Tel: 373 734 9861#-#    Cel: 33 1076 7498#-#    {date}#-#')

        if type(notes) != bool: TICKET_TXT += notes + '#-##-#----------------------------------------------->#-#' 
        else: TICKET_TXT += '#-#----------------------------------------------->#-#'

        for key in products:
            DESCRIPCION = products[key]['DESCRIPCION']
            PVENTA = products[key]['PVENTA']
            CANTIDAD = products[key]['CANTIDAD']
            IMPORTE = products[key]['IMPORTE']
            total_local += IMPORTE

            TICKET_TXT += str(CANTIDAD) + ' ' + str(DESCRIPCION) + '    ' + str(IMPORTE) + '#-# '
        
        TICKET_TXT += str(f'----------------------------------------------->#-##-#Total: {total_local}')
        TICKET_TXT += str(f'#-#Cambio:  {change}') if change else ' '
        TICKET_TXT += '#-##-#Gracias por su compra!...'

        return TICKET_TXT
    except Exception as e:
        print(e)

def print_ticket(text, printer_name) -> bool:
    hPrinter = win32print.OpenPrinter(printer_name)
    try:
        # Abre el cajón de dinero
        win32print.StartDocPrinter(hPrinter, 1, ("Open Drawer", None, "RAW"))
        win32print.StartPagePrinter(hPrinter)
        win32print.WritePrinter(hPrinter, b'\x1B\x70\x00\x19\xFA')
        win32print.EndPagePrinter(hPrinter)
        win32print.EndDocPrinter(hPrinter)

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
            "height": 38,  # Ajuste la altura de la fuente para adaptarse a 80mm
            "weight": 550,
        })
        hDC.SelectObject(font)

        lines = text.split('#-#')
        
        for line in lines:
            hDC.TextOut(10, y, line)  # Coordenada X ajustada
            y += 40  # Increment Y position for the next line

        hDC.EndPage()
        hDC.EndDoc()
        print('Exitosa!')
        return True
    except Exception as e:
        print('Error!')
        print(e)
        return False
    finally:
        print('Finally')
        win32print.ClosePrinter(hPrinter)

def open_drawer(printer_name):
    hPrinter = win32print.OpenPrinter(printer_name)
    try:
        win32print.StartDocPrinter(hPrinter, 1, ("Open Drawer", None, "RAW"))
        win32print.StartPagePrinter(hPrinter)
        win32print.WritePrinter(hPrinter, b'\x1B\x70\x00\x19\xFA')
        win32print.EndPagePrinter(hPrinter)
        win32print.EndDocPrinter(hPrinter)
        print('Drawer open!')
    except Exception as e:
        print('Error!')
        print(e)
    finally:
        win32print.ClosePrinter(hPrinter)