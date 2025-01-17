<div class="modal-overlay"></div>
<div class="modal-window-container layers-editor no-layers">
	<div class="modal-window">
		<span class="close-x"></span>

		<div class="layer-viewport"></div>

		<div class="layer-controls wps-clearfix">
			<div class="layer-controls-left">
				<div class="layer-buttons">
					<div class="add-layer-group">
                        <a class="add-new-layer" href="#" title="<?php _e( 'Add Layer', 'wpsus' ); ?>"><?php _e( 'Add', 'wpsus' ); ?></a>
                        <ul class="layer-type">
                            <li><a href="#" data-type="video"><?php _e( 'Video Layer', 'wpsus' ); ?></a></li>
                            <li><a href="#" data-type="div"><?php _e( 'DIV Layer', 'wpsus' ); ?></a></li>
                            <li><a href="#" data-type="image"><?php _e( 'Image Layer', 'wpsus' ); ?></a></li>
                            <li><a href="#" data-type="heading"><?php _e( 'Heading Layer', 'wpsus' ); ?></a></li>
                            <li><a href="#" data-type="paragraph"><?php _e( 'Paragraph Layer', 'wpsus' ); ?></a></li>
                        </ul>
                    </div>
					
					<a class="delete-layer disabled" href="#" title="<?php _e( 'Delete Layer', 'wpsus' ); ?>"><?php _e( 'Delete', 'wpsus' ); ?></a>
					<a class="duplicate-layer disabled" href="#" title="<?php _e( 'Duplicate Layer', 'wpsus' ); ?>"><?php _e( 'Duplicate', 'wpsus' ); ?></a>
				</div>

				<ul class="list-layers">
					<?php
						foreach ( $layers as $layer ) {
							$layer_id = $layer[ 'id' ];
							$layer_name = $layer[ 'name' ];
							echo '<li class="list-layer" data-id="' . $layer_id . '">' . $layer_name . '</li>';
						}
					?>
				</ul>
			</div>

			<ul class="layer-controls-right layers-settings">
				<?php
					foreach ( $layers as $layer ) {
						$layer_id = $layer[ 'id' ];
						$layer_type = $layer[ 'type' ];
						$layer_settings = $layer[ 'settings' ];

						include( 'layer-settings.php' );
					}
				?>
			</ul>
		</div>

		<?php
            $hide_info = get_option( 'wpsus_hide_inline_info' );

            if ( $hide_info != true ) {
        ?>
            <div class="inline-info layers-editor-info">
            	<input type="checkbox" id="show-hide-info" class="show-hide-info">
				<label for="show-hide-info" class="show-info"><?php _e( 'Show info', 'wpsus' ); ?></label>
				<label for="show-hide-info" class="hide-info"><?php _e( 'Hide info', 'wpsus' ); ?></label>
				
				<div class="info-content">
					<div class="no-layers-info">
						<p><?php _e( 'To add a new layer, hover on the plus sign above and select a layer type.', 'wpsus' ); ?></p>
					</div>

        			<div class="has-layers-info">
		                <p><?php _e( 'The <i>Display</i> setting from the <i>Appearance</i> tab allows you to specify if the layer will be animated or if it will be static (permanently visible inside the slide).', 'wpsus' ); ?></p>
		                <p><?php _e( 'The <i>Position</i> setting allows you to set the reference point for the layer\'s horizontal and vertical position. The <i>Horizontal</i> and <i>Vertical</i> settings can be set to fixed or percentage values. The <i>Width</i> and <i>Height</i> settings can be set to fixed or percentage values, or to <i>auto</i>.', 'wpsus' ); ?></p>
						<p><?php _e( 'To style the layer, you can select one or more of the <i>Preset Styles</i>, or assign it a <i>Custom Class</i> and add some', 'wpsus' ); ?> <a target="_blank" href="<?php echo admin_url( 'admin.php?page=wpsus-custom' ); ?>"><?php _e( 'custom CSS', 'wpsus' ); ?></a> <?php _e( 'for it.', 'wpsus' ); ?></p>
						<p><?php _e( '<strong>Note:</strong> The style of <i>Paragraph</i>, <i>Heading</i> or <i>Image</i> layers might be affected by the theme\'s CSS code when you publish the slider in a page. More details in the', 'wpsus' ); ?> <a target="_blank" href="<?php echo admin_url( 'admin.php?page=wpsus-documentation' ); ?>"><?php _e( 'Troubleshooting chapter', 'wpsus' ); ?></a>.</p>
						
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
            </div>
        <?php
            }
        ?>
		
	</div>
</div>