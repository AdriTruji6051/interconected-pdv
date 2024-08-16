const btnSearchProduct = document.getElementById('btn-search-product');
const inputSearchProduct = document.getElementById('input-search-product')
const billTable = document.getElementById('bill-table-body');
const totalH1 = document.getElementById('total');

var productsOnBill = {}
var selectedProductRowId

function calculateTotalBill(){
    var totalBill = 0;
    for(let clave in productsOnBill){
        totalBill += productsOnBill[clave].IMPORTE;
    }

    return totalBill;
}

const appendToBillTable = (product) => {
    if(productsOnBill.hasOwnProperty(product['CODIGO'])) {
        let prOnBill = productsOnBill[product['CODIGO']];
        prOnBill.CANTIDAD += 1;
        prOnBill.IMPORTE = prOnBill.CANTIDAD * prOnBill.PVENTA;

        document.getElementById(`can-${product['CODIGO']}`).innerText = prOnBill.CANTIDAD;
        document.getElementById(`imp-${product['CODIGO']}`).innerText = prOnBill.IMPORTE;
    } else {
        productsOnBill[product['CODIGO']] = {
            DESCRIPCION: product['DESCRIPCION'],
            PVENTA: product['PVENTA'],
            CANTIDAD: 1,
            IMPORTE: product['PVENTA'],
        }

        // Crear una nueva fila
        let row = document.createElement('tr');
        row.id = `tr-${product['CODIGO']}`;

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

        // Añadir el evento
        row.addEventListener('click', function() {
            if(selectedProductRowId){
                document.getElementById(`tr-${selectedProductRowId}`).classList.remove('table-primary');
            }
            selectedProductRowId = product['CODIGO'];
            document.getElementById(`tr-${selectedProductRowId}`).classList.add('table-primary');
        });
    }
}



const addProductToBill = async() => {
    var res = await getProduct(inputSearchProduct.value);
    if(typeof(res) === 'string'){
        let product = JSON.parse(res);
        appendToBillTable(product);
        inputSearchProduct.value = '';
        totalH1.innerText = `Total: ${calculateTotalBill()}`;
    }else{
        // Cuando tenga de detectar varios productos y agregarlos a una tabla secundaria
    }
}


const deleteProductFromBill = () => {
    alert('Borrar producto!...')
    console.log(selectedProductRowId);
    if(selectedProductRowId){
        let row = document.getElementById(`tr-${selectedProductRowId}`);
        if(row){
            row.hidden = true;
            delete productsOnBill[selectedProductRowId];
            totalH1.innerText = `Total: ${calculateTotalBill()}`;
        }else{
            console.log('El elemento no existe.')
        }
    }
}

function manageKeyPressed(event){
    console.log('Hey:', event.key);

    let key = event.key;
    if(key === 'Delete'){
        deleteProductFromBill();
    }
}


document.addEventListener('keydown', manageKeyPressed)

btnSearchProduct.addEventListener('click', addProductToBill)