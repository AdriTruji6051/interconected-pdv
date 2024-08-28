//JS para las funciones llamadas desde el archivo principal 'punto-de-venta'
function manageKeyPressed(event){
    //console.log('Hey:', event.key);

    var key = event.key;
    if(key === 'Delete'){
        deleteProductFromBill();
    }else if(key === 'Enter' && !findedDiv.hidden){
        addFindedProductToBill();
    }else if(event.ctrlKey && key === 'p'){
        event.preventDefault();
        commonProduct();
    }else if(key === 'F11'){
        event.preventDefault();
        undoOrAplyDiscount();
    }else if(key === 'F12'){
        event.preventDefault();
        submit_Bill();
    }else if(key === 'ArrowDown' && !findedDiv.hidden){
        go_to_next_finded_product();
    }else if(key === 'ArrowUp' && !findedDiv.hidden){
        go_to_previous_finded_product();
    }else if(key === 'ArrowDown' && findedDiv.hidden){
        go_to_next_product();
    }else if(key === 'ArrowUp' && findedDiv.hidden){
        go_to_previous_product();
    }
};

async function onLoadFunction(){
    //Focus a introducir productos
    inputSearchProduct.focus()

    //Cargamos las impresoras disponibles
    await fetch(`http://${SERVERIP}:5000/get/printers`)
    .then(response => response.json())
    .then(data => {
        const printers = data.printers;
        var isFirst = true;
        
        printers.forEach(printer => {
            const printOption = document.createElement('option');
            if(isFirst) printOption.selected = true;
            printOption.value = printer;
            printOption.innerText = printer;
            selectPrinter.appendChild(printOption);
            isFirst = false;
        });
    })
    .catch(error => console.log(error));
};

//Manejo de la cuenta 
const update_product_on_bill = (product, numOfProd) => {
    const prOnBill = productsOnBill[product['CODIGO']];
    prOnBill.CANTIDAD = parseFloat(prOnBill.CANTIDAD) + parseFloat(numOfProd);
    prOnBill.IMPORTE = hasDiscount ? prOnBill.CANTIDAD * prOnBill.MAYOREO : prOnBill.CANTIDAD * prOnBill.PVENTA;

    document.getElementById(`can-${product['CODIGO']}`).innerText = prOnBill.CANTIDAD;
    document.getElementById(`imp-${product['CODIGO']}`).innerText = prOnBill.IMPORTE;
    document.getElementById(`tr-${product['CODIGO']}`).scrollIntoView({ behavior: 'smooth' });

    if(numOfProd > 0) focus_row_on_ticket(document.getElementById(`tr-${product['CODIGO']}`));

    calculateTotalBill(productsOnBill);

    inputSearchProduct.focus();
};

const add_product_to_bill = (product, cantity) => {
    //Si el precio de mayoreo es menor al costo, es perdida, por lo que usaremos el PVENTA
    const mayoreo = product['PCOSTO'] < product['MAYOREO'] ? product['MAYOREO'] : product['PVENTA'];
    productsOnBill[product['CODIGO']] = {
        CODIGO: product['CODIGO'],
        DESCRIPCION: product['DESCRIPCION'],
        PVENTA: product['PVENTA'],
        MAYOREO: mayoreo,
        PCOSTO: product['PCOSTO'] ? product['PCOSTO'] : product['PVENTA'],
        TVENTA: product['TVENTA'],
        CANTIDAD: cantity,
        IMPORTE: hasDiscount ? mayoreo * cantity  : product['PVENTA'] * cantity,
    }

    console.log('')

    create_product_row(productsOnBill[product['CODIGO']]);

    calculateTotalBill(productsOnBill);

    inputSearchProduct.focus();
};


const venta_a_granel = (product) => {
    divCantityProduct.hidden = false;
    divCantityProduct.focus();
    inputCantityWEIGHT.focus();

    granelProduct = product;
    granelTitle.innerText = product.DESCRIPCION;
    inputCantityPRICE.value = product.PVENTA;
    inputCantityWEIGHT.value = 1.000;
    
};

const searchProduct = async() => {
    const input = inputSearchProduct.value;
    inputSearchProduct.value = '';

    if(input){
        //Si existe el producto ya en la cuenta, agregamos uno mas
        if(Object.keys(productsOnBill).length !== 0 ){
            if(productsOnBill.hasOwnProperty(input)){
                update_product_on_bill(productsOnBill[input], 1);
                return
            }
        }

        //Si no existe, lo buscamos en la BD y lo actualizamos
        const res = await getProduct(input);
        if(typeof(res) === 'string'){
            const product = JSON.parse(res);

            //Si es D significa que es producto a granel
            if(product['TVENTA'] === 'D') venta_a_granel(product);
            else add_product_to_bill(product, 1);

        }else show_available_products(res);
    }
};

const undoOrAplyDiscount = () =>{
    hasDiscount = !hasDiscount;

    hasDiscount ? add_discount_shader() : remove_discount_shader()

    btnDiscount.innerText = !hasDiscount ? 'Aplicar Mayoreo [F1]' : 'Deshacer Mayoreo [F1]';

    for(let key in productsOnBill) update_product_on_bill(productsOnBill[key], 0);
    
};

//Venta de producto comun --------------------------------------
function commonProduct(){
    commonArticleDiv.hidden = false;
    commonArticleCantity.focus();
}

function addGranelProduct(event){
    event.preventDefault();
    inputSearchProduct.focus();
    const weight = inputCantityWEIGHT.value;
    add_product_to_bill(granelProduct, weight);
    granelProduct = '';
}


//Manejo de la cuenta al cobrar---------------------------------
function submit_Bill(){
    ticketSubmitDiv.hidden = false;
    inputChange.focus();
    const total = calculateTotalBill(productsOnBill); 
    inputChange.value = total;
    document.getElementById('complete-ticket-bill').innerText = `Cobrar: $ ${total}`;
    document.getElementById('cantity-of-change').innerText = '$ 0.00';
}

async function submit_ticket(bill, change = 0 , notes = '' ,printerName, willPrint = true) {
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
        console.log(data.impresion);
        alert('Submited!..');
    })
    .catch((error) => {
        console.error('Error:', error);
    });
};

function collectTheBill(){
    if(Object.keys(productsOnBill).length !== 0){
        const notes = document.getElementById('notes-for-sell').value;
        submit_ticket(productsOnBill, inputChange.value, notes, selectPrinter.value, false);
        ticketSubmitDiv.hidden = true;
        productsOnBill = null;
        billTable.innerHTML = '';
        calculateTotalBill(productsOnBill);
        alert('Cobro realizado!...');
    }else alert('Cuenta vacia!...');
}