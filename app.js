const app = {};

app.getId = function() {
    $.ajax({
        url: 'https://api.artic.edu/api/v1/artworks?&limit=100',
        dataType: 'json',
    }).then(function(data) {
        console.log(data.data)
        
        $('#img').attr('src', `https://www.artic.edu/iiif/2/${data.data[app.generateRandomNum(data.data.length)].image_id}/full/843,/0/default.jpg`)
    })
}

app.getId();

app.generateRandomNum = function(max) {
    return Math.floor(Math.random() * max)
}
    
app.submitForm = function() {
    const form = $('form')
    form.on('submit', function(e){
        e.preventDefault();
        app.getSearchData($('#input').val());
    }); 
}

app.submitForm()

//on sumbit the api call will return an array with object ids, will need to apps these ids into another call 