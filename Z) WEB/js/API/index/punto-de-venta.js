const btnSearchProduct = document.getElementById('btn-search-product');
const inputSearchProduct = document.getElementById('input-search-product')
const billTable = document.getElementById('bill-table-body');
const totalH1 = document.getElementById('total');
const submitBill = document.getElementById('submit-bill');
const selectPrinter = document.getElementById('select-printer');

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
const btnCancelGranel = document.getElementById('btn-cancel-granel');

const ticketSubmitDiv = document.getElementById('complete-the-ticket-submit');
const inputChange = document.getElementById('change-for-ticket');

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

//Codigo de producto a granel
var granelProduct = '';

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

btnDiscount.addEventListener('click', undoOrAplyDiscount);

btnDeleteRow.addEventListener('click', deleteProductFromBill);

btnAddFindedProduct.addEventListener('click', addFindedProductToBill);

document.addEventListener('keydown', manageKeyPressed);

btnSearchProduct.addEventListener('click', addProductToBill);

submitBill.addEventListener('click', function(event){
    ticketSubmitDiv.hidden = false;
    ticketSubmitDiv.focus();
    inputChange.value = calculateTotalBill(productsOnBill);

});

inputCantityWEIGHT.addEventListener('input', function(){
    const PVENTA = granelProduct.PVENTA;
    inputCantityPRICE.value = inputCantityWEIGHT.value * PVENTA;
})

inputCantityPRICE.addEventListener('input', function(){
    const PVENTA = granelProduct.PVENTA;
    inputCantityWEIGHT.value = inputCantityPRICE.value / PVENTA;
})

btnCancelGranel.addEventListener('click', function(){
    granelProduct = '';
    divCantityProduct.hidden = true;
});

formCantityProduct.addEventListener('submit', function(event){
    event.preventDefault();
    const weight = inputCantityWEIGHT.value;
    apppend_to_bill_table(granelProduct, weight);
    granelProduct = '';
    divCantityProduct.hidden = true;
    inputSearchProduct.focus();
});

divCantityProduct.addEventListener('focusout', function(event){
    if(!divCantityProduct.contains(event.relatedTarget)){
        divCantityProduct.hidden = true;
    }
});

findedDiv.addEventListener('focusout', function(event){
    if(!findedDiv.contains(event.relatedTarget)){
        reset_finded_product_var();
        findedDiv.hidden = true;
    }
});

ticketSubmitDiv.addEventListener('focusout', function(event){
    if(!ticketSubmitDiv.contains(event.relatedTarget)){
        ticketSubmitDiv.hidden = true;
    }
});



