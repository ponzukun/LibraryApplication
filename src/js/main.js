// Import our custom CSS
import '../scss/styles.scss'

// Import fontawesome
import '@fortawesome/fontawesome-free/js/fontawesome';
import '@fortawesome/fontawesome-free/js/solid';
import '@fortawesome/fontawesome-free/js/regular';

if (process.env.NODE_ENV !== 'production') {
  console.log('Looks like we are in development mode!');
}

const config = {
  url: "https://openlibrary.org/api/books?jscmd=data&format=json&bibkeys=ISBN:",
  target: "book-cards"
}

function clearPage(ele_id) {
  document.getElementById(ele_id).innerHTML = "";
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

  callApi(isbn)
    .then(data => {
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

      // APIから取得した本の情報を表示
      generateBookCard(current_book, config.target);
    })
    .catch(() => alert("指定されたISBNの本は存在しません。"))
});

async function callApi(isbn) {
  const res = await fetch(config.url + isbn);
  const res_json = await res.json();
  return res_json;
}

function generateBookCard(current_book, target) {
  clearPage(target);

  const card_container = document.createElement("div");
  card_container.classList.add("card", "mt-5", "mb-3");
  card_container.innerHTML = `
    <div class="row no-gutters col-12">
      <div class="col-md-4">
        <img src="${current_book.cover}" class="card-img p-3" alt="">
      </div>
      <div class="col-md-8">
        <div class="card-body">
          <h5 class="card-title m-0 font-weight-bold">${current_book.title}</h5>
          <p class="m-0">by ${current_book.author_list}</p>
          <p class="card-text pt-2 book-description">${current_book.description}</p>
        </div>
      </div>
    </div>
    <div class="col-12">
      <table class="table table-striped">
        <tbody>
          <tr>
            <th scope="row" class="col-3 col-md-4">Page</th>
            <td class="col-9 col-md-8">
              <p class="m-2">${current_book.number_of_pages}</p>
            </td>
          </tr>
          <tr>
            <th scope="row" class="col-3 col-md-4">Publisher</th>
            <td class="col-9 col-md-8">
              <p class="m-2">${current_book.publisher_list}</p>
            </td>
          </tr>
          <tr>
            <th scope="row" class="col-3 col-md-4">Published Date</th>
            <td class="col-9 col-md-8">
              <p class="m-2">${current_book.publish_date}</p>
            </td>
          </tr>
          <tr>
            <th scope="row" class="col-3 col-md-4">Categories</th>
            <td class="col-9 col-md-8">
              <p class="m-2">${current_book.categorie_list}</p>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  `;

  document.getElementById(target).append(card_container);
}
