package com.glucowise;

import android.support.annotation.NonNull;
import android.util.Log;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Callback;
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

import java.util.Calendar;
import java.util.Date;
import java.util.GregorianCalendar;
import java.util.List;
import java.util.concurrent.TimeUnit;

public class GoogleFitModule extends ReactContextBaseJavaModule {

    private GoogleApiClient mClient;
    private ReactApplicationContext reactContext;
    public static final String NAME = "GoogleFit";
    public static final int REQUEST_OAUTH = 656;
    private final String LOG_TAG = NAME;
    private GoogleFitActivityEventListener activityEventListener;
    private GoogleFitConnectionEventsHandler connectionEventsHandler;

    public GoogleFitModule(ReactApplicationContext reactContext) {
        super(reactContext);
        activityEventListener = new GoogleFitActivityEventListener();
        reactContext.addActivityEventListener(activityEventListener);
        this.reactContext = reactContext;
    }

    @Override
    public String getName() {
        return NAME;
    }

    @ReactMethod
    public void stepsToday(final Callback callback) {
        if (callback != null) {
            long from = todayAt(0, 0, 0, 0).getTime();
            long to = todayAt(23, 59, 59, 999).getTime();
            getStepsData(from, to, TimeUnit.DAYS, new Callback() {
                @Override
                public void invoke(Object... args) {
                    callback.invoke(((WritableMap) args[0]).getArray("steps").getInt(0));
                }
            });
        } else
            Log.e(LOG_TAG, "Callback for stepsToday() was NULL");
    }

    @ReactMethod
    public void stepsTodayInHourBuckets(Callback callback) {
        if (callback != null) {
            long from = todayAt(0, 0, 0, 0).getTime();
            long to = todayAt(23, 59, 59, 999).getTime();
            getStepsData(from, to, TimeUnit.HOURS, callback);
        } else
            Log.e(LOG_TAG, "Callback for stepsTodayInHourBuckets() was NULL");
    }

    @ReactMethod
    public void stepsLast24hInHourBuckets(Callback callback) {
        if (callback != null) {
            long from = hoursAgo(24).getTime();
            long to = hoursAgo(0).getTime();
            getStepsData(from, to, TimeUnit.HOURS, callback);
        } else
            Log.e(LOG_TAG, "Callback for stepsLast24hInHourBuckets() was NULL");
    }

    @ReactMethod
    public void stepsLast60mInMinuteBuckets(Callback callback) {
        if (callback != null) {
            long from = hoursAgo(1).getTime();
            long to = hoursAgo(0).getTime();
            getStepsData(from, to, TimeUnit.MINUTES, callback);
        } else
            Log.e(LOG_TAG, "Callback for stepsLast60mInMinuteBuckets() was NULL");
    }

    @ReactMethod
    public void caloriesExpendedLast24hInHourBuckets(Callback callback) {
        if (callback != null) {
            long from = hoursAgo(24).getTime();
            long to = hoursAgo(0).getTime();
            getCaloriesExpendedData(from, to, TimeUnit.HOURS, callback);
        } else
            Log.e(LOG_TAG, "Callback for caloriesExpendedLast24hInHourBuckets() was NULL");
    }

    @ReactMethod
    public void caloriesExpendedLast60mInMinuteBuckets(Callback callback) {
        if (callback != null) {
            long from = hoursAgo(1).getTime();
            long to = hoursAgo(0).getTime();
            getCaloriesExpendedData(from, to, TimeUnit.MINUTES, callback);
        } else
            Log.e(LOG_TAG, "Callback for caloriesExpendedLast60mInMinuteBuckets() was NULL");
    }


    @ReactMethod
    public void authorizeAndConnect() {
        connectionEventsHandler = new GoogleFitConnectionEventsHandler(getCurrentActivity(), reactContext);
        mClient = new GoogleApiClient.Builder(this.reactContext.getApplicationContext())
                .addApi(Fitness.HISTORY_API)
                .addApi(Fitness.CONFIG_API)
                .addScope(new Scope(Scopes.FITNESS_ACTIVITY_READ_WRITE))
                .addScope(new Scope(Scopes.FITNESS_BODY_READ_WRITE))
                .addConnectionCallbacks(connectionEventsHandler)
                .addOnConnectionFailedListener(connectionEventsHandler)
                .build();
        activityEventListener.setGoogleApiClient(mClient);
        mClient.connect();
    }

    @ReactMethod
    public void disconnect() {
        if (mClient.isConnected()) {
            Fitness.ConfigApi.disableFit(mClient).setResultCallback(new ResultCallback<Status>() {
                @Override
                public void onResult(@NonNull Status status) {
                    Log.i(LOG_TAG, "Google Fit disconnect finished with status: " + status);
                    WritableMap args = Arguments.createMap();
                    args.putBoolean("disconnected", true);
                    connectionEventsHandler.sendEvent(reactContext, "GoogleFitDisconnected", args);
                }
            });
        } else {
            Log.i(LOG_TAG, "Could not disconnect Google Fit, as it is not connected");
        }
    }

    private void getCaloriesExpendedData(long from, long to, final TimeUnit bucketUnit, final Callback callback) {
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
                callback.invoke(data);
            }
        });
    }

    private void getStepsData(long from, long to, final TimeUnit bucketUnit, final Callback callback) {
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
                callback.invoke(data);
            }
        });
    }

    private Date todayAt(int hour, int minute, int second, int millisecond) {
        Calendar today = new GregorianCalendar();
        today.set(Calendar.HOUR_OF_DAY, hour);
        today.set(Calendar.MINUTE, minute);
        today.set(Calendar.SECOND, second);
        today.set(Calendar.MILLISECOND, millisecond);
        return today.getTime();
    }

    private Date hoursAgo(int hours) {
        Calendar today = new GregorianCalendar();
        today.add(Calendar.HOUR, -hours);
        return today.getTime();
    }
}
