
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
        }
    };
    }

    _updateRedeemable (){
        this.redeemable = this.validTrx ? "primary" : "error";
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
    
        //this.$.processRedeem.generateRequest()
    }

    eligibleResponse(result) {
        console.log(result.detail.response);
        this._close()
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

