var height = 0;
var control = "";
for (var i = 7; i >= height; i--) {
    for (var o = 6; o > i; o--) {
        control = control + "*";
    }
    control = control + "\n";
}

console.log(control);