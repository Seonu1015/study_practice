package com.example.ex02;

import android.content.Context;
import android.database.sqlite.SQLiteDatabase;
import android.database.sqlite.SQLiteOpenHelper;

import androidx.annotation.Nullable;

public class DBHelper extends SQLiteOpenHelper {

    public DBHelper(@Nullable Context context) {
        super(context, "product.db", null, 1);
    }

    @Override
    public void onCreate(SQLiteDatabase db) {
        db.execSQL("create table product(_id integer primary key autoincrement, name text, price integer)");
        db.execSQL("insert into product(name, price) values('오징어땅콩', 1000)");
        db.execSQL("insert into product(name, price) values('포테이토칩', 2000)");
        db.execSQL("insert into product(name, price) values('새우깡', 1500)");
        db.execSQL("insert into product(name, price) values('꼬북칩', 2500)");
    }

    @Override
    public void onUpgrade(SQLiteDatabase db, int oldVersion, int newVersion) {
        db.execSQL("drop table if exists product");
        onCreate(db);
    }
}
