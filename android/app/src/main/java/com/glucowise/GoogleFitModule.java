package com.glucowise;

import android.support.annotation.NonNull;
import android.util.Log;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableMap;
import com.google.android.gms.common.Scopes;
import com.google.android.gms.common.api.GoogleApiClient;
import com.google.android.gms.common.api.ResultCallback;
import com.google.android.gms.common.api.Scope;
import com.google.android.gms.common.api.Status;
import com.google.android.gms.fitness.Fitness;
import com.google.android.gms.fitness.data.Bucket;
import com.google.android.gms.fitness.data.DataPoint;
import com.google.android.gms.fitness.data.DataType;
import com.google.android.gms.fitness.data.Field;
import com.google.android.gms.fitness.request.DataReadRequest;
import com.google.android.gms.fitness.result.DataReadResult;

import java.util.List;
import java.util.concurrent.TimeUnit;

import static com.glucowise.DateUtil.hoursAgoMillis;
import static com.glucowise.DateUtil.millisTodayAt;

public class GoogleFitModule extends ReactContextBaseJavaModule {

    private GoogleApiClient mClient;
    private ReactApplicationContext reactContext;
    public static final String NAME = "GoogleFit";
    public static final int REQUEST_OAUTH = 656;
    private final String LOG_TAG = NAME;
    GoogleFitConnectionEventsHandler connectionEventsHandler;
    GoogleFitActivityEventListener activityEventListener;

    public GoogleFitModule(ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;
    }

    @Override
    public String getName() {
        return NAME;
    }

    @ReactMethod
    public void stepsToday(Promise promise) {
        getStepsData(millisTodayAt(0, 0, 0, 0), millisTodayAt(23, 59, 59, 999), TimeUnit.DAYS, promise);
    }

    @ReactMethod
    public void stepsTodayInHourBuckets(Promise promise) {
        getStepsData(millisTodayAt(0, 0, 0, 0), millisTodayAt(23, 59, 59, 999), TimeUnit.HOURS, promise);
    }

    @ReactMethod
    public void stepsLast24hInHourBuckets(Promise promise) {
        getStepsData(hoursAgoMillis(24), hoursAgoMillis(0), TimeUnit.HOURS, promise);
    }

    @ReactMethod
    public void stepsLast60mInMinuteBuckets(Promise promise) {
        getStepsData(hoursAgoMillis(1), hoursAgoMillis(0), TimeUnit.MINUTES, promise);
    }

    @ReactMethod
    public void caloriesExpendedLast24hInHourBuckets(Promise promise) {
        getCaloriesExpendedData(hoursAgoMillis(24), hoursAgoMillis(0), TimeUnit.HOURS, promise);
    }

    @ReactMethod
    public void caloriesExpendedLast60mInMinuteBuckets(Promise promise) {
        getCaloriesExpendedData(hoursAgoMillis(1), hoursAgoMillis(0), TimeUnit.MINUTES, promise);
    }


    @ReactMethod
    public void authorizeAndConnect() {
        Log.i(LOG_TAG, "Authorizing and connecting to GoogleFit");
        constructGoogleApiClient();
        mClient.connect();
    }

    @ReactMethod
    public void disconnect() {
        Log.i(LOG_TAG, "Disconnecting from GoogleFit & clearing permissions, subscriptions, and OAuth cached tokens");
        if (mClient.isConnected()) {
            Fitness.ConfigApi.disableFit(mClient).setResultCallback(new ResultCallback<Status>() {
                @Override
                public void onResult(@NonNull Status status) {
                    Log.i(LOG_TAG, "Google Fit disconnect finished with status: " + status);
                    WritableMap args = Arguments.createMap();
                    args.putBoolean("disconnected", status.isSuccess());
                    GoogleFitConnectionEventsHandler.sendEvent(reactContext, "GoogleFitDisconnected", args);
                }
            });
        } else {
            Log.i(LOG_TAG, "Could not disconnect Google Fit, as it is not connected");
            WritableMap args = Arguments.createMap();
            args.putBoolean("disconnected", false);
            GoogleFitConnectionEventsHandler.sendEvent(reactContext, "GoogleFitDisconnected", args);
        }
    }

    @ReactMethod
    public void isConnected(Promise promise) {
        if (mClient != null)
            promise.resolve(mClient.isConnected());
        else
            promise.resolve(false);
    }

    private void constructGoogleApiClient() {
        if (connectionEventsHandler == null)
            connectionEventsHandler = new GoogleFitConnectionEventsHandler(reactContext);
        if (activityEventListener == null)
            activityEventListener = new GoogleFitActivityEventListener(reactContext);
        reactContext.addActivityEventListener(activityEventListener);
        mClient = new GoogleApiClient.Builder(reactContext.getApplicationContext())
                .addApi(Fitness.HISTORY_API)
                .addApi(Fitness.CONFIG_API)
                .addScope(new Scope(Scopes.FITNESS_ACTIVITY_READ_WRITE))
                .addScope(new Scope(Scopes.FITNESS_BODY_READ_WRITE))
                .addConnectionCallbacks(connectionEventsHandler)
                .addOnConnectionFailedListener(connectionEventsHandler)
                .build();
        activityEventListener.setGoogleApiClient(mClient);
    }

    private void getCaloriesExpendedData(long from, long to, final TimeUnit bucketUnit, final Promise promise) {
        DataReadRequest readRequest = new DataReadRequest.Builder()
                .aggregate(DataType.TYPE_CALORIES_EXPENDED, DataType.AGGREGATE_CALORIES_EXPENDED)
                .setTimeRange(from, to, TimeUnit.MILLISECONDS)
                .bucketByTime(1, bucketUnit)
                .enableServerQueries()
                .build();

        Fitness.HistoryApi.readData(mClient, readRequest).setResultCallback(new ResultCallback<DataReadResult>() {
            @Override
            public void onResult(@NonNull DataReadResult readResult) {
                Log.i(LOG_TAG, "Finished reading expended calories data in " + bucketUnit.toString() + " buckets");
                List<Bucket> buckets = readResult.getBuckets();
                WritableMap data = Arguments.createMap();
                WritableArray calories = Arguments.createArray();
                WritableArray dates = Arguments.createArray();

                for (Bucket bucket : buckets) {
                    List<DataPoint> dataPoints = bucket.getDataSet(DataType.AGGREGATE_CALORIES_EXPENDED).getDataPoints();
                    for (DataPoint dataPoint : dataPoints) {
                        long startTime = dataPoint.getStartTime(TimeUnit.MILLISECONDS);
                        long endTime = dataPoint.getEndTime(TimeUnit.MILLISECONDS);
                        long midwayTime = startTime + (endTime - startTime);

                        calories.pushInt((int) dataPoint.getValue(Field.FIELD_CALORIES).asFloat());
                        dates.pushDouble(midwayTime);
                    }
                }

                data.putArray("calories", calories);
                data.putArray("dates", dates);
                promise.resolve(data);
            }
        });
    }

    private void getStepsData(long from, long to, final TimeUnit bucketUnit, final Promise promise) {
        DataReadRequest readRequest = new DataReadRequest.Builder()
                .aggregate(DataType.TYPE_STEP_COUNT_DELTA, DataType.AGGREGATE_STEP_COUNT_DELTA)
                .setTimeRange(from, to, TimeUnit.MILLISECONDS)
                .bucketByTime(1, bucketUnit)
                .enableServerQueries()
                .build();

        Fitness.HistoryApi.readData(mClient, readRequest).setResultCallback(new ResultCallback<DataReadResult>() {
            @Override
            public void onResult(@NonNull DataReadResult readResult) {
                Log.i(LOG_TAG, "Finished reading steps data in " + bucketUnit.toString() + " buckets");
                List<Bucket> buckets = readResult.getBuckets();
                WritableMap data = Arguments.createMap();
                WritableArray steps = Arguments.createArray();
                WritableArray dates = Arguments.createArray();

                for (Bucket bucket : buckets) {
                    List<DataPoint> dataPoints = bucket.getDataSet(DataType.AGGREGATE_STEP_COUNT_DELTA).getDataPoints();
                    for (DataPoint dataPoint : dataPoints) {
                        long startTime = dataPoint.getStartTime(TimeUnit.MILLISECONDS);
                        long endTime = dataPoint.getEndTime(TimeUnit.MILLISECONDS);
                        long midwayTime = startTime + (endTime - startTime);

                        steps.pushInt(dataPoint.getValue(Field.FIELD_STEPS).asInt());
                        dates.pushDouble(midwayTime);
                    }
                }

                data.putArray("steps", steps);
                data.putArray("dates", dates);
                promise.resolve(data);
            }
        });
    }
}