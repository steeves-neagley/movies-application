/**
 * es6 modules and imports
 */
// import sayHello from './hello';
// sayHello('World');

import $ from "jquery";



const {getMovies} = require('./api.js');

const APIFront = 'http://www.omdbapi.com/?t=';
const APIBack = "&apikey=d18aa323";
/**
 * require style imports
 */



function renderMovies() {
    getMovies().then((movies) => {


            movies.forEach((movies) => {

                let title = movies.title;
                let id = movies.id;
                let rating = movies.rating;
                let genre = movies.genre;

                $.ajax(APIFront + title + APIBack).done((data) => {
                    let updatedMovie = {

                        "image": data.Poster,
                        "id": id,
                        "rating": rating,
                        "genre": genre,
                        "title": title
                    };

                    fetch(`./api/movies/${id}`, {
                            method: 'PUT',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify(updatedMovie)
                        }
                    ).then(getMovies)
                        .then(render);

                });
            })
        }
    );
}


function render(){
    if (!$('.container').hasClass('container2')) {
        $('.container').addClass('container2');
    }
    $('#bodyText').html('<div class="col display-1"><img src="loader.gif">\n</div>');
    getMovies().then((movies)=> {
        let output = '';
        movies.forEach(({title, rating, id, genre, image}) =>{
            output += '<div class="movieStats col-sm-12 col-md-3 border border-dark p-0"><h2 class="m-0">' + title + '</h2>';
            output += '<p class="m-0">Rating: ' + rating + '</p>';
            output += '<p class="m-0">Genre: ' + genre + '</p>';
            // output += '<p class="m-0">ID: ' + id + '</p>';
            output += '<button class="editBtn text-hide" data-toggle="modal" data-target="#editModal"><img src="edit.png"></button>';
            output += '<button class="deleteBtn btn"><img src="delete.png"></button><br>';
            output += `<img class="poster" data-toggle="modal" data-target="#exampleModalCenter" src="${image}"></div>`;
            //Can remove the data-toggle as is for the
            // modals for information on movies with
            // ajax requests.
        });

        $('#bodyText').html(output);


        $('.editBtn').click(function() {
            let title = $(this).parent().children().first().html();
            let rating = $(this).parent().children().next().html();
            let movieId = $(this).parent().children().next().next().next().html();

            let formattedTitle = title.slice(7);
            let formattedRating = rating.slice(8);
            let formattedId = movieId.slice(4);

            $('#editTitle').val(formattedTitle);
            $('#editRating').val(formattedRating);
            $('#editId').val(formattedId);

        });

        $('.deleteBtn').click(function () {
            let movieId = $(this).parent().children().next().next().next().html().slice(4);
            $(this).parent().fadeOut("slow");
            return fetch(`./api/movies/${movieId}`, {
                method: 'DELETE',}
            ).then(getMovies)
                .then(render);

        });



        //// Attempted to add data poster

        $('.poster').click(function () {

            //      $(this).parent().children().next().css('background-color', 'yellow');
            let title = $(this).parent().children().first().html();
            console.log(title);

            $.ajax(APIFront + title + APIBack).done((data) => {
                console.log(data);
                output = '';
                output += '<div><h3>' + title +'</h3>';
                output += `<img class="miniPoster" src="${data.Poster}">`;
                output += '<p class="text-left plotText"><strong>Plot:</strong> ' + data.Plot + '</p>';
                output += '<p><strong>Actors:</strong> '+ data.Actors+'</p>';
                output += '<p><strong>Runtime:</strong> '+ data.Runtime+'</p>';
                output += '<p><strong>Released:</strong> '+ data.Released+'</p></div>';


                console.log(output);

                $('.modal-info').html(output);

            });


            //// End

        });

    });
    $(".container").removeClass(' container2 ')
}
document.getElementsByTagName('body')[0].onload = render();

const saveNewMovie = (e) => {
    e.preventDefault();
    let movieTitle = $('#newTitle').val();
    let movieRating = $('#titleRating').val();
    let movieGenre = $('#addGenre').val();

    // let posterURL = $.ajax(APIFront + movieTitle + APIBack).done((data) =>{
    //     console.log(data, data.Poster);
    //     return(data.Poster);
    // });

    let newMovie = {
        "title": movieTitle,
        "rating": movieRating,
        "genre": movieGenre,
        // "image": posterURL
    };

    fetch('/api/movies', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(newMovie)
    })
        .then(renderMovies);
};

const editMovie = (e) => {
    e.preventDefault();
    let movieTitle = $('#editTitle').val();
    let movieRating = $('#editRating').val();
    let movieId = $('#editId').val();
    let movieGenre = $('#editGenre').val();
    let newMovie = {
        "title": movieTitle,
        "rating": movieRating,
        "genre": movieGenre
    };
    return fetch(`./api/movies/${movieId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(newMovie)}
    )
        .then(renderMovies);
};


$('#formSubmit').click(saveNewMovie);

$('#editSubmit').click(editMovie);

$('#sortBy').change(function () {
    getMovies().then((movies) => {


            movies.sort(function (a, b) {

                let c = $('#sortBy').val();

                if (c === 'title') {

                    let nameA = a.title.toUpperCase();
                    let nameB = b.title.toUpperCase();

                    if (nameA < nameB) {
                        return -1;
                    } else if (nameA > nameB) {
                        return 1;
                    } else return 0;
                }else if (c === 'rating') {

                    let nameA = a.rating.toUpperCase();
                    let nameB = b.rating.toUpperCase();

                    if (nameA < nameB) {
                        return 1;
                    } else if (nameA > nameB) {
                        return -1;
                    } else return 0;
                }
                else if (c === 'genre'){

                    let nameA = a.genre.toUpperCase();
                    let nameB = b.genre.toUpperCase();

                    if (nameA < nameB) {
                        return -1;
                    } else if (nameA > nameB) {
                        return 1;
                    } else return 0;
                }
            });
            let output = '';

            movies.forEach(({title, rating, id, genre, image}) => {
                output += '<div class="movieStats col-sm-12 col-md-3 border border-dark p-0"><h1 class="m-0">' + title + '</h1>';
                output += '<p class="m-0">Rating: ' + rating + '</p>';
                output += '<p class="m-0">Genre: ' + genre + '</p>';
                // output += '<p class="m-0">ID: ' + id + '</p>';
                output += '<button class="editBtn text-hide" data-toggle="modal" data-target="#editModal"><img src="edit.png"></button>';
                output += '<button class="deleteBtn btn"><img src="delete.png"></button><br>';
                output += `<img class="poster" data-toggle="modal" data-target="#exampleModalCenter" src="${image}"></div>`;


                $('#bodyText').html(output);

                $('.poster').click(function () {

                    //      $(this).parent().children().next().css('background-color', 'yellow');
                    let title = $(this).parent().children().first().html();
                    console.log(title);

                    $.ajax(APIFront + title + APIBack).done((data) => {
                        console.log(data);
                        output = '';
                        output += '<div><h3>' + title + '</h3>';
                        output += `<img class="miniPoster" src="${data.Poster}">`;
                        output += '<p class="text-left plotText"><strong>Plot:</strong> ' + data.Plot + '</p>';
                        output += '<p><strong>Actors:</strong> ' + data.Actors + '</p>';
                        output += '<p><strong>Runtime:</strong> ' + data.Runtime + '</p>';
                        output += '<p><strong>Released:</strong> ' + data.Released + '</p></div>';


                        console.log(output);

                        $('.modal-info').html(output);

                    });

                });
            });
        }
    )
});



// const {getMovies, getMovie, deleteMovie, patchMovie, postMovie} = require('./api.js');
//
// //this will be for the loading animation//
// const loadMovies = () => {
//     $('#load').show();
// };
//
//
// getMovies().then((movies) => {
//     console.log('Here are all the movies:');
//     movies.forEach(({title, rating, id}) => {
//         console.log(`id#${id} - ${title} - rating: ${rating}`);
//     });
// }).catch((error) => {
//     alert('Oh no! Something went wrong.\nCheck the console for details.')
//     console.log(error);
// });
//
//
// getMovie(1).then(movies => {
//     console.log('Here is the movie:');
//         console.log(`${movies.title} ${movies.rating}`);
//     }).catch(() =>
//     console.log('error, this did not work'));
//
//
// postMovie({
//     "title": "Bee Movie",
//     "rating": "1",
//
// }).then(getMovies()).then((movies) => {
//   console.log('Here are all the movies:');
//     movies.forEach(({title, rating, id}) => {
//         console.log(`id#${id} - ${title} - rating: ${rating}`);
//   });
// }).catch(() =>
//   console.log("error"));



