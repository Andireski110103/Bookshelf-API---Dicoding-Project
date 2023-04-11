const { nanoid } = require('nanoid');
const books = require('./books');

const addBooksHandler = (request, h) =>
{
    const {name, year, author, summary, publisher, pageCount, readPage, reading} = request.payload;

   
    if (name == undefined){
        const response = h.response ({
            status: "fail",
            message: "Gagal menambahkan buku. Mohon isi nama buku"
        });
        response.code(400);
        return response;
    }
 

    if (readPage > pageCount)
    {
        const response = h.response(
            {
                status : 'fail',
                message : 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount'
            });
            response.code(400);
            return response;
    }
    const id = nanoid(16);
    const insertedAt = new Date().toISOString();
    const updatedAt = insertedAt;

    const finished = (pageCount === readPage);
    
    const dataBuku = {
        name, year, author, summary, publisher, pageCount, readPage, reading, id, insertedAt, updatedAt, finished
    };

    books.push(dataBuku);


    const isSuccess = books.filter ((book) => book.id === id).length > 0;
    if (isSuccess) {
        const response = h.response ({
            status : "success",
            message : "Buku berhasil ditambahkan",
            data: {
              bookId : id, 
            }
        });
            response.code(201);
            return response;
        };
      
}


const getAllBooksHandler = (request, h) => {
  const { name, reading, finished } = request.query;
  
    if (books.length === 0) {
      const response = h.response({
        status: 'success',
        data: {
          books: [],
        },
      });

      response.code(200);
      return response;
    }

      let filteredBooks = books;
      if (name) {
        filteredBooks = books.filter((book) => book.name.toLowerCase().includes(name.toLowerCase()));
      }
    
      if (reading) {
        filteredBooks = books.filter((book) => Number(book.reading) === Number(reading));
      }
    
      if (finished) {
        filteredBooks = books.filter((book) => Number(book.finished) === Number(finished));
      }
  
    const response = h.response({
      status: 'success',
      data: {
        books: filteredBooks.map((book) => ({
          id: book.id,
          name: book.name,
          publisher: book.publisher,
      }))
    }
  });

    response.code(200);
    return response;
};
        
const getBookByIdHandler = (request, h) =>
{
  const {id} = request.params;

  const book = books.filter ((book) => book.id === id )[0];

  if (book !== undefined){
  return {
    status : 'success',
    data : {
      book
    }
  };
}
    const response = h.response ({
      status : 'fail',
      message : 'Buku tidak ditemukan'
    });
    response.code(404);
    return response;
};

const editBookHandler = (request, h) => {
  const {id}  = request.params;

  const {name, year, author, summary, publisher, pageCount, readPage, reading} = request.payload;  
  const updatedAt = new Date().toISOString();
  if (name == undefined){
        const response = h.response ({
            status: "fail",
            message: "Gagal memperbarui buku. Mohon isi nama buku"
        });
        response.code(400);
        return response;
    }
 

    if (readPage > pageCount)
    {
        const response = h.response(
            {
                status : 'fail',
                message : 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount'
            });
            response.code(400);
            return response;
    }

  const index = books.findIndex((book) => book.id === id);
  if (index !== -1){
    const finished = pageCount === readPage;
    
    books[index] = {
      ...books[index],
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      finished,
      reading,
      updatedAt,
    };

    const response = h.response ({
      status : 'success',
      message  : 'Buku berhasil diperbarui'
    });
    response.code(200);
    return response;
  }
  else {
        const response = h.response ({
      status: 'fail',
      message: 'Gagal memperbarui buku. Id tidak ditemukan'
    });
    response.code(404);
    return response;
  }
}

const deleteBookHandler = (request, h) =>
{
  const { id } = request.params;

  const index = books.findIndex((book) => book.id === id);

  if (index !== -1){
    books.splice(index, 1);
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil dihapus'
  });
  response.code(200);
  return response;
  }
  const response = h.response ({
    status :'fail',
    message :'Buku gagal dihapus. Id tidak ditemukan'
  })
  response.code(404);
  return response;
}

module. exports = {addBooksHandler, getAllBooksHandler, getBookByIdHandler, editBookHandler, deleteBookHandler};