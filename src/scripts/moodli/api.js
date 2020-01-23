/**
 * Copyright (c) 2020 Nadav Tasher
 * https://github.com/NadavTasher/Moodli/
 **/

class Moodli {
    /**
     * Checks whether to display the meter or not.
     */
    static init() {
        // Show loading
        UI.page("loading");
        // Send request
        API.send("moodli", "check", {}, (success, result) => {
            if (success) {
                if (result) {
                    UI.page("prompt");
                } else {
                    UI.page("statistics");
                    Moodli.statistics();
                }
            } else {
                UI.popup(result);
            }
        }, Authenticate.authenticate());
    }

    /**
     * Report today's mood.
     * @param mood A mood on a range of 0 (best) to 2 (worst)
     */
    static report(mood) {
        API.send("moodli", "report", {mood: parseInt(mood)}, (success, result) => {
            UI.page("statistics");
            Moodli.statistics();
        }, Authenticate.authenticate());
    }

    /**
     * Loads the statistics.
     */
    static statistics() {
        // Send a request
        API.send("moodli", "statistics", {}, (success, result) => {
            if (success) {
                // Create calendar
                let calendar = document.createElement("div");
                // Make calendar a column
                UI.column(calendar);
                // Loop through current year on map
                let currentYear = new Date().getFullYear();
                // Check if we have the current year in out map
                if (result.hasOwnProperty(currentYear.toString())) {
                    // Fetch year
                    let yearMap = result[currentYear.toString()];
                    // Get the first day-of-week of the current year
                    let date = new Date();
                    date.setTime(0);
                    date.setFullYear(currentYear, 0, 1);
                    let offset = date.getDay();
                    // Create rows
                    for (let week = 0; week < 53; week++) {
                        // Create row
                        let row = document.createElement("div");
                        // Make it a row
                        UI.row(row);
                        // Loop through days
                        for (let day = 0; day < 7; day++) {
                            // Create day element
                            let column = document.createElement("p");
                            // Make it a column
                            UI.input(column);
                            // Style it
                            column.setAttribute("day", "true");
                            // Color
                            let color = "#AAAAAA";
                            // Check for mood map
                            let dayOfYear = week * 7 + day;
                            let dayOfMap = dayOfYear - offset;
                            if (yearMap.hasOwnProperty(dayOfMap)) {
                                // Customize color
                                color = [
                                    "#88AA55",
                                    "#AAAA33",
                                    "#AA8855"
                                ][yearMap[dayOfMap]];
                                // Set text
                                let date = new Date();
                                date.setFullYear(currentYear, 0, dayOfMap + 1);
                                column.innerText = date.getDate().toString();
                            }
                            // Set color
                            column.style.backgroundColor = color;
                            // Append to week
                            row.appendChild(column);
                        }
                        // Append to year
                        calendar.appendChild(row);
                    }
                    // Calculate average
                    let summary = 0;
                    let count = 0;
                    // Loop through entries
                    for (let day in yearMap) {
                        // Sum yearMap
                        if (yearMap.hasOwnProperty(day)) {
                            summary += parseInt(yearMap[day]);
                            count += 1;
                        }
                    }
                    // Divide
                    if (count > 0) {
                        // Display
                        UI.get("average").src = "resources/svg/emoji/" + Math.round(summary / count) + ".svg";
                    }
                }
                // Remove all from page
                UI.clear("content");
                // Add calendar to page
                UI.get("content").appendChild(calendar);
            } else {
                UI.popup(result);
            }
        }, Authenticate.authenticate());
    }

    /**
     * Signs out and reloads.
     */
    static sign_out() {
        // Sign out
        Authenticate.sign_out();
        // Reload page
        window.location.reload();
    }

    /**
     * Fetches statistics and compiles a CSV file.
     * @param separator Line separator
     */
    static export(separator = "\n") {
        // Send a request
        API.send("moodli", "statistics", {}, (success, result) => {
            if (success) {
                // Loop through current year on map
                let currentYear = new Date().getFullYear();
                // Check if we have the current year in out map
                if (result.hasOwnProperty(currentYear.toString())) {
                    // Fetch year
                    let yearMap = result[currentYear.toString()];
                    // Create rows
                    let csv = "Date, Mood" + separator;
                    // Loop over days
                    for (let day in yearMap) {
                        // Make sure the day actually exists
                        if (yearMap.hasOwnProperty(day)) {
                            // Parse the day-of-year
                            let dayOfYear = parseInt(day);
                            // Create date string
                            let date = new Date();
                            // Set day of year
                            date.setFullYear(currentYear, 0, dayOfYear + 1);
                            // Setup mood text
                            let mood = "";
                            switch (yearMap[day]) {
                                case 0: {
                                    mood = "Happy";
                                    break;
                                }
                                case 1: {
                                    mood = "Neutral";
                                    break;
                                }
                                case 2: {
                                    mood = "Sad";
                                    break;
                                }
                            }
                            csv += (date.getDate()) + "/" + (date.getMonth() + 1) + ", " + mood + separator;
                        }
                    }
                    // Download as csv
                    let link = document.createElement("a");
                    link.download = "Moodli.csv";
                    link.href = "data:" + "text/plain" + ";" + "base64" + "," + btoa(csv);
                    link.click();
                }
            } else {
                UI.popup(result);
            }
        }, Authenticate.authenticate());
    }
}