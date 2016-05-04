var standby = false;

function Checking() {
    if ($(".kututup").height() == "0") {
        hidepage();
    }
}

function hidepage() {
    if (!standby) {
        var h = 0;
        h = jQuery(window).height();
        jQuery("#alert").show().css({
            height: "0",
            width: "0",
            left: "50%",
            top: "50%"
        }).animate({
            width: "100%",
            height: h,
            left: "0",
            top: "0",
            opacity: "1"
        }, 1000);
        standby = true;
    }
}
document.write('<link rel="stylesheet" href="'+ linkcss +'" type="text/css">');

function fnsantiy() {
    jQuery(function () {
        jQuery(document).ready(function () {
            setTimeout("Checking();", 1000);
            jQuery("body").append('<div id="alert"><a href="javascript:document.location.reload();"><img border="0" height="125" src="https://4.bp.blogspot.com/-IAIoqRWeTgE/VyoUMHKXPDI/AAAAAAAAIl8/oJqZWnwew_A__FXuxGzs7IS1hTd_2DY0wCLcB/s200/Stop%2BAdBlock.png" width="200" /></a><br /><p><h2>ADBLOCK DETECTED</h2><br/><span>Please Disable Adblocker and Refresh (F5) to continue visiting This Site. <br/>
            <a href="javascript:document.location.reload();"
ONMOUSEOVER="window.status='Refresh'; return true"
ONMOUSEOUT="window.status='That was good'">
<img src="https://4.bp.blogspot.com/-8NJOYgKlCxs/Vyoe6UIdUAI/AAAAAAAAImM/z05_Zdxp1qwGNl0_fDWz4JzaJuCG248OgCLcB/s1600/refresh.gif" 
width="115" height="31" border="0" /></a>
            </span></p></div>');
        });
    });
}
fnsantiy();// JavaScript Document
