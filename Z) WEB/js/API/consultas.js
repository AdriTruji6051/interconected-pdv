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

async function submitTicket(bill, total) {

    const url = `http://${SERVERIP}:5000/print/new/ticket`

    const ticket = {
        print: 1,
        products: bill,
        total: total,
    }

    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: ticket
    })
    .then(response => response.json())
    .then(data => {
        alert('Submited!..')
    })
    .catch((error) => {
        console.error('Error:', error);
    });
}