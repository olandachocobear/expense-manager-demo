(() => {
window.CONST = {
    NAV: {
        LINK_1: "TRANSAKSI BARU",
        LINK_2: "HISTORY REDEEM"
    },
    LABEL: {
        APP_NAME: "VOUCHER REDEMPTION",
        ENTRY_TRX_VAL: "TOTAL TRANSACTION",
        ENTRY_UNIQUE_CODE: "Voucher Code",
        ENTRY_REDEEM_BTN: "Redeem!",
        ENTRY_REDEEM_RESET: "Reset",
        ENTRY_DELETE: "Delete",
        SEARCH_VOUCH_NO: "Voucher Number",
        SEARCH_DATE_START: "From",
        SEARCH_DATE_END: "To",
        SEARCH_TRX_NO: "Invoice Number",
        SEARCH_BTN: "SEARCH",
        LIST_ACTION: "Action",
        LIST_TGL: "Date",
        LIST_CODE: "Voucher Code",
        LIST_NAME: "Voucher Name",
        LIST_ORIG: "Original Amount",
        LIST_VALUE: "Voucher Amount",
        LIST_REMAIN: "Remaining Amount",
        LIST_TRX: "Invoice #"
    },
    ROOT: "https://evoucher-dev.kartuku.co.id/loyalty-web-api/web/3.0/",
    URL: {
        ELIGIBLE_CEK:"/manualredeem/eligible",
        BURN_VOUCH: "/manualredeem/codes",
        LIST_VOUCHERS: "/manualredeem-report",
    },
    LOYALTY_HOME: "http://evoucher-dev.kartuku.co.id/loyalty-web/",
    DELAY: 700,
    ALERT: {
        BURN_SUCCESS_MSG: "Voucher yang dimasukkan berhasil di-burn.",
        BURN_FAILURE_MSG: "",
        INVALID_CODE_MSG: "",
        ALREADY_BURN_MSG: "",
        ALREADY_ENTRIED_MSG: ""
    }

};
})();
