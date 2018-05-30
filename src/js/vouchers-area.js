
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
          observer: '_voucherChanged',
        },
         validList: {
           type: Boolean,
           statePath: 'transaction.validTrx',
           observer: '_voucherChanged'
         },
         addAllowed: {
           type: Boolean,
           value: false
         },
         transList: {
           statePath: 'transaction.array_example'
         },
         listExample: {
           type: Array,
           statePath: 'transaction.array_example',
          //  value: () => [
          //    {id: 0},
          //    {id: 1},
          //    {id: 2},
          //    {id: 3},
          //    {id: 4},
          //    {id: 5},
          //    {id: 6},
          //  ]
          observer: '_listRefreshed'
         },
         remainingAmount: {
           type: String,
           statePath: 'transaction.remaining'
         },
         swipeable: {
           type: String,
           computed: 'swipeableOrNot(item)'
         }
      };
    }

    getClass(id){
      if (this.listVouchers.length==1)
        return `disable-swipe`;
    }
    swipeableOrNot(id){
      if(id==1)
        return"disable-swipe";
      else
        return "";
      
    }
    _voucherChanged(){
      // alert('!!'+)
      if(this.validList && this.remainingAmount>0)
        this.addAllowed = true
      else
        this.addAllowed = false
      
      this._listRefreshed()
    }

    _listRefreshed() {
      console.log(this.$.swiper.children) //.alertt();
      var divs = this.$.swiper.children
      for (var i=0; i<divs.length-1; i++){
        divs[i].style.display='block'
      }
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

    // followup swipe-action..
    _deleteNode(e) {

    //  this.dispatch('testRemove');

    //   this.push('listExample',
    //     {id: 8}
    // )

    //this.splice('listExample',0,8);
    
    // var $this = this;
    //   setTimeout( () => {
    //     $this.set('listExample', [
    //       {id: 0},
    //       {id: 1},
    //       {id: 2},
    //       {id: 3},
    //       {id: 4},
    //       {id: 5},
    //       {id: 6},
    //     ])
    //   }, 1500)
    

      console.log(e.detail.target);
      console.log('removing element #' + e.detail.target)
      var removed_node = parseInt(e.detail.target.id);
      
      this.dispatch('removeVoucher', removed_node);

      //update TRX first, so voucher area will get validTrx and add + button
      // BUT.. ONLY WHEN THE LAST ONE IS ELIGIBLE!
      var lastVoucher = this.listVouchers.slice(-1)[0]
      if (lastVoucher.voucherEligible)      
        this.dispatch('updateTransactionable', true);

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

