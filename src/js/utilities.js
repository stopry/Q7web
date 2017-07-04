var formValidator = null;
var IsNotHolidays = function (date) {
    if (holidays.length == 0)
        return [true];
    var PadZero = function (num, n) {
        var len = num.toString().length;
        while (len < n) {
            num = "0" + num;
            len++;
        }
        return num;
    }
    var m = PadZero(date.getMonth() + 1, 2), d = PadZero(date.getDate(), 2), y = date.getFullYear();
    for (i = 0; i < holidays.length; i++) {
        if ($.inArray(d + '/' + (m) + '/' + y, holidays) == -1) {
            return [true];
        }
    }
    return [false];
};
var noWeekendsOrHolidays = function (date) {
    var noWeekend = $.datepicker.noWeekends(date);
    return noWeekend[0] ? IsNotHolidays(date) : noWeekend;
}
var ScriptHelper = {
    AdjustFooterPosition: function () {
        if ($("#divHeader").length == 0 || $("#tbBody").length == 0 || $("#divFooter").length == 0)
            return;

        var top = document.documentElement.clientHeight - 30;
        var headerHeight = parseInt($("#divHeader").css("height").replace("px", ""), 10);
        var bodyHeight = parseInt($("#tbBody").css("height").replace("px", ""), 10);
        top < (headerHeight + bodyHeight + 20) ? top = (headerHeight + bodyHeight + 20) : top = top;

        $("#divFooter").css("top", top);
        $("#divFooter").css("left", (document.documentElement.clientWidth - parseInt($("#divFooter").css("width").replace("px", ""), 10)) / 2);
    },
    ShowIdentityExpiredWindow: function (expiredTime, keepSessionAddress, logoutAddress) {
        var checkTimeObj = new Date();
        var expiredTimeArr = expiredTime.split("-");
        checkTimeObj.setFullYear(parseInt(expiredTimeArr[0], 10));
        checkTimeObj.setMonth(parseInt(expiredTimeArr[1], 10) - 1);
        checkTimeObj.setDate(parseInt(expiredTimeArr[2], 10));
        checkTimeObj.setHours(parseInt(expiredTimeArr[3], 10));
        checkTimeObj.setMinutes(parseInt(expiredTimeArr[4], 10));
        //popup confirm message before 10 second to expired.
        checkTimeObj.setSeconds(parseInt(expiredTimeArr[5], 10) - 30);

        var handleA =
        setTimeout(
            function () {
                $("#dialog_session_expired").html("Your session will be expired in <span id='spanExpiredSeconds'>30</span> second(s). <br /><br />Click [Yes] to keep session, Click [No] to logout immediately.");
                $("#dialog_session_expired").dialog({
                    modal: true,
                    resizable: false,
                    position: 'center',
                    width: 400,
                    height: 180,
                    title: "Session Expiring...",
                    buttons: {
                        Yes: function () {
                            $(this).dialog("close");
                            if (typeof (handleB) != "undefined" && handleB != null)
                                clearInterval(handleB);

                            //Execute keep session
                            $.ajax({
                                url: keepSessionAddress + "?rn=" + Math.random(),
                                success: function (newExpiredTime) {
                                    ScriptHelper.ShowIdentityExpiredWindow(newExpiredTime, keepSessionAddress, logoutAddress);
                                },
                                error: function (requestor, status, ex) {
                                    if (status != null) {
                                        alert("Error occur! Can not keep current session, please re-login system.");
                                        //Execute Logout
                                        document.location.href = logoutAddress + "?rn=" + Math.random();
                                    }
                                }
                            });
                        },
                        No: function () {
                            $(this).dialog("close");
                            if (typeof (handleB) != "undefined" && handleB != null)
                                clearInterval(handleB);

                            //Execute Logout
                            document.location.href = logoutAddress + "?rn=" + Math.random();
                        }
                    }
                });
                if (typeof (handleA) != "undefined" && handleA != null)
                    clearTimeout(handleA);

                window.blur();
                setTimeout(window.focus, 0);

                var handleB =
                    setInterval(
                        function () {
                            var sec = parseInt($("#spanExpiredSeconds").html(), 10) - 1;
                            if (sec > 0)
                                $("#spanExpiredSeconds").html(sec);
                            else {
                                if (typeof (handleB) != "undefined" && handleB != null)
                                    clearInterval(handleB);

                                //Execute Logout
                                document.location.href = logoutAddress + "?rn=" + Math.random();
                            }
                        }
                        , 1000);
            }
            , checkTimeObj - new Date());
    },
    OpenConfirmWindow: function (title, message, width, height, yesCallbackFN, noCallbackFN) {
        if (title == null || title == "")
            title = "Confirmation";
        if (typeof (message) != "string" || message == null || message == "")
            message = generalConfirmMessage;

        if (width == null || width == "")
            width = 300;
        if (height == null || height == "")
            height = 150;

        $("#dialog_confirm_message").html(message);
        $('#dialog_confirm_message').dialog({
            modal: true,
            resizable: false,
            width: width,
            height: height,
            title: title,
            buttons: {
                "Yes": function () {
                    $(this).dialog('close');
                    if (typeof (yesCallbackFN) == "string" && yesCallbackFN != "")
                        eval(yesCallbackFN);
                },
                "No": function () {
                    $(this).dialog('close');
                    if (typeof (noCallbackFN) == "string" && noCallbackFN != "")
                        eval(noCallbackFN);
                }
            }
        });
    },
    OpenMsgWindow: function (alertMsg, title, width, height, autoClose, closeCallbackFN, closeRedirectUrl) {
        //$("#dialog_infomation_message").html(alertMsg);
        //$("#dialog_infomation_message").dialog({
        //    modal: true,
        //    resizable: false,
        //    width: width,
        //    height: height,
        //    title: title == null ? "Message" : title,
        //    buttons: {
        //        "确定": function () {
        //            $(this).dialog("close");
        //        }
        //    },
        //    open: function () {
        //        if (autoClose == true) {
        //            setTimeout('$("#dialog_infomation_message").dialog("close")', 3000);
        //        }
        //    },
        //    close: function () {
        //        if (closeCallbackFN != null && closeCallbackFN != "") {
        //            if (typeof (closeCallbackFN) == "function") {
        //                closeCallbackFN();
        //            }
        //            else
        //                eval(closeCallbackFN);
        //        }
        //        if (closeRedirectUrl != null && closeRedirectUrl != "") {
        //            window.location.href = closeRedirectUrl;
        //        }
        //    }
        //});

        alert(alertMsg);
    },   
    PagerLinkClicked: function (a) {
        if (typeof (PrePagerClicked) == "function") {
            PrePagerClicked();
        } 
        if ($(a).parents("form").length > 0) {
            CURRENT_URL = a.href;
            $($(a).parents("form")[0]).attr("action", a.href);
            $($(a).parents("form")[0]).submit();
        }
        else {
          
            document.location.href = a.href;
        }
    },
    SortLinkClicked: function (a) {
        if (typeof (PreSortLinkClicked) == "function") {
            PreSortLinkClicked();
        }
        if ($(a).parents("form").length > 0) {
            $($(a).parents("form")[0]).attr("action", a.href);
            $($(a).parents("form")[0]).submit();
        }
        else {
            document.location.href = a.href;
        }
    },
    ExecuteLogout: function (logoutUrl) {
        window.location.href = logoutUrl;
    },
    InitDatePickers: function () {
        $(".datepicker").each(
            function (i, item) {
                var mindate = typeof ($(item).attr("mindate")) != "undefined" ? $(item).attr("mindate") : "";
                var maxdate = typeof ($(item).attr("maxdate")) != "undefined" ? $(item).attr("maxdate") : "";

                $(item).datepicker(
                {
                    numberOfMonths: 1,
                    showButtonPanel: false,
                    changeMonth: true,
                    changeYear: true,
                    showMonthAfterYear: false,
                    dateFormat: jsShortDateFormat,
                    yearRange: '1950:2020',
                    minDate: mindate,
                    maxDate: maxdate
                });
            }
        );
        $(".requestdatepicker").each(
            function (i, item) {
                var mindate = typeof ($(item).attr("mindate")) != "undefined" ? $(item).attr("mindate") : "";
                var maxdate = typeof ($(item).attr("maxdate")) != "undefined" ? $(item).attr("maxdate") : "";
                $(item).datepicker(
                {
                    numberOfMonths: 1,
                    showButtonPanel: false,
                    changeMonth: true,
                    changeYear: true,
                    showMonthAfterYear: false,
                    dateFormat: jsShortDateFormat,
                    yearRange: '1950:2020',
                    beforeShowDay: noWeekendsOrHolidays,
                    minDate: mindate,
                    maxDate: maxdate
                });
            }
        );
      //  $(".datepicker").datepicker("option", "showAnim", "blind");
      //  $(".requestdatepicker").datepicker("option", "showAnim", "blind");
    },
    InitForm: function () {
        //ScriptHelper.InitDatePickers();
        //ScriptHelper.RegisterFormValidation();

        //$(".grid tr:odd").addClass("odd");
        //$(".grid tr:even").addClass("even");
        //$(".muxplangrid tr:odd").addClass("odd");
        //$(".muxplangrid tr:even").addClass("even");

        //$("input[type='reset'],button[type='reset']").click(function (event) {
        //    $("input[type='text']").val("");
        //    $("select").val("");
        //    $("input[type='radio']").attr("checked", false);
        //    $("input[type='checkbox']").attr("checked", false);
        //    $("textarea").val("");
        //    event.stopImmediatePropagation();
        //    return false;
        //});

        $(".confirm").click(function () {
            var confirmButton = $(this);         
            if (confirmButton.length > 0) {
                var buttonNodeName = confirmButton[0].nodeName;
                var confirmMessage = confirmButton.attr("confirmMessage");
                var winWidht = 300;
                var winHeight = 150;
                if (typeof (confirmButton.attr("confirmWinWidth")) != "undefined")
                    winWidht = parseInt(confirmButton.attr("confirmWinWidth"), 10);
                if (typeof (confirmButton.attr("confirmWinHeight")) != "undefined")
                    winHeight = parseInt(confirmButton.attr("confirmWinHeight"), 10);

                //if (typeof (confirmButton.attr("causeValidation")) == "undefined" || confirmButton.attr("causeValidation") == "true") {
                //    if (confirmButton.parents("form").length > 0) {
                //        var success = $(confirmButton.parents("form")[0]).validate().form();
                //        if (!success)
                //            return false;
                //    }
                //}

                if (typeof (confirmMessage) != "string")
                    confirmMessage = generalConfirmMessage;

                $("#dialog_confirm_message").html(confirmMessage);
                $('#dialog_confirm_message').dialog({
                    modal: true,
                    resizable: false,
                    width: winWidht,
                    height: winHeight,
                    title: "系统警告",
                    buttons: {
                        "确认": function () {
                            $(this).dialog('close');

                            if (typeof (confirmButton.attr("confirmedCallBackEvent")) != "undefined" && typeof (confirmButton.attr("confirmedCallBackEvent")) != "") {
                                eval(confirmButton.attr("confirmedCallBackEvent"));
                            }
                            if ((buttonNodeName == "INPUT" || buttonNodeName == "BUTTON") &&
                                        (typeof (confirmButton.attr("type")) != "undefined") &&
                                        (confirmButton.attr("type") != null) &&
                                        (confirmButton.attr("type").toLowerCase() == "submit")
                                       ) {
                                $(confirmButton.parents("form")[0]).submit();
                            }
                        },
                        "取消": function () {
                            $(this).dialog('close');
                            if (typeof (confirmButton.attr("canceledCallBackEvent")) != "undefined" && typeof (confirmButton.attr("canceledCallBackEvent")) != "") {
                                eval(confirmButton.attr("canceledCallBackEvent"));
                            }
                        }
                    }
                });
            }
            return false;
        });
    },
    RegisterFormValidation: function () {
        $("input[type='submit'],button[type='submit']").click(function (e) {
            if ($(e.currentTarget).attr("causeValidation") == "false") {
                return true;
            }

            formValidator = $($(e.currentTarget)
                .parents("form")[0])
                .validate(
                    {
                        ignore: ":not(:visible)",
                        errorPlacement: function (error, element) {
                            if (error.html() == "") {
                                return;
                            }
                            offset = element.offset();
                            error.insertBefore(element)
                            error.addClass('errmessage');  // add a class to the wrapper
                            error.css('position', 'absolute');
                            error.css('left', offset.left + element.outerWidth() + 7);
                            error.css('top', offset.top - ((error.outerHeight() - element.outerHeight()) / 2));
                        },
                        debug: false,
                        errorElement: "div",
                        wrapper: "div"
                    }
                );

            return formValidator.form();
        });
    },
    BeginSubmitAjaxForm: function (formId) {
        //TODO:
        ScriptHelper.ShowPageMask();
    },
    SubmitAjaxFormCompleted: function () {
        ScriptHelper.InitForm();
        ScriptHelper.RegisterFormValidation();
        ScriptHelper.HidePageMask();
        //$('html, body').animate({ scrollTop: 0 }, 'fast');
    },
    SubmitAjaxFormFailed: function (a, b) {
        //TODO:
    },
    SubmitAjaxFormSuccess: function () {
        //TODO:
    },
    ReplaceParamVal: function (oUrl, paramName, replaceWith) {
        if (oUrl.indexOf(paramName) == -1) {
            if (oUrl.indexOf("?") == -1)
                return oUrl + "?" + paramName + "=" + replaceWith;
            else
                return oUrl + "&" + paramName + "=" + replaceWith;
        }
        else {
            var re = eval('/(' + paramName + '=)([^&]*)/gi');
            var nUrl = oUrl.replace(re, paramName + '=' + replaceWith);
            return nUrl;
        }
    },
    QueryString: function (url, name) {
        var result = url.match(new RegExp("[\?\&]" + name + "=([^\&]+)", "i"));
        if (result == null || result.length < 1) {
            return "";
        }
        return result[1];
    },
    Trim: function (str, chr) {
        if (chr == "") {
            chr = "\\s";
        }
        var reg = new RegExp("(^" + chr + "*)|(" + chr + "*$)", "g");
        return str.replace(reg, "");
    },
    Ltrim: function Ltrim(str, chr) {
        if (chr == "") {
            chr = "\\s";
        }
        var reg = new RegExp("(^" + chr + "*)", "g");
        return str.replace(reg, "");
    },
    Rtrim: function (str, chr) {
        if (chr == "") {
            chr = "\\s";
        }
        var reg = new RegExp("(" + chr + "*$)", "g");
        return str.replace(reg, "");
    },
    GetPageSize: function () {
        var body = (document.compatMode && document.compatMode.toLowerCase() == "css1compat") ? document.documentElement : document.body;
        var bodyOffsetWidth = 0;
        var bodyOffsetHeight = 0;
        var bodyScrollWidth = 0;
        var bodyScrollHeight = 0;
        var pageDimensions = [0, 0];

        pageDimensions[0] = body.clientHeight;
        pageDimensions[1] = body.clientWidth;

        bodyOffsetWidth = body.offsetWidth;
        bodyOffsetHeight = body.offsetHeight;
        bodyScrollWidth = body.scrollWidth;
        bodyScrollHeight = body.scrollHeight;
        if (bodyOffsetHeight > pageDimensions[0]) {
            pageDimensions[0] = bodyOffsetHeight;
        }

        if (bodyOffsetWidth > pageDimensions[1]) {
            pageDimensions[1] = bodyOffsetWidth;
        }

        if (bodyScrollHeight > pageDimensions[0]) {
            pageDimensions[0] = bodyScrollHeight;
        }

        if (bodyScrollWidth > pageDimensions[1]) {
            pageDimensions[1] = bodyScrollWidth;
        }

        if (! -[1, ]) {
            pageDimensions[0] = pageDimensions[0] - 4;
            pageDimensions[1] = pageDimensions[1] - 4;
            if (bodyScrollWidth > bodyOffsetWidth)
                pageDimensions[0] = pageDimensions[0] - 15;
            if (bodyScrollHeight > bodyOffsetHeight)
                pageDimensions[1] = pageDimensions[1] - 15;
        }
        return pageDimensions;
    },
    ShowPageMask: function (ct) {
        var maskHeight = 0;
        var maskWidth = 0;
        var displayClientHeight = 0;
        var containerHeight = 0;
        var container = null;
        var submitMask = null;

        if (ct != null) {
            if (typeof (ct) == "string" && ct != "")
                container = $("#" + ct);
            else
                container = ct;

            container.css("position", "relative");
            maskHeight = container.css("height").replace("px", "");
            maskWidth = container.css("width").replace("px", "");

            containerHeight = maskHeight;
            displayClientHeight = 0;
        }
        else {
            container = $("body").first();
            var pageSize = ScriptHelper.GetPageSize();
            maskHeight = pageSize[0];
            maskWidth = pageSize[1];

            displayClientHeight = document.documentElement.scrollTop + document.body.scrollTop;
            var body = (document.compatMode && document.compatMode.toLowerCase() == "css1compat") ? document.documentElement : document.body;
            containerHeight = body.clientHeight;
        }

        ScriptHelper.HidePageMask();

        var divMask = '<div class="submit_mask alpha60" style="position:absolute; top:0px; left:0px; text-align:center; display:none;"><div class="innercontainer alpha60yellow" style="margin:0 auto;border:1px solid #c6c6c6;width:99px; height:75px;"><img src="' + appPath + '/Content/images/loading.gif" width="100" alt=""/></div></div>';
        container.prepend(divMask);

        submitMask = $(container.find(".submit_mask")[0]);


        submitMask.css("z-index", 100000);
        submitMask.css("height", maskHeight + "px");
        submitMask.css("width", maskWidth + "px");
        //submitMask.css("line-height", maskHeight + "px");
        $(submitMask.find(".innercontainer")).css("margin-top", displayClientHeight + (containerHeight / 2) - 40 + "px");

        if (! -[1, ]) {
            submitMask.css("background", "url(" + appPath + "/content/images/blank.jpg_50.jpg) no-repeat -999px -999px;");
        }
        submitMask.show();
    },
    HidePageMask: function () {
        $(".submit_mask").remove();
    },
    GetIframeDocumentObj: function (frameId) {
        var ifm = document.getElementById(frameId);
        var subWeb = document.frames ? document.frames[frameId].document : ifm.contentDocument;
        return subWeb;
    }
};








