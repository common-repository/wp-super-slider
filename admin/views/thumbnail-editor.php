<div class="modal-overlay"></div>
<div class="modal-window-container thumbnail-editor <?php echo $content_class;?>">
	<div class="modal-window">
		<span class="close-x"></span>
		<div class="fieldset thumbnail">
			<h3 class="heading"><?php _e( 'Thumbnail Image', 'wpsus' ); ?><span class="clear-fieldset"><?php _e( 'Clear', 'wpsus' ); ?></span></h3>
			<div class="image-loader">
				<?php
					if ( isset( $data['thumbnail_source'] ) && $data['thumbnail_source'] !== '' ) {
						echo '<img src="' . $data['thumbnail_source'] . '" />';
					} else {
						echo '<p class="no-image">' . __( 'Click to add image', 'wpsus' ) . '</p>';
					}
				?>
			</div>
			<table>
				<tbody>
					<tr>
						<td><label for="thumbnail-source"><?php _e( 'Source:', 'wpsus' ); ?></label></td>
						<td><input id="thumbnail-source" class="field" type="text" name="thumbnail_source" value="<?php echo isset( $data['thumbnail_source'] ) ? esc_attr( $data['thumbnail_source'] ) : ''; ?>" /></td>
					</tr>
					<tr>
						<td><label for="thumbnail-alt"><?php _e( 'Alt:', 'wpsus' ); ?></label></td>
						<td><input id="thumbnail-alt" class="field" type="text" name="thumbnail_alt" value="<?php echo isset( $data['thumbnail_alt'] ) ? esc_attr( $data['thumbnail_alt'] ) : ''; ?>" /></td>
					</tr>
					<tr>
						<td><label for="thumbnail-title"><?php _e( 'Title:', 'wpsus' ); ?></label></td>
						<td><input id="thumbnail-title" class="field" type="text" name="thumbnail_title" value="<?php echo isset( $data['thumbnail_title'] ) ? esc_attr( $data['thumbnail_title'] ) : ''; ?>" /></td>
					</tr>
					<tr>
						<td><label for="thumbnail-retina-source"><?php _e( 'Retina Source:', 'wpsus' ); ?></label></td>
						<td><input id="thumbnail-retina-source" class="field" type="text" name="thumbnail_retina_source" value="<?php echo isset( $data['thumbnail_retina_source'] ) ? esc_attr( $data['thumbnail_retina_source'] ) : ''; ?>" /><span class="additional-image-loader"></span></td>
					</tr>
				</tbody>
			</table>
		</div>

		<div class="fieldset link">
			<h3 class="heading"><?php _e( 'Thumbnail Link', 'wpsus' ); ?><span class="clear-fieldset"><?php _e( 'Clear', 'wpsus' ); ?></span></h3>
			<table>
				<tbody>
					<tr>
						<td><label for="thumbnail-link"><?php _e( 'URL:', 'wpsus' ); ?></label></td>
						<td><input id="thumbnail-link" class="field" type="text" name="thumbnail_link" value="<?php echo isset( $data['thumbnail_link'] ) ?  esc_attr( $data['thumbnail_link'] ) : ''; ?>" /></td>
					</tr>
					<tr>
						<td><label for="thumbnail-link-title"><?php _e( 'Title:', 'wpsus' ); ?></label></td>
						<td><input id="thumbnail-link-title" class="field" type="text" name="thumbnail_link_title" value="<?php echo isset( $data['thumbnail_link_title'] ) ? esc_attr( $data['thumbnail_link_title'] ) : ''; ?>" /></td>
					</tr>
				</tbody>
			</table>
		</div>
		
		<div class="fieldset content">
			<h3 class="heading"><?php _e( 'Thumbnail Content', 'wpsus' ); ?></h3>
			<textarea class="field" name="thumbnail_content"><?php echo isset( $data['thumbnail_content'] ) ? esc_textarea( stripslashes( $data['thumbnail_content'] ) ) : ''; ?></textarea>
		</div>

		<?php
            $hide_info = get_option( 'wpsus_hide_inline_info' );

            if ( $hide_info != true ) {
        ?>
            <div class="inline-info thumbnail-editor-info">
                <input type="checkbox" id="show-hide-info" class="show-hide-info">
				<label for="show-hide-info" class="show-info"><?php _e( 'Show info', 'wpsus' ); ?></label>
				<label for="show-hide-info" class="hide-info"><?php _e( 'Hide info', 'wpsus' ); ?></label>
				
				<div class="info-content">
	                <p><?php _e( 'The <i>Thumbnail Image</i> field allows you to specify an image that will be used as the corresponding thumbnail for the slide. Also, the <i>Thumbnail Link</i> field allows you to set a link for this image.', 'wpsus' ); ?></p>
	                <p><?php _e( 'Thumbnail images can also be created automatically by checking the <i>Auto Thumbnail Images</i> option from the <i>Thumbnails</i> sidebar panel. The <i>Thumbnail Image Size</i> option from the same sidebar panel allows you to select what image version will be loaded as a thumbnail. If you would like to use a different size than those that are available, you can use a separate plugin that will allow you to create additional size versions for the images.', 'wpsus' ); ?></p>
	                <p><?php _e( 'The <i>Thumbnail Content</i> field allows you to add content (from simple text to any HMTL content) to the thumbnails. Also, you can add the image specified in the <i>Thumbnail Image</i> field inside the <i>Thumbnail Content</i> field by using the <i>[wps_thumbnail_image]</i> shortcode.', 'wpsus' ); ?></p>
					
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
										<td><b>[wps_link_url]</b></td>
										<td> - </td>
										<td><p><?php _e( 'The post\'s link.', 'wpsus' ); ?></p></td>
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