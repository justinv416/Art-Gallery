//Declares variable called app as an empty object. 
const app = {};

//random number generator
app.generateRandomNum = function(max) {
    return Math.floor(Math.random() * max)
}

//Function that will display art with parameters that will be passed in during the ajax call.
//Note: might consolidate this with displaySearchArt function in the future. 
app.displayRandomArt = function(imgSrc, title, artist, date, classification, medium, origin) {
    $('.art__image').attr('src', `https://www.artic.edu/iiif/2/${imgSrc}/full/843,/0/default.jpg`);
    $('.art__description--title').text(`${title}`);
    $('.art__description--artist').text(`${artist}`);
    $('.art__description--date').text(`${date}`);
    $('.art__description--classification').text(`${classification}`);
    $('.art__description--medium').text(`${medium}`);
    $('.art__description--origin').text(`${origin}`);
};

//Function that generates HTML to display art based on the search. 
app.displaySearchArt = function(data) {
    const dataHTML = `
        <div id="results-container">
            <img src=https://www.artic.edu/iiif/2/${data.image_id}/full/843,/0/default.jpg class="art__image--search"> 
            <div class="art__description">
                <div class="art__description--details">
                    <h2 class="art__description--title">${data.title}</h2>
                    <h2 class="art__description--artist">${data.artist_title}</h2>
                    <h3 class="art__description--date">${data.date_display}</h3>
                </div>
                <div class="art__description--details">
                    <h3 class="art__description--classification">${data.classification_title}</h3>
                    <h3 class="art__description--medium">${data.medium_display}</h3>
                    <h3 class="art__description--origin">${data.place_of_origin}</h3>
                </div>
            </div>
        </div>
    `;
    $('#results').append(dataHTML);
};

//Function to make the ajax call to API and generate random artwork.
app.getRandomArtworks = function() {
    //For performance reasons this API is limited to 100 pages
    const randomPageNum = app.generateRandomNum(100);
    $('.loading-animation').show();
    $.ajax({
        url: `https://api.artic.edu/api/v1/artworks?`,
        dataType: 'json',
        method: 'GET',
        data: {
            page: `${randomPageNum}`,
            limit: '50'
        }
    //Once promise is fufilled....    
    }).then(function(response) {
        $('.loading-animation').hide();
        //For dubugging purposes
        console.log($(this))
        console.log(response)
        console.log(response.data)
        //Store response data into a variable called data.
        const data = response.data;
        //Store random number generator into a variable and pass the length of data array as a parameter.
        const randomArtNum = app.generateRandomNum(data.length);
        //Call displayRandomArt function and pass data from response as parameters.
        app.displayRandomArt(
            data[randomArtNum].image_id, 
            data[randomArtNum].title,
            data[randomArtNum].artist_title,
            data[randomArtNum].date_display,
            data[randomArtNum].classification_title,
            data[randomArtNum].medium_display,
            data[randomArtNum].place_of_origin
        );
        //Boolean that displays a 'no pictures icon' if no images are available.  
        if(data[randomArtNum].image_id === null) {
            $('.art__image').attr('src', './Icons/no-pictures.png');
        };
       //Method to log error should API call fails. 
    }).fail(function(error){
        console.log(error)
    });
};

//Function to search for and retrun artwork. Very messy? Should refactor at some point. 
app.searchArtworks = function() {
    $.ajax({
        //This call will return an array of ids that will represent the respective artwork.
        url: 'https://api.artic.edu/api/v1/artworks/search?',
        dataType: 'json',
        method: 'GET', 
        data: {
            q: `${$('#search-input').val()}`,
            //Limit currently set at 20 for performance reasons, will add pagination in the future
            limit: '20'
        }
    }).then(function(response) {
        console.log(response.data)
        console.log($(this))
        const data = response.data;
        /*
            Foreach loop that will make an API call and pass in the id into another API call
            and fetch the JSON needed to display the artwork and its information. Each artwork 
            is then dynamically rendered onto the document with the HTML string bwlow.
        */
        data.forEach(function(data){
            $.ajax({
                url: `https://api.artic.edu/api/v1/artworks/${data.id}`,
                dataType: 'json'
            }).then(function(response){
                const data = response.data;
                app.displaySearchArt(data);
            });
        });
    });
};

//Function that will call the searchArtworks function on form submit.
app.submitForm = function() {
    const form = $('form')
    form.on('submit', function(event){
        event.preventDefault();
        console.log($('#search-input').val())
        $('#random-art').hide();
        app.searchArtworks();
    }); 
};

//Event listeners for buttons on page.
app.btnControls = function() {
    $('#next-btn').on('click', function(){
        app.getRandomArtworks();
    });
    $('#generate-btn').on('click', function(){
        app.getRandomArtworks();
        $('#results').empty()
        $('#random__art').show();
    });
    $('#search-btn').on('click', function() {
        $('#search-form').show();
    });
    $('.close-icon').on('click', function(){
        $('#search-form').hide();
    });
}

//Function to initalize app
app.init = function(){
    $('.modal').hide();
    $('#search-form').hide();
    $('#random__art').hide();
    $('.loading-animation').hide();
    app.submitForm();
    app.btnControls()
};

//Initalize the app.
$(document).ready(function(){

})
app.init();

$('#art__image--random').on('click', function() {
    console.log($(this).attr('src'))
    $('.art__container').hide();
    $('.modal').show();
    // const overlay = `
    //     <div class="modal">
    //         <img src="./Icons/close-white.png" alt="" class="close-icon" id="close__icon--modal">
    //         <img src="${$(this).attr('src')}" alt="An image of art" class="art__image" id="art__image--random">
    //     </div>
    // `
    // $('#random__art').append(overlay)
    $('#art__image--random').attr('src', $(this).attr('src'))
    $('#header').hide()
    $('footer').hide()
});

$('#close__icon--modal').on('click', function() {
    console.log('clicked')
    $('.art__container').show();
    $('#header').show()
    $('footer').show()
    $('.modal').hide();
})






