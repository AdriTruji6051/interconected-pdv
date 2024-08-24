//JS para las funciones llamadas desde el archivo principal 'punto-de-venta'


async function submitTicket(bill, change = 0 , notes = '' ,printerName, willPrint = true) {

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

function calculateTotalBill(productsToCalculate){
    var totalBill = 0;
    for(var prod_cd in productsToCalculate){
        totalBill += productsToCalculate[prod_cd].IMPORTE;
    }

    totalH1.innerText = `Total: ${totalBill}`;
    return totalBill;
};

function manageKeyPressed(event){
    //console.log('Hey:', event.key);

    var key = event.key;
    if(key === 'Delete'){
        deleteProductFromBill();
    }else if(key === 'F12'){
        collectTheBill(event);
    }else if(key === 'Enter' && !findedDiv.hidden){
        addFindedProductToBill();

    //Manejo de las flechas
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

const create_product_row = (product) =>{
    // Crear una nueva fila
    const row = document.createElement('tr');
    row.id = `tr-${product['CODIGO']}`;
    row.name = product['CODIGO'];

    // Crear y añadir celdas a la fila
    row.innerHTML = `
        <td id='cod-${product['CODIGO']}'>${product['CODIGO']}</td>
        <td id='des-${product['CODIGO']}'>${product['DESCRIPCION']}</td>
        <td id='pv-${product['CODIGO']}'>${product['PVENTA']}</td>
        <td id='can-${product['CODIGO']}'>${product['CANTIDAD']}</td>
        <td id='imp-${product['CODIGO']}'>${product['IMPORTE']}</td>
    `;

    // Añadir la fila a la tabla y dirigirse a ella si no existe
    billTable.appendChild(row);
    focus_row_on_ticket(row);
    row.scrollIntoView({ behavior: 'smooth' });
}

const update_product_on_bill = (product, numOfProd) => {
    const prOnBill = productsOnBill[product['CODIGO']];
    prOnBill.CANTIDAD = parseFloat(prOnBill.CANTIDAD) + parseFloat(numOfProd);
    prOnBill.IMPORTE = hasDiscount ? prOnBill.CANTIDAD * prOnBill.MAYOREO : prOnBill.CANTIDAD * prOnBill.PVENTA;

    document.getElementById(`can-${product['CODIGO']}`).innerText = prOnBill.CANTIDAD;
    document.getElementById(`imp-${product['CODIGO']}`).innerText = prOnBill.IMPORTE;
    document.getElementById(`tr-${product['CODIGO']}`).scrollIntoView({ behavior: 'smooth' });

    if(numOfProd > 0){  
        focus_row_on_ticket(document.getElementById(`tr-${product['CODIGO']}`));
    }

    totalH1.innerText = `Total: ${calculateTotalBill(productsOnBill)}`;
};

const add_product_to_bill = (product, cantity) => {
    //Añadimos a la cuenta en el almacenamiento
    productsOnBill[product['CODIGO']] = {
        CODIGO: product['CODIGO'],
        DESCRIPCION: product['DESCRIPCION'],
        PVENTA: product['PVENTA'],
        MAYOREO: product['PCOSTO'] < product['MAYOREO'] ? product['MAYOREO'] : product['PVENTA'],
        PCOSTO: product['PCOSTO'] ? product['PCOSTO'] : product['PVENTA'],
        CANTIDAD: cantity,
        IMPORTE: hasDiscount ? product['MAYOREO'] * cantity  : product['PVENTA'] * cantity,
    }

    create_product_row(productsOnBill[product['CODIGO']]);

    totalH1.innerText = `Total: ${calculateTotalBill(productsOnBill)}`;
};



function focus_row_on_ticket (row){
    console.log(row);
    if(document.getElementById(selectedProductRow)){
        document.getElementById(selectedProductRow).classList.remove('table-primary');
    }
    selectedProductRow__BDid = row.name;
    console.log(row.name);
    selectedProductRow = row.id;
    document.getElementById(selectedProductRow).classList.add('table-primary');
};

const go_to_next_product = () => {
    const actualNode = document.getElementById(selectedProductRow);
    const nextNode = actualNode.nextSibling;
    focus_row_on_ticket(nextNode);
};

const go_to_previous_product = () => {
    const actualNode = document.getElementById(selectedProductRow);
    const previousNode = actualNode.previousSibling;
    focus_row_on_ticket(previousNode);
};


const apppend_to_bill_table = (product, cantity) => {
    if(productsOnBill.hasOwnProperty(product['CODIGO'])) {
        console.log(product);
        update_product_on_bill(product, cantity);
    } else {
        add_product_to_bill(product, cantity);
    }
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

const addProductToBill = async() => {
    if(inputSearchProduct.value){
        var res = await getProduct(inputSearchProduct.value);
        inputSearchProduct.value = '';
        
        if(typeof(res) === 'string'){
            var product = JSON.parse(res);

            //Si es D significa que es producto a granel
            if(product['TVENTA'] === 'D'){
                venta_a_granel(product);
            }else{
                apppend_to_bill_table(product, 1);
            }

        }else{
            show_available_products(res);
        }
    }else{
        console.log('NO SE ENCONTRARO PRODUCTOS CON DICHA DESCRIPCION!...');
    }

};

const deleteProductFromBill = () => {
    if(selectedProductRow){
        var row = document.getElementById(selectedProductRow);
        if(row){
            const prevRow = row.previousSibling;
            const nextRow = row.nextSibling;
            row.parentNode.removeChild(row);
            delete productsOnBill[selectedProductRow__BDid];
            totalH1.innerText = `Total: ${calculateTotalBill(productsOnBill)}`;
            selectedProductRow = '';
            selectedProductRow__BDid = '';

            console.log(typeof(row.previousSibling));
            console.log(prevRow);
            console.log(row);

            if(prevRow){
                //Al borrar el nodo debemos llenar el espacio vacio en la cadena de nodos
                try{
                    focus_row_on_ticket(document.getElementById(prevRow.id));
                    prevRow.nextSibling = document.getElementById(nextRow.id);
                }catch (e){
                    console.log('No, fue aqui mi bro' + e);
                }
            }else{
                try{
                    focus_row_on_ticket(document.getElementById(nextRow.id));
                }catch (e){
                    console.log('Aqui fallo alv' + e);
                }
            }

        }else{
            console.log('El elemento no existe.')
        }
    }
};

const collectTheBill = async (event) => {
    event.preventDefault();

    if(Object.keys(productsOnBill).length !== 0){
        submitTicket(bill = productsOnBill,printerName = selectPrinter.value, willPrint = true);
    }else{
        alert('Cuenta vacia!...')
    }
};

function selectRowOnTicket(event){
    const row = event.target.parentNode;
    focus_row_on_ticket(row);
};


const undoOrAplyDiscount = () =>{
    hasDiscount = !hasDiscount;

    btnDiscount.innerText = !hasDiscount ? 'Aplicar Mayoreo [F1]' : 'Deshacer Mayoreo [F1]';

    for(let key in productsOnBill) update_product_on_bill(productsOnBill[key], 0);
    
};