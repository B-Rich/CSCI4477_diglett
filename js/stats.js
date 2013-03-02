/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

function displayStats(stats)
{
  var statsPanel = $("#dm-stats");
  console.log(stats);
  
}

socket.on("kmeans cluster", function(data) { displayStats(data); });