module.exports = {
    getMovies: () => {
        return fetch('/api/movies')
            .then(response => response.json());
    }
};



// module.exports = {
//   getMovies: () => {
//     return fetch('/api/movies')
//       .then(response => response.json());
//   },
//     getMovie : (id) => {
//         return fetch(`/api/movies/${id}`)
//             .then(resp => resp.json());
//     },
//     postMovie : (book) => {
//         return fetch('api/movies', {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json',
//             },
//             body: JSON.stringify(book),
//         })
//     },
//     patchMovie : (book, id) => {
//         return fetch(`api/movies/${id}`, {
//             method: 'PATCH',
//             headers: {
//                 'Content-Type': 'application/json',
//             },
//             body: JSON.stringify(book),
//         })
//     },
//     deleteMovie : (id) => {
//         return fetch(`api/movies/${id}`, {
//             method: 'DELETE',
//             headers: {
//                 'Content-Type': 'application/json',
//             },
//         })
//     }
// };
