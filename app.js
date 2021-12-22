//Declares variable called app as an empty object. 
const app = {};

//Function that generates and returns a random number.
app.generateRandomNum = function(max) {
    return Math.floor(Math.random() * max);
};

//Function that displays a 'no pictures' icon if no images are available.  
app.checkImage = function(image) {
    if(image === null) {
        $('.art__image').attr('src', './Icons/no-pictures.png');
    };
};

/*Function that will display art with parameters that will be passed in during the ajax call.
Note: might consolidate this with displaySearchArt function in the future, 
next artwork button currently preventing me from doing so.*/ 
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
    <div class="wrapper">
        <div class="results__container">
            <div class="image__container--search">
                <img src=https://www.artic.edu/iiif/2/${data.image_id}/full/843,/0/default.jpg class="art__image--search"> 
                <figcaption>Click image to enlarge</figcaption>
            </div>
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
    </div>    
    `;
    $('.results__output').append(dataHTML);
};

//Function to make the ajax call to API and generate random artwork.
app.getRandomArtworks = function() {
    //For performance reasons this API is limited to 100 pages
    const randomPageNum = app.generateRandomNum(100);
    //Show loading animation while data is being fetched. 
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
        //Hide loading animation.
        $('.loading-animation').hide();
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
        app.checkImage(data[randomArtNum].image_id);
       //Method to log error should API call fails. Not sure if this is the correct way to do this.  
    }).fail(function(error){
        console.log(error);
    });
};

//Function to search for and retrun artwork. Very messy? Should refactor at some point. 
app.searchArtworks = function(number) {
    //Show loading screen while call is being made.
    $('.loading__animation--search').show();
    //This call will return an array of ids that will represent the respective artwork.
    $.ajax({
        url: 'https://api.artic.edu/api/v1/artworks/search?',
        dataType: 'json',
        method: 'GET', 
        data: {
            q: `${$('#search__form--input').val()}`,
            //Limit currently set at 20 for performance reasons, will add pagination in the future
            limit: '20',
            page: number
        },
    }).then(function(response) {
        const arrayOfIds = response.data;
        /*
            Foreach loop that will make an API call and pass in the art ids into another API call
            and fetch the JSON needed to display the artwork and its information. Each artwork 
            is then dynamically rendered onto the document with the displaySearchArt function.
        */
        arrayOfIds.forEach(function(item){
            $.ajax({
                url: `https://api.artic.edu/api/v1/artworks/${item.id}`,
                dataType: 'json'
            }).then(function(response){
                //Hide loading animation
                $('.loading__animation--search').hide();
                //Displays link where users can click to jump to results
                $('.search__results--link').show();
                const artData = response.data;
                app.displaySearchArt(artData);
                app.checkImage(artData.image_id);
            });
        });
        $('.results__next--button').show();
    }).fail(function(error){
        console.log(error);
    });
};

//Function that will call the searchArtworks function on form submit.
app.submitForm = function() {
    const form = $('form')
    form.on('submit', function(event){
        event.preventDefault();
        $('#main').show();
        $('.loading__container').show();
        $('.loading__container').css('display', 'flex')
        $('.results__output').empty();
        $('#random__art').hide();
        $('.search__results--link').hide();
        $('.results__buttons').show();
        app.searchArtworks(page);
    }); 
};

//Initalize the first page to 1
let page = 1;
//Function to increment page number
app.getNextPage = function() {
    page++;
    if (page > 1) {
        $('.results__prev--button').show();
    } else {
        $('.results__prev--button').hide();
    }
};

app.getPreviousPage = function() {
    page--;
    if(page <= 1) {
        $('.results__prev--button').hide();
    } else {
        $('.results__prev--button').show();
    }
}

app.paginationControls = function(){
    $('.results__next--button').on('click', function(){
        $('.results__output').empty();
        $('#random__art').hide();
        $('.search__results--link').hide()
        app.getNextPage();
        app.searchArtworks(page);
    });

    $('.results__prev--button').on('click', function(){
        $('.results__output').empty();
        $('#random__art').hide();
        $('.search__results--link').hide()
        app.getPreviousPage();
        app.searchArtworks(page);
    });
};

//Event listeners for buttons/icons on page.
app.btnControls = function() {
    $('.next__artwork--button').on('click', function(){
        app.getRandomArtworks();
    });

    $('.main__buttons--generate').on('click', function(){
        app.getRandomArtworks();
        $('.results__output').empty();
        $('.results__buttons').hide();
        $('.search__results--link').hide();
        $('#random__art').show();
        $('#main').hide();
    });

    $('.close__icon').on('click', function(){
        $('#search__form').hide();
        $('.search__results--link').hide();
    });
};

//Function to hide header/footer elements.
app.hideNavigation = function(){
    $('#header').hide();
    $('footer').hide();
}

//Function to show header/footer elements.
app.showNavigation = function(){
    $('#header').show();
    $('footer').show();
};

//Function to control image modal
app.modalControls = function() {
    $('.art__image--random').on('click', function() {
        app.hideNavigation();
        $('#modal__random').show();
        $('#modal__random').css('display', 'flex');
        $('#art__modal--random').attr('src', $(this).attr('src'));
        $('body').css('overflow', 'hidden');
    });
    
    $('#close__icon--modal').on('click', function() {
        $('#modal__random').hide();
        app.showNavigation();
        $('body').css('overflow', 'auto');
    });

    //Event Delegation for dynamically generated html
    $(document).on('click', '.art__image--search', function() {
        $('#art__modal--search').attr('src', $(this).attr('src'));
        $('#modal__search').css('display', 'flex');
        $('#modal__search').show();
        $('body').css('overflow', 'hidden');
    });
    
    $(document).on('click', '#close__icon--modal-search', function() {
        $('#modal__search').hide();
        $('body').css('overflow', 'auto');
    });
};

//GSAP Animations (Just for fun, might delete later.)
app.titleAnimation = function(){
    const timelineOne = gsap.timeline();
    timelineOne.to($('.main__image'), {
        duration: 1,
        // scale: 0.9
    })
    .from($('h1'), {
        y: 20,
        opacity: 0,
        duration: 0.5
    }, "<0.2")
    .from($('.main__copy p'), {
        y: 20,
        opacity: 0,
        duration: 0.5
    }, "<0.3")
    .from($('.main__button'), {
        y: 20,
        opacity: 0,
        duration: 0.5
    }, "<0.4")
    .from($('.nav__main'), {
        opacity: 0,
        y: 10,
        duration: 0.5
    }, "<0.6")
    .from($('footer'), {
        opacity: 0,
        y: 20,
        duration: 0.5
    }, "<")
}

//Function to hide certain elements on init. 
app.hideOnInit = function() {
    $('.modal').hide();
    $('#random__art').hide();
    $('.loading__animation--search').hide();
    $('.search__results--link').hide();
    $('.results__buttons').hide();
    $('.results__next--button').hide();
    $('.results__prev--button').hide();
};

//Function to initalize app
app.init = function(){
    app.titleAnimation();
    app.hideOnInit();
    app.submitForm();
    app.btnControls();
    app.modalControls();
    app.paginationControls();
};

//Initialize the app once the Document object is ready.
$(document).ready(function(){
    app.init();
});
