
# Library

A simple browser-based CRUD app to track books. Built as part of The Odin Project's JavaScript curriculum.

[Live Demo](#) <!-- https://itzdoxa.github.io/library/ -->

---

## Features

- Add books with title, author, page count, and reading status
- Toggle read/unread per book
- Edit any book's details inline
- Delete books from the library

---

## Why I rebuilt this

I actually built this project two years ago. Looking back at that code, three things stood out as genuinely bad:

**No separation of concerns:**
Business logic and DOM manipulation were completely tangled together. Deleting a book meant removing a DOM node and splicing an array in the same breath. There was no real "data layer", the UI *was* the data.

**Fragile indexing:**
Books were identified by their position in the array. Delete one in the middle, and every index after it shifts. The old code had a whole `updateBookNumbers()` function just to patch this up after every deletion. I was fighting a problem that shouldn't have existed.

**DOM-dependent everything:**
If the UI changed, the logic broke. There was no way to reason about the state of the library without looking at what was rendered on screen.

This version separates those responsibilities clearly. Books live in a JavaScript array. The DOM is just a view of that array. Every operation touches the data first, then re-renders.

---

## How it's built

Vanilla HTML, CSS, and JavaScript. No frameworks.

### Data layer

Books are plain objects created with a constructor, stored in an array, validated with a types object, and identified by a `crypto.randomUUID()`, stable across any reordering or deletion.

```js
function Book(title, author, pages, read) {
    this.uuid = crypto.randomUUID();
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.read = read;
}
```

### The update function

This was the most interesting part to build. Rather than requiring all fields to be filled on every update, `updateBook` takes a partial object, only the fields you want to change, and handles the rest:

- Validates that all provided property names exist on a book
- Type-checks each value against a schema (`bookTypes`)
- Checks that at least one field is *meaningfully* different, normalizing strings to lowercase so `"Dune"` and `"DUNE"` don't count as a change
- Only then applies the updates

```js
const bookTypes = {
    title: 'string',
    author: 'string',
    pages: 'number',
    read: 'boolean',
}
```

### Event delegation

One listener on the container handles all card interactions. Buttons declare their intent via `data-action` attributes. The handler walks up the DOM with `closest('[data-uuid]')` to find which book was targeted.

```js
deleteBookBtn.dataset.action = 'delete';
readStatusContainer.dataset.action = 'readToggle';
editBookBtn.dataset.action = 'edit';
...

libraryContainer.addEventListener('click', (event) => {
    const deleteBtn = event.target.closest('[data-action="delete"]');
    if (!deleteBtn) return;
    const bookUUID = deleteBtn.closest('[data-uuid]').getAttribute('data-uuid');
    deleteBook(bookUUID);
    renderLibrary();
});
```

### Add vs. Edit

The same `<dialog>` and `<form>` handle both creating and editing a book. A `formMode` variable (`'create'` or `'edit'`) switches the submit handler's behavior. When editing, the form pre-fills with the book's current data before the dialog opens.

---

## What I'd do differently

The UI is functional but minimal. I originally wanted to render an actual bookshelf; illustrated covers, physical book spines, the whole thing. That got cut so I could move on with JavaScript. Maybe in the future :)



