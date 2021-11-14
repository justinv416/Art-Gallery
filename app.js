const app = {};

app.getArtworks = function() {
    $.ajax({
        url: 'https://api.artic.edu/api/v1/artworks?&limit=100',
        dataType: 'json',
    }).then(function(response) {
        console.log(response)
        console.log(response.data)
        const data = response.data;
        const randomNum = app.generateRandomNum(data.length)
        app.displayArt(
            data[randomNum].image_id, 
            data[randomNum].title,
            data[randomNum].artist_title,
            data[randomNum].date_display,
            data[randomNum].classification_title,
            data[randomNum].medium_display,
            data[randomNum].place_of_origin
        )
        if(data[randomNum].image_id === null) {
            console.log('image is not available')
            $('#img').attr('src', './Icons/no-pictures.png');
        }
    })
}


//random number generator
app.generateRandomNum = function(max) {
    return Math.floor(Math.random() * max)
}

//Displays art
app.displayArt = function(imgSrc, title, artist, date, classification, medium, origin) {
    $('.art-img').attr('src', `https://www.artic.edu/iiif/2/${imgSrc}/full/843,/0/default.jpg`);
    $('.art-title').text(`${title}`);
    $('.artist-title').text(`${artist}`);
    $('.date').text(`${date}`);
    $('.classification').text(`${classification}`);
    $('.medium').text(`${medium}`);
    $('.origin').text(`${origin}`);
}

//Navigation toggle
app.navControls = function() {
    $('#nav-sub').hide();
    $('#hamburger').on('click', function(){
        $('#nav-sub').toggle('display');
    });
};

app.init = function(){
    app.getArtworks();
}

app.navControls();

app.startApp = function(){
    $('#main').hide();
    app.getArtworks()
}

$('#start').on('click', app.startApp);

$('#arrow').on('click', app.getArtworks)

// app.init();

app.searchArtworks = function() {
    $.ajax({
        url: 'https://api.artic.edu/api/v1/artworks/search?',
        dataType: 'json',
        data: {
            q: `${$('#search-input').val()}`,
            limit: '10'
        }
    }).then(function(response) {
        console.log(response.data)
        console.log($(this))
        const data = response.data;
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
            })
        })
    })
}


app.submitForm = function() {
    const form = $('form')
    form.on('submit', function(e){
        e.preventDefault();
        console.log($('#search-input').val())
        app.searchArtworks()
    }); 
}

app.submitForm();

$('#title-main').on('click', function(){
    $('#results').empty()
    $('#random-art').hide()
})

//need to write a function that will show form on click
app.showSearch = function() {
    $('#search-form').show();
};

// $('#search-btn').on('click', app.showSearch)

//generate btn should trigger ajax call
$('#generate-btn').on('click', function(){
    app.getArtworks();
    $('#random-art').show();
});


$('#search-form').hide();

$('#random-art').hide();


/*Issues:  

*/

