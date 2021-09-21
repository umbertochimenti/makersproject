var camera_front_recording = false;
var camera_retro_recording = false;

$(document).ready(function() {

    $("#get_screen_front").click(function() {
        take_screen("front");
    });

    $("#get_screen_retro").click(function() {
        take_screen("retro");
    });

    $("#record_vids_front").click(function() {
        take_vids("front");
    });

    $("#record_vids_retro").click(function() {
        take_vids("retro");
    });
});

function take_screen(camera_name) {
    var current_date_time = new Date();
    var current_date_time_formated = current_date_time.getFullYear() + '-' +
                                ('0' + (current_date_time.getMonth()+1)).slice(-2)+ '-' + 
                                ('0' + current_date_time.getDate()).slice(-2) + '_'+
                                current_date_time.getHours()+ ':'+('0' + 
                                (current_date_time.getMinutes())).slice(-2)+ ':'+current_date_time.getSeconds();
    if (camera_name == "front")
        $.get("/getmethod/"+camera_name+"_"+current_date_time_formated.toString());
    else
        $.get("/getmethod2/"+camera_name+"_"+current_date_time_formated.toString());
    
    $("#get_screen_modal_title").html(camera_name + " camera");
    $("#get_screen_modal_text").html("[INFO] " + camera_name + " camera: saved frame!");
    $("#get_screen_modal").show();
    setTimeout(function(){ 
        $("#get_screen_modal").hide();
    }, 2000);
}


function take_vids(camera_name) {

    var current_date_time = new Date();
    var current_date_time_formated = current_date_time.getFullYear() + '-' +
                                ('0' + (current_date_time.getMonth()+1)).slice(-2)+ '-' + 
                                ('0' + current_date_time.getDate()).slice(-2) + '_'+
                                current_date_time.getHours()+ ':'+('0' + 
                                (current_date_time.getMinutes())).slice(-2)+ ':'+current_date_time.getSeconds();


    if (camera_name == "front") {
        if(!camera_front_recording) {
            console.log("okkk");
            $("#record_vids_front").removeClass('btn-secondary');
            $("#record_vids_front").addClass('btn-primary');
            $.get("/start_vids_front/"+camera_name+"_"+current_date_time_formated.toString());
            camera_front_recording = true;
        } else {
            $("#record_vids_front").removeClass('btn-primary');
            $("#record_vids_front").addClass('btn-secondary');
            $.get("/stop_vids_front/stop");
            camera_front_recording = false;
        }
    } else {
        if(!camera_retro_recording) {
            console.log("okkk");
            $("#record_vids_retro").removeClass('btn-secondary');
            $("#record_vids_retro").addClass('btn-primary');
            $.get("/start_vids_retro/"+camera_name+"_"+current_date_time_formated.toString());
            camera_retro_recording = true;
        } else {
            $("#record_vids_retro").removeClass('btn-primary');
            $("#record_vids_retro").addClass('btn-secondary');
            $.get("/stop_vids_retro/stop");
            camera_retro_recording = false;
        }
    }
}
