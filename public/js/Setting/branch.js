var Base64 = { _keyStr: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=", encode: function (e) { var t = ""; var n, r, i, s, o, u, a; var f = 0; e = Base64._utf8_encode(e); while (f < e.length) { n = e.charCodeAt(f++); r = e.charCodeAt(f++); i = e.charCodeAt(f++); s = n >> 2; o = (n & 3) << 4 | r >> 4; u = (r & 15) << 2 | i >> 6; a = i & 63; if (isNaN(r)) { u = a = 64 } else if (isNaN(i)) { a = 64 } t = t + this._keyStr.charAt(s) + this._keyStr.charAt(o) + this._keyStr.charAt(u) + this._keyStr.charAt(a) } return t }, decode: function (e) { var t = ""; var n, r, i; var s, o, u, a; var f = 0; e = e.replace(/[^A-Za-z0-9\+\/\=]/g, ""); while (f < e.length) { s = this._keyStr.indexOf(e.charAt(f++)); o = this._keyStr.indexOf(e.charAt(f++)); u = this._keyStr.indexOf(e.charAt(f++)); a = this._keyStr.indexOf(e.charAt(f++)); n = s << 2 | o >> 4; r = (o & 15) << 4 | u >> 2; i = (u & 3) << 6 | a; t = t + String.fromCharCode(n); if (u != 64) { t = t + String.fromCharCode(r) } if (a != 64) { t = t + String.fromCharCode(i) } } t = Base64._utf8_decode(t); return t }, _utf8_encode: function (e) { e = e.replace(/\r\n/g, "\n"); var t = ""; for (var n = 0; n < e.length; n++) { var r = e.charCodeAt(n); if (r < 128) { t += String.fromCharCode(r) } else if (r > 127 && r < 2048) { t += String.fromCharCode(r >> 6 | 192); t += String.fromCharCode(r & 63 | 128) } else { t += String.fromCharCode(r >> 12 | 224); t += String.fromCharCode(r >> 6 & 63 | 128); t += String.fromCharCode(r & 63 | 128) } } return t }, _utf8_decode: function (e) { var t = ""; var n = 0; var r = c1 = c2 = 0; while (n < e.length) { r = e.charCodeAt(n); if (r < 128) { t += String.fromCharCode(r); n++ } else if (r > 191 && r < 224) { c2 = e.charCodeAt(n + 1); t += String.fromCharCode((r & 31) << 6 | c2 & 63); n += 2 } else { c2 = e.charCodeAt(n + 1); c3 = e.charCodeAt(n + 2); t += String.fromCharCode((r & 15) << 12 | (c2 & 63) << 6 | c3 & 63); n += 3 } } return t } }
customParams = "";
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

function TaoDataTable(idTable, columns) {//, columns, id, isFilter) {

    return new Promise(function (resolve, reject) {
        table = $('#' + idTable).DataTable(
            {
                "order": [[0, "desc"]],
                'language': {
                    "sProcessing": "<div class='lds-roller'><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>",
                    "sLengthMenu": "Xem _MENU_ mục",
                    "sZeroRecords": "Không tìm thấy dòng nào phù hợp",
                    "sInfo": "Đang xem _START_ đến _END_ trong tổng số _TOTAL_ mục",
                    "sInfoEmpty": "Đang xem 0 đến 0 trong tổng số 0 mục",
                    "sInfoFiltered": "(được lọc từ _MAX_ mục)",
                    "sInfoPostFix": "",
                    "sSearch": "Tìm:",
                    "sUrl": "",
                    "oPaginate": {
                        "sFirst": "Đầu",
                        "sPrevious": "Trước",
                        "sNext": "Tiếp",
                        "sLast": "Cuối"
                    }
                },

                "columnDefs": [
                    {
                        "targets": -1,
                        "className": "hover",
                    },

                ],
                "processing": true,
                "serverSide": true,
                "lengthMenu": [[5, 10, 25, 99999], [5, 10, 25, "All"]],
                "ajax":
                {
                    "url": "/api/datatable/Branch",
                    "contentType": "application/json",
                    "type": "GET",
                    "dataType": "JSON",
                    "data": function (d) {
                        d.myCustomParams = customParams;
                        d.idCongViec = "";// idCongViec;
                        return d;
                    },
                    "dataSrc": function (json) {
                        json.draw = json.d.draw;
                        json.recordsTotal = json.d.recordsTotal;
                        json.recordsFiltered = json.d.recordsFiltered;
                        json.data = json.d.data;
                        if (json.data == null) {

                        }
                        var return_data = json;
                        return return_data.data;
                    }, "error": function (data) {
                        console.log(data);
                    }
                },
                "columns": columns,
                "initComplete": function () {
                    resolve('true');
                },
                "drawCallback": function (settings) {

                },
                "deferRender": true
            });
    });
}

$('#btnAdd').click(() => {
    let ten = $('#idTenSuKien').val().trim();
    if (ten == "") {
        alert('Bạn chưa nhập tên.');
    } else {
        $.ajax({
            type: 'POST',
            url: '/api/addBranch',
            data: { ten },

        }).done((data) => {
            if (data.message != 'success') {
                alert(`${data.message}`);
            } else {
                table.ajax.reload();
                $('#idTenSuKien').val('');
            }
        }).fail(err => {
            console.log(err)
        })
    }

});

$('#btnSave').click(() => {

    let ten = $('#idTenSuKien').val().trim();
    let id = $('#idEventCategory').val().trim();
    if (ten == "") {
        alert('Bạn chưa nhập tên.');
    } else {
        $.ajax({
            type: 'POST',
            url: '/api/updateBranch',
            data: { ten, id },

        }).done((data) => {
            document.getElementById('btnAdd').classList.remove('hidden');
            document.getElementById('btnSave').classList.add('hidden');
            document.getElementById('btnCancel').classList.add('hidden');
            table.ajax.reload();
            $('#idTenSuKien').val('');
            $('#idEventCategory').val('');

        }).fail(err => {
            alert(err.responseJSON.message);
        })
    }

});

$('#btnCancel').click(() => {
    document.getElementById('btnAdd').classList.remove('hidden');
    document.getElementById('btnSave').classList.add('hidden');
    document.getElementById('btnCancel').classList.add('hidden');
    $('#idTenSuKien').val('')
    $('#idEventCategory').val('')

});

function Delete(id) {
    if (confirm('Xác nhận xóa!')) {
        $.ajax({
            type: 'POST',
            url: '/api/deleteBranch',
            data: { id },
        }).done((data) => {
            if (data.message != 'success') {
                alert(`${data.message}`);
            } else {
                table.ajax.reload();
            }
        }).fail(err => {
            alert(err.responseJSON.message);
        })
    }
}

function Update(id, name) {
    $('#idTenSuKien').val(`${Base64.decode(name)}`);
    $('#idEventCategory').val(`${id}`)
    document.getElementById('btnAdd').classList.add('hidden');
    document.getElementById('btnSave').classList.remove('hidden');
    document.getElementById('btnCancel').classList.remove('hidden');
}

function search1() {
    table.ajax.reload();
}   