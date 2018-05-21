(function() {
  /**
     * @memberof ExpenseManager
     */
  class VoucherEntryElement extends Polymer.MutableData(ExpenseManager.ReduxMixin(Polymer.Element)) {
    static get is() {
      return 'voucher-entry';
    }
    
    static get properties() {
      return {
        voucher: {
          type: Object,
          notify: true
        },
        newVoucher: {
          type: Object,
          value() {
            return {
              vId: 0,
              uniqueCode: '            '
            };
          }
        },
        vouchers: {
          type: Array,
          statePath: 'vouchers.vouchers'
        /*   
            value() {
                    
            return [
              {
                'uniqueCode': '156712345672',
                'voucherType': 'Go-deals 25k',
                'voucherDetail': '',
                'voucherAmount': ''
              },
              {
                'uniqueCode': '121287366128',
                'voucherType': 'Go-deals 25k',
                'voucherDetail': '',
                'voucherAmount': ''
              }
            ];
          }
        */
        }
      };
    }
    
    // followup swipe-action..
    _deleteNode(e) {
      console.log(e);

      //update TRX first, so voucher area will get validTrx and add + button
      this.dispatch('updateTransactionable', true)
      this.dispatch('removeVoucher', this.voucher.id);

    }
    // 
    
  }
    
  customElements.define(VoucherEntryElement.is, VoucherEntryElement);
    
  /**
     * @namespace ExpenseManager
     */
  window.ExpenseManager = window.ExpenseManager || {};
  ExpenseManager.VoucherEntryElement = VoucherEntryElement;
})();
    
    