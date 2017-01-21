'use strict';

(function() {
    var poll_list = document.querySelector('#poll-list');
    var apiurl = appUrl + '/api/all/polls';
    
    function updateHtmlElement (data, element) {
      element.innerHTML = JSON.parse(data);
    }

    ajaxFunctions.ready(ajaxFunctions.ajaxRequest('GET', apiurl, function(data) {
        data = JSON.parse(data);
        data.forEach(function(el) {
            var li = document.createElement('li');
            li.innerHTML = '<a href=\'\/poll\/' + el._id + '\'>' + el.label + '</a>';
            li.childNodes[0].classList.add('col-md-6', 'col-md-offset-3');
            poll_list.appendChild(li);
        });
    }));
    
    
})();