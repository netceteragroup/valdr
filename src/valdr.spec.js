describe('valdr', function () {

  beforeEach(module('valdr'));

  it('should provide constant for validation events', inject(function (valdrEvents) {
    expect(valdrEvents).toBeDefined();
  }));

  it('should provide constant for revalidate event', inject(function (valdrEvents) {
    expect(valdrEvents.revalidate).toBe('valdr-revalidate');
  }));

  it('should provide a value for valdrClasses', inject(function (valdrClasses) {
    expect(valdrClasses.valid).toBe('ng-valid');
    expect(valdrClasses.invalid).toBe('ng-invalid');
    expect(valdrClasses.invalidDirtyTouchedGroup).toBe('valdr-invalid-dirty-touched-group');
  }));

});