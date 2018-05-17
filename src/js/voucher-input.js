(function() {
  /**
     * @memberof ExpenseManager
     */
  class VoucherInputElement extends ExpenseManager.ReduxMixin(Polymer.Element) {
    static get is() {
      return 'voucher-input';
    }
    
    static get properties() {
      return {
        codeLength: {
          type: Number
        },
        currentVoucher: {
          type: Object
        },
        completeCode: {
          type: String
        }
      };
    }
    
    /**
         * Check backend to get eligibility
         */
    _checkEligible() {
      console.log(this.currentVoucher);
      //  var ajaxCall =document.querySelector("#radial-button-template");
      
      this.$.eligibilityCheck.generateRequest();
    }
    
    eligibleResponse(result) {
      console.log(result.detail.response);
      this._flagVoucherAsValid(this.currentVoucher);

    }

    _flagVoucherAsValid(voucher) {
      voucher.voucherEligible = true
      this.set('voucher.voucherEligible', true);
      this.dispatch('updateVoucher', voucher)
      this.notifyPath('vouchers.vouchers')
    }
    
    _showValidVoucher() {
      alert('re')
      

    }
    onError(e, detail) {
      console.log(e);
      console.log(e.target.lastRequest.xhr.status);
      console.log(detail.error); // the error object
      console.log(detail.request.status); // the status code
      console.log(detail.request.statusText); // the error status text
    }

    _clearBox(e) {
      e.path[0].value = '';
    }

    _moveIt(e) {
      console.log(e);

      if (e.keyCode == 37) // Left-arrow
      {
        e.path[2].previousSibling.previousElementSibling.focus();
        console.log(e.path[2]);
      } else if (e.keyCode == 39) // Right-arrow
      {
        e.path[2].nextSibling.nextElementSibling.focus(); 
      } 
      else {
        // check if its numeric
        var num_rule = /[0-9]/g;

        if (num_rule.test(e.key)) {
          e.path[0].value = e.key;
          
          var nextEl = e.path[2].nextSibling.nextElementSibling;
          
          if (nextEl.style.display == 'none')
          // hajar Validation link ! 
          {
            var voucherBoxes = e.path[2].nextSibling.parentNode.children;
            e.path[0].blur();
            this._validateVoucher(voucherBoxes);
          } 
          else
            nextEl.focus();
        }
      }
    }

    _validateVoucher(numCollection) {
      var code = '';
    
      for (var i = 0; i < numCollection.length; i++) {
        if (numCollection[i].value != undefined){
          code += numCollection[i].value;
        }
      }
      console.log('voucher to be checked: ' + code);

      this.completeCode = code;
      this.currentVoucher.uniqueCode = code;

      // checking to the Backend
      this._checkEligible();
    }
  }
    
  customElements.define(VoucherInputElement.is, VoucherInputElement);
    
  /**
     * @namespace ExpenseManager
     */
  window.ExpenseManager = window.ExpenseManager || {};
  ExpenseManager.VoucherInputElement = VoucherInputElement;
})();
    
    