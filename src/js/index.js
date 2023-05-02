import ProductService from "./productService.js";

// Modal Form for edit products
const modalForm = document.getElementById("form-edit");
const modalInputFile = document.getElementById("file-edit");
const modalImage = document.getElementById("fileImage-edit");

const modal = new bootstrap.Modal( document.getElementById("modal-edit") );

// Main form
const form = document.getElementById("form");
const file = document.getElementById("file");
const fileImage = document.getElementById("fileImage");

// Table
const tableBody = document.getElementById("table-body");

// Table buttons
const firstPageButton = document.getElementById("btnFirstPage");
const previousPageButton = document.getElementById("btnPreviousPage");
const nextPageButton = document.getElementById("btnNextPage");
const lastPageButton = document.getElementById("btnLastPage");

const actualPageSpan = document.getElementById("actualPage");
const maxPageSpan = document.getElementById("maxPage");

//Constants
const TABLE_ROWS = 4;
const TABLE_COLUMNS = 4;

// Status Page
let actualPage = 1;
let maxPage = 1;

let showUniqueMessage = true;

// Pagination
const updatePaginationButtonStatus = () => {
    if (maxPage <= 1) {
        firstPageButton.disabled = true;
        previousPageButton.disabled = true;
        nextPageButton.disabled = true;
        lastPageButton.disabled = true;
    }
    else if (actualPage <= 1) {
        firstPageButton.disabled = true;
        previousPageButton.disabled = true;
        nextPageButton.disabled = false;
        lastPageButton.disabled = false;
    }
    else if (actualPage >= maxPage) {
        firstPageButton.disabled = false;
        previousPageButton.disabled = false;
        nextPageButton.disabled = true;
        lastPageButton.disabled = true;
    }
    else if (actualPage <= maxPage) {
        firstPageButton.disabled = false;
        previousPageButton.disabled = false;
        nextPageButton.disabled = false;
        lastPageButton.disabled = false;
    }
}

const activeShowUniqueMessage = (message) => {
    const tr = document.createElement("tr");
    const td = document.createElement("td");

    td.classList.add("unique-message", "text-center");
    td.colSpan = TABLE_COLUMNS;
    td.textContent = message;

    tr.append(td);
    tableBody.replaceChildren(tr);
    showUniqueMessage = true;
}

const printData = (data) => {
    
    if ( data.length == 0 ) {
        if ( actualPage >= maxPage) previousPage();
        else activeShowUniqueMessage("La base de datos se encuentra vacia");
        return;
    }

    // Elimina todos los rows en el DOM de la tabla
    tableBody.replaceChildren("");

    data.forEach( (element) => createRowProduct(element) );
}

function updateMaxPage(totalProducts) {
    maxPage = Math.ceil(totalProducts / TABLE_ROWS);
    maxPageSpan.textContent = maxPage;
}

const fethDataBase = (from, rows) => {
    ProductService.getProducts(from, rows)
        .then(({ totalProducts, products }) => {
            printData(products);
            updateMaxPage(totalProducts);
            updatePaginationButtonStatus();
        })
        .catch(error => {
            console.error(error);
            activeShowUniqueMessage("Error con la conexion a la base de datos")
        });
}

const refreshTable = () => {
    const from = ( actualPage - 1 ) * TABLE_ROWS;
    fethDataBase(from, TABLE_ROWS);
}

const setModalFormValues = (product, name, price, path) => {
    modalForm.elements.product.value = product;
    modalForm.elements.name.value = name;
    modalForm.elements.price.value = price;
    modalForm.elements.file.value = "";
    modalImage.src = path;
}

const editButtonAction = ( product, name, price, path ) => {
    setModalFormValues(product, name, price, path);
    modal.show();
}

const deleteButtonAction = ( id ) => {
    ProductService.deleteProductWithId(id)
        .then(res => {
            if (!res.ok) {
                throw new Error('No se pudo eliminar el elemento');
            }
        })
        .catch((error) => {
            console.error(error);
        })
        .finally(() => {
            refreshTable();
        });
}

const createRowProduct = ({ product, name, price, path }) => {

    if (showUniqueMessage) tableBody.getElementsByClassName("unique-message")[0]?.parentElement.remove();

    const tr = document.createElement("tr");
    const tdPrice = document.createElement("td");
    const tdName = document.createElement("td");
    const tdImage = document.createElement("td");
    const tdButtons = document.createElement("td");

    const divImage = document.createElement("div");
    const image = document.createElement("img");
    divImage.classList.add("fit-container");
    image.classList.add("fit-content");

    const editButton = document.createElement("button");
    const deleteButton = document.createElement("button");

    editButton.classList.add("btn", "btn-primary");
    deleteButton.classList.add("btn", "btn-danger");

    const editButtonSimbol = document.createElement("i");
    const deleteButtonSimbol = document.createElement("i");

    editButtonSimbol.classList.add("bx", "bxs-pencil");
    deleteButtonSimbol.classList.add("bx", "bx-x");

    divImage.append(image);
    tdImage.append(divImage);
    editButton.append(editButtonSimbol);
    deleteButton.append(deleteButtonSimbol);
    tdButtons.append(editButton, deleteButton);

    editButton.addEventListener("click", () => editButtonAction(product, name, price, path) );
    deleteButton.addEventListener("click", () => deleteButtonAction(product) );

    tdName.textContent = name;
    tdPrice.textContent = "$" + price;
    image.src = path;

    tr.append(tdName, tdPrice, tdImage, tdButtons);

    tableBody.append(tr);
}

const firstPage = () => {
    actualPage = 1;
    actualPageSpan.textContent = actualPage;
    refreshTable();
}
const previousPage = () => {
    actualPage = (actualPage <= 1) ? 1 : actualPage - 1;
    actualPageSpan.textContent = actualPage;
    refreshTable();
}
const nextPage = () => {
    actualPage = (actualPage >= maxPage) ? actualPage : actualPage + 1;
    actualPageSpan.textContent = actualPage;
    refreshTable();
}
const lastPage = () => {
    actualPage = maxPage;
    actualPageSpan.textContent = actualPage;
    refreshTable();
}

// Eventos
const setupEvents = () => {

    firstPageButton.addEventListener( "click", firstPage );
    previousPageButton.addEventListener( "click", previousPage );
    nextPageButton.addEventListener( "click", nextPage );
    lastPageButton.addEventListener( "click", lastPage );

    // Formulario
    form.addEventListener("submit", (event) => {
        event.preventDefault();

        const formData = new FormData(form);
        formData.append("product", new Date().getTime());

        ProductService.addProduct(formData)
            .then( res => {
                if ( !res.ok ) {
                    throw new Error('No se pudo actualizar el elemento');
                }
                form.reset();
                fileImage.src = "data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=";

                const formDataObject = {};
                formData.forEach( (value, key) => formDataObject[key] = value );
                formDataObject["path"] = URL.createObjectURL(formDataObject.file);
        
                if ( actualPage >= maxPage && tableBody.childElementCount < 4 ) createRowProduct(formDataObject)
                else refreshTable();
            })
            .catch( (error) => {
                console.error( error );
            });


    })

    file.addEventListener("change", () => {
        if ( !file.files[0] ) return fileImage.src = "data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=";

        const url = URL.createObjectURL(file.files[0]);
        fileImage.src = url;
    })

    // Formulario modal
    modalForm.addEventListener("submit", (event) => {
        event.preventDefault();

        const formData = new FormData(modalForm);
        ProductService.updateProduct(formData)
            .then( () => {
                refreshTable();
                modal.hide();
            })
    })

    modalInputFile.addEventListener("change", () => {
        if ( !modalInputFile.files[0] ) return fileImage.src = "data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=";

        const url = URL.createObjectURL(modalInputFile.files[0]);
        modalImage.src = url;
    })

    // Eventos DOM
    window.addEventListener("load", () => {
        refreshTable();
    })
}

setupEvents();
