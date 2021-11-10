const app = {};

app.getId = function() {
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
            object.data[randomNum].classification_title
        )
    })
}

app.getId();

app.displayArt = function(data, artist, title, date, type) {
    $('#img').attr('src', `https://www.artic.edu/iiif/2/${data}/full/843,/0/default.jpg`);
    $('#artist-title').text(`${artist}`);
    $('#art-title').text(`${title}`);
    $('#date').text(`${date}`);
    $('#classification').text(`${type}`);
}

app.submitForm = function() {
    const form = $('form')
    form.on('submit', function(e){
        e.preventDefault();
        app.getSearchData($('#input').val());
    }); 
}

app.submitForm()

/*Issues:  

generate random number not matching artist and title


*/

