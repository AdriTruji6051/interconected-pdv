function calculateTotalBill(productsToCalculate){
    var totalBill = 0;
    var totalProd = 0;
    for(var prod_cd in productsToCalculate){
        if(productsToCalculate[prod_cd].IMPORTE > 0){
            totalBill += productsToCalculate[prod_cd].IMPORTE;
            totalProd += Math.ceil(productsToCalculate[prod_cd].CANTIDAD)
        }else{
            selectedProductRow = `tr-${prod_cd}`;
            selectedProductRow__BDid = prod_cd;
            deleteProductFromBill();
        }
    }
    document.getElementById('total-productos').innerText = `Productos: ${totalProd}`;
    totalH1.innerText = `Total: ${totalBill}`;
    return totalBill;
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
        <td id='pv-${product['CODIGO']}'>${hasDiscount ? product.MAYOREO : product.PVENTA}</td>
        <td id='can-${product['CODIGO']}'>${product['CANTIDAD']}</td>
        <td id='imp-${product['CODIGO']}'>${product['IMPORTE']}</td>
    `;

    // Añadir la fila a la tabla y dirigirse a ella si no existe
    billTable.appendChild(row);
    focus_row_on_ticket(row);
}

function update_product_row(product){
    document.getElementById(`can-${product.CODIGO}`).innerText = product.CANTIDAD;
    document.getElementById(`imp-${product.CODIGO}`).innerText = product.IMPORTE;
    document.getElementById(`pv-${product.CODIGO}`).innerText = hasDiscount ? product.MAYOREO : product.PVENTA;

    document.getElementById(`tr-${product.CODIGO}`).scrollIntoView({ behavior: 'smooth' });
    focus_row_on_ticket(document.getElementById(`tr-${product.CODIGO}`));
}

function delete_product_row(row){
    const prevRow = row.previousSibling;
    const nextRow = row.nextSibling;
    row.parentNode.removeChild(row);
    
    selectedProductRow = '';
    selectedProductRow__BDid = '';
    if(prevRow && prevRow.nodeType !== 3){
        //Al borrar el nodo debemos llenar el espacio vacio en la cadena de nodos
        try{
            focus_row_on_ticket(document.getElementById(prevRow.id));
            prevRow.nextSibling = document.getElementById(nextRow.id);
        }catch (e){}
    }else{
        try{
            focus_row_on_ticket(document.getElementById(nextRow.id));
        }catch (e){}
    }
}

function focus_row_on_ticket (row){
    if(document.getElementById(selectedProductRow)){
        document.getElementById(selectedProductRow).classList.remove('table-primary');

        if(hasDiscount) document.getElementById(selectedProductRow).classList.add('table-warning')
    }
    selectedProductRow__BDid = row.name;
    selectedProductRow = row.id;
    document.getElementById(selectedProductRow).classList.remove('table-warning');
    document.getElementById(selectedProductRow).classList.add('table-primary');
    document.getElementById(selectedProductRow).scrollIntoView({ behavior: 'instant' });
};

const go_to_next_product = () => {
    const actualNode = document.getElementById(selectedProductRow);
    const nextNode = actualNode.nextSibling;
    //Si no hay nodos no hacemos focus
    if(nextNode != undefined) focus_row_on_ticket(nextNode);
    
};

const go_to_previous_product = () => {
    const actualNode = document.getElementById(selectedProductRow);
    const previousNode = actualNode.previousSibling;
    //Comprobamos si es un nodo de tipo texto, lo que significa que esta fuera del limite
    if(previousNode.nodeType !== 3) focus_row_on_ticket(previousNode);
};

function selectRowOnTicket(event){
    const row = event.target.parentNode;
    focus_row_on_ticket(row);
};

const deleteProductFromBill = () => {
    if(selectedProductRow){
        var row = document.getElementById(selectedProductRow);
        if(row){
            const deleteKey = selectedProductRow__BDid;
            delete_product_row(row);
            delete productsOnBill[deleteKey];
            calculateTotalBill(productsOnBill);
        }
    }
};

function add_discount_shader(){
    const productRows = billTable.children;
    for(let i = 0; i < productRows.length; i++) {
        const row = productRows[i]
        if(!row.classList.contains('table-primary')) row.classList.add('table-warning');
    }
}

function remove_discount_shader(){
    const productRows = billTable.children;
    for(let i = 0; i < productRows.length; i++) {
        const row = productRows[i]
        if(!row.classList.contains('table-primary')) row.classList.remove('table-warning');
    }
}