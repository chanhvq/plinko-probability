// Copyright 2015, University of Colorado Boulder

/**
 * View representation of the front cylinders (the side part of the cylinder) used within the Plinko Probability Simulation
 */
define( function( require ) {
  'use strict';

  // modules
  var plinkoProbability = require( 'PLINKO_PROBABILITY/plinkoProbability' );
  var BinInterface = require( 'PLINKO_PROBABILITY/common/model/BinInterface' );
  var inherit = require( 'PHET_CORE/inherit' );
  var LinearGradient = require( 'SCENERY/util/LinearGradient' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Path = require( 'SCENERY/nodes/Path' );
  var PlinkoConstants = require( 'PLINKO_PROBABILITY/common/PlinkoConstants' );
  var Shape = require( 'KITE/Shape' );

  /**
   *
   * @param {Property.<number>} numberOfRowsProperty
   * @param {ModelViewTransform2} modelViewTransform
   * @param {Object} cylinderInfo - Contains cylinder info: height, width, offset, ellipseHeight
   * @constructor
   */
  function CylindersFrontNode( numberOfRowsProperty, modelViewTransform, cylinderInfo ) {

    Node.call( this );

    // convenience variable for placing the object inn the view
    var ellipseWidth = modelViewTransform.modelToViewDeltaX( cylinderInfo.cylinderWidth );
    var ellipseHeight = Math.abs( modelViewTransform.modelToViewDeltaY( cylinderInfo.ellipseHeight ) );
    var cylinderHeight = Math.abs( modelViewTransform.modelToViewDeltaY( cylinderInfo.height ) );
    var verticalOffset = -modelViewTransform.modelToViewDeltaY( cylinderInfo.verticalOffset );

    // create side shape of the cylinder
    var sideShape = new Shape();
    sideShape.moveTo( -ellipseWidth / 2, 0 )
      .lineTo( -ellipseWidth / 2, cylinderHeight )
      .ellipticalArc( 0, 0, ellipseWidth / 2, ellipseHeight / 2, 0, Math.PI, 0, true )
      .lineTo( ellipseWidth / 2, 0 )
      .ellipticalArc( 0, cylinderHeight, ellipseWidth / 2, ellipseHeight / 2, 0, 0, Math.PI, false )
      .close();

    // create the linear fill gradient for the cylinder
    var sideFill = new LinearGradient( -ellipseWidth / 2, 0, ellipseWidth / 2, 0 ).addColorStop( 0.0, PlinkoConstants.CYLINDER_BASE_COLOR.colorUtilsDarker( 0.7 ) ).addColorStop( 0.5, PlinkoConstants.CYLINDER_BASE_COLOR ).addColorStop( 1, PlinkoConstants.CYLINDER_BASE_COLOR.colorUtilsBrighter( 0.5 ) );

    var sideLayerNode = new Node();
    this.addChild( sideLayerNode );
    
    // link is present for the lifetime of the sim
    numberOfRowsProperty.link( function( numberOfRows ) {
      var numberOfTicks = numberOfRows + 1;
      for ( var i = 0; i < numberOfTicks; i++ ) {
        var binCenterX = BinInterface.getBinCenterX( i, numberOfTicks );
        var x = modelViewTransform.modelToViewX( binCenterX );
        var y = modelViewTransform.modelToViewY( cylinderInfo.top );

        // create and add the path for side of the cylinder
        var side = new Path( sideShape, {
          fill: sideFill,
          stroke: PlinkoConstants.SIDE_CYLINDER_STROKE_COLOR,
          centerX: x,
          top: y + verticalOffset + ellipseHeight / 2
        } );
        sideLayerNode.addChild( side );
      }
    } );

  }

  plinkoProbability.register( 'CylindersFrontNode', CylindersFrontNode );

  return inherit( Node, CylindersFrontNode );
} );