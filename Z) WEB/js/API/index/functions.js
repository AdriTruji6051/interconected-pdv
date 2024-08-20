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
};

function calculateTotalBill(productsToCalculate){
    var totalBill = 0;
    for(var prod_cd in productsToCalculate){
        totalBill += productsToCalculate[prod_cd].IMPORTE;
    }
    return totalBill;
};

function manageKeyPressed(event){
    console.log('Hey:', event.key);

    var key = event.key;
    if(key === 'Delete'){
        deleteProductFromBill();
    }else if(key === 'F12'){
        collectTheBill(event);
    }else if(key === 'Enter' && !findedDiv.hidden){
        addFindedProductToBill();
    //Manejo de las flechas
    }else if(key === 'ArrowDown' && !findedDiv.hidden){
        console.log('Abajo en busqueda')
    }else if(key === 'ArrowUp' && !findedDiv.hidden){
        console.log('Arriba en busqueda')
    }else if(key === 'ArrowDown' && findedDiv.hidden){
        console.log('Abajo en ticket')
    }else if(key === 'ArrowUp' && findedDiv.hidden){
        console.log('Arriba en ticket')
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
        <td id='can-${product['CODIGO']}'>${1}</td>
        <td id='imp-${product['CODIGO']}'>${product['PVENTA']}</td>
    `;

    // Añadir la fila a la tabla y dirigirse a ella si no existe
    billTable.appendChild(row);
    row.scrollIntoView({ behavior: 'smooth' });
}

const update_product_on_bill = (product) => {
    const prOnBill = productsOnBill[product['CODIGO']];
    prOnBill.CANTIDAD += 1;
    prOnBill.IMPORTE = prOnBill.CANTIDAD * prOnBill.PVENTA;

    document.getElementById(`can-${product['CODIGO']}`).innerText = prOnBill.CANTIDAD;
    document.getElementById(`imp-${product['CODIGO']}`).innerText = prOnBill.IMPORTE;
    document.getElementById(`tr-${product['CODIGO']}`).scrollIntoView({ behavior: 'smooth' });
};

const add_product_to_bill = (product) => {
    //Añadimos a la cuenta en el almacenamiento
    productsOnBill[product['CODIGO']] = {
        DESCRIPCION: product['DESCRIPCION'],
        PVENTA: product['PVENTA'],
        CANTIDAD: 1,
        IMPORTE: product['PVENTA'],
    }

    create_product_row(product);
};

const appendToBillTable = (product) => {
    if(productsOnBill.hasOwnProperty(product['CODIGO'])) {
        update_product_on_bill(product);
    } else {
        add_product_to_bill(product);
    }
};

const append_new_finded_product_row = (product) => {
    const row = document.createElement('tr');
    row.id = `tr-fd-${product['CODIGO']}`;
    row.name = product['CODIGO'];

    row.innerHTML = `
        <td id='des-fd-${product['CODIGO']}'>${product['DESCRIPCION']}</td>
        <td id='pv-fd-${product['CODIGO']}'>${product['PVENTA']}</td>
    `;

    findedTable.appendChild(row);
};

const reset_finded_product_var = () =>{
    findedSelectedProductRow = '';
    findedSelectedProductRow__BDid = '';
};

const addFindedProductToBill = () => {
    inputSearchProduct.value = '';
    inputSearchProduct.value = findedSelectedProductRow__BDid
    findedDiv.hidden = true;
    addProductToBill();
    reset_finded_product_var();
};

const showAvaliableProducts = (products) =>{
    btnAddFindedProduct.focus();
    findedDiv.hidden = false;
    findedTable.innerHTML = '';
    products.forEach(prod => {
        append_new_finded_product_row(prod);
    });
};

const addProductToBill = async() => {
    if(inputSearchProduct.value){
        var res = await getProduct(inputSearchProduct.value);
        inputSearchProduct.value = '';
        
        if(typeof(res) === 'string'){
            var product = JSON.parse(res);
            appendToBillTable(product);
            totalH1.innerText = `Total: ${calculateTotalBill(productsOnBill)}`;
        }else{
            showAvaliableProducts(res);
        }
    }else{
        console.log('NO SE ENCONTRARO PRODUCTOS CON DICHA DESCRIPCION!...');
    }

};

const deleteProductFromBill = () => {
    alert('Borrar producto!...')
    console.log(selectedProductRow);
    if(selectedProductRow){
        var row = document.getElementById(selectedProductRow);
        if(row){
            row.parentNode.removeChild(row);
            delete productsOnBill[selectedProductRow__BDid];
            totalH1.innerText = `Total: ${calculateTotalBill(productsOnBill)}`;
            selectedProductRow = '';
            selectedProductRow__BDid = '';
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

function focusRowOnTicket (event){
    const productRow = event.target.parentNode;
    const row = document.getElementById(productRow.id);

    if(row.classList.contains('table-primary')){
        row.classList.remove('table-primary');
        selectedProductRow__BDid = '';
        selectedProductRow = '';
    }else{
        if(document.getElementById(selectedProductRow)){
            document.getElementById(selectedProductRow).classList.remove('table-primary');
        }
        selectedProductRow__BDid = productRow.name;
        selectedProductRow = productRow.id;
        document.getElementById(selectedProductRow).classList.add('table-primary');
    }
};

function focusRowOnFindedProducts(event){
    const productRow = event.target.parentNode;
    const row = document.getElementById(productRow.id);

    if(row.classList.contains('table-primary')){
        row.classList.remove('table-primary');
        findedSelectedProductRow__BDid = '';
        findedSelectedProductRow = '';
    }else{
        if(document.getElementById(findedSelectedProductRow)){
            document.getElementById(findedSelectedProductRow).classList.remove('table-primary');
        }
        findedSelectedProductRow__BDid = productRow.name;
        findedSelectedProductRow = productRow.id;
        document.getElementById(findedSelectedProductRow).classList.add('table-primary');
    }
}