//Converter Class
var fs = require("fs");
var Converter = require("csvtojson").Converter;


var fileName = process.argv[2];

csvFileToJSON(fileName, function(data) {

  var columns = [
    'id',
    'date',
    'time_of_day',
    'time_of_day_recode',
    'incident_type',
    'incident_action',
    'territorial_water_status',
    'closest_coastal_state',
    'closest_coastal_state_cow_code',
    'latitude',
    'longitude',
    'location_precision',
    'geolocation_source_imb',
    'geolocation_source_imo',
    'geolocation_source_asam',
    'location_description',
    'vessel_name',
    'vessel_country',
    'vessel_country_cow_code',
    'vessel_status',
    'violence_dummy',
    'steaming_recode',
    'incident_type_recode',
    'incident_action_recode'
  ];

  // Print column names
  console.log(columns.join(','));

  data.forEach(function(row) {
    var outputObject = {
      id: row.id,
      date: new Date(row.year, row.month - 1, row.day, 0, 0, 0).toLocaleDateString(),
      time_of_day: row.timeofday,
      time_of_day_recode: row.timeofdayrecode,
      incident_action: row.incident_action,
      latitude: row.latitude,
      longitude: row.longitude,
      incident_type: row.incident_type,
      territorial_water_status: row.territorial_water_status,
      closest_coastal_state: row.closest_coastal_state,
      closest_coastal_state_cow_code: row.closest_state_cow_code,
      location_precision: row.location_precision,
      geolocation_source_imb: row.geolocation_source_imb,
      geolocation_source_imo: row.geolocation_source_imo,
      geolocation_source_asam: row.geolocation_source_asam,
      location_description: row.location_description,
      vessel_name: row.vessel_name,
      vessel_type: row.vessel_type,
      vessel_country: row.vessel_country,
      vessel_country_cow_code: row.Vessel_country_cow_code,
      vessel_status: row.vessel_status,
      violence_dummy: row["Violence Dummy"],
      steaming_recode: row["Steaming Recode"],
      incident_type_recode: row.Incident_type_recode,
      incident_action_recode: row.Incident_action_recode
    };

    var outputRow = columns.map(function(key) {
      if(outputObject[key]) {
        return '"' + outputObject[key] + '"';
      } else {
        return '';
      }
    });

    // Print the row values
    console.log(outputRow.join(','));

  });

});

function csvFileToJSON(fileName, callback) {
  var fileStream = fs.createReadStream(fileName);
  var csvConverter = new Converter({
    constructResult: true
  });
  fileStream.pipe(csvConverter);
  csvConverter.on("end_parsed", function(jsonObj) {
    callback(jsonObj);
  });
}
