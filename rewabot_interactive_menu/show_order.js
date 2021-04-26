$(document).ready(function () {
    update_order();
});

function update_order(){
    setInterval(function() { 
        var data = {};
        $.ajax
            ({
                type: "POST",
                url: "show_order.php",
                data: data,
                success: function(list_of_table_order) {
                    var order_data = JSON.parse(list_of_table_order);
                    if(order_data.length == 0) {
                        $("#order_update").empty();
                        var html = "<div class=\"alert alert-primary\" role=\"alert\">" +
                            "Non ci sono nuovi ordini!</div>";
                        $("#order_update").append(html);
                    } else {
                        create_order_cards(order_data);
                    }
                },
                error: function() {
                    console.log("[ERROR] err in show_order.php!");
                }
            });
    }, 5000);
}

function create_order_cards(order_data) {

    $("#order_update").empty();
    //console.log("lenght: " + order_data.length);
    var html = "";

    for (var i = 0; i < order_data.length; i++) {
        var order_json = order_data[i];
        var order = JSON.parse(order_json);
        var table_num = order[order.length-1].table_num;
        console.log("table: " + table_num);

        html +=  "<div class=\"col-sm\">"+
                    "<div class=\"card\" style=\"width: 18rem;\">"+
                    "<div class=\"card-body\">"+
                    "<h5 class=\"card-title\" style=\"height: 4rem;\">tavolo " + table_num +"</h5>";

        for (var j = 0; j < order.length-1; j++) {
            var piatto = order[j].name + " : " + order[j].quantity;
            html += "<p class=\"card-text\">"+piatto+"</p>";
        }
        html += "<a onClick=\"removeFromOrder("+ table_num +")\" class=\"btn btn-primary\">Ordine pronto!</a>"+
                    "</div></div></div>";
    }
    $("#order_update").append(html);
    
}

function removeFromOrder(table_num) {
    console.log("remove order on table:" + table_num);
    var data = {};
    data.table_num = table_num;
    $.ajax
        ({
            type: "POST",
            url: "remove_from_order.php",
            data: data,
            success: function(ret) {
                //alert(ret);
                $("#text_modal").text(ret);
                $("#order_close").modal('show');
            },
            error: function() {
                console.log("[ERROR] err in remove_from_order.php!");
            }
        });
}