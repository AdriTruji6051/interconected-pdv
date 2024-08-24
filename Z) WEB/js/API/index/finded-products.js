function selectRowOnFindedProducts(event){
    const row = event.target.parentNode;
    focus_row_on_finded_products(row);
};

const show_available_products = (products) =>{
    findedDiv.hidden = false;
    findedDiv.focus();
    findedTable.innerHTML = '';
    products.forEach(prod => {
        append_new_finded_product_row(prod);
    });

    const firstRow = findedTable.firstChild;
    focus_row_on_finded_products(firstRow);
};

const addFindedProductToBill = () => {
    inputSearchProduct.value = '';
    inputSearchProduct.value = findedSelectedProductRow__BDid
    findedDiv.hidden = true;
    addProductToBill();
    reset_finded_product_var();
};

function focus_row_on_finded_products(row){
    if(row.classList.contains('table-primary')){
        row.classList.remove('table-primary');
        findedSelectedProductRow__BDid = '';
        findedSelectedProductRow = '';
    }else{
        if(document.getElementById(findedSelectedProductRow)){
            document.getElementById(findedSelectedProductRow).classList.remove('table-primary');
        }
        findedSelectedProductRow__BDid = row.name;
        findedSelectedProductRow = row.id;
        document.getElementById(findedSelectedProductRow).classList.add('table-primary');
    }
};

const reset_finded_product_var = () =>{
    findedSelectedProductRow = '';
    findedSelectedProductRow__BDid = '';
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

const go_to_next_finded_product = () => {
    const actualNode = document.getElementById(findedSelectedProductRow);
    const nextNode = actualNode.nextSibling;
    focus_row_on_finded_products(nextNode);
};

const go_to_previous_finded_product = () => {
    const actualNode = document.getElementById(findedSelectedProductRow);
    const previousNode = actualNode.previousSibling;
    focus_row_on_finded_products(previousNode);
}