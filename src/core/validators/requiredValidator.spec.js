describe('requiredValidator', function () {

  var requiredValidator,
    validationUtil,
    config = {
      message: 'messageKey'
    };

  beforeEach(module('valdr'));

  beforeEach(inject(function (_requiredValidator_, _validationUtil_) {
    requiredValidator = _requiredValidator_;
    validationUtil = _validationUtil_;
  }));

  it('should validate using the validationUtil', function () {
    // given
    spyOn(validationUtil, 'notNull');
    var value = 'someValue';

    // when
    requiredValidator.validate(config, value);

    // then
    expect(validationUtil.notNull).toHaveBeenCalledWith(value);
  });

  it('should return the validation result', function () {
    // given
    var value = 'value';

    // when
    var validationResult = requiredValidator.validate(config, value);

    // then
    expect(validationResult.messageKey).toBe(config.message);
    expect(validationResult.valid).toBe(true);
  });

  it('should provide the correct name', function () {
    expect(requiredValidator.name).toBe('Required');
  });

});
