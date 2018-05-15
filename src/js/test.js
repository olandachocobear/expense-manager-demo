
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
        }
    };
    }

    /**
     * Closes the dialog.
     */
    _close() {

    this.dispatch('hideInfoDialog');
    }

    /**
     * Check backend to get eligibility
     */
    _checkEligible() {
    //  var ajaxCall =document.querySelector("#radial-button-template");
    this.$.ajax.generateRequest();
    this.$.eligibilityCheck.generateRequest()
    }

    eligibleResponse(result) {
        console.log(result.detail.response);
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

