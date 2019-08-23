$(document).ready(function () {
    getUserSettings();
    getAllowedNotifications();
    savePersonalSettings();
    saveSecuritySettings();
    saveNotificationSettings();
});

function getUserSettings() {
    $.getJSON('/check', function (data) {
        $("#name").append(data.name);
        if (!(data.phone === "")) {
            $("#phone").append(data.phone);
        } else {
            $("#phone").append("Не указан");
            $("#checkSms")
                .attr("disabled", true);
            $("#smsHelp").text("Для возможности включения смс уведомлений необходимо указать номер телефона");
        }
        if (data.noRegister == "true") {
            $("#fieldset").attr("disabled", true);
        }
    });
}

function getAllowedNotifications() {
    $.getJSON('/settings/allowed-notifications', function (data) {
        if (data.email === true) {
            $("#checkEmail").attr('checked', true)
        }
        if (data.sms === true) {
            $("#checkSms").attr('checked', true)
        }
    });
}

function savePersonalSettings() {
    $('#savePersonalData').click(function () {
            var name = $("#inputLogin").val();
            var phone = $("#inputPhone").val();
            if (name === "") {
                name = null;
            }
            if (phone === "") {
                phone = null;
            }

            var map = {
                "name": name,
                "phone": phone
            };

            $.ajax({
                type: "POST",
                url: "/settings/change-personal-data",
                contentType: "application/json",
                data: JSON.stringify(map),
                dataType: "json",
                success: function (result, status, xhr) {
                    if (result.description == "OK") {
                        $("#titleModal").text("Поздравляем!")
                        $("#textModal").text("Персональные данные успешно сохранены")
                        $("#myModal").modal({
                            backdrop: 'static',
                            keyboard: false,
                            show: true,
                            focus: true
                        });
                        $("#closeModal").click(function () {
                            location.reload();
                        })
                    }
                },
                error: function (xhr, status, error) {
                    var jsonError = jQuery.parseJSON(xhr.responseText);
                    var desc = (jsonError != "") ? jsonError.description : "no details";
                    $("#titleModal").text("Упс...");
                    $("#textModal").text(desc);
                    $("#myModal").modal({
                        backdrop: 'static',
                        keyboard: false,
                        show: true,
                        focus: true
                    });
                    $("#closeModal").click(function () {
                        location.reload();
                    })
                }
            });
        }
    );
}

function saveSecuritySettings() {
    $('#saveSecuritySettings').click(function () {
            if ($("#inputPasswordOld").val() === "") {
                $("#passwordTextOld").text("Введите старый пароль");
                return;
            }
            $("#passwordTextOld").text("");

            if (($("#inputPasswordOne").val() === "")) {
                $("#passwordTextOne").text("Введите пароль");
                $("#passwordTextTwo").text("");
                return;
            } else if ($("#inputPasswordOne").val().length < 6) {
                $("#passwordTextOne").text("Длина пароля должна быть 6 или больше символов");
                $(this).closest("#securityForm").find("input[type=password], textarea").val("");
            } else if (($("#inputPasswordTwo").val() === "") || ($("#inputPasswordOne").val() !== $("#inputPasswordTwo").val())) {
                $("#passwordTextOne").text("");
                $("#passwordTextTwo").text("Пароли должны совпадать");
                $(this).closest("#securityForm").find("input[type=password], textarea").val("");
                return;
            } else {
                $("#passwordTextOne").text("");
                $("#passwordTextTwo").text("");
            }

            var map = {
                "oldPassword": $("#inputPasswordOld").val(),
                "newPassword": $("#inputPasswordOne").val()
            };

            $.ajax({
                type: "POST",
                url: "/settings/change-security-data",
                contentType: "application/json",
                data: JSON.stringify(map),
                dataType: "json",
                success: function (result, status, xhr) {
                    if (result.description == "OK") {
                        $("#titleModal").text("Поздравляем!")
                        $("#textModal").text("Новый пароль успешно сохранен")
                        $("#myModal").modal({
                            backdrop: 'static',
                            keyboard: false,
                            show: true,
                            focus: true
                        });
                        $("#closeModal").click(function () {
                            location.reload();
                        })
                    }
                },
                error: function (xhr, status, error) {
                    var jsonError = jQuery.parseJSON(xhr.responseText);
                    var desc = (jsonError != "") ? jsonError.description : "no details";
                    $("#titleModal").text("Упс...");
                    $("#textModal").text(desc);
                    $("#myModal").modal({
                        backdrop: 'static',
                        keyboard: false,
                        show: true,
                        focus: true
                    });
                    $("#closeModal").click(function () {
                        location.reload();
                    })
                }
            });
        }
    );
}

function saveNotificationSettings() {
    $("#saveNotificationSettings").click(function () {
        var email;
        var sms;
        if ($("#checkEmail").prop('checked'))
            email = true;
        else
            email = false;

        if ($("#checkSms").prop('checked'))
            sms = true;
        else
            sms = false;

        var userNotifications = {
            email: email,
            sms: sms
        };

        $.ajax({
            type: "POST",
            url: "/settings/change-notifications",
            contentType: "application/json",
            data: JSON.stringify(userNotifications),
            dataType: "json",
            success: function (result, status, xhr) {
                if (result.description == "OK") {
                    $("#titleModal").text("Поздравляем!")
                    $("#textModal").text("Изменения в настройках уведомлений успешно сохранены")
                    $("#myModal").modal({
                        backdrop: 'static',
                        keyboard: false,
                        show: true,
                        focus: true
                    });
                    $("#closeModal").click(function () {
                        location.reload();
                    })
                }
            },
            error: function (xhr, status, error) {
                var jsonError = jQuery.parseJSON(xhr.responseText);
                var desc = (jsonError != "") ? jsonError.description : "no details";
                $("#titleModal").text("Упс...");
                $("#textModal").text(desc);
                $("#myModal").modal({
                    backdrop: 'static',
                    keyboard: false,
                    show: true,
                    focus: true
                });
                $("#closeModal").click(function () {
                    location.reload();
                })
            }
        });
    });
}