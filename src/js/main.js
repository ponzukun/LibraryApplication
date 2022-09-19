// Import our custom CSS
import '../scss/styles.scss'

// Import fontawesome
import '@fortawesome/fontawesome-free/js/fontawesome';
import '@fortawesome/fontawesome-free/js/solid';
import '@fortawesome/fontawesome-free/js/regular';

const config = {
  url: "https://openlibrary.org/api/books?jscmd=data&format=json&bibkeys=ISBN:"
}

class Book {
  constructor(title, cover, authors, description, number_of_pages, publishers, publish_date, categories) {
    this.title = title;
    this.cover = cover;
    this.authors = authors;
    this.description = description;
    this.number_of_pages = number_of_pages;
    this.publishers = publishers;
    this.publish_date = publish_date;
    this.categories = categories;
  }
}

document.getElementById("isbn-search-btn").addEventListener("click", () => {
  const isbn = document.getElementById("isbn-search").value;

  callApi(isbn).then(data => {
    // forの中でBookインスタンスを代入するため宣言
    let current_book;

    for (let key in data) {
      const book = data[key];
      current_book = new Book(
        book.title,
        book.cover.medium,
        book.authors.map(author => author.name),
        book.by_statement,
        book.number_of_pages,
        book.publishers.map(publisher => publisher.name),
        book.publish_date,
        book.subjects.map(subject => subject.name),
      );
    }

    // console.log(current_book);

    // この関数でAPIから取得した本の情報を表示
    // createBookCard(current_book);
  });
});

async function callApi(isbn) {
  const res = await fetch(config.url + isbn);
  const res_json = await res.json();
  return res_json;
}
