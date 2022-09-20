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
  constructor(title, cover, author_list, description, number_of_pages, publisher_list, publish_date, categorie_list) {
    this.title = title;
    this.cover = cover;
    this.author_list = author_list;
    this.description = description;
    this.number_of_pages = number_of_pages;
    this.publisher_list = publisher_list;
    this.publish_date = publish_date;
    this.categorie_list = categorie_list;
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
