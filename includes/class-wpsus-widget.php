<?php
/**
 * wp sus widget
 * 
 * @since 1.0.0
 */
class WPSS_WpSus_Widget extends WP_Widget {
	
	/**
	 * Initialize the widget
	 *
	 * @since 1.0.0
	 */
	public function __construct() {
		
		$widget_opts = array(
			'classname' => 'wpss-wpsus-widget',
			'description' => 'Display a wp super slider instance in the widgets area.'
		);
		
		parent::__construct( 'wpss-wpsus-widget', 'wp sus', $widget_opts );
	}
	
	/**
	 * Create the admin interface of the widget.
	 *
	 * Receives the title of the widget and the id of the
	 * selected slider. Then it gets loads all slider
	 * id's and names from the database and displays them in
	 * the list of sliders to chose from.
	 *
	 * @since 1.0.0
	 * 
	 * @param  array $instance The slider id and widget title
	 */
	public function form( $instance ) {
		$instance = wp_parse_args( ( array )$instance, array( 'slider_id' => '' ) );
		
		$slider_id = strip_tags( $instance['slider_id'] );
		$title = isset( $instance['title'] ) ? strip_tags( $instance['title'] ) : '';
		
		global $wpdb;
		$table_name = $wpdb->prefix . 'wp_sus_sliders';
		$sliders = $wpdb->get_results( "SELECT id, name FROM $table_name", ARRAY_A );
		
		echo '<p>';
		echo '<label for="' . $this->get_field_name( 'title' ) . '">Title: </label>';
		echo '<input type="text" value="' . $title . '" name="' . $this->get_field_name( 'title' ) . '" id="' . $this->get_field_name( 'title' ) . '" class="widefat">';
		echo '</p>';
		
		echo '<p>';
		echo '<label for="' . $this->get_field_name( 'slider_id' ) . '">Select the slider: </label>';
		echo '<select name="' . $this->get_field_name( 'slider_id' ) . '" id="' . $this->get_field_name( 'slider_id' ) . '" class="widefat">';
			foreach ( $sliders as $slider ) {
				$selected = $slider_id == $slider['id'] ? 'selected="selected"' : "";
				echo "<option value=". $slider['id'] ." $selected>" . stripslashes( $slider['name'] ) . ' (' . $slider['id'] . ')' . "</option>";
			}
		echo '</select>';
		echo '</p>';
	}
	
	/**
	 * Updates the selected slider.
	 *
	 * @since 1.0.0
	 * 
	 * @param  array $new_instance The new slider instance.
	 * @param  array $old_instance The old slider instance.
	 * @return array               The new slider instance.
	 */
	public function update( $new_instance, $old_instance ) {
		$instance = $old_instance;		
		$instance['slider_id'] = strip_tags( $new_instance['slider_id'] );
		$instance['title'] = strip_tags( $new_instance['title'] );
		
		return $instance;
	}
	
	/**
	 * Create the public view.
	 *
	 * @since 1.0.0
	 * 
	 * @param  array $args     Widget data.
	 * @param  array $instance Slider instance id and widget title
	 */
	function widget( $args, $instance ) {
		extract( $args, EXTR_SKIP );
		$title = apply_filters( 'widget_title', $instance['title'], $instance, $this->id_base );
		
		echo $before_widget;
		
		if ( $title ) {
			echo $before_title . $title . $after_title;
		}

		echo do_shortcode( '[wpsus id="' . $instance['slider_id'] . '"]' );
		echo $after_widget;
	}
}

/**
 * Register the widget
 *
 * @since 1.0.0
 */
function wpss_wps_register_widget() {
	register_widget( 'WPSS_WpSus_Widget' );
}