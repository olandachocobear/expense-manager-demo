
(function() {
/**
 * @memberof ExpenseManager
 */
class TransactionDialogElement extends ExpenseManager.ReduxMixin(Polymer.Element) {
    static get is() {
    return 'transaction-dialog';
    }

    static get properties() {
    return {
        /**
         * True if the dialog is opened.
         */
        open: {
            type: Boolean,
            statePath: 'uiState.infoDialogVisible'
        },
        validTrx: {
            type: Boolean,
            statePath: 'transaction.validTrx',
            observer: '_updateRedeemable'
        },
        redeemable: {
            type: String
        },
        resetable:{
            type: Boolean,
            value: false
        },
        fieldAmount:{
            // type: String,
            // observer: '_amountChanged'
            //statePath: 'transaction.trxAmount'
        },
        ironUrl: {
            type: String,
            value: () => constant.url.dev.burn_vouch
        },
        trx: {
            type: Object,
            statePath: 'vouchers',
            observer: '_updateBodyRequest'
        },
        userDetail: {
            type: Object,
            statePath: 'user.data'
        },
        remainingAmount: {
            type: String,
            statePath: 'transaction.remaining',
            // observer: '_toggleRemaining'
        },
        displayRemaining: {
            type: Boolean
        },
        storeName: {
            type: String,
            statePath: 'user.data.storeName'
        },
        merchantName: {
            type: String,
            statePath: 'user.data.merchantName'
        },
        username: {
            type: String,
            statePath: 'user.data.username'
        },
        trans_detail: {
            type: Object,
            statePath: 'transaction'
        }
    };
    }

    _strip(num){
        return(numeral(num)._value)
    }
    /* still NECESSARY to update State, even though already Observe */
    detectChanges (){
        this._amountChanged();
    }
    _amountChanged (){
        var remaining = this._calcRemaining();
        this.dispatch('updateTransactionAmount', this._strip(this.fieldAmount));
        this.dispatch('updateRemaining', remaining);
    }

    _calcRemaining(){
        var vouchers = this.trx.vouchers;
        var discount_amount = 0;
        for (var i = 0; i<vouchers.length; i++){
            discount_amount += vouchers[i].voucherAmount;
        }
        return parseInt(this._strip(this.fieldAmount))-discount_amount;
    }

    _updateRedeemable (){
        this.redeemable = this.validTrx ? "primary" : "error";
        this.resetable = true
    }

    _updateBodyRequest(){
        // remaining Logic (recalculate,etc.)
        this._toggleRemaining();
        
        var voucher_arr = [];
        var discount_amount = 0;

        if(this.trx.vouchers[0]['voucherAmount']>0){
            for(var i=0; i<this.trx.vouchers.length; i++){
                voucher_arr.push(this.trx.vouchers[i]['uniqueCode']);
                discount_amount += this.trx.vouchers[i]['voucherAmount'];
            }
            var current_remaining = parseInt(this._strip(this.fieldAmount))-discount_amount
        }

        this.dispatch('updateRemaining', current_remaining)
        
        this.bodyRequest = {
            amount: parseInt(this._strip(this.fieldAmount)),
            uniqueCodes: voucher_arr,
            mid: this.userDetail.mid, 
            merchantCode: this.userDetail.merchantCode, 
            tid: this.userDetail.tid,
            transactionDate: new Date(),
            traceNumber: this.trx.trxNumber,
            transactionTypeId: 2,
            username: this.userDetail.username
          };

    } 
    /**
     * Closes the dialog.
     */
    _close() {

        this.dispatch('hideInfoDialog');
    }

    /**
     * Send Voucher(s) to backend to be burned
     */
    _burn() {
        // this.dispatch('showReceipt');
        this.$.processRedeem.generateRequest()
    }

    _reset() {
        this.dispatch('resetForm');
    }

    checkUsr() {
        //will update state `user`

        var usr = this.userDetail;
        if (usr.mid == undefined)
          usr['mid']="000001121530000";
        if (usr.merchantCode == undefined)
          usr['merchantCode']="000000666667";
        if (usr.tid == undefined)
          usr['tid']="11120860";
        if (usr.storeName == undefined) 
          usr['storeName']="Alfamart Pasaraya";
      }

    _toggleRemaining() {
        if((this.trx.vouchers.length==1 && this.validTrx) || this.trx.vouchers.length>1)
            this.displayRemaining = true
        else
            this.displayRemaining = false
    }

    eligibleResponse(result) {
        console.log(result.detail.response);

        this.createCache();

        //this._close()
        this.dispatch('updateErrorMsg', result.detail.responseDetailBahasa);
        this.dispatch('updateErrorCode', 200);
        
        this.dispatch('showReceipt');
        
        this._reset();
    }

    onError(e,detail){
        console.log(e)
        console.log(e.target.lastRequest.xhr.status)
        console.log(detail.error); //the error object
        console.log(detail.request.status); //the status code
        console.log(detail.request.statusText);  //the error status text
    }

    createCache(){
        var {trxNumber,trxAmount,remaining} = this.trans_detail
        var {vouchers} = this.trx
        
        var cachedTrx = {trxNumber,trxAmount,remaining,vouchers}

        console.log(cachedTrx)
        this.dispatch('addLastTransaction', cachedTrx);
        this.dispatch('showReceipt')
    }
}

customElements.define(TransactionDialogElement.is, TransactionDialogElement);

/**
 * @namespace ExpenseManager
 */
window.ExpenseManager = window.ExpenseManager || {};
ExpenseManager.TransactionDialogElement = TransactionDialogElement;
})();

