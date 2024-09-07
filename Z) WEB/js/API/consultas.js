async function getProduct(codigo){
    
    var res
    const url = `http://${SERVERIP}:5000/get/product?value=${encodeURIComponent(codigo)}`;

    await fetch(url)
    .then(response => response.json())
    .then(data => {
        res = data.product
    })
    .catch(error => {
        console.error('Error:', error);
        return {'Error': error};
    });

    return res
};

async function get_printers() {
    var printers
    const url = `http://${SERVERIP}:5000/get/printers`

    await fetch(url)
    .then(response => response.json())
    .then(data => {
        printers = data.printers;
    })
    .catch(error =>{
        console.log(error);
    });

    return printers;
}

async function submit_ticket(bill = {}, change = 0 , notes = '' ,printerName = '', willPrint = true) {
    const url = `http://${SERVERIP}:5000/print/new/ticket`

    const ticket = {
        print: willPrint,
        products: bill,
        printerName: printerName,
        change: change,
        notes: notes,
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
        console.log(data.impresion)
    })
    .catch((error) => {
        console.log(error);
    });
};

async function getTickets(day) {
    var res;
    const url =  `http://${SERVERIP}:5000/get/ticket/day?day=${encodeURIComponent(day)}`;
    await fetch(url)
    .then(response => response.json())
    .then(data => {
        res = data.tickets
    })
    .catch(error => {
        console.log('Error:', error);
        return{'Error':error};
    });

    return res;
     
};

async function rePrintTicket(ticketId, printerName){
    const url = `http://${SERVERIP}:5000/print/ticket`;

    const ticketAndPrinter = {
        id: ticketId,
        printerName: printerName,
    }

    await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(ticketAndPrinter)
    })
    .then(response => response.json())
    .then(data => {
        console.log(data);
    })
    .catch(error => {
        console.log(error);
    });
};
