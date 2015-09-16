var rewire = require('rewire');

var dataUtils = rewire('../../app/js/utils/dataUtils');

var generateData = function(){
  var now = Date.now();
  var randomTime = now - (Math.random()*(24 * 60 * 60 * 1000 * 5));
  return new Date(randomTime);
}


var state = {
  data: {
    Watt: [
      {market: 'RT5M', timestamp: generateData(), carbon: null},
      {market: 'RT5M', timestamp: generateData(), carbon: 1056},
      {market: 'DAHR', timestamp: generateData(), carbon: 2015},
      {market: 'RT5M', timestamp: generateData(), carbon: 1252},
      {market: 'RT5M', timestamp: Date.now(), carbon: 1302},
    ],
    Utility: [
      {interval_start: generateData(), interval_kWh: 30.2},
      {interval_start: generateData(), interval_kWh: 2.02},
      {interval_start: generateData(), interval_kWh: 0.04},
      {interval_start: generateData(), interval_kWh: 0.75},
      {interval_start: generateData(), interval_kWh: 0.25},
    ],
  }
}

state.data.Utility.sort(function(a, b){
  return a.interval_start - b.interval_start
});


describe('Data Utils', function(){

  it('should parse out null carbon readings and DAHR markets', function(){
    var result = dataUtils.parseWattData(state);
    // console.log(result, '======================results====================');
    expect(result.length).toBeLessThan(5);
  });

  it('should handle empty Watt', function(done){
    var result, error;
    try{
      var result = dataUtils.parseWattData({data: { Watt: [] } });
    }catch (exception){
      var error = exception;
    }finally{
      expect(error).not.toBeDefined()
      expect(result).toBeDefined()
      done();
    }
  });

  it('should sort the Utility data in ascending order', function(){
    var result = dataUtils.parseUserKwhData(state);
    expect(result.length).toEqual(5);
    expect(result[result.length-1].point).toEqual(state.data.Utility[state.data.Utility.length-1].interval_kWh);
  });

  it('should return a list of users Kwh data', function(){
    var result = dataUtils.parseUserCarbonData(state);
    expect(result.length).toEqual(state.data.Utility.length);
  });

  it('should find the danger zones given a set of Watt data or empty array', function(){
    var watts = dataUtils.parseWattData(state);
    var timeFrame = [new Date('2015-09-11T12:40:00'), new Date(Date.now)];
    var result = dataUtils.findDangerZones(watts, timeFrame);
    expect(result).toBeDefined();
    expect(Array.isArray(result)).toBe(true);
  });

  xit('should return a prettified date string', function(){
    var date = new Date('2015-09-11T12:40:00');
    var result = dataUtils.formatFocusDate(date);
    expect(result).toBe('Fri 9/11, 12:40 PM');
  });

});