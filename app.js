const app = {};

app.getArtworks = function() {
    $.ajax({
        url: 'https://api.artic.edu/api/v1/artworks?&limit=100',
        dataType: 'json',
    }).then(function(object) {
        console.log(object.data)
        const randomNum = Math.floor(Math.random() * object.data.length)
        app.displayArt(
            object.data[randomNum].image_id, 
            object.data[randomNum].artist_title,
            object.data[randomNum].title,
            object.data[randomNum].date_display,
            object.data[randomNum].classification_title,
            object.data[randomNum].medium_display
        )
    })
}

app.searchArtworks = function() {
    $.ajax({
        url: 'https://api.artic.edu/api/v1/artworks/search?',
        dataType: 'json',
        data: {
            q: `${$('#input').val()}`
        }
    }).then(function(object) {
        console.log(object.data)
    })
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

app.displayArt = function(data, artist, title, date, type, medium) {
    $('#img').attr('src', `https://www.artic.edu/iiif/2/${data}/full/843,/0/default.jpg`);
    $('#artist-title').text(`${artist}`);
    $('#art-title').text(`${title}`);
    $('#date').text(`${date}`);
    $('#classification').text(`${type}`);
    $('#medium').text(`${medium}`)
}

app.submitForm = function() {
    const form = $('form')
    form.on('submit', function(e){
        e.preventDefault();
        console.log($('#input').val())
        app.searchArtworks()
    }); 
}

app.submitForm();



/*Issues:  

*/

