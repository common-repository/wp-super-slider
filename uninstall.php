<?php

if ( ! defined( 'WP_UNINSTALL_PLUGIN' ) ) {
	exit();
}

if ( function_exists( 'is_multisite' ) && is_multisite() ) {
	global $wpdb;			
	$blog_ids = $wpdb->get_col( "SELECT blog_id FROM $wpdb->blogs" );
	
	if ( $blog_ids !== false ) {
		foreach ( $blog_ids as $blog_id ) {
			switch_to_blog( $blog_id );
			wpss_wpsus_delete_all_data();
		}

		restore_current_blog();
	}
} else {
	wpss_wpsus_delete_all_data();
}

function wpss_wpsus_delete_all_data() {
	global $wpdb;
	$prefix = $wpdb->prefix;

	$sliders_table = $prefix . 'wp_sus_sliders';
	$slides_table = $prefix . 'wp_sus_slides';
	$layers_table = $prefix . 'wp_sus_layers';

	$wpdb->query( "DROP TABLE $sliders_table, $slides_table, $layers_table" );

	delete_option( 'wpsus_custom_css' );
	delete_option( 'wpsus_custom_js' );
	delete_option( 'wpsus_is_custom_css' );
	delete_option( 'wpsus_is_custom_js' );
	delete_option( 'wpsus_load_stylesheets' );
	delete_option( 'wpsus_load_custom_css_js' );
	delete_option( 'wpsus_load_unminified_scripts' );
	delete_option( 'wpsus_activatewp_pluginok' );
	delete_option( 'wpsus_activatewp_pluginok_message' );
	delete_option( 'wpsus_activatewp_pluginok_status' );
	delete_option( 'wpsus_hide_inline_info' );
	delete_option( 'wpsus_hide_getting_started_info' );
	delete_option( 'wpsus_access' );
	delete_option( 'wpsus_version' );

	delete_transient( 'wpsus_post_names' );
	delete_transient( 'wpsus_posts_data' );
	delete_transient( 'wpsus_update_notification_message' );
	
	$wpdb->query( "DELETE FROM " . $prefix . "options WHERE option_name LIKE '%wpsus_cache%'" );
}