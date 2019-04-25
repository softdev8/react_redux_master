export default function channel(iframe, defaultListener) {

    function send(message) {
        iframe.contentWindow.postMessage(message, "*");
    }

    function subscribe(callback) {
        return window.addEventListener("message", callback);
    }

    function unsubscribe(callback){
        window.removeEventListener("message", callback);
    }

    if(defaultListener){
        subscribe(defaultListener);
    }

    return {
        send,
        subscribe,
        unsubscribe
    }
}