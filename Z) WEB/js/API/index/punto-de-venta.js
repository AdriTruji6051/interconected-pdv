const btnSearchProduct = document.getElementById('btn-search-product');
const inputSearchProduct = document.getElementById('input-search-product')
const billTable = document.getElementById('bill-table-body');
const totalH1 = document.getElementById('total');
const submitBill = document.getElementById('submit-bill');
const selectPrinter = document.getElementById('select-printer')
const findedTable = document.getElementById('finded-products-table-body');
const findedDiv = document.getElementById('finded-products-container');
const btnAddFindedProduct = document.getElementById('add-finded-product');

//Almacenamiento de la cuenta
var productsOnBill = {};

//Variables para eliminar
var selectedProductRow = '';
var selectedProductRow__BDid = '';

//Variables para añadir por medio del buscador
var findedSelectedProductRow = '';
var findedSelectedProductRow__BDid = '';

window.onload =  await onLoadFunction();

//Para tabla de ticket
billTable.addEventListener('click', function(event){
    focusRowOnTicket(event);
});

//Para tabla de busquedas
findedTable.addEventListener('click', function(event){
    focusRowOnFindedProducts(event);
});

inputSearchProduct.addEventListener('keypress', function(event){
    if(event.key === 'Enter'){
        addProductToBill();
    }
});

findedDiv.addEventListener('blur', function(event){     // TO DO Arreglar esto que no funcina ya, no se pq xd
    alert('Mejor nadota');
});

btnAddFindedProduct.addEventListener('click', addFindedProductToBill);

document.addEventListener('keydown', manageKeyPressed);

btnSearchProduct.addEventListener('click', addProductToBill);

submitBill.addEventListener('click', collectTheBill);