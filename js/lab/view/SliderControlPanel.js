// Copyright 2014-2015, University of Colorado Boulder

/**
 * Control Panel for the sliders of the rows and binary Probability
 *
 * @author Martin Veillette (Berea College)
 */

define( function( require ) {
  'use strict';

  // modules
  var plinkoProbability = require( 'PLINKO_PROBABILITY/plinkoProbability' );
  var Dimension2 = require( 'DOT/Dimension2' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Panel = require( 'SUN/Panel' );
  var PlinkoConstants = require( 'PLINKO_PROBABILITY/common/PlinkoConstants' );
  var SliderWithReadout = require( 'PLINKO_PROBABILITY/lab/view/SliderWithReadout' );
  var Util = require( 'DOT/Util' );

  // strings
  var rowsString = require( 'string!PLINKO_PROBABILITY/rows' );
  var binaryProbabilityString = require( 'string!PLINKO_PROBABILITY/binaryProbability' );

  /**
   * Constructor for a control panel with two sliders
   * @param {Property.<number>} rowsProperty
   * @param {Property.<number>} binaryProbabilityProperty
   * @param {Object} [options]
   * @constructor
   */
  function SliderControlPanel( rowsProperty, binaryProbabilityProperty, options ) {

    Node.call( this );
    options = _.extend( {
        fill: 'white',
        xMargin: 0,
        yMargin: 8,
        minWidth: 200
      },
      options );

    var rowsSlider = new SliderWithReadout( {
      buttonStep: 1,
      title: rowsString,
      titleFont: PlinkoConstants.PANEL_FONT,
      displayFont: PlinkoConstants.PANEL_READOUT_FONT, // font for the numerical display
      property: rowsProperty,
      range: PlinkoConstants.ROWS_RANGE,
      decimalPlaces: 0,
      slider: {
        trackSize: new Dimension2( 170, 2 ),
        tick: {
          step: PlinkoConstants.ROWS_RANGE.getLength(),
          minText: Util.toFixed( PlinkoConstants.ROWS_RANGE.min, 0 ),
          maxText: Util.toFixed( PlinkoConstants.ROWS_RANGE.max, 0 )
        }
      }
    } );

    var binaryProbabilitySlider = new SliderWithReadout( {
      buttonStep: 0.01,
      title: binaryProbabilityString,
      titleFont: PlinkoConstants.PANEL_FONT,
      displayFont: PlinkoConstants.PANEL_READOUT_FONT, // font for the numerical display
      property: binaryProbabilityProperty,
      range: PlinkoConstants.BINARY_PROBABILITY_RANGE,
      decimalPlaces: 2,
      slider: {
        trackSize: new Dimension2( 170, 2 ),
        tick: {
          step: PlinkoConstants.BINARY_PROBABILITY_RANGE.getLength(),
          minText: Util.toFixed( PlinkoConstants.BINARY_PROBABILITY_RANGE.min, 0 ),
          maxText: Util.toFixed( PlinkoConstants.BINARY_PROBABILITY_RANGE.max, 0 )
        }
      }
    } );

    // layout the two sliders
    rowsSlider.x = 200;
    binaryProbabilitySlider.centerX = rowsSlider.centerX;
    binaryProbabilitySlider.top = rowsSlider.bottom + 25;

    // create and add the panel that contains the two sliders
    var contentPanel = new Node( {
      children: [ rowsSlider, binaryProbabilitySlider ]
    } );
    var panel = new Panel( contentPanel, options );
    this.addChild( panel );

  }

  plinkoProbability.register( 'SliderControlPanel', SliderControlPanel );

  return inherit( Node, SliderControlPanel );
} );
