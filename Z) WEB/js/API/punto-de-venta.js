const btnSearchProduct = document.getElementById('btn-search-product');
const inputSearchProduct = document.getElementById('input-search-product')
const billTable = document.getElementById('bill-table-body');
const totalH1 = document.getElementById('total');
const submitBill = document.getElementById('submit-bill');
const selectPrinter = document.getElementById('select-printer')

var productsOnBill = {}
var selectedProductRow
var selectedProductRow__BDid 

function calculateTotalBill(){
    var totalBill = 0;
    for(var clave in productsOnBill){
        totalBill += productsOnBill[clave].IMPORTE;
    }
    return totalBill;
}

function manageKeyPressed(event){
    console.log('Hey:', event.key);

    var key = event.key;
    if(key === 'Delete'){
        deleteProductFromBill();
    }else if(key === 'F12'){
        collectTheBill(event);
    }
}

const appendToBillTable = (product) => {
    //Si existe el elemento en la cuenta, actualizamos dicho elemento
    if(productsOnBill.hasOwnProperty(product['CODIGO'])) {
        var prOnBill = productsOnBill[product['CODIGO']];
        prOnBill.CANTIDAD += 1;
        prOnBill.IMPORTE = prOnBill.CANTIDAD * prOnBill.PVENTA;

        document.getElementById(`can-${product['CODIGO']}`).innerText = prOnBill.CANTIDAD;
        document.getElementById(`imp-${product['CODIGO']}`).innerText = prOnBill.IMPORTE;
        document.getElementById(`tr-${product['CODIGO']}`).scrollIntoView({ behavior: 'smooth' });

    //Si no extiste, lo añadimos a la cuenta y creamos una fila del prodcuto
    } else {
        productsOnBill[product['CODIGO']] = {
            DESCRIPCION: product['DESCRIPCION'],
            PVENTA: product['PVENTA'],
            CANTIDAD: 1,
            IMPORTE: product['PVENTA'],
        }

        // Crear una nueva fila
        var row = document.createElement('tr');
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

        // Añadir la fila a la tabla
        billTable.appendChild(row);
        row.scrollIntoView({ behavior: 'smooth' });

    }
}

const addProductToBill = async() => {
    if(inputSearchProduct.value){
        var res = await getProduct(inputSearchProduct.value);
        inputSearchProduct.value = '';
        if(typeof(res) === 'string'){
            var product = JSON.parse(res);
            appendToBillTable(product);
            totalH1.innerText = `Total: ${calculateTotalBill()}`;
        }else{
            // Cuando tenga de detectar varios productos y agregarlos a una tabla secundaria
        }
    }else{
        console.log('NO HAY NADA');
    }

}

const deleteProductFromBill = () => {
    alert('Borrar producto!...')
    console.log(selectedProductRow);
    if(selectedProductRow){
        var row = document.getElementById(selectedProductRow);
        if(row){
            row.parentNode.removeChild(row);
            delete productsOnBill[selectedProductRow__BDid];
            totalH1.innerText = `Total: ${calculateTotalBill()}`;
        }else{
            console.log('El elemento no existe.')
        }
    }
}

const collectTheBill = async (event) => {
    event.preventDefault();

    if(Object.keys(productsOnBill).length !== 0){
        submitTicket(bill = productsOnBill,printerName = selectPrinter.value, willPrint = true);
    }else{
        alert('Cuenta vacia!...')
    }
}


//Eventos asociados a nuestro documento
window.onload =  async function(){
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


}

billTable.addEventListener('click', function(event){
    const productRow = event.target.parentNode;
    selectedProductRow__BDid = productRow.name;
    selectedProductRow = productRow.id;
    document.getElementById(selectedProductRow).classList.add('table-primary')

});

inputSearchProduct.addEventListener('keypress', function(event){
    if(event.key === 'Enter'){
        addProductToBill()
    }
});

document.addEventListener('keydown', manageKeyPressed);

btnSearchProduct.addEventListener('click', addProductToBill);

submitBill.addEventListener('click', collectTheBill);