<div class="modal-overlay"></div>
<div class="modal-window-container import-window">
	<div class="modal-window">
		<span class="close-x"></span>
		
		<textarea></textarea>

		<div class="buttons wps-clearfix">
			<a class="button-secondary save" href="#"><?php _e( 'Import', 'wpsus' ); ?></a>
		</div>
		
		<?php
            $hide_info = get_option( 'wpsus_hide_inline_info' );

            if ( $hide_info != true ) {
        ?>
				<div class="inline-info import-info">
		            <input type="checkbox" id="show-hide-info" class="show-hide-info">
		            <label for="show-hide-info" class="show-info"><?php _e( 'Show info', 'wpsus' ); ?></label>
		            <label for="show-hide-info" class="hide-info"><?php _e( 'Hide info', 'wpsus' ); ?></label>
		            
		            <div class="info-content">
		                <p><?php _e( 'In the field above you need to copy the new slider\'s data, as it was exported. Then, click in the <i>Import</i> button.', 'wpsus' ); ?></p>
		            </div>
		        </div>
		<?php
            }
        ?>
	</div>
</div>