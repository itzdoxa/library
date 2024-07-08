const container = document.querySelector("#container");
const addBook = document.querySelector("#addBook");
const form = document.querySelector("#form");
const openForm = document.querySelector("#open-form");
const closeForm = document.querySelector(".close-form")
const modal = document.querySelector("#modal");
const bookAuthor = document.querySelector("#author");
const bookTitle = document.querySelector("#title");
const bookPages = document.querySelector("#pages");

const myLibrary = [];

function Book(title, author, pages, read) {
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.read = read;
};

const book1 = new Book("one piece", "oda", 1000, "read");
const book2 = new Book("naruto", "kishimoto", 800, "read");
const book3 = new Book("death note", "Takeshi Obata", 500, "read");
const book4 = new Book("Bleach", "Tite Kubo", 900, "not-read");
const book5 = new Book("Berserk", "Kentaro Miura", 1300, "read")

myLibrary.push(book1, book2, book3, book4, book5);
display();

function createCard(book, index) {
        const card = document.createElement("div");
        card.classList.add("card");
        card.setAttribute("data-bookNumber", index);

        const titleElement = document.createElement("div");
        titleElement.textContent = book.title;
        titleElement.classList.add("book-title");
        
        const authorElement = document.createElement("div");
        authorElement.textContent = book.author;
        authorElement.classList.add("book-author");
  
        const pagesElement = document.createElement("div");
        pagesElement.textContent = book.pages;

        const bookInfoContainer = document.createElement("div");
        bookInfoContainer.classList.add("book-info");

        const buttonContainer = document.createElement('div');
        buttonContainer.classList.add("button-container");
  
        const readElement = document.createElement("button");
        readElement.textContent = book.read;
        readElement.setAttribute('id', 'readElement');

        deleteBook = document.createElement("button");
        deleteBook.textContent = "delete book";
        deleteBook.setAttribute('id', 'deleteBookBtn');

        bookInfoContainer.appendChild(titleElement);
        bookInfoContainer.appendChild(authorElement);
        bookInfoContainer.appendChild(pagesElement);
        
        buttonContainer.appendChild(readElement);
        buttonContainer.appendChild(deleteBook);
        card.appendChild(bookInfoContainer);
        card.appendChild(buttonContainer);

        return card;
  }; 

function display(){
    myLibrary.forEach((book, index)=> {
        if(!container.querySelector(`[data-bookNumber="${index}"]`)) {
                const card = createCard(book, index);
                container.appendChild(card);
                const readElement = card.querySelector("#readElement");
                colorReadElement(index, readElement);
          };     
    });
};

function colorReadElement(index, readElement){
        if(myLibrary[index].read === 'read') {
            readElement.classList.add('read')
            readElement.classList.remove('not-read')
        } else if(myLibrary[index].read === 'not-read') {
            readElement.classList.add('not-read')
            readElement.classList.remove('read')
        }
};

function updateBookNumbers() {
  const cards = container.querySelectorAll('.card');
  cards.forEach((card, index) => {
      card.setAttribute('data-bookNumber', index);
  });
};

container.addEventListener('click', function(event){
  if(event.target.tagName === "BUTTON") {
             const card = event.target.closest(".card");
             const index = card.getAttribute('data-bookNumber');
             const readElement = card.querySelector("#readElement");

          if(event.target.getAttribute('id') === "deleteBookBtn"){
             container.removeChild(card);
             myLibrary.splice(index, 1);
             updateBookNumbers();
             console.log("number of books in library after deletion: " + myLibrary.length)
          } 

          else if(event.target.getAttribute('id') === "readElement"){
            myLibrary[index].read = myLibrary[index].read === 'read' ? 'not-read' : 'read';
            readElement.textContent = myLibrary[index].read
            colorReadElement(index, readElement);
          }

  };         
});

form.addEventListener('submit', function(event){
     const bookExists = (currentbook) => {
            return currentbook.title === bookTitle.value && currentbook.author === bookAuthor.value;
        };

      if(myLibrary.some(bookExists)) {
        alert("book already exists in the library")
        return;
      }
      else {
        const readingStatus = document.querySelector('input[name="status"]:checked');
        const userBook = new Book(bookTitle.value, bookAuthor.value, bookPages.value, readingStatus.value);
        myLibrary.push(userBook);
        display();
      }
      modal.close();
      form.reset();
});

openForm.addEventListener('click', ()=> {
  modal.showModal();
});

closeForm.addEventListener('click', () => {
  modal.close();
})


