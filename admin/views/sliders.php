<div class="wrap wpsus-admin">
<h2><?php _e( 'Sliders' ); ?></h2>
<div class="inline-info getting-started-info">
		

			<h3><?php _e( 'Welcome', 'wpsus' ); ?></h3>
			<p><?php _e( 'Welcome and Thanks for using WP Super Slider, For installation help you can visit: ', 'wpsus' ); ?><a href="http://shajal16.com/wpsus" target="_blank">www.shajal16.com/wpsus</a>. </p>
			
		

			
		</div>
<div class="new-slider-buttons">    
		<a class="button-secondary" href="<?php echo admin_url( 'admin.php?page=wpsus-new' ); ?>"><?php _e( 'Create New Slider', 'wpsus' ); ?></a>
		<a class="button-secondary import-slider" href=""><?php _e( 'Import Slider', 'wpsus' ); ?></a>
		<a class="button-secondary" href="<?php echo admin_url( 'admin.php?page=wpsus-custom' ); ?>"><?php _e( 'Custom JS and CSS', 'wpsus' ); ?></a>
		<a class="button-secondary" href="<?php echo admin_url( 'admin.php?page=wpsus-settings' ); ?>"><?php _e( 'WPSUS Settings', 'wpsus' ); ?></a>
		
		
</div>  
	<table class="widefat sliders-list">
	<thead>
	<tr>
		<th><?php _e( 'ID', 'wpsus' ); ?></th>
		<th><?php _e( 'Name', 'wpsus' ); ?></th>
		<th><?php _e( 'Shortcode', 'wpsus' ); ?></th>
		<th><?php _e( 'Created', 'wpsus' ); ?></th>
		<th><?php _e( 'Modified', 'wpsus' ); ?></th>
		<th><?php _e( 'Actions', 'wpsus' ); ?></th>
	</tr>
	</thead>
	
	<tbody>
		
	<?php
		global $wpdb;
		$prefix = $wpdb->prefix;

		$sliders = $wpdb->get_results( "SELECT * FROM " . $prefix . "wp_sus_sliders ORDER BY id" );
		
		if ( count( $sliders ) === 0 ) {
			echo '<tr class="no-slider-row">' .
					 '<td colspan="100%">' . __( 'You don\'t have saved sliders.', 'wpsus' ) . '</td>' .
				 '</tr>';
		} else {
			foreach ( $sliders as $slider ) {
				$slider_id = $slider->id;
				$slider_name = stripslashes( $slider->name );
				$slider_created = $slider->created;
				$slider_modified = $slider->modified;

				include( 'sliders-row.php' );
			}
		}
	?>

	</tbody>
	
	<tfoot>
	<tr>
		<th><?php _e( 'ID', 'wpsus' ); ?></th>
		<th><?php _e( 'Name', 'wpsus' ); ?></th>
		<th><?php _e( 'Shortcode', 'wpsus' ); ?></th>
		<th><?php _e( 'Created', 'wpsus' ); ?></th>
		<th><?php _e( 'Modified', 'wpsus' ); ?></th>
		<th><?php _e( 'Actions', 'wpsus' ); ?></th>
	</tr>
	</tfoot>
	</table>
    
    
	
	
	<?php
		$hide_info = get_option( 'wpsus_hide_getting_started_info' );

		if ( $hide_info != true ) {
	?>
	    <div class="inline-info getting-started-info">
		

			<h3><?php _e( 'Support', 'wpsus' ); ?></h3>
			<p><?php _e( 'For support, please contact me at my email:', 'wpsus' ); ?> <a href="mailto:shajal16@gmail.com?Subject=Support%20WPSUS" target="_top">shajal16@gmail.com</a>.</p>
			
		

			<a href="#" class="getting-started-close">Close</a>
		</div>
	<?php
		}
	?>
</div>

