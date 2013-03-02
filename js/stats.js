/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

function displayStats(stats)
{
  var statsPanel = $("#dm-stats");
  var key = stats.key; // FIX ME
  var value = stats.value; // FIX ME
  statsPanel.find("#"+key).append(value);
}