const productForm = document.getElementById('productForm');

productForm.addEventListener('submit', function(event){
    event.preventDefault();

    // Capturar los datos del formulario
    const codigo = document.getElementById('codigo').value;
    const descripcion = document.getElementById('descripcion').value;
    const pcosto = document.getElementById('pcosto').value;
    const pventa = document.getElementById('pventa').value;
    const mayoreo = document.getElementById('mayoreo').value;
    const porcentaje_ganancia = document.getElementById('porcentaje_ganancia').value;
    const dept = document.getElementById('dept').value;
    const tipoVenta = document.getElementById('tipoVenta').checked; // true o false
    const usaInventario = document.getElementById('usaInventario').checked; // true o false
    var inventarioActual = document.getElementById('dinventario').value;
    var inventarioMinimo = document.getElementById('dinvminimo').value;

    if(!usaInventario){
        alert('NO USA INVENTARIO')
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

    fetch(`http://${SERVERIP}:5000/submit/ticket`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(producto)
    })
    .then(response => response.json())
    .then(producto => {
        console.log('Respuesta recibida:', producto);
    })
    .catch((error) => {
        console.error('Error:', error);
    });
    
});
