describe('valdrFormItem directive', function () {

  // VARIABLES

  var $scope, $compile, element, valdr, valdrEvents, valdrClasses, ngModelController, 
    FormController,
    violations = ['violationsArray'],
    validationResults = [{ validator: 'required', valid: true }];

  var inputTemplate =
    '<form name="demoForm">' +
      '<div valdr-type="TestClass">' +
        '<input type="text" name="fieldName" ng-model="myObject.field">' +
      '</div>' +
    '</form>';

  var selectTemplate =
    '<form name="demoForm">' +
      '<div valdr-type="TestClass">' +
        '<select name="fieldName" ng-model="myObject.field">' +
          '<option value></option>' +
          '<option value="1">First</option>' +
          '<option value="2">Second</option>' +
        '</select>' +
      '</div>' +
    '</form>';

  var textareaTemplate =
      '<form name="demoForm">' +
        '<div valdr-type="TestClass">' +
          '<textarea name="fieldName" ng-model="myObject.field">' +
          '</textarea>' +
        '</div>' +
      '</form>';

  var inputWidgetTemplate =
    '<form name="demoForm">' +
      '<div valdr-type="TestClass">' +
        '<section name="fieldName" ng-model="myObject.field" enable-valdr-validation>' +
        '</section>' +
      '</div>' +
    '</form>';

  // TEST UTILITIES

  function compileTemplate(template) {
    element = $compile(angular.element(template))($scope);
    $scope.$digest();
  }

  function compileInputTemplate() {
    compileTemplate(inputTemplate);
    ngModelController = element.find('input').controller('ngModel');
    FormController = element.find('section').controller('form');
  }

  // COMMON SETUP

  beforeEach(function () {
    module('valdr');

    /**
     * Mock the valdr to always return 'true' when the value equals the string 'valid'.
     */
    module(function ($provide) {
      $provide.value('valdr', {
        validate: function (typeName, fieldName, value) {
          return {
            valid: value === 'valid',
            violations: violations,
            validationResults: validationResults
          };
        }
      });
    });
  });

  beforeEach(inject(function ($rootScope, _$compile_, _valdr_, _valdrEvents_, _valdrClasses_) {
    $compile = _$compile_;
    $scope = $rootScope.$new();
    $scope.myObject = { field: 'fieldValue' };
    valdr = _valdr_;
    valdrEvents = _valdrEvents_;
    valdrClasses = _valdrClasses_;
  }));

  // COMMON TESTS

  function runFormItemCommonTests() {
    it('should set the validity to false on ngModelController if validation fails', function () {
      // when
      $scope.$apply(function () {
        $scope.myObject.field = 'invalid';
      });

      // then
      expect(ngModelController.$valid).toBe(false);
      expect(ngModelController.valdrViolations).toBe(violations);
      expect(ngModelController.$validators.valdr).toBeDefined();
    });

    it('should set the validity to true on ngModelController if validation is ok', function () {
      // when
      $scope.$apply(function () {
        $scope.myObject.field = 'valid';
      });

      // then
      expect(ngModelController.$valid).toBe(true);
      expect(ngModelController.valdrViolations).toBe(violations);
    });

    it('should register in valdrFormGroup', function () {
      // given
      var formGroupTemplate =
        '<form name="demoForm" valdr-type="TestClass" valdr-form-group>' +
            '<input type="text" name="fieldName" ng-model="myObject.field">' +
        '</form>';
      compileTemplate(formGroupTemplate);

      // when
      $scope.$apply(function () {
        $scope.myObject.field = 'invalid';
      });

      // then
      expect(element.hasClass(valdrClasses.invalid)).toBe(true);
    });

    it('should unregister from valdrFormGroup on $destroy', function () {
      // given
      var formGroupTemplate =
        '<form name="demoForm" valdr-type="TestClass" valdr-form-group>' +
          '<input type="text" name="fieldName" ng-model="myObject.field">' +
        '</form>';
      compileTemplate(formGroupTemplate);
      $scope.$apply(function () {
        $scope.myObject.field = 'invalid';
      });

      // when
      $scope.$broadcast('$destroy');
      $scope.$digest();

      // then
      expect(element.hasClass(valdrClasses.invalid)).toBe(false);
    });

    /*it('should handle constraint changed events', function () {
      // given
      spyOn(valdr, 'validate').andCallThrough();
      ngModelController.$viewValue = 'viewValue';
      
      // when
      $scope.$broadcast(valdrEvents.revalidate);

      var getOtherModelValuesOnForm = function(criteria){
        var otherModelValuesOnForm = {};
        for(var key in FormController){
          if(key[0] !== '$' && key !== ngModelController.$name){
            otherModelValuesOnForm[key] = FormController[key];
          }
        }
      }

      // then
      expect(valdr.validate).toHaveBeenCalledWith(jasmine.any(String), 'fieldName', ngModelController.$modelValue, getOtherModelValuesOnForm);
    });*/
  }

  describe('on input fields', function () {

    beforeEach(function () {
      compileInputTemplate();
    });

    runFormItemCommonTests();

    it('should log warning if no field name is provided on the input', function () {
      // given
      spyOn(console, 'warn');
      var invalidInput =
        '<form name="demoForm">' +
          '<div valdr-type="TestClass">' +
            '<input type="text" ng-model="myObject.field">' +
          '</div>' +
        '</form>';

      // when
      $compile(angular.element(invalidInput))($scope);

      // then
      expect(console.warn).toHaveBeenCalledWith('Form element with ID "undefined" is not bound to a field name.');
    });

    it('should NOT log warning if no field name is provided on the input but valdr is disabled', function () {
      // given
      spyOn(console, 'warn');
      var invalidInput =
        '<form name="demoForm" valdr-enabled="false">' +
        '  <div valdr-type="TestClass">' +
        '    <input type="text" ng-model="myObject.field">' +
        '  </div>' +
        '</form>';

      // when
      compileTemplate(invalidInput);

      // then
      expect(console.warn).not.toHaveBeenCalled();
    });

    it('should NOT use valdr validation if valdr-no-validate is set', function () {
      // given
      var noValdrValidationInput =
        '<form name="demoForm">' +
          '<div valdr-type="TestClass">' +
            '<input type="text" name="fieldName" ng-model="myObject.field" valdr-no-validate>' +
          '</div>' +
        '</form>';

      // when
      compileTemplate(noValdrValidationInput);
      ngModelController = element.find('input').controller('ngModel');

      // then
      expect(ngModelController.$validators.valdr).toBeUndefined();
    });
  });

  describe('on select elements', function () {

    beforeEach(function () {
      compileTemplate(selectTemplate);
      ngModelController = element.find('select').controller('ngModel');
      FormController = element.find('section').controller('form');
    });

    runFormItemCommonTests();

  });


  describe('on textarea elements', function () {

    beforeEach(function () {
      compileTemplate(textareaTemplate);
      ngModelController = element.find('textarea').controller('ngModel');
      FormController = element.find('section').controller('form');
    });

    runFormItemCommonTests();

  });

  describe('on explicitly enabled elements', function () {

    beforeEach(function () {
      compileTemplate(inputWidgetTemplate);
      ngModelController = element.find('section').controller('ngModel');
      FormController = element.find('section').controller('form');
    });

    runFormItemCommonTests();

  });

});
