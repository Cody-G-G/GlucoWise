import log from "./../helpers/util/logger";
import {NativeModules, DeviceEventEmitter} from 'react-native';
const googleFit = NativeModules.GoogleFit;

class GoogleFit {

    authorizeAndConnect() {
        googleFit.authorizeAndConnect();
    }

    onConnected(callback) {
        DeviceEventEmitter.addListener('GoogleFitConnected', (args) => {
            callback(args);
        });
    }

    stepsToday(callback) {
        googleFit.stepsToday(callback);
    }

    stepsTodayInHourBuckets(callback) {
        googleFit.stepsTodayInHourBuckets(callback);
    }

    stepsLast24hInHourBuckets(callback) {
        googleFit.stepsLast24hInHourBuckets(callback);
    }

    stepsLast60mInMinuteBuckets(callback) {
        googleFit.stepsLast60mInMinuteBuckets(callback);
    }

    caloriesExpendedLast60mInMinuteBuckets(callback) {
        googleFit.caloriesExpendedLast60mInMinuteBuckets(callback);
    }

    caloriesExpendedLast24hInHourBuckets(callback) {
        googleFit.caloriesExpendedLast24hInHourBuckets(callback);
    }
}

const gFit = new GoogleFit();

// gFit.authorizeAndConnect();
// gFit.onConnected((args) => {
//     log("GoogleFit connected: " + args.connected);
//     gFit.stepsToday((steps) => {
//         log("Steps today: " + steps);
//     });
//     gFit.stepsTodayInHourBuckets((args) => {
//         log("Steps today in hour buckets - steps: " + args.steps + " dates: " + args.dates);
//     });
//     gFit.stepsLast24hInHourBuckets((args) => {
//         log("Steps last 24h in hour buckets - steps: " + args.steps + " dates: " + args.dates);
//     });
//     gFit.stepsLast60mInMinuteBuckets((args) => {
//         log("Steps last 60m in minute buckets - steps: " + args.steps + " dates: " + args.dates);
//     });
//     gFit.caloriesExpendedLast24hInHourBuckets((args) => {
//         log("Calories Expended last 24h in hour buckets - calories: " + args.calories + " dates: " + args.dates);
//     });
//     gFit.caloriesExpendedLast60mInMinuteBuckets((args) => {
//         log("Steps last 60m in minute buckets - calories: " + args.calories + " dates: " + args.dates);
//     });
// });

export default new GoogleFit();

