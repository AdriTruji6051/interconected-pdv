const btnSearchProduct = document.getElementById('btn-search-product');
const inputSearchProduct = document.getElementById('input-search-product')

const billTable = document.getElementById('bill-table-body');
const totalH1 = document.getElementById('total');
const submitBillBtn = document.getElementById('submit-bill');
const selectPrinter = document.getElementById('select-printer');

const findedDiv = document.getElementById('finded-products-container');
const findedTable = document.getElementById('finded-products-table-body');
const btnAddFindedProduct = document.getElementById('add-finded-product');

const btnDiscount = document.getElementById('btn-aply-discount');
const btnDeleteRow = document.getElementById('btn-delete-row');
const btnCommonArticle = document.getElementById('btn-common-article')

const divCantityProduct = document.getElementById('cantity-of-product');
const formCantityProduct = document.getElementById('form-cantity-of-product');
const inputCantityPRICE = document.getElementById('cantity-of-product-price');
const inputCantityWEIGHT = document.getElementById('cantity-of-product-weight');
const granelTitle = document.getElementById('granel-title');
const btnCancelGranel = document.getElementById('btn-cancel-granel');

const ticketSubmitDiv = document.getElementById('complete-the-ticket-submit');
const inputChange = document.getElementById('change-for-ticket');
const ticketSubmitForm = document.getElementById('ticket-change&notes-form');

const commonArticleDiv = document.getElementById('common-article-div');
const commonArticleCantity = document.getElementById('common-article-cantity');
const commonArticleDescription = document.getElementById('common-article-name');
const commonArticlePrice = document.getElementById('common-article-price');
const commonArticleForm = document.getElementById('common-article-form');

const btnFullscreen = document.getElementById('btn-fullscren');


//Almacenamiento de la cuenta
var productsOnBill = {};
var hasDiscount = false;

//Variables para eliminar
var selectedProductRow = '';
var selectedProductRow__BDid = '';

//Variables para añadir por medio del buscador
var findedSelectedProductRow = '';
var findedSelectedProductRow__BDid = '';

//Objeto de producto a granel
var granelProduct = '';

//ID objeto comun
var IDcommonPr = 0;

window.onload =  onLoadFunction();

btnDiscount.addEventListener('click', undoOrAplyDiscount);

btnDeleteRow.addEventListener('click', deleteProductFromBill);

btnAddFindedProduct.addEventListener('click', addFindedProductToBill);

document.addEventListener('keydown', manageKeyPressed);

btnSearchProduct.addEventListener('click', searchProduct);

submitBillBtn.addEventListener('click', submit_Bill);

ticketSubmitForm.addEventListener('submit', collectTheBill);

btnCommonArticle.addEventListener('click', commonProduct);

formCantityProduct.addEventListener('submit', addGranelProduct);

btnFullscreen.addEventListener('click', fullScreenRequest);

//Inputs dinamicos felicida
inputCantityWEIGHT.addEventListener('input', function(){
    const PVENTA = granelProduct.PVENTA;
    inputCantityPRICE.value = inputCantityWEIGHT.value * PVENTA;
});

inputCantityPRICE.addEventListener('input', function(){
    const PVENTA = granelProduct.PVENTA;
    inputCantityWEIGHT.value = inputCantityPRICE.value / PVENTA;
});

inputChange.addEventListener('input', function(){
    const total = inputChange.value - calculateTotalBill(productsOnBill);
    document.getElementById('cantity-of-change').innerText =  total < 0 ? 'No alcanza!...' :  `$ ${total}`;
});

//Si pierden el foco se cierran
divCantityProduct.addEventListener('focusout', function(event){
    if(!divCantityProduct.contains(event.relatedTarget)){
        divCantityProduct.hidden = true;
        inputSearchProduct.focus();
    }
});

findedDiv.addEventListener('focusout', function(event){
    if(!findedDiv.contains(event.relatedTarget)){
        reset_finded_product_var();
        findedDiv.hidden = true;
        inputSearchProduct.focus();
    }
});

commonArticleDiv.addEventListener('focusout', function(event){
    if(!commonArticleDiv.contains(event.relatedTarget)){
        commonArticleDiv.hidden = true;
        inputSearchProduct.focus();
    }
});

ticketSubmitDiv.addEventListener('focusout', function(event){
    if(!ticketSubmitDiv.contains(event.relatedTarget)){
        ticketSubmitDiv.hidden = true;
        inputSearchProduct.focus();
    }
});

//Hacer que pierdan el foco para que se cierren
btnCancelGranel.addEventListener('click', function(){
    granelProduct = '';
    inputSearchProduct.focus();
});

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
        searchProduct();
    }
});

//Para cobranza
document.getElementById('show-notes').addEventListener('click', function(){
    document.getElementById('notes-for-sell-div').hidden = false;
});

//CHAMBEANDO AQUI **********************************
commonArticleForm.addEventListener('submit', function(event){
    event.preventDefault();
    const price = parseFloat(commonArticlePrice.value);
    product = {
        CODIGO: `COMM-${IDcommonPr}`,
        DESCRIPCION: commonArticleDescription.value,
        PVENTA: price,
        MAYOREO: price,
        PCOSTO: price * .9,
        TVENTA: "U",
    }

    const cantity = commonArticleCantity.value;
    add_product_to_bill(product, cantity);
    
    IDcommonPr = IDcommonPr + 1;

    commonArticleCantity.value = null;
    commonArticleDescription.value = '';
    commonArticlePrice.value = null;

    inputSearchProduct.focus();
});