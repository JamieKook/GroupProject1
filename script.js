let searchLocation="";
let theMuseApiKey="1f7d0ddf14cfd38dbdeeb9248ab3bff908d85e1bcc104a2a73cf76790d0c82eb";
let mapquestApiKey="jOoSJlKWI2v4lP46nMd8fKQ8SdfGXJkI"; 
let page= 1; 
let ongoingJobCount=0; 
let category=""; 
let isLastResult= false; 
let isMessageHidden= true; 
let isMessage2Hidden= true; 
let lowercase="abcdefghijklmnopqrstuvwxyz"; 

$(document).ready(function(){

    let messageSorry={h3: "Sorry!",
                        p1: "Your search resulted in no job postings.",
                        p2:""};

    let messageError={h3: "Input Error!",
                        p1: "Make sure you enter the location as the full city name, state abbreviation.",
                        p2: "For example: Nashville, TN"};

    let messageNoCategory= {h3: "Input Error!",
                        p1: "You need to select a job type from the dropdown list.",
                        p2: ""};

    function clearJobPosts(){
        $(".location").text(""); 
        $(".position").text("");
        $(".description").text("");
        $(".description").attr("href", "");
        $(".company").text("");
        $(".qualifications").text("");
    }

    function populateJobPostCards(initial, response){
        clearJobPosts();
        if (!isMessageHidden) {
            $("#message").hide(); 
            isMessageHidden=true;   
        } 
        let results= response.results;
        let jobCount=1;
        $(".job").show(); 
        let difference= results.length-ongoingJobCount; 
        if (difference !== 0 & !isLastResult){
            if (difference<5){
                let startOfBlanks= difference+ 1;
                while (startOfBlanks <6){
                    $("#job"+startOfBlanks).parent().hide();
                    startOfBlanks++; 
                }
                isLastResult=true; 
            }
            for (let i=initial; i<results.length; i++){
                let jobEl=$("#job"+jobCount); 
                jobEl.find(".location").text(results[i].locations[0].name); 
                jobEl.find(".position").text(results[i].name); 
                jobEl.find(".description").text(results[i].refs.landing_page);
                jobEl.find(".description").attr("href", results[i].refs.landing_page); 
                jobEl.find(".company").text(results[i].company.name); 
                jobEl.find(".qualifications").text(results[i].levels[0].name); 
                jobCount++; 
                ongoingJobCount++; 
                if(jobCount > 5){
                    break; 
                }
            }
            console.log("You are currently on the " +ongoingJobCount+ " job posting"); 
        } else {  
            console.log("There are no results"); 
            $("#message").removeAttr("hidden"); 
            $("#message").show(); 
            $("#message").find("h3").text(messageSorry.h3);
            $("#message").find("#p-one").text(messageSorry.p1);
            $("#message").find("#p-two").text(messageSorry.p2);
            isMessageHidden=false; 
            $(".job").hide(); 
        }
    }
  
    function searchJobs(){
        searchLocation= $("#cityInput").val().trim();
        category= $("#searchOptions").val(); 
        console.log(category); 
        let theMuseURL="https://www.themuse.com/api/public/jobs?category="+category+"&location="+searchLocation+"&page=1&api_key="+theMuseApiKey; 
        isLastResult=false; 
        $.ajax({
            url: theMuseURL,
            method: "GET"
        }).then(function(response){  
            page=1; 
            ongoingJobCount=0; 
            populateJobPostCards(0, response); 
            alertInput();     
        }); 
    }

    function moreJobs(){
        if (ongoingJobCount === 20){
            page++;
            ongoingJobCount=0; 
        }
        console.log("The last listed job is #" + ongoingJobCount+"and the page searched is "+page)      
        let theMuseURL="https://www.themuse.com/api/public/jobs?category="+category+"&location="+searchLocation+"&page="+page+"&api_key="+theMuseApiKey; 

        $.ajax({
            url: theMuseURL,
            method: "GET"
        }).then(function(response){
            populateJobPostCards(ongoingJobCount, response); 
        }); 

    }  

    function getMap(){
        let mapquestUrl="https://open.mapquestapi.com/staticmap/v5/map?key="+mapquestApiKey+"&center="+searchLocation+"&size=600,400@2x"
        $("#mapImg").attr("src", mapquestUrl); 
    }
    
    function alertInput(){
        if (!isMessageHidden){
            let cityInput=$("#cityInput").val().trim(); 
            cityInputArr= cityInput.split(", ");
            console.log(cityInputArr);
            if (cityInputArr.length !==2 || cityInputArr[1].length !== 2){
                $("#message").find("h3").text(messageError.h3);
                $("#message").find("#p-one").text(messageError.p1);
                $("#message").find("#p-two").text(messageError.p2); 
            } else if (lowercase.indexOf(cityInputArr[1][0]) !== -1 || lowercase.indexOf(cityInputArr[1][1]) !== -1){
                $("#message").find("h3").text(messageError.h3);
                $("#message").find("#p-one").text(messageError.p1);
                $("#message").find("#p-two").text(messageError.p2); 
            } else if ($("#searchOptions").val()==="Please Select an Option"){
                $("#message").find("h3").text(messageNoCategory.h3);
                $("#message").find("#p-one").text(messageNoCategory.p1);
                $("#message").find("#p-two").text(messageNoCategory.p2); 
            }  
        }
    }

    $("#searchbtn").on("click", function(){
        event.preventDefault(); 
        searchJobs();
        getMap();   
    }); 

    $("#morebtn").on("click", function(){
        event.preventDefault(); 
        moreJobs(); 
    }); 

}); 