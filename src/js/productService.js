class ProductService {

    static deleteProductWithId(id) {
        return fetch("api/products/delete.php", {
            method: "POST",
            headers: {
                'Accept': 'application/json, text/plain, */*',
                "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8" // otherwise $_POST is empty
            },
            body: "id=" + id,
        })
    }

    static async getProducts(from, rows) {
        const data = await fetch(`api/products/read.php?from=${from}&rows=${rows}`);
        return await data.json();
    }

    static addProduct(formData) {
        return fetch("api/products/create.php", {
            method: "POST",
            body: formData,
        })
    }

    static updateProduct(formData) {
        return fetch("api/products/update.php", {
            method: "POST",
            body: formData,
        })
    }
}

export default ProductService;