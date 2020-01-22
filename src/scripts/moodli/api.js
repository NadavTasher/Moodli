class Moodli {

    static API = "moodli";

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
            } else {
                UI.popup(result);
            }
        }, Authenticate.authenticate());
    }
}