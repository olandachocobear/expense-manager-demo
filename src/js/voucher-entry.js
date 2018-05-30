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
        // inherited from parent
        voucher: {
          type: Object,
          notify: true,
          observer: 'updateShaker'
        },
        shaking: {
          type: Boolean,
          value: false
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
        }
      };
    }
    
    _removeNode(e){
      if(this.vouchers.length==1)
        this._shakeMomentarily()
      else {
        console.log('removing entry #: ' + e.target.dataId)
        this.dispatch('updateTransactionable', true);
        this.dispatch('removeVoucher', e.target.dataId);
      }
    }

    updateShaker() {
      if(this.voucher.shake)
        this._shakeMomentarily()
    }

    _shakeMomentarily() {
      this.shaking = true;
      this.voucher.shake = true;
      
      var $this = this;
      setTimeout( () => {
        this.shaking = false;
        this.voucher.shake = false;
        
        this.dispatch('updateVoucher',$this.voucher);
      }, 300);
    }
    
    
  }
    
  customElements.define(VoucherEntryElement.is, VoucherEntryElement);
    
  /**
     * @namespace ExpenseManager
     */
  window.ExpenseManager = window.ExpenseManager || {};
  ExpenseManager.VoucherEntryElement = VoucherEntryElement;
})();
    
    