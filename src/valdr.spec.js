describe('valdr', function() {

  beforeEach(module('valdr'));

  it('should provide constant for validation events', inject(function (valdrEvents) {
    expect(valdrEvents).toBeDefined();
  }));

  it('should provide constant for revalidate event', inject(function (valdrEvents) {
    expect(valdrEvents.revalidate).toBe('valdr-revalidate');
  }));

  it('should provide a value for valdrClasses', inject(function (valdrClasses) {
    expect(valdrClasses.valid).toBe('has-success');
    expect(valdrClasses.invalid).toBe('has-error');
    expect(valdrClasses.dirtyBlurred).toBe('dirty-blurred');
  }));

});