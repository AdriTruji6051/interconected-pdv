import win32print
import win32ui
from PIL import Image, ImageWin


def print_ticket_with_barcode(text, printer_name):
    hPrinter = win32print.OpenPrinter(printer_name)
    try:
        hDC = win32ui.CreateDC()
        hDC.CreatePrinterDC(printer_name)
        hDC.StartDoc("Ticket")
        hDC.StartPage()

        font = win32ui.CreateFont({
            "name": "Open Sans",
            "height": 30,  # Ajuste la altura de la fuente para adaptarse a 80mm
        })
        hDC.SelectObject(font)

        lines = text.split('\n')
        y = 50  # Initial Y position
        for line in lines:
            print(line)
            hDC.TextOut(10, y, line)  # Coordenada X ajustada
            y += 40  # Increment Y position for the next line

        # Imprimir una imagen
        bmp = Image.open('./cat.jpg')
        bmp = bmp.resize((600, 600))  # Resize as needed

        # Convertir la imagen en un formato adecuado para imprimir
        dib = ImageWin.Dib(bmp)
        dib.draw(hDC.GetHandleOutput(), (10, y, 600, y + 600))

        hDC.EndPage()
        hDC.EndDoc()
    finally:
        win32print.ClosePrinter(hPrinter)

text = "12345678901234567890123456789012345678901234567890\nEste es un ticket de ejemplo\nLínea 2\nLínea 3"
barcode_data = "123456789012"  # Código de barras de ejemplo
printer_name = "OneNote for Windows 10"  # Cambia esto por el nombre de tu impresora
print_ticket_with_barcode(text, printer_name)
