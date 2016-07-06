// Copyright 2015, University of Colorado Boulder

/**
 * View representation of the top portion of the row of cylinders
 * it is the back portion of the cylinder from the viewpoint of the z-layer
 * used within the Plinko Probability Simulation
 *
 * @author Martin Veillette (Berea College)
 */

define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Path = require( 'SCENERY/nodes/Path' );
  var PlinkoConstants = require( 'PLINKO_PROBABILITY/common/PlinkoConstants' );
  var plinkoProbability = require( 'PLINKO_PROBABILITY/plinkoProbability' );
  var Shape = require( 'KITE/Shape' );

  // constants
  var BOUNDS = PlinkoConstants.HISTOGRAM_BOUNDS;

  /**
   * Creation of top of cylinder
   * @param {Property.<number>} numberOfRowsProperty
   * @param {ModelViewTransform2} modelViewTransform
   * @param {Object} cylinderInfo - Contains cylinder info: height, width, offset, ellipseHeight
   * @constructor
   */
  function CylindersBackNode( numberOfRowsProperty, modelViewTransform, cylinderInfo ) {

    Node.call( this );

    var thisNode = this;

    // convenience variables
    var ellipseWidth = modelViewTransform.modelToViewDeltaX( cylinderInfo.cylinderWidth );
    var ellipseHeight = Math.abs( modelViewTransform.modelToViewDeltaY( cylinderInfo.ellipseHeight ) );
    var verticalOffset = -modelViewTransform.modelToViewDeltaY( cylinderInfo.verticalOffset );

    // create the shape for the top of the cylinder
    var topShape = Shape.ellipse( 0, 0, ellipseWidth / 2, ellipseHeight / 2 );

    // link present for the lifetime of the sim, no need to dispose
    numberOfRowsProperty.link( function( numberOfRows ) {
      assert && assert( Number.isInteger( numberOfRows ), 'numberOfRows must be an integer' );

      var numberOfCylinders = numberOfRows + 1;
      for ( var i = 0; i < numberOfCylinders; i++ ) {
        // create and add the top of the cylinders containers
        var binCenterX = thisNode.getBinCenterX( i, numberOfCylinders );
        var x = modelViewTransform.modelToViewX( binCenterX );          // x-coordinate of bin in model units
        var y = modelViewTransform.modelToViewY( cylinderInfo.top );    // y-coordinate of bin in model units
        var top = new Path( topShape, {
          fill: PlinkoConstants.TOP_CYLINDER_FILL_COLOR,
          stroke: PlinkoConstants.TOP_CYLINDER_STROKE_COLOR,
          centerX: x,
          top: y + verticalOffset
        } );
        thisNode.addChild( top );
      }
    } );

  }

  plinkoProbability.register( 'CylindersBackNode', CylindersBackNode );

  return inherit( Node, CylindersBackNode, {

      /**
       * Function that returns the center x coordinate of a bin with index binIndex
       * @public (read-only)
       * @param {number} binIndex - index associated with the bin, the index may range from 0 to numberOfBins-1
       * @param {number} numberOfBins - the number of bins on the screen
       * @returns {number}
       */
      getBinCenterX: function( binIndex, numberOfBins ) {
        // We consider numberOfBins-1 because we consider the most left bin the first bin out of the total number of bins
        assert && assert( binIndex <= numberOfBins - 1 );
        return ((binIndex + 1 / 2) / numberOfBins) * BOUNDS.width + BOUNDS.minX;
      }
    }
  );
} );