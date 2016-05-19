describe('valdr', function () {

  var valdr, $rootScope, valdrEvents, valdrClasses, sizeValidator, requiredValidator,
    personConstraints = {
      'Person': {
        'firstName': {
          'size': {
            'min': 0,
            'max': 10,
            'message': 'size'
          }
        }
      }
    },
    addressConstraints = {
      'Address': {
        'street': {
          'required': {
            'message': 'required'
          }
        }
      }
    };

  beforeEach(module('valdr'));

  beforeEach(inject(
    function (_valdr_, _$rootScope_, _valdrEvents_, _valdrClasses_, _valdrSizeValidator_, _valdrRequiredValidator_) {
    valdr = _valdr_;
    $rootScope = _$rootScope_;
    valdrEvents = _valdrEvents_;
    valdrClasses = _valdrClasses_;
    sizeValidator = _valdrSizeValidator_;
    requiredValidator = _valdrRequiredValidator_;
  }));

  describe('addConstraints()', function () {

    it('should add initial constraints', function () {
      // when
      valdr.addConstraints(personConstraints);

      // then
      expect(valdr.getConstraints()).toEqual(personConstraints);
    });

    it('should extend initial constraints', function () {
      // when
      valdr.addConstraints(personConstraints);
      valdr.addConstraints(addressConstraints);

      // then
      expect(valdr.getConstraints().Person).toEqual(personConstraints.Person);
      expect(valdr.getConstraints().Address).toEqual(addressConstraints.Address);
    });

    it('should broadcast event when constraints change', function () {
      // given
      spyOn($rootScope, '$broadcast');

      // when
      valdr.addConstraints(personConstraints);

      // then
      expect($rootScope.$broadcast).toHaveBeenCalledWith(valdrEvents.revalidate);
    });
  });

  describe('removeConstraints()', function () {

    it('should remove single constraint', function () {
      // given
      valdr.addConstraints(personConstraints);
      valdr.addConstraints(addressConstraints);

      // when
      valdr.removeConstraints('Person');

      // then
      expect(valdr.getConstraints()).toEqual(addressConstraints);
    });

    it('should remove multiple constraints', function () {
      // given
      valdr.addConstraints(personConstraints);
      valdr.addConstraints(addressConstraints);

      // when
      valdr.removeConstraints(['Person', 'Address']);


      // then
      expect(valdr.getConstraints()).toEqual({});
    });

    it('should broadcast event when constraints change', function () {
      // given
      valdr.addConstraints(personConstraints);
      spyOn($rootScope, '$broadcast');

      // when
      valdr.removeConstraints('Person');

      // then
      expect($rootScope.$broadcast).toHaveBeenCalledWith(valdrEvents.revalidate);
    });
  });

  describe('validate()', function () {

    it('should not validate if no constraints are defined', function () {
      // when
      var validationResult = valdr.validate('Person', 'firstName', 'Hanueli');

      // then
      expect(validationResult.valid).toBe(true);
      expect(validationResult.violations).toBeUndefined();
      expect(validationResult.validationResults).toBeUndefined();
    });

    it('should validate with correct validator', function () {
      // given
      valdr.addConstraints(personConstraints);
      spyOn(sizeValidator, 'validate').andCallThrough();

      // when
      var validationResult = valdr.validate('Person', 'firstName', 'Hanueli');

      // then
      expect(validationResult.valid).toBe(true);
      expect(validationResult.violations).toBeUndefined();
      expect(validationResult.validationResults.length).toBe(1);
      expect(sizeValidator.validate).toHaveBeenCalled();
    });

    it('should return true if no validator is available for a constraint', function () {
      // given
      valdr.addConstraints({
        'Person': {
          'firstName': {
            'ThereIsNoValidatorForThisConstraint': {}
          }
        }
      });

      // when
      var validationResult = valdr.validate('Person', 'firstName', 'Hanueli');

      // then
      expect(validationResult.valid).toBe(true);
    });

    it('should return invalid state and message if validation fails', function () {
      // given
      valdr.addConstraints(personConstraints);
      spyOn(sizeValidator, 'validate').andCallThrough();

      // when
      var validationResult = valdr.validate('Person', 'firstName', 'Hanueli with a name that is too long');

      // then
      expect(sizeValidator.validate).toHaveBeenCalled();
      expect(validationResult.valid).toBe(false);
      expect(validationResult.violations[0].message).toBe('size');
      expect(validationResult.violations[0].field).toBe('firstName');
      expect(validationResult.violations[0].type).toBe('Person');
      expect(validationResult.violations[0].value).toBe('Hanueli with a name that is too long');
      expect(validationResult.violations[0].max).toBe(10);
      expect(validationResult.violations[0].min).toBe(0);
    });

    it('should return invalid state and message if multiple validations fail', function () {
      // given
      valdr.addConstraints({
        'Person': {
          'firstName': {
            'size': {
              'min': 2,
              'max': 10,
              'message': 'size'
            },
            'required': {
              'message': 'required'
            }
          }
        }
      });
      spyOn(sizeValidator, 'validate').andCallThrough();
      spyOn(requiredValidator, 'validate').andCallThrough();

      // when
      var validationResult = valdr.validate('Person', 'firstName', undefined);

      // then
      expect(sizeValidator.validate).toHaveBeenCalled();
      expect(requiredValidator.validate).toHaveBeenCalled();
      expect(validationResult.valid).toBe(false);
      expect(validationResult.violations[0].message).toBe('required');
    });

  });

  describe('setClasses()', function () {

    it('should add the given classes to the valdrClasses and broadcast an event', function () {
      // given
      spyOn($rootScope, '$broadcast');
      var newClass = 'is-valid';
      expect(valdrClasses.valid).toBe('ng-valid');
      expect(valdrClasses.invalid).toBe('ng-invalid');

      // when
      valdr.setClasses({ valid: newClass });

      // then
      expect($rootScope.$broadcast).toHaveBeenCalledWith(valdrEvents.revalidate);
      expect(valdrClasses.valid).toBe(newClass);
      expect(valdrClasses.invalid).toBe('ng-invalid');

      // cleanup to prevent side-effects
      valdr.setClasses({ valid: 'ng-valid' });
    });

  });
});

describe('valdrProvider', function () {

  it('should load the constraints via $http', function () {
    // given
    var $httpBackend, apiUrl = '/api/validation';

    // when
    module('valdr');
    module(function (valdrProvider) {
      valdrProvider.setConstraintUrl(apiUrl);
    });
    inject(function (_$httpBackend_) {
      $httpBackend = _$httpBackend_;
      $httpBackend.expect('GET', apiUrl).respond(200, {});
    });

    /*jshint unused:false */
    inject(function (valdr) {
      // injecting the valdr service triggers the loading and therefore the GET to the apiUrl
      $httpBackend.flush();

      // then
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
    });
  });

  it('should support to use aliases for constraint names', function () {
    // given
    module('valdr');
    module(function (valdrProvider) {
      valdrProvider.addConstraints({
        'Person': {
          'firstName': {
            'sizeBetween': {
              'min': 0,
              'max': 10
            },
            'secondSizeBetween': {
              'min': 10,
              'max': 20
            }
          }
        }
      });
      valdrProvider.addConstraintAlias('size', 'sizeBetween');
      valdrProvider.addConstraintAlias('size', 'secondSizeBetween');
    });


    inject(function (valdr, valdrSizeValidator) {
      // when
      spyOn(valdrSizeValidator, 'validate').andCallThrough();
      var validationResult = valdr.validate('Person', 'firstName', 'Hanueli');

      // then
      expect(validationResult.valid).toBe(false);
      expect(validationResult.violations).toBeDefined();
      expect(validationResult.violations.length).toBe(1);
      expect(validationResult.validationResults.length).toBe(2);
      expect(valdrSizeValidator.validate).toHaveBeenCalled();
    });
  });

  describe('custom validators', function () {

    it('should allow to add custom validators', function () {
      // given
      module('valdr');

      module(function ($provide) {
        $provide.factory('customValidator', function () {
          return {
            name: 'custom',
            validate: function (value) {
              return value === 'Hanueli';
            }
          };
        });
      });

      module(function (valdrProvider) {
        valdrProvider.addValidator('customValidator');
        valdrProvider.addConstraints({
          'Person': {
            'firstName': {
              'custom': {}
            }
          }
        });
      });

      inject(function (valdr, customValidator) {
        // when
        spyOn(customValidator, 'validate').andCallThrough();
        var validationResult = valdr.validate('Person', 'firstName', 'Hanueli');

        // then
        expect(validationResult.valid).toBe(true);
        expect(validationResult.violations).toBeUndefined();
        expect(customValidator.validate).toHaveBeenCalled();
      });
    });

  });

});