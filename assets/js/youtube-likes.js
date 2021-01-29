;(function(){
	'use strict';

	class YoutubeLikes {
		_is_enabled = false;
		_likes_html = undefined;
		_dislikes_html = undefined;
		enable() {
			if ( this._is_enabled ) this.disable();

			this._is_enabled = true;

			window.requestAnimationFrame( this._frame.bind( this ) );
		}
		disable() {
			if ( !this._is_enabled ) return;

			this._is_enabled = false;
		}
		_frame() {
			if ( !this._is_enabled ) return;

			this._on_frame();

			window.requestAnimationFrame( this._frame.bind( this ) );
		}
		_on_frame() {
			let video_id = this._get_query_variable( 'v', location.href );

			if ( !video_id ) return;

			let $parent = document.querySelector( '#info #menu #top-level-buttons' );

			if ( !$parent ) return;

			let $buttons = $parent.querySelectorAll( 'ytd-toggle-button-renderer' );
			
			if ( !$buttons.length ) return;

			let $likes = $buttons[0].querySelector( '#text' );
			let $dislikes = $buttons[1].querySelector( '#text' );

			if ( !$likes ) return;
			if ( !$dislikes ) return;

			let likes_changed = $likes.outerHTML !== this._likes_html;
			let dislikes_changed = $dislikes.outerHTML !== this._dislikes_html;

			if ( likes_changed || dislikes_changed ) {
				this._on_change( video_id, $likes, $dislikes );

				this._likes_html = $likes.outerHTML;
				this._dislikes_html = $dislikes.outerHTML;
			}
		}
		_on_change( video_id, $likes, $dislikes ) {
			let likes = $likes.getAttribute( 'aria-label' );
			let dislikes = $dislikes.getAttribute( 'aria-label' );

			if ( !likes && !dislikes ) {
				likes = $likes.getAttribute( 'data-likes-value' );
				dislikes = $dislikes.getAttribute( 'data-likes-value' );
			}

			if ( !likes && !dislikes ) {
				$likes.setAttribute( 'data-likes-percentage', '' );
				$dislikes.setAttribute( 'data-likes-percentage', '' );

				return;
			}

			likes = parseInt( likes.replace( /[^\d]/gi, '' ) );
			dislikes = parseInt( dislikes.replace( /[^\d]/gi, '' ) );

			let likes_prop = 0;
			let dislikes_prop = 0;

			if ( likes || dislikes ) {
				if ( likes && dislikes ) {
					likes_prop = likes / ( likes + dislikes );
					dislikes_prop = dislikes / ( likes + dislikes );
				} else {
					if ( likes ) {
						likes_prop = 1.00;
					} else {
						dislikes_prop = 1.00;
					}
				}
			}

			likes_prop = ( 100 * likes_prop ).toFixed(2);
			dislikes_prop = ( 100 * dislikes_prop ).toFixed(2);

			$likes.setAttribute( 'data-likes-percentage', `${likes_prop}%` );
			$dislikes.setAttribute( 'data-likes-percentage', `${dislikes_prop}%` );
			
			$likes.setAttribute( 'data-likes-value', `${likes}` );
			$dislikes.setAttribute( 'data-likes-value', `${dislikes}` );
		}
		_get_query_variable( variable, url ){
			if ( !url ) url = window.location;
			if ( !url ) return undefined;
			
			let query = url.split( '?' )[ 1 ];

			if ( !query ) return undefined;

			let vars = query.split( '&' );
			
			for ( let i = 0; i < vars.length; i++ ) {
				let pair = vars[i].split( '=' );
				
				if ( decodeURIComponent( pair[0] ) == variable ) {
					return decodeURIComponent( pair[1] );
				}
			}
		}
	}

	window.YoutubeLikes = YoutubeLikes;
})();