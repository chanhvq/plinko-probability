// Copyright 2014-2015, University of Colorado Boulder

/**
 * Scenery node for ball falling through the Galton board.
 *
 * @author Martin Veillette (Berea College)
 */
define( function( require ) {
  'use strict';

  // modules
  var plinkoProbability = require( 'PLINKO_PROBABILITY/plinkoProbability' );
  var BallRepresentationNode = require( 'PLINKO_PROBABILITY/common/view/BallRepresentationNode' );
  var inherit = require( 'PHET_CORE/inherit' );

  /**
   * Constructor for the which renders the ball as a scenery node with listener on the position
   * @param {Property.<Vector2>} positionProperty
   * @param {number} radius - in model coordinates
   * @param {ModelViewTransform2} modelViewTransform - the coordinate transform between model coordinates and view coordinates
   * @constructor
   */
  function BallNode( positionProperty, radius, modelViewTransform ) {

    var ballNode = this;

    BallRepresentationNode.call( this, modelViewTransform.modelToViewDeltaX( radius ) );

    var positionListener = function( position ) {
      ballNode.centerX = modelViewTransform.modelToViewX( position.x );
      ballNode.centerY = modelViewTransform.modelToViewY( position.y );
    };

    positionProperty.link( positionListener );

    this.disposeBallNode = function() {
      positionProperty.unlink( positionListener );
    };
  }

  plinkoProbability.register( 'BallNode', BallNode );

  return inherit( BallRepresentationNode, BallNode, {
    dispose: function() {
      this.disposeBallNode();
    }
  } );
} );