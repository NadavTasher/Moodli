class Moodli {

    static API = "moodli";

    static COLOR_DEFAULT = "#AAAAAA";

    static COLOR_MOOD = [
        "#5588AA",
        "#88AA55",
        "#AA8855"
    ];

    /**
     * Checks whether to display the meter or not.
     */
    static init() {
        // Show loading
        UI.page("loading");
        // Send request
        API.send(this.API, "check", {}, (success, result) => {
            if (success) {
                UI.page("prompt");
            } else {
                UI.page("personal");
                Moodli.statistics();
            }
        }, Authenticate.authenticate());
    }

    /**
     * Report today's mood.
     * @param mood A mood on a range of 0 (best) to 2 (worst)
     */
    static report(mood) {
        API.send(this.API, "report", {mood: parseInt(mood)}, (success, result) => {
            if (success) {
                UI.page("personal");
                Moodli.statistics();
            } else {
                UI.popup(result);
            }
        }, Authenticate.authenticate());
    }

    /**
     * Loads the statistics.
     */
    static statistics() {
        // Send a request
        API.send(this.API, "statistics", {}, (success, result) => {
            if (success) {
                // Create calendar
                let calendar = document.createElement("div");
                // Make calendar a column
                UI.column(calendar);
                // Create day headings
                let days = document.createElement("div");
                // Make it a row
                UI.row(days);
                // Add day strings
                for (let day of ["S", "M", "T", "W", "T", "F", "S"]) {
                    // Create paragraph
                    let paragraph = document.createElement("p");
                    // Set text
                    paragraph.innerText = day;
                    // Append to days
                    days.appendChild(paragraph);
                }
                // Append heading
                calendar.appendChild(days);
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
                            let column = document.createElement("div");
                            // Make it a column
                            UI.input(column);
                            // Color
                            let color = this.COLOR_DEFAULT;
                            // Check for mood map
                            let dayOfYear = week * 7 + day;
                            let dayOfMap = (dayOfYear + offset).toString();
                            if (yearMap.hasOwnProperty(dayOfMap)) {
                                color = this.COLOR_MOOD[yearMap[dayOfMap]];
                            }
                            // Set color
                            column.style.backgroundColor = this.COLOR_DEFAULT;
                            // Append to week
                            row.appendChild(column);
                        }
                        // Append to year
                        calendar.appendChild(row);
                    }
                }
                // Remove all from page
                UI.clear("personal");
                // Add calendar to page
                UI.get("personal").appendChild(calendar);
            } else {
                UI.popup(result);
            }
        }, Authenticate.authenticate());
    }
}