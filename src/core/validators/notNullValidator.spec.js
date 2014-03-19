describe('notNullValidator', function () {

  var notNullValidator,
    validationUtil,
    config = {
      message: 'messageKey'
    };

  beforeEach(module('ncaModelValidation'));

  beforeEach(inject(function (_notNullValidator_, _validationUtil_) {
    notNullValidator = _notNullValidator_;
    validationUtil = _validationUtil_;
  }));

  it('should validate using the validationUtil', function () {
    // given
    spyOn(validationUtil, 'notNull');
    var value = 'someValue';

    // when
    notNullValidator.validate(config, value);

    // then
    expect(validationUtil.notNull).toHaveBeenCalledWith(value);
  });

  it('should return the validation result', function () {
    // given
    var value = 'value';

    // when
    var validationResult = notNullValidator.validate(config, value);

    // then
    expect(validationResult.messageKey).toBe(config.message);
    expect(validationResult.valid).toBe(true);
  });

  it('should provide the correct name', function () {
    expect(notNullValidator.name).toBe('javax.validation.constraints.NotNull');
  });

});
