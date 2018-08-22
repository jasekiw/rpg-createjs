export class ChatConsole {

    public static LogThis(text) {
        document.getElementById("log").innerHTML += "<br/>" + text;
        document.getElementById("toplog").scrollTop = document.getElementById("toplog").scrollHeight;
    }
    public static LogThisAlone(text) {
        document.getElementById("log").innerHTML = "<br/>" + text;
    }
}