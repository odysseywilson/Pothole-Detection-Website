//helper function for submitting changes to treatment table
function submit_treatment_changes(data){
    $.post("edit_treatment", data, function(data, status){
        if (status == "success"){
            alert("Treatment data successfully updated");
            window.location.href=("/treatment_data?id=" + data.potholeID);
        }
        else{
            alert("There was an error updating treatment data. No changes were made");
        }
    });
};

//Export current page's table to csv
function export_as_csv() {
    var table_id = 'maintable';
    // Select all rows from table
    var rows = document.querySelectorAll("table tr");
    // Construct csv
    var csv = [];
    for (var i = 0; i < rows.length; i++) {
        var row = [];
        var cols = rows[i].querySelectorAll('td, th');
        for (var j = 0; j < cols.length - 1; j++) {
            // Get rid of text from icons
            var data = cols[j].innerText.replace('arrow_drop_down', '').replace('double_arrow', '');
            row.push('"' + data + '"');
        }
        csv.push(row.join(','));
    }
    var csv_string = csv.join('\n');
    // Download it
    var filename = 'potholes_' + new Date().toLocaleDateString() + '.csv';
    var link = document.createElement('a');
    link.style.display = 'none';
    link.setAttribute('href', 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv_string));
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    window.URL.revokeObjectURL(a.href);
    document.body.removeChild(link);
}

$(document).ready(function(){
    //Set color for active nav bar entry
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

    if (filter == "all_potholes"){
        document.getElementById("allpotholes").style.backgroundColor="#5e7f80";
    }
    if (filter == "active_potholes"){
        document.getElementById("activepotholes").style.backgroundColor="#5e7f80";
    }
    if (filter == "treated_potholes"){
        document.getElementById("treatedpotholes").style.backgroundColor="#5e7f80";
    }

    //On click on nav bar options
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
        var time = $("#edittreattime").val();
        var weather = $("#edittreatweather").val();
        var temp = $("#edittreattemp").val();
        var empWeb = $("#edittreatempweb").val();
        var empApp = $("#edittreatempapp").val();
        var potholeID = window.location.href.split("http://localhost:3000/edit_treatment?id=")[1];
        
        var data = {
            treated: treated,
            date: date,
            time: time,
            weather: weather,
            temp: temp,
            empWeb: empWeb,
            empApp: empApp,
            potholeID: potholeID
        }

        submit_treatment_changes(data);

    })
});