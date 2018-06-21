(function() {
  /**
     * @memberof ExpenseManager
     */
  class StandardInputElement extends ExpenseManager.ReduxMixin(Polymer.Element) {
    static get is() {
      return 'standard-input';
    }
    
    static get properties() {
      return {
        // codeLength: 11
        url: {
          type: String
        },
        readOnly: {
          type: Boolean
        },
        currentVoucher: {
          type: Object,
        },
        userDetail: {
          type: Object,
          statePath: 'user.data'
        },
        userSession: {
          type: String,
          statePath: 'user.session.jsess'
        },
        trxAmount: {
          type: String,
          statePath: 'transaction.trxAmount',
        //   observer: '_amountChanged'
        },
        bodyRequest: {
          type: Object,
        },
        header: {
          type: Object,
        },
        voucherCode: {
          type: String
        },
        trxId: {
          type: String,
          statePath: 'vouchers.trxNumber'
        },
        ironUrl: {
          value: () => constant.url.staging.eligible_cek
        },
        remaining: {
          type: String,
          statePath: 'transaction.remaining'
        },
        wholeVoucher: {
          type: Array,
          statePath: 'vouchers.vouchers'
        },
        showReload: {
          type: Boolean,
          observer: 'showReloader'
        }
      };
    }
   
    delayCheck() {
        //create temporary to be compared
        var curr = this.code;

        //check if amount is still empty
        if (this.trxAmount=='')
          this.dispatch('updateTransactionAmount', 0);
          
        if(curr){
            //update to Store
            this.currentVoucher.uniqueCode = curr;
            this.dispatch ('updateVoucher',this.currentVoucher)

            //launch 'delayed' checker
            var $this = this;
            setTimeout( ()=> {

                //hide the 'reload' button
                this.currentVoucher.unchecked = false;
                $this._compareVoucher(curr)
            }, constant.delay);
        }
    }

    _compareVoucher(val){
        if(val!=this.currentVoucher.uniqueCode)
            console.log('still waiting input..')
        else   {
            this.updateIronParams()
            this._checkEligible()
        }
    }

    showReloader() {
      if (!this.currentVoucher.unchecked && this.currentVoucher.uniqueCode != '')
        this._checkEligible();
    }

    _amountChanged() {
        this.updateIronParams();
    }

    updateIronParams(){
        this.bodyRequest = {
            amount: parseInt(this.trxAmount),
            uniqueCode: this.code,
            mid: this.userDetail.mid, 
            merchantCode: this.userDetail.merchantCode, 
            tid: this.userDetail.tid,
            transactionDate: new Date(),
            traceNumber: this.trxId,
            transactionTypeId: 2
        };

        this.header = {
            "Content-Type": "application/json",  
            "Authorization": "someAuthorizationToken",
            "JSESSIONID": this.userSession
        }
    }
    /**
         * Check backend to get eligibility
         */
    _checkEligible() {
      //  var ajaxCall =document.querySelector("#radial-button-template");
      // if(this.trxAmount!='' && this.trxAmount>0) {
        this.currentVoucher.onCheck = true;
        this.dispatch('updateVoucher', this.currentVoucher);
        this.$.eligibilityCheck.generateRequest();
      // }
    }
    
    eligibleResponse(result) {
      console.log(result.detail.response);

      var res = result.detail.response;
      if (res.responseCode == '00') {
        this.validCode(res);
      } else if (res.responseCode == 'B2') {
        this.invalidCode(res);
      } else 
        {this.otherError(res)};
    }
    
    checkIfExisted() {
      var {uniqueCode} = this.currentVoucher;
      var currentList = this.wholeVoucher;
      
      var count= currentList.
                filter(vouch => vouch.uniqueCode==uniqueCode).
                length;
      
      return count;
    }

    calcRemaining() {
      var vouchers = this.wholeVoucher;
      var discount_amount = 0;
      for (var i = 0; i<vouchers.length; i++){
          discount_amount += vouchers[i].voucherAmount;
      }
      return (this.trxAmount-discount_amount);
    }
    validCode(result) { // result={trsLable:'a',responseCode:0,responseDetailEnglish:'ff'}
      this.currentVoucher.onCheck = false;
      var voucherValue = result.originalAmount-result.remainingAmount;
      this.currentVoucher.voucherType = result.trsLabel; //`Voucher Rp${result.trsValue}`; 
      
      /* Checking if it was a Coupon (rewardType: 2) */
      if (result.trsRewardTypeId!=2)
        this.currentVoucher.voucherAmount = result.trsValue
      else 
        this.currentVoucher.voucherAmount = 0;
      
      /*
        Checking if it has inputted before..
       */
      if (this.checkIfExisted()>1){ // val should be only 1 (its own entry)
        // reject the new voucher
        var new_result = result
        new_result.responseCode = Math.random() * 1000;
        new_result.responseDetailEnglish = "Voucher telah di-entry untuk transaksi ini."
        this.invalidCode(new_result);
        return;
        // this.invalidCode({new={...}})
      }
      
      /* 
        Checkin out if the amount is smaller than the Voucher. 
      
      if(this.calcRemaining()>0){
        var new_result = result
        new_result.responseCode = Math.random() * 1000;
        new_result.responseDetailEnglish = "Discount exceed remaini"
        this.invalidCode(new_result);
      }
      */

      this.dispatch('updateTransactionable', true);
      this._flagVoucherAsValid();
      this.dispatch('updateErrorMsg', result.responseDetailEnglish);
      this.dispatch('updateErrorCode', result.responseCode);
    }
    invalidCode(result) {
      this.currentVoucher.onCheck = false;
      this.currentVoucher.errorMsg = result.responseDetailEnglish;
      this.currentVoucher.errorCode = result.responseCode;
      //add shake
      this.currentVoucher.shake = true;
      this.dispatch('updateVoucher', this.currentVoucher);
      this.dispatch('updateTransactionable', false);
      

      //new Popup alert for errors..
      /// but check if it has reached certain length 
      if (this.currentVoucher.uniqueCode.length == 12){
        this.dispatch('changeTitleAlert', "Whoops, something's wrong..");
        this.dispatch('changeHeaderAlert', "Error Msg:");
        this.dispatch('changeMessageAlert', result.responseDetailEnglish);
        this.dispatch('changeAlertIcon', 'sad.png');
        this.dispatch('changeAlertButton', 'Close');
        this.dispatch('showAlert');
      }
      else {
        this.dispatch('updateErrorMsg', 'Panjang voucher tidak valid.');
        this.dispatch('updateErrorCode', result.responseCode);
      }

    }
    otherError(result) {
      this.currentVoucher.onCheck = false;
      this.currentVoucher.errorMsg = result.responseDetailEnglish;
      this.currentVoucher.errorCode = result.responseCode;
      //add shake
      this.currentVoucher.shake = true;
      this.dispatch('updateVoucher', this.currentVoucher);
      this.dispatch('updateTransactionable', false);
      this.dispatch('updateErrorMsg', result.responseDetailEnglish);
      this.dispatch('updateErrorCode', result.responseCode);

      //new Popup alert for errors..
      this.dispatch('changeTitleAlert', "Whoops, something's wrong..");
      this.dispatch('changeHeaderAlert', "Error Msg:");
      this.dispatch('changeMessageAlert', result.responseDetailEnglish);
      this.dispatch('changeAlertIcon', 'sad.png');      
      this.dispatch('changeAlertButton', 'Close');
      this.dispatch('showAlert');
    }

    _flagVoucherAsValid() {
      // alert('valid')
      this.currentVoucher.voucherEligible = true;
      console.log(this.currentVoucher);
      this.dispatch('updateVoucher', this.currentVoucher);
    }
     
    onError(e, detail) {
      this.currentVoucher.onCheck = false;
      this.currentVoucher.unchecked = true;
      // remember to update the state, to remoce preload icon
      var $this = this;
      setTimeout( () => {
          $this.dispatch('updateVoucher', this.currentVoucher)
      }, 1000);
      
      this.dispatch('updateErrorCode', 66);

      //adding attempt of connection..
      if(this.connectionAttempt==3){
        this.dispatch('showAlert');
        this.dispatch('resetConnAttempt');
      }
      else {
        this.dispatch('increaseConnAttempt');
      }

      console.log(e);
      console.log(e.target.lastRequest.xhr.status);
      console.log(detail.error); // the error object
      console.log(detail.request.status); // the status code
      console.log(detail.request.statusText); // the error status text
    }

    _clearBox(e) {
      e.path[0].value = '';
    }

    _moveIt(e) {
      // console.log(e);

      if (e.keyCode == 37) // Left-arrow
      {
        e.path[2].previousSibling.previousElementSibling.focus();
        console.log(e.path[2]);
      } else if (e.keyCode == 39) // Right-arrow
      {
        e.path[2].nextSibling.nextElementSibling.focus(); 
      } else {
        // check if its numeric
        var num_rule = /[0-9]/g;

        if (num_rule.test(e.key)) {
          e.path[0].value = e.key;
          
          var nextEl = e.path[2].nextSibling.nextElementSibling;
          var voucherBoxes = e.path[2].nextSibling.parentNode.children;
            
          if (nextEl.style.display == 'none')
          // hajar Validation link ! 
          {
            e.path[0].blur();
            this.combineNumbers(voucherBoxes);
            this._validateVoucher(voucherBoxes);
          } else {this.combineNumbers(voucherBoxes); nextEl.focus();
          }
        }
      }
    }

    checkUsr() {
      var usr = this.userDetail;
      if (usr.mid == undefined)
        usr['mid']="000001121530000";
      if (usr.merchantCode == undefined)
        usr['merchantCode']="00000066666";
      if (usr.tid == undefined)
        usr['tid']="11120860";
    }
    
    combineNumbers(numCollection) {
      var code = '';
    
      for (var i = 0; i < numCollection.length; i++) {
        if (numCollection[i].value != undefined) {
          code += numCollection[i].value;
        }
      }
      // update to particular Voucher
      this.currentVoucher.uniqueCode = code;
      this.voucherCode = code;

      this._amountChanged();
    }

    _validateVoucher(numCollection) {
      console.log('voucher to be checked: ' + numCollection); // this.currentVoucher.uniqueCode

      // checking to the Backend
      this._checkEligible();
    }
  }
    
  customElements.define(StandardInputElement.is, StandardInputElement);
    
  /**
     * @namespace ExpenseManager
     */
  window.ExpenseManager = window.ExpenseManager || {};
  ExpenseManager.StandardInputElement = StandardInputElement;
})();
    
    