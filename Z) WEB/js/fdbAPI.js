const searchProductBtn = document.getElementById('searchProduct');
const inputProduct = document.getElementById('inputProduct')

alert("Hey hey hey pequeñño")

const getProduct = async() => {
    const id = inputProduct.value;
    const url = `http://localhost:5000/product?value=${encodeURIComponent(id)}`;

    await fetch(url)
    .then(response => response.json())
    .then(data => {
        document.getElementById('response').innerText = data.info;
    })
    .catch(error => console.error('Error:', error));
}

searchProductBtn.addEventListener('click', getProduct);

inputProduct.addEventListener('keypress', function(event) {
    if(event.key === 'Enter'){
        getProduct();
    }
});

