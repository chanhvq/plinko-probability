// Copyright 2015-2019, University of Colorado Boulder

/**
 * Scenery Node that displays three Radio Buttons that control the flow of Balls
 *
 * @author Martin Veillette (Berea College)
 */
define( function( require ) {
  'use strict';

  // imports
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var plinkoProbability = require( 'PLINKO_PROBABILITY/plinkoProbability' );
  var Text = require( 'SCENERY/nodes/Text' );
  var VerticalAquaRadioButtonGroup = require( 'SUN/VerticalAquaRadioButtonGroup' );

  // strings
  var ballString = require( 'string!PLINKO_PROBABILITY/ball' );
  var noneString = require( 'string!PLINKO_PROBABILITY/none' );
  var pathString = require( 'string!PLINKO_PROBABILITY/path' );

  // constants
  var LABEL_OPTIONS = { font: new PhetFont( 20 ), maxWidth: 175 };

  /**
   * @param {Property.<string>} hopperModeProperty - see PlinkoProbabilityCommonModel
   * @param {Object} [options]
   * @constructor
   */
  function HopperModeControl( hopperModeProperty, options ) {

    Node.call( this );

    options = _.extend( {
      radioButtonOptions: { radius: 10 },
      spacing: 12, // vertical separation of the buttons
      touchAreaXDilation: 10
    }, options );

    // create the radio buttons
    var showRadioButtons = new VerticalAquaRadioButtonGroup( hopperModeProperty, [
      { node: new Text( ballString, LABEL_OPTIONS ), value: 'ball' },
      { node: new Text( pathString, LABEL_OPTIONS ), value: 'path' },
      { node: new Text( noneString, LABEL_OPTIONS ), value: 'none' }
    ], options );

    this.addChild( showRadioButtons );
  }

  plinkoProbability.register( 'HopperModeControl', HopperModeControl );

  return inherit( Node, HopperModeControl );
} );

