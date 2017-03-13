package com.glucowise;

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
import com.google.android.gms.common.api.Scope;
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
    public void stepsToday(Callback callback) {
        long from = todayAt(0, 0, 0, 0).getTime();
        long to = todayAt(23, 59, 59, 999).getTime();
        int steps = getStepsData(from, to, TimeUnit.DAYS).getArray("steps").getInt(0);
        if (callback != null)
            callback.invoke(steps);
        else
            Log.e(LOG_TAG, "Callback for stepsToday() was NULL");
    }

    @ReactMethod
    public void stepsTodayInHourBuckets(Callback callback) {
        long from = todayAt(0, 0, 0, 0).getTime();
        long to = todayAt(23, 59, 59, 999).getTime();
        WritableMap data = getStepsData(from, to, TimeUnit.HOURS);
        if (callback != null)
            callback.invoke(data);
        else
            Log.e(LOG_TAG, "Callback for stepsTodayInHourBuckets() was NULL");
    }

    @ReactMethod
    public void stepsLast24hInHourBuckets(Callback callback) {
        long from = hoursAgo(24).getTime();
        long to = hoursAgo(0).getTime();
        WritableMap data = getStepsData(from, to, TimeUnit.HOURS);
        if (callback != null)
            callback.invoke(data);
        else
            Log.e(LOG_TAG, "Callback for stepsLast24hInHourBuckets() was NULL");
    }

    @ReactMethod
    public void stepsLast60mInMinuteBuckets(Callback callback) {
        long from = hoursAgo(1).getTime();
        long to = hoursAgo(0).getTime();
        WritableMap data = getStepsData(from, to, TimeUnit.MINUTES);
        if (callback != null)
            callback.invoke(data);
        else
            Log.e(LOG_TAG, "Callback for stepsLast60mInMinuteBuckets() was NULL");
    }

    @ReactMethod
    public void caloriesExpendedLast24hInHourBuckets(Callback callback) {
        long from = hoursAgo(24).getTime();
        long to = hoursAgo(0).getTime();
        WritableMap data = getCaloriesExpendedData(from, to, TimeUnit.HOURS);
        if (callback != null)
            callback.invoke(data);
        else
            Log.e(LOG_TAG, "Callback for caloriesExpendedLast24hInHourBuckets() was NULL");
    }

    @ReactMethod
    public void caloriesExpendedLast60mInMinuteBuckets(Callback callback) {
        long from = hoursAgo(1).getTime();
        long to = hoursAgo(0).getTime();
        WritableMap data = getCaloriesExpendedData(from, to, TimeUnit.MINUTES);
        if (callback != null)
            callback.invoke(data);
        else
            Log.e(LOG_TAG, "Callback for caloriesExpendedLast60mInMinuteBuckets() was NULL");
    }


    @ReactMethod
    public void authorizeAndConnect() {
        GoogleFitConnectionEventsHandler connectionEventsHandler = new GoogleFitConnectionEventsHandler(getCurrentActivity(), reactContext);
        mClient = new GoogleApiClient.Builder(this.reactContext.getApplicationContext())
                .addApi(Fitness.HISTORY_API)
                .addScope(new Scope(Scopes.FITNESS_ACTIVITY_READ_WRITE))
                .addScope(new Scope(Scopes.FITNESS_BODY_READ_WRITE))
                .addConnectionCallbacks(connectionEventsHandler)
                .addOnConnectionFailedListener(connectionEventsHandler)
                .build();
        activityEventListener.setGoogleApiClient(mClient);
        mClient.connect();
    }

    private WritableMap getCaloriesExpendedData(long from, long to, TimeUnit bucketUnit) {
        DataReadRequest readRequest = new DataReadRequest.Builder()
                .aggregate(DataType.TYPE_CALORIES_EXPENDED, DataType.AGGREGATE_CALORIES_EXPENDED)
                .setTimeRange(from, to, TimeUnit.MILLISECONDS)
                .bucketByTime(1, bucketUnit)
                .enableServerQueries()
                .build();

        DataReadResult readResult = Fitness.HistoryApi.readData(mClient, readRequest).await(1, TimeUnit.MINUTES);
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

                Log.i(LOG_TAG, "CALORIES: " + (int) dataPoint.getValue(Field.FIELD_CALORIES).asFloat());
                calories.pushInt((int) dataPoint.getValue(Field.FIELD_CALORIES).asFloat());
                dates.pushDouble(midwayTime);
            }
        }

        data.putArray("calories", calories);
        data.putArray("dates", dates);
        return data;
    }

    private WritableMap getStepsData(long from, long to, TimeUnit bucketUnit) {
        DataReadRequest readRequest = new DataReadRequest.Builder()
                .aggregate(DataType.TYPE_STEP_COUNT_DELTA, DataType.AGGREGATE_STEP_COUNT_DELTA)
                .setTimeRange(from, to, TimeUnit.MILLISECONDS)
                .bucketByTime(1, bucketUnit)
                .enableServerQueries()
                .build();

        DataReadResult readResult = Fitness.HistoryApi.readData(mClient, readRequest).await(1, TimeUnit.MINUTES);
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
        return data;
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
