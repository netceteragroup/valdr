/**
 * This directive adds the validity state to a form group element surrounding valdr validated input fields.
 * If valdr-messages is loaded, it also adds the validation messages as last element to the element this this
 * directive is applied on.
 */
var valdrFormGroupDirectiveDefinition =
  ['valdrClasses', 'valdrConfig', function (valdrClasses, valdrConfig) {
    return  {
      restrict: 'EA',
      link: function (scope, element) {
        if (valdrConfig.addFormGroupClass) {
          element.addClass(valdrClasses.formGroup);
        }
      },
      controller: ['$scope', '$element', function ($scope, $element) {

        var formItems = [],
          messageElements = {};

        /**
         * Checks the state of all valdr validated form items below this element.
         * @returns {Object} an object containing the states of all form items in this form group
         */
        var getFormGroupState = function () {

          var formGroupState = {
            // true if an item in this form group is currently dirty, touched and invalid
            invalidDirtyTouchedGroup: false,
            // true if all form items in this group are currently valid
            valid: true,
            // contains the validity states of all form items in this group
            itemStates: []
          };

          angular.forEach(formItems, function (formItem) {
            if (formItem.$touched && formItem.$dirty && formItem.$invalid) {
              formGroupState.invalidDirtyTouchedGroup = true;
            }

            if (formItem.$invalid) {
              formGroupState.valid = false;
            }

            var itemState = {
              name: formItem.$name,
              touched: formItem.$touched,
              dirty: formItem.$dirty,
              valid: formItem.$valid
            };

            formGroupState.itemStates.push(itemState);
          });

          return formGroupState;
        };

        /**
         * Updates the classes on this element and the valdr message elements based on the validity states
         * of the items in this form group.
         * @param formGroupState the current state of this form group and its items
         */
        var updateClasses = function (formGroupState) {
          // form group state
          $element.toggleClass(valdrClasses.invalidDirtyTouchedGroup, formGroupState.invalidDirtyTouchedGroup);
          $element.toggleClass(valdrClasses.valid, formGroupState.valid);
          $element.toggleClass(valdrClasses.invalid, !formGroupState.valid);

          // valdr message states
          angular.forEach(formGroupState.itemStates, function (itemState) {
            var messageElement = messageElements[itemState.name];
            if (messageElement) {
              messageElement.toggleClass(valdrClasses.valid, itemState.valid);
              messageElement.toggleClass(valdrClasses.invalid, !itemState.valid);
              messageElement.toggleClass(valdrClasses.dirty, itemState.dirty);
              messageElement.toggleClass(valdrClasses.pristine, !itemState.dirty);
              messageElement.toggleClass(valdrClasses.touched, itemState.touched);
              messageElement.toggleClass(valdrClasses.untouched, !itemState.touched);
            }
          });
        };

        $scope.$watch(getFormGroupState, updateClasses, true);

        this.addFormItem = function (ngModelController) {
          formItems.push(ngModelController);
        };

        this.removeFormItem = function (ngModelController) {
          var index = formItems.indexOf(ngModelController);
          if (index >= 0) {
            formItems.splice(index, 1);
          }
        };

        this.addMessageElement = function (ngModelController, messageElement) {
          $element.append(messageElement);
          messageElements[ngModelController.$name] = messageElement;
        };

        this.removeMessageElement = function (ngModelController) {
          if (messageElements[ngModelController.$name]) {
            messageElements[ngModelController.$name].remove();
            delete messageElements[ngModelController.$name];
          }
        };

      }]
    };
  }];

angular.module('valdr')
  .directive('valdrFormGroup', valdrFormGroupDirectiveDefinition);
