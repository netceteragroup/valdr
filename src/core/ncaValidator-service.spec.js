describe('ncaValidator', function () {

  var ncaValidator, $rootScope, ncaModelValidationEvents, sizeValidator,
    personRules = {
      'Person': {
        'firstName': {
          'Size': {
            'min': 0,
            'max': 10,
            'message': 'size'
          }
        }
      }
    },
    addressRules = {
      'Address': {
        'street': {
          'Required': {
            'message': 'required'
          }
        }
      }
    };

  beforeEach(module('ncaModelValidation'));

  beforeEach(inject(function (_ncaValidator_, _$rootScope_, _ncaModelValidationEvents_, _sizeValidator_) {
    ncaValidator = _ncaValidator_;
    $rootScope = _$rootScope_;
    ncaModelValidationEvents = _ncaModelValidationEvents_;
    sizeValidator = _sizeValidator_;
  }));

  describe('addValidationRules()', function () {

    it('should add initial validation rules', function () {
      // when
      ncaValidator.addValidationRules(personRules);

      // then
      expect(ncaValidator.getValidationRules()).toEqual(personRules);
    });

    it('should extend initial validation rules', function () {
      // when
      ncaValidator.addValidationRules(personRules);
      ncaValidator.addValidationRules(addressRules);

      // then
      expect(ncaValidator.getValidationRules().Person).toEqual(personRules.Person);
      expect(ncaValidator.getValidationRules().Address).toEqual(addressRules.Address);
    });

    it('should broadcast event when validation rules change', function () {
      // given
      spyOn($rootScope, '$broadcast');

      // when
      ncaValidator.addValidationRules(personRules);

      // then
      expect($rootScope.$broadcast).toHaveBeenCalledWith(ncaModelValidationEvents.rulesChanged);
    });
  });

  describe('validate()', function () {

    it('should validate with correct validator', function () {
      // given
      ncaValidator.addValidationRules(personRules);
      spyOn(sizeValidator, 'validate').andCallThrough();

      // when
      var validationResult = ncaValidator.validate('Person', 'firstName', 'Hanueli');

      // then
      expect(validationResult.valid).toBe(true);
      expect(sizeValidator.validate).toHaveBeenCalled();
    });

    it('should return invalid state and message if validation fails', function () {
      // given
      ncaValidator.addValidationRules(personRules);
      spyOn(sizeValidator, 'validate').andCallThrough();

      // when
      var validationResult = ncaValidator.validate('Person', 'firstName', 'Hanueli with a name that is too long');

      // then
      expect(sizeValidator.validate).toHaveBeenCalled();
      expect(validationResult.valid).toBe(false);
      expect(validationResult.messages[0].messageKey).toBe('size');
      expect(validationResult.messages[0].messageParams.max).toBe(10);
      expect(validationResult.messages[0].messageParams.min).toBe(0);
    });

  });

});