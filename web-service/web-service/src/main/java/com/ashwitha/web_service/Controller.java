/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.ashwitha.web_service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.TreeMap;

/**
 *
 * @author WELCOME
 */
@RestController
public class Controller {
    
    @Autowired
    private ActivityRepository repo;
    
    @RequestMapping("/storeActivity")
    public void storeActivity(@RequestParam(value="url") String url, 
                @RequestParam(value="timeSpent") double timeSpent){
        
        Activity current = new Activity(url, timeSpent);
        System.out.println("\n" + current + "\n");
        
        // Save the activity in the DB
        repo.save(current);
    }
    
    @GetMapping("/getAllActivities")
    @ResponseBody
    public TreeMap<String, Double> getActivities() {
        List<Activity> activities = repo.findAll();
        
        // Aggregate the time spent on each website
        TreeMap<String, Double> usage = new TreeMap<>();
        for (Activity activity:activities){
            if (usage.containsKey(activity.getUrl())){
                usage.put(activity.getUrl(), usage.get(activity.getUrl())+activity.getTimeSpent());
            }
            else{
                usage.put(activity.getUrl(), activity.getTimeSpent());
            }
        }
        
        System.out.println("Returned " + usage.size() + " entries!");
        
        return usage;
    }
    
}