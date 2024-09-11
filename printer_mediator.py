import win32print
import win32ui
from PIL import Image, ImageWin
import sqlite3

def sqlite3_query(query, params = [], commit = False) -> list:
    res = []
    conSQL = sqlite3.connect("./DB/printer_config.sqlite3")
    cursorSQL = conSQL.cursor()
    rows = cursorSQL.execute(query, params)
    for row in rows:
        res.append(row)

    if(commit): conSQL.commit() 
    conSQL.close()

    return res

def get_default_printer():
    return sqlite3_query('SELECT PRINTER_NAME FROM DEFAULT_PRINTER;',[])[0][0]

def list_printers(ipv4) -> dict:
    default_printer = get_default_printer()

    printers = win32print.EnumPrinters(win32print.PRINTER_ENUM_LOCAL | win32print.PRINTER_ENUM_CONNECTIONS)
    avaliable_printers = {}
    for printer in printers:
        avaliable_printers[f'{printer[2]}.{ipv4.split('.')[3]}'] = {
            'ipv4': ipv4,
            'name': printer[2],
            'isdefault': True if printer[2] == default_printer else False
        }
    
    return avaliable_printers

def print_ticket(text, printer_name) -> bool:
    hPrinter = win32print.OpenPrinter(printer_name)
    try:
        hDC = win32ui.CreateDC()
        hDC.CreatePrinterDC(printer_name)
        hDC.StartDoc("Ticket")
        hDC.StartPage()

        # Imprimir una imagen
        bmp = Image.open('./ASSETS/logo.jpg')
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