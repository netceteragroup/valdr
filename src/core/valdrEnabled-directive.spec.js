describe('valdrEnabled directive', function () {

  // VARIABLES

  var $scope, $compile, element, valdr, ngModelController, template,
    personConstraints = {
      'Person': {
        'firstName': {
          'required': {
            'message': 'first name is required'
          }
        }
      }
    };

  // TEST UTILITIES

  function compileValdrEnabledTemplate() {
    element = $compile(angular.element(template))($scope);
    $scope.$digest();
    ngModelController = element.find('input').controller('ngModel');
  }

  beforeEach(function () {
    module('valdr');
  });

  beforeEach(inject(function ($rootScope, _$compile_, _valdr_) {
    $compile = _$compile_;
    valdr = _valdr_;

    template =
      '<form valdr-type="Person" valdr-enabled="isValdrEnabled()">' +
        '<input type="text" name="firstName" ng-model="person.firstName">' +
      '</form>';

    $scope = $rootScope.$new();

    $scope.person = { };
    $scope.valdrEnabled = true;
    $scope.isValdrEnabled = function () {
      return $scope.valdrEnabled;
    };

    valdr.addConstraints(personConstraints);
  }));

  // TEST

  it('should validate if valdrEnabled is true', function () {
    // given
    $scope.valdrEnabled = true;

    // when
    compileValdrEnabledTemplate();

    // then
    expect(ngModelController.$valid).toBe(false);
  });

  it('should not validate if valdrEnabled is false', function () {
    // given
    $scope.valdrEnabled = false;

    // when
    compileValdrEnabledTemplate();

    // then
    expect(ngModelController.$valid).toBe(true);
  });

  it('should validate if no expression is provided', function () {
    // given
    template =
      '<form valdr-type="Person" valdr-enabled>' +
        '<input type="text" name="firstName" ng-model="person.firstName">' +
      '</form>';

    // when
    compileValdrEnabledTemplate();

    // then
    expect(ngModelController.$valid).toBe(false);
  });

  it('should remove errors when constraints are removed', function () {
    // given
    compileValdrEnabledTemplate();

    // when
    valdr.removeConstraints('Person');

    // then
    expect(ngModelController.$valid).toBe(true);
  });

  it('should remove errors when valdr gets disabled', function () {
    // given
    compileValdrEnabledTemplate();

    // when
    $scope.$apply(function () {
      $scope.valdrEnabled = false;
    });

    // then
    expect(ngModelController.$valid).toBe(true);
  });

});