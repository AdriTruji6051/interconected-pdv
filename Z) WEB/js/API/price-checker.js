const searchProductBtn = document.getElementById('searchProduct');
const inputProduct = document.getElementById('inputProduct')

const getProducts = async() => {
    const id = inputProduct.value;
    const url = `http://${SERVERIP}:5000/get/product?value=${encodeURIComponent(id)}`;

    await fetch(url)
    .then(response => response.json())
    .then(data => {
        console.log(data)

        document.getElementById('response').innerText = '';
        if(typeof(data.product) === 'object'){
            data.product.forEach(product => {
                console.log(product)
                const p = document.createElement('p');
                p.innerText = `${product['DESCRIPCION']}: ${product['PVENTA']}`;
                document.getElementById('response').appendChild(p);
            });
        }
        else{
            document.getElementById('response').innerText = data.product;
        }
    })
    .catch(error => console.error('Error:', error));
}


//Eventos linkeados a nuestro documento
window.onload = function(){
    inputProduct.focus()
}

document.addEventListener('keydown',function(event){
    if(event.key === 'F5'){
        event.preventDefault()
        alert('Holis bobis')
    }
});

searchProductBtn.addEventListener('click', getProducts);

inputProduct.addEventListener('keypress', function(event) {
    if(event.key === 'Enter'){
        getProducts();
    }
});

