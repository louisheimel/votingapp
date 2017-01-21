'use strict';

(function() {

    ajaxFunctions.ready(function() {
        var addOption = document.querySelector('button.addoption');
        var optionText = document.querySelector('#newoption');
        var submitOption = document.querySelector('#submitinput');

        addOption.addEventListener('click', function(e) {
            document.querySelectorAll('.userinput').forEach((e) => { e.style.display = 'block'; });
        });
        
        submitOption.addEventListener('click', function(e) {
            alert(optionText.value);
            ajaxFunctions.ajaxRequest('POST', './poll/newoption?' + '');
        })
    })
})();