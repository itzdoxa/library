const container = document.querySelector("#container");
const addBook = document.querySelector("#addBook");
const form = document.querySelector("#form");
const bookAuthor = document.querySelector("#author");
const bookTitle = document.querySelector("#title");
const bookPages = document.querySelector("#pages");

let changeStatus;
let deleteBook;
let card;

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

function display() {

    for(let i = 0; i < myLibrary.length; i++) { 

       if (container.querySelector(`[data-bookNumber="${i}"]`)) {
           continue;
       }

        card = document.createElement("div");
        card.classList.add("card");
        card.setAttribute("data-bookNumber", i);

        let titleElement = document.createElement("div");
        titleElement.textContent = myLibrary[i].title;
        
        let authorElement = document.createElement("div");
        authorElement.textContent = myLibrary[i].author;
  
        let pagesElement = document.createElement("div");
        pagesElement.textContent = myLibrary[i].pages;
  
        let readElement = document.createElement("div");
        readElement.textContent = myLibrary[i].read;

        changeStatus = document.createElement("button");
        changeStatus.textContent = "change reading status"
        deleteBook = document.createElement("button");
        deleteBook.textContent = "delete book";

        card.appendChild(titleElement);
        card.appendChild(authorElement);
        card.appendChild(pagesElement);
        card.appendChild(readElement);
        card.appendChild(changeStatus);
        card.appendChild(deleteBook);

        container.appendChild(card);

        console.log("number of books in array: " + myLibrary.length);

        card.addEventListener('click', function(event){
          let target = event.currentTarget;
    
          container.removeChild(container.querySelector(`[data-bookNumber="${i}"]`));
          myLibrary.splice(target.getAttribute("data-bookNumber") , 1);
    
          myLibrary.forEach((book) => {
               console.log(book);
             });  
           console.log("number of books in array after deleting book: " + myLibrary.length);
        });
    


      };
  };   

  

form.addEventListener('submit', function(event){
     event.preventDefault()

     const bookExists = (currentbook) => {
            return currentbook.title === bookTitle.value && currentbook.author === bookAuthor.value;
        }

      if(myLibrary.some(bookExists)) {
        alert("book already exists in the library")
        return;
      }
      else {
        const bookStatus = document.querySelector('input[name="status"]:checked');
        const userBook = new Book(bookTitle.value, bookAuthor.value, bookPages.value, bookStatus.value);
        myLibrary.push(userBook);
        display();
      }
});




// changeStatus.addEventListener('click', function(){
//   targetBook = event.currentTarget;
//   console.log(targetBook)
//   myLibrary[i].read = targetBook.read === "read" ? "unread" : "read";
//   readElement.textContent = myLibrary[i].read;
// });
