// document.addEventListener("DOMContentLoaded", () => {
    var inputWithDebounce;
    const SettingSearch =()=>{
        let input =  document.createElement("input"); 
         input.classList.add("dataTables_filter");
         input.classList.add("MyClassDataTable"); 
        var inp =  document.querySelector('#idDataTable_filter label'); 
        inp.appendChild(input);
        inputWithDebounce = $('#idDataTable_filter .MyClassDataTable');
        inputWithDebounce.on(`keyup`, debounce(displayWithDebounce, 500,'#idDataTable_filter .MyClassDataTable', null));

    }

    function debounce(func, wait,src,taget) {
        var timeout;
        return function () {
            var context = this,
                args = arguments;
            var executeFunction = function () {
                func.apply(context, [src, taget]);
            };
            clearTimeout(timeout);
            timeout = setTimeout(executeFunction, wait);
        };
    };

    function displayWithDebounce() {
        var data = inputWithDebounce.val();
        //delay = getRandomNumber();
        setTimeout(function () {
            appendIntoResultWithDebounce(data);
        }, 1000);
    }
    // ham nay sẽ thực thi khi mà hết gõ
    function appendIntoResultWithDebounce(data) {
        //$('#idDataTable_filter [aria-controls="idDataTable"]').val(data);
        customParams = data;
        table.ajax.reload();
    }
    // Return a random number between 1 and 5
    function getRandomNumber() {
        return Math.floor((Math.random() * 5) + 1);
    }
// });
