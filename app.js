//Declares variable called app as an empty object. 
const app = {};

//random number generator
app.generateRandomNum = function(max) {
    return Math.floor(Math.random() * max)
};

//Not a big fan of having a boolean as a parameter should refactor at some point
app.displayArt = function(imgSrc, title, artist, date, classification, medium, origin, isRandom) {
    const artHTML = `
        <div id="results-container">
            <img src=https://www.artic.edu/iiif/2/${imgSrc}/full/843,/0/default.jpg class="art-image"> 
            <div class="art-description">
                <div class="details-container">
                    <h2 class="art-title">${title}</h2>
                    <h2 class="artist-title">${artist}</h2>
                    <h2 class="date">${date}</h2>
                </div>
                <div class="details-container">
                    <h2 class="classification">${classification}</h2>
                    <h2 class="medium">${medium}</h2>
                    <h2 class="origin">${origin}</h2>
                </div>
            </div>
        </div>
    `; 
    //Essentially a switch for rendering art.
    if(isRandom === true) {
        $('.random-output').html(artHTML)
    } else {
        $('#results').append(artHTML)
    }
};

//Function to make the ajax call to API and generate random artwork.
app.getRandomArtworks = function() {
    $.ajax({
        url: 'https://api.artic.edu/api/v1/artworks?&limit=100',
        dataType: 'json',
        method: 'GET'
    //Once promise is fufilled....    
    }).then(function(response) {
        console.log(response)
        console.log(response.data)
        //Store response data into a variable called data.
        const data = response.data;
        //Store random number generator into a variable and pass the length of data array as a parameter.
        const randomNum = app.generateRandomNum(data.length)
        //Call displayArt function and pass data from response as parameters.
        app.displayArt(
            data[randomNum].image_id, 
            data[randomNum].title,
            data[randomNum].artist_title,
            data[randomNum].date_display,
            data[randomNum].classification_title,
            data[randomNum].medium_display,
            data[randomNum].place_of_origin,
            true
        );
        //Boolean that displays a 'no pictures icon' if no images are available.  
        if(data[randomNum].image_id === null) {
            $('#img').attr('src', './Icons/no-pictures.png');
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
            limit: '10'
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
                app.displayArt(
                    data.image_id, 
                    data.title,
                    data.artist_title,
                    data.date_display,
                    data.classification_title,
                    data.medium_display,
                    data.place_of_origin,
                    false
                );
            });
        });
    });
};

//Function that will call the searchArtworks function on form submit.
app.submitForm = function() {
    const form = $('form')
    form.on('submit', function(e){
        e.preventDefault();
        console.log($('#search-input').val())
        $('#random-art').hide();
        app.searchArtworks();
    }); 
};

//Function that will return to main page. 
app.returnToTitle = function() {
    $('#title-main').on('click', function(){
        $('#results').empty()
        $('#random-art').hide()
    });
};

//Function to initalize app
app.init = function(){
    $('#search-form').hide();
    $('#random-art').hide();
    app.submitForm();
    app.returnToTitle();
};

//Initalize the app.
app.init();

//need to write a function that will show form on click
app.showSearch = function() {
    $('#search-form').show();
};

$('#search-btn').on('click', app.showSearch)

//generate btn should trigger ajax call
$('#generate-btn').on('click', function(){
    app.getRandomArtworks();
    $('#results').empty()
    $('#random-art').show();
});

$('#next-btn').on('click', function(){
    app.getRandomArtworks();
});

//logs scroll postion on window scroll.
$(window).on('scroll', function(){
    console.log($(this).scrollTop())
    app.addBorder();
})

//Working somewhat
app.addBorder = function(){
    if(window.scrollTop === 0){
        $('.nav__main').removeClass('nav-border')
    } else {
        $('.nav__main').addClass('nav-border')
    }
}


