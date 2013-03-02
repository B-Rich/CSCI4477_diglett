/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

socket.on("kmeans cluster", function(data) { displayStats(data); });


function displayStats(stats)
{
  var data = [];
  var options;
  var colours = [];
  
  
for (var i = 0; i <= 60; i += 1) {
    d1.push([i, parseInt(Math.random() * 30 - 10)]);
    d2.push([i, parseInt(Math.random() * 30 - 10)]);
}

            
$.plot($("#dm-graph"), [{
    data: d1,
    threshold: {
        below: 5,
        color: "rgb(200, 20, 30)"
    }},
{
    data: d2,
    threshold: {
        below: -5,
        color: "rgb(250, 0, 0)"
    }}], {
    grid: {
        hoverable: true,
        borderWidth: 1,
        minBorderMargin: 10
    },
    colors: ["rgb(44,55,66)", "rgb(90,2,100)"]
});


}