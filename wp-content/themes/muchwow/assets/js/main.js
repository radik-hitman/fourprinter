(function ($) {
    "use strict";

    // DOM Ready
    $(document).ready(function () {
        // Sticky Menu
        const header = $('.menu-sticky');
        const headerinnerHeight = $(".header-inner").innerHeight();
        $(window).on('scroll', function () {
            const scroll = $(window).scrollTop();
            if (scroll < headerinnerHeight) {
                header.removeClass("sticky");
                $('.menu-area').removeClass("sticky-menu");
            } else {
                header.addClass("sticky");
                $('.menu-area').addClass("sticky-menu");
            }
        });

        // Hide empty nav menu items
        $(".widget_nav_menu li a").filter(function () {
            return $.trim($(this).html()) === '';
        }).hide();

        // Collapse navbar on click (excluding dropdowns)
        const navMain = $(".navbar-collapse");
        navMain.on("click", "a:not([data-toggle])", function () {
            navMain.collapse('hide');
        });

        // Off-canvas menu toggle
        function resizeNav() {
            $(".menu-ofcn").css({ height: window.innerHeight });
            const radius = Math.sqrt(Math.pow(window.innerHeight, 2) + Math.pow(window.innerWidth, 2));
            const diameter = radius * 2;
            $(".off-nav-layer").css({
                width: diameter,
                height: diameter,
                marginTop: -radius,
                marginLeft: -radius
            });
        }
        $(".menu-button, .close-button, #mobile_menu li a").on('click', function () {
            $(".nav-toggle, .off-nav-layer, .menu-ofcn, .close-button, body").toggleClass("off-open");
        });
        $(window).resize(resizeNav);
        resizeNav();

        // Init mobile menu
        $("#mobile_menu").menumaker({ format: "multitoggle" });

        // Sticky Search Toggle
        $('.sticky_search').on('click', function (event) {
            event.preventDefault();
            $('.sticky_form').animate({ opacity: 'toggle' }, 500);
            $('.sticky_form input').focus();

            $('body').removeClass('search-active search-close');
            if ($(this).hasClass('close-full')) {
                $('body').addClass('search-close');
                $('.sticky_form').fadeOut();
            } else {
                $('body').addClass('search-active');
            }
        });

        // Canvas Menu Toggle
        $(".nav-link-container > a").on("click", function (event) {
            event.preventDefault();
            $(".nav-link-container").toggleClass("nav-inactive-menu-link-container");
            $(".mobile-menus").toggleClass("nav-active-menu-container");
        });

        $(".nav-close-menu-li > a").on('click', function () {
            $(".mobile-menus").toggleClass("nav-active-menu-container");
            $(".content").toggleClass("inactive-body");
        });

        // Convert .children to .sub-menu
        $("ul.children").addClass("sub-menu");

        // Comment wrap
        $(".comment-body, .comment-respond").wrap("<div class='comment-full'></div>");
    });

    // DOMContentLoaded
    document.addEventListener('DOMContentLoaded', () => {
        // Back to Top
        const backToTop = document.querySelector('[data-uc-backtotop]');
        if (backToTop) {
            backToTop.addEventListener('click', (e) => {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
            });

            let scrollPos = 0;
            window.addEventListener('scroll', () => {
                const top = document.body.getBoundingClientRect().top;
                backToTop.parentNode.classList.toggle('uc-active', top <= scrollPos);
                scrollPos = top;
            });
        }

        // Light/Dark Mode
        const themeSettings = document.getElementById('theme-settings');
        const defaultDark = themeSettings?.dataset.defaultDark === '1';
        const darkModeToggles = document.querySelectorAll('[data-darkmode-toggle] input, [data-darkmode-switch] input');
        const htmlTag = document.documentElement;
        if (defaultDark) {
            localStorage.removeItem('theme');
            htmlTag.setAttribute('data-theme', 'dark');
            htmlTag.classList.add('uc-dark');
        } else {
            if (darkModeToggles.length) {
                const htmlTag = document.documentElement;
                const savedTheme = localStorage.getItem('theme');
                if (savedTheme) {
                    htmlTag.setAttribute('data-theme', savedTheme);
                    htmlTag.classList.toggle('uc-dark', savedTheme === 'dark');
                }
                darkModeToggles.forEach((checkbox) => {
                    checkbox.checked = savedTheme === 'dark';
                    checkbox.addEventListener('change', (e) => {
                        const isDark = e.target.checked;
                        localStorage.setItem('theme', isDark ? 'dark' : 'light');
                        htmlTag.setAttribute('data-theme', isDark ? 'dark' : 'light');
                        htmlTag.classList.toggle('uc-dark', isDark);
                    });
                });
            }
        }

        // Remove motion effect styles
        document.querySelectorAll('[data-settings]').forEach((el) => {
            if (el.getAttribute('data-settings').includes('motion_effects')) {
                el.removeAttribute('data-settings');
            }
        });

        document.querySelectorAll('link').forEach((link) => {
            if (link.href.includes('animations') || link.href.includes('motion')) {
                link.parentNode.removeChild(link);
            }
        });

        const animationLink = Array.from(document.getElementsByTagName('link')).find(link =>
            link.href.includes('elementor/assets/lib/animations/animations.min.css')
        );
        if (animationLink) {
            animationLink.parentNode.removeChild(animationLink);
        }
    });

    // Window Load
    $(window).on('load', function () {
        $(".uc-pageloader").delay(400).fadeOut(200);

        if ($(window).width() < 992) {
            const menu = $('.reactheme-menu');
            menu.css({ height: '0', opacity: '0', zIndex: '-1' });
            $('.reactheme-menu-toggle').on('click', function () {
                menu.css({ opacity: '1', zIndex: '1' });
            });
        }
    });

    // Copy Post URL
    function fiixoraCopyPostUrl(url) {
        const decodedUrl = decodeURIComponent(url);
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(decodedUrl).then(() => {
                alert('Copied!');
            }).catch(err => {
                console.error('Clipboard copy failed:', err);
                fallbackCopy(decodedUrl);
            });
        } else {
            fallbackCopy(decodedUrl);
        }

        function fallbackCopy(url) {
            const tempInput = document.createElement("input");
            tempInput.value = url;
            document.body.appendChild(tempInput);
            tempInput.select();
            document.execCommand("copy");
            document.body.removeChild(tempInput);

            const msg = document.createElement("span");
            msg.className = "rt_copy-msg position-absolute start-50 bottom-100 mb-1 fs-7 lh-1 text-dark dark:text-white";
            msg.textContent = "Copied!";
            const button = event.target.closest('.rt_copyUrl');
            button.appendChild(msg);

            setTimeout(() => {
                msg.remove();
            }, 1000);
        }
    }
    window.fiixoraCopyPostUrl = fiixoraCopyPostUrl;

    // Menumaker plugin
    $.fn.menumaker = function (options) {
        const mobile_menu = $(this),
            settings = $.extend({
                format: "dropdown",
                sticky: false
            }, options);

        return this.each(function () {
            mobile_menu.find('li ul').parent().addClass('has-sub');

            function multiTg() {
                mobile_menu.find(".has-sub").prepend('<span class="submenu-button"></span>');
                mobile_menu.find(".hash").parent().addClass('hash-has-sub');
                mobile_menu.find('.submenu-button').on('click', function () {
                    $(this).toggleClass('submenu-opened');
                    const submenu = $(this).siblings('ul');
                    submenu.toggleClass('open-sub').slideToggle();
                });
            }

            if (settings.format === 'multitoggle') multiTg();
            else mobile_menu.addClass('dropdown');

            if (settings.sticky) mobile_menu.css('position', 'fixed');

            function resizeFix() {
                if ($(window).width() > 991) {
                    mobile_menu.find('ul').show();
                    mobile_menu.find('ul.sub-menu').hide();
                }
            }
            resizeFix();
            $(window).on('resize', resizeFix);
        });
    };

})(jQuery);
