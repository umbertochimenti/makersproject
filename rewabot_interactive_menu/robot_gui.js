var ws_client;

$(document).ready(function () {
    update_order();
    ws_server_start_connection("ws://127.0.0.1:9000");
});

function update_order(){
    setInterval(function() { 
        var data = {};
        $.ajax
            ({
                type: "POST",
                url: "show_order_to_confirm.php",
                data: data,
                success: function(list_of_table_order) {
                    var order_data = JSON.parse(list_of_table_order);
                    if(order_data.length == 0) {
                        $("#order_update").empty();
                        var html = spinner_bootstrap();
                        $("#order_update").append(html);
                    } else {
                        create_order_card(order_data);
                    }
                },
                error: function() {
                    console.log("[ERROR] err in show_order.php!");
                }
            });
    }, 3000);
}

function create_order_card(order_data) {

    $("#order_update").empty();
    var html = "";
    var order_json = order_data[0];
    var order = JSON.parse(order_json);
    var table_num = order[order.length-1].table_num;
    console.log("table num: " + table_num);
    html +=  "<div class=\"col-sm\">"+
                "<div class=\"card\" style=\"width: 18rem;\">"+
                "<div class=\"card-body\">"+
                "<h5 class=\"card-title\" style=\"height: 4rem;\">tavolo " + table_num +"</h5>";

    for (var j = 0; j < order.length-1; j++) {
        var piatto = order[j].name + " : " + order[j].quantity;
        html += "<p class=\"card-text\">"+piatto+"</p>";
    }

    html += "<a onClick=\"confirmOrder("+ table_num +")\" class=\"btn btn-primary\">Conferma</a>&nbsp;&nbsp;&nbsp;"+
            "<a onClick=\"undoOrder("+ table_num +")\" class=\"btn btn-secondary\">Annulla</a>"+
            "</div></div></div>";
    $("#order_update").append(html);

    var msg_to_rewabot_ws_server = {
        "move": "on",
        "table": table_num
      };
    ws_client.send(JSON.stringify(msg_to_rewabot_ws_server));
}

function ws_server_start_connection(server_string_conn) {
	ws_client = new WebSocket(server_string_conn);
	ws_client.onmessage = function(event) {
		console.log("onmessage: " + event.data);
	}
	ws_client.onopen = function() {
		console.log("onopen"); 
		ws_client.send("[INFO] connection from rewabot (OK)");	
	}
	ws_client.onclose = function() {
		console.log("onclose");
	}
	ws_client.onerror = function() {
		console.log("onerror");
	}
}

function send_msg_to_ws_server(server_string_conn, json_msg) {
	ws_client = new WebSocket();
	ws_client.onmessage = function(event) {
		append("messaggio: " + event.data);
	}
	ws_client.onopen = function() {
		append("connessione effettuata"); 
		ws_client.send("ok, jon!");	
	}
	ws_client.onclose = function() {
		append("connessione chiusa");
	}
	ws_client.onerror = function() {
		append("errore nella connessione");
	}
}

function confirmOrder(table_num) {
    var data = {};
    data.table_num = table_num;
    $.ajax
    ({
        type: "POST",
        url: "move_order_to_confirmed.php",
        data: data,
        success: function(ret) {
            $("#text_modal").text(ret);
            $("#order_confirmed_by_rewabot").modal('show');
        },
        error: function(ret) {
            alert("[ERROR] in confirmOrder ajax call!");
        }
    });
}

function undoOrder(table_num) {
    var data = {};
    data.table_num = table_num;
    $.ajax
    ({
        type: "POST",
        url: "remove_order_from_to_confirm.php",
        data: data,
        success: function(ret) {
            // alert(ret);
            $("#text_modal").text(ret);
            $("#order_confirmed_by_rewabot").modal('show');
        },
        error: function(ret) {
            alert("[ERROR] in confirmOrder ajax call!");
        }
    });
}

function spinner_bootstrap() {
    return  "<div class=\"spinner-border text-primary\" role=\"status\" style=\"width: 5rem; height: 5rem;\">"+
            "<span class=\"visually-hidden\">Loading...</span></div>"+
            "<div class=\"spinner-grow text-primary\" role=\"status\" style=\"width: 5rem; height: 5rem;\">"+
            "<span class=\"visually-hidden\">Loading...</span></div>"+
            "<div class=\"spinner-border text-success\" role=\"status\" style=\"width: 5rem; height: 5rem;\">"+
            "<span class=\"visually-hidden\">Loading...</span></div>"+
            "<div class=\"spinner-grow text-success\" role=\"status\" style=\"width: 5rem; height: 5rem;\">"+
            "<span class=\"visually-hidden\">Loading...</span></div>"+
            "<div class=\"spinner-border text-danger\" role=\"status\" style=\"width: 5rem; height: 5rem;\">"+
            "<span class=\"visually-hidden\">Loading...</span></div>"+
            "<div class=\"spinner-grow text-danger\" role=\"status\" style=\"width: 5rem; height: 5rem;\">"+
            "<span class=\"visually-hidden\">Loading...</span></div>"+
            "<div class=\"spinner-border text-warning\" role=\"status\" style=\"width: 5rem; height: 5rem;\">"+
            "<span class=\"visually-hidden\">Loading...</span></div>"+
            "<div class=\"spinner-grow text-warning\" role=\"status\" style=\"width: 5rem; height: 5rem;\">"+
            "<span class=\"visually-hidden\">Loading...</span></div>"+
            "<div class=\"spinner-border text-info\" role=\"status\" style=\"width: 5rem; height: 5rem;\">"+
            "<span class=\"visually-hidden\">Loading...</span></div>"+
            "<div class=\"spinner-grow text-info\" role=\"status\" style=\"width: 5rem; height: 5rem;\">"+
            "<span class=\"visually-hidden\">Loading...</span></div>";
}