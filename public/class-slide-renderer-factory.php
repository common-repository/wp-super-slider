<?php
/**
 * Factory for slide renderers.
 *
 * Implements the appropriate functionality for each slide, depending on the slide's type.
 *
 * @since  1.0.0
 */
class WPSS_WPS_Slide_Renderer_Factory {

	/**
	 * List of slide types and the associated slide renderer class name.
	 *
	 * @since 1.0.0
	 * 
	 * @var array
	 */
	protected static $registered_types = array(
		'custom' => 'WPSS_WPS_Slide_Renderer',
		'posts' => 'WPSS_WPS_Posts_Slide_Renderer',
		'gallery' => 'WPSS_WPS_Gallery_Slide_Renderer',
		'flickr' => 'WPSS_WPS_Flickr_Slide_Renderer'
	);

	/**
	 * Default slide type.
	 *
	 * @since 1.0.0
	 *
	 * @var string
	 */
	protected static $default_type = null;

	/**
	 * Return an instance of the renderer class based on the type of the slide.
	 *
	 * @since 1.0.0
	 * 
	 * @param  array  $data The data of the slide.
	 * @return object       An instance of the appropriate renderer class.
	 */
	public static function create_slide( $data ) {
		if ( is_null( self::$default_type ) ) {
			$default_settings = WPSS_WpSus_Settings::getSlideSettings();
			self::$default_type = $default_settings['content_type']['default_value'];
		}

		$type = isset( $data['settings']['content_type'] ) ? $data['settings']['content_type'] : self::$default_type;

		foreach( self::$registered_types as $registered_type_name => $registered_type_class ) {
			if ( $type === $registered_type_name ) {
				return new $registered_type_class();
			}
		}
	}
}