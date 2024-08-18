async function getProduct(codigo){
    
    var res
    const url = `http://${SERVERIP}:5000/get/product?value=${encodeURIComponent(codigo)}`;

    await fetch(url)
    .then(response => response.json())
    .then(data => {
        res = data.product
    })
    .catch(error => {
        console.error('Error:', error)
        return {'Error': error}
    });

    return res
}

async function submitTicket(bill,printerName, willPrint) {

    const url = `http://${SERVERIP}:5000/print/new/ticket`

    const ticket = {
        print: willPrint,
        products: bill,
        printerName: printerName
    }

    await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(ticket)
    })
    .then(response => response.json())
    .then(data => {
        console.log(data.impresion);
        alert('Submited!..');
    })
    .catch((error) => {
        console.error('Error:', error);
    });
}
