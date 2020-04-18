customParams = "";
function GetColumnsForDatatable(count) {
    var shit = new Array();
    for (var i = 0; i < count; i++) {
        shit.push({ "data": "s" + (i + 1) })
    }
    // shit.push({ "data": "name" });
    // shit.push({ "data": "address:" });
    // shit.push({ "data": "limitNumber" });
    // shit.push({ "data": "joinNumber" });
    // shit.push({ "data": "startTime" });
    // shit.push({ "data": "status" });
    // shit.push({ "data": "urlWeb" });
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
                      "url": "/api/datatable/event",
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


function search1() {
    customParams = $('#idSearch').val();
    table.ajax.reload();
}


function Change(id) {
    // cho cái select bõ hiện lên.
    document.getElementById(`selectOption_${id}`).classList.toggle('hidden');
    document.getElementById(`label_TT_${id}`).classList.toggle('hidden');
    document.getElementById(`buttonSave_${id}`).classList.toggle('hidden');
    document.getElementById(`buttonChange_${id}`).classList.toggle('hidden');

    
}


function Save(id) {
    if (confirm("Xác nhận lưu!")) {
        document.getElementById(`selectOption_${id}`).classList.toggle('hidden');
        document.getElementById(`label_TT_${id}`).classList.toggle('hidden');
        document.getElementById(`buttonSave_${id}`).classList.toggle('hidden');
        document.getElementById(`buttonChange_${id}`).classList.toggle('hidden');
        let valueSelect1 = $(`#selectOption_${id} option:selected`).text();
        document.getElementById(`label_TT_${id}`).innerText = valueSelect1;
        let valueSelect = $(`#selectOption_${id}`).val();
        // luu lai trang thai cua no nua.
        $.get(`../Ajax.aspx?Action=SaveTT&id=${id}&value=${valueSelect}`, (data, status) => {
            if (data != 'fasle') {

            } else {
                alert('Server đang bận bạn vui lòng quay lại sau.');
            }
        });
    }
}

function Print(id) {
    //alert('Chưa xác định được mẫu in.');
       
    $.get('../Ajax.aspx?Action=LoadIn&id=' + id, (data, status) => {
        
        var print = window.open('', '_blank');

        var shtml = "<html>";
        shtml += "<body onload=\"window.print(); window.close();\">";
        shtml += data;

        shtml += "</body>";
        shtml += "</html>";

        print.document.write(shtml);
        print.document.close();
    });
    // xu ly in ne;
}