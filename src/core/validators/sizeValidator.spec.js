describe('sizeValidator', function () {

  var sizeValidator,
    validationUtil,
    config = {
      min: 5,
      max: 20,
      message: 'messageKey'
    };

  beforeEach(module('valdr'));

  beforeEach(inject(function (_sizeValidator_, _validationUtil_) {
    sizeValidator = _sizeValidator_;
    validationUtil = _validationUtil_;
  }));


  it('should return true if value is valid', function () {
    // given
    var value = 'valid-value';

    // when
    var validationResult = sizeValidator.validate(config, value);

    // then
    expect(validationResult.valid).toBe(true);
    expect(validationResult.messageKey).toBe(config.message);
    expect(validationResult.messageParams).toBeDefined();
    expect(validationResult.messageParams.min).toBe(config.min);
    expect(validationResult.messageParams.max).toBe(config.max);
  });

  it('should return the validation result', function () {
    // given
    var value = 'a';

    // when
    var validationResult = sizeValidator.validate(config, value);

    // then
    expect(validationResult.valid).toBe(false);
    expect(validationResult.messageKey).toBe(config.message);
    expect(validationResult.messageParams).toBeDefined();
    expect(validationResult.messageParams.min).toBe(config.min);
    expect(validationResult.messageParams.max).toBe(config.max);
  });

  it('should be valid if min is 0 and value undefined', function () {
    // given
    config.min = 0;

    // when
    var validationResult = sizeValidator.validate(config, undefined);

    // then
    expect(validationResult.valid).toBe(true);
  });

  it('should be invalid if min is 1 and value undefined', function () {
    // given
    config.min = 1;

    // when
    var validationResult = sizeValidator.validate(config, undefined);

    // then
    expect(validationResult.valid).toBe(false);
  });

  it('should provide the correct name', function () {
    expect(sizeValidator.name).toBe('Size');
  });

});
