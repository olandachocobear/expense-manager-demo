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
        voucherList: {
          type: Array,
          
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
        code: {
          type: Object,
          notify: true
        },
        voucherList:{
          type: Array,

        },
        vouchers: {
          type: Array,
          // notify: true,
          statePath: 'vouchers.vouchers',
          observer: '_listenToUpdate',
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
        },
        showRedBar: {
          type: Boolean,
          statePath: 'vouchers.vouchers'
        }
      };
    }
    connectedCallback(){
      console.log(this.voucherList);
    }
    
    _listenToUpdate (p1, p2) {
      console.log('Change is the only thing that\'s constant.')
      console.log(p1)
      console.log(p2)

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
    
    