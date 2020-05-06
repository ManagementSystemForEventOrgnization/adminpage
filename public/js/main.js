function GetColumnsForDatatable(count) {
    var shit = new Array();
    for (var i = 0; i < count; i++) {
        shit.push({ "data": "s" + (i + 1) })
    }
    return shit;
}
function ThongBao(text, type, callback) {
    var isShowCancel = true;
    if (type == "success" || type == "error") {
        isShowCancel = false;
    }
    Swal({
        title: text,
        type: type,
        showCancelButton: isShowCancel,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Confirm',
    }).then(function (result) {
        if (typeof callback !== 'undefined')
            if (result.value) {
                callback(true);
            } else
                callback(false);
    });
}

function appendElementChatBox(){
    
}