/**
 * es6 modules and imports
 */
// import sayHello from './hello';
// sayHello('World');

import $ from "jquery";

/**
 * require style imports
 */
const {getMovies, getMovie, deleteMovie, patchMovie, postMovie} = require('./api.js');

//this will be for the loading animation//
const loadMovies = () => {
    $('#load').show();
}


getMovies().then((movies) => {
    console.log('Here are all the movies:');
    movies.forEach(({title, rating, id}) => {
        console.log(`id#${id} - ${title} - rating: ${rating}`);
    });
}).catch((error) => {
    alert('Oh no! Something went wrong.\nCheck the console for details.')
    console.log(error);
});


getMovie(1).then(movies => {
    console.log('Here is the movie:');
        console.log(`${movies.title} ${movies.rating}`);
    }).catch(() =>
    console.log('error, this did not work'));


postMovie({
    "title": "Casablanca",
    "rating": "4",
    "id": 1
})

