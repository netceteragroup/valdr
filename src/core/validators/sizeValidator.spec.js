describe('valdrSizeValidator', function () {

  var sizeValidator, constraint = {
    min: 5,
    max: 20,
    message: 'message'
  };

  beforeEach(module('valdr'));

  beforeEach(inject(function (valdrSizeValidator) {
    sizeValidator = valdrSizeValidator;
  }));

  it('should provide the correct name', function () {
    expect(sizeValidator.name).toBe('size');
  });

  it('should return true if value is valid', function () {
    // given
    var value = 'valid-value';

    // when
    var valid = sizeValidator.validate(value, constraint);

    // then
    expect(valid).toBe(true);
  });

  it('should return the validation result', function () {
    // given
    var value = 'a';

    // when
    var valid = sizeValidator.validate(value, constraint);

    // then
    expect(valid).toBe(false);
  });

  it('should be valid if min is 0 and value undefined', function () {
    // given
    constraint.min = 0;

    // when
    var valid = sizeValidator.validate(undefined, constraint);

    // then
    expect(valid).toBe(true);
  });

  it('should be valid if min is 1 and value undefined', function () {
    // given
    constraint.min = 1;

    // when
    var valid = sizeValidator.validate(undefined, constraint);

    // then
    expect(valid).toBe(true);
  });

});
