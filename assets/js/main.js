/*
	Theme built-upon Stellar by HTML5 UP
*/
(function($) {

    var arrayForMap = [];

    var $window = $(window),
        $body = $('body'),
        $main = $('#main');

    // Breakpoints.
    breakpoints({
        xlarge: ['1281px', '1680px'],
        large: ['981px', '1280px'],
        medium: ['737px', '980px'],
        small: ['481px', '736px'],
        xsmall: ['361px', '480px'],
        xxsmall: [null, '360px']
    });

    // Play initial animations on page load.
    $window.on('load', function() {
        window.setTimeout(function() {
            $body.removeClass('is-preload');
        }, 100);
    });

    // Nav.
    var $nav = $('#nav');

    if ($nav.length > 0) {

        // Shrink effect.
        $main
            .scrollex({
                mode: 'top',
                enter: function() {
                    $nav.addClass('alt');
                },
                leave: function() {
                    $nav.removeClass('alt');
                },
            });

        // Links.
        var $nav_a = $nav.find('a');

        $nav_a
            .scrolly({
                speed: 1000,
                offset: function() { return $nav.height(); }
            })
            .on('click', function() {

                var $this = $(this);

                // External link? Bail.
                if ($this.attr('href').charAt(0) != '#')
                    return;

                // Deactivate all links.
                $nav_a
                    .removeClass('active')
                    .removeClass('active-locked');

                // Activate link *and* lock it (so Scrollex doesn't try to activate other links as we're scrolling to this one's section).
                $this
                    .addClass('active')
                    .addClass('active-locked');

            })
            .each(function() {

                var $this = $(this),
                    id = $this.attr('href'),
                    $section = $(id);

                // No section for this link? Bail.
                if ($section.length < 1)
                    return;

                // Scrollex.
                $section.scrollex({
                    mode: 'middle',
                    initialize: function() {

                        // Deactivate section.
                        if (browser.canUse('transition'))
                            $section.addClass('inactive');

                    },
                    enter: function() {

                        // Activate section.
                        $section.removeClass('inactive');

                        // No locked links? Deactivate all links and activate this section's one.
                        if ($nav_a.filter('.active-locked').length == 0) {

                            $nav_a.removeClass('active');
                            $this.addClass('active');

                        }

                        // Otherwise, if this section's link is the one that's locked, unlock it.
                        else if ($this.hasClass('active-locked'))
                            $this.removeClass('active-locked');

                    }
                });

            });

    }

    // Scrolly.
    $('.scrolly').scrolly({
        speed: 1000
    });


    // Get the stat for the virus
    $.ajax({
        url: "https://corona-virus-stats.herokuapp.com/api/v1/cases/general-stats",
        success: function(result) {
            $("#totalCases").html(result["data"]["total_cases"]);
            $("#totalDeaths").html(result["data"]["death_cases"]);

            $("#stillInfected").html((parseInt(result["data"]["currently_infected"].split(",").join("")) / parseInt(result["data"]["total_cases"].split(",").join(""))).toFixed(2) * 100 + "%");
            $.ajax({
                url: "https://api.covid19api.com/summary",
                success: function(result) {
                    $("#todayCases").html(result["Global"]["NewConfirmed"]);
                    $("#todayDeaths").html(result["Global"]["NewDeaths"]);
                }
            });
        }
    });

    // Read CDC article and get latest data
    /**
    fetch("https://tools.cdc.gov/api/v2/resources/media/132608.rss")
        .then(response => response.text())
        .then(str => new window.DOMParser().parseFromString(str, "text/xml"))
        .then(data => {
            const items = data.querySelectorAll("item");
            var counter = 0;
            items.forEach(el => {
                if (counter < 3) {
                    document.getElementById("newsTitle" + counter).innerHTML = el.querySelector("title").innerHTML;
                    document.getElementById("newsDate" + counter).innerHTML = el.querySelector("pubDate").innerHTML;
                    document.getElementById("newsDetail" + counter).innerHTML = el.querySelector("description").innerHTML;
                    document.getElementById("newsLink" + counter).href = el.querySelector("link").innerHTML.split("amp;").join("");
                    counter++;
                }
            });
        });
        */

    // Fetch Vaccine details for phase 2
    $.ajax({
        url: "https://spreadsheets.google.com/feeds/cells/1s0j7roYF8zxqK-gNgqnKtkY8OrgmovzDwtjAc6LI3c0/1/public/values?alt=json",
        success: function(result) {
            var table = "";
            for (var i = 0; i < result["feed"]["entry"].length - 1; i = i + 6) {
                table += "<tr>";
                table += '<td style="font-size: 0.8em;">' + result["feed"]["entry"][i]["content"]["$t"] + '</td>';
                table += '<td style="font-size: 0.8em;">' + result["feed"]["entry"][i + 1]["content"]["$t"] + '</td>';
                table += '<td style="font-size: 0.8em;background-color:#99B898;color: white;" class="disMobile" >' + result["feed"]["entry"][i + 2]["content"]["$t"] + '</td>';
                table += '<td style="font-size: 0.8em;">' + result["feed"]["entry"][i + 3]["content"]["$t"] + '</td>';
                var res = "<td>";
                var totalSources = result["feed"]["entry"][i + 4]["content"]["$t"].split("|");
                var varListOfLocation = result["feed"]["entry"][i + 5]["content"]["$t"].split("@");
                for (var z=0; z < varListOfLocation.length; z++){
                    arrayForMap.push({
                        "title": result["feed"]["entry"][i]["content"]["$t"],
                        "latitude": parseFloat((varListOfLocation[z].split(","))[0]),
                        "longitude": parseFloat((varListOfLocation[z].split(","))[1]),
                        "color":null
                      });
                }
                for (var z = 0; z < totalSources.length; z++) {
                    res += '<a rel="external nofollow" href="' + totalSources[z] + '">Source[' + (z + 1) + ']</a><br>';
                }
                table += res + '</td>' + '</tr>';
            }
            document.getElementById("insertPhase2Here").innerHTML = table;
            doPhase1();
        }
    });

    // Fetch Vaccine details for phase 1
    function doPhase1(){
        $.ajax({
            url: "https://spreadsheets.google.com/feeds/cells/1aca-atk3B4pK9GYya1UrBKWjFoA6Tn1_se61EEE2IUw/1/public/values?alt=json",
            success: function(result) {
                var table = "";
                for (var i = 0; i < result["feed"]["entry"].length - 1; i = i + 6) {

                    table += "<tr>";
                    table += '<td style="font-size: 0.8em;">' + result["feed"]["entry"][i]["content"]["$t"] + '</td>';
                    table += '<td style="font-size: 0.8em;">' + result["feed"]["entry"][i + 1]["content"]["$t"] + '</td>';
                    table += '<td style="font-size: 0.8em;background-color:#99B898;color: white;" class="disMobile" >' + result["feed"]["entry"][i + 2]["content"]["$t"] + '</td>';
                    table += '<td style="font-size: 0.8em;">' + result["feed"]["entry"][i + 3]["content"]["$t"] + '</td>';
                    var res = "<td>";
                    var totalSources = result["feed"]["entry"][i + 4]["content"]["$t"].split("|");
                    var varListOfLocation = result["feed"]["entry"][i + 5]["content"]["$t"].split("@");
                    for (var z=0; z < varListOfLocation.length; z++){
                        arrayForMap.push({
                            "title": result["feed"]["entry"][i]["content"]["$t"],
                            "latitude": parseFloat((varListOfLocation[z].split(","))[0]),
                            "longitude": parseFloat((varListOfLocation[z].split(","))[1]),
                            "color":null
                          });
                    }
                    for (var z = 0; z < totalSources.length; z++) {
                        res += '<a rel="external nofollow" href="' + totalSources[z] + '">Source[' + (z + 1) + ']</a><br>';
                    }
                    table += res + '</td>' + '</tr>';
                }
                document.getElementById("insertPhase1Here").innerHTML = table;
                doPhase0();
            }
        });
    }

    // Fetch Vaccine details for phase 0
    function doPhase0(){
        $.ajax({
            url: "https://spreadsheets.google.com/feeds/cells/1VOgZcm9CawE-oskv-QSIeAd29-rHRj7CSYWWqwffE_0/1/public/values?alt=json",
            success: function(result) {
                var table = "";
                for (var i = 0; i < result["feed"]["entry"].length - 1; i = i + 6) {
                    table += "<tr>";
                    table += '<td style="font-size: 0.8em;">' + result["feed"]["entry"][i]["content"]["$t"] + '</td>';
                    table += '<td style="font-size: 0.8em;">' + result["feed"]["entry"][i + 1]["content"]["$t"] + '</td>';
                    table += '<td style="font-size: 0.8em;background-color:#99B898;color: white;" class="disMobile"  >' + result["feed"]["entry"][i + 2]["content"]["$t"] + '</td>';
                    table += '<td style="font-size: 0.8em;">' + result["feed"]["entry"][i + 3]["content"]["$t"] + '</td>';
                    var res = "<td>";
                    var totalSources = result["feed"]["entry"][i + 4]["content"]["$t"].split("|");
    
                    var varListOfLocation = result["feed"]["entry"][i + 5]["content"]["$t"].split("@");
                    for (var z=0; z < varListOfLocation.length; z++){
                        if (!isNaN(parseFloat((varListOfLocation[z].split(","))[0]))){
                            arrayForMap.push({
                                "title": result["feed"]["entry"][i]["content"]["$t"],
                                "latitude": parseFloat((varListOfLocation[z].split(","))[0]),
                                "longitude": parseFloat((varListOfLocation[z].split(","))[1]),
                                "color":null
                              });
                        }
                    }
                    
                    
                      for (var z = 0; z < totalSources.length; z++) {
                        res += '<a rel="external nofollow" href="' + totalSources[z] + '">Source[' + (z + 1) + ']</a><br>';
                    }
                    table += res + '</td>' + '</tr>';
                }
                document.getElementById("insertPhase0Here").innerHTML = table;
    
    
                am4core.ready(function() {
                    // Themes begin
                    am4core.useTheme(am4themes_animated);
                    // Themes end
                    
                    // Create map instance
                    var chart = am4core.create("chartdiv", am4maps.MapChart);
                    
                    // Set map definition
                    chart.geodata = am4geodata_worldLow;
                    
                    // Set projection
                    chart.projection = new am4maps.projections.Miller();
                    
                    // Create map polygon series
                    var polygonSeries = chart.series.push(new am4maps.MapPolygonSeries());
                    
                    // Exclude Antartica
                    polygonSeries.exclude = ["AQ"];
                    
                    // Make map load polygon (like country names) data from GeoJSON
                    polygonSeries.useGeodata = true;
                    
                    // Configure series
                    var polygonTemplate = polygonSeries.mapPolygons.template;
                    polygonTemplate.tooltipText = "{name}";
                    polygonTemplate.polygon.fillOpacity = 0.6;
                    
                    
                    // Create hover state and set alternative fill color
                    var hs = polygonTemplate.states.create("hover");
                    hs.properties.fill = chart.colors.getIndex(0);
                    
                    // Add image series
                    var imageSeries = chart.series.push(new am4maps.MapImageSeries());
                    imageSeries.mapImages.template.propertyFields.longitude = "longitude";
                    imageSeries.mapImages.template.propertyFields.latitude = "latitude";
                    imageSeries.mapImages.template.tooltipText = "{title}";
                    imageSeries.mapImages.template.propertyFields.url = "url";
                    
                    var circle = imageSeries.mapImages.template.createChild(am4core.Circle);
                    circle.radius = 3;
                    circle.propertyFields.fill = "color";
                    
                    var circle2 = imageSeries.mapImages.template.createChild(am4core.Circle);
                    circle2.radius = 3;
                    circle2.propertyFields.fill = "color";
                    
                    
                    circle2.events.on("inited", function(event){
                      animateBullet(event.target);
                    })
                    
                    
                    function animateBullet(circle) {
                        var animation = circle.animate([{ property: "scale", from: 1, to: 5 }, { property: "opacity", from: 1, to: 0 }], 1000, am4core.ease.circleOut);
                        animation.events.on("animationended", function(event){
                          animateBullet(event.target.object);
                        })
                    }
                    
                    var colorSet = new am4core.ColorSet();
                    
                    for (var z=0; z < arrayForMap.length; z++){
                        arrayForMap[z]["color"] = colorSet.next();
                    }
            
                    imageSeries.data = arrayForMap;
                    
                    });
    
    
    
    
    
    
            }    
        });

    }

})(jQuery);
