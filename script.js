$(document).ready(function () {


    function renderList() {
        var ls = localStorage;

        for (var i = 0; i < ls.length; i++) { key = ls.key(i);

            if(i == 0){
                var el = $('<tr><td>Название</td><td>Бик</td><td>Корсчет</td><td>Адрес</td></tr>');
                $('.cat-list').append(el);
            }

            var obj = ls.getItem(key);

            if(IsJsonString(obj)){

                var item = JSON.parse(obj);
                var el = $('<tr>' +
                                '<td><a href="/edit.html?edit_name='+key+'">'+item.name+'</a></td>'+
                                '<td>'+key+'</td>'+
                                '<td>'+item.kor+'</td>'+
                                '<td>'+item.address+'</td>'+
                        '</tr>');

                $('.cat-list').append(el);
            }
        }
    }

    //проверка на json
    function IsJsonString(str) {
        try {
            JSON.parse(str);
        } catch (e) {
            return false;
        }
        return true;
    }


    //если страница списка
    if(document.location.pathname == '/'){
        renderList();
    }

    //записать/удалить объект
    function actObj(bik, name, kor, address) {

        if(name){
            var obj = {
                name: name,
                kor: kor,
                address: address
            };
            var serialObj = JSON.stringify(obj);
            localStorage.setItem(bik, serialObj);
        }
        else {
            localStorage.removeItem(bik);
        }

    }


    //сохраним/изменим данные банка
    $("form.edit").on("submit", function(e) {
        e.preventDefault();

        var fields = $(this).serializeArray();
        var indexed = {};

        $.map(fields, function(n, i){
            indexed[n['name']] = n['value'];
        });

        if(indexed.name){
            actObj(indexed.bik, indexed.name, indexed.kor, indexed.address);
            alert("Сохранено");
            document.location.href = "/";
        }
    });


    (function () {
        if($('form').hasClass("edit")){

            var url_string = window.location.href;
            var url = new URL(url_string);
            var editname = url.searchParams.get("edit_name");

            if(editname){

                //вставляем значения всех полей объекта
                var dataObj = JSON.parse(localStorage.getItem(editname));

                for (var prop in dataObj) {
                    $('input[name='+prop+']').val(dataObj[prop]);
                }

                //заблочим значение имени банка чтобы пользователь менял именно его
                $('input[name=bik]').val(editname)
                    .attr('readonly', 'readonly');
            }
            else { //чтобы не использовать стили
                $('.remove').hide();
            }
        }


        if($('form').hasClass("catal-find")){

            var url_string = window.location.href;
            var url = new URL(url_string);
            var filter = url.searchParams.get("filter");

            if(filter){
                $('input[name=filter]').val(filter);

                $('.cat-list tr').each(function (tr) {
                    if(tr>0){

                        var remove = true;

                        $(this).find('td').each(function (td) {

                            if(td==0 || td==1){

                                if($(this).text().indexOf(filter) + 1){
                                    remove = false;
                                }
                            }
                        });

                        if(remove){
                            $(this).remove();
                        }
                    }
                });
            }
        }

    }());


    $(document).on('click', '.remove', function () {

        var url_string = window.location.href;
        var url = new URL(url_string);
        var editname = url.searchParams.get("edit_name");
        actObj(editname);

        alert("Удалено");
        document.location.href = "/";
    });

});