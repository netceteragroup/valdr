describe('sizeValidator', function () {

  var sizeValidator, config = {
      min: 5,
      max: 20,
      message: 'message'
    };

  beforeEach(module('valdr'));

  beforeEach(inject(function (_sizeValidator_) {
    sizeValidator = _sizeValidator_;
  }));

  it('should return true if value is valid', function () {
    // given
    var value = 'valid-value';

    // when
    var valid = sizeValidator.validate(value, config);

    // then
    expect(valid).toBe(true);
  });

  it('should return the validation result', function () {
    // given
    var value = 'a';

    // when
    var valid = sizeValidator.validate(value, config);

    // then
    expect(valid).toBe(false);
  });

  it('should be valid if min is 0 and value undefined', function () {
    // given
    config.min = 0;

    // when
    var valid = sizeValidator.validate(undefined, config);

    // then
    expect(valid).toBe(true);
  });

  it('should be invalid if min is 1 and value undefined', function () {
    // given
    config.min = 1;

    // when
    var valid = sizeValidator.validate(undefined, config);

    // then
    expect(valid).toBe(false);
  });

  it('should provide the correct name', function () {
    expect(sizeValidator.name).toBe('Size');
  });

});
