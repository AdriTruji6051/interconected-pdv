const insertForm = document.getElementById('insertProductForm');
const deleteForm = document.getElementById('deleteProductForm')
const inputCodigo = document.getElementById('codigo');
const inputDescripcion = document.getElementById('descripcion');
const inputPcosto = document.getElementById('pcosto');
const inputPventa = document.getElementById('pventa');
const inputMayoreo = document.getElementById('mayoreo');
const inputPorcentajeGanancia = document.getElementById('porcentaje_ganancia');
const inputDept = document.getElementById('dept');
const inputTipoVenta = document.getElementById('tipoVenta');
const inputUsaInventario = document.getElementById('usaInventario');
const inputDinventario = document.getElementById('dinventario');
const inputDinvminimo = document.getElementById('dinvminimo');
const sectionInventario = document.getElementById('inventario');

var updateProductoCodigo = '';

//Cuando carge el documento vemos si recibimos datos sobre la ultima incersion para notificar si se hizo el cambio correctamente
try{
    const urlParams = new URLSearchParams(window.location.search);
    const codigo = urlParams.get('status');

    if(codigo === '201'){
        alert('Base de datos actualizada!..')
    }
    else if(codigo === '202'){
        alert('Producto eliminado correctamente!..')
    }
    else if(codigo === '409'){
        alert('Problemas al actualizar la base de datos...')
    }

}catch (error){
    console.log(error)
}


async function isProductOn(){
    const codigo = inputCodigo.value;
    await fetch(`http://${SERVERIP}:5000/get/productById?value=${encodeURIComponent(codigo)}`)
    .then(response => response.json())
    .then(data => {
        console.log(data.product)

        if(data.product){
            alert('Producto ya resgistrado!...\n(Se cargaran los datos para modificar)');
            dataJSON = JSON.parse(data.product);

            updateProductoCodigo = dataJSON['CODIGO'];
            inputDescripcion.value = dataJSON['DESCRIPCION'];
            inputPcosto.value = dataJSON['PCOSTO'];
            inputPventa.value = dataJSON['PVENTA'];
            inputMayoreo.value = dataJSON['MAYOREO'];
            inputPorcentajeGanancia.value = dataJSON['PORCENTAJE_GANANCIA']
            inputDept.value = dataJSON['DEPT'];
            inputTipoVenta.checked = dataJSON['TVENTA'] === 'U' ? false: true
            inputUsaInventario.checked = dataJSON['DINVENTARIO'] === -1 ? false: true
            inputDinventario.value = dataJSON['DINVENTARIO'];
            inputDinvminimo.value = dataJSON['DINVMINIMO'];

            invStatus()
            
        }
    })
    .catch(error => console.log('Error: ', error));
}


//Cambiar el estado de modificar inventario o no
const invStatus = () => {
    if(inputUsaInventario.checked){
        inputDinventario.disabled = false;
        inputDinvminimo.disabled = false;
        sectionInventario.hidden = false;
    }else{
        inputDinventario.disabled = true;
        inputDinvminimo.disabled = true;
        sectionInventario.hidden = true;
    }
}


//Formulario crear o actualizar productos 
insertForm.addEventListener('submit', function(event){
    event.preventDefault();

    // Capturar los datos del formulario
    const codigo = document.getElementById('codigo').value;
    const descripcion = document.getElementById('descripcion').value;
    const pcosto = document.getElementById('pcosto').value;
    const pventa = document.getElementById('pventa').value;
    const mayoreo = document.getElementById('mayoreo').value;
    const porcentaje_ganancia = document.getElementById('porcentaje_ganancia').value;
    const dept = document.getElementById('dept').value;
    const tipoVenta = document.getElementById('tipoVenta').checked ? 'D' : 'U'; // true o false
    const usaInventario = document.getElementById('usaInventario').checked; // true o false
    var inventarioActual = document.getElementById('dinventario').value;
    var inventarioMinimo = document.getElementById('dinvminimo').value;

    if(!usaInventario){
        inventarioActual = -1;
        inventarioMinimo = 0;
    }


    const producto = {
        codigo: codigo,
        descripcion: descripcion,
        tipoVenta: tipoVenta,
        pcosto: pcosto,
        pventa: pventa,
        mayoreo: mayoreo,
        dept: dept,
        prioridad: null,
        inventarioActual: inventarioActual,
        inventarioMinimo: inventarioMinimo,
        inventarioMaximo: null,
        checadoEn: null,
        porcentaje_ganancia: porcentaje_ganancia,
    }

    var url = `http://${SERVERIP}:5000/insert/product`

    //Si se consigio un codigo reafirmamos si sigue siendo el mismo para hacer un update en vez de insert
    if(updateProductoCodigo === inputCodigo.value){
        url = `http://${SERVERIP}:5000/update/product`
    }

    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(producto)
    })
    .then(response => response.json())
    .then(data => {
        const url = `productosCRUD.html?status=${encodeURIComponent(data.status)}`
        window.open(url, '_self')
    })
    .catch((error) => {
        console.error('Error:', error);
    });
    
});

deleteForm.addEventListener('submit', function(event) {
    event.preventDefault()

    const codigo = {
        codigo: inputCodigo.value
    };

    fetch(`http://${SERVERIP}:5000/delete/product`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(codigo)
    })
    .then(response => response.json())
    .then(data => {
        const url = `productosCRUD.html?status=${encodeURIComponent(data.status)}`
        window.open(url, '_self')
    })
    .catch(error => {
        console.log('Error: ', error)
    })

});



inputUsaInventario.addEventListener('change', invStatus)

inputCodigo.addEventListener('blur', isProductOn);
