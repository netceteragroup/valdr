describe('valdrEqualsFieldValidator', function () {

  var equalsFieldValidator;

  beforeEach(module('valdr'));

  beforeEach(inject(function (valdrEqualsFieldValidator) {
    equalsFieldValidator = valdrEqualsFieldValidator;
  }));

  it('should provide the correct name', function () {
    expect(equalsFieldValidator.name).toBe('equalsField');
  });

  it('should return true for equal values', function () {
    var constraint = {
      'field': 'name'
    };

    var fieldValues = {
      'name': 'Mike'
    };

    expect(equalsFieldValidator.validate('Mike', constraint, fieldValues)).toBe(true);
    expect(equalsFieldValidator.validate('', constraint, {})).toBe(true);
    expect(equalsFieldValidator.validate('', constraint, {'name': ''})).toBe(true);
  });

  it('should return false for non equal fields', function () {
    var constraint = {
      'field': 'name'
    };

    var fieldValues = {
      'name': 'Mike'
    };

    expect(equalsFieldValidator.validate('', constraint, fieldValues)).toBe(false);
    expect(equalsFieldValidator.validate('Joe', constraint, fieldValues)).toBe(false);
    expect(equalsFieldValidator.validate('Mike ', constraint, fieldValues)).toBe(false);
    expect(equalsFieldValidator.validate('Mike', constraint, {})).toBe(false);
    expect(equalsFieldValidator.validate('Mike', constraint, {'name': ''})).toBe(false);
  });

});
