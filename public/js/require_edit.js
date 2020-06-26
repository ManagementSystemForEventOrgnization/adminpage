customParams = "";
multiSearch = "";
function GetColumnsForDatatable(count) {
    var shit = new Array();
    for (var i = 0; i < count; i++) {
        shit.push({ "data": "s" + (i + 1) })
    }
    return shit;
}


function TaoDataTable(idTable, columns) {//, columns, id, isFilter) {

    return new Promise(function (resolve, reject) {
        table = $('#' + idTable).DataTable(
            {rowId: 's1',
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
                    "url": "/api/datatable/require_edit_event",
                    "contentType": "application/json",
                    "type": "GET",
                    "dataType": "JSON",
                    "data": function (d) {
                        d.myCustomParams = customParams;
                        d.multiSearch = multiSearch;// idCongViec;
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
                rowId: '_id',
                "drawCallback": function (settings) {

                },
                "deferRender": true
            });
    });
}


function search1() {
    let status = $('#idTT').val();
    let startDate = $('#startDate').val();
    let endDate = $('#endDate').val();
    let fee = $('#traPhi:checkbox:checked').length;
    multiSearch = { status, startDate, endDate, fee };
    table.ajax.reload();
}

function Change(id, status) {

    if (confirm(`Xác nhận ${+status?'Cấp quyền': 'từ chối'}!`)) {
        document.querySelector('.lds-default').classList.toggle('hidden');
        $.ajax({
            type: 'POST',
            url: '/api/require_edit_event',
            data: { id, isEdit : +status },
        }).done((data) => {
            $('#'+id).remove();
            //    table.ajax.reload();
            
            document.querySelector('.lds-default').classList.toggle('hidden');
        }).fail(err => {
            document.querySelector('.lds-default').classList.toggle('hidden');
            alert(err.responseJSON.message);
            console.log(err.responseJSON.message);
        })
    }
}


$(document).ready(function () {
    document.querySelector('.lds-default').classList.toggle('hidden');
    $('#startDate').datetimepicker({
        lang: 'vi',
        timepicker: false,
        format: 'Y/m/d',
        formatDate: 'Y/m/d',
    });
    $('#endDate').datetimepicker({
        lang: 'vi',
        timepicker: false,
        format: 'Y/m/d',
        formatDate: 'Y/m/d',
    });
    document.querySelector('.lds-default').classList.toggle('hidden');
});
