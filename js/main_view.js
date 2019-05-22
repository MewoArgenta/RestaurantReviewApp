let view = {

    mainPage : document.getElementById('main-page'),

    changeFlexToColumn: function (container) {
        container.style.flexDirection = 'column';
        // container.style.display = 'flex'
    },

    whenmainPageOpens: window.addEventListener('pageshow', function () {
        view.changeFlexToColumn(document.getElementById('maincontent'))
    })

}
