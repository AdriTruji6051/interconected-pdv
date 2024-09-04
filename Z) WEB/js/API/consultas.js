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
     
}
