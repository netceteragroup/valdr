describe('valdrValidationGroups directive', function () {

  var $scope, $compile, element, ValidationGroupController, rootScope;

  var compileTemplate = function () {
    var e = $compile(angular.element('<div valdr-validation-groups="[\'TestGroup\']"></div>'))($scope);
    $scope.$digest();
    return e;
  };

  beforeEach(module('valdr'));

  beforeEach(inject(function ($rootScope, $controller, _$compile_) {
    $compile = _$compile_;
    $scope = $rootScope.$new();
    rootScope = $rootScope;
    $scope.scopeVariable = ['NestedClass'];
    element = compileTemplate();
    ValidationGroupController = element.controller('valdrValidationGroups');
  }));

  it('should read the validation group from the attribute', function () {
    expect(ValidationGroupController.getValidationGroups()).toEqual(['TestGroup']);
  });

  it('should allow to nest the directive', function () {
    // given
    var e = $compile(angular.element(
            '<div valdr-validation-groups="[\'TestClass\', \'AnotherClass\']">' +
            '<span valdr-validation-groups="scopeVariable"></span>' +
            '</div>'))($scope);

    // when
    var rootController = e.controller('valdrValidationGroups');
    var nestedController = e.find('span').controller('valdrValidationGroups');

    // then
    expect(rootController.getValidationGroups()).toEqual(['TestClass', 'AnotherClass']);
    expect(nestedController.getValidationGroups()).toEqual(['NestedClass']);
  });

  it('should broadcast revalidate when groups change', function () {
    // given
    var e = $compile(angular.element(
            '<div valdr-validation-groups="scopeVariable">' +
            '</div>'))($scope);
    spyOn(rootScope, '$broadcast');

    // when
    e.scope().$apply(function () {
      $scope.scopeVariable = ['ChangedGroup'];
    });

    // then
    expect(rootScope.$broadcast).toHaveBeenCalled();
  });

});
