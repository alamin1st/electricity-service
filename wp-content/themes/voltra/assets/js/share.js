/*
 * SHARE.JS (Reusable for any WP theme)
 * Handles:
 * - Copy post link
 * - Toast notifications
 * - Icon bounce animation
 * - Auto attach events to any element with data-share="copy"
 */
(function($) {
    "use strict";
    /* ==========================================
       INIT (NO BLOCKING)
    ========================================== */
    function initShare() {
        // Always rebind safely (no isBound needed)
        $(document)
            .off("click.share")
            .on("click.share", "[data-share='copy']", function(e) {
                e.preventDefault();
                copyLink(this);
            });
    }
    // DOM Ready
    $(document).ready(function() {
        initShare();
    });
    // Elementor Support
    $(window).on("elementor/frontend/init", function() {
        initShare();
    });
    /* ==========================================
       COPY LINK
    ========================================== */
    function copyLink(btn) {
        if (!btn) return;
        const link = btn.getAttribute("data-link");
        if (!link) return;
        if (navigator.clipboard && window.isSecureContext) {
            navigator.clipboard.writeText(link)
                .then(function() {
                    handleSuccess(btn);
                })
                .catch(function() {
                    fallbackCopy(link, btn);
                });
        } else {
            fallbackCopy(link, btn);
        }
    }
    /* ==========================================
       FALLBACK COPY
    ========================================== */
    function fallbackCopy(text, btn) {
        const textarea = document.createElement("textarea");
        textarea.value = text;
        textarea.style.position = "fixed";
        textarea.style.opacity = "0";
        document.body.appendChild(textarea);
        textarea.focus();
        textarea.select();
        try {
            document.execCommand("copy");
            handleSuccess(btn);
        } catch (err) {
            showToastNearIcon(btn, "Failed");
        }
        document.body.removeChild(textarea);
    }
    /* ==========================================
       SUCCESS HANDLER
    ========================================== */
    function handleSuccess(btn) {
        animateIcon(btn);
        // Remove any existing toast (prevents stacking)
        document.querySelectorAll(".pp-toast-inline").forEach(el => el.remove());
        showToastNearIcon(btn, "Copied!");
    }
    /* ==========================================
       ICON ANIMATION
    ========================================== */
    function animateIcon(btn) {
        btn.classList.add("copy-anim");
        setTimeout(function() {
            btn.classList.remove("copy-anim");
        }, 500);
    }
    /* ==========================================
       TOAST UI
    ========================================== */
    function showToastNearIcon(btn, message) {
        const toast = document.createElement("div");
        toast.className = "pp-toast-inline";
        toast.setAttribute("aria-live", "polite");
        toast.innerText = message;
        document.body.appendChild(toast);
        const rect = btn.getBoundingClientRect();
        let left = rect.left + window.scrollX + rect.width / 2;
        left = Math.max(10, Math.min(left, window.innerWidth - 10));
        toast.style.left = left + "px";
        toast.style.top = (rect.top + window.scrollY - 35) + "px";
        setTimeout(function() {
            toast.classList.add("show");
        }, 20);
        setTimeout(function() {
            toast.classList.remove("show");
            setTimeout(function() {
                toast.remove();
            }, 250);
        }, 1500);
    }
})(jQuery);