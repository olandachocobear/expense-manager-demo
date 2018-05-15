(function() {
  /**
     * @memberof ExpenseManager
     */
  class VoucherEntryElement extends ExpenseManager.ReduxMixin(Polymer.Element) {
    static get is() {
      return 'voucher-entry';
    }
    
    static get properties() {
      return {
        open: {
          type: Boolean,
          statePath: 'uiState.infoDialogVisible',
        },
        vouchers: {
          value() {
                    
            return [
              {
                'uniqueCode': '1567123456',
                'voucherDetail': '',
                'voucherAmount': ''
              },
              {
                'uniqueCode': '12128736612',
                'voucherDetail': '',
                'voucherAmount': ''
              }
            ];
          }
        }
      };
    }
    
    /**
         * Check backend to get eligibility
         */
    _checkEligible() {
      //  var ajaxCall =document.querySelector("#radial-button-template");
      this.$.ajax.generateRequest();
      this.$.eligibilityCheck.generateRequest();
    }
    
    eligibleResponse(result) {
      console.log(result.detail.response);
    }
    
    onError(e, detail) {
      console.log(e);
      console.log(e.target.lastRequest.xhr.status);
      console.log(detail.error); // the error object
      console.log(detail.request.status); // the status code
      console.log(detail.request.statusText); // the error status text
    }
  }
    
  customElements.define(VoucherEntryElement.is, VoucherEntryElement);
    
  /**
     * @namespace ExpenseManager
     */
  window.ExpenseManager = window.ExpenseManager || {};
  ExpenseManager.VoucherEntryElement = VoucherEntryElement;
})();
    
    