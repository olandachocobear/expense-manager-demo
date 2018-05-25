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
        currentVoucher: {
          type: Object,
        },
        userDetail: {
          type: Object,
          statePath: 'user.data'
        },
        trxAmount: {
          type: String,
          statePath: 'vouchers.trxAmount',
          observer: '_amountChanged'
        },
        bodyRequest: {
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
          value: () => constant.url.dev.eligible_cek
        },
        remaining: {
          type: String,
          statePath: 'vouchers.remaining'
        }
      };
    }
   
    delayCheck() {
        //create temporary to be compared
        var curr = this.code;
        
        //update to Store
        this.currentVoucher.uniqueCode = curr;
        this.dispatch ('updateVoucher',this.currentVoucher)

        //launch 'delayed' checker
        var $this = this;
        setTimeout( ()=> {
            $this._compareVoucher(curr)
        }, constant.delay);
    }

    _compareVoucher(val){
        if(val!=this.currentVoucher.uniqueCode)
            console.log('still waiting input..')
        else   {
            this._amountChanged()
            this._checkEligible()
        }
    }

    _amountChanged() {
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
    }
    /**
         * Check backend to get eligibility
         */
    _checkEligible() {
      //  var ajaxCall =document.querySelector("#radial-button-template");
      this.currentVoucher.onCheck = true;
      this.dispatch('updateVoucher', this.currentVoucher);
      this.$.eligibilityCheck.generateRequest();
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
    
    validCode(result) { // result={trsLable:'a',responseCode:0,responseDetailEnglish:'ff'}
      this.currentVoucher.onCheck = false;
      var voucherValue = result.originalAmount-result.remainingAmount;
      this.currentVoucher.voucherType = result.trsLabel; //`Voucher Rp${result.trsValue}`; 
      this.currentVoucher.voucherAmount = result.trsValue;
      /* Checkin out if the amount is smaller than the Voucher */
      // comparison here..

      this.currentVoucher.voucherEligible = true;
      this.dispatch('updateRemaining', this.remaining - result.trsValue);
      this.dispatch('updateVoucher', this.currentVoucher);
      this.dispatch('updateTransactionable', true);
      this._flagVoucherAsValid();
      this.dispatch('updateErrorMsg', result.responseDetailEnglish);
      this.dispatch('updateErrorCode', result.responseCode);
    }
    invalidCode(result) {
      this.currentVoucher.onCheck = false;
      this.currentVoucher.errorMsg = result.responseDetailEnglish;
      this.currentVoucher.errorCode = result.responseCode;
      this.dispatch('updateVoucher', this.currentVoucher);
      this.dispatch('updateTransactionable', false);
      this.dispatch('updateErrorMsg', result.responseDetailEnglish);
      this.dispatch('updateErrorCode', result.responseCode);
    }
    otherError(result) {
      this.currentVoucher.onCheck = false;
      this.currentVoucher.errorMsg = result.responseDetailEnglish;
      this.currentVoucher.errorCode = result.responseCode;
      this.dispatch('updateVoucher', this.currentVoucher);
      this.dispatch('updateTransactionable', false);
      this.dispatch('updateErrorMsg', result.responseDetailEnglish);
      this.dispatch('updateErrorCode', result.responseCode);
    }

    _flagVoucherAsValid() {
      // alert('valid')
      this.currentVoucher.voucherEligible = true;
      console.log(this.currentVoucher);
      this.dispatch('updateVoucher', this.currentVoucher);
    }
     
    onError(e, detail) {
      this.currentVoucher.onCheck = false;
      this.dispatch('updateErrorCode', 66);
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
    
    