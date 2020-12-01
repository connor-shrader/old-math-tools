// Navigation
const navigation = document.getElementById("nav");

function menuClick() {
    if (navigation.className === "closed") {
        navigation.className = "open";
    } else {
        navigation.className = "closed";
    }
}