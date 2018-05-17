
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
        savedVouchers: {
          type: Array,
          statePath: 'vouchers',
          observer: '_updateVoucherList'
        },
        localVouchers: {
          type: Array
        }
      };
    }

    connectedCallback() {
        console.log(this.savedVouchers);
        this.localVouchers = this.savedVouchers;
        console.log(this.localVouchers)
      // console.log(this.allVoucher);
      // this.dispatch('showInfoDialog')
    }

    _updateVoucherList() {
        console.log(savedVouchers)
        console.log(this.savedVouchers)
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

  customElements.define(VouchersAreaElement.is, VouchersAreaElement);

  /**
 * @namespace ExpenseManager
 */
  window.ExpenseManager = window.ExpenseManager || {};
  ExpenseManager.VouchersAreaElement = VouchersAreaElement;
})();

