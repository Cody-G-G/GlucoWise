package com.glucowise;

import java.util.Calendar;
import java.util.GregorianCalendar;

public class DateUtil {
    public static long millisTodayAt(int hour, int minute, int second, int millisecond) {
        Calendar today = new GregorianCalendar();
        today.set(Calendar.HOUR_OF_DAY, hour);
        today.set(Calendar.MINUTE, minute);
        today.set(Calendar.SECOND, second);
        today.set(Calendar.MILLISECOND, millisecond);
        return today.getTime().getTime();
    }

    public static long hoursAgoMillis(int hours) {
        Calendar today = new GregorianCalendar();
        today.add(Calendar.HOUR, -hours);
        return today.getTime().getTime();
    }

    public static long daysAgoMillis(int days) {
        return hoursAgoMillis(24 * days);
    }
}
