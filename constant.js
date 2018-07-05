(() => {
window.constant = {
    delay: 700,
    url: {
    staging: {
        eligible_cek:"https://evoucher-dev.kartuku.co.id/loyalty-web-api/web/3.0/manualredeem/eligible",
        burn_vouch: "https://evoucher-dev.kartuku.co.id/loyalty-web-api/web/3.0/manualredeem/codes",
        list_vouchers: "https://evoucher-dev.kartuku.co.id/loyalty-web-api/web/3.0/manualredeem-report"
    },
    dev: {
        eligible_cek: "http://localhost:8080/api/3.0/promo/manual/eligible",
        burn_vouch: "http://localhost:8080/api/3.0/promo/manual/codes",
        // list_vouchers: "https://evoucher-dev.kartuku.co.id/loyalty-web-api/web/3.0/manualredeem-report",
        list_vouchers: "src/data/manual-redeem.json"
    }
    },
    alert: {
    BURN_SUCCESS_MSG: "Voucher yang dimasukkan berhasil di-burn.",
    BURN_FAILURE_MSG: "",
    INVALID_CODE_MSG: "",
    ALREADY_BURN_MSG: "",
    ALREADY_ENTRIED_MSG: ""
    }
};
})();
