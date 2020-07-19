$(document).ready(function(){
    $('.button-left').click(function(){
        $('.sidebar').toggleClass('fliph');
    });

    $('#btnLogout').click(()=>{
        $.get(`/logout`,(d,s)=>{
            window.location.href = '/login';
        });

    })
    
 });


 function appendAlert(content, time){
    new Notification(content);
    time = time || 2000;
    let alert = $('div .alert').length;

    $('#Notification').append(`<div id='${(alert+1)}' class="alert alert-danger relative" role="alert">
    ${content}
    <button aria-hidden="true" data-dismiss="alert" class="close" type="button">×</button>
    </div>`);

    setTimeout(() => {
        $(`#${alert+1}`).alert('close');
    }, time);
 }