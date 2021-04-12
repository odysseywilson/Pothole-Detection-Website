
function submit_treatment_changes(data){
    $.post("edit_treatment", data, function(data, status){
        if (status == "success"){
            alert("Treatment data successfully updated");
            window.location.href="/active_potholes";
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
        window.location.replace("/active_potholes");
    })

    $("#allpotholes").click(function(){
        window.location.replace("/all_potholes");
    })

    //Filters/sorting
    $("#sort_date").click(function(){
        //get the filter for the current page
        var filter;
        var urlEnd = window.location.href.split("http://localhost:3000/")[1];
        if (urlEnd == "all_potholes" || urlEnd == "treated_potholes" || urlEnd == "active_potholes"){
            filter = urlEnd;
        }
        else {
            const queryString = window.location.search;
            const params = new URLSearchParams(queryString);
            filter = params.get('filter');
        }

        window.location.replace("/sort?by=date&filter=" + filter);
    })
    $("#sort_severity").click(function(){
        var filter;
        var urlEnd = window.location.href.split("http://localhost:3000/")[1];
        if (urlEnd == "all_potholes" || urlEnd == "treated_potholes" || urlEnd == "active_potholes"){
            filter = urlEnd;
        }
        else {
            const queryString = window.location.search;
            const params = new URLSearchParams(queryString);
            filter = params.get('filter');
        }
        window.location.replace("/sort?by=severity&filter=" + filter);
    })
    $("#sort_num_reports").click(function(){
        var filter;
        var urlEnd = window.location.href.split("http://localhost:3000/")[1];
        if (urlEnd == "all_potholes" || urlEnd == "treated_potholes" || urlEnd == "active_potholes"){
            filter = urlEnd;
        }
        else {
            const queryString = window.location.search;
            const params = new URLSearchParams(queryString);
            filter = params.get('filter');
        }
        window.location.replace("/sort?by=num_reports&filter=" + filter);
    })
    $("#sort_highway").click(function(){
        var filter;
        var urlEnd = window.location.href.split("http://localhost:3000/")[1];
        if (urlEnd == "all_potholes" || urlEnd == "treated_potholes" || urlEnd == "active_potholes"){
            filter = urlEnd;
        }
        else {
            const queryString = window.location.search;
            const params = new URLSearchParams(queryString);
            filter = params.get('filter');
        }
        window.location.replace("/sort?by=highway&filter=" + filter);
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