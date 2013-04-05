/* 
 * Dawson Reid
 */

/*
 * 
 * @param {type} file
 * @returns {Array}
 */
exports.parse_data = function(file) {

  try
  {
    var
            fileData = [],
            rawData = fs.readFileSync(file, 'utf8');

    // seperate data by line
    var lines = rawData.split('\n');

    // iterate through each line
    for (var i in lines) {

      // seperate line entries by comma
      var entries = lines[i].split(',');

      // iterate through each line entry
      for (var q in entries) {
        if (fileData[q] === undefined) {
          fileData[q] = [];
        }
        fileData[q][i] = parseFloat(entries[q]);
      }
    }
    return fileData;    // return my dataset

  } catch (error) {
    console.log(error);
  }
};