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
        LIST_TRX: "Invoice #",
        CHANGE_PWD: "Ganti Password",
        OLD_PWD: "Password Lama:",
        NEW_PWD: "Password Baru:",
        CONFIRM_PWD: "Confirm Password Again:"
    },
    ROOT: "https://evoucher-dev.kartuku.co.id/loyalty-web-api/web/3.0",
    // ROOT: "http://172.30.35.64:8080/web/3.0",
    VER: "3.0",
    URL: {
        ELIGIBLE_CEK:"/manualredeem/eligible",
        BURN_VOUCH: "/manualredeem/codes",
        LIST_VOUCHERS: "/manualredeem-report",
        CHANGE_PWD: "https://evoucher-dev.kartuku.co.id/auth-ldap-api/changepwd"
    },
    LOYALTY_HOME: "http://evoucher-dev.kartuku.co.id/loyalty-web/",
    DELAY: 700,
    PWD_LENGTH: 6,
    ALERT: {
        BURN_SUCCESS_MSG: "Voucher yang dimasukkan berhasil ditukar.",
        BURN_FAILURE_MSG: "",
        INVALID_CODE_MSG: "",
        ALREADY_BURN_MSG: "",
        ALREADY_ENTRIED_MSG: "Voucher telah di-entry untuk transaksi ini.",
        ERROR_HEADER: "Whoops, request gagal..",
        SUCCESS_HEADER: "Success",
        DIFF_PASSWORD: "Password tidak sama",
        WRONG_PASSWORD: "Panjang password tidak memenuhi syarat.",
    }

};
})();
