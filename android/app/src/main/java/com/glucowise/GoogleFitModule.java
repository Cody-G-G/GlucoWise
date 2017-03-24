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

import java.util.HashMap;
import java.util.List;
import java.util.concurrent.TimeUnit;

public class GoogleFitModule extends ReactContextBaseJavaModule {

    private GoogleApiClient mClient;
    private ReactApplicationContext reactContext;
    public static final String NAME = "GoogleFit";
    public static final int REQUEST_OAUTH = 656;
    private final String LOG_TAG = NAME;
    GoogleFitConnectionEventsHandler connectionEventsHandler;
    GoogleFitActivityEventListener activityEventListener;
    HashMap<String, TimeUnit> timeUnits;

    public GoogleFitModule(ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;
        this.timeUnits = new HashMap<>();
        for (TimeUnit unit : TimeUnit.values()) {
            timeUnits.put(unit.name(), unit);
        }
    }

    @Override
    public String getName() {
        return NAME;
    }

    @ReactMethod
    public void steps(Double from, Double to, int bucketDuration, String bucketUnit, Promise promise) {
        getStepsData(from.longValue(), to.longValue(), bucketDuration, timeUnits.get(bucketUnit.toUpperCase()), promise);
    }

    @ReactMethod
    public void caloriesExpended(Double from, Double to, int bucketDuration, String bucketUnit, Promise promise) {
        getCaloriesExpendedData(from.longValue(), to.longValue(), bucketDuration, timeUnits.get(bucketUnit.toUpperCase()), promise);
    }

    @ReactMethod
    public void weight(Double from, Double to, int bucketDuration, String bucketUnit, Promise promise) {
        getWeightData(from.longValue(), to.longValue(), bucketDuration, timeUnits.get(bucketUnit.toUpperCase()), promise);
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

    private void getCaloriesExpendedData(long from, long to, int bucketDuration, final TimeUnit bucketUnit, final Promise promise) {
        DataReadRequest readRequest = constructDataReadRequest(from, to, bucketDuration, bucketUnit, DataType.TYPE_CALORIES_EXPENDED, DataType.AGGREGATE_CALORIES_EXPENDED);
        resolvePromiseWithReadData(readRequest, promise, DataType.AGGREGATE_CALORIES_EXPENDED, Field.FIELD_CALORIES);
    }

    private void getStepsData(long from, long to, int bucketDuration, final TimeUnit bucketUnit, final Promise promise) {
        DataReadRequest readRequest = constructDataReadRequest(from, to, bucketDuration, bucketUnit, DataType.TYPE_STEP_COUNT_DELTA, DataType.AGGREGATE_STEP_COUNT_DELTA);
        resolvePromiseWithReadData(readRequest, promise, DataType.AGGREGATE_STEP_COUNT_DELTA, Field.FIELD_STEPS);
    }

    private void getWeightData(long from, long to, int bucketDuration, final TimeUnit bucketUnit, final Promise promise) {
        DataReadRequest readRequest = constructDataReadRequest(from, to, bucketDuration, bucketUnit, DataType.TYPE_WEIGHT, DataType.AGGREGATE_WEIGHT_SUMMARY);
        resolvePromiseWithReadData(readRequest, promise, DataType.AGGREGATE_WEIGHT_SUMMARY, Field.FIELD_AVERAGE);
    }

    private DataReadRequest constructDataReadRequest(long from, long to, int bucketDuration, TimeUnit bucketUnit, DataType dataSource, DataType outputDataType) {
        return new DataReadRequest.Builder()
                .aggregate(dataSource, outputDataType)
                .setTimeRange(from, to, TimeUnit.MILLISECONDS)
                .bucketByTime(bucketDuration, bucketUnit)
                .enableServerQueries()
                .build();
    }

    private void resolvePromiseWithReadData(final DataReadRequest readRequest, final Promise promise, final DataType outputDataType, final Field dataPointField) {
        if (mClient == null) promise.reject("GoogleClientAPI not initialized.");
        else {
            Fitness.HistoryApi.readData(mClient, readRequest).setResultCallback(new ResultCallback<DataReadResult>() {
                @Override
                public void onResult(@NonNull DataReadResult readResult) {
                    Log.i(LOG_TAG, "Finished reading " + dataPointField.getName() + " data");

                    List<Bucket> buckets = readResult.getBuckets();
                    WritableMap data = Arguments.createMap();
                    WritableArray values = Arguments.createArray();
                    WritableArray dates = Arguments.createArray();

                    for (Bucket bucket : buckets) {
                        List<DataPoint> dataPoints = bucket.getDataSet(outputDataType).getDataPoints();
                        for (DataPoint dataPoint : dataPoints) {

                            int value = 0;
                            switch (dataPoint.getValue(dataPointField).getFormat()) {
                                case Field.FORMAT_FLOAT:
                                    value = (int) dataPoint.getValue(dataPointField).asFloat();
                                    break;
                                case Field.FORMAT_INT32:
                                    value = dataPoint.getValue(dataPointField).asInt();
                                    break;
                            }

                            if (value != 0) {
                                values.pushInt(value);
                                dates.pushDouble(dataPoint.getStartTime(TimeUnit.MILLISECONDS));
                            }
                        }
                    }

                    data.putArray("values", values);
                    data.putArray("dates", dates);
                    promise.resolve(data);
                }
            });
        }
    }
}