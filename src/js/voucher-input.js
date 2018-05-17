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
        //codeLength: 11

        currentVoucher: {
          type: Object,
        }
      }
    };
   
    
    /**
         * Check backend to get eligibility
         */
    _checkEligible() {
      //  var ajaxCall =document.querySelector("#radial-button-template");
      this.currentVoucher.onCheck=true;
      this.dispatch('updateVoucher', this.currentVoucher)
      this.$.eligibilityCheck.generateRequest();
    }
    
    eligibleResponse(result) {
      console.log(result.detail.response);
      this.currentVoucher.onCheck=false;
      this.dispatch('updateVoucher', this.currentVoucher)
      this._flagVoucherAsValid()
    }
    
    _flagVoucherAsValid(){
      // alert('valid')
      this.currentVoucher.voucherEligible=true;
      console.log(this.currentVoucher)
      this.dispatch('updateVoucher', this.currentVoucher)
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

      // checking to the Backend
      this._checkEligible();

      //update to particular Voucher
      this.currentVoucher.uniqueCode=code
    }
  }
    
  customElements.define(VoucherInputElement.is, VoucherInputElement);
    
  /**
     * @namespace ExpenseManager
     */
  window.ExpenseManager = window.ExpenseManager || {};
  ExpenseManager.VoucherInputElement = VoucherInputElement;
})();
    
    