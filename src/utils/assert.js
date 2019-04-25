export default function(condition, message) {
    if (!condition) {
        message = message || "Assertion failed";
        
        if(console.assert){
          console.assert(condition, message);
        } else if (typeof Error !== "undefined") {
            throw new Error(message);
        }
        throw message; // Fallback
    }
}