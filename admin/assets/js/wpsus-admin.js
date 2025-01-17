/*
 * ======================================================================
 * wp sus Admin
 * ======================================================================
 */
(function($) {

    var WpSusAdmin = {

        /**
         * Stores the data for all slides in the slider.
         *
         * @since 1.0.0
         * 
         * @type {Array}
         */
        slides: [],

        /**
         * Keeps a count for the slides in the slider.
         *
         * @since 1.0.0
         * 
         * @type {Int}
         */
        slideCounter: 0,

        /**
         * Stores all posts names and their taxonomies.
         *
         * @since 1.0.0
         * 
         * @type {Object}
         */
        postsData: {},

        /**
         * Indicates if the preview images from the slides
         * can be resized.
         * This prevents resizing the images too often.
         *
         * @since 1.0.0
         * 
         * @type {Boolean}
         */
        allowSlideImageResize: true,

        /**
         * Initializes the functionality for a single slider page
         * or for the page that contains all the sliders.
         *
         * @since 1.0.0
         */
        init: function() {
            if (wps_js_vars.page === 'single') {
                this.initSingleSliderPage();
            } else if (wps_js_vars.page === 'all') {
                this.initAllSlidersPage();
            }
        },

        /*
         * ======================================================================
         * Slider functions
         * ======================================================================
         */

        /**
         * Initializes the functionality for a single slider page
         * by adding all the necessary event listeners.
         *
         * @since 1.0.0
         */
        initSingleSliderPage: function() {
            var that = this;

            this.initSlides();

            if (parseInt(wps_js_vars.id, 10) !== -1) {
                this.loadSliderData();
            }

            $('form').on('submit', function(event) {
                event.preventDefault();
                that.saveSlider();
            });

            $('.preview-slider').on('click', function(event) {
                event.preventDefault();
                that.previewSlider();
            });

            $('.update-presets').on('click', function(event) {
                event.preventDefault();
                that.updatePresets($(this));
            });

            $('.slider-setting-presets').on('change', function(event) {
                event.preventDefault();
                that.updateSettings($(this).val());
            });

            $('.add-slide, .slide-type a[data-type="empty"]').on('click', function(event) {
                event.preventDefault();
                that.addEmptySlide();
            });

            $('.slide-type a[data-type="image"]').on('click', function(event) {
                event.preventDefault();
                that.addImageSlides();
            });

            $('.slide-type a[data-type="posts"]').on('click', function(event) {
                event.preventDefault();
                that.addPostsSlides();
            });

            $('.slide-type a[data-type="gallery"]').on('click', function(event) {
                event.preventDefault();
                that.addGallerySlides();
            });

            $('.slide-type a[data-type="flickr"]').on('click', function(event) {
                event.preventDefault();
                that.addFlickrSlides();
            });

            $('.add-breakpoint').on('click', function(event) {
                event.preventDefault();
                that.addBreakpoint();
            });

            $('.breakpoints').on('click', '.breakpoint-setting-name a', function(event) {
                event.preventDefault();

                var name = $(this).attr('data-type'),
                    context = $(this).parents('.breakpoint').find('.breakpoint-settings');

                that.addBreakpointSetting(name, context);
            });

            $('.breakpoints').on('click', '.remove-breakpoint', function(event) {
                $(this).parents('.breakpoint').remove();
            });

            $('.breakpoints').on('click', '.remove-breakpoint-setting', function(event) {
                $(this).parents('tr').remove();
            });

            $('.breakpoints').lightSortable({
                children: '.breakpoint',
                placeholder: ''
            });

            $('.postbox .hndle, .postbox .handlediv').on('click', function() {
                var postbox = $(this).parent('.postbox');

                if (postbox.hasClass('closed') === true) {
                    postbox.removeClass('closed');
                } else {
                    postbox.addClass('closed');
                }
            });

            $('.sidebar-settings').on('mouseover', 'label', function() {
                that.showInfo($(this));
            });

            $(window).resize(function() {
                if (that.allowSlideImageResize === true) {
                    that.resizeSlideImages();
                    that.allowSlideImageResize = false;

                    setTimeout(function() {
                        that.resizeSlideImages();
                        that.allowSlideImageResize = true;
                    }, 250);
                }
            });
        },

        /**
         * Initializes the functionality for the page that contains
         * all the sliders by adding all the necessary event listeners.
         *
         * @since 1.0.0
         */
        initAllSlidersPage: function() {
            var that = this;

            $('.sliders-list').on('click', '.preview-slider', function(event) {
                event.preventDefault();
                that.previewSliderAll($(this));
            });

            $('.sliders-list').on('click', '.delete-slider', function(event) {
                event.preventDefault();
                that.deleteSlider($(this));
            });

            $('.sliders-list').on('click', '.duplicate-slider', function(event) {
                event.preventDefault();
                that.duplicateSlider($(this));
            });

            $('.sliders-list').on('click', '.export-slider', function(event) {
                event.preventDefault();
                that.exportSlider($(this));
            });

            $('.import-slider').on('click', function(event) {
                event.preventDefault();
                ImportWindow.open();
            });

            $('.clear-all-cache').on('click', function(event) {
                event.preventDefault();

                $('.clear-cache-spinner').css({ 'display': 'inline-block', 'visibility': 'visible' });

                var nonce = $(this).attr('data-nonce');

                $.ajax({
                    url: wps_js_vars.ajaxurl,
                    type: 'post',
                    data: { action: 'wpsus_clear_all_cache', nonce: nonce },
                    complete: function(data) {
                        $('.clear-cache-spinner').css({ 'display': '', 'visibility': '' });
                    }
                });
            });

            $('.getting-started-close').click(function(event) {
                event.preventDefault();

                $('.getting-started-info').hide();

                $.ajax({
                    url: wps_js_vars.ajaxurl,
                    type: 'post',
                    data: { action: 'wpsus_close_getting_started' }
                });
            });
        },

        /**
         * Load the slider slider data.
         * 
         * Send an AJAX request with the slider id and the nonce, and
         * retrieve all the slider's database data. Then, assign the
         * data to the slides.
         *
         * @since 1.0.0
         */
        loadSliderData: function() {
            var that = this;

            $('.slide-spinner').css({ 'display': 'inline-block', 'visibility': 'visible' });

            $.ajax({
                url: wps_js_vars.ajaxurl,
                type: 'get',
                data: { action: 'wpsus_get_slider_data', id: wps_js_vars.id, nonce: wps_js_vars.lad_nonce },
                complete: function(data) {
                    var sliderData = $.parseJSON(data.responseText);

                    $.each(sliderData.slides, function(index, slide) {
                        var slideData = {
                            mainImage: {},
                            thumbnail: {},
                            caption: slide.caption,
                            layers: slide.layers,
                            html: slide.html,
                            settings: $.isArray(slide.settings) ? {} : slide.settings
                        };

                        $.each(slide, function(settingName, settingValue) {
                            if (settingName.indexOf('main_image') !== -1) {
                                slideData.mainImage[settingName] = settingValue;
                            } else if (settingName.indexOf('thumbnail') !== -1) {
                                slideData.thumbnail[settingName] = settingValue;
                            }
                        });

                        that.getSlide(index).setData('all', slideData);
                    });

                    $('.slide-spinner').css({ 'display': '', 'visibility': '' });
                }
            });
        },

        /**
         * Save the slider's data.
         * 
         * Get the slider's data and send it to the server with AJAX. If
         * a new slider was created, redirect to the slider's edit page.
         *
         * @since 1.0.0
         */
        saveSlider: function() {
            var sliderData = this.getSliderData();
            sliderData['nonce'] = wps_js_vars.sa_nonce;
            sliderData['action'] = 'save';

            var sliderDataString = JSON.stringify(sliderData);

            var spinner = $('.update-spinner').css({ 'display': 'inline-block', 'visibility': 'visible' });

            $.ajax({
                url: wps_js_vars.ajaxurl,
                type: 'post',
                data: { action: 'wpsus_save_slider', data: sliderDataString },
                complete: function(data) {
                    spinner.css({ 'display': '', 'visibility': '' });

                    if (parseInt(wps_js_vars.id, 10) === -1 && isNaN(data.responseText) === false) {
                        $('h2').after('<div class="updated"><p>' + wps_js_vars.slider_create + '</p></div>');

                        window.location = wps_js_vars.admin + '?page=wpsus&id=' + data.responseText + '&action=edit';
                    } else if ($('.updated').length === 0) {
                        $('h2').after('<div class="updated"><p>' + wps_js_vars.slider_update + '</p></div>');
                    }
                }
            });
        },

        /**
         * Get the slider's data.
         * 
         * Read the value of the sidebar settings, including the breakpoints,
         * the slides state, the name of the slider, the id, and get the
         * data for each slide.
         *
         * @since 1.0.0
         * 
         * @return {Object} The slider data.
         */
        getSliderData: function() {
            var that = this,
                sliderData = {
                    'id': wps_js_vars.id,
                    'name': $('input#title').val(),
                    'settings': {},
                    'slides': [],
                    'panels_state': {}
                },
                breakpoints = [];

            $('.slides-container').find('.slide').each(function(index) {
                var $slide = $(this),
                    slideData = that.getSlide(parseInt($slide.attr('data-id'), 10)).getData('all');

                slideData.position = parseInt($slide.attr('data-position'), 10);

                sliderData.slides[index] = slideData;
            });

            $('.sidebar-settings').find('.setting').each(function() {
                var setting = $(this);
                sliderData.settings[setting.attr('name')] = setting.attr('type') === 'checkbox' ? setting.is(':checked') : setting.val();
            });

            $('.breakpoints').find('.breakpoint').each(function() {
                var breakpointGroup = $(this),
                    breakpoint = { 'breakpoint_width': breakpointGroup.find('input[name="breakpoint_width"]').val() };

                breakpointGroup.find('.breakpoint-setting').each(function() {
                    var breakpointSetting = $(this);

                    breakpoint[breakpointSetting.attr('name')] = breakpointSetting.attr('type') === 'checkbox' ? breakpointSetting.is(':checked') : breakpointSetting.val();
                });

                breakpoints.push(breakpoint);
            });

            if (breakpoints.length > 0) {
                sliderData.settings.breakpoints = breakpoints;
            }

            $('.sidebar-settings').find('.postbox').each(function() {
                var slide = $(this);
                sliderData.panels_state[slide.attr('data-name')] = slide.hasClass('closed') ? 'closed' : '';
            });

            return sliderData;
        },

        /**
         * Preview the slider in the slider's edit page.
         *
         * @since 1.0.0
         */
        previewSlider: function() {
            PreviewWindow.open(this.getSliderData());
        },

        /**
         * Preview the slider in the sliders' list page.
         *
         * @since 1.0.0
         */
        previewSliderAll: function(target) {
            var url = $.lightURLParse(target.attr('href')),
                nonce = url.lad_nonce,
                id = parseInt(url.id, 10);

            $.ajax({
                url: wps_js_vars.ajaxurl,
                type: 'get',
                data: { action: 'wpsus_get_slider_data', id: id, nonce: nonce },
                complete: function(data) {
                    var sliderData = $.parseJSON(data.responseText);

                    PreviewWindow.open(sliderData);
                }
            });
        },

        /**
         * Update the settings presents
         * 
         * @since 1.0.0
         */
        updatePresets: function(target) {
            var url = $.lightURLParse(target.attr('href')),
                method = url.method,
                nonce = url.up_nonce,
                dialog,
                selectedPreset = $('.slider-setting-presets').val();

            if ((method === 'update' || method === 'delete') && selectedPreset === null) {
                return;
            }

            if (method === 'save-new') {
                dialog = $(
                    '<div class="modal-overlay"></div>' +
                    '<div class="modal-window-container">' +
                    '	<div class="modal-window save-new-preset-dialog">' +
                    '		<label>' + wps_js_vars.preset_name + '</label><input type="text" value="" class="preset-name">' +
                    '		<div class="dialog-buttons">' +
                    '			<a class="button dialog-ok" href="#">' + wps_js_vars.save + '</a>' +
                    '			<a class="button dialog-cancel" href="#">' + wps_js_vars.cancel + '</a>' +
                    '		</div>' +
                    '	</div>' +
                    '</div>'
                ).appendTo('body');
            } else if (method === 'update') {
                dialog = $(
                    '<div class="modal-overlay"></div>' +
                    '<div class="modal-window-container">' +
                    '	<div class="modal-window delete-preset-dialog">' +
                    '		<p>' + wps_js_vars.preset_update + '</p>' +
                    '		<div class="dialog-buttons">' +
                    '			<a class="button dialog-ok" href="#">' + wps_js_vars.yes + '</a>' +
                    '			<a class="button dialog-cancel" href="#">' + wps_js_vars.cancel + '</a>' +
                    '		</div>' +
                    '	</div>' +
                    '</div>'
                ).appendTo('body');
            } else if (method === 'delete') {
                dialog = $(
                    '<div class="modal-overlay"></div>' +
                    '<div class="modal-window-container">' +
                    '	<div class="modal-window delete-preset-dialog">' +
                    '		<p>' + wps_js_vars.preset_delete + '</p>' +
                    '		<div class="dialog-buttons">' +
                    '			<a class="button dialog-ok" href="#">' + wps_js_vars.yes + '</a>' +
                    '			<a class="button dialog-cancel" href="#">' + wps_js_vars.cancel + '</a>' +
                    '		</div>' +
                    '	</div>' +
                    '</div>'
                ).appendTo('body');
            }

            $('.modal-window-container').css('top', $(window).scrollTop());

            dialog.find('.dialog-ok').on('click', function(event) {
                event.preventDefault();

                var presetName = (method === 'save-new') ? dialog.find('.preset-name').val() : $('.slider-setting-presets').val(),
                    settings = {},
                    breakpoints = [];

                if (method === 'save-new' && (presetName === '' || $('.slider-setting-presets').find('option[value="' + presetName + '"]').length !== 0)) {
                    return;
                }

                $('.sidebar-settings').find('.setting').each(function() {
                    var setting = $(this);
                    settings[setting.attr('name')] = setting.attr('type') === 'checkbox' ? setting.is(':checked') : setting.val();
                });

                $('.breakpoints').find('.breakpoint').each(function() {
                    var breakpointGroup = $(this),
                        breakpoint = { 'breakpoint_width': breakpointGroup.find('input[name="breakpoint_width"]').val() };

                    breakpointGroup.find('.breakpoint-setting').each(function() {
                        var breakpointSetting = $(this);

                        breakpoint[breakpointSetting.attr('name')] = breakpointSetting.attr('type') === 'checkbox' ? breakpointSetting.is(':checked') : breakpointSetting.val();
                    });

                    breakpoints.push(breakpoint);
                });

                if (breakpoints.length > 0) {
                    settings.breakpoints = breakpoints;
                }

                $.ajax({
                    url: wps_js_vars.ajaxurl,
                    type: 'post',
                    data: { action: 'wpsus_update_presets', method: method, name: presetName, settings: JSON.stringify(settings), nonce: nonce },
                    complete: function(data) {
                        if (method === 'save-new') {
                            $('<option value="' + presetName + '">' + presetName + '</option>').appendTo($('.slider-setting-presets'));
                        } else if (method === 'delete') {
                            $('.slider-setting-presets').find('option[value="' + presetName + '"]').remove();
                        }
                    }
                });

                dialog.remove();
            });

            dialog.find('.dialog-cancel').one('click', function(event) {
                event.preventDefault();
                dialog.remove();
            });

            dialog.find('.modal-overlay').one('click', function(event) {
                dialog.remove();
            });
        },

        /**
         * Update the settings based on the selected preset.
         * 
         * @since 1.0.0
         *
         * @param  {stirng} presetName The name of the selected preset.
         */
        updateSettings: function(presetName) {
            $.ajax({
                url: wps_js_vars.ajaxurl,
                type: 'get',
                data: { action: 'wpsus_get_preset_settings', name: presetName },
                complete: function(data) {
                    var settings = $.parseJSON(data.responseText);

                    $.each(settings, function(name, value) {
                        var $settingField = $('.sidebar-settings').find('.setting[name="' + name + '"]');

                        if ($settingField.attr('type') === 'checkbox') {
                            if (value === true) {
                                $settingField.attr('checked', 'checked');
                            } else if (value === false) {
                                $settingField.removeAttr('checked');
                            }
                        } else {
                            $settingField.val(value);
                        }

                        $('.breakpoints').empty();

                        if (name === 'breakpoints') {
                            $.ajax({
                                url: wps_js_vars.ajaxurl,
                                type: 'get',
                                data: { action: 'wpsus_get_breakpoints_preset', data: JSON.stringify(value) },
                                complete: function(data) {
                                    $(data.responseText).appendTo($('.breakpoints'));
                                }
                            });
                        }
                    });
                }
            });
        },

        /**
         * Delete a slider.
         *
         * This is called in the sliders' list page upon clicking
         * the 'Delete' link.
         *
         * It displays a confirmation dialog before sending the request
         * for deletion to the server.
         *
         * The slider's row is removed after the slider is deleted
         * server-side.
         * 
         * @since 1.0.0
         *
         * @param  {jQuery Object} target The clicked 'Delete' link.
         */
        deleteSlider: function(target) {
            var url = $.lightURLParse(target.attr('href')),
                nonce = url.da_nonce,
                id = parseInt(url.id, 10),
                row = target.parents('tr');

            var dialog = $(
                '<div class="modal-overlay"></div>' +
                '<div class="modal-window-container">' +
                '	<div class="modal-window delete-slider-dialog">' +
                '		<p class="dialog-question">' + wps_js_vars.slider_delete + '</p>' +
                '		<div class="dialog-buttons">' +
                '			<a class="button dialog-ok" href="#">' + wps_js_vars.yes + '</a>' +
                '			<a class="button dialog-cancel" href="#">' + wps_js_vars.cancel + '</a>' +
                '		</div>' +
                '	</div>' +
                '</div>'
            ).appendTo('body');

            $('.modal-window-container').css('top', $(window).scrollTop());

            dialog.find('.dialog-ok').one('click', function(event) {
                event.preventDefault();

                $.ajax({
                    url: wps_js_vars.ajaxurl,
                    type: 'post',
                    data: { action: 'wpsus_delete_slider', id: id, nonce: nonce },
                    complete: function(data) {
                        if (id === parseInt(data.responseText, 10)) {
                            row.fadeOut(300, function() {
                                row.remove();
                            });
                        }
                    }
                });

                dialog.remove();
            });

            dialog.find('.dialog-cancel').one('click', function(event) {
                event.preventDefault();
                dialog.remove();
            });

            dialog.find('.modal-overlay').one('click', function(event) {
                dialog.remove();
            });
        },

        /**
         * Duplicate a slider.
         *
         * This is called in the sliders' list page upon clicking
         * the 'Duplicate' link.
         *
         * A new row is added in the list for the newly created
         * slider.
         * 
         * @since 1.0.0
         *
         * @param  {jQuery Object} target The clicked 'Duplicate' link.
         */
        duplicateSlider: function(target) {
            var url = $.lightURLParse(target.attr('href')),
                nonce = url.dua_nonce,
                id = parseInt(url.id, 10);

            $.ajax({
                url: wps_js_vars.ajaxurl,
                type: 'post',
                data: { action: 'wpsus_duplicate_slider', id: id, nonce: nonce },
                complete: function(data) {
                    var row = $(data.responseText).appendTo($('.sliders-list tbody'));

                    row.hide().fadeIn();
                }
            });
        },

        /**
         * Open the slider export window.
         *
         * This is called in the sliders' list page upon clicking
         * the 'Export' link.
         * 
         * @since 1.0.0
         *
         * @param  {jQuery Object} target The clicked 'Export' link.
         */
        exportSlider: function(target) {
            var url = $.lightURLParse(target.attr('href')),
                nonce = url.ea_nonce,
                id = parseInt(url.id, 10);

            ExportWindow.open(id, nonce);
        },

        /*
         * ======================================================================
         * Slide functions executed by the slider
         * ======================================================================
         */

        /**
         * Initialize all the existing slides when the page loads.
         * 
         * @since 1.0.0
         */
        initSlides: function() {
            var that = this;

            $('.slides-container').find('.slide').each(function(index) {
                that.initSlide($(this));
            });

            $('.slides-container').lightSortable({
                children: '.slide',
                placeholder: 'slide slide-placeholder',
                sortEnd: function(event) {
                    $('.slide').each(function(index) {
                        $(this).attr('data-position', index);
                    });
                }
            });
        },

        /**
         * Initialize an individual slide.
         *
         * Creates a new instance of the Slide object and adds it 
         * to the array of slides.
         *
         * @since 1.0.0
         * 
         * @param  {jQuery Object} element The slide element.
         * @param  {Object}        data    The slide's data.
         */
        initSlide: function(element, data) {
            var that = this,
                $slide = element,
                slide = new Slide($slide, this.slideCounter, data);

            this.slides.push(slide);

            slide.on('duplicateSlide', function(event) {
                that.duplicateSlide(event.slideData);
            });

            slide.on('deleteSlide', function(event) {
                that.deleteSlide(event.id);
            });

            $slide.attr('data-id', this.slideCounter);
            $slide.attr('data-position', this.slideCounter);

            this.slideCounter++;
        },

        /**
         * Return the slide data.
         *
         * @since 1.0.0
         * 
         * @param  {Int}    id The id of the slide to retrieve.
         * @return {Object}    The data of the retrieved slide.
         */
        getSlide: function(id) {
            var that = this,
                selectedSlide;

            $.each(that.slides, function(index, slide) {
                if (slide.id === id) {
                    selectedSlide = slide;
                    return false;
                }
            });

            return selectedSlide;
        },

        /**
         * Duplicate an individual slide.
         *
         * The main image is sent to the server for the purpose
         * of adding it to the slide preview, while the rest of the data
         * is passed with JS.
         *
         * @since 1.0.0
         * 
         * @param  {Object} slideData The data of the object to be duplicated.
         */
        duplicateSlide: function(slideData) {
            var that = this,
                newSlideData = $.extend(true, {}, slideData),
                data = [{
                    settings: {
                        content_type: newSlideData.settings.content_type
                    },
                    main_image_source: newSlideData.mainImage.main_image_source
                }];

            $.ajax({
                url: wps_js_vars.ajaxurl,
                type: 'post',
                data: { action: 'wpsus_add_slides', data: JSON.stringify(data) },
                complete: function(data) {
                    var slide = $(data.responseText).appendTo($('.slides-container'));

                    that.initSlide(slide, newSlideData);
                }
            });
        },

        /**
         * Delete an individual slide.
         *
         * The main image is sent to the server for the purpose
         * of adding it to the slide preview, while the rest of the data
         * is passed with JS.
         *
         * @since 1.0.0
         * 
         * @param  {Int} id The id of the slide to be deleted.
         */
        deleteSlide: function(id) {
            var that = this,
                slide = that.getSlide(id),
                dialog = $(
                    '<div class="modal-overlay"></div>' +
                    '<div class="modal-window-container">' +
                    '	<div class="modal-window delete-slide-dialog">' +
                    '		<p class="dialog-question">' + wps_js_vars.slide_delete + '</p>' +
                    '		<div class="dialog-buttons">' +
                    '			<a class="button dialog-ok" href="#">' + wps_js_vars.yes + '</a>' +
                    '			<a class="button dialog-cancel" href="#">' + wps_js_vars.cancel + '</a>' +
                    '		</div>' +
                    '	</div>' +
                    '</div>').appendTo('body');

            $('.modal-window-container').css('top', $(window).scrollTop());

            dialog.find('.dialog-ok').one('click', function(event) {
                event.preventDefault();

                slide.off('duplicateSlide');
                slide.off('deleteSlide');
                slide.remove();
                dialog.remove();

                that.slides.splice($.inArray(slide, that.slides), 1);
            });

            dialog.find('.dialog-cancel').one('click', function(event) {
                event.preventDefault();
                dialog.remove();
            });

            dialog.find('.modal-overlay').one('click', function(event) {
                dialog.remove();
            });
        },

        /**
         * Add an empty slide.
         *
         * @since 1.0.0
         */
        addEmptySlide: function() {
            var that = this;

            $.ajax({
                url: wps_js_vars.ajaxurl,
                type: 'post',
                data: { action: 'wpsus_add_slides' },
                complete: function(data) {
                    var slide = $(data.responseText).appendTo($('.slides-container'));

                    that.initSlide(slide);
                }
            });
        },

        /**
         * Add image slide(s).
         *
         * Add one or multiple slides pre-populated with image data.
         *
         * @since 1.0.0
         */
        addImageSlides: function() {
            var that = this;

            MediaLoader.open(function(selection) {
                var images = [];

                $.each(selection, function(index, image) {
                    images.push({
                        main_image_id: image.id,
                        main_image_source: image.url,
                        main_image_alt: image.alt,
                        main_image_title: image.title,
                        main_image_width: image.width,
                        main_image_height: image.height
                    });
                });

                $.ajax({
                    url: wps_js_vars.ajaxurl,
                    type: 'post',
                    data: { action: 'wpsus_add_slides', data: JSON.stringify(images) },
                    complete: function(data) {
                        var lastIndex = $('.slides-container').find('.slide').length - 1,
                            slides = $('.slides-container').append(data.responseText),
                            indexes = lastIndex === -1 ? '' : ':gt(' + lastIndex + ')';

                        slides.find('.slide' + indexes).each(function(index) {
                            var slide = $(this);

                            that.initSlide(slide, { mainImage: images[index], thumbnail: {}, caption: '', layers: {}, html: '', settings: {} });
                        });
                    }
                });
            });
        },

        /**
         * Add posts slide.
         *
         * Add a posts slide and pre-populate it with dynamic tags.
         *
         * Also, automatically open the Setting editor to allow the
         * user to configurate the WordPress query.
         *
         * @since 1.0.0
         */
        addPostsSlides: function() {
            var that = this,
                data = [{
                    settings: {
                        content_type: 'posts'
                    }
                }];

            $.ajax({
                url: wps_js_vars.ajaxurl,
                type: 'post',
                data: { action: 'wpsus_add_slides', data: JSON.stringify(data) },
                complete: function(data) {
                    var slide = $(data.responseText).appendTo($('.slides-container')),
                        slideId = that.slideCounter;

                    that.initSlide(slide, {
                        mainImage: {
                            main_image_source: '[wps_image_src]',
                            main_image_alt: '[wps_image_alt]',
                            main_image_link: '[wps_link_url]'
                        },
                        thumbnail: {},
                        caption: '',
                        layers: [{
                            id: 1,
                            name: 'Layer 1',
                            type: 'paragraph',
                            text: '[wps_title]',
                            settings: {
                                position: 'bottomLeft',
                                horizontal: '0',
                                vertical: '0',
                                preset_styles: ['wps-black', 'wps-padding']
                            }
                        }],
                        html: '',
                        settings: {
                            content_type: 'posts'
                        }
                    });

                    SettingsEditor.open(slideId);
                }
            });
        },

        /**
         * Add gallery slide.
         *
         * Add a gallery slide and pre-populate it with dynamic tags.
         *
         * Also, automatically open the Setting editor inform the user
         * on how to use this slide type.
         *
         * @since 1.0.0
         */
        addGallerySlides: function() {
            var that = this,
                data = [{
                    settings: {
                        content_type: 'gallery'
                    }
                }];

            $.ajax({
                url: wps_js_vars.ajaxurl,
                type: 'post',
                data: { action: 'wpsus_add_slides', data: JSON.stringify(data) },
                complete: function(data) {
                    var slide = $(data.responseText).appendTo($('.slides-container')),
                        slideId = that.slideCounter;

                    that.initSlide(slide, {
                        mainImage: {
                            main_image_source: '[wps_image_src]',
                            main_image_alt: '[wps_image_alt]'
                        },
                        thumbnail: {},
                        caption: '',
                        layers: {},
                        html: '',
                        settings: {
                            content_type: 'gallery'
                        }
                    });

                    SettingsEditor.open(slideId);
                }
            });
        },

        /**
         * Add Flickr slide.
         *
         * Add a Flickr slide and pre-populate it with dynamic tags.
         *
         * Also, automatically open the Setting editor to allow the
         * user to configurate the Flickr query.
         *
         * @since 1.0.0
         */
        addFlickrSlides: function() {
            var that = this,
                data = [{
                    settings: {
                        content_type: 'flickr'
                    }
                }];

            $.ajax({
                url: wps_js_vars.ajaxurl,
                type: 'post',
                data: { action: 'wpsus_add_slides', data: JSON.stringify(data) },
                complete: function(data) {
                    var slide = $(data.responseText).appendTo($('.slides-container')),
                        slideId = that.slideCounter;

                    that.initSlide(slide, {
                        mainImage: {
                            main_image_source: '[wps_image_src]',
                            main_image_link: '[wps_image_link]'
                        },
                        thumbnail: {},
                        caption: '',
                        layers: [{
                            id: 1,
                            name: 'Layer 1',
                            type: 'paragraph',
                            text: '[wps_image_description]',
                            settings: {
                                position: 'bottomLeft',
                                horizontal: '0',
                                vertical: '0',
                                preset_styles: ['wps-black', 'wps-padding']
                            }
                        }],
                        html: '',
                        settings: {
                            content_type: 'flickr'
                        }
                    });

                    SettingsEditor.open(slideId);
                }
            });
        },

        /*
         * ======================================================================
         * More slider functions
         * ======================================================================
         */

        /**
         * Add a breakpoint fieldset.
         *
         * Also, try to automatically assigns the width of the breakpoint.
         * 
         * @since 1.0.0
         */
        addBreakpoint: function() {
            var that = this,
                size = '',
                previousWidth = $('input[name="breakpoint_width"]').last().val();

            if (typeof previousWidth === 'undefined') {
                size = '960';
            } else if (previousWidth !== '') {
                size = previousWidth - 190;
            }

            $.ajax({
                url: wps_js_vars.ajaxurl,
                type: 'get',
                data: { action: 'wpsus_add_breakpoint', data: size },
                complete: function(data) {
                    $(data.responseText).appendTo($('.breakpoints'));
                }
            });
        },

        /**
         * Add a breakpoint setting.
         * 
         * @since 1.0.0
         */
        addBreakpointSetting: function(name, context) {
            var that = this;

            $.ajax({
                url: wps_js_vars.ajaxurl,
                type: 'get',
                data: { action: 'wpsus_add_breakpoint_setting', data: name },
                complete: function(data) {
                    $(data.responseText).appendTo(context);
                }
            });
        },

        /**
         * Load the taxonomies for the selected post names and 
         * pass all the returned data to the callback function.
         *
         * Only load the taxonomies for a particular post name if
         * it's not already available in the 'postsData' property,
         * which stores all the posts data loaded in a session.
         *
         * @since 1.0.0
         * 
         * @param  {Array}    posts    Array of post names.
         * @param  {Function} callback Function to call after the taxonomies are loaded.
         */
        getTaxonomies: function(posts, callback) {
            var that = this,
                postsToLoad = [];

            $.each(posts, function(index, postName) {
                if (typeof that.postsData[postName] === 'undefined') {
                    postsToLoad.push(postName);
                }
            });

            if (postsToLoad.length !== 0) {
                $.ajax({
                    url: wps_js_vars.ajaxurl,
                    type: 'get',
                    data: { action: 'wpsus_get_taxonomies', post_names: JSON.stringify(postsToLoad) },
                    complete: function(data) {
                        var response = $.parseJSON(data.responseText);

                        $.each(response, function(name, taxonomy) {
                            that.postsData[name] = taxonomy;
                        });

                        callback(that.postsData);
                    }
                });
            } else {
                callback(this.postsData);
            }
        },

        /**
         * Display the informative tooltip.
         * 
         * @since 1.0.0
         * 
         * @param  {jQuery Object} target The setting label which is hovered.
         */
        showInfo: function(target) {
            var label = target,
                info = label.attr('data-info'),
                infoTooltip = null;

            if (typeof info !== 'undefined') {
                infoTooltip = $('<div class="info-tooltip">' + info + '</div>').appendTo(label.parent());
                infoTooltip.css({ 'left': -infoTooltip.outerWidth(true), 'marginTop': -infoTooltip.outerHeight(true) * 0.5 - 9 });
            }

            label.on('mouseout', function() {
                if (infoTooltip !== null) {
                    infoTooltip.remove();
                }
            });
        },

        /**
         * Iterate through all slides and resizes the preview
         * images based on their aspect ratio and the slide's
         * current aspect ratio.
         *
         * @since 1.0.0
         */
        resizeSlideImages: function() {
            var slideRatio = $('.slide-preview').width() / $('.slide-preview').height();

            $('.slide-preview > img').each(function() {
                var image = $(this);

                if (image.width() / image.height() > slideRatio) {
                    image.css({ width: 'auto', height: '100%' });
                } else {
                    image.css({ width: '100%', height: 'auto' });
                }
            });
        }
    };

    /*
     * ======================================================================
     * Export and import functions
     * ======================================================================
     */

    var ExportWindow = {

        /**
         * Reference to the modal window.
         *
         * @since 1.0.0
         * 
         * @type {jQuery Object}
         */
        exportWindow: null,

        /**
         * Open the modal window.
         *
         * @since 1.0.0
         * 
         * @param  {Int}    id    The id of the slider.
         * @param  {string} nonce A security nonce.
         */
        open: function(id, nonce) {
            var that = this;

            $.ajax({
                url: wps_js_vars.ajaxurl,
                type: 'post',
                data: { action: 'wpsus_export_slider', id: id, nonce: nonce },
                complete: function(data) {
                    that.exportWindow = $(data.responseText).appendTo($('body'));
                    that.init();
                }
            });
        },

        /**
         * Add event listeners to the buttons.
         * 
         * @since 1.0.0
         */
        init: function() {
            var that = this;

            this.exportWindow.find('.close-x').on('click', function(event) {
                event.preventDefault();
                that.close();
            });

            this.exportWindow.find('textarea').on('click', function(event) {
                event.preventDefault();

                $(this).focus();
                $(this).select();
            });
        },

        /**
         * Handle window closing.
         * 
         * @since 1.0.0
         */
        close: function() {
            this.exportWindow.find('.close-x').off('click');
            this.exportWindow.find('textarea').off('click');
            this.exportWindow.remove();
        }
    };

    var ImportWindow = {

        /**
         * Reference to the modal window.
         *
         * @since 1.0.0
         * 
         * @type {jQuery Object}
         */
        importWindow: null,

        /**
         * Open the modal window.
         *
         * @since 1.0.0
         */
        open: function() {
            var that = this;

            $.ajax({
                url: wps_js_vars.ajaxurl,
                type: 'post',
                data: { action: 'wpsus_import_slider' },
                complete: function(data) {
                    that.importWindow = $(data.responseText).appendTo($('body'));
                    that.init();
                }
            });
        },

        /**
         * Add event listeners to the buttons.
         * 
         * @since 1.0.0
         */
        init: function() {
            var that = this;

            this.importWindow.find('.close-x').on('click', function(event) {
                event.preventDefault();
                that.close();
            });

            this.importWindow.find('.save').on('click', function(event) {
                event.preventDefault();
                that.save();
            });
        },

        /**
         * Save the entered data.
         *
         * The entered JSON string is parsed, and it's sent to the server-side
         * saving method.
         *
         * After the slider is created, a new row is added to the list.
         * 
         * @since 1.0.0
         */
        save: function() {
            var that = this,
                sliderDataString = this.importWindow.find('textarea').val();

            if (sliderDataString === '') {
                return;
            }

            var sliderData = $.parseJSON(sliderDataString);
            sliderData['id'] = -1;
            sliderData['nonce'] = wps_js_vars.sa_nonce;
            sliderData['action'] = 'import';
            sliderDataString = JSON.stringify(sliderData);

            $.ajax({
                url: wps_js_vars.ajaxurl,
                type: 'post',
                data: { action: 'wpsus_save_slider', data: sliderDataString },
                complete: function(data) {
                    if ($('.sliders-list .no-slider-row').length !== 0) {
                        $('.sliders-list .no-slider-row').remove();
                    }

                    var row = $(data.responseText).appendTo($('.sliders-list tbody'));

                    row.hide().fadeIn();
                    that.close();
                }
            });
        },

        /**
         * Handle window closing.
         * 
         * @since 1.0.0
         */
        close: function() {
            this.importWindow.find('.close-x').off('click');
            this.importWindow.find('.save').off('click');
            this.importWindow.remove();
        }
    };

    /*
     * ======================================================================
     * Slide functions
     * ======================================================================
     */

    /**
     * Slide object.
     *
     * @since 1.0.0
     * 
     * @param {jQuery Object} element The jQuery element.
     * @param {Int}           id      The id of the slide.
     * @param {Object}        data    The data of the slide.
     */
    var Slide = function(element, id, data) {
        this.$slide = element;
        this.id = id;
        this.data = data;
        this.events = $({});

        if (typeof this.data === 'undefined') {
            this.data = { mainImage: {}, thumbnail: {}, caption: '', layers: {}, html: '', settings: {} };
        }

        this.init();
    };

    Slide.prototype = {

        /**
         * Initialize the slide.
         * 
         * Add the necessary event listeners.
         *
         * @since 1.0.0
         */
        init: function() {
            var that = this;

            this.$slide.find('.slide-preview').on('click', function(event) {
                var contentType = that.getData('settings')['content_type'];

                if (typeof contentType === 'undefined' || contentType === 'custom') {
                    MediaLoader.open(function(selection) {
                        var image = selection[0];

                        that.setData('mainImage', { main_image_id: image.id, main_image_source: image.url, main_image_alt: image.alt, main_image_title: image.title, main_image_width: image.width, main_image_height: image.height });
                        that.updateSlidePreview();
                    });
                }
            });

            this.$slide.find('.edit-main-image').on('click', function(event) {
                event.preventDefault();
                MainImageEditor.open(that.id);
            });

            this.$slide.find('.edit-thumbnail').on('click', function(event) {
                event.preventDefault();
                ThumbnailEditor.open(that.id);
            });

            this.$slide.find('.edit-caption').on('click', function(event) {
                event.preventDefault();
                CaptionEditor.open(that.id);
            });

            this.$slide.find('.edit-layers').on('click', function(event) {
                event.preventDefault();
                LayersEditor.open(that.id);
            });

            this.$slide.find('.edit-html').on('click', function(event) {
                event.preventDefault();
                HTMLEditor.open(that.id);
            });

            this.$slide.find('.edit-settings').on('click', function(event) {
                event.preventDefault();
                SettingsEditor.open(that.id);
            });

            this.$slide.find('.delete-slide').on('click', function(event) {
                event.preventDefault();
                that.trigger({ type: 'deleteSlide', id: that.id });
            });

            this.$slide.find('.duplicate-slide').on('click', function(event) {
                event.preventDefault();
                that.trigger({ type: 'duplicateSlide', slideData: that.data });
            });

            this.resizeImage();
        },

        /**
         * Return the slide's data.
         *
         * It can return the main image data, or the layers
         * data, or the HTML data, or the settings data, or
         * all the data.
         *
         * @since 1.0.0
         * 
         * @param  {String} target The type of data to return.
         * @return {Object}        The requested data.
         */
        getData: function(target) {
            if (target === 'all') {
                var allData = {};

                $.each(this.data.mainImage, function(settingName, settingValue) {
                    allData[settingName] = settingValue;
                });

                $.each(this.data.thumbnail, function(settingName, settingValue) {
                    allData[settingName] = settingValue;
                });

                allData['caption'] = this.data.caption;
                allData['layers'] = this.data.layers;
                allData['html'] = this.data.html;
                allData['settings'] = this.data.settings;

                return allData;
            } else if (target === 'mainImage') {
                return this.data.mainImage;
            } else if (target === 'thumbnail') {
                return this.data.thumbnail;
            } else if (target === 'caption') {
                return this.data.caption;
            } else if (target === 'layers') {
                return this.data.layers;
            } else if (target === 'html') {
                return this.data.html;
            } else if (target === 'settings') {
                return this.data.settings;
            }
        },

        /**
         * Set the slide's data.
         *
         * It can set a specific data type, like the main image, 
         * layers, html, settings, or it can set all the data.
         *
         * @since 1.0.0
         * 
         * @param  {String} target The type of data to set.
         * @param  {Object} data   The data to attribute to the slide.
         */
        setData: function(target, data) {
            var that = this;

            if (target === 'all') {
                this.data = data;
            } else if (target === 'mainImage') {
                $.each(data, function(name, value) {
                    that.data.mainImage[name] = value;
                });
            } else if (target === 'thumbnail') {
                $.each(data, function(name, value) {
                    that.data.thumbnail[name] = value;
                });
            } else if (target === 'caption') {
                this.data.caption = data;
            } else if (target === 'layers') {
                this.data.layers = data;
            } else if (target === 'html') {
                this.data.html = data;
            } else if (target === 'settings') {
                this.data.settings = data;
            }
        },

        /**
         * Remove the slide.
         * 
         * @since 1.0.0
         */
        remove: function() {
            this.$slide.find('.slide-preview').off('click');
            this.$slide.find('.edit-main-image').off('click');
            this.$slide.find('.edit-caption').off('click');
            this.$slide.find('.edit-layers').off('click');
            this.$slide.find('.edit-html').off('click');
            this.$slide.find('.edit-settings').off('click');
            this.$slide.find('.delete-slide').off('click');
            this.$slide.find('.duplicate-slide').off('click');

            this.$slide.fadeOut(500, function() {
                $(this).remove();
            });
        },

        /**
         * Update the slide's preview.
         *
         * If the content type is custom, the preview will consist
         * of an image. If the content is dynamic, a text will be 
         * displayed that indicates the type of content (i.e., posts).
         *
         * This is called when the main image is changed or
         * when the content type is changed.
         * 
         * @since 1.0.0
         */
        updateSlidePreview: function() {
            var slidePreview = this.$slide.find('.slide-preview'),
                contentType = this.data.settings['content_type'];

            slidePreview.empty();

            if (typeof contentType === 'undefined' || contentType === 'custom') {
                var mainImageSource = this.data.mainImage['main_image_source'];

                if (typeof mainImageSource !== 'undefined' && mainImageSource !== '') {
                    $('<img src="' + mainImageSource + '" />').appendTo(slidePreview);
                    this.resizeImage();
                } else {
                    $('<p class="no-image">' + wps_js_vars.no_image + '</p>').appendTo(slidePreview);
                }

                this.$slide.removeClass('dynamic-slide');
            } else if (contentType === 'posts') {
                $('<p>[ ' + wps_js_vars.posts_slides + ' ]</p>').appendTo(slidePreview);
                this.$slide.addClass('dynamic-slide');
            } else if (contentType === 'gallery') {
                $('<p>[ ' + wps_js_vars.gallery_slides + ' ]</p>').appendTo(slidePreview);
                this.$slide.addClass('dynamic-slide');
            } else if (contentType === 'flickr') {
                $('<p>[ ' + wps_js_vars.flickr_slides + ' ]</p>').appendTo(slidePreview);
                this.$slide.addClass('dynamic-slide');
            }
        },

        /**
         * Resize the preview image, after it has loaded.
         *
         * @since 1.0.0
         */
        resizeImage: function() {
            var slidePreview = this.$slide.find('.slide-preview'),
                slideImage = this.$slide.find('.slide-preview > img');

            if (slideImage.length) {
                var checkImage = setInterval(function() {
                    if (slideImage[0].complete === true) {
                        clearInterval(checkImage);

                        if (slideImage.width() / slideImage.height() > slidePreview.width() / slidePreview.height()) {
                            slideImage.css({ width: 'auto', height: '100%' });
                        } else {
                            slideImage.css({ width: '100%', height: 'auto' });
                        }
                    }
                }, 100);
            }
        },

        /**
         * Add an event listener to the slide.
         *
         * @since 1.0.0
         * 
         * @param  {String}   type    The event name.
         * @param  {Function} handler The callback function.
         */
        on: function(type, handler) {
            this.events.on(type, handler);
        },

        /**
         * Remove an event listener from the slide.
         *
         * @since 1.0.0
         * 
         * @param  {String} type The event name.
         */
        off: function(type) {
            this.events.off(type);
        },

        /**
         * Triggers an event.
         *
         * @since 1.0.0
         * 
         * @param  {String} type The event name.
         */
        trigger: function(type) {
            this.events.triggerHandler(type);
        }
    };

    /*
     * ======================================================================
     * Main Image Editor
     * ======================================================================
     */

    var MainImageEditor = {

        /**
         * Reference to the modal window.
         *
         * @since 1.0.0
         * 
         * @type {jQuery Object}
         */
        editor: null,

        /**
         * Reference to slide for which the editor was opened.
         *
         * @since 1.0.0
         * 
         * @type {Slide}
         */
        currentSlide: null,

        /**
         * Indicates whether the slide's preview needs to be updated.
         *
         * @since 1.0.0
         * 
         * @type {Boolean}
         */
        needsPreviewUpdate: false,

        /**
         * Open the modal window.
         *
         * It checks the content type set for the slide and passes
         * that information because the aspect of the editor will
         * depend on what type the content is. Dynamic slides will
         * not have the possibility to load images from the library.
         *
         * @since 1.0.0
         * 
         * @param  {Int} id The id of the slide
         */
        open: function(id) {
            this.currentSlide = WpSusAdmin.getSlide(id);

            var that = this,
                data = this.currentSlide.getData('mainImage'),
                contentType = this.currentSlide.getData('settings')['content_type'],
                spinner = $('.slide[data-id="' + id + '"]').find('.slide-spinner').css({ 'display': 'inline-block', 'visibility': 'visible' });

            if (typeof contentType === 'undefined') {
                contentType = 'custom';
            }

            $.ajax({
                url: wps_js_vars.ajaxurl,
                type: 'post',
                dataType: 'html',
                data: { action: 'wpsus_load_main_image_editor', data: JSON.stringify(data), content_type: contentType },
                complete: function(data) {
                    $('body').append(data.responseText);
                    that.init();

                    spinner.css({ 'display': '', 'visibility': '' });
                }
            });
        },

        /**
         * Initialize the editor.
         *
         * Add the necessary event listeners.
         * 
         * @since 1.0.0
         */
        init: function() {
            var that = this;

            $('.modal-window-container').css('top', $(window).scrollTop());

            this.$editor = $('.main-image-editor');

            this.$editor.find('.close-x').on('click', function(event) {
                event.preventDefault();
                that.save();
                that.close();
            });

            this.$editor.find('.image-loader, .additional-image-loader').on('click', function(event) {
                event.preventDefault();
                that.openMediaLibrary(event);
            });

            this.$editor.find('.clear-fieldset').on('click', function(event) {
                event.preventDefault();
                that.clearFieldset(event);
            });

            this.$editor.find('input[name="main_image_source"]').on('input', function(event) {
                that.needsPreviewUpdate = true;
            });
        },

        /**
         * Open the Media library.
         *
         * Allows the user to select an image from the library for
         * the current slide. It checks if the image needs to be added
         * for the main image or for the retina image.
         *
         * It updates the editor's fields with information associated
         * with the image, like the image's alt, title, width and height.
         * 
         * @since 1.0.0
         * 
         * @param  {Event Object} event The mouse click event.
         */
        openMediaLibrary: function(event) {
            event.preventDefault();

            var that = this,
                imageLoader = this.$editor.find('.main-image .image-loader'),
                additionalImage = $(event.target).hasClass('additional-image-loader'),
                additionalImageInput = $(event.target).siblings('input');

            MediaLoader.open(function(selection) {
                var image = selection[0];

                if (additionalImage === true) {
                    additionalImageInput.val(image.url);
                } else {
                    if (imageLoader.find('img').length !== 0) {
                        imageLoader.find('img').attr('src', image.url);
                    } else {
                        imageLoader.find('.no-image').remove();
                        $('<img src="' + image.url + '" />').appendTo(imageLoader);
                    }

                    that.$editor.find('input[name="main_image_id"]').val(image.id);
                    that.$editor.find('input[name="main_image_source"]').val(image.url);
                    that.$editor.find('input[name="main_image_alt"]').val(image.alt);
                    that.$editor.find('input[name="main_image_title"]').val(image.title);
                    that.$editor.find('input[name="main_image_width"]').val(image.width);
                    that.$editor.find('input[name="main_image_height"]').val(image.height);

                    that.needsPreviewUpdate = true;
                }
            });
        },

        /**
         * Clear the input fields for the image.
         * 
         * @since 1.0.0
         * 
         * @param  {Event Object} event The mouse click event.
         */
        clearFieldset: function(event) {
            event.preventDefault();

            var target = $(event.target).parents('.fieldset'),
                imageLoader = target.find('.image-loader');

            target.find('input').val('');

            if (imageLoader.find('img').length !== 0) {
                imageLoader.find('img').remove();
                $('<p class="no-image">' + wps_js_vars.no_image + '</p>').appendTo(imageLoader);

                this.needsPreviewUpdate = true;
            }
        },

        /**
         * Save the data entered in the editor.
         *
         * Iterates through all input fields and copies the
         * data entered in an object, which is then passed
         * to the slide.
         *
         * It also calls the function that updates the slide's
         * preview, if the main image was changed.
         * 
         * @since 1.0.0
         */
        save: function() {
            var that = this,
                data = {};

            this.$editor.find('.field').each(function() {
                var field = $(this);
                data[field.attr('name')] = field.val();
            });

            this.currentSlide.setData('mainImage', data);

            if (this.needsPreviewUpdate === true) {
                this.currentSlide.updateSlidePreview();
                this.needsPreviewUpdate = false;
            }
        },

        /**
         * Close the editor.
         *
         * Remove all event listeners.
         * 
         * @since 1.0.0
         */
        close: function() {
            this.$editor.find('.close-x').off('click');
            this.$editor.find('.image-loader').off('click');
            this.$editor.find('.additional-image-loader').off('click');
            this.$editor.find('.clear-fieldset').off('click');
            this.$editor.find('input[name="main_image_source"]').off('input');

            $('body').find('.modal-overlay, .modal-window-container').remove();
        }
    };

    /*
     * ======================================================================
     * Thumbnail Editor
     * ======================================================================
     */

    var ThumbnailEditor = {

        /**
         * Reference to the modal window.
         *
         * @since 1.0.0
         * 
         * @type {jQuery Object}
         */
        editor: null,

        /**
         * Reference to slide for which the editor was opened.
         *
         * @since 1.0.0
         * 
         * @type {Slide}
         */
        currentSlide: null,

        /**
         * Open the modal window.
         *
         * It checks the content type set for the slide and passes
         * that information because the aspect of the editor will
         * depend on what type the content is. Dynamic slides will
         * not have the possibility to load images from the library.
         *
         * @since 1.0.0
         * 
         * @param  {Int} id The id of the slide
         */
        open: function(id) {
            this.currentSlide = WpSusAdmin.getSlide(id);

            var that = this,
                data = this.currentSlide.getData('thumbnail'),
                contentType = this.currentSlide.getData('settings')['content_type'],
                spinner = $('.slide[data-id="' + id + '"]').find('.slide-spinner').css({ 'display': 'inline-block', 'visibility': 'visible' });

            if (typeof contentType === 'undefined') {
                contentType = 'custom';
            }

            $.ajax({
                url: wps_js_vars.ajaxurl,
                type: 'post',
                dataType: 'html',
                data: { action: 'wpsus_load_thumbnail_editor', data: JSON.stringify(data), content_type: contentType },
                complete: function(data) {
                    $('body').append(data.responseText);
                    that.init();

                    spinner.css({ 'display': '', 'visibility': '' });
                }
            });
        },

        /**
         * Initialize the editor.
         *
         * Add the necessary event listeners.
         * 
         * @since 1.0.0
         */
        init: function() {
            var that = this;

            $('.modal-window-container').css('top', $(window).scrollTop());

            this.$editor = $('.thumbnail-editor');

            this.$editor.find('.close-x').on('click', function(event) {
                event.preventDefault();
                that.save();
                that.close();
            });

            this.$editor.find('.image-loader, .additional-image-loader').on('click', function(event) {
                event.preventDefault();
                that.openMediaLibrary(event);
            });

            this.$editor.find('.clear-fieldset').on('click', function(event) {
                event.preventDefault();
                that.clearFieldset(event);
            });
        },

        /**
         * Open the Media library.
         *
         * Allows the user to select an image from the library for
         * the current slide. It checks if the image needs to be added
         * for the main image or for the retina image.
         *
         * It updates the editor's fields with information associated
         * with the image, like the image's alt, title, width and height.
         * 
         * @since 1.0.0
         * 
         * @param  {Event Object} event The mouse click event.
         */
        openMediaLibrary: function(event) {
            event.preventDefault();

            var that = this,
                imageLoader = this.$editor.find('.thumbnail .image-loader'),
                additionalImage = $(event.target).hasClass('additional-image-loader'),
                additionalImageInput = $(event.target).siblings('input');

            MediaLoader.open(function(selection) {
                var image = selection[0];

                if (additionalImage === true) {
                    additionalImageInput.val(image.url);
                } else {
                    if (imageLoader.find('img').length !== 0) {
                        imageLoader.find('img').attr('src', image.url);
                    } else {
                        imageLoader.find('.no-image').remove();
                        $('<img src="' + image.url + '" />').appendTo(imageLoader);
                    }

                    that.$editor.find('input[name="thumbnail_source"]').val(image.url);
                    that.$editor.find('input[name="thumbnail_alt"]').val(image.alt);
                    that.$editor.find('input[name="thumbnail_title"]').val(image.title);
                }
            });
        },

        /**
         * Clear the input fields for the image.
         * 
         * @since 1.0.0
         * 
         * @param  {Event Object} event The mouse click event.
         */
        clearFieldset: function(event) {
            event.preventDefault();

            var target = $(event.target).parents('.fieldset'),
                imageLoader = target.find('.image-loader');

            target.find('input').val('');

            if (imageLoader.find('img').length !== 0) {
                imageLoader.find('img').remove();
                $('<p class="no-image">' + wps_js_vars.no_image + '</p>').appendTo(imageLoader);
            }
        },

        /**
         * Save the data entered in the editor.
         *
         * Iterates through all input fields and copies the
         * data entered in an object, which is then passed
         * to the slide.
         *
         * It also calls the function that updates the slide's
         * preview, if the main image was changed.
         * 
         * @since 1.0.0
         */
        save: function() {
            var that = this,
                data = {};

            this.$editor.find('.field').each(function() {
                var field = $(this);
                data[field.attr('name')] = field.val();
            });

            this.currentSlide.setData('thumbnail', data);
        },

        /**
         * Close the editor.
         *
         * Remove all event listeners.
         * 
         * @since 1.0.0
         */
        close: function() {
            this.$editor.find('.close-x').off('click');
            this.$editor.find('.image-loader').off('click');
            this.$editor.find('.additional-image-loader').off('click');
            this.$editor.find('.clear-fieldset').off('click');
            this.$editor.find('input[name="thumbnail_source"]').off('input');

            $('body').find('.modal-overlay, .modal-window-container').remove();
        }
    };

    /*
     * ======================================================================
     * Caption editor
     * ======================================================================
     */

    var CaptionEditor = {

        /**
         * Reference to the modal window.
         *
         * @since 1.0.0
         * 
         * @type {jQuery Object}
         */
        editor: null,

        /**
         * Reference to slide for which the editor was opened.
         *
         * @since 1.0.0
         * 
         * @type {Slide}
         */
        currentSlide: null,

        /**
         * Open the modal window.
         *
         * @since 1.0.0
         * 
         * @param  {Int} id The id of the slide.
         */
        open: function(id) {
            this.currentSlide = WpSusAdmin.getSlide(id);

            var that = this,
                data = this.currentSlide.getData('caption'),
                spinner = $('.slide[data-id="' + id + '"]').find('.slide-spinner').css({ 'display': 'inline-block', 'visibility': 'visible' }),
                contentType = this.currentSlide.getData('settings')['content_type'];

            $.ajax({
                url: wps_js_vars.ajaxurl,
                type: 'post',
                dataType: 'html',
                data: { action: 'wpsus_load_caption_editor', data: data, content_type: contentType },
                complete: function(data) {
                    $('body').append(data.responseText);
                    that.init();

                    spinner.css({ 'display': '', 'visibility': '' });
                }
            });
        },

        /**
         * Initialize the editor.
         *
         * Add the necessary event listeners.
         * 
         * @since 1.0.0
         */
        init: function() {
            var that = this;

            $('.modal-window-container').css('top', $(window).scrollTop());

            this.$editor = $('.caption-editor');

            this.$editor.find('.close-x').on('click', function(event) {
                event.preventDefault();
                that.save();
                that.close();
            });
        },

        /**
         * Save the content entered in the editor's textfield.
         * 
         * @since 1.0.0
         */
        save: function() {
            this.currentSlide.setData('caption', this.$editor.find('textarea').val());
        },

        /**
         * Close the editor.
         *
         * Remove all event listeners.
         * 
         * @since 1.0.0
         */
        close: function() {
            this.$editor.find('.close-x').off('click');

            $('body').find('.modal-overlay, .modal-window-container').remove();
        }
    };

    /*
     * ======================================================================
     * HTML editor
     * ======================================================================
     */

    var HTMLEditor = {

        /**
         * Reference to the modal window.
         *
         * @since 1.0.0
         * 
         * @type {jQuery Object}
         */
        editor: null,

        /**
         * Reference to slide for which the editor was opened.
         *
         * @since 1.0.0
         * 
         * @type {Slide}
         */
        currentSlide: null,

        /**
         * Open the modal window.
         *
         * @since 1.0.0
         * 
         * @param  {Int} id The id of the slide.
         */
        open: function(id) {
            this.currentSlide = WpSusAdmin.getSlide(id);

            var that = this,
                data = this.currentSlide.getData('html'),
                spinner = $('.slide[data-id="' + id + '"]').find('.slide-spinner').css({ 'display': 'inline-block', 'visibility': 'visible' }),
                contentType = this.currentSlide.getData('settings')['content_type'];

            $.ajax({
                url: wps_js_vars.ajaxurl,
                type: 'post',
                dataType: 'html',
                data: { action: 'wpsus_load_html_editor', data: data, content_type: contentType },
                complete: function(data) {
                    $('body').append(data.responseText);
                    that.init();

                    spinner.css({ 'display': '', 'visibility': '' });
                }
            });
        },

        /**
         * Initialize the editor.
         *
         * Add the necessary event listeners.
         * 
         * @since 1.0.0
         */
        init: function() {
            var that = this;

            $('.modal-window-container').css('top', $(window).scrollTop());

            this.$editor = $('.html-editor');

            this.$editor.find('.close-x').on('click', function(event) {
                event.preventDefault();
                that.save();
                that.close();
            });
        },

        /**
         * Save the content entered in the editor's textfield.
         * 
         * @since 1.0.0
         */
        save: function() {
            this.currentSlide.setData('html', this.$editor.find('textarea').val());
        },

        /**
         * Close the editor.
         *
         * Remove all event listeners.
         * 
         * @since 1.0.0
         */
        close: function() {
            this.$editor.find('.close-x').off('click');

            $('body').find('.modal-overlay, .modal-window-container').remove();
        }
    };

    /*
     * ======================================================================
     * Layers editor
     * ======================================================================
     */

    var LayersEditor = {

        /**
         * Reference to the modal window.
         *
         * @since 1.0.0
         * 
         * @type {jQuery Object}
         */
        editor: null,

        /**
         * Reference to slide for which the editor was opened.
         *
         * @since 1.0.0
         * 
         * @type {Slide}
         */
        currentSlide: null,

        /**
         * Array of JavaScript objects, that contain the layer's data.
         *
         * @since 1.0.0
         * 
         * @type {Array}
         */
        layersData: null,

        /**
         * Array of Layer objects.
         *
         * @since 1.0.0
         * 
         * @type {Array}
         */
        layers: [],

        /**
         * Counter for layers.
         *
         * @since 1.0.0
         * 
         * @type {Int}
         */
        counter: 0,

        /**
         * Indicates if a layer is currently being added.
         *
         * Stops the addition of new layers if another addition
         * is being processed.
         *
         * @since 1.0.0
         * 
         * @type {Boolean}
         */
        isWorking: false,

        /**
         * Open the modal window.
         *
         * @since 1.0.0
         * 
         * @param  {Int} id The id of the slide.
         */
        open: function(id) {
            this.currentSlide = WpSusAdmin.getSlide(id);
            this.layersData = this.currentSlide.getData('layers');

            var that = this,
                spinner = $('.slide[data-id="' + id + '"]').find('.slide-spinner').css({ 'display': 'inline-block', 'visibility': 'visible' }),
                contentType = this.currentSlide.getData('settings')['content_type'];

            $.ajax({
                url: wps_js_vars.ajaxurl,
                type: 'post',
                dataType: 'html',
                data: { action: 'wpsus_load_layers_editor', data: JSON.stringify(this.layersData), content_type: contentType },
                complete: function(data) {
                    $('body').append(data.responseText);
                    that.init();

                    spinner.css({ 'display': '', 'visibility': '' });
                }
            });
        },

        /**
         * Initialize the editor.
         *
         * Adds the necessary event listeners for adding a new layer,
         * deleting a layer or duplicating a layer.
         *
         * It also creates the layers existing in the slide's data,
         * and initializes the sorting functionality.
         * 
         * @since 1.0.0
         */
        init: function() {
            var that = this;

            $('.modal-window-container').css('top', $(window).scrollTop());

            this.counter = 0;

            this.$editor = $('.layers-editor');

            this.$editor.find('.close-x').on('click', function(event) {
                event.preventDefault();
                that.save();
                that.close();
            });

            this.$editor.find('.add-layer-group').on('click', function(event) {
                event.preventDefault();

                if (that.isWorking === true) {
                    return;
                }

                var type = 'paragraph';

                if (typeof $(event.target).attr('data-type') !== 'undefined') {
                    type = $(event.target).attr('data-type');
                }

                that.addNewLayer(type);
            });

            this.$editor.find('.delete-layer').on('click', function(event) {
                event.preventDefault();
                that.deleteLayer();
            });

            this.$editor.find('.duplicate-layer').on('click', function(event) {
                event.preventDefault();

                if (that.isWorking === true) {
                    return;
                }

                that.duplicateLayer();
            });

            this.initViewport();

            $.each(this.layersData, function(index, layerData) {
                var data = layerData;
                data.createMode = 'init';
                that.createLayer(data);

                that.counter = Math.max(that.counter, data.id);
            });

            $('.list-layers').lightSortable({
                children: '.list-layer',
                placeholder: 'list-layer-placeholder',
                sortEnd: function(event) {
                    if (event.startPosition === event.endPosition) {
                        return;
                    }

                    var layer = that.layers[event.startPosition];
                    that.layers.splice(event.startPosition, 1);
                    that.layers.splice(event.endPosition, 0, layer);

                    var $viewportLayers = that.$editor.find('.viewport-layers'),
                        total = $viewportLayers.children().length - 1;

                    $('.list-layers').find('.list-layer').each(function(index, element) {
                        $(element).attr('data-position', index);
                    });

                    var swapLayer = $viewportLayers.find('.viewport-layer').eq(total - event.startPosition).detach();

                    if (total - event.startPosition < total - event.endPosition) {
                        swapLayer.insertAfter($viewportLayers.find('.viewport-layer').eq(total - 1 - event.endPosition));
                    } else {
                        swapLayer.insertBefore($viewportLayers.find('.viewport-layer').eq(total - event.endPosition));
                    }
                }
            });

            $('.list-layers').find('.list-layer').each(function(index, element) {
                $(element).attr('data-position', index);
            });

            if (this.layers.length !== 0) {
                this.layers[0].triggerSelect();
            }
        },

        /**
         * Initialize the viewport.
         *
         * The viewport will have the same size as the current image, 
         * or, if the slide doesn't have a main image, it will
         * have the same size as the maximum slide size.
         *
         * The viewport will contain the image and on top of the image,
         * a container that will hold the layers.
         *
         * @since 1.0.0
         */
        initViewport: function() {
            var viewportWidth = $('.sidebar-settings').find('.setting[name="width"]').val(),
                viewportHeight = $('.sidebar-settings').find('.setting[name="height"]').val(),
                customClass = $('.sidebar-settings').find('.setting[name="custom_class"]').val(),
                mainImageData = this.currentSlide.getData('mainImage'),
                $viewport = this.$editor.find('.layer-viewport'),
                $viewportLayers = $('<div class="wp-sus viewport-layers"></div>').appendTo($viewport);

            if (viewportWidth.indexOf('%') !== -1) {
                viewportWidth = $(window).width() - 200;
            } else {
                viewportWidth = parseInt(viewportWidth, 10);
            }

            if (viewportHeight.indexOf('%') !== -1) {
                viewportHeight = $(window).height() - 200;
            } else {
                viewportHeight = parseInt(viewportHeight, 10);
            }

            $viewport.css({ 'width': viewportWidth, 'height': viewportHeight });

            if (customClass !== '') {
                $viewportLayers.addClass(customClass);
            }

            if (typeof mainImageData.main_image_source !== 'undefined' &&
                mainImageData.main_image_source !== '' &&
                mainImageData.main_image_source.indexOf('[') === -1) {

                var $viewportImage = $('<img class="viewport-image" src="' + mainImageData.main_image_source + '" />').prependTo($viewport);

                // set the size of the layer's container after the image has
                // loaded and its size can be retrieved
                var checkImageLoaded = setInterval(function() {
                    if ($viewportImage[0].complete === true) {
                        clearInterval(checkImageLoaded);

                        var imageWidth = $viewportImage.width(),
                            imageHeight = $viewportImage.height(),
                            scaleMode = $('.sidebar-settings').find('.setting[name="image_scale_mode"]').val(),
                            centerImage = $('.sidebar-settings').find('.setting[name="center_image"]').is(':checked');

                        if (scaleMode === 'cover') {
                            if ($viewportImage.width() / $viewportImage.height() <= viewportWidth / viewportHeight) {
                                $viewportImage.css({ width: '100%', height: 'auto' });
                            } else {
                                $viewportImage.css({ width: 'auto', height: '100%' });
                            }
                        } else if (scaleMode === 'contain') {
                            if ($viewportImage.width() / $viewportImage.height() >= viewportWidth / viewportHeight) {
                                $viewportImage.css({ width: '100%', height: 'auto' });
                            } else {
                                $viewportImage.css({ width: 'auto', height: '100%' });
                            }
                        } else if (scaleMode === 'exact') {
                            $viewportImage.css({ width: '100%', height: '100%' });
                        }

                        if (centerImage === true) {
                            $viewportImage.css({ 'marginLeft': (viewportWidth - $viewportImage.width()) * 0.5, 'marginTop': (viewportHeight - $viewportImage.height()) * 0.5 });
                        }

                        $viewport.css({ 'width': viewportWidth, 'height': viewportHeight });

                        $viewportLayers.css({
                            'width': viewportWidth,
                            'height': viewportHeight,
                            'left': $viewportImage.position().left,
                            'top': $viewportImage.position().top
                        });
                    }
                }, 10);
            }

            $('.layers-editor-info').css('maxWidth', $viewport.width());
        },

        /**
         * Create a layer.
         *
         * Based on the type of the layer, information which is
         * available in the passed data, a certain subclass of the
         * Layer object will be instantiated.
         *
         * It also checks if the created layer is a new/duplicate layer or
         * an existing layer, and adds it either at the beginning or the 
         * end of the list. New layers always need to be added before the 
         * existing layers.
         * 
         * @since 1.0.0
         * 
         * @param  {Object} data The layer's data.
         */
        createLayer: function(data) {
            var that = this,
                layer;

            if (data.type === 'paragraph') {
                layer = new ParagraphLayer(data);
            } else if (data.type === 'heading') {
                layer = new HeadingLayer(data);
            } else if (data.type === 'image') {
                layer = new ImageLayer(data);
            } else if (data.type === 'div') {
                layer = new DivLayer(data);
            } else if (data.type === 'video') {
                layer = new VideoLayer(data);
            }

            if (data.createMode === 'new' || data.createMode === 'duplicate') {
                this.layers.unshift(layer);
            } else {
                this.layers.push(layer);
            }

            layer.on('select', function(event) {
                $.each(that.layers, function(index, layer) {
                    if (layer.isSelected() === true) {
                        layer.deselect();
                    }

                    if (layer.getID() === event.id) {
                        layer.select();
                    }
                });
            });

            layer.triggerSelect();

            this.isWorking = false;

            this.$editor.removeClass('no-layers');
        },

        /**
         * Add a new layer on runtime.
         * 
         * Sends an AJAX request to load the layer's settings editor and
         * also adds the layer slide in the list of layers.
         *
         * @since 1.0.0
         * 
         * @param {String} type The type of layer.
         */
        addNewLayer: function(type) {
            var that = this;

            this.isWorking = true;

            this.counter++;

            $.ajax({
                url: wps_js_vars.ajaxurl,
                type: 'post',
                dataType: 'html',
                data: { action: 'wpsus_add_layer_settings', id: this.counter, type: type },
                complete: function(data) {
                    $(data.responseText).appendTo($('.layers-settings'));
                    $('<li class="list-layer" data-id="' + that.counter + '" data-position="' + that.layers.length + '">Layer ' + that.counter + '</li>').prependTo(that.$editor.find('.list-layers'));

                    that.createLayer({ id: that.counter, type: type, createMode: 'new' });
                }
            });
        },

        /**
         * Delete the selected layer.
         *
         * Iterates through the layers and detects the selected
         * one, then calls its 'destroy' method.
         *
         * @since 1.0.0
         */
        deleteLayer: function() {
            var that = this,
                removedIndex;

            $.each(this.layers, function(index, layer) {
                if (layer.isSelected() === true) {
                    layer.destroy();
                    that.layers.splice(index, 1);
                    removedIndex = index;

                    return false;
                }
            });

            if (this.layers.length === 0) {
                this.$editor.addClass('no-layers');
                return;
            }

            if (removedIndex === 0) {
                this.layers[0].triggerSelect();
            } else {
                this.layers[removedIndex - 1].triggerSelect();
            }
        },

        /**
         * Duplicate the selected layer.
         *
         * Iterates through the layers and detects the selected
         * one, then copies its data and sends an AJAX request 
         * with the copied data.
         *
         * @since 1.0.0
         */
        duplicateLayer: function() {
            var that = this,
                layerData;

            $.each(this.layers, function(index, layer) {
                if (layer.isSelected() === true) {
                    layerData = layer.getData();
                }
            });

            if (typeof layerData === 'undefined') {
                return;
            }

            this.isWorking = true;

            this.counter++;

            $.ajax({
                url: wps_js_vars.ajaxurl,
                type: 'post',
                dataType: 'html',
                data: {
                    action: 'wpsus_add_layer_settings',
                    id: this.counter,
                    type: layerData.type,
                    text: layerData.text,
                    heading_type: layerData.heading_type,
                    image_source: layerData.image_source,
                    image_alt: layerData.image_alt,
                    image_link: layerData.image_link,
                    image_retina: layerData.image_retina,
                    settings: JSON.stringify(layerData.settings)
                },
                complete: function(data) {
                    $(data.responseText).appendTo($('.layers-settings'));
                    $('<li class="list-layer" data-id="' + that.counter + '">Layer ' + that.counter + '</li>').prependTo(that.$editor.find('.list-layers'));

                    layerData.id = that.counter;
                    layerData.createMode = 'duplicate';
                    that.createLayer(layerData);
                }
            });
        },

        /**
         * Save the data from the editor.
         *
         * Iterate through the array of Layer objects, get their 
         * data and send all the data to the slide.
         * 
         * @since 1.0.0
         */
        save: function() {
            var data = [];

            $.each(this.layers, function(index, layer) {
                data.push(layer.getData());
            });

            this.currentSlide.setData('layers', data);
        },

        /**
         * Close the editor.
         *
         * Remove all event listeners and and destroy objects.
         * 
         * @since 1.0.0
         */
        close: function() {
            this.$editor.find('.close-x').off('click');
            this.$editor.find('.add-layer-group').off('click');
            this.$editor.find('.delete-layer').off('click');
            this.$editor.find('.duplicate-layer').off('click');

            $('.list-layers').lightSortable('destroy');

            $.each(this.layers, function(index, layer) {
                layer.destroy();
            });

            this.layers.length = 0;

            $('body').find('.modal-overlay, .modal-window-container').remove();
        }
    };

    /*
     * ======================================================================
     * Layer functions
     * ======================================================================
     */

    /**
     * Layer object.
     *
     * Parent/Base object for all layer types.
     *
     * Each layer has a representation in the viewport, in the list of layers
     * and in the settings.
     *
     * @since 1.0.0
     * 
     * @param {Object} data The layer's data.
     */
    var Layer = function(data) {
        this.data = data;
        this.id = this.data.id;

        this.selected = false;
        this.events = $({});

        this.$editor = $('.layers-editor');
        this.$viewportLayers = this.$editor.find('.viewport-layers');

        this.$viewportLayer = null;
        this.$listLayer = this.$editor.find('.list-layer[data-id="' + this.id + '"]');
        this.$layerSettings = this.$editor.find('.layer-settings[data-id="' + this.id + '"]');

        this.init();
    };

    Layer.prototype = {

        /**
         * Initialize the layer.
         * 
         * @since 1.0.0
         */
        init: function() {
            this.initLayerContent();
            this.initLayerSettings();
            this.initViewportLayer();
            this.initLayerDragging();
            this.initListLayer();
        },

        /**
         * Return the layer's data: id, name, position and settings.
         *
         * Iterates through the layer's associated setting fields 
         * and copies the settings (name and value).
         *
         * @since 1.0.0
         * 
         * @return {Object} The layer's data.
         */
        getData: function() {
            var data = {};

            data.id = this.id;
            data.position = parseInt(this.$listLayer.attr('data-position'), 10);
            data.name = this.$listLayer.text();

            data.settings = {};

            this.$layerSettings.find('.setting').each(function() {
                var settingField = $(this),
                    type = settingField.attr('type');

                if (type === 'radio') {
                    if (settingField.is(':checked')) {
                        data.settings[settingField.attr('name').split('-')[0]] = settingField.val();
                    }
                } else if (type === 'checkbox') {
                    data.settings[settingField.attr('name')] = settingField.is(':checked');
                } else if (settingField.is('select') && typeof settingField.attr('multiple') !== 'undefined') {
                    data.settings[settingField.attr('name')] = settingField.val() === null ? [] : settingField.val();
                } else {
                    data.settings[settingField.attr('name')] = settingField.val();
                }
            });

            return data;
        },

        /**
         * Return the id of the layer.
         *
         * @since 1.0.0
         * 
         * @return {Int} The id.
         */
        getID: function() {
            return this.id;
        },

        /**
         * Select the layer.
         *
         * Adds classes to the layer item from the list and to the 
         * settings in order to highlight/show them.
         * 
         * @since 1.0.0
         */
        select: function() {
            this.selected = true;

            this.$listLayer.addClass('selected-list-layer');
            this.$layerSettings.addClass('selected-layer-settings');
        },

        /**
         * Deselect the layer by removing the added classes.
         * 
         * @since 1.0.0
         */
        deselect: function() {
            this.selected = false;

            this.$listLayer.removeClass('selected-list-layer');
            this.$layerSettings.removeClass('selected-layer-settings');
        },

        /**
         * Trigger the selection event.
         *
         * Used for programatically selecting the layer.
         * 
         * @since 1.0.0
         */
        triggerSelect: function() {
            this.trigger({ type: 'select', id: this.id });
        },

        /**
         * Check if the layer is selected.
         *
         * @since 1.0.0
         * 
         * @return {Boolean} Whether the layer is selected.
         */
        isSelected: function() {
            return this.selected;
        },

        /**
         * Destroy the layer
         *
         * Removes all event listeners and elements associated with the layer.
         * 
         * @since 1.0.0
         */
        destroy: function() {
            this.$viewportLayer.off('mousedown');
            this.$viewportLayer.off('mouseup');
            this.$viewportLayer.off('click');

            this.$listLayer.off('click');
            this.$listLayer.off('dblclick');
            this.$listLayer.off('selectstart');

            this.$editor.off('mousemove.layer' + this.id);
            this.$editor.off('click.layer' + this.id);

            this.$layerSettings.find('select[name="preset_styles"]').multiCheck('destroy');

            this.$layerSettings.find('.setting[name="width"]').off('change');
            this.$layerSettings.find('.setting[name="height"]').off('change');
            this.$layerSettings.find('.setting[name="position"]').off('change');
            this.$layerSettings.find('.setting[name="horizontal"]').off('change');
            this.$layerSettings.find('.setting[name="vertical"]').off('change');
            this.$layerSettings.find('.setting[name="preset_styles"]').off('change');
            this.$layerSettings.find('.setting[name="custom_class"]').off('change');

            this.$viewportLayer.remove();
            this.$listLayer.remove();
            this.$layerSettings.remove();
        },

        /**
         * Add an event listener to the layer.
         *
         * @since 1.0.0
         * 
         * @param  {String}   type    The event name.
         * @param  {Function} handler The callback function.
         */
        on: function(type, handler) {
            this.events.on(type, handler);
        },

        /**
         * Remove an event listener from the layer.
         *
         * @since 1.0.0
         * 
         * @param  {String} type The event name.
         */
        off: function(type) {
            this.events.off(type);
        },

        /**
         * Triggers an event.
         *
         * @since 1.0.0
         * 
         * @param  {String} type The event name.
         */
        trigger: function(type) {
            this.events.triggerHandler(type);
        },

        /**
         * Initialize the viewport layer.
         *
         * This is the layer's representation in the viewport and its
         * role is to give a preview of how the layer will look like
         * in the front-end. 
         *
         * If the layer is a newly created one, add some default styling
         * to it (black background and padding), and if it's an existing
         * layer or a duplicated one, set its style according to the
         * layer's data.
         * 
         * @since 1.0.0
         */
        initViewportLayer: function() {
            var that = this;

            this.$viewportLayer.attr('data-id', this.id);

            // append the layer before or after the other layers
            if (this.data.createMode === 'new' || this.data.createMode === 'duplicate') {
                this.$viewportLayer.appendTo(this.$viewportLayers);
            } else if (this.data.createMode === 'init') {
                this.$viewportLayer.prependTo(this.$viewportLayers);
            }

            if (this.data.createMode === 'new') {

                // set the position of the layer
                this.$viewportLayer.css({ 'width': 'auto', 'height': 'auto', 'left': 0, 'top': 0 });

                // set the style of the layer
                if (this.$viewportLayer.hasClass('wps-layer')) {
                    this.$viewportLayer.addClass('wps-black wps-padding');
                } else {
                    this.$viewportLayer.find('.wps-layer').addClass('wps-black wps-padding');
                }
            } else if (this.data.createMode === 'init' || this.data.createMode === 'duplicate') {

                // set the style of the layer
                var classes = this.data.settings.preset_styles !== null ? this.data.settings.preset_styles.join(' ') : '';
                classes += ' ' + this.data.settings.custom_class;

                if (this.$viewportLayer.hasClass('wps-layer')) {
                    this.$viewportLayer.addClass(classes);
                } else {
                    this.$viewportLayer.find('.wps-layer').addClass(classes);
                }

                // set the size of the layer
                this.$viewportLayer.css({ 'width': this.data.settings.width, 'height': this.data.settings.height });

                var position = this.data.settings.position.toLowerCase(),
                    horizontalPosition,
                    verticalPosition,
                    horizontalValue = this.data.settings.horizontal,
                    verticalValue = this.data.settings.vertical,
                    suffix,
                    layerWidth = parseInt(that.$viewportLayer.css('width'), 10),
                    layerHeight = parseInt(that.$viewportLayer.css('height'), 10);

                if (position.indexOf('right') !== -1) {
                    horizontalPosition = 'right';
                } else if (position.indexOf('left') !== -1) {
                    horizontalPosition = 'left';
                } else {
                    horizontalPosition = 'center';
                }

                if (position.indexOf('bottom') !== -1) {
                    verticalPosition = 'bottom';
                } else if (position.indexOf('top') !== -1) {
                    verticalPosition = 'top';
                } else {
                    verticalPosition = 'center';
                }

                suffix = (horizontalValue.indexOf('px') === -1 && horizontalValue.indexOf('%') === -1) ? 'px' : '';

                if (horizontalPosition === 'center') {
                    this.$viewportLayer.css({ 'width': layerWidth, 'marginLeft': 'auto', 'marginRight': 'auto', 'left': horizontalValue + suffix, 'right': 0 });
                } else {
                    this.$viewportLayer.css(horizontalPosition, horizontalValue + suffix);
                }

                suffix = verticalValue.indexOf('px') === -1 && verticalValue.indexOf('%') === -1 ? 'px' : '';

                if (verticalPosition === 'center') {
                    this.$viewportLayer.css({ 'height': layerHeight, 'marginTop': 'auto', 'marginBottom': 'auto', 'top': verticalValue + suffix, 'bottom': 0 });
                } else {
                    this.$viewportLayer.css(verticalPosition, verticalValue + suffix);
                }
            }

            // select the layer after it was added
            this.$viewportLayer.on('mousedown', function() {
                that.triggerSelect();
            });

            // prevent link navigation for links inside layers
            this.$viewportLayer.on('click', 'a', function() {
                event.preventDefault();
            });
        },

        /**
         * Initialize the layer's dragging functionality.
         *
         * This is for the viewport representation of the layer.
         * 
         * @since 1.0.0
         */
        initLayerDragging: function() {
            var that = this,
                mouseX = 0,
                mouseY = 0,
                layerX = 0,
                layerY = 0,
                hasFocus = false,
                autoRightBottom = false,
                hasMoved = false;

            this.$viewportLayer.on('mousedown', function(event) {
                event.preventDefault();

                // Store the position of the mouse pointer
                // and the position of the layer
                mouseX = event.pageX;
                mouseY = event.pageY;
                layerX = that.$viewportLayer[0].offsetLeft;
                layerY = that.$viewportLayer[0].offsetTop;

                hasFocus = true;
                hasMoved = false;
            });

            this.$editor.find('.viewport-layers').on('mousemove.layer' + this.id, function(event) {
                event.preventDefault();

                hasMoved = true;

                if (hasFocus === true) {
                    that.$viewportLayer.css({ 'left': layerX + event.pageX - mouseX, 'top': layerY + event.pageY - mouseY });

                    // While moving the layer, disable the right and bottom properties
                    // so that the layer will be positioned using the left and top
                    // properties.
                    if (autoRightBottom === false) {
                        autoRightBottom = true;
                        that.$viewportLayer.css({ 'right': 'auto', 'bottom': 'auto' });
                    }
                }
            });

            // Set the layer's position settings based on Position setting and the
            // position to which the layer was dragged.
            this.$viewportLayer.on('mouseup', function(event) {
                event.preventDefault();

                hasFocus = false;
                autoRightBottom = false;

                if (hasMoved === false) {
                    return;
                }

                var position = that.$layerSettings.find('.setting[name="position"]').val().toLowerCase(),
                    horizontalPosition,
                    verticalPosition,
                    layerLeft = parseInt(that.$viewportLayer.css('left'), 10),
                    layerTop = parseInt(that.$viewportLayer.css('top'), 10),
                    layerWidth = parseInt(that.$viewportLayer.css('width'), 10),
                    layerHeight = parseInt(that.$viewportLayer.css('height'), 10),
                    viewportWidth = that.$editor.find('.viewport-layers').width(),
                    viewportHeight = that.$editor.find('.viewport-layers').height();

                if (position.indexOf('right') !== -1) {
                    horizontalPosition = 'right';
                } else if (position.indexOf('left') !== -1) {
                    horizontalPosition = 'left';
                } else {
                    horizontalPosition = 'center';
                }

                if (position.indexOf('bottom') !== -1) {
                    verticalPosition = 'bottom';
                } else if (position.indexOf('top') !== -1) {
                    verticalPosition = 'top';
                } else {
                    verticalPosition = 'center';
                }

                if (horizontalPosition === 'left') {
                    that.$layerSettings.find('.setting[name="horizontal"]').val(layerLeft);
                } else if (horizontalPosition === 'right') {
                    var right = viewportWidth - layerLeft - layerWidth;

                    that.$layerSettings.find('.setting[name="horizontal"]').val(right);
                    that.$viewportLayer.css({ 'left': 'auto', 'right': right });
                } else {
                    var horizontalCenter = -(viewportWidth - 2 * layerLeft - layerWidth);

                    that.$layerSettings.find('.setting[name="horizontal"]').val(horizontalCenter);
                    that.$viewportLayer.css({ 'left': horizontalCenter, 'right': 0 });
                }

                if (verticalPosition === 'top') {
                    that.$layerSettings.find('.setting[name="vertical"]').val(layerTop);
                } else if (verticalPosition === 'bottom') {
                    var bottom = viewportHeight - layerTop - layerHeight;

                    that.$layerSettings.find('.setting[name="vertical"]').val(bottom);
                    that.$viewportLayer.css({ 'top': 'auto', 'bottom': bottom });
                } else {
                    var verticalCenter = -(viewportHeight - 2 * layerTop - layerHeight);

                    that.$layerSettings.find('.setting[name="vertical"]').val(verticalCenter);
                    that.$viewportLayer.css({ 'top': verticalCenter, 'bottom': 0 });
                }
            });
        },

        /**
         * Initialize the layer's list item.
         *
         * This is the layer's representation in the list of layers.
         *
         * Implements functionality for selecting the layer and
         * changing its name.
         * 
         * @since 1.0.0
         */
        initListLayer: function() {
            var that = this,
                isEditingLayerName = false;

            this.$listLayer.on('click', function(event) {
                that.trigger({ type: 'select', id: that.id });
            });

            this.$listLayer.on('dblclick', function(event) {
                if (isEditingLayerName === true) {
                    return;
                }

                isEditingLayerName = true;

                var name = that.$listLayer.text();

                var input = $('<input type="text" value="' + name + '" />').appendTo(that.$listLayer);

                input.on('change', function() {
                    isEditingLayerName = false;
                    var layerName = input.val() !== '' ? input.val() : 'Layer ' + that.id;
                    that.$listLayer.text(layerName);
                    input.remove();
                });
            });

            this.$listLayer.on('selectstart', function(event) {
                event.preventDefault();
            });

            this.$editor.on('click.layer' + this.id, function(event) {
                if (!$(event.target).is('input') && isEditingLayerName === true) {
                    isEditingLayerName = false;

                    var input = that.$listLayer.find('input'),
                        layerName = input.val() !== '' ? input.val() : 'Layer ' + that.id;

                    that.$listLayer.text(layerName);
                    input.remove();
                }
            });
        },

        /**
         * Initialize the viewport layer's content.
         *
         * This is overridden by child objects, based on the
         * specific of the content type.
         * 
         * @since 1.0.0
         */
        initLayerContent: function() {

        },

        /**
         * Initialize the layer's settings.
         *
         * It listens for changes in the setting fields and applies the
         * changes to the viewport representation of the layer.
         * 
         * @since 1.0.0
         */
        initLayerSettings: function() {
            var that = this;

            this.$layerSettings.find('select[name="preset_styles"]').multiCheck({ width: 120 });

            // listen for position changes
            this.$layerSettings.find('.setting[name="position"], .setting[name="horizontal"], .setting[name="vertical"], .setting[name="width"], .setting[name="height"]').on('change', function() {
                var position = that.$layerSettings.find('.setting[name="position"]').val().toLowerCase(),
                    horizontalPosition,
                    verticalPosition,
                    horizontalValue = that.$layerSettings.find('.setting[name="horizontal"]').val(),
                    verticalValue = that.$layerSettings.find('.setting[name="vertical"]').val(),
                    width = that.$layerSettings.find('.setting[name="width"]').val(),
                    height = that.$layerSettings.find('.setting[name="height"]').val(),
                    suffix,
                    layerWidth = parseInt(that.$viewportLayer.css('width'), 10),
                    layerHeight = parseInt(that.$viewportLayer.css('height'), 10);

                if (position.indexOf('right') !== -1) {
                    horizontalPosition = 'right';
                } else if (position.indexOf('left') !== -1) {
                    horizontalPosition = 'left';
                } else {
                    horizontalPosition = 'center';
                }

                if (position.indexOf('bottom') !== -1) {
                    verticalPosition = 'bottom';
                } else if (position.indexOf('top') !== -1) {
                    verticalPosition = 'top';
                } else {
                    verticalPosition = 'center';
                }

                that.$viewportLayer.css({
                    'width': width,
                    'height': height,
                    'top': 'auto',
                    'bottom': 'auto',
                    'left': 'auto',
                    'right': 'auto'
                });

                suffix = (horizontalValue.indexOf('px') === -1 && horizontalValue.indexOf('%') === -1) ? 'px' : '';

                if (horizontalPosition === 'center') {
                    that.$viewportLayer.css({ 'width': layerWidth, 'marginLeft': 'auto', 'marginRight': 'auto', 'left': horizontalValue + suffix, 'right': 0 });
                } else {
                    that.$viewportLayer.css(horizontalPosition, horizontalValue + suffix);
                }

                suffix = verticalValue.indexOf('px') === -1 && verticalValue.indexOf('%') === -1 ? 'px' : '';

                if (verticalPosition === 'center') {
                    that.$viewportLayer.css({ 'height': layerHeight, 'marginTop': 'auto', 'marginBottom': 'auto', 'top': verticalValue + suffix, 'bottom': 0 });
                } else {
                    that.$viewportLayer.css(verticalPosition, verticalValue + suffix);
                }
            });

            // listen for style changes
            this.$layerSettings.find('.setting[name="preset_styles"], .setting[name="custom_class"]').on('change', function() {
                var classes = '',
                    selectedStyles = that.$layerSettings.find('.setting[name="preset_styles"]').val(),
                    customClass = that.$layerSettings.find('.setting[name="custom_class"]').val();

                classes += selectedStyles !== null ? ' ' + selectedStyles.join(' ') : '';
                classes += customClass !== '' ? ' ' + customClass : '';

                if (that.$viewportLayer.hasClass('wps-layer')) {
                    that.$viewportLayer.attr('class', 'viewport-layer wps-layer' + classes);
                } else {
                    that.$viewportLayer.find('.wps-layer').attr('class', 'wps-layer' + classes);
                }
            });
        }
    };

    /*
     * ======================================================================
     * Paragraph layer
     * ======================================================================
     */

    var ParagraphLayer = function(data) {
        Layer.call(this, data);
    };

    ParagraphLayer.prototype = Object.create(Layer.prototype);
    ParagraphLayer.prototype.constructor = ParagraphLayer;

    ParagraphLayer.prototype.initLayerContent = function() {
        var that = this;

        this.text = this.data.createMode === 'new' ? this.$layerSettings.find('textarea[name="text"]').val() : this.data.text;

        this.$layerSettings.find('textarea[name="text"]').on('input', function() {
            that.text = $(this).val();
            that.$viewportLayer.html(that.text);
        });
    };

    ParagraphLayer.prototype.initViewportLayer = function() {
        this.$viewportLayer = $('<p class="viewport-layer wps-layer">' + this.text + '</p>');
        Layer.prototype.initViewportLayer.call(this);
    };

    ParagraphLayer.prototype.getData = function() {
        var data = Layer.prototype.getData.call(this);
        data.type = 'paragraph';
        data.text = this.text;

        return data;
    };

    ParagraphLayer.prototype.destroy = function() {
        this.$layerSettings.find('textarea[name="text"]').off('input');

        Layer.prototype.destroy.call(this);
    };

    /*
     * ======================================================================
     * Heading layer
     * ======================================================================
     */

    var HeadingLayer = function(data) {
        Layer.call(this, data);
    };

    HeadingLayer.prototype = Object.create(Layer.prototype);
    HeadingLayer.prototype.constructor = HeadingLayer;

    HeadingLayer.prototype.initLayerContent = function() {
        var that = this;

        this.headingType = this.data.createMode === 'new' ? 'h3' : this.data.heading_type;
        this.headingText = this.data.createMode === 'new' ? this.$layerSettings.find('textarea[name="text"]').val() : this.data.text;

        this.$layerSettings.find('select[name="heading_type"]').on('change', function() {
            that.headingType = $(this).val();

            var classes = that.$viewportLayer.find('.wps-layer').attr('class');
            that.$viewportLayer.html('<' + that.headingType + ' class="' + classes + '">' + that.headingText + '</' + that.headingType + '>');
        });

        this.$layerSettings.find('textarea[name="text"]').on('input', function() {
            that.headingText = $(this).val();

            that.$viewportLayer.find('.wps-layer').html(that.headingText);
        });
    };

    HeadingLayer.prototype.initViewportLayer = function() {
        this.$viewportLayer = $('<div class="viewport-layer"><' + this.headingType + ' class="wps-layer">' + this.headingText + '</' + this.headingType + '></div>');
        Layer.prototype.initViewportLayer.call(this);
    };

    HeadingLayer.prototype.getData = function() {
        var data = Layer.prototype.getData.call(this);
        data.type = 'heading';
        data.heading_type = this.headingType;
        data.text = this.headingText;

        return data;
    };

    HeadingLayer.prototype.destroy = function() {
        this.$layerSettings.find('select[name="heading_type"]').off('change');
        this.$layerSettings.find('textarea[name="text"]').off('input');

        Layer.prototype.destroy.call(this);
    };

    /*
     * ======================================================================
     * Image layer
     * ======================================================================
     */

    var ImageLayer = function(data) {
        Layer.call(this, data);
    };

    ImageLayer.prototype = Object.create(Layer.prototype);
    ImageLayer.prototype.constructor = ImageLayer;

    ImageLayer.prototype.initLayerContent = function() {
        var that = this,
            placehoderPath = wps_js_vars.plugin + '/admin/assets/css/images/image-placeholder.png';

        this.imageSource = this.data.createMode === 'new' ? placehoderPath : this.data.image_source;
        this.hasPlaceholder = this.data.createMode === 'new' ? true : false;

        this.$layerSettings.find('input[name="image_source"]').on('change', function() {
            that.imageSource = $(this).val();

            if (that.imageSource !== '') {
                that.$viewportLayer.attr('src', that.imageSource)
                    .removeClass('has-placeholder');

                that.hasPlaceholder = false;
            } else {
                that.$viewportLayer.attr('src', placehoderPath)
                    .addClass('has-placeholder');

                that.hasPlaceholder = true;
            }
        });

        this.$layerSettings.find('.layer-image-loader').on('click', function(event) {
            var target = $(event.target).siblings('input').attr('name') === 'image_source' ? 'default' : 'retina';

            MediaLoader.open(function(selection) {
                var image = selection[0];

                if (target === 'default') {
                    that.$layerSettings.find('input[name="image_source"]').val(image.url).trigger('change');
                    that.$layerSettings.find('input[name="image_alt"]').val(image.alt);
                } else if (target === 'retina') {
                    that.$layerSettings.find('input[name="image_retina"]').val(image.url);
                }
            });
        });
    };

    ImageLayer.prototype.initLayerSettings = function() {
        Layer.prototype.initLayerSettings.call(this);

        var that = this;

        this.$layerSettings.find('.setting[name="preset_styles"], .setting[name="custom_class"]').on('change', function() {
            if (that.hasPlaceholder === true) {
                that.$viewportLayer.addClass('has-placeholder');
            } else {
                that.$viewportLayer.removeClass('has-placeholder');
            }
        });
    };

    ImageLayer.prototype.initViewportLayer = function() {
        this.$viewportLayer = $('<img class="viewport-layer wps-layer" src="' + this.imageSource + '" />');

        if (this.hasPlaceholder === true) {
            this.$viewportLayer.addClass('has-placeholder');
        } else {
            this.$viewportLayer.removeClass('has-placeholder');
        }

        Layer.prototype.initViewportLayer.call(this);
    };

    ImageLayer.prototype.getData = function() {
        var data = Layer.prototype.getData.call(this);
        data.type = 'image';
        data.image_source = this.imageSource;
        data.image_alt = this.$layerSettings.find('input[name="image_alt"]').val();
        data.image_link = this.$layerSettings.find('input[name="image_link"]').val();
        data.image_retina = this.$layerSettings.find('input[name="image_retina"]').val();

        return data;
    };

    ImageLayer.prototype.destroy = function() {
        this.$layerSettings.find('input[name="image_source"]').off('change');
        this.$layerSettings.find('.layer-image-loader').off('click');

        Layer.prototype.destroy.call(this);
    };

    /*
     * ======================================================================
     * DIV layer
     * ======================================================================
     */

    var DivLayer = function(data) {
        Layer.call(this, data);
    };

    DivLayer.prototype = Object.create(Layer.prototype);
    DivLayer.prototype.constructor = DivLayer;

    DivLayer.prototype.initLayerContent = function() {
        var that = this;

        this.text = this.data.createMode === 'new' ? this.$layerSettings.find('textarea[name="text"]').val() : this.data.text;

        this.$layerSettings.find('textarea[name="text"]').on('input', function() {
            that.text = $(this).val();
            that.$viewportLayer.html(that.text);
        });
    };

    DivLayer.prototype.initViewportLayer = function() {
        this.$viewportLayer = $('<div class="viewport-layer wps-layer">' + this.text + '</div>');
        Layer.prototype.initViewportLayer.call(this);
    };

    DivLayer.prototype.getData = function() {
        var data = Layer.prototype.getData.call(this);
        data.type = 'div';
        data.text = this.text;

        return data;
    };

    DivLayer.prototype.destroy = function() {
        this.$layerSettings.find('textarea[name="text"]').off('input');

        Layer.prototype.destroy.call(this);
    };

    /*
     * ======================================================================
     * Video layer
     * ======================================================================
     */

    var VideoLayer = function(data) {
        Layer.call(this, data);
    };

    VideoLayer.prototype = Object.create(Layer.prototype);
    VideoLayer.prototype.constructor = VideoLayer;

    VideoLayer.prototype.initLayerContent = function() {
        var that = this;

        this.$layerSettings.find('.layer-image-loader').on('click', function(event) {
            var target = $(event.target).siblings('input').attr('name') === 'video_poster' ? 'default' : 'retina';

            MediaLoader.open(function(selection) {
                var image = selection[0];

                if (target === 'default') {
                    that.$layerSettings.find('input[name="video_poster"]').val(image.url).trigger('change');
                } else if (target === 'retina') {
                    that.$layerSettings.find('input[name="video_retina_poster"]').val(image.url);
                }
            });
        });
    };

    VideoLayer.prototype.initViewportLayer = function() {
        var that = this;

        this.$viewportLayer = $('<div class="viewport-layer wps-layer has-placeholder"><span class="video-placeholder"></span></div>');
        Layer.prototype.initViewportLayer.call(this);

        this.$layerSettings.find('input[name="width"], input[name="height"]').on('change', function() {
            var width = that.$layerSettings.find('input[name="width"]').val(),
                height = that.$layerSettings.find('input[name="height"]').val();

            if (width === 'auto') {
                that.$viewportLayer.css('width', 300);
            }

            if (height === 'auto') {
                that.$viewportLayer.css('height', 150);
            }
        });

        this.$layerSettings.find('input[name="width"], input[name="height"]').trigger('change');
    };

    VideoLayer.prototype.initLayerSettings = function() {
        Layer.prototype.initLayerSettings.call(this);

        var that = this;

        this.$layerSettings.find('.setting[name="preset_styles"], .setting[name="custom_class"]').on('change', function() {
            that.$viewportLayer.addClass('has-placeholder');
        });
    };

    VideoLayer.prototype.getData = function() {
        var data = Layer.prototype.getData.call(this);
        data.type = 'video';

        data.video_source = this.$layerSettings.find('select[name="video_source"]').val();
        data.video_id = this.$layerSettings.find('input[name="video_id"]').val();
        data.video_poster = this.$layerSettings.find('input[name="video_poster"]').val();
        data.video_retina_poster = this.$layerSettings.find('input[name="video_retina_poster"]').val();
        data.video_load_mode = this.$layerSettings.find('select[name="video_load_mode"]').val();
        data.video_params = this.$layerSettings.find('input[name="video_params"]').val();

        return data;
    };

    VideoLayer.prototype.destroy = function() {
        this.$layerSettings.find('input[name="width"]').off('change');
        this.$layerSettings.find('input[name="height"]').off('change');

        Layer.prototype.destroy.call(this);
    };

    /*
     * ======================================================================
     * Settings editor
     * ======================================================================
     */

    var SettingsEditor = {

        /**
         * Reference to the modal window.
         *
         * @since 1.0.0
         * 
         * @type {jQuery Object}
         */
        editor: null,

        /**
         * Reference to slide for which the editor was opened.
         *
         * @since 1.0.0
         * 
         * @type {Slide}
         */
        currentSlide: null,

        /**
         * Indicates whether the slide's preview needs to be updated.
         *
         * @since 1.0.0
         * 
         * @type {Boolean}
         */
        needsPreviewUpdate: false,

        /**
         * Open the modal window.
         *
         * Send an AJAX request providing the slide's settings data.
         *
         * @since 1.0.0
         * 
         * @param  {Int} id The id of the slide
         */
        open: function(id) {
            this.currentSlide = WpSusAdmin.getSlide(id);

            var that = this,
                data = this.currentSlide.getData('settings'),
                spinner = $('.slide[data-id="' + id + '"]').find('.slide-spinner').css({ 'display': 'inline-block', 'visibility': 'visible' });

            $.ajax({
                url: wps_js_vars.ajaxurl,
                type: 'post',
                dataType: 'html',
                data: { action: 'wpsus_load_settings_editor', data: JSON.stringify(data) },
                complete: function(data) {
                    $('body').append(data.responseText);
                    that.init();

                    spinner.css({ 'display': '', 'visibility': '' });
                }
            });
        },

        /**
         * Initialize the editor.
         *
         * Add the necessary event listeners.
         * 
         * @since 1.0.0
         */
        init: function() {
            var that = this;

            $('.modal-window-container').css('top', $(window).scrollTop());

            this.$editor = $('.settings-editor');

            this.$editor.find('.close, .close-x').on('click', function(event) {
                event.preventDefault();
                that.save();
                that.close();
            });

            // Listen when the content type changes in order to load a new 
            // set of input fields, associated with the new content type.
            this.$editor.find('.slide-setting[name="content_type"]').on('change', function() {
                var type = $(this).val();

                that.loadControls(type);
                that.needsPreviewUpdate = true;
            });

            // Check if the content type is set to 'Posts' in order
            // to load the associates taxonomies for the selected posts.
            if (this.$editor.find('.slide-setting[name="content_type"]').val() === 'posts') {
                this.handlePostsSelects();
            }
        },

        /**
         * Load the input fields associated with the content type.
         *
         * Sends an AJAX request providing the slide's settings.
         *
         * @since 1.0.0
         * 
         * @param  {String} type The content type.
         */
        loadControls: function(type) {
            var that = this,
                data = this.currentSlide.getData('settings');

            this.$editor.find('.content-type-settings').empty();

            $.ajax({
                url: wps_js_vars.ajaxurl,
                type: 'post',
                data: { action: 'wpsus_load_content_type_settings', type: type, data: JSON.stringify(data) },
                complete: function(data) {
                    $('.content-type-settings').append(data.responseText);

                    if (type === 'posts') {
                        that.handlePostsSelects();
                    }
                }
            });
        },

        /**
         * Handle changes in the post names and taxonomies select.
         *
         * When the selected post names change, load the new associates
         * taxonomies and construct the options for the taxonomy terms.
         *
         * Also, listen when the selected taxonomy terms change in order
         * to keep a list of all selected terms. The list is useful in
         * case the content type changes, because the selected taxonomy
         * terms will be automatically populated next time when the
         * 'Posts' content type is selected.
         * 
         * @since 1.0.0
         */
        handlePostsSelects: function() {
            var that = this,
                $postTypes = this.$editor.find('select[name="posts_post_types"]'),
                $taxonomies = this.$editor.find('select[name="posts_taxonomies"]'),
                selectedTaxonomies = $taxonomies.val() || [];


            // detect when post names change
            $postTypes.on('change', function() {
                var postNames = $(this).val();

                $taxonomies.empty();

                if (postNames !== null) {
                    WpSusAdmin.getTaxonomies(postNames, function(data) {
                        $.each(postNames, function(index, postName) {
                            var taxonomies = data[postName];

                            $.each(taxonomies, function(index, taxonomy) {
                                var $taxonomy = $('<optgroup label="' + taxonomy['label'] + '"></optgroup>').appendTo($taxonomies);

                                $.each(taxonomy['terms'], function(index, term) {
                                    var selected = $.inArray(term['full'], selectedTaxonomies) !== -1 ? ' selected="selected"' : '';
                                    $('<option value="' + term['full'] + '"' + selected + '>' + term['name'] + '</option>').appendTo($taxonomy);
                                });
                            });
                        });

                        $taxonomies.multiCheck('refresh');
                    });
                } else {
                    $taxonomies.multiCheck('refresh');
                }
            });

            // detect when taxonomies change
            $taxonomies.on('change', function(event) {
                $taxonomies.find('option').each(function() {
                    var option = $(this),
                        term = option.attr('value'),
                        index = $.inArray(term, selectedTaxonomies);

                    if (option.is(':selected') === true && index === -1) {
                        selectedTaxonomies.push(term);
                    } else if (option.is(':selected') === false && index !== -1) {
                        selectedTaxonomies.splice(index, 1);
                    }
                });
            });

            $postTypes.multiCheck({ width: 215 });
            $taxonomies.multiCheck({ width: 215 });
        },

        /**
         * Save the settings.
         *
         * Create a new object in which the current settings are
         * saved and pass the data to the slide.
         *
         * If the content type is changed, update the slide's
         * preview.
         * 
         * @since 1.0.0
         */
        save: function() {
            var that = this,
                data = {};

            this.$editor.find('.slide-setting').each(function() {
                var $setting = $(this);

                if (typeof $setting.attr('multiple') !== 'undefined') {
                    data[$setting.attr('name')] = $setting.val() !== null ? $setting.val() : [];
                } else if ($setting.attr('type') === 'checkbox') {
                    data[$setting.attr('name')] = $setting.is(':checked');
                } else {
                    data[$setting.attr('name')] = $setting.val();
                }
            });

            this.currentSlide.setData('settings', data);

            if (this.needsPreviewUpdate === true) {
                this.currentSlide.updateSlidePreview();
                this.needsPreviewUpdate = false;
            }
        },

        /**
         * Close the editor.
         *
         * Remove all event listeners.
         * 
         * @since 1.0.0
         */
        close: function() {
            this.$editor.find('.close-x').off('click');

            this.$editor.find('select[name="posts_post_types"]').multiCheck('destroy');
            this.$editor.find('select[name="posts_taxonomies"]').multiCheck('destroy');

            this.$editor.find('select[name="content_type"]').off('change');
            this.$editor.find('select[name="posts_post_types"]').off('change');
            this.$editor.find('select[name="posts_taxonomies"]').off('change');

            $('body').find('.modal-overlay, .modal-window-container').remove();
        }
    };

    /*
     * ======================================================================
     * Media loader
     * ======================================================================
     */

    var MediaLoader = {

        /**
         * Open the WordPress media loader and pass the
         * information of the selected images to the 
         * callback function.
         *
         * The passed that is the image's url, alt, title,
         * width and height.
         * 
         * @since 1.0.0
         */
        open: function(callback) {
            var selection = [],
                insertReference = wp.media.editor.insert;

            wp.media.editor.send.attachment = function(props, attachment) {
                var image = typeof attachment.sizes[props.size] !== 'undefined' ? attachment.sizes[props.size] : attachment.sizes['full'],
                    id = attachment.id,
                    url = image.url,
                    width = image.width,
                    height = image.height,
                    alt = attachment.alt,
                    title = attachment.title;

                selection.push({ id: id, url: url, alt: alt, title: title, width: width, height: height });
            };

            wp.media.editor.insert = function(prop) {
                callback.call(this, selection);

                wp.media.editor.insert = insertReference;
            };

            wp.media.editor.open('media-loader');
        }
    };

    /*
     * ======================================================================
     * Preview window
     * ======================================================================
     */

    var PreviewWindow = {

        /**
         * Reference to the modal window.
         *
         * @since 1.0.0
         * 
         * @type {jQuery Object}
         */
        previewWindow: null,

        /**
         * Reference to the slider instance.
         *
         * @since 1.0.0
         * 
         * @type {jQuery Object}
         */
        slider: null,

        /**
         * The slider's data.
         *
         * @since 1.0.0
         * 
         * @type {Object}
         */
        sliderData: null,

        /**
         * Open the preview window and pass the slider's data,
         * which consists of slider settings and each slide's
         * settings and content.
         *
         * Send an AJAX request with the data and receive the 
         * slider's HTML markup and inline JavaScript.
         *
         * @since 1.0.0
         * 
         * @param  {Object} data The data of the slider
         */
        open: function(data) {
            var that = this,
                spinner = $('.preview-spinner').css({ 'display': 'inline-block', 'visibility': 'visible' });

            $('body').append('<div class="modal-overlay"></div>' +
                '<div class="modal-window-container preview-window">' +
                '	<div class="modal-window">' +
                '		<span class="close-x"></span>' +
                '	</div>' +
                '</div>');

            this.sliderData = data;

            this.init();

            $.ajax({
                url: wps_js_vars.ajaxurl,
                type: 'post',
                data: { action: 'wpsus_preview_slider', data: JSON.stringify(data) },
                complete: function(data) {
                    that.previewWindow.append(data.responseText);
                    that.slider = that.previewWindow.find('.wp-sus');
                    that.previewWindow.css('visibility', '');
                    spinner.css({ 'display': '', 'visibility': '' });
                }
            });
        },

        /**
         * Initialize the preview.
         *
         * Detect when the window is resized and resize the preview
         * window accordingly, and also based on the slider's set
         * width.
         *
         * @since 1.0.0
         */
        init: function() {
            var that = this;

            $('.modal-window-container').css('top', $(window).scrollTop());

            this.previewWindow = $('.preview-window .modal-window');

            this.previewWindow.find('.close-x').on('click', function(event) {
                that.close();
            });

            this.previewWindow.css('visibility', 'hidden');

            var previewWidth = this.sliderData['settings']['width'],
                previewHeight = this.sliderData['settings']['height'],
                visibleSize = this.sliderData['settings']['visible_size'],
                forceSize = this.sliderData['settings']['force_size'],
                orientation = this.sliderData['settings']['orientation'],
                isThumbnailScroller = this.sliderData['settings']['auto_thumbnail_images'],
                thumbnailScrollerOrientation = this.sliderData['settings']['thumbnails_position'] === 'top' || this.sliderData['settings']['thumbnails_position'] === 'bottom' ? 'horizontal' : 'vertical';

            $.each(this.sliderData.slides, function(index, element) {
                if ((typeof element.thumbnail_source !== 'undefined' && element.thumbnail_source !== '') || (typeof element.thumbnail_content !== 'undefined' && element.thumbnail_content !== '')) {
                    isThumbnailScroller = true;
                }
            });

            if (visibleSize !== 'auto') {
                if (orientation === 'horizontal') {
                    previewWidth = visibleSize;
                } else if (orientation === 'vertical') {
                    previewHeight = visibleSize;
                }
            }

            if (forceSize === 'fullWidth') {
                previewWidth = '100%';
            } else if (forceSize === 'fullWindow') {
                previewWidth = '100%';
                previewHeight = '100%';
            }

            var isPercentageWidth = previewWidth.indexOf('%') !== -1,
                isPercentageHeight = previewHeight.indexOf('%') !== -1;

            if (isPercentageWidth === false && isThumbnailScroller === true && thumbnailScrollerOrientation === 'vertical') {
                previewWidth = parseInt(previewWidth, 10) + parseInt(this.sliderData['settings']['thumbnail_width'], 10);
            }

            $(window).on('resize.wpSus', function() {
                if (isPercentageWidth === true) {
                    that.previewWindow.css('width', $(window).width() * (parseInt(previewWidth, 10) / 100) - 100);
                } else if (previewWidth >= $(window).width() - 100) {
                    that.previewWindow.css('width', $(window).width() - 100);
                } else {
                    that.previewWindow.css('width', previewWidth);
                }

                if (isPercentageHeight === true) {
                    that.previewWindow.css('height', $(window).height() * (parseInt(previewHeight, 10) / 100));
                }
            });

            $(window).trigger('resize');
        },

        /**
         * Close the preview window.
         *
         * Remove event listeners and elements.
         *
         * @since 1.0.0
         */
        close: function() {
            this.previewWindow.find('.close-x').off('click');
            $(window).off('resize.wpSus');

            this.slider.wpSus('destroy');
            $('body').find('.modal-overlay, .modal-window-container').remove();
        }
    };

    $(document).ready(function() {
        WpSusAdmin.init();
    });

})(jQuery);

/*
 * ======================================================================
 * MultiCheck
 * ======================================================================
 */

;
(function($) {

    var MultiCheck = function(instance, options) {

        this.options = options;
        this.isOpened = false;

        this.$select = $(instance);
        this.$multiCheck = null;
        this.$multiCheckHeader = null;
        this.$multiCheckContent = null;

        this.uid = new Date().valueOf() * Math.random();
        this.counter = 0;

        this.init();
    };

    MultiCheck.prototype = {

        init: function() {
            var that = this;

            this.settings = $.extend({}, this.defaults, this.options);

            this.$multiCheck = $('<div class="multi-check"></div>').css('width', this.settings.width);
            this.$multiCheckHeader = $('<button type="button" class="multi-check-header"><span class="multi-check-header-text"></span><span class="multi-check-header-arrow">▼</span></button>').appendTo(this.$multiCheck);
            this.$multiCheckContent = $('<ul class="multi-check-content"></ul>').appendTo(this.$multiCheck);

            this.$multiCheckHeader.on('mousedown.multiCheck', function(event) {
                if (that.isOpened === false) {
                    that.open();
                } else if (that.isOpened === true) {
                    that.close();
                }
            });

            $(document).on('mousedown.multiCheck.' + this.uid, function(event) {
                if ($.contains(that.$multiCheck[0], event.target) === false) {
                    that.close();
                }
            });

            this.refresh();

            this.$select.after(this.$multiCheck);
            this.$select.hide();
            this.$multiCheckContent.hide();
        },

        refresh: function() {
            var that = this;

            this.counter = 0;

            this.$multiCheckContent.find('.single-check').off('change.multiCheck');
            this.$multiCheckContent.empty();

            this.$select.children().each(function() {
                if ($(this).is('optgroup')) {
                    $('<li class="group-label">' + $(this).attr('label') + '</li>').appendTo(that.$multiCheckContent);

                    $(this).children().each(function() {
                        that._optionToCheckbox($(this));
                    });
                } else {
                    that._optionToCheckbox($(this));
                }
            });

            this.$multiCheckContent.find('.single-check').on('change.multiCheck', function() {
                if ($(this).is(':checked')) {
                    $(this).data('option').attr('selected', 'selected');
                } else {
                    $(this).data('option').removeAttr('selected');
                }

                that.$select.trigger('change');

                that._updateHeader();
            });

            this._updateHeader();
        },

        _optionToCheckbox: function(target) {
            var $singleCheckContainer = $('<li class="single-check-container"></li>').appendTo(this.$multiCheckContent),
                $singleCheck = $('<input id="single-check-' + this.uid + '-' + this.counter + '" class="single-check" type="checkbox" value="' + target.attr('value') + '"' + (target.is(':selected') ? ' checked="checked"' : '') + ' />').appendTo($singleCheckContainer),
                $singleCheckLabel = $('<label for="single-check-' + this.uid + '-' + this.counter + '">' + target.text() + '</label>').appendTo($singleCheckContainer);

            $singleCheck.data('option', target);

            this.counter++;
        },

        _updateHeader: function() {
            var $headerText = this.$multiCheckHeader.find('.multi-check-header-text'),
                text = '',
                count = 0,
                that = this;

            this.$multiCheckContent.find('.single-check').each(function() {
                if ($(this).is(':checked')) {
                    if (text !== '') {
                        text += ', ';
                    }

                    text += $(this).siblings('label').text();
                    count++;
                }
            });

            if (count === 0) {
                text = 'Click to select';
            } else if (count >= 2) {
                text = count + ' selected';
            }

            $headerText.text(text);
        },

        open: function() {
            var that = this;

            this.isOpened = true;

            this.$multiCheckContent.show();
        },

        close: function() {
            this.isOpened = false;

            this.$multiCheckContent.hide();
        },

        destroy: function() {
            this.$select.removeData('multiCheck');
            this.$multiCheckHeader.off('mousedown.multiCheck');
            $(document).off('mousedown.multiCheck.' + this.uid);
            this.$multiCheckContent.find('.single-check').off('change.multiCheck');
            this.$multiCheck.remove();
            this.$select.show();
        },

        defaults: {
            width: 200
        }

    };

    $.fn.multiCheck = function(options) {
        var args = Array.prototype.slice.call(arguments, 1);

        return this.each(function() {
            if (typeof $(this).data('multiCheck') === 'undefined') {
                var newInstance = new MultiCheck(this, options);

                $(this).data('multiCheck', newInstance);
            } else if (typeof options !== 'undefined') {
                var currentInstance = $(this).data('multiCheck');

                if (typeof currentInstance[options] === 'function') {
                    currentInstance[options].apply(currentInstance, args);
                } else {
                    $.error(options + ' does not exist in multiCheck.');
                }
            }
        });
    };

})(jQuery);

/*
 * ======================================================================
 * LightSortable
 * ======================================================================
 */

;
(function($) {

    var LightSortable = function(instance, options) {

        this.options = options;
        this.$container = $(instance);
        this.$selectedChild = null;
        this.$placeholder = null;

        this.currentMouseX = 0;
        this.currentMouseY = 0;
        this.slideInitialX = 0;
        this.slideInitialY = 0;
        this.initialMouseX = 0;
        this.initialMouseY = 0;
        this.isDragging = false;

        this.checkHover = 0;

        this.uid = new Date().valueOf();

        this.events = $({});
        this.startPosition = 0;
        this.endPosition = 0;

        this.init();
    };

    LightSortable.prototype = {

        init: function() {
            this.settings = $.extend({}, this.defaults, this.options);

            this.$container.on('mousedown.lightSortable' + this.uid, $.proxy(this._onDragStart, this));
            $(document).on('mousemove.lightSortable.' + this.uid, $.proxy(this._onDragging, this));
            $(document).on('mouseup.lightSortable.' + this.uid, $.proxy(this._onDragEnd, this));
        },

        _onDragStart: function(event) {
            if (event.which !== 1 || $(event.target).is('select') || $(event.target).is('input') || $(event.target).is('a')) {
                return;
            }

            this.$selectedChild = $(event.target).is(this.settings.children) ? $(event.target) : $(event.target).parents(this.settings.children);

            if (this.$selectedChild.length === 1) {
                this.initialMouseX = event.pageX;
                this.initialMouseY = event.pageY;
                this.slideInitialX = this.$selectedChild.position().left;
                this.slideInitialY = this.$selectedChild.position().top;

                this.startPosition = this.$selectedChild.index();

                event.preventDefault();
            }
        },

        _onDragging: function(event) {
            if (this.$selectedChild === null || this.$selectedChild.length === 0)
                return;

            event.preventDefault();

            this.currentMouseX = event.pageX;
            this.currentMouseY = event.pageY;

            if (!this.isDragging) {
                this.isDragging = true;

                this.trigger({ type: 'sortStart' });
                if ($.isFunction(this.settings.sortStart)) {
                    this.settings.sortStart.call(this, { type: 'sortStart' });
                }

                var tag = this.$container.is('ul') || this.$container.is('ol') ? 'li' : 'div';

                this.$placeholder = $('<' + tag + '>').addClass('ls-ignore ' + this.settings.placeholder)
                    .insertAfter(this.$selectedChild);

                if (this.$placeholder.width() === 0) {
                    this.$placeholder.css('width', this.$selectedChild.outerWidth());
                }

                if (this.$placeholder.height() === 0) {
                    this.$placeholder.css('height', this.$selectedChild.outerHeight());
                }

                this.$selectedChild.css({
                        'pointer-events': 'none',
                        'position': 'absolute',
                        left: this.$selectedChild.position().left,
                        top: this.$selectedChild.position().top,
                        width: this.$selectedChild.width(),
                        height: this.$selectedChild.height()
                    })
                    .addClass('ls-ignore');

                this.$container.append(this.$selectedChild);

                $('body').css('user-select', 'none');

                var that = this;

                this.checkHover = setInterval(function() {

                    that.$container.find(that.settings.children).not('.ls-ignore').each(function() {
                        var $currentChild = $(this);

                        if (that.currentMouseX > $currentChild.offset().left &&
                            that.currentMouseX < $currentChild.offset().left + $currentChild.width() &&
                            that.currentMouseY > $currentChild.offset().top &&
                            that.currentMouseY < $currentChild.offset().top + $currentChild.height()) {

                            if ($currentChild.index() >= that.$placeholder.index())
                                that.$placeholder.insertAfter($currentChild);
                            else
                                that.$placeholder.insertBefore($currentChild);
                        }
                    });
                }, 200);
            }

            this.$selectedChild.css({ 'left': this.currentMouseX - this.initialMouseX + this.slideInitialX, 'top': this.currentMouseY - this.initialMouseY + this.slideInitialY });
        },

        _onDragEnd: function() {
            if (this.isDragging) {
                this.isDragging = false;

                $('body').css('user-select', '');

                this.$selectedChild.css({ 'position': '', left: '', top: '', width: '', height: '', 'pointer-events': '' })
                    .removeClass('ls-ignore')
                    .insertAfter(this.$placeholder);

                this.$placeholder.remove();

                clearInterval(this.checkHover);

                this.endPosition = this.$selectedChild.index();

                this.trigger({ type: 'sortEnd' });
                if ($.isFunction(this.settings.sortEnd)) {
                    this.settings.sortEnd.call(this, { type: 'sortEnd', startPosition: this.startPosition, endPosition: this.endPosition });
                }
            }

            this.$selectedChild = null;
        },

        destroy: function() {
            this.$container.removeData('lightSortable');

            if (this.isDragging) {
                this._onDragEnd();
            }

            this.$container.off('mousedown.lightSortable.' + this.uid);
            $(document).off('mousemove.lightSortable.' + this.uid);
            $(document).off('mouseup.lightSortable.' + this.uid);
        },

        on: function(type, callback) {
            return this.events.on(type, callback);
        },

        off: function(type) {
            return this.events.off(type);
        },

        trigger: function(data) {
            return this.events.triggerHandler(data);
        },

        defaults: {
            placeholder: '',
            sortStart: function() {},
            sortEnd: function() {}
        }

    };

    $.fn.lightSortable = function(options) {
        var args = Array.prototype.slice.call(arguments, 1);

        return this.each(function() {
            if (typeof $(this).data('lightSortable') === 'undefined') {
                var newInstance = new LightSortable(this, options);

                $(this).data('lightSortable', newInstance);
            } else if (typeof options !== 'undefined') {
                var currentInstance = $(this).data('lightSortable');

                if (typeof currentInstance[options] === 'function') {
                    currentInstance[options].apply(currentInstance, args);
                } else {
                    $.error(options + ' does not exist in lightSortable.');
                }
            }
        });
    };

})(jQuery);

/*
 * ======================================================================
 * lightURLParse
 * ======================================================================
 */

;
(function($) {

    $.lightURLParse = function(url) {
        var urlArray = url.split('?')[1].split('&'),
            result = [];

        $.each(urlArray, function(index, element) {
            var elementArray = element.split('=');
            result[elementArray[0]] = elementArray[1];
        });

        return result;
    };

})(jQuery);