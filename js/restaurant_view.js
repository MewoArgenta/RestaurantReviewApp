let view = {

    restaurantPage : document.getElementById('restaurant-page'),

    changeFlexToRow: function (container) {
        container.style.flexDirection = 'row';
        // container.style.display = 'flex'
    },

    changeWidthTo100: function(container){
        container.style.width = '100%'
    },

    whenRestaurantPageOpens: window.addEventListener('pageshow', function () {
        view.changeFlexToRow(document.getElementById('maincontent'));
        view.changeWidthTo100(document.getElementById('map-container'))
    })

}

