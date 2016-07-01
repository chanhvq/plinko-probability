// Copyright 2014-2015, University of Colorado Boulder

/**
 * Model for Plinko Probability Lab
 *
 * @author Martin Veillette (Berea College)
 */

define( function( require ) {
  'use strict';

  // modules
  var LabBall = require( 'PLINKO_PROBABILITY/lab/model/LabBall' );
  var inherit = require( 'PHET_CORE/inherit' );
  var PlinkoProbabilityCommonModel = require( 'PLINKO_PROBABILITY/common/model/PlinkoProbabilityCommonModel' );
  var plinkoProbability = require( 'PLINKO_PROBABILITY/plinkoProbability' );

  // constants
  var MAX_NUMBER_BALLS = 9999; // max number of balls per bin

  // creates query parameter that lowers the maximum amount of balls for testing purposes.
  if ( phet.chipper.getQueryParameter( 'lowerBallMaximum' ) ) {
    MAX_NUMBER_BALLS = 25;
  }

  /**
   * Main model of the second tab (lab tab) of the plinko probability simulation
   * @constructor
   */
  function PlinkoProbabilityLabModel() {

    var thisModel = this;

    PlinkoProbabilityCommonModel.call( this );

    this.addProperty( 'isPlaying', false );
    this.addProperty( 'galtonBoardRadioButton', 'ball' );  // acceptable values are 'ball', 'path, 'none'


    // These need to be linked until the end of the simulation
    this.galtonBoardRadioButtonProperty.link( function() {
      // when the balls gets created it adds itself to the histogram
      // so when we clear the balls we should remove them from the histogram
      thisModel.balls.forEach( function( ball ) {
        thisModel.histogram.bins[ ball.binIndex ].binCount--;
      } );

      // remove all the balls 
      thisModel.balls.clear(); // clear the balls
    } );

    this.probabilityProperty.link( function() {
      thisModel.balls.clear(); // clear the balls
      thisModel.histogram.reset(); // reset histogram statistics
      thisModel.isBallCapReached = false;
    } );

    this.numberOfRowsProperty.link( function() {
      thisModel.balls.clear();
      thisModel.histogram.reset();
      thisModel.isBallCapReached = false;
    } );

    this.ballCreationTimeInterval = 0; // time we want to pass before we created a new ball
  }

  plinkoProbability.register( 'PlinkoProbabilityLabModel', PlinkoProbabilityLabModel );

  return inherit( PlinkoProbabilityCommonModel, PlinkoProbabilityLabModel, {
    /**
     * time step function that is  responsible for creating and updating the position and status of the balls
     * @public
     * @param {number} dt
     */
    step: function( dt ) {
      this.ballCreationTimeElapsed += dt; // we don't want balls to drop too quickly so we keep track of the interval
      if ( this.isPlaying && this.ballCreationTimeElapsed > this.ballCreationTimeInterval ) { // if the play button is pressed and the interval is greater than some interval
        this.addNewBall(); // add a new ball
        this.ballCreationTimeElapsed = 0; // reset the elapsed time
      }

      switch( this.galtonBoardRadioButton ) {
        case 'ball':
          this.balls.forEach( function( ball ) {
            // we want to cap dt fairly low so that the balls don't make a sudden jump
            ball.step( Math.min( 0.090, dt * 10 ) ); // 90 milliseconds is the highest dt will be
          } );
          this.ballCreationTimeInterval = 0.100; // 100 milliseconds if we are seeing balls
          break;
        case 'path':
          this.balls.forEach( function( ball ) {
            ball.updateStatisticsAndLand();
          } );
          this.ballCreationTimeInterval = 0.050; // 50 milliseconds if we are seeing paths
          break;
        case 'none':
          this.balls.forEach( function( ball ) {
            ball.updateStatisticsAndLand();
          } );
          this.ballCreationTimeInterval = 0.015; // 15 milliseconds if nothing is being shown
          break;
        default:
          throw new Error( 'Unhandled galton Board Radio Button state: ' + this.galtonBoardRadioButton );
      }

    },

    /**
     * Add a new Ball to the model
     * @private
     */
    addNewBall: function() {
      var thisModel = this;
      var addedBall = new LabBall( this.probability, this.numberOfRows, this.histogram.bins );
      this.histogram.bins[ addedBall.binIndex ].binCount++; //update the bin count of the bins
      this.balls.push( addedBall ); // add the ball to the observable array
      if ( thisModel.histogram.getMaximumActualBinCount() >= MAX_NUMBER_BALLS ) {
        thisModel.isBallCapReached = true;
      }
      addedBall.on( 'exited', function() {
        thisModel.histogram.addBallToHistogram( addedBall );
      } );
      // when the ball lands remove the one that came before it
      addedBall.on( 'landed', function() {
        var previousBallIndex = thisModel.balls.indexOf( addedBall ) - 1; // gets the index of the ball before
        if ( previousBallIndex > -1 ) {
          var previousBall = thisModel.balls.get( previousBallIndex ); // gets the last ball object
          thisModel.balls.remove( previousBall ); //removes the previous ball
        }
      } );

    },

    /**
     * Function that returns the theoretical average of the binomial distribution
     * @param {number} numberOfRows - an integer
     * @param {number} probability - ranges from 0 to 1
     * @returns {number}
     * @public (read-only)
     */
    getTheoreticalAverage: function( numberOfRows, probability ) {
      assert && assert( numberOfRows % 1 === 0, 'number of rows should be an integer' );
      return numberOfRows * probability;
    },

    /**
     * Function that calculates the theoretical standard deviation of the binomial distribution
     * @param {number} numberOfRows - an integer
     * @param {number} probability - ranges from 0 to 1
     * @returns {number}
     * @public (read-only)
     */
    getTheoreticalStandardDeviation: function( numberOfRows, probability ) {
      assert && assert( numberOfRows % 1 === 0, 'number of rows should be an integer' );
      return Math.sqrt( numberOfRows * probability * (1 - probability) );
    },


    /**
     * Function that returns the binomial coefficient, equivalent to (in Latex) ${n\choose k}$
     * usually expressed as "n choose k". It is the coefficient of the x^k term in the polynomial
     * expansion of the binomial power (1 + x)^n. It is related to the Pascal triangle.
     *
     * see http://en.wikipedia.org/wiki/Binomial_coefficient
     *
     * @param {number} n - the number of rows
     * @param {number} k - the bin number
     * @returns {number}  "n choose k"= n!/( k! (n-k)!)
     * @private
     */
    getBinomialCoefficient: function( n, k ) {
      // we want (n)*(n-1)*(n-2)..(n-k+1) divided by (k)*(k-1)*(k-2)...*2*1
      var coefficient = 1;
      var i;
      for ( i = n - k + 1; i <= n; i++ ) {
        coefficient *= i;
      }
      for ( i = 1; i <= k; i++ ) {
        coefficient /= i;
      }
      return coefficient;
    },

    /**
     * Function that returns the theoretical probability that a ball in in a galton box with 'n' rows (or layers)
     * ends up in the bin number 'k' given the success  probability of every event is 'p'.
     *
     * see http://en.wikipedia.org/wiki/Binomial_distribution
     *
     * @param {number} n - the number of rows, must be an integer > 0
     * @param {number} k - the bin number - an integer between 0 and n
     * @param {number} p - the success (a.k.a binary) probability, a number between 0 and 1
     * @returns {number} P(n,k,p)= ("n choose k") * p^k * p^(n-k)
     * @private
     */
    getBinomialProbability: function( n, k, p ) {
      assert && assert( k <= n, 'the bin number, k, ranges from 0 to n' );
      var binomialCoefficient = this.getBinomialCoefficient( n, k );
      var statisticalWeight = Math.pow( p, k ) * Math.pow( 1 - p, n - k );
      return binomialCoefficient * statisticalWeight;
    },

    /**
     *  Function that returns the theoretical probabilities of the binomial distribution
     *  i.e. P(n,k,p) of a binomial distribution in array form
     *
     *  see http://en.wikipedia.org/wiki/Binomial_distribution
     *
     * @returns {Array.<number>}
     * @private
     */
    getBinomialDistribution: function() {
      var binomialCoefficientsArray = [];
      var k;
      // let's not try to be clever and let's go forward with the brute force approach
      for ( k = 0; k < this.numberOfRows + 1; k++ ) {
        binomialCoefficientsArray.push( this.getBinomialProbability( this.numberOfRows, k, this.probability ) );
      }
      return binomialCoefficientsArray;
    },

    /**
     *  Function that returns the theoretical probabilities of the binomial distribution
     *  i.e. P(n,k,p) of a binomial distribution in array form
     *  The binomial distribution is normalized in the sense that the largest coefficient of the array will be one.
     *
     * @returns {Array.<number>}
     * @public (read-only)
     */
    getNormalizedBinomialDistribution: function() {
      var binomialCoefficientsArray = this.getBinomialDistribution();
      var maxCoefficient = _.max( binomialCoefficientsArray );
      var normalizedArray = binomialCoefficientsArray.map( function( num ) {
        return num / maxCoefficient;
      } ); // fraction is smaller than one
      return normalizedArray;
    }
  } );
} );



