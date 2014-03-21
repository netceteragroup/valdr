describe('ncaModelValidation', function() {

  beforeEach(module('ncaModelValidation'));

  it('should provide constant for validation events', inject(function (ncaModelValidationEvents) {
    expect(ncaModelValidationEvents).toBeDefined();
  }));

  it('should provide constant for rulesChanged event', inject(function (ncaModelValidationEvents) {
    expect(ncaModelValidationEvents.rulesChanged).toBe('nca-model-validation-rules-changed');
  }));

});