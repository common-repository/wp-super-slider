<div class="modal-overlay"></div>
<div class="modal-window-container html-editor">
	<div class="modal-window">
		<span class="close-x"></span>

		<textarea><?php echo isset( $html_content ) ? esc_textarea( stripslashes( $html_content ) ) : ''; ?></textarea>

		<?php
            $hide_info = get_option( 'wpsus_hide_inline_info' );

            if ( $hide_info != true ) {
        ?>
            <div class="inline-info html-editor-info">
            	<input type="checkbox" id="show-hide-info" class="show-hide-info">
				<label for="show-hide-info" class="show-info"><?php _e( 'Show info', 'wpsus' ); ?></label>
				<label for="show-hide-info" class="hide-info"><?php _e( 'Hide info', 'wpsus' ); ?></label>
				
				<div class="info-content">
	                <p><?php _e( 'In the field above you can add raw HTML content.', 'wpsus' ); ?></p>
	                <p><?php _e( 'Please note that HTML content added in this section will not be responsive by default. You will need to use custom CSS to make it responsive. If you want your content to be responsive automatically, you can add it in the <i>Layers</i> section, as layers are set to be responsive automatically.', 'wpsus' ); ?></p>

					<?php
						if ( $content_type === 'posts' || $content_type === 'gallery' || $content_type === 'flickr' ) {
					?>
						<input type="checkbox" id="show-hide-dynamic-tags" class="show-hide-dynamic-tags">
						<label for="show-hide-dynamic-tags" class="show-dynamic-tags"><?php _e( 'Show dynamic tags', 'wpsus' ); ?></label>
						<label for="show-hide-dynamic-tags" class="hide-dynamic-tags"><?php _e( 'Hide dynamic tags', 'wpsus' ); ?></label>
					<?php
						}

						if ( $content_type === 'posts' ) {
					?>
							<table class="dynamic-tags">
								<tbody>
									<tr>
										<td><b>[wps_image]</b></td>
										<td> - </td>
										<td><p><?php _e( 'The post\'s featured image, as an <i>img</i> HTML element. It accepts an optional parameter to specify the size of the image: [wps_image.thumbnail]. Accepted sizes are: <i>full</i>, <i>large</i>, <i>medium</i>, <i>thumbnail</i>. The default value is <i>full</i>.', 'wpsus' ); ?></p></td>
									</tr>
									<tr>
										<td><b>[wps_image_src]</b></td>
										<td> - </td>
										<td><p><?php _e( 'The URL of the post\'s featured image. It accepts an optional parameter to specify the size of the image: [wps_image_src.thumbnail]. Accepted sizes are: <i>full</i>, <i>large</i>, <i>medium</i>, <i>thumbnail</i>. The default value is <i>full</i>.', 'wpsus' ); ?></p></td>
									</tr>
									<tr>
										<td><b>[wps_image_alt]</b></td>
										<td> - </td>
										<td><p><?php _e( 'The <i>alt</i> text of the post\'s featured image.', 'wpsus' ); ?></p></td>
									</tr>
									<tr>
										<td><b>[wps_image_title]</b></td>
										<td> - </td>
										<td><p><?php _e( 'The title of the post\'s featured image.', 'wpsus' ); ?></p></td>
									</tr>
									<tr>
										<td><b>[wps_image_description]</b></td>
										<td> - </td>
										<td><p><?php _e( 'The description of the post\'s featured image.', 'wpsus' ); ?></p></td>
									</tr>
									<tr>
										<td><b>[wps_image_caption]</b></td>
										<td> - </td>
										<td><p><?php _e( 'The caption of the post\'s featured image.', 'wpsus' ); ?></p></td>
									</tr>
									<tr>
										<td><b>[wps_title]</b></td>
										<td> - </td>
										<td><p><?php _e( 'The post\'s title.', 'wpsus' ); ?></p></td>
									</tr>
									<tr>
										<td><b>[wps_link]</b></td>
										<td> - </td>
										<td><p><?php _e( 'The post\'s link, as an <i>anchor</i> HTML element, with the post\'s title as the text of the link.', 'wpsus' ); ?></p></td>
									</tr>
									<tr>
										<td><b>[wps_link_url]</b></td>
										<td> - </td>
										<td><p><?php _e( 'The post\'s link.', 'wpsus' ); ?></p></td>
									</tr>
									<tr>
										<td><b>[wps_date]</b></td>
										<td> - </td>
										<td><p><?php _e( 'The post\'s date.', 'wpsus' ); ?></p></td>
									</tr>
									<tr>
										<td><b>[wps_excerpt]</b></td>
										<td> - </td>
										<td><p><?php _e( 'The post\'s excerpt.', 'wpsus' ); ?></p></td>
									</tr>
									<tr>
										<td><b>[wps_content]</b></td>
										<td> - </td>
										<td><p><?php _e( 'The post\'s content.', 'wpsus' ); ?></p></td>
									</tr>
									<tr>
										<td><b>[wps_category]</b></td>
										<td> - </td>
										<td><p><?php _e( 'The first category that the post is assigned to.', 'wpsus' ); ?></p></td>
									</tr>
									<tr>
										<td><b>[wps_custom.<i>name</i>]</b></td>
										<td> - </td>
										<td><p><?php _e( 'Returns the value from a custom field. The <i>name</i> parameter indicates the name of the custom field.', 'wpsus' ); ?></p></td>
									</tr>
								</tbody>
							</table>
	            	<?php
	            		} else if ( $content_type === 'gallery' ) {
	            	?>
	            			<table class="dynamic-tags">
								<tbody>
									<tr>
										<td><b>[wps_image]</b></td>
										<td> - </td>
										<td><p><?php _e( 'The gallery image, as an <i>img</i> HTML element. It accepts an optional parameter to specify the size of the image: [wps_image.thumbnail]. Accepted sizes are: <i>full</i>, <i>large</i>, <i>medium</i>, <i>thumbnail</i>. The default value is <i>full</i>.', 'wpsus' ); ?></p></td>
									</tr>
									<tr>
										<td><b>[wps_image_src]</b></td>
										<td> - </td>
										<td><p><?php _e( 'The URL of the gallery image. It accepts an optional parameter to specify the size of the image: [wps_image_src.thumbnail]. Accepted sizes are: <i>full</i>, <i>large</i>, <i>medium</i>, <i>thumbnail</i>. The default value is <i>full</i>.', 'wpsus' ); ?></p></td>
									</tr>
									<tr>
										<td><b>[wps_image_alt]</b></td>
										<td> - </td>
										<td><p><?php _e( 'The <i>alt</i> text of the gallery image.', 'wpsus' ); ?></p></td>
									</tr>
									<tr>
										<td><b>[wps_image_title]</b></td>
										<td> - </td>
										<td><p><?php _e( 'The title of the gallery image.', 'wpsus' ); ?></p></td>
									</tr>
									<tr>
										<td><b>[wps_image_description]</b></td>
										<td> - </td>
										<td><p><?php _e( 'The description of the gallery image.', 'wpsus' ); ?></p></td>
									</tr>
								</tbody>
							</table>
	            	<?php
	            		} else if ( $content_type === 'flickr' ) {
	            	?>
	            			<table class="dynamic-tags">
								<tbody>
									<tr>
										<td><b>[wps_image]</b></td>
										<td> - </td>
										<td><p><?php _e( 'The Flickr image, as an <i>img</i> HTML element. It accepts an optional parameter to specify the size of the image: [wps_image.thumbnail]. Accepted sizes are: <i>full</i>, <i>large</i>, <i>medium</i>, <i>thumbnail</i>. The default value is <i>full</i>.', 'wpsus' ); ?></p></td>
									</tr>
									<tr>
										<td><b>[wps_image_src]</b></td>
										<td> - </td>
										<td><p><?php _e( 'The URL of the Flickr image. It accepts an optional parameter to specify the size of the image: [wps_image_src.thumbnail]. Accepted sizes are: <i>square</i>, <i>thumbnail</i>, <i>small</i>, <i>medium</i>, <i>medium_640</i>, <i>large</i>. The default value is <i>medium</i>.', 'wpsus' ); ?></p></td>
									</tr>
									<tr>
										<td><b>[wps_image_description]</b></td>
										<td> - </td>
										<td><p><?php _e( 'The description of the Flickr image.', 'wpsus' ); ?></p></td>
									</tr>
									<tr>
										<td><b>[wps_image_link]</b></td>
										<td> - </td>
										<td><p><?php _e( 'The link of the Flickr image.', 'wpsus' ); ?></p></td>
									</tr>
									<tr>
										<td><b>[wps_date]</b></td>
										<td> - </td>
										<td><p><?php _e( 'The date of the Flickr image.', 'wpsus' ); ?></p></td>
									</tr>
									<tr>
										<td><b>[wps_username]</b></td>
										<td> - </td>
										<td><p><?php _e( 'The username of the image\'s owner.', 'wpsus' ); ?></p></td>
									</tr>
									<tr>
										<td><b>[wps_user_link]</b></td>
										<td> - </td>
										<td><p><?php _e( 'The link to the profile of the image\'s owner.', 'wpsus' ); ?></p></td>
									</tr>
								</tbody>
							</table>
	            	<?php
	            		}
	            	?>
	            </div>
            </div>
        <?php
            }
        ?>
	</div>
</div>