<?php
/**
 * Contains the default settings for the slider, slides, layers etc.
 * 
 * @since 1.0.0
 */
class WPSS_WpSus_Settings {

	/**
	 * The slider's settings.
	 * 
	 * The array contains the name, label, type, default value, 
	 * JavaScript name and description of the setting.
	 *
	 * @since 1.0.0
	 * 
	 * @var array
	 */
	protected static $settings = array();

	/**
	 * The groups of settings.
	 *
	 * The settings are grouped for the purpose of generating
	 * the slider's admin sidebar.
	 *
	 * @since 1.0.0
	 * 
	 * @var array
	 */
	protected static $setting_groups = array();

	/**
	 * Layer settings.
	 *
	 * The array contains the name, label, type, default value
	 * and description of the setting.
	 *
	 * @since 1.0.0
	 * 
	 * @var array
	 */
	protected static $layer_settings = array();

	/**
	 * Slide settings.
	 *
	 * The array contains the name, label, type, default value
	 * and description of the setting.
	 *
	 * @since 1.0.0
	 * 
	 * @var array
	 */
	protected static $slide_settings = array();

	/**
	 * List of settings that can be used for breakpoints.
	 *
	 * @since 1.0.0
	 * 
	 * @var array
	 */
	protected static $breakpoint_settings = array(
		'width',
		'height',
		'responsive',
		'visible_size',
		'aspect_ratio',
		'orientation',
		'slide_distance',
		'thumbnail_width',
		'thumbnail_height',
		'thumbnails_position'
	);

	/**
	 * Hold the state (opened or closed) of the sidebar slides.
	 *
	 * @since 1.0.0
	 * 
	 * @var array
	 */
	protected static $panels_state = array(
		'presets' => 'closed',
		'appearance' => '',
		'animations' => 'closed',
		'navigation' => 'closed',
		'captions' => 'closed',
		'full_screen' => 'closed',
		'layers' => 'closed',
		'thumbnails' => 'closed',
		'video' => 'closed',
		'miscellaneous' => 'closed',
		'breakpoints' => 'closed'
	);

	/**
	 * Holds the plugin settings.
	 *
	 * @since 1.0.0
	 * 
	 * @var array
	 */
	protected static $plugin_settings = array();

	/**
	 * Return the slider settings.
	 *
	 * @since 1.0.0
	 * 
	 * @param  string      $name The name of the setting. Optional.
	 * @return array|mixed       The array of settings or the value of the setting.
	 */
	public static function getSettings( $name = null ) {
		if ( empty( self::$settings ) ) {
			self::$settings = array(
				'width' => array(
					'js_name' => 'width',
					'label' => __( 'Width', 'wpsus' ),
					'type' => 'number',
					'default_value' => 500,
					'description' => __( 'Sets the width of the slide. Can be set to a fixed value, like 900 (indicating 900 pixels), or to a percentage value, like \'100%\'.', 'wpsus' )
				),

				'height' => array(
					'js_name' => 'height',
					'label' => __( 'Height', 'wpsus' ),
					'type' => 'number',
					'default_value' => 300,
					'description' => __( 'Sets the height of the slide. Can be set to a fixed value, like 900 (indicating 900 pixels), or to a percentage value, like \'100%\'.', 'wpsus' )
				),

				'responsive' => array(
					'js_name' => 'responsive',
					'label' => __( 'Responsive', 'wpsus' ),
					'type' => 'boolean',
					'default_value' => true,
					'description' => __( 'Makes the slider responsive. The slider can be responsive even if the \'width\' and/or \'height\' properties are set to fixed values. In this situation, \'width\' and \'height\' will act as the maximum width and height of the slides.', 'wpsus' )
				),

				'aspect_ratio' => array(
					'js_name' => 'aspectRatio',
					'label' => __( 'Aspect Ratio', 'wpsus' ),
					'type' => 'number',
					'default_value' => -1,
					'description' => __( 'Sets the aspect ratio of the slides. If set to a value different than -1, the height of the slides will be overridden in order to maintain the specified aspect ratio.', 'wpsus' )
				),

				'image_scale_mode' => array(
					'js_name' => 'imageScaleMode',
					'label' => __( 'Image Scale Mode', 'wpsus' ),
					'type' => 'select',
					'default_value' => 'cover',
					'available_values' => array(
						'cover' => __( 'Cover', 'wpsus' ),
						'contain' => __( 'Contain', 'wpsus' ),
						'exact' => __( 'Exact', 'wpsus' ),
						'none' => __( 'None', 'wpsus' )
					),
					'description' => __( 'Sets the scale mode of the main slide images. <i>Cover</i> will scale and crop the image so that it fills the entire slide. <i>Contain</i> will keep the entire image visible inside the slide. <i>Exact</i> will match the size of the image to the size of the slide. <i>None</i> will leave the image to its original size.', 'wpsus' )
				),

				'allow_scale_up' => array(
					'js_name' => 'allowScaleUp',
					'label' => __( 'Allow Scale Up', 'wpsus' ),
					'type' => 'boolean',
					'default_value' => true,
					'description' => __( 'Indicates if the image can be scaled up to more than its original size.', 'wpsus' )
				),

				'center_image' => array(
					'js_name' => 'centerImage',
					'label' => __( 'Center Image', 'wpsus' ),
					'type' => 'boolean',
					'default_value' => true,
					'description' => __( 'Indicates if the image will be centered.', 'wpsus' )
				),

				'auto_height' => array(
					'js_name' => 'autoHeight',
					'label' => __( 'Auto Height', 'wpsus' ),
					'type' => 'boolean',
					'default_value' => false,
					'description' => __( 'Indicates if height of the slider will be adjusted to the height of the selected slide.', 'wpsus' )
				),

				'auto_slide_size' => array(
					'js_name' => 'autoSlideSize',
					'label' => __( 'Auto Slide Size', 'wpsus' ),
					'type' => 'boolean',
					'default_value' => false,
					'description' => __( 'Will maintain all the slides at the same height, but will allow the width of the slides to be variable if the orientation of the slides is horizontal and vice-versa if the orientation is vertical.', 'wpsus' )
				),

				'start_slide' => array(
					'js_name' => 'startSlide',
					'label' => __( 'Start Slide', 'wpsus' ),
					'type' => 'number',
					'default_value' => 0,
					'description' => __( 'Sets the slide that will be selected when the slider loads.', 'wpsus' )
				),

				'shuffle' => array(
					'js_name' => 'shuffle',
					'label' => __( 'Shuffle', 'wpsus' ),
					'type' => 'boolean',
					'default_value' => false,
					'description' => __( 'Indicates if the slides will be shuffled.', 'wpsus' )
				),

				'orientation' => array(
					'js_name' => 'orientation',
					'label' => __( 'Orientation', 'wpsus' ),
					'type' => 'select',
					'default_value' => 'horizontal',
					'available_values' => array(
						'horizontal' => __( 'Horizontal', 'wpsus' ),
						'vertical' => __( 'Vertical', 'wpsus' )
					),
					'description' => __( 'Indicates whether the slides will be arranged horizontally or vertically.', 'wpsus' )
				),

				'force_size' => array(
					'js_name' => 'forceSize',
					'label' => __( 'Force Size', 'wpsus' ),
					'type' => 'select',
					'default_value' => 'none',
					'available_values' => array(
						'fullWidth' => __( 'Full Width', 'wpsus' ),
						'fullWindow' => __( 'Full Window', 'wpsus' ),
						'none' => __( 'None', 'wpsus' )
					),
					'description' => __( 'Indicates if the size of the slider will be forced to full width or full window.', 'wpsus' )
				),

				'loop' => array(
					'js_name' => 'loop',
					'label' => __( 'Loop', 'wpsus' ),
					'type' => 'boolean',
					'default_value' => true,
					'description' => __( 'Indicates if the slider will be loopable (infinite scrolling).', 'wpsus' )
				),

				'slide_distance' => array(
					'js_name' => 'slideDistance',
					'label' => __( 'Slide Distance', 'wpsus' ),
					'type' => 'number',
					'default_value' => 10,
					'description' => __( 'Sets the distance between the slides.', 'wpsus' )
				),

				'slide_animation_duration' => array(
					'js_name' => 'slideAnimationDuration',
					'label' => __( 'Slide Animation Duration', 'wpsus' ),
					'type' => 'number',
					'default_value' => 700,
					'description' => __( 'Sets the duration of the slide animation.', 'wpsus' )
				),

				'height_animation_duration' => array(
					'js_name' => 'heightAnimationDuration',
					'label' => __( 'Height Animation Duration', 'wpsus' ),
					'type' => 'number',
					'default_value' => 700,
					'description' => __( 'Sets the duration of the height animation.', 'wpsus' )
				),

				'visible_size' => array(
					'js_name' => 'visibleSize',
					'label' => __( 'Visible Size', 'wpsus' ),
					'type' => 'mixed',
					'default_value' => 'auto',
					'description' => __( 'Sets the size of the visible area, allowing for more slides to become visible near the selected slide.', 'wpsus' )
				),

				'center_selected_slide' => array(
					'js_name' => 'centerSelectedSlide',
					'label' => __( 'Center Selected Slide', 'wpsus' ),
					'type' => 'boolean',
					'default_value' => true,
					'description' => __( 'Indicates whether the selected slide will be in the center of the slider, when there are more slides visible at a time. If set to false, the selected slide will be in the left side of the slider.', 'wpsus' )
				),

				'right_to_left' => array(
					'js_name' => 'rightToLeft',
					'label' => __( 'Right To Left', 'wpsus' ),
					'type' => 'boolean',
					'default_value' => false,
					'description' => __( 'Indicates if the direction of the slider will be from right to left instead of the default left to right.', 'wpsus' )
				),

				'fade' => array(
					'js_name' => 'fade',
					'label' => __( 'Fade', 'wpsus' ),
					'type' => 'boolean',
					'default_value' => false,
					'description' => __( 'Indicates if fade will be used.', 'wpsus' )
				),

				'fade_out_previous_slide' => array(
					'js_name' => 'fadeOutPreviousSlide',
					'label' => __( 'Fade Out Previous Slide', 'wpsus' ),
					'type' => 'boolean',
					'default_value' => true,
					'description' => __( 'Indicates if the previous slide will be faded out (in addition to the next slide being faded in).', 'wpsus' )
				),

				'fade_duration' => array(
					'js_name' => 'fadeDuration',
					'label' => __( 'Fade Duration', 'wpsus' ),
					'type' => 'number',
					'default_value' => 500,
					'description' => __( 'Sets the duration of the fade effect.', 'wpsus' )
				),

				'autoplay' => array(
					'js_name' => 'autoplay',
					'label' => __( 'Autoplay', 'wpsus' ),
					'type' => 'boolean',
					'default_value' => true,
					'description' => __( 'Indicates whether or not autoplay will be enabled.', 'wpsus' )
				),

				'autoplay_delay' => array(
					'js_name' => 'autoplayDelay',
					'label' => __( 'Autoplay Delay', 'wpsus' ),
					'type' => 'number',
					'default_value' => 5000,
					'description' => __( 'Sets the delay/interval (in milliseconds) at which the autoplay will run.', 'wpsus' )
				),

				'autoplay_direction' => array(
					'js_name' => 'autoplayDirection',
					'label' => __( 'Autoplay Direction', 'wpsus' ),
					'type' => 'select',
					'default_value' => 'normal',
					'available_values' => array(
						'normal' => __( 'Normal', 'wpsus' ),
						'backwards' => __( 'Backwards', 'wpsus' )
					),
					'description' => __( 'Indicates whether autoplay will navigate to the next slide or previous slide.', 'wpsus' )
				),

				'autoplay_on_hover' => array(
					'js_name' => 'autoplayOnHover',
					'label' => __( 'Autoplay On Hover', 'wpsus' ),
					'type' => 'select',
					'default_value' => 'pause',
					'available_values' => array(
						'pause' => __( 'Pause', 'wpsus' ),
						'stop' => __( 'Stop', 'wpsus' ),
						'none' => __( 'None', 'wpsus' )
					),
					'description' => __( 'Indicates if the autoplay will be paused or stopped when the slider is hovered.', 'wpsus' )
				),

				'arrows' => array(
					'js_name' => 'arrows',
					'label' => __( 'Arrows', 'wpsus' ),
					'type' => 'boolean',
					'default_value' => false,
					'description' => __( 'Indicates whether the arrow buttons will be created.', 'wpsus' )
				),

				'fade_arrows' => array(
					'js_name' => 'fadeArrows',
					'label' => __( 'Fade Arrows', 'wpsus' ),
					'type' => 'boolean',
					'default_value' => true,
					'description' => __( 'Indicates whether the arrows will fade in only on hover.', 'wpsus' )
				),

				'buttons' => array(
					'js_name' => 'buttons',
					'label' => __( 'Buttons', 'wpsus' ),
					'type' => 'boolean',
					'default_value' => true,
					'description' => __( 'Indicates whether the buttons will be created.', 'wpsus' )
				),

				'keyboard' => array(
					'js_name' => 'keyboard',
					'label' => __( 'Keyboard', 'wpsus' ),
					'type' => 'boolean',
					'default_value' => true,
					'description' => __( 'Indicates whether keyboard navigation will be enabled.', 'wpsus' )
				),

				'keyboard_only_on_focus' => array(
					'js_name' => 'keyboardOnlyOnFocus',
					'label' => __( 'Keyboard Only On Focus', 'wpsus' ),
					'type' => 'boolean',
					'default_value' => false,
					'description' => __( 'Indicates whether the slider will respond to keyboard input only when the slider is in focus.', 'wpsus' )
				),

				'touch_swipe' => array(
					'js_name' => 'touchSwipe',
					'label' => __( 'Touch Swipe', 'wpsus' ),
					'type' => 'boolean',
					'default_value' => true,
					'description' => __( 'Indicates whether the touch swipe will be enabled for slides.', 'wpsus' )
				),

				'touch_swipe_threshold' => array(
					'js_name' => 'touchSwipeThreshold',
					'label' => __( 'Touch Swipe Threshold', 'wpsus' ),
					'type' => 'number',
					'default_value' => 50,
					'description' => __( 'Sets the minimum amount that the slides should move.', 'wpsus' )
				),

				'fade_caption' => array(
					'js_name' => 'fadeCaption',
					'label' => __( 'Fade Caption', 'wpsus' ),
					'type' => 'boolean',
					'default_value' => true,
					'description' => __( 'Indicates whether or not the captions will be faded.', 'wpsus' )
				),

				'caption_fade_duration' => array(
					'js_name' => 'captionFadeDuration',
					'label' => __( 'Caption Fade Duration', 'wpsus' ),
					'type' => 'number',
					'default_value' => 500,
					'description' => __( 'Sets the duration of the fade animation.', 'wpsus' )
				),

				'full_screen' => array(
					'js_name' => 'fullScreen',
					'label' => __( 'Full Screen', 'wpsus' ),
					'type' => 'boolean',
					'default_value' => false,
					'description' => __( 'Indicates whether the full-screen button is enabled.', 'wpsus' )
				),

				'fade_full_screen' => array(
					'js_name' => 'fadeFullScreen',
					'label' => __( 'Fade Full Screen', 'wpsus' ),
					'type' => 'boolean',
					'default_value' => true,
					'description' => __( 'Indicates whether the button will fade in only on hover.', 'wpsus' )
				),

				'wait_for_layers' => array(
					'js_name' => 'waitForLayers',
					'label' => __( 'Wait For Layers', 'wpsus' ),
					'type' => 'boolean',
					'default_value' => false,
					'description' => __( 'Indicates whether the slider will wait for the layers to disappear before going to a new slide.', 'wpsus' )
				),

				'auto_scale_layers' => array(
					'js_name' => 'autoScaleLayers',
					'label' => __( 'Auto Scale Layers', 'wpsus' ),
					'type' => 'boolean',
					'default_value' => true,
					'description' => __( 'Indicates whether the layers will be scaled automatically.', 'wpsus' )
				),

				'auto_scale_reference' => array(
					'js_name' => 'autoScaleReference',
					'label' => __( 'Auto Scale Reference', 'wpsus' ),
					'type' => 'number',
					'default_value' => -1,
					'description' => __( 'Sets a reference width which will be compared to the current slider width in order to determine how much the layers need to scale down. By default, the reference width will be equal to the slide width. However, if the slide width is set to a percentage value, then it\'s necessary to set a specific value for \'Auto Scale Reference\'.', 'wpsus' )
				),

				'lazy_loading' => array(
					'label' => __( 'Lazy Loading', 'wpsus' ),
					'type' => 'boolean',
					'default_value' => false,
					'description' => __( 'Indicates if the main images will be loaded only when they are visible.', 'wpsus' )
				),

				'lightbox' => array(
					'js_name' => 'lightbox',
					'label' => __( 'Lightbox', 'wpsus' ),
					'type' => 'boolean',
					'default_value' => false,
					'description' => __( 'Indicates if the links specified to the main images will be opened in a lightbox.', 'wpsus' )
				),

				'custom_class' => array(
					'label' => __( 'Custom Class', 'wpsus' ),
					'type' => 'text',
					'default_value' => '',
					'description' => __( 'Adds a custom class to the slider, for use in custom css. Add the class name without the dot, i.e., you need to add <i>my-slider</i>, not <i>.my-slider</i>.', 'wpsus' )
				),

				'small_size' => array(
					'js_name' => 'smallSize',
					'label' => __( 'Small Size', 'wpsus' ),
					'type' => 'number',
					'default_value' => 480,
					'description' => __( 'If the slider size is below this size, the small version of the images will be used.', 'wpsus' )
				),

				'medium_size' => array(
					'js_name' => 'mediumSize',
					'label' => __( 'Medium Size', 'wpsus' ),
					'type' => 'number',
					'default_value' => 768,
					'description' => __( 'If the slider size is below this size, the medium version of the images will be used.', 'wpsus' )
				),

				'large_size' => array(
					'js_name' => 'largeSize',
					'label' => __( 'Large Size', 'wpsus' ),
					'type' => 'number',
					'default_value' => 1024,
					'description' => __( 'If the slider size is below this size, the large version of the images will be used.', 'wpsus' )
				),

				'hide_image_title' => array(
					'label' => __( 'Hide Image Title', 'wpsus' ),
					'type' => 'boolean',
					'default_value' => true,
					'description' => __( 'Indicates if the title tag will be removed from images in order to prevent the title to show up in a tooltip when the image is hovered.', 'wpsus' )
				),

				'update_hash' => array(
					'js_name' => 'updateHash',
					'label' => __( 'Update Hash', 'wpsus' ),
					'type' => 'boolean',
					'default_value' => false,
					'description' => __( 'Indicates whether the hash will be updated when a new slide is selected.', 'wpsus' )
				),

				'use_name_as_id' => array(
					'js_name' => 'useNameAsId',
					'label' => __( 'Use Name As ID', 'wpsus' ),
					'type' => 'boolean',
					'default_value' => false,
					'description' => __( 'Indicates whether the name of the slider will be used as the ID attribute in the HTML code.', 'wpsus' )
				),

				'reach_video_action' => array(
					'js_name' => 'reachVideoAction',
					'label' => __( 'Reach Video Action', 'wpsus' ),
					'type' => 'select',
					'default_value' => 'none',
					'available_values' => array(
						'playVideo' => __( 'Play Video', 'wpsus' ),
						'none' => __( 'None', 'wpsus' )
					),
					'description' => __( 'Indicates if the autoplay will be paused or stopped when the slider is hovered.', 'wpsus' )
				),

				'leave_video_action' => array(
					'js_name' => 'leaveVideoAction',
					'label' => __( 'Leave Video Action', 'wpsus' ),
					'type' => 'select',
					'default_value' => 'pauseVideo',
					'available_values' => array(
						'stopVideo' => __( 'Stop Video', 'wpsus' ),
						'pauseVideo' => __( 'Pause Video', 'wpsus' ),
						'removeVideo' => __( 'Remove Video', 'wpsus' ),
						'none' => __( 'None', 'wpsus' )
					),
					'description' => __( 'Sets the action that the video will perform when another slide is selected.', 'wpsus' )
				),

				'play_video_action' => array(
					'js_name' => 'playVideoAction',
					'label' => __( 'Play Video Action', 'wpsus' ),
					'type' => 'select',
					'default_value' => 'stopAutoplay',
					'available_values' => array(
						'stopAutoplay' => __( 'Stop Autoplay', 'wpsus' ),
						'none' => __( 'None', 'wpsus' )
					),
					'description' => __( 'Sets the action that the slider will perform when the video starts playing.', 'wpsus' )
				),

				'pause_video_action' => array(
					'js_name' => 'pauseVideoAction',
					'label' => __( 'Pause Video Action', 'wpsus' ),
					'type' => 'select',
					'default_value' => 'none',
					'available_values' => array(
						'startAutoplay' => __( 'Start Autoplay', 'wpsus' ),
						'none' => __( 'None', 'wpsus' )
					),
					'description' => __( 'Sets the action that the slider will perform when the video starts playing.', 'wpsus' )
				),

				'end_video_action' => array(
					'js_name' => 'endVideoAction',
					'label' => __( 'End Video Action', 'wpsus' ),
					'type' => 'select',
					'default_value' => 'none',
					'available_values' => array(
						'startAutoplay' => __( 'Start Autoplay', 'wpsus' ),
						'nextSlide' => __( 'Next Slide', 'wpsus' ),
						'replayVideo' => __( 'Replay Video', 'wpsus' ),
						'none' => __( 'None', 'wpsus' )
					),
					'description' => __( 'Sets the action that the slider will perform when the video ends.', 'wpsus' )
				),

				'auto_thumbnail_images' => array(
					'label' => __( 'Auto Thumbnail Images', 'wpsus' ),
					'type' => 'boolean',
					'default_value' => false,
					'description' => __( 'Indicates whether the thumbnail images will be generated automatically based on the main image specified for the slide. This option can be used only with manually created sliders, not with dynamic sliders.', 'wpsus' )
				),

				'thumbnail_image_size' => array(
					'js_name' => 'thumbnailImageSize',
					'label' => __( 'Thumbnail Image Size', 'wpsus' ),
					'type' => 'select',
					'default_value' => '',
					'available_values' => array(),
					'description' => __( 'Sets the registered image size that will be used for automatically generated thumbnails.', 'wpsus' )
				),

				'thumbnail_width' => array(
					'js_name' => 'thumbnailWidth',
					'label' => __( 'Thumbnail Width', 'wpsus' ),
					'type' => 'number',
					'default_value' => 100,
					'description' => __( 'Sets the width of the thumbnail.', 'wpsus' )
				),

				'thumbnail_height' => array(
					'js_name' => 'thumbnailHeight',
					'label' => __( 'Thumbnail Height', 'wpsus' ),
					'type' => 'number',
					'default_value' => 80,
					'description' => __( 'Sets the height of the thumbnail.', 'wpsus' )
				),

				'thumbnails_position' => array(
					'js_name' => 'thumbnailsPosition',
					'label' => __( 'Thumbnails Position', 'wpsus' ),
					'type' => 'select',
					'default_value' => 'bottom',
					'available_values' => array(
						'top' => __( 'Top', 'wpsus' ),
						'bottom' => __( 'Bottom', 'wpsus' ),
						'right' => __( 'Right', 'wpsus' ),
						'left' => __( 'Left', 'wpsus' )
					),
					'description' => __( 'Sets the position of the thumbnail scroller.', 'wpsus' )
				),

				'thumbnail_pointer' => array(
					'js_name' => 'thumbnailPointer',
					'label' => __( 'Thumbnail Pointer', 'wpsus' ),
					'type' => 'boolean',
					'default_value' => false,
					'description' => __( 'Indicates if a pointer will be displayed for the selected thumbnail.', 'wpsus' )
				),

				'thumbnail_arrows' => array(
					'js_name' => 'thumbnailArrows',
					'label' => __( 'Thumbnail Arrows', 'wpsus' ),
					'type' => 'boolean',
					'default_value' => false,
					'description' => __( 'Indicates whether the thumbnail arrows will be enabled.', 'wpsus' )
				),

				'fade_thumbnail_arrows' => array(
					'js_name' => 'fadeThumbnailArrows',
					'label' => __( 'Fade Thumbnail Arrows', 'wpsus' ),
					'type' => 'boolean',
					'default_value' => true,
					'description' => __( 'Indicates whether the thumbnail arrows will be faded.', 'wpsus' )
				),

				'thumbnail_touch_swipe' => array(
					'js_name' => 'thumbnailTouchSwipe',
					'label' => __( 'Thumbnail Touch Swipe', 'wpsus' ),
					'type' => 'boolean',
					'default_value' => true,
					'description' => __( 'Indicates whether the touch swipe will be enabled for thumbnails.', 'wpsus' )
				),

				'link_target' => array(
					'js_name' => 'linkTarget',
					'label' => __( 'Link Target', 'wpsus' ),
					'type' => 'select',
					'default_value' => '_self',
					'available_values' => array(
						'_self' => __( 'Self', 'wpsus' ),
						'_blank' => __( 'Blank', 'wpsus' ),
						'_parent' => __( 'Parent', 'wpsus' ),
						'_top' => __( 'Top', 'wpsus' )
					),
					'description' => __( 'Sets the location where the slide links will be opened.', 'wpsus' )
				)
			);

			self::$settings = apply_filters( 'wpsus_default_settings', self::$settings );
		}

		if ( ! is_null( $name ) ) {
			return self::$settings[ $name ];
		}

		return self::$settings;
	}

	/**
	 * Return the setting groups.
	 *
	 * @since 1.0.0
	 * 
	 * @return array The array of setting groups.
	 */
	public static function getSettingGroups() {
		if ( empty( self::$setting_groups ) ) {
			self::$setting_groups = array(
				'appearance' => array(
					'label' => __( 'Appearance', 'wpsus' ),
					'list' => array(
						'width',
						'height',
						'responsive',
						'visible_size',
						'aspect_ratio',
						'orientation',
						'force_size',
						'auto_height',
						'auto_slide_size',
						'start_slide',
						'loop',
						'shuffle',
						'image_scale_mode',
						'allow_scale_up',
						'center_image',
						'center_selected_slide',
						'slide_distance',
						'right_to_left'
					)
				),

				'animations' => array(
					'label' => __( 'Animations', 'wpsus' ),
					'list' => array(
						'fade',
						'fade_out_previous_slide',
						'fade_duration',
						'slide_animation_duration',
						'height_animation_duration'
					)
				),
						
				'navigation' => array(
					'label' => __( 'Navigation', 'wpsus' ),
					'list' => array(
						'autoplay',
						'autoplay_delay',
						'autoplay_direction',
						'autoplay_on_hover',
						'arrows',
						'fade_arrows',
						'buttons',
						'keyboard',
						'keyboard_only_on_focus',
						'touch_swipe',
						'touch_swipe_threshold'
					)
				),
				
				'captions' => array(
					'label' => __( 'Captions', 'wpsus' ),
					'list' => array(
						'fade_caption',
						'caption_fade_duration'
					)
				),

				'full_screen' => array(
					'label' => __( 'Full Screen', 'wpsus' ),
					'list' => array(
						'full_screen',
						'fade_full_screen'
					)
				),

				'layers' => array(
					'label' => __( 'Layers', 'wpsus' ),
					'list' => array(
						'wait_for_layers',
						'auto_scale_layers',
						'auto_scale_reference'
					)
				),

				'thumbnails' => array(
					'label' => __( 'Thumbnails', 'wpsus' ),
					'list' => array(
						'auto_thumbnail_images',
						'thumbnail_image_size',
						'thumbnail_width',
						'thumbnail_height',
						'thumbnails_position',
						'thumbnail_pointer',
						'thumbnail_arrows',
						'fade_thumbnail_arrows',
						'thumbnail_touch_swipe',
					)
				),

				'video' => array(
					'label' => __( 'Video', 'wpsus' ),
					'list' => array(
						'reach_video_action',
						'leave_video_action',
						'play_video_action',
						'pause_video_action',
						'end_video_action'
					)
				),

				'miscellaneous' => array(
					'label' => __( 'Miscellaneous', 'wpsus' ),
					'list' => array(
						'lazy_loading',
						'lightbox',
						'small_size',
						'medium_size',
						'large_size',
						'update_hash',
						'use_name_as_id',
						'hide_image_title',
						'link_target',
						'custom_class'
					)
				)
			);
		}

		return self::$setting_groups;
	}
	
	/**
	 * Return the breakpoint settings.
	 *
	 * @since 1.0.0
	 * 
	 * @return array The array of breakpoint settings.
	 */
	public static function getBreakpointSettings() {
		return self::$breakpoint_settings;
	}

	/**
	 * Return the default panels state.
	 *
	 * @since 1.0.0
	 * 
	 * @return array The array of panels state.
	 */
	public static function getPanelsState() {
		return self::$panels_state;
	}

	/**
	 * Return the layer settings.
	 *
	 * @since 1.0.0
	 * 
	 * @return array The array of layer settings.
	 */
	public static function getLayerSettings() {
		if ( empty( self::$layer_settings ) ) {
			self::$layer_settings = array(
				'type' => array(
					'label' => __( 'Type', 'wpsus' ),
					'type' => 'select',
					'default_value' => 'div',
					'available_values' => array(
						'paragraph' => __( 'Paragraph', 'wpsus' ),
						'heading' => __( 'Heading', 'wpsus' ),
						'image' => __( 'Image', 'wpsus' ),
						'video' => __( 'Video', 'wpsus' ),
						'div' => __( 'DIV', 'wpsus' )
					),
					'description' => ''
				),
				'heading_type' => array(
					'label' => __( 'Heading Type', 'wpsus' ),
					'type' => 'select',
					'default_value' => 'h3',
					'available_values' => array(
						'h1' => __( 'H1', 'wpsus' ),
						'h2' => __( 'H2', 'wpsus' ),
						'h3' => __( 'H3', 'wpsus' ),
						'h4' => __( 'H4', 'wpsus' ),
						'h5' => __( 'H5', 'wpsus' ),
						'h6' => __( 'H6', 'wpsus' )
					),
					'description' => ''
				),
				'video_source' => array(
					'label' => __( 'Video Source', 'wpsus' ),
					'type' => 'select',
					'default_value' => 'youtube',
					'available_values' => array(
						'youtube' => __( 'YouTube', 'wpsus' ),
						'vimeo' => __( 'Vimeo', 'wpsus' )
					),
					'description' => ''
				),
				'video_load_mode' => array(
					'label' => __( 'Video Load Mode', 'wpsus' ),
					'type' => 'select',
					'default_value' => 'poster',
					'available_values' => array(
						'poster' => __( 'Poster', 'wpsus' ),
						'video' => __( 'Video', 'wpsus' )
					),
					'description' => ''
				),
				'display' => array(
					'label' => __( 'Display', 'wpsus' ),
					'type' => 'radio',
					'default_value' => 'animated',
					'available_values' => array(
						'animated' => __( 'Animated', 'wpsus' ),
						'static' => __( 'Static', 'wpsus' )
					),
					'description' => ''
				),
				'position' => array(
					'label' => __( 'Position', 'wpsus' ),
					'type' => 'select',
					'default_value' => 'topLeft',
					'available_values' => array(
						'topLeft' => __( 'Top Left', 'wpsus' ),
						'topCenter' => __( 'Top Center', 'wpsus' ),
						'topRight' => __( 'Top Right', 'wpsus' ),
						'centerLeft' => __( 'Center Left', 'wpsus' ),
						'centerCenter' => __( 'Center Center', 'wpsus' ),
						'centerRight' => __( 'Center Right', 'wpsus' ),
						'bottomLeft' => __( 'Bottom Left', 'wpsus' ),
						'bottomCenter' => __( 'Bottom Center', 'wpsus' ),
						'bottomRight' => __( 'Bottom Right', 'wpsus' )
					),
					'description' => ''
				),
				'width' => array(
					'label' => __( 'Width', 'wpsus' ),
					'type' => 'mixed',
					'default_value' => 'auto',
					'description' => ''
				),
				'height' => array(
					'label' => __( 'Height', 'wpsus' ),
					'type' => 'mixed',
					'default_value' => 'auto',
					'description' => ''
				),
				'horizontal' => array(
					'label' => __( 'Horizontal', 'wpsus' ),
					'type' => 'mixed',
					'default_value' => '0',
					'description' => ''
				),
				'vertical' => array(
					'label' => __( 'Vertical', 'wpsus' ),
					'type' => 'mixed',
					'default_value' => '0',
					'description' => ''
				),
				'preset_styles' => array(
					'label' => __( 'Preset Styles', 'wpsus' ),
					'type' => 'multiselect',
					'default_value' => array( 'wps-black', 'wps-padding' ),
					'available_values' => array(
						'wps-black' => __( 'Black', 'wpsus' ),
						'wps-white' => __( 'White', 'wpsus' ),
						'wps-padding' => __( 'Padding', 'wpsus' ),
						'wps-rounded' => __( 'Round Corners', 'wpsus' )
					),
					'description' => ''
				),
				'custom_class' => array(
					'label' => __( 'Custom Class', 'wpsus' ),
					'type' => 'text',
					'default_value' => '',
					'description' => ''
				),
				'show_transition' => array(
					'label' => __( 'Show Transition', 'wpsus' ),
					'type' => 'select',
					'default_value' => 'fade',
					'available_values' => array(
						'fade' => __( 'Fade', 'wpsus' ),
						'left' => __( 'Left', 'wpsus' ),
						'right' => __( 'Right', 'wpsus' ),
						'up' => __( 'Up', 'wpsus' ),
						'down' => __( 'Down', 'wpsus' )
					),
					'description' => ''
				),
				'show_offset' => array(
					'label' => __( 'Show Offset', 'wpsus' ),
					'type' => 'number',
					'default_value' => 50,
					'description' => ''
				),
				'show_delay' => array(
					'label' => __( 'Show Delay', 'wpsus' ),
					'type' => 'number',
					'default_value' => 10,
					'description' => ''
				),
				'show_duration' => array(
					'label' => __( 'Show Duration', 'wpsus' ),
					'type' => 'number',
					'default_value' => 400,
					'description' => ''
				),
				'stay_duration' => array(
					'label' => __( 'Stay Duration', 'wpsus' ),
					'type' => 'number',
					'default_value' => -1,
					'description' => ''
				),
				'hide_transition' => array(
					'label' => __( 'Hide Transition', 'wpsus' ),
					'type' => 'select',
					'default_value' => 'fade',
					'available_values' => array(
						'fade' => __( 'Fade', 'wpsus' ),
						'left' => __( 'Left', 'wpsus' ),
						'right' => __( 'Right', 'wpsus' ),
						'up' => __( 'Up', 'wpsus' ),
						'down' => __( 'Down', 'wpsus' )
					),
					'description' => ''
				),
				'hide_offset' => array(
					'label' => __( 'Hide Offset', 'wpsus' ),
					'type' => 'number',
					'default_value' => 50,
					'description' => ''
				),
				'hide_delay' => array(
					'label' => __( 'Hide Delay', 'wpsus' ),
					'type' => 'number',
					'default_value' => 10,
					'description' => ''
				),
				'hide_duration' => array(
					'label' => __( 'Hide Duration', 'wpsus' ),
					'type' => 'number',
					'default_value' => 400,
					'description' => ''
				)
			);

			self::$layer_settings = apply_filters( 'wpsus_default_layer_settings', self::$layer_settings );
		}

		return self::$layer_settings;
	}

	/**
	 * Return the slide settings.
	 *
	 * @since 1.0.0
	 * 
	 * @return array The array of slide settings.
	 */
	public static function getSlideSettings() {
		if ( empty( self::$slide_settings ) ) {
			self::$slide_settings = array(
				'content_type' => array(
					'label' => __( 'Content Type', 'wpsus' ),
					'type' => 'select',
					'default_value' => 'custom',
					'available_values' => array(
						'custom' => __( 'Custom Content', 'wpsus' ),
						'posts' => __( 'Content from posts', 'wpsus' ),
						'gallery' => __( 'Images from post\'s gallery', 'wpsus' ),
						'flickr' => __( 'Flickr images', 'wpsus' )
					),
					'description' => ''
				),
				'posts_post_types' => array(
					'label' => __( 'Post Types', 'wpsus' ),
					'type' => 'multiselect',
					'default_value' => array( 'post' ),
					'description' => ''
				),
				'posts_taxonomies' => array(
					'label' => __( 'Taxonomies', 'wpsus' ),
					'type' => 'multiselect',
					'default_value' => array(),
					'description' => ''
				),
				'posts_relation' => array(
					'label' => __( 'Match', 'wpsus' ),
					'type' => 'select',
					'default_value' => 'OR',
					'available_values' => array(
						'OR' => __( 'At least one', 'wpsus' ),
						'AND' => __( 'All', 'wpsus' )
					),
					'description' => ''
				),
				'posts_operator' => array(
					'label' => __( 'With selected', 'wpsus' ),
					'type' => 'select',
					'default_value' => 'IN',
					'available_values' => array(
						'IN' => __( 'Include', 'wpsus' ),
						'NOT IN' => __( 'Exclude', 'wpsus' )
					),
					'description' => ''
				),
				'posts_order_by' => array(
					'label' => __( 'Order By', 'wpsus' ),
					'type' => 'select',
					'default_value' => 'date',
					'available_values' => array(
						'date' => __( 'Date', 'wpsus' ),
						'comment_count' => __( 'Comments', 'wpsus' ),
						'title' => __( 'Title', 'wpsus' ),
						'rand' => __( 'Random', 'wpsus' )
					),
					'description' => ''
				),
				'posts_order' => array(
					'label' => __( 'Order', 'wpsus' ),
					'type' => 'select',
					'default_value' => 'DESC',
					'available_values' => array(
						'DESC' => __( 'Descending', 'wpsus' ),
						'ASC' => __( 'Ascending', 'wpsus' )
					),
					'description' => ''
				),
				'posts_maximum' => array(
					'label' => __( 'Limit', 'wpsus' ),
					'type' => 'number',
					'default_value' => 10,
					'description' => ''
				),
				'flickr_api_key' => array(
					'label' => __( 'API Key', 'wpsus' ),
					'type' => 'text',
					'default_value' => '',
					'description' => ''
				),
				'flickr_load_by' => array(
					'label' => __( 'Load By', 'wpsus' ),
					'type' => 'select',
					'default_value' => 'set_id',
					'available_values' => array(
						'set_id' => __( 'Set ID', 'wpsus' ),
						'user_id' => __( 'User ID', 'wpsus' )
					),
					'description' => ''
				),
				'flickr_id' => array(
					'label' => __( 'ID', 'wpsus' ),
					'type' => 'text',
					'default_value' => '',
					'description' => ''
				),
				'flickr_per_page' => array(
					'label' => __( 'Limit', 'wpsus' ),
					'type' => 'number',
					'default_value' => 10,
					'description' => ''
				)
			);

			self::$slide_settings = apply_filters( 'wpsus_default_slide_settings', self::$slide_settings );
		}

		return self::$slide_settings;
	}

	/**
	 * Return the plugin settings.
	 *
	 * @since 1.0.0
	 * 
	 * @return array The array of plugin settings.
	 */
	public static function getPluginSettings() {
		if ( empty( self::$plugin_settings ) ) {
			self::$plugin_settings = array(
				'load_stylesheets' => array(
					'label' => __( 'Load stylesheets', 'wpsus' ),
					'default_value' => 'automatically',
					'available_values' => array(
						'automatically' => __( 'Automatically', 'wpsus' ),
						'homepage' => __( 'On homepage', 'wpsus' ),
						'all' => __( 'On all pages', 'wpsus' )
					),
					'description' => __( 'Plugin can detect stylesheet in automatically, though if you feel that its going as you thought or you want to show stye sheet in only one page, select <i>On homepage</i>, or select <i>On all pages</i>.' , 'wpsus' )
				),
				'load_custom_css_js' => array(
					'label' => __( 'Load custom CSS and JavaScript', 'wpsus' ),
					'default_value' => 'inline',
					'available_values' => array(
						'inline' => __( 'Inline', 'wpsus' ),
						'in_files' => __( 'In files', 'wpsus' )
					),
					'description' => __( 'You may wish to create you custom CSS style sheet or JS file to control sliders, files will be automatically created if not you may b asked for admin credentials sometimes which is due to wp admin this plugin has nothing to do with it.' , 'wpsus' )
				),
				'load_js_in_all_pages' => array(
					'label' => __( 'Load JS files on all pages', 'wpsus' ),
					'default_value' => false,
					'description' => __( 'Enabling this will load javascript for sliders in all pages, its mostly needed for AJAX used pages.' , 'wpsus' )
				),
				'load_unminified_scripts' => array(
					'label' => __( 'Load unminified scripts', 'wpsus' ),
					'default_value' => false,
					'description' => __( 'Check this option if you want to load the unminified/uncompressed CSS and JavaScript files for the slider. This is useful for debugging purposes.', 'wpsus' )
				),
				'cache_expiry_interval' => array(
					'label' => __( 'Cache expiry interval', 'wpsus' ),
					'default_value' => 24,
					'description' => __( 'Indicates the time interval after which a slider\'s cache will expire. If the cache of a slider has expired, the slider will be rendered again and cached the next time it is viewed.', 'wpsus' )
				),
				'hide_inline_info' => array(
					'label' => __( 'Hide inline info', 'wpsus' ),
					'default_value' => false,
					'description' => __( 'Indicates whether the inline information will be displayed in admin slides and wherever it\'s available.', 'wpsus' )
				),
				'hide_getting_started_info' => array(
					'label' => __( 'Hide <i>Getting Started</i> info', 'wpsus' ),
					'default_value' => false,
					'description' => __( 'Indicates whether the <i>Getting Started</i> information will be displayed in the <i>All Sliders</i> page, above the list of sliders. This setting will be disabled if the <i>Close</i> button is clicked in the information box.', 'wpsus' )
				),
				'access' => array(
					'label' => __( 'Access', 'wpsus' ),
					'default_value' => 'manage_options',
					'available_values' => array(
						'manage_options' => __( 'Administrator', 'wpsus' ),
						'publish_pages' => __( 'Editor', 'wpsus '),
						'publish_posts' => __( 'Author', 'wpsus' ),
						'edit_posts' => __( 'Contributor', 'wpsus' )
					),
					'description' => __( 'Sets what category of users will have access to the plugin\'s admin area.', 'wpsus' )
				)
			);
		}

		return self::$plugin_settings;
	}
}