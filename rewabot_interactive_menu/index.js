var menu = [
    {"id":0, "category": "primi", "name": "Farfalle melanzane e salsiccia", "price": 4.50, "img": "./img/primi/farfalle.jpg", "quantity": 1},
    {"id":1, "category": "primi", "name": "Paccheri zucca e salsiccia", "price": 5.60, "img": "./img/primi/paccheri.jpeg", "quantity": 1},
    {"id":2, "category": "primi", "name": "Pasta allo scarpariello", "price": 4.90, "img": "./img/primi/scarp.jpg", "quantity": 1},
    {"id":3, "category": "secondi", "name": "Bistecca ai ferri", "price": 14.50, "img": "./img/secondi/bistecca.jpeg", "quantity": 1},
    {"id":4, "category": "secondi", "name": "Mozzarella in carrozza", "price": 8.50, "img": "./img/secondi/mozz.jpg", "quantity": 1},
    {"id":5, "category": "secondi", "name": "Pesce", "price": 19.90, "img": "./img/secondi/pesce.jpeg", "quantity": 1},
    {"id":6, "category": "frut_dess", "name": "Caffé espresso", "price": 1.50, "img": "./img/frut_dess/caffe.jpeg", "quantity": 1},
    {"id":7, "category": "frut_dess", "name": "Buffet di frutta", "price": 6.50, "img": "./img/frut_dess/frutta.jpeg", "quantity": 1},
    {"id":8, "category": "frut_dess", "name": "Torta alla fragola", "price": 6.90, "img": "./img/frut_dess/torta.jpeg", "quantity": 1}
];

var order = [];
var num_table = -1;

$(document).ready(function () {
    create_menu();
    set_num_table();
});

function create_menu() {
    
    for (var i = 0; i < menu.length; i++) {

        var div_menu_id =  "#"+menu[i]["category"];
        var elem_img =  menu[i]["img"];
        var elem_name =  menu[i]["name"];
        var elem_price =  menu[i]["price"];
        var elem_id =  menu[i]["id"];
        var elem_quantity =  0;
        console.log(div_menu_id);
        var html =  "<div class=\"col-sm\">"+
                    "<div class=\"card\" style=\"width: 18rem;\">"+
                    "<img src="+elem_img+" class=\"card-img-top\">"+
                    "<div class=\"card-body\">"+
                    "<h5 class=\"card-title\" style=\"height: 4rem;\">"+elem_name+"</h5>"+
                    "<p class=\"card-text\">€ "+elem_price+"</p>"+
                    "<a onClick=\"addToOrder("+elem_id+")\" class=\"btn btn-primary\">+</a>"+
                    "<a onClick=\"remToOrder("+elem_id+")\" class=\"btn btn-secondary\">-</a>"+"&nbsp;&nbsp;"+
                    "<span id=\"s"+elem_id+"\" class=\"badge bg-secondary\"><h6 id=\"h"+elem_id+"\">"+elem_quantity+" ordini!</h6></span>"+
                    "</div></div></div>";

        $(div_menu_id).append(html);
    }
    $("#display_order").append("<h4 >Ordine Vuoto!</h4>");
}

function set_num_table() {
    var searchParams = new URLSearchParams(window.location.search);
    if (searchParams.has("table")) {
        num_table = searchParams.get("table");
        $("#table_welcome").text("Benvenuti al tavolo " + num_table);
    }
}

function addToOrder(id) {
    var insert_new = true;
    var elem = menu[id];
    console.log("DEBUG: 1");
    console.log(elem);
    if(order.length == 0) {
        insert_new_elem(elem);
        $("#confirm_button").removeClass("btn bg-secondary");
        $("#confirm_button").addClass("btn bg-success");
        $("#confirm_button").prop("disabled", false);
    } else {
        for (var i = 0; i < order.length; i++) {
            var elem = order[i];
            if (elem.id == id) {
                elem.quantity++;
                $("#h"+id).html(elem.quantity + " ordinati!");
                insert_new = false;
                break;
            }
        }
        if (insert_new) {
            var elem = menu[id];
            insert_new_elem(elem);
        }
    }
    display_order();
}

function insert_new_elem(elem) {
    order.push(elem);
    $("#s"+elem.id).removeClass("badge bg-secondary");
    $("#s"+elem.id).addClass("badge bg-success");
    $("#h"+elem.id).html(elem.quantity + " ordinato!");
}

function remToOrder(id) {    
    if(order.length > 0) {
        for (var i = 0; i < order.length; i++) {
            var elem = order[i];
            if (elem['id'] == id) {
                if(elem['quantity'] > 1) {
                    elem['quantity']--;
                    var h6_id = "#h" + id;
                    $(h6_id).html(elem.quantity + " ordinati!");
                    break;
                } else {
                    order.splice(i, 1);
                    var span_id = "#s" + id;
                    var h6_id = "#h" + id;
                    $(span_id).removeClass("badge bg-success");
                    $(span_id).addClass("badge bg-secondary");
                    $(h6_id).html("0 ordini!");
                }
                break;
            }
        }
    } else if(order.length == 0) {
        $("#confirm_button").removeClass("btn bg-success");
        $("#confirm_button").addClass("btn bg-secondary");
        $("#confirm_button").prop("disabled", true);
    }
    display_order();
}

function display_order() {
    if(order.length > 0) {
        var tot_price = 0;
        var full_text_order = "";
        $("#display_order").empty();
        for (var i = 0; i < order.length; i++) {
            var elem = order[i];
            var current_total = elem['price'] * elem['quantity'];
            var full_text ="- " + elem['name'] + " € " + elem['price'] + " * " + elem['quantity'] +
                           " = € " + current_total.toFixed(2);
            full_text_order += "<h4> <span class=\"badge bg-info\">"+full_text+"</span></h4>"
            tot_price += current_total;
        }
        full_text_order += "<h4> <span class=\"badge bg-primary\">TOTALE: € "+
                            tot_price.toFixed(2)+"</span></h4>";
        $("#display_order").append(full_text_order);
        console.log(order);
    } else {
        console.log("[INFO] empty order!");
        $("#display_order").text("Ordine vuoto!");
    }
}

function confirm_order() {
    if(order.length > 0) {
        if (num_table != -1) {
            var table_num = {"table_num": num_table};
            order.push(table_num);
            var order_json = "json_string=" + JSON.stringify(order);
            console.log(order_json);
            $("#conf_button").prop('disabled','true');
            $("#not_conf_button").prop('disabled','true');
            $.ajax
            ({
                type: "POST",
                url: "order.php",
                data: order_json,
                success: function(ret) {
                    attend_unlock_gui_from_robot();
                },
                error: function(ret) {
                    alert("[ERROR] in confirm_order ajax call!");
                }
            });
        } else {
            alert("[INFO] seleziona un tavolo!");
        }
    }
}

function attend_unlock_gui_from_robot() {

    setInterval(function() {
        
        var table_num = {"table_num": num_table};
                
        $.ajax ({
            type: "POST",
            url: "check_order_state.php",
            data: table_num,
            success: function(ret) {
                console.log(ret);
                if(ret == "to_confirm") {
                    $("#order_confirm").modal('hide');
                    $("#order_confirm_2").modal({
                        backdrop: 'static',
                        keyboard: false
                    });
                    $("#order_confirm_2").modal('show');
                } else if(ret == "confirmed") {
                    $("#h_confirm").text("Ordine confermato!");
                    $("#modal_text").text("Ordine in preparazione ... attendere, prego");
                } else if(ret == "closed") {
                    $("#order_confirm_2").modal('hide');
                    window.location.reload();
                }
            },
            error: function(ret) {
                alert("[ERROR] in ajax call attend_unlock_gui_from_robot");
            }
        });
    }, 2000);
}