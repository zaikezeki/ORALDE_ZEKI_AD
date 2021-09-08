var result = '\n';
for (var i = 1; i < 11; i++) {
    for (j = 1; j < 11; j++) {
        result = result + (i * j) + '';
    }
    result = result + '\n';
    console.log(result);
}