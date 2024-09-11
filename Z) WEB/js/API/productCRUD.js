const insertForm = document.getElementById('insertProductForm');
const deleteForm = document.getElementById('deleteProductForm');

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

const today = new Date().toISOString().split('T')[0];

//Trackear actualizaciones
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

inputPcosto.addEventListener('input', function(){
    inputPventa.value = parseFloat(inputPcosto.value) + inputPcosto.value * (inputPorcentajeGanancia.value / 100);
});

inputPorcentajeGanancia.addEventListener('input', function(){
    inputPventa.value = parseFloat(inputPcosto.value) + inputPcosto.value * (inputPorcentajeGanancia.value / 100);
});


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
    const codigo = inputCodigo.value;
    const descripcion = inputDescripcion.value;
    const pcosto = inputPcosto.value;
    const pventa = inputPventa.value;
    const mayoreo = inputMayoreo.value;
    const porcentaje_ganancia = inputPorcentajeGanancia.value;
    const dept = inputDept.value;
    const tipoVenta = inputTipoVenta.checked ? 'D' : 'U'; // true o false
    const usaInventario = inputUsaInventario.checked; // true o false
    var inventarioActual = inputDinventario.value;
    var inventarioMinimo = inputDinvminimo.value;

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
        checadoEn: today,
        porcentaje_ganancia: porcentaje_ganancia,
    }

    var url = `http://${SERVERIP}:5000/insert/product`

    //Si se consigio un codigo reafirmamos si sigue siendo el mismo para hacer un update en vez de insert
    if(updateProductoCodigo === inputCodigo.value){
        url = `http://${SERVERIP}:5000/update/product`
        alert('update')
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
        alert('Error al ingresar los datos')
    });
    
});

deleteForm.addEventListener('submit', function(event) {
    event.preventDefault()

    const codigo = {
        codigo: document.getElementById('delete-codigo').value
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


document.addEventListener('keydown', function(event) {
    // Verificar si la tecla presionada es "Enter"
    if (event.key === 'Enter') {
        event.preventDefault(); // Evitar el comportamiento por defecto del Enter
        const formElements = Array.from(document.querySelectorAll('#insertProductForm input, #myForm button'));

        // Encontrar el índice del campo actual en el que está el foco
        const currentIndex = formElements.findIndex(el => el === document.activeElement);

        // Si hay un siguiente elemento, mover el foco
        if (currentIndex !== -1 && currentIndex < formElements.length - 1) {
            formElements[currentIndex + 1].focus();
        }
    }
});


inputUsaInventario.addEventListener('change', invStatus)

inputCodigo.addEventListener('blur', isProductOn);
