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
            data[randomNum].artist_title,
            data[randomNum].title,
            data[randomNum].date_display,
            data[randomNum].classification_title,
            data[randomNum].medium_display
        )
        if(data[randomNum].image_id === null) {
            console.log('image is not available')
            $('#img').attr('src', './Icons/no-pictures.png');
        }
    })
}

app.getArtworks();

//random number generator
app.generateRandomNum = function(max) {
    return Math.floor(Math.random() * max)
}

//Displays art
app.displayArt = function(imgSrc, title, artist, date, classification, medium) {
    $('#img').attr('src', `https://www.artic.edu/iiif/2/${imgSrc}/full/843,/0/default.jpg`);
    $('#art-title').text(`${title}`);
    $('#artist-title').text(`${artist}`);
    $('#date').text(`${date}`);
    $('#classification').text(`${classification}`);
    $('#medium').text(`${medium}`);
}

//Navigation toggle
app.navControls = function() {
    $('#nav-sub').hide();
    $('#hamburger').on('click', function(){
        $('#nav-sub').toggle('display');
    });
};

app.init = function() {
    app.getArtworks();
    app.navControls();
}

app.init();

// app.searchArtworks = function() {
//     $.ajax({
//         url: 'https://api.artic.edu/api/v1/artworks/search?',
//         dataType: 'json',
//         data: {
//             q: `${$('#input').val()}`
//         }
//     }).then(function(object) {
//         console.log(object.data)
//         console.log($(this))
//         app.displayArtTest(object.data[1].thumbnail.lqip)
//     })
// }


// app.submitForm = function() {
//     const form = $('form')
//     form.on('submit', function(e){
//         e.preventDefault();
//         console.log($('#input').val())
//         app.searchArtworks()
//     }); 
// }

// app.submitForm();



/*Issues:  

*/

