//Declares variable called app as an empty object. 
const app = {};

//random number generator
app.generateRandomNum = function(max) {
    return Math.floor(Math.random() * max)
}

//Funciton that will display art with parameters that will be passed in during the ajax call.
app.displayArt = function(imgSrc, title, artist, date, classification, medium, origin) {
    $('.art-img').attr('src', `https://www.artic.edu/iiif/2/${imgSrc}/full/843,/0/default.jpg`);
    $('.art-title').text(`${title}`);
    $('.artist-title').text(`${artist}`);
    $('.date').text(`${date}`);
    $('.classification').text(`${classification}`);
    $('.medium').text(`${medium}`);
    $('.origin').text(`${origin}`);
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
            data[randomNum].place_of_origin
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
                const dataHTML = `
                    <div id="results-container">
                        <img src=https://www.artic.edu/iiif/2/${data.image_id}/full/843,/0/default.jpg class="art-image"> 
                        <div class="art-description">
                            <div class="details-container">
                                <h2 class="art-title">${data.title}</h2>
                                <h2 class="artist-title">${data.artist_title}</h2>
                                <h2 class="date">${data.date_display}</h2>
                            </div>
                            <div class="details-container">
                                <h2 class="classification">${data.classification_title}</h2>
                                <h2 class="medium">${data.medium_display}</h2>
                                <h2 class="origin">${data.place_of_origin}</h2>
                            </div>
                        </div>
                    </div>
                `
                $('#results').append(dataHTML)
                console.log(data)
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
        app.searchArtworks()
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
    app.submitForm();
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
    $('#random-art').show();
});


$('#search-form').hide();

$('#random-art').hide();


/*Issues:  

*/

