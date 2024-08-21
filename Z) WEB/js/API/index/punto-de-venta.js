const btnSearchProduct = document.getElementById('btn-search-product');
const inputSearchProduct = document.getElementById('input-search-product')
const billTable = document.getElementById('bill-table-body');
const totalH1 = document.getElementById('total');
const submitBill = document.getElementById('submit-bill');
const selectPrinter = document.getElementById('select-printer')
const findedTable = document.getElementById('finded-products-table-body');
const findedDiv = document.getElementById('finded-products-container');
const btnAddFindedProduct = document.getElementById('add-finded-product');
const btnDiscount = document.getElementById('btn-aply-discount');
const btnDeleteRow = document.getElementById('btn-delete-row');

const divCantityProduct = document.getElementById('cantity-of-product');
const formCantityProduct = document.getElementById('form-cantity-of-product');
const inputCantityPRICE = document.getElementById('cantity-of-product-price');
const inputCantityWEIGHT = document.getElementById('cantity-of-product-weight');
const granelTitle = document.getElementById('granel-title');

const test = document.getElementById('test');

//Almacenamiento de la cuenta
var productsOnBill = {};
var hasDiscount = false;

//Variables para eliminar
var selectedProductRow = '';
var selectedProductRow__BDid = '';

//Variables para añadir por medio del buscador
var findedSelectedProductRow = '';
var findedSelectedProductRow__BDid = '';

window.onload =  onLoadFunction();

//Para tabla de ticket
billTable.addEventListener('click', function(event){
    selectRowOnTicket(event);
});

//Para tabla de busquedas
findedTable.addEventListener('click', function(event){
    selectRowOnFindedProducts(event);
});

inputSearchProduct.addEventListener('keypress', function(event){
    if(event.key === 'Enter'){
        addProductToBill();
    }
});

findedDiv.addEventListener('blur', function(event){     // TO DO Arreglar esto que no funcina ya, no se pq xd
    alert('Mejor nadota');
});

btnDiscount.addEventListener('click', undoOrAplyDiscount);

btnDeleteRow.addEventListener('click', deleteProductFromBill);

btnAddFindedProduct.addEventListener('click', addFindedProductToBill);

document.addEventListener('keydown', manageKeyPressed);

btnSearchProduct.addEventListener('click', addProductToBill);

submitBill.addEventListener('click', collectTheBill);

inputCantityWEIGHT.addEventListener('input', function(event){
    console.log(inputCantityWEIGHT.value);
})

formCantityProduct.addEventListener('submit', function(event){
    event.preventDefault();
    const weight = inputCantityWEIGHT.value;


});



