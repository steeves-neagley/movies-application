/**
 * es6 modules and imports
 */

import $ from "jquery";

const {getMovies} = require('./api.js');

const APIFront = 'http://www.omdbapi.com/?t=';
const APIBack = "&apikey=d18aa323";

/**
 * require style imports
 */
let formattedId;

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

    //----------------- DISPLAY LOADING ICON -----------------------

    $('#bodyText').html('<div class="col display-1"><h6>"please work"</h6><img src="img/loadbar2.svg" alt="gif">\n</div>');


    //----------------- BUILDING MOVIE CARDS -----------------------

    getMovies().then((movies)=> {
        let output = '';
        movies.forEach(({title, rating, id, genre, image}) =>{
            output += '<div id="movieId-' + id + '" class="movieStats col-sm-12 col-md-3 border border-dark p-0"><h3 class="m-0">' + title + '</h3>';
            output += '<p id="rating" class="m-0">Rating: ' + rating + '</p>';
            output += '<p id="genre" class="m-0">Genre: ' + genre + '</p>';
            output += '<button id="editButton- title' + id + '" class="editBtn text-hide" data-toggle="modal" data-target="#editModal"><img src="img/edit.png" alt="" width="25px"></button>';
            output += '<button class="deleteBtn btn"><img src="img/delete.png" alt="" width="25px"></button><br>';
            output += `<img class="poster" data-toggle="modal" data-target="#exampleModalCenter" src="${image}"></div>`;
            //Can remove the data-toggle as is for the
            // modals for information on movies with
            // ajax requests.
        });

        $('#bodyText').html(output);


//----------------- EDIT BUTTON ON CLICK FUNCTION -----------------


        $('.editBtn').click(function() {
            let title = $(this).parent().children().first().html();
            let rating = $(this).parent().children().next().html();
            let movieId = $(this).parent().attr("id");
            console.log(movieId);
            let formattedTitle = title;
            let formattedRating = rating.slice(8);
            formattedId = movieId.split("-")[1];
            console.log('formattedId',formattedId);

            $('#editTitle').val(formattedTitle);
            $('#editRating').val(formattedRating);
            $('#editId').val(formattedId);


        });


// --------------- DELETE ON CLICK FUNCTION ----------------------


        $('.deleteBtn').click(function () {
            let movieId = $(this).parent().attr("id");
            console.log(movieId);
            movieId =  movieId.split("-")[1];
            console.log(movieId);
            $(this).parent().fadeOut("slow");
            fetch(`./api/movies/${movieId}`, {
                method: 'DELETE',}
            )
                // .then(getMovies)
                // .then(render);
        });



        //--------------- FOR RENDER, POSTER ONCLICK INFO CARD ------------

        $('.poster').click(function () {

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

        });

    });


    //--------------- REMOVES LOADING GIF ------------------


    $(".container").removeClass(' container2 ')
}
document.getElementsByTagName('body')[0].onload = render();


//----------------- ADD A MOVIE CARD ----------------


const saveNewMovie = (e) => {
    e.preventDefault();
    let movieTitle = $('#newTitle').val();
    let movieRating = $('#titleRating').val();
    let movieGenre = $('#addGenre').val();


    let newMovie = {
        "title": movieTitle,
        "rating": movieRating,
        "genre": movieGenre,
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


//---------------- EDITING CURRENT MOVIE ----------------


const editMovie = (e, formattedId) => {
    e.preventDefault();
    let movieTitle = $('#editTitle').val();
    console.log(movieTitle);
    let movieRating = $('#editRating').val();
    console.log(movieRating);
    let movieId = $('#editId').val();
    console.log('editMovie movieId', movieId);
    let movieGenre = $('#editGenre').val();
    console.log(movieGenre);
    let newMovie = {
        "title": movieTitle,
        "rating": movieRating,
        "genre": movieGenre
    };
    fetch(`./api/movies/${movieId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(newMovie)}
    )
        .then(renderMovies);
};

//------------ ADD NEW MOVIE BUTTON -------

$('#formSubmit').click(saveNewMovie);

//------------- EDIT CURRENT MOVIE BUTTON ------

$('#editSubmit').click(editMovie);

//-------------- SORT FUNCTION ----------------

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


            //------------- OUTPUT OF SORTED MOVIES ----------------------

            movies.forEach(({title, rating, id, genre, image}) => {
                output += '<div class="movieStats col-sm-12 col-md-3 border border-dark p-0"><h3 class="m-0">' + title + '</h3>';
                output += '<p class="m-0">Rating: ' + rating + '</p>';
                output += '<p class="m-0">Genre: ' + genre + '</p>';
                output += '<button class="editBtn text-hide" data-toggle="modal" data-target="#editModal"> <img src="img/edit.png" width="25px"></button>';
                output += '<button class="deleteBtn btn"> <img src="img/delete.png" width="25px"></button><br>';
                output += `<img class="poster" data-toggle="modal" data-target="#exampleModalCenter" src="${image}"></div>`;


                $('#bodyText').html(output);


                //---------------- FOR SORT, POSTER ONCLICK FUNCTION -------------

                $('.poster').click(function () {

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






