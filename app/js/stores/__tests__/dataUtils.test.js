var rewire = require('rewire');

var dataUtils = rewire('../../utils/dataUtils');

var state = {
  data: {
    Watt: [
      {market: 'RT5M', timestamp: new Date('2015-09-13T03:24:00'), carbon: null},
      {market: 'RT5M', timestamp: new Date('2015-09-13T04:24:00'), carbon: 1056},
      {market: 'DAHR', timestamp: new Date('2015-09-12T03:34:00'), carbon: 2015},
      {market: 'RT5M', timestamp: new Date('2015-09-11T12:24:00'), carbon: 1252},
      {market: 'RT5M', timestamp: new Date('2015-09-12T12:40:00'), carbon: 1302},
    ],
    Utility: [
      {interval_start: new Date('2015-09-13T03:24:00'), interval_kWh: null},
      {interval_start: new Date('2015-09-13T04:24:00'), interval_kWh: 2.02},
      {interval_start: new Date('2015-09-12T03:34:00'), interval_kWh: 0.04},
      {interval_start: new Date('2015-09-11T12:24:00'), interval_kWh: 0.75},
      {interval_start: new Date('2015-09-12T12:40:00'), interval_kWh: 0.25},
    ],
  }
}
describe('Data Utils (time sensitive)', function(){

  it('should parse out null carbon readings and DAHR markets', function(){
    var result = dataUtils.parseWattData(state);
    expect(result.length).toEqual(2);
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
    expect(result[result.length-1].point).toEqual(2.02);
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

  it('should return a prettified date string', function(){
    var date = new Date('2015-09-11T12:40:00');
    var result = dataUtils.formatFocusDate(date);
    expect(result).toBe('Fri 9/11, 12:40 PM');
  });

});