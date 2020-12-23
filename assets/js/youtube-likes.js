;(function(){
	'use strict';

	class YoutubeLikes {
		is_enabled = false;
		cache = {
			likes: {
				outerHTML: undefined,
			},
			dislikes: {
				outerHTML: undefined,
			},
		};
		enable() {
			if ( this.is_enabled ) this.disable();

			this.is_enabled = true;

			window.requestAnimationFrame( this._frame.bind( this ) );
		}
		disable() {
			if ( !this.is_enabled ) return;

			this.is_enabled = false;
		}
		_frame() {
			if ( !this.is_enabled ) return;

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

			let likes_changed = $likes.outerHTML !== this.cache.likes.outerHTML;
			let dislikes_changed = $dislikes.outerHTML !== this.cache.dislikes.outerHTML;

			if ( likes_changed || dislikes_changed ) {
				this._on_change( video_id, $likes, $dislikes );

				this.cache.likes.outerHTML = $likes.outerHTML;
				this.cache.dislikes.outerHTML = $dislikes.outerHTML;
			}
		}
		_on_change( video_id, $likes, $dislikes ) {
			this._clear( $likes );
			this._clear( $dislikes );

			let likes_text = $likes.innerHTML;
			let dislikes_text = $dislikes.innerHTML;

			let likes = $likes.getAttribute( 'aria-label' );
			let dislikes = $dislikes.getAttribute( 'aria-label' );

			if ( !likes && !dislikes ) {
				$likes.innerHTML = likes_text;
				$dislikes.innerHTML = dislikes_text;

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

			$likes.innerHTML = `
				<span class="youtube-likes-percentage">${likes_text}</span>
				<br class="youtube-likes-percentage">
				<span class="youtube-likes-percentage">${likes_prop}%</span>
			`;

			$dislikes.innerHTML = `
				<span class="youtube-likes-percentage">${dislikes_text}</span>
				<br class="youtube-likes-percentage">
				<span class="youtube-likes-percentage">${dislikes_prop}%</span>
			`;
		}
		_clear( $tag ) {
			let $children = $tag.querySelectorAll( '.youtube-likes-percentage' );

			if ( $children.length ) {
				for ( let $child of $children ) {
					$child.remove();
				}
			}

			$children = $tag.querySelectorAll( '.yt-formatted-string' );

			// remove all elements except the last one

			for ( let i = 0, len = $children.length - 2; i <= len; i++ ) {
				$children[ i ].remove();
			}
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