/*
	Theme built-upon Stellar by HTML5 UP
*/
(function($) {

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

    // Fetch Vaccine details for phase 2
    $.ajax({
        url: "https://spreadsheets.google.com/feeds/cells/1yvmeAtpxonqmJ7OlO2gRBt2lUVnk3baeIHFu0M9ZLxo/1/public/values?alt=json",
        success: function(result) {
            var table = "";
            for (var i = 0; i < result["feed"]["entry"].length - 1; i = i + 5) {
                table += "<tr>";
                table += '<td style="font-size: 0.8em;">' + result["feed"]["entry"][i]["content"]["$t"] + '</td>';
                table += '<td style="font-size: 0.8em;">' + result["feed"]["entry"][i + 1]["content"]["$t"] + '</td>';
                table += '<td style="font-size: 0.8em;background-color:#99B898;color: white" >' + result["feed"]["entry"][i + 2]["content"]["$t"] + '</td>';
                table += '<td style="font-size: 0.8em;">' + result["feed"]["entry"][i + 3]["content"]["$t"] + '</td>';
                var res = "<td>";
                var totalSources = result["feed"]["entry"][i + 4]["content"]["$t"].split("|");
                for (var z = 0; z < totalSources.length; z++) {
                    res += '<a rel="external nofollow" href="' + totalSources[z] + '">Source[' + (z + 1) + ']</a><br>';
                }
                table += res + '</td>' + '</tr>';
            }
            document.getElementById("insertPhase2Here").innerHTML = table;
        }
    });

    // Fetch Vaccine details for phase 1
    $.ajax({
        url: "https://spreadsheets.google.com/feeds/cells/1Ebxlw5HEqzr1JEO4atHZiYGweUUQ6gIPBECDjuvkHR8/1/public/values?alt=json",
        success: function(result) {
            var table = "";
            for (var i = 0; i < result["feed"]["entry"].length - 1; i = i + 5) {

                table += "<tr>";
                table += '<td style="font-size: 0.8em;">' + result["feed"]["entry"][i]["content"]["$t"] + '</td>';
                table += '<td style="font-size: 0.8em;">' + result["feed"]["entry"][i + 1]["content"]["$t"] + '</td>';
                table += '<td style="font-size: 0.8em;background-color:#99B898;color: white" >' + result["feed"]["entry"][i + 2]["content"]["$t"] + '</td>';
                table += '<td style="font-size: 0.8em;">' + result["feed"]["entry"][i + 3]["content"]["$t"] + '</td>';
                var res = "<td>";
                var totalSources = result["feed"]["entry"][i + 4]["content"]["$t"].split("|");
                for (var z = 0; z < totalSources.length; z++) {
                    res += '<a rel="external nofollow" href="' + totalSources[z] + '">Source[' + (z + 1) + ']</a><br>';
                }
                table += res + '</td>' + '</tr>';
            }
            document.getElementById("insertPhase1Here").innerHTML = table;
        }
    });

    // Fetch Vaccine details for phase 0
    $.ajax({
        url: "https://spreadsheets.google.com/feeds/cells/1PINwxQbZr14xz_TfODu0_XQNRPuAlsGgIqcVbFjGOn8/1/public/values?alt=json",
        success: function(result) {
            var table = "";
            for (var i = 0; i < result["feed"]["entry"].length - 1; i = i + 5) {
                table += "<tr>";
                table += '<td style="font-size: 0.8em;">' + result["feed"]["entry"][i]["content"]["$t"] + '</td>';
                table += '<td style="font-size: 0.8em;">' + result["feed"]["entry"][i + 1]["content"]["$t"] + '</td>';
                table += '<td style="font-size: 0.8em;background-color:#99B898;color: white"  >' + result["feed"]["entry"][i + 2]["content"]["$t"] + '</td>';
                table += '<td style="font-size: 0.8em;">' + result["feed"]["entry"][i + 3]["content"]["$t"] + '</td>';
                var res = "<td>";
                var totalSources = result["feed"]["entry"][i + 4]["content"]["$t"].split("|");
                for (var z = 0; z < totalSources.length; z++) {
                    res += '<a rel="external nofollow" href="' + totalSources[z] + '">Source[' + (z + 1) + ']</a><br>';
                }
                table += res + '</td>' + '</tr>';
            }
            document.getElementById("insertPhase0Here").innerHTML = table;
        }
    });
})(jQuery);