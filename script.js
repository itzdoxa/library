const libraryContainer = document.querySelector('#library-container');
const formDialog = document.querySelector("#form-dialog");
const form = document.querySelector('form');
const addBookBtn = document.querySelector('#add-book-btn');
const resetFormBtn = document.querySelector('#reset-form-btn');
const closeFormBtn = document.querySelector("#close-form-btn")
const submitFormBtn = document.querySelector('#submit-form-btn');

let formMode = 'create';
let editUUID = null;

function Book(title, author, pages, read) {
    this.uuid = crypto.randomUUID();
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.read = read;
}

const bookTypes = {
    title: 'string',
    author: 'string',
    pages: 'number',
    read: 'boolean',
}

const myLibrary = [];

function addBookToLibrary(book) { 
    myLibrary.push(book);
}

const book1 = new Book("The Hobbit", "J.R.R. Tolkien", 295, false);
const book2 = new Book("Dune", "Frank Herbert", 412, true);
const book3 = new Book("1984", "George Orwell", 328, false);
const book4 = new Book("The Great Gatsby", "F. Scott Fitzgerald", 180, true);
const book5 = new Book("Harry Potter and the Philosopher's Stone", "J.K. Rowling", 223, true);
const book6 = new Book("Moby Dick", "Herman Melville", 635, false);
const book7 = new Book("Crime and Punishment", "Fyodor Dostoevsky", 671, true);
const book8 = new Book("The Catcher in the Rye", "J.D. Salinger", 277, false);
const book9 = new Book("Lord of the Flies", "William Golding", 224, true);
const book10 = new Book("Brave New World", "Aldous Huxley", 311, false);

addBookToLibrary(book1);
addBookToLibrary(book2);
addBookToLibrary(book3);
addBookToLibrary(book4);
addBookToLibrary(book5);
addBookToLibrary(book6);
addBookToLibrary(book7);
addBookToLibrary(book8);
addBookToLibrary(book9);
addBookToLibrary(book10);

function updateBook({uuid, ...updates}) {

      const updateProps = Object.keys(updates);

      const bookToUpdate = myLibrary.find((book) => book.uuid === uuid); // this already checks the type/literal string so...
 
      if (!bookToUpdate) return; 

        // atleast 1 property must be present in updates object 
        if (updateProps.length < 1) return;

        // check if the updates object has valid property names that match our Book Object Definition at the top
        if (!updateProps.every(updatedProperty => Object.keys(bookTypes).includes(updatedProperty))) return;

        // check if the property values are of the expected data type 
        if (!updateProps.every(updatedProperty => typeof updates[updatedProperty] === bookTypes[updatedProperty])) return;

        // compare  the values of update object props to the book prop, 
        // such that atleast one property value is different
        if(!updateProps.some(updatedProperty => {
            if (typeof(updates[updatedProperty]) === 'string'){ 
               return updates[updatedProperty].toLowerCase() !== bookToUpdate[updatedProperty].toLowerCase()
            }
            else return updates[updatedProperty] !== bookToUpdate[updatedProperty];
        })) return;


        // finally, update all props (even the ones that didnt change)
        updateProps.forEach(updatedProperty => bookToUpdate[updatedProperty] = updates[updatedProperty])
};

function deleteBook(uuid) {
    const bookToDelete = myLibrary.find((book) => book.uuid === uuid)

    if (!bookToDelete) return;

    const index = myLibrary.indexOf(bookToDelete);
    myLibrary.splice(index, 1);
}

function getBookInfo(uuid) {
    const book = myLibrary.find((book) => book.uuid === uuid);

    if (!book) return;
    return book;
}

function renderLibrary (){
        libraryContainer.replaceChildren(); 

        myLibrary.forEach(book => {
                const card = document.createElement('div');
                card.classList.add('card'); 

                const authorContainer = document.createElement('div');
                const titleContainer = document.createElement('div');
                const pagesContainer = document.createElement('div');

                const readStatusContainer = document.createElement('button'); 
                const deleteBookBtn = document.createElement('button');
                const editBookBtn = document.createElement('button');

                card.dataset.uuid = book.uuid;

                authorContainer.textContent = book.author;
                titleContainer.textContent = book.title;
                pagesContainer.textContent = book.pages;
                readStatusContainer.textContent = book.read ? 'read' : 'unread';
                deleteBookBtn.textContent = 'Delete';
                editBookBtn.textContent = 'Edit';

                authorContainer.classList.add('author-container');
                titleContainer.classList.add('title-container');
                pagesContainer.classList.add('pages-container');
                readStatusContainer.classList.add(book.read ? 'read' : 'not-read');

                deleteBookBtn.dataset.action = 'delete';
                readStatusContainer.dataset.action = 'readToggle';
                editBookBtn.dataset.action = 'edit';

                card.appendChild(titleContainer);
                card.appendChild(authorContainer);
                card.appendChild(pagesContainer);      
                card.appendChild(readStatusContainer);
                card.appendChild(deleteBookBtn);
                card.appendChild(editBookBtn);

                libraryContainer.appendChild(card);
       });
}

renderLibrary();

// add & update book (uses the same form dialog)
form.addEventListener('submit', (event) => {
    event.preventDefault();

    const data = new FormData(form);
    
    const pages = Number(data.get('pages'));
    const readingStatus = (data.get('reading-status') === 'read') ? true : false;

    if (formMode === 'create'){
        const book = new Book(data.get('title'), data.get('author'), pages, readingStatus);
        addBookToLibrary(book);
    } else if (formMode === 'edit') {
        updateBook({uuid: editUUID, title: data.get('title'), author: data.get('author'), pages: pages, read: readingStatus})
    }

    formDialog.close();
    form.reset();
    renderLibrary();
});

//delete book
libraryContainer.addEventListener("click", (event) => {

    const deleteBtn = event.target.closest('[data-action="delete"]'); 
    if (!deleteBtn) return; 

    const bookCard = deleteBtn.closest('[data-uuid]')
    const bookUUID = bookCard.getAttribute('data-uuid');

    deleteBook(bookUUID);
    renderLibrary();
});

// read button toggle
libraryContainer.addEventListener("click", (event) =>{

    const readToggleBtn = event.target.closest('[data-action="readToggle"]'); 
    if (!readToggleBtn) return; 

    const bookCard = readToggleBtn.closest('[data-uuid]')
    const bookUUID = bookCard.getAttribute('data-uuid');

    const readingStatus = readToggleBtn.textContent; 

    updateBook({uuid: bookUUID, read: !(readingStatus === 'read')})
    renderLibrary();
});

// Edit book button
libraryContainer.addEventListener('click', (event) => {

    const editBookBtn = event.target.closest('[data-action="edit"]'); 
    if (!editBookBtn) return; 

    const bookCard = editBookBtn.closest('[data-uuid]')
    editUUID = bookCard.getAttribute('data-uuid');

    const book = getBookInfo(editUUID);

    form.title.value = book.title;
    form.author.value = book.author;
    form.pages.value = book.pages;
    form.querySelector(`input[value="${book.read ? 'read' : 'not-read'}"]`).checked = true;

    formDialog.showModal();
    formMode = 'edit';
});

addBookBtn.addEventListener('click', () => {
  formDialog.showModal();
  formMode = 'create';
});

resetFormBtn.addEventListener('click', () => {
    form.reset();
});

closeFormBtn.addEventListener('click', () => {
   formDialog.close();
})