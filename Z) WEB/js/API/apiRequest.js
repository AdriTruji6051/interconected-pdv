const searchProductBtn = document.getElementById('searchProduct');
const inputProduct = document.getElementById('inputProduct')

const getProduct = async() => {
    const id = inputProduct.value;
    const url = `http://${SERVERIP}:5000/get/product?value=${encodeURIComponent(id)}`;

    await fetch(url)
    .then(response => response.json())
    .then(data => {
        document.getElementById('response').innerText = '';
        if(typeof(data.info) === 'object'){
            data.info.forEach(element => {
                document.getElementById('response').innerText += element + '\n';
            });
        }
        else{
            document.getElementById('response').innerText = data.info;
        }
    })
    .catch(error => console.error('Error:', error));
}

document.addEventListener('keydown',function(event){
    if(event.key === 'F5'){
        event.preventDefault()
        alert('Holis bobis')
    }
});

searchProductBtn.addEventListener('click', getProduct);

inputProduct.addEventListener('keypress', function(event) {
    if(event.key === 'Enter'){
        getProduct();
    }
});

