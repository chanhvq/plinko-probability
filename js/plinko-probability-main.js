// Copyright 2014-2016, University of Colorado Boulder

/**
 * Main entry point for the 'Plinko Probability' sim.
 *
 * @author Martin Veillette (Berea College)
 */
define( function( require ) {
  'use strict';

  // modules
  var IntroScreen = require( 'PLINKO_PROBABILITY/intro/IntroScreen' );
  var LabScreen = require( 'PLINKO_PROBABILITY/lab/LabScreen' );
  var Sim = require( 'JOIST/Sim' );
  var SimLauncher = require( 'JOIST/SimLauncher' );

  // strings
  var plinkoProbabilityTitleString = require( 'string!PLINKO_PROBABILITY/plinko-probability.title' );

  var simOptions = {
    credits: {
      leadDesign: 'Michael Dubson, Amanda McGarry',
      softwareDevelopment: 'Martin Veillette, Denzell Barnett,\nChris Malley (PixelZoom, Inc.), Guillermo Ramos-Macias',
      team: 'Karina K. Hensberry, Trish Loeblein, Ariel Paul, Kathy Perkins',
      qualityAssurance: 'Steele Dalton, Amanda Davis, Alex Dornan, Bryce Griebenow, Ben Roberts'
    }
  };

  SimLauncher.launch( function() {
    var sim = new Sim( plinkoProbabilityTitleString, [ new IntroScreen(), new LabScreen() ], simOptions );
    sim.start();
  } );
} );
