
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
            statePath: 'vouchers.validTrx',
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
            statePath: 'vouchers.trxAmount'
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
            statePath: 'vouchers.remaining',
            // observer: '_toggleRemaining'
        },
        displayRemaining: {
            type: Boolean
        }
    };
    }


    /* still NECESSARY to update State, even though already Observe */
    detectChanges (){
        this._amountChanged();
    }
    _amountChanged (){
        this.dispatch('updateTransactionAmount', this.fieldAmount);
    }

    _updateRedeemable (){
        this.redeemable = this.validTrx ? "primary" : "error";
        this.resetable = true
    }

    _updateBodyRequest(){
        this.checkUsr();
        this._toggleRemaining();

        var voucher_arr = [];
        for(var i=0; i<this.trx.vouchers.length; i++){
            voucher_arr.push(this.trx.vouchers[i]['uniqueCode']);
        }
        this.bodyRequest = {
            amount: parseInt(this.trx.trxAmount),
            uniqueCodes: voucher_arr,
            mid: this.userDetail.mid, 
            merchantCode: this.userDetail.merchantCode, 
            tid: this.userDetail.tid,
            transactionDate: new Date(),
            traceNumber: this.trx.trxNumber,
            transactionTypeId: 2
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
        if((this.trx.vouchers.length==1 && this.trx.validTrx) || this.trx.vouchers.length>1)
            this.displayRemaining = true
        else
            this.displayRemaining = false
    }

    eligibleResponse(result) {
        console.log(result.detail.response);

        this.dispatch('addLastTransaction', this.trx);

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
}

customElements.define(TransactionDialogElement.is, TransactionDialogElement);

/**
 * @namespace ExpenseManager
 */
window.ExpenseManager = window.ExpenseManager || {};
ExpenseManager.TransactionDialogElement = TransactionDialogElement;
})();

