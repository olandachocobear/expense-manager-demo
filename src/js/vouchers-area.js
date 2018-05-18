
(function() {
/**
 * @memberof ExpenseManager
 */
  class VouchersAreaElement extends ExpenseManager.ReduxMixin(Polymer.Element) {
    static get is() {
      return 'vouchers-area';
    }

    static get properties() {
      return {
        listVouchers: {
          type: Array,
          statePath: 'vouchers.vouchers',
          observer: '_voucherChanged'
        },
         validList: {
           type: Boolean,
           statePath: 'vouchers.validTrx'
         },
         addAllowed: {
           type: Boolean,
           value: false
         }
      };
    }

    _voucherChanged(){
      // alert('!!'+)
        if(this.listVouchers.length>0 && this.validList){
          this.addAllowed = true
        }
        else
          this.addAllowed = false
    }

    // add new (empty) voucher..
    _add() {
      let vouchers=this.listVouchers;
      // get id of last voucher
      this.dispatch('addVoucher', vouchers[vouchers.length-1]['id']);
      this.dispatch('updateTransactionable', false)
      console.log(this.listVouchers)

      this.addAllowed = false;
    }

    /**
     * Check backend to get eligibility
     */
    _checkEligible() {
      //  var ajaxCall =document.querySelector("#radial-button-template");
      // this.$.ajax.generateRequest();
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

  customElements.define(VouchersAreaElement.is, VouchersAreaElement);

  /**
 * @namespace ExpenseManager
 */
  window.ExpenseManager = window.ExpenseManager || {};
  ExpenseManager.VouchersAreaElement = VouchersAreaElement;
})();

