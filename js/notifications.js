/*
Do not delete the following comment. It is essential for tracking purposes.
#Merc2021DoNotDelete
*/
var timeoutHandle;
var closeTime = 5000;
function createNotification(cssType, notificationType, notificationIconAria, desktopMessage, mobileMessage, closeButton = true, autoClose = false) {

    var notificationContainer = createNotificationContainer(cssType, notificationType, closeButton);
    initNotification(cssType, notificationContainer);
    /* A11Y delay for Screen reader */
    setTimeout(() => {
        createNotificationIcon(notificationContainer, notificationType, notificationIconAria);
        createNotificationContent(cssType, notificationContainer, desktopMessage, mobileMessage, notificationType);
        if (closeButton) {
            createNotificationCloseButton(notificationContainer);
        }

        /* For links */
        document.querySelectorAll('button, a, [role="button"], [type="button"], [type="submit"], [type="reset"]').forEach(function (el) {
            // Add event listeners to the various buttons
            el.addEventListener('click', ButtonEventHandler);
            el.addEventListener('keyup', ButtonEventHandler);
            el.addEventListener('blur', ButtonEventHandler);
        });
    }, 100);

    if (autoClose && notificationType != 'error') {
        notificationContainer.addEventListener('mouseover', (evt) => removeTimer(evt), false);
        notificationContainer.addEventListener("mouseout", (evt) => setTimer(cssType, evt), false);

        notificationContainer.addEventListener("focus", (evt) => removeTimer(evt), false);
        notificationContainer.addEventListener("blur", (evt) => setTimer(cssType, evt), false);

        destroyNotification(notificationContainer, cssType);
    }
}

function removeTimer(evt) {
    // for each list item
    document.querySelectorAll('[timerId]').forEach((row) => {
        timeoutHandle = row.getAttribute("timerId");
        clearTimeout(timeoutHandle);
    });
}

function setTimer(cssType, event) {
    document.querySelectorAll('[timerId]').forEach((notificationContainer) => {
        destroyNotification(notificationContainer, cssType);
    });
}

function destroyNotification(notificationContainer, cssType) {
    
    var timeoutHandleID = setTimeout(() => {
        notificationContainer.style.paddingTop = notificationContainer.clientHeight + 'px';
        const nodeToRemove = notificationContainer;
        notificationContainer.classList.add('hide');
        notificationContainer.classList.remove('info');
        notificationContainer.classList.remove('success');
        notificationContainer.classList.remove('warning');
        notificationContainer.classList.remove('error');
        notificationContainer.classList.remove('shadow');
        notificationContainer.innerHTML = '';
        // Removing the html after 0.6 second because of animation
        setTimeout(() => {
            nodeToRemove.remove();
        }, 700);
    }, closeTime);

    if (cssType == 'toast') {
        notificationContainer.setAttribute("timerId", timeoutHandleID);
    }
}

function ButtonEventHandler(event) {
    var type = event.type;
    if (type === 'keyup') {
        if (event.keyCode === 13 || event.keyCode === 32) {
            event.target.classList.remove('by-keyboard');
            event.preventDefault();
        }
        else if (event.keyCode === 9) {
            event.target.classList.remove('by-keyboard');
        }
    } else if (type === 'click') {
        event.target.classList.add('by-keyboard');
    }
    else if (type === 'blur') {
        event.target.classList.add('by-keyboard');
    }
}

function createNotificationContainer(cssType, notificationType, closeButton) {
    var notificationContainer = document.createElement("div")
    notificationContainer.classList.add("notification");
    if (cssType == 'toast') {
        notificationContainer.classList.add("shadow");
    }

    if (closeButton) {
        notificationContainer.classList.add("close");
    }

    setTimeout(() => {
        notificationContainer.classList.add("animation");
    }, 100);

    if (notificationType == 'error') {
        notificationContainer.setAttribute("aria-live", 'assertive');
        notificationContainer.setAttribute("role", 'alert');
    }
    else {
        notificationContainer.setAttribute("aria-live", 'polite');
        notificationContainer.setAttribute("role", 'status');
    }

    if (notificationType=='info') {
        notificationContainer.classList.add("info");
    } else if (notificationType == 'success') {
        notificationContainer.classList.add("success");
    } else if (notificationType == 'warning') {
        notificationContainer.classList.add("warning");
    } else if (notificationType == 'error') {
        notificationContainer.classList.add("error");
    }

    return notificationContainer;
}

function createNotificationIcon(notificationContainer, notificationType, notificationIconAria) {
    var notificationHeader = document.createElement("span");
    notificationHeader.setAttribute("aria-label", notificationIconAria);
    notificationHeader.classList.add("icon");
    if (notificationType == 'info') {
        notificationHeader.classList.add("info-icon");
    } else if (notificationType == 'success') {
        notificationHeader.classList.add("success-icon");
    } else if (notificationType == 'warning') {
        notificationHeader.classList.add("warning-icon");
    } else if (notificationType == 'error') {
        notificationHeader.classList.add("error-icon");
    }
    notificationContainer.appendChild(notificationHeader);
}

function createNotificationContent(cssType, notificationContainer, desktopMessage, mobileMessage, notificationType) {
    var notificationContent = document.createElement("div");
    /**********************************************************************************************
     * Do not exceed limit of characters. See Mercury for details.
     *********************************************************************************************/
    var textDiv = document.createElement("div");
    textDiv.classList.add("text");

    
    var textPDesktop = document.createElement("div");
    textPDesktop.classList.add("desktop");
    

    var textPMobile = document.createElement("div");
    textPMobile.classList.add("mobile");

    if (notificationType == 'error') {
        textPDesktop.innerHTML = `${desktopMessage}`;
        textPMobile.innerHTML = `${mobileMessage}`;
    }
    else {
        if (cssType == 'toast') {
            textPDesktop.innerHTML = desktopMessage.substr(0, 60);
            textPMobile.innerHTML = mobileMessage.substr(0, 60);
        }
        else if (cssType == 'notification') {
            textPMobile.innerHTML = mobileMessage.substr(0, 70);
            textPDesktop.innerHTML = desktopMessage.substr(0, 130);
        }
        else {
            textPDesktop.innerHTML = `${desktopMessage}`;
            textPMobile.innerHTML = `${mobileMessage}`;
        }
    }
    /**********************************************************************************************
     * END
     *********************************************************************************************/
    notificationContainer.appendChild(notificationContent).appendChild(textDiv).appendChild(textPDesktop);
    notificationContainer.appendChild(notificationContent).appendChild(textDiv).appendChild(textPMobile);
}

function createNotificationCloseButton(notificationContainer) {
    var closeButton = document.createElement("button");
    /* closeButton.setAttribute("aria-describedby", toastId) */
    closeButton.setAttribute("aria-label", "Close toast notification")
    closeButton.classList.add('closebtn');
    closeButton.classList.add('micro-buttons');
    closeButton.classList.add('by-keyboard');
    closeButton.addEventListener('click', removeNotification);
    notificationContainer.appendChild(closeButton);
}

function initNotification(cssType, notificationContainer) {

    if (cssType == 'toast') {
        selectedElement = 'toastsContainer';
    }
    else {
        selectedElement = 'notificationContainer';
    }

    let element = document.getElementById(selectedElement);
    /* var isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    if (isMobile) {
        element.prepend(notificationContainer);
    }
    else {
        element.appendChild(notificationContainer);
    } */

    let isMobile = window.matchMedia("only screen and (max-width: 640px)").matches;
    if (isMobile) {
        element.appendChild(notificationContainer);
    }
    else {
        element.prepend(notificationContainer);
    }

    // element.appendChild(notificationContainer);
    element.focus();
}

function removeNotification(e) {
    e.currentTarget.parentNode.style.paddingTop = e.currentTarget.parentNode.clientHeight + 'px';
    const nodeToRemove = e.currentTarget.parentNode;
    // close toast warning
    e.currentTarget.parentNode.classList.remove('info');
    e.currentTarget.parentNode.classList.remove('success');
    e.currentTarget.parentNode.classList.remove('warning');
    e.currentTarget.parentNode.classList.remove('error');
    e.currentTarget.parentNode.classList.remove('shadow');
    e.currentTarget.parentNode.classList.add('hide');
    e.currentTarget.parentNode.innerHTML = '';
    
    // Removing the html after 0.6 second because of animation
    setTimeout(()=> {
        nodeToRemove.remove();
    }, 700);
}