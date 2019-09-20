/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.ashwitha.web_service;

import org.springframework.data.annotation.Id;
import org.bson.types.ObjectId;

/**
 *
 * @author WELCOME
 */
public class Activity {

    @Id
    private ObjectId id;
    
    private String insertedAt;
    private String url;
    private double timeSpent;
    
    public Activity(){
    }
    
    public Activity(String url, double timeSpent){
        this.id = new ObjectId();
        this.insertedAt = java.time.LocalDateTime.now().toString();
        this.url = url;
        this.timeSpent = timeSpent;
    }
    
    public String toString(){
        return "URL: " +  url + " ; Time Spent = " + Double.toString(timeSpent);
    }

    public String getInsertedAt() {
        return insertedAt;
    }

    public void setInsertedAt(String insertedAt) {
        this.insertedAt = insertedAt;
    }

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    public double getTimeSpent() {
        return timeSpent;
    }

    public void setTimeSpent(double timeSpent) {
        this.timeSpent = timeSpent;
    }

    public ObjectId getId() {
        return id;
    }

    public void setId(ObjectId id) {
        this.id = id;
    }
    
}
