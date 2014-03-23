describe('valdr', function() {

  beforeEach(module('valdr'));

  it('should provide constant for validation events', inject(function (valdrEvents) {
    expect(valdrEvents).toBeDefined();
  }));

  it('should provide constant for rulesChanged event', inject(function (valdrEvents) {
    expect(valdrEvents.rulesChanged).toBe('valdr-rules-changed');
  }));

});