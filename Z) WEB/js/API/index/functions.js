//JS para las funciones llamadas desde el archivo principal 'punto-de-venta'
function manageKeyPressed(event){
    const regex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ0-9¡!¿?.,:;()@#$%^&*_~\[\]\{\} ]*$/;
    var key = event.key;

    if(key === 'Delete'){
        deleteProductFromBill();
    }else if(key === 'Enter' && !findedDiv.hidden){
        addFindedProductToBill();
    }else if(key === 'Enter' && !isToolEnabled()){
        searchProduct();
    }else if(key === 'Escape' && isToolEnabled()){
        inputSearchProduct.focus();
    }else if(event.ctrlKey && key === 'p'){
        event.preventDefault();
        commonProduct();
    }else if(key === 'F11'){
        event.preventDefault();
        undoOrAplyDiscount();
    }else if(key === 'F12'){
        event.preventDefault();
        submit_Bill();
    }else if(key === 'F10'){
        event.preventDefault();
        inputSearchProduct.focus();
    }else if(key === 'F5'){
        event.preventDefault();
    }else if(key === 'ArrowDown' && isToolEnabled()){
        go_to_next_finded_product();
    }else if(key === 'ArrowUp' && isToolEnabled()){
        go_to_previous_finded_product();
    }else if(key === 'ArrowDown' && findedDiv.hidden){
        go_to_next_product();
    }else if(key === 'ArrowUp' && findedDiv.hidden){
        go_to_previous_product();
    }else if(key === '+' && !isToolEnabled()){
        event.preventDefault();
        update_product_on_bill(productsOnBill[selectedProductRow__BDid], 1);
    }else if(key === '-' && !isToolEnabled()){
        event.preventDefault();
        update_product_on_bill(productsOnBill[selectedProductRow__BDid], -1);
    }else if(key.length ===1 && regex.test(key) && !isToolEnabled()){
        event.preventDefault();
        inputSearchProduct.value += key;
        inputSearchProduct.focus();
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

const update_product_on_bill = (product, numOfProd) => {
    //Si llega un cero se hace un refresh
    if(numOfProd > 0 || numOfProd === -1){
        const prOnBill = productsOnBill[product['CODIGO']];
        prOnBill.CANTIDAD = parseFloat(prOnBill.CANTIDAD) + parseFloat(numOfProd);
        prOnBill.IMPORTE = hasDiscount ? roundNumber(prOnBill.CANTIDAD * prOnBill.MAYOREO) : roundNumber(prOnBill.CANTIDAD * prOnBill.PVENTA);
    
        update_product_row(prOnBill);
        calculateTotalBill(productsOnBill);
    }
    inputSearchProduct.focus();
};

const refresh_product_on_bill = (codigo) => {
    console.log('refresh')
    const prOnBill = productsOnBill[codigo];
    prOnBill.IMPORTE = hasDiscount ? roundNumber(prOnBill.CANTIDAD * prOnBill.MAYOREO) : roundNumber(prOnBill.CANTIDAD * prOnBill.PVENTA);

    update_product_row(prOnBill);
    calculateTotalBill(productsOnBill);
};

const add_product_to_bill = (product, cantity) => {
    //Si el precio de mayoreo es menor al costo, es perdida, por lo que usaremos el PVENTA
    if(cantity > 0){
        const mayoreo = product['PCOSTO'] < product['MAYOREO'] ? product['MAYOREO'] : product['PVENTA'];
        productsOnBill[product['CODIGO']] = {
            CODIGO: product['CODIGO'],
            DESCRIPCION: product['DESCRIPCION'],
            PVENTA: parseFloat(product['PVENTA'].toFixed(2)),
            MAYOREO: parseFloat(mayoreo.toFixed(2)),
            PCOSTO: product['PCOSTO'] ? product['PCOSTO'] : product['PVENTA'],
            TVENTA: product['TVENTA'],
            CANTIDAD: cantity,
            IMPORTE: hasDiscount ? roundNumber(mayoreo * cantity) : roundNumber(product['PVENTA'] * cantity),
        }
    
        create_product_row(productsOnBill[product['CODIGO']]);
        calculateTotalBill(productsOnBill);
    }
    inputSearchProduct.focus();
};

function roundNumber(numero) {
    // Extraer la parte entera y los decimales del número
    let entero = Math.floor(numero);
    let decimales = numero - entero;

    if (decimales === 0){
        return entero;
    }else if (decimales <= 0.50) {
        return entero + 0.50;
    } else {
        return Math.ceil(numero);
    }
}

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

    btnDiscount.innerHTML = !hasDiscount ? 'Aplicar Mayoreo [F11] <i class="fa-solid fa-tag"></i>' : 'Deshacer Mayoreo [F11] <i class="fa-solid fa-tag"></i>';

    for(let key in productsOnBill) refresh_product_on_bill(key, 0);
    
};

//Venta de producto comun --------------------------------------
function commonProduct(){
    commonArticleDiv.hidden = false;
    commonArticleDescription.focus();
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
    if(Object.keys(productsOnBill).length > 0){
        ticketSubmitDiv.hidden = false;
        inputChange.focus();
        const total = calculateTotalBill(productsOnBill); 
        inputChange.value = total;
        document.getElementById('complete-ticket-bill').innerText = `Cobrar: $ ${total}`;
        document.getElementById('cantity-of-change').innerText = '$ 0.00';
    }else alert('Cuenta vacia!...')
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
        console.log(data.impresion)
    })
    .catch((error) => {
        console.log(error);
    });
};

function collectTheBill(event){
    event.preventDefault();

    if(Object.keys(productsOnBill).length > 0){
        const notes = document.getElementById('notes-for-sell').value;
        submit_ticket(productsOnBill, inputChange.value, notes, selectPrinter.value, false);

        //Esto es inutil pq se reinicia, xd
        ticketSubmitDiv.hidden = true;
        productsOnBill = {};
        billTable.innerHTML = '';
        document.getElementById('notes-for-sell').value = null;

        calculateTotalBill(productsOnBill);
        alert('Cobro realizado!...');
    }else alert('Cuenta vacia!...');
}

function isToolEnabled(){
    //Añadir los elementos divs que alguna vez se ocultaran
    const toolsArray = [findedDiv, divCantityProduct, ticketSubmitDiv, commonArticleDiv];
    var isEnabled = false;

    toolsArray.forEach(div => {
        if(!div.hidden){
            isEnabled = true;
            return
        }
    });

    return isEnabled;
}

//Fullscreen options
var isFullScreen = true;
const fullScreenRequest = () =>{
    if(isFullScreen) salirDePantallaCompleta();
    else ponerEnPantallaCompleta();
    isFullScreen = !isFullScreen;
};

function ponerEnPantallaCompleta() {
    // Selecciona el elemento que quieres poner en pantalla completa
    const elemento = document.documentElement; // Todo el documento

    if (elemento.requestFullscreen) {
        elemento.requestFullscreen();
    } else if (elemento.mozRequestFullScreen) { // Firefox
        elemento.mozRequestFullScreen();
    } else if (elemento.webkitRequestFullscreen) { // Chrome, Safari, Opera
        elemento.webkitRequestFullscreen();
    } else if (elemento.msRequestFullscreen) { // IE/Edge
        elemento.msRequestFullscreen();
    }
}

// Para salir de la pantalla completa
function salirDePantallaCompleta() {
    if (document.exitFullscreen) {
        document.exitFullscreen();
    } else if (document.mozCancelFullScreen) { // Firefox
        document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) { // Chrome, Safari, Opera
        document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) { // IE/Edge
        document.msExitFullscreen();
    }
}