const container = document.querySelector("#container");
const addBook = document.querySelector("#addBook");
const form = document.querySelector("#form");
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
myLibrary.push(book1);
const book2 = new Book("naruto", "kishimoto", 800, "read");
myLibrary.push(book2);
display();

function createCard(book, index) {
        const card = document.createElement("div");
        card.classList.add("card");
        card.setAttribute("data-bookNumber", index);

        const titleElement = document.createElement("div");
        titleElement.textContent = book.title;
        
        const authorElement = document.createElement("div");
        authorElement.textContent = book.author;
  
        const pagesElement = document.createElement("div");
        pagesElement.textContent = book.pages;
  
        const readElement = document.createElement("div");
        readElement.textContent = book.read;
        readElement.setAttribute('id', 'readElement');

        changeStatus = document.createElement("button");
        changeStatus.setAttribute('id', 'changeStatusBtn');
        changeStatus.textContent = "change reading status";

        deleteBook = document.createElement("button");
        deleteBook.textContent = "delete book";
        deleteBook.setAttribute('id', 'deleteBookBtn');

        card.appendChild(titleElement);
        card.appendChild(authorElement);
        card.appendChild(pagesElement);
        card.appendChild(readElement);
        card.appendChild(changeStatus);
        card.appendChild(deleteBook);

        return card;
  };   

container.addEventListener('click', function(event){
      if(event.target.tagName === "BUTTON") {
                 const card = event.target.closest(".card");
                 const index = card.getAttribute('data-bookNumber');
    
              if(event.target.getAttribute('id') === "deleteBookBtn"){
                 container.removeChild(card);
                 myLibrary.splice(index, 1);
                 updateBookNumbers();
                 console.log("number of books in library after deletion: " + myLibrary.length)
              } 

              else if(event.target.getAttribute('id') === "changeStatusBtn"){
                myLibrary[index].read = myLibrary[index].read === 'read' ? 'not read' : 'read';
                card.querySelector("#readElement").textContent = myLibrary[index].read;
              }

      };         
});

function updateBookNumbers() {
  const cards = container.querySelectorAll('.card');
  cards.forEach((card, index) => {
      card.setAttribute('data-bookNumber', index);
  });
};

function display(){
    myLibrary.forEach((book, index)=> {
        if(!container.querySelector(`[data-bookNumber="${index}"]`)) {
                const card = createCard(book, index);
                container.appendChild(card);
          }     
    });
};

form.addEventListener('submit', function(event){
     event.preventDefault()

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
});
