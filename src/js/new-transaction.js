function _logOut(e){
    // window.location.href='https://evoucher-dev.kartuku.co.id/loyalty-web/#/login'
    window.location.replace(`${CONST.LOYALTY_HOME}#login`);
    // window.location.assign("https://www.google.com");
    (e)=>e.stopPropagation()
}
(function() {
/**
 * @memberof ExpenseManager
 */
class NewTransactionLayout extends ExpenseManager.ReduxMixin(Polymer.Element) {
    static get is() {
    return 'new-transaction-layout';
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
        srcAmount: {
            type: String,
            statePath: 'transaction.trxAmount',
            observer: '_reflectNewAmount'
        },
        userSession: {
            type: String,
            statePath: 'user.session.jsess'
        },
        ironUrl: {
            type: String,
            value: () => `${CONST.ROOT}${CONST.URL.BURN_VOUCH}` 
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
            observer: 'refreshRemainingText'
        },
        remainingTxt: {
            type: String
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
        },
        lastReceipt: {
            type: String,
            statePath: 'uiState.lastReceiptNo',
            observer: 'createCache'
        },
        link1 : {
            value: () => CONST.NAV.LINK_1
        },
        link2 : {
            value: () => CONST.NAV.LINK_2
        },
        label: {
            value: () => CONST.LABEL
        },
        header: {
            type: Object
        },
        marketingMsg: {
            type: String
        },
        msgBuffer: {
            type: String
        }        
    };
    }

    ready() {
        super.ready();
        
        this.marketingMsg = "";
        this.msgBuffer = "";
        this.header = {
            "Content-Type": "application/json",
            "JSESSIONID": this.userSession
        }
    }
    refreshRemainingText(){
        this.remainingTxt = numeral(this.remainingAmount).format(0.0)
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

        /*  barrier to limit remaining amount to minimum of 0 (not minus) */
        if(remaining < 0){
            console.log('limit amount 0 broken')
            remaining = 0;
        }

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
        //add remainig showing here also
        
        this._toggleRemaining()
    }

    _paddingize(value,length){
      return ("00" + value).slice(-length);
    }
    _convertDate(tgl) {
        //complete format to match Backend DD-MM-YYYYTHH:MM:SS.mmmZ
        return `${this._paddingize(tgl.getDate(),2)}-${this._paddingize(tgl.getMonth()+1,2)}-${tgl.getFullYear()}T${tgl.getHours()}:${tgl.getMinutes()}:00.000Z`;
    }

    _updateBodyRequest(){
        // remaining Logic (recalculate,etc.)
        
        this._toggleRemaining();
  
        var voucher_arr = [];
        var discount_amount = 0;
  
        if(this.trx.vouchers[0]['voucherAmount'] >= 0){ //have at least 1 valid
            for(var i=0; i<this.trx.vouchers.length; i++){
                // remember to only update body with Eligible vouchers..
                
                // =============================================================
                //  OLD Params: [uniqueCode, uniqueCode, uniqueCode]
                // =============================================================
                /*
                if(this.trx.vouchers[i]['voucherEligible']){
                    voucher_arr.push(this.trx.vouchers[i]['uniqueCode']);
                    discount_amount += this.trx.vouchers[i]['voucherAmount'];
                }
                */

                // =============================================================
                // NEW Params: [{code, hash}, {code, hash}]
                // =============================================================
                if(this.trx.vouchers[i]['voucherEligible']){
                    var voucher = {}
                    voucher.code = this.trx.vouchers[i]['uniqueCode']
                    voucher.hash =this.trx.vouchers[i]['voucherHash']
                    voucher_arr.push(voucher);
                    
                    discount_amount += this.trx.vouchers[i]['voucherAmount'];
                }
            }
        }

        var current_remaining = parseInt(this._strip(this.fieldAmount))-discount_amount
            
        /*  barrier to limit remaining amount to minimum of 0 (not minus) */
        if(current_remaining < 0){
            console.log('limit amount 0 broken')
            current_remaining = 0;
        }

        this.dispatch('updateRemaining', current_remaining)
        
        this.bodyRequest = {
            amount: parseInt(this._strip(this.fieldAmount)),
            uniqueCodes: voucher_arr,
            mid: this.userDetail.mid, 
            merchantCode: this.userDetail.merchantCode, 
            tid: this.userDetail.tid,
            transactionDate: this._convertDate(new Date()),
            traceNumber: this.trans_detail.trxNumber,
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
        this.dispatch('resetTrx');
        this.fieldAmount = "0";
        console.log(this.trx);
        // this.createCache();
        // this.dispatch('showReceipt')
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

    styleMsg(className) {
        var currentMsg = this.msgBuffer;

        var newMsg = `<div class=${className}>${currentMsg}</div>`;

        this.marketingMsg += newMsg;
        this.msgBuffer = '';
    }

    parseMarketingMsg(msg) {
        var specialChars = ["|", "^", '[', ']', '{'];

        for(i=0; i<msg.length; i++){
            if (specialChars.indexOf(msg[i]) >= 0)
            {
                switch (msg[i]) {
                    case '|':
                        styleMsg("small-left");
                        break;
                    case '|':
                        styleMsg("medium-left");
                        break;
                    case '|':
                        styleMsg("small-center");
                        break;
                    case '|':
                        styleMsg("medium-center");
                        break;
                    case '|':
                        styleMsg("large-center");
                        break;
                }
            }
            else
                this.msgBuffer += msg[i];
        }
    }

    eligibleResponse(result) {
        console.log(result.detail.response);

        parseMarketingMsg(result.detail.response.marketingMsg)

        //this.createCache(); --> nomore showing on top of popup,
                        // wait until user click the close button..

        //this._close()
        //this.dispatch('updateErrorMsg', result.detail.responseDetailBahasa);
        //this.dispatch('updateErrorCode', 200);

        //new Popup Modal 
        this.dispatch('changeTitleAlert', "Success");
        this.dispatch('changeHeaderAlert', "");
        this.dispatch('changeMessageAlert', CONST.ALERT.BURN_SUCCESS_MSG); //"Hore! Transaksi Anda berhasil!!");
        this.dispatch('changeAlertIcon', 'happy.png');
        this.dispatch('changeAlertButton', 'Print Receipt');
        this.dispatch('showAlert');
    }

    onError(e,detail){
        this.dispatch('showConnectionAlert')

        console.log(e)
        console.log(e.target.lastRequest.xhr.status)
        console.log(detail.error); //the error object
        console.log(detail.request.status); //the status code
        console.log(detail.request.statusText);  //the error status text
    }

    __checkEmpty() {
        this.fieldAmount = 0;
    }

    _reflectNewAmount() {
        this.fieldAmount = numeral(this.srcAmount).format(0.0)
    }
    
    createCache(){
        // to convert from current trans_detail to lastTx state 
        var {trxNumber,trxAmount,remaining, marketingMsg} = this.trans_detail
        var {vouchers} = this.trx
        
        var cachedTrx = {trxNumber,trxAmount,remaining,vouchers}

        cachedTrx.remaining = numeral(cachedTrx.remaining).format(0.0)
        cachedTrx.burnDate = '';
        
        console.log(cachedTrx)
        this.dispatch('addLastTransaction', cachedTrx);
        
        setTimeout( () => {
            this.dispatch('showReceipt');
            this._reset();
        }, 500);
    }
}

customElements.define(NewTransactionLayout.is, NewTransactionLayout);

/**
 * @namespace ExpenseManager
 */
window.ExpenseManager = window.ExpenseManager || {};
ExpenseManager.NewTransactionLayout = NewTransactionLayout;
})();

