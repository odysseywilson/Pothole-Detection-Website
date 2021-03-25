
function submit_treatment_changes(data){
    $.post("edit_treatment", data, function(data, status){
        if (status == "success"){
            alert("Treatment data successfully updated");
            window.location.href="/";
        }
        else{
            alert("There was an error updating treatment data. No changes were made");
        }
    });
};

$(document).ready(function(){
   // addTableRow();

    /*$("#morebutton").click(function(){
        window.location.replace("/test");
    });*/

    /*$("#edit_treatment").click(function(){
        window.location.replace("/edit_treatment")
    })*/

    $("#treatedpotholes").click(function(){
        window.location.replace("/treated_potholes");
    })

    $("#activepotholes").click(function(){
        window.location.replace("/");
    })

    //Submit changes to pothole treatment data
    $("#submittreatchanges").click(function(){
        var treated = $("#edittreated").val();
        var date = $("#edittreatdate").val();
        var weather = $("#edittreatweather").val();
        var temp = $("#edittreattemp").val();
        var empWeb = $("#edittreatempweb").val();
        var empApp = $("#edittreatempapp").val();
        var potholeID = window.location.href.split("http://localhost:3000/edit_treatment?id=")[1];
        
        var data = {
            treated: treated,
            date: date,
            weather: weather,
            temp: temp,
            empWeb: empWeb,
            empApp: empApp,
            potholeID: potholeID
        }

        submit_treatment_changes(data);

    })
});