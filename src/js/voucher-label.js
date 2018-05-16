(function() {
    /**
       * @memberof ExpenseManager
       */
    class VoucherLabelElement extends ExpenseManager.ReduxMixin(Polymer.Element) {
      static get is() {
        return 'voucher-label';
      }
      
      static get properties() {
        return {
          bgColor: {
            type: String,
            value: "lightgreen"
          }
        }
      }
    }
      
    customElements.define(VoucherLabelElement.is, VoucherLabelElement);
      
    /**
       * @namespace ExpenseManager
       */
    window.ExpenseManager = window.ExpenseManager || {};
    ExpenseManager.VoucherLabelElement = VoucherLabelElement;
  })();
      
      